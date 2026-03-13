interface GoogleUserInfo {
  id: string;
  email: string;
  name: string;
  picture: string;
}

interface GoogleDriveFile {
  id: string;
  name: string;
  modifiedTime: string;
}

interface CalendarEvent {
  id: string;
  summary: string;
  description?: string;
  start: { dateTime?: string; date?: string };
  end: { dateTime?: string; date?: string };
  location?: string;
  htmlLink: string;
}

interface GoogleOAuthTokenResponse {
  access_token: string;
  expires_in: number;
  refresh_token?: string;
  scope: string;
  token_type: string;
  error?: string;
}

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

interface TokenClient {
  requestAccessToken: (options?: { prompt?: string }) => void;
  callback: (response: GoogleOAuthTokenResponse) => void;
}

const SCOPES = [
  'https://www.googleapis.com/auth/userinfo.profile',
  'https://www.googleapis.com/auth/userinfo.email',
  'https://www.googleapis.com/auth/drive.file',
  'https://www.googleapis.com/auth/calendar.events',
].join(' ');

const STORAGE_KEY = 'google_oauth_token';

class GoogleOAuthService {
  private accessToken: string | null = null;
  private tokenClient: TokenClient | null = null;

  constructor() {
    this.loadTokenFromStorage();
  }

  private loadTokenFromStorage(): void {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const tokenData = JSON.parse(stored);
        if (tokenData.expiry > Date.now()) {
          this.accessToken = tokenData.accessToken;
        } else {
          localStorage.removeItem(STORAGE_KEY);
        }
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }

  private saveTokenToStorage(accessToken: string, expiresIn: number): void {
    const expiry = Date.now() + expiresIn * 1000;
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ accessToken, expiry }));
    this.accessToken = accessToken;
  }

  isInitialized(): boolean {
    return !!GOOGLE_CLIENT_ID;
  }

  isConnected(): boolean {
    return !!this.accessToken;
  }

  getClientId(): string {
    return GOOGLE_CLIENT_ID;
  }

  async initialize(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!GOOGLE_CLIENT_ID) {
        reject(new Error('Google Client ID não configurado'));
        return;
      }

      if (typeof window === 'undefined' || !(window as any).google) {
        reject(new Error('Google SDK não carregado'));
        return;
      }

      const google = (window as any).google;
      this.tokenClient = google.accounts.oauth2.initTokenClient({
        client_id: GOOGLE_CLIENT_ID,
        scope: SCOPES,
        callback: (response: GoogleOAuthTokenResponse) => {
          if (response.access_token) {
            this.saveTokenToStorage(response.access_token, response.expires_in);
            resolve();
          } else if (response.error) {
            reject(new Error(response.error));
          }
        },
      });
    });
  }

  async connect(): Promise<void> {
    if (!this.tokenClient) {
      await this.initialize();
    }
    return new Promise((resolve, reject) => {
      if (!this.tokenClient) {
        reject(new Error('Google OAuth não inicializado'));
        return;
      }

      this.tokenClient.callback = (response: GoogleOAuthTokenResponse) => {
        if (response.access_token) {
          this.saveTokenToStorage(response.access_token, response.expires_in);
          resolve();
        } else if (response.error) {
          reject(new Error(response.error));
        }
      };

      this.tokenClient.requestAccessToken({ prompt: 'consent' });
    });
  }

  disconnect(): void {
    this.accessToken = null;
    localStorage.removeItem(STORAGE_KEY);
    const google = (window as any).google;
    if (google?.accounts?.id) {
      google.accounts.id.disableAutoSelect();
    }
  }

  async getUserInfo(): Promise<GoogleUserInfo> {
    if (!this.accessToken) {
      throw new Error('Não conectado ao Google');
    }

    const response = await fetch('https://www.googleapis.com/oauth2/v2/userinfo?alt=json', {
      headers: { Authorization: `Bearer ${this.accessToken}` },
    });

    if (!response.ok) {
      throw new Error('Erro ao obter informações do usuário');
    }

    return response.json();
  }

  async uploadToDrive(data: object, fileName: string): Promise<GoogleDriveFile> {
    if (!this.accessToken) {
      throw new Error('Não conectado ao Google');
    }

    const boundary = '-------314159265358979323846';
    const delimiter = `\r\n--${boundary}\r\n`;
    const closeDelimiter = `\r\n--${boundary}--`;

    const metadata = {
      name: fileName,
      mimeType: 'application/json',
    };

    const multipartBody =
      delimiter +
      'Content-Type: application/json\r\n\r\n' +
      JSON.stringify(metadata) +
      delimiter +
      'Content-Type: application/json\r\n\r\n' +
      JSON.stringify(data) +
      closeDelimiter;

    const response = await fetch(
      'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
          'Content-Type': `multipart/related; boundary="${boundary}"`,
        },
        body: multipartBody,
      }
    );

    if (!response.ok) {
      throw new Error('Erro ao fazer upload para Google Drive');
    }

    const result = await response.json();
    return {
      id: result.id,
      name: fileName,
      modifiedTime: new Date().toISOString(),
    };
  }

  async listBackupFiles(): Promise<GoogleDriveFile[]> {
    if (!this.accessToken) {
      throw new Error('Não conectado ao Google');
    }

    const response = await fetch(
      'https://www.googleapis.com/drive/v3/files?' +
        new URLSearchParams({
          q: "name contains 'bibleapppro-backup' and trashed = false",
          fields: 'files(id, name, modifiedTime)',
          orderBy: 'modifiedTime desc',
        }),
      {
        headers: { Authorization: `Bearer ${this.accessToken}` },
      }
    );

    if (!response.ok) {
      throw new Error('Erro ao listar arquivos');
    }

    const result = await response.json();
    return result.files || [];
  }

  async downloadFromDrive(fileId: string): Promise<object> {
    if (!this.accessToken) {
      throw new Error('Não conectado ao Google');
    }

    const response = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`, {
      headers: { Authorization: `Bearer ${this.accessToken}` },
    });

    if (!response.ok) {
      throw new Error('Erro ao baixar arquivo');
    }

    return response.json();
  }

  async deleteFromDrive(fileId: string): Promise<void> {
    if (!this.accessToken) {
      throw new Error('Não conectado ao Google');
    }

    const response = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${this.accessToken}` },
    });

    if (!response.ok) {
      throw new Error('Erro ao excluir arquivo');
    }
  }

  async createCalendarEvent(event: {
    title: string;
    description?: string;
    startTime: string;
    endTime: string;
    location?: string;
  }): Promise<CalendarEvent> {
    if (!this.accessToken) {
      throw new Error('Não conectado ao Google');
    }

    const response = await fetch(
      'https://www.googleapis.com/calendar/v3/calendars/primary/events',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          summary: event.title,
          description: event.description,
          location: event.location,
          start: {
            dateTime: event.startTime,
            timeZone: 'America/Sao_Paulo',
          },
          end: {
            dateTime: event.endTime,
            timeZone: 'America/Sao_Paulo',
          },
        }),
      }
    );

    if (!response.ok) {
      throw new Error('Erro ao criar evento');
    }

    return response.json();
  }

  async listCalendarEvents(maxResults: number = 5): Promise<CalendarEvent[]> {
    if (!this.accessToken) {
      throw new Error('Não conectado ao Google');
    }

    const response = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/primary/events?` +
        new URLSearchParams({
          maxResults: maxResults.toString(),
          orderBy: 'startTime',
          singleEvents: 'true',
          timeMin: new Date().toISOString(),
        }),
      {
        headers: { Authorization: `Bearer ${this.accessToken}` },
      }
    );

    if (!response.ok) {
      throw new Error('Erro ao listar eventos');
    }

    const result = await response.json();
    return result.items || [];
  }
}

export const googleOAuth = new GoogleOAuthService();
export type { GoogleUserInfo, GoogleDriveFile, CalendarEvent };
