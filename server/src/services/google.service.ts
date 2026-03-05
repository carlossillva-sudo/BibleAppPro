import crypto from 'crypto';
import { google } from 'googleapis';

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '';
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || '';
const GOOGLE_REDIRECT_URI =
  process.env.GOOGLE_REDIRECT_URI || 'http://localhost:3000/api/google/callback';

const SCOPES = [
  'https://www.googleapis.com/auth/drive.file',
  'https://www.googleapis.com/auth/calendar.events',
  'https://www.googleapis.com/auth/userinfo.email',
  'https://www.googleapis.com/auth/userinfo.profile',
];

export interface GoogleTokens {
  access_token: string;
  refresh_token: string;
  scope: string;
  token_type: string;
  expiry_date: number;
}

export interface GoogleUserInfo {
  id: string;
  email: string;
  name: string;
  picture?: string;
}

interface OAuth2Client {
  generateAuthUrl(options: any): string;
  getToken(code: string): Promise<{ tokens: any }>;
  setCredentials(tokens: any): void;
}

interface GoogleOAuth2 {
  new (clientId: string, clientSecret: string, redirectUri: string): OAuth2Client;
}

interface Googleapis {
  oauth2: any;
  calendar: any;
  drive: any;
}

class GoogleService {
  private OAuth2: GoogleOAuth2;
  private google: Googleapis;

  constructor() {
    this.google = google;
    this.OAuth2 = google.auth.OAuth2;
  }

  private getOAuth2Client(tokens?: GoogleTokens): OAuth2Client {
    const client = new this.OAuth2(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI);
    if (tokens) {
      client.setCredentials(tokens);
    }
    return client;
  }

  getAuthUrl(): string {
    const client = this.getOAuth2Client();
    return client.generateAuthUrl({
      access_type: 'offline',
      scope: SCOPES,
      prompt: 'consent',
      state: crypto.randomBytes(16).toString('hex'),
    });
  }

  async getTokensFromCode(code: string): Promise<GoogleTokens> {
    const client = this.getOAuth2Client();
    const { tokens } = await client.getToken(code);
    return tokens as GoogleTokens;
  }

  async getUserInfo(tokens: GoogleTokens): Promise<GoogleUserInfo> {
    const auth = this.getOAuth2Client(tokens);
    const oauth2 = this.google.oauth2({ version: 'v2', auth });
    const { data } = await oauth2.userinfo.get();
    return {
      id: data.id || '',
      email: data.email || '',
      name: data.name || '',
      picture: data.picture || undefined,
    };
  }

  async uploadToDrive(
    tokens: GoogleTokens,
    fileName: string,
    content: string,
    mimeType: string = 'application/json'
  ): Promise<{ fileId: string; webViewLink: string }> {
    const auth = this.getOAuth2Client(tokens);
    const drive = this.google.drive({ version: 'v3', auth });

    const fileMetadata = {
      name: fileName,
      parents: ['root'],
    };

    const media = {
      mimeType,
      body: content,
    };

    const file = await drive.files.create({
      requestBody: fileMetadata,
      media,
      fields: 'id, webViewLink',
    });

    return {
      fileId: file.data.id || '',
      webViewLink: file.data.webViewLink || '',
    };
  }

  async listBackupFiles(
    tokens: GoogleTokens
  ): Promise<{ id: string; name: string; modifiedTime: string }[]> {
    const auth = this.getOAuth2Client(tokens);
    const drive = this.google.drive({ version: 'v3', auth });

    const response = await drive.files.list({
      q: "name contains 'bibleapppro-backup' and trashed = false",
      fields: 'files(id, name, modifiedTime)',
      orderBy: 'modifiedTime desc',
    });

    return (
      response.data.files?.map((file: any) => ({
        id: file.id || '',
        name: file.name || '',
        modifiedTime: file.modifiedTime || '',
      })) || []
    );
  }

  async downloadFromDrive(tokens: GoogleTokens, fileId: string): Promise<string> {
    const auth = this.getOAuth2Client(tokens);
    const drive = this.google.drive({ version: 'v3', auth });

    const response = await drive.files.get({
      fileId,
      alt: 'media',
    });

    return response.data as string;
  }

  async deleteFromDrive(tokens: GoogleTokens, fileId: string): Promise<void> {
    const auth = this.getOAuth2Client(tokens);
    const drive = this.google.drive({ version: 'v3', auth });

    await drive.files.delete({ fileId });
  }

  async createCalendarEvent(
    tokens: GoogleTokens,
    event: {
      title: string;
      description?: string;
      startTime: Date;
      endTime: Date;
      location?: string;
    }
  ): Promise<{ eventId: string; htmlLink: string }> {
    const auth = this.getOAuth2Client(tokens);
    const calendar = this.google.calendar({ version: 'v3', auth });

    const calendarEvent = {
      summary: event.title,
      description: event.description,
      location: event.location,
      start: {
        dateTime: event.startTime.toISOString(),
        timeZone: 'America/Sao_Paulo',
      },
      end: {
        dateTime: event.endTime.toISOString(),
        timeZone: 'America/Sao_Paulo',
      },
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'popup', minutes: 30 },
          { method: 'email', minutes: 60 },
        ],
      },
    };

    const response = await calendar.events.insert({
      calendarId: 'primary',
      requestBody: calendarEvent,
    });

    return {
      eventId: response.data.id || '',
      htmlLink: response.data.htmlLink || '',
    };
  }

  async listCalendarEvents(
    tokens: GoogleTokens,
    maxResults: number = 10
  ): Promise<{ id: string; summary: string; start: string; htmlLink: string }[]> {
    const auth = this.getOAuth2Client(tokens);
    const calendar = this.google.calendar({ version: 'v3', auth });

    const response = await calendar.events.list({
      calendarId: 'primary',
      timeMin: new Date().toISOString(),
      maxResults,
      singleEvents: true,
      orderBy: 'startTime',
    });

    return (
      response.data.items?.map((event: any) => ({
        id: event.id || '',
        summary: event.summary || '',
        start: event.start?.dateTime || event.start?.date || '',
        htmlLink: event.htmlLink || '',
      })) || []
    );
  }

  async deleteCalendarEvent(tokens: GoogleTokens, eventId: string): Promise<void> {
    const auth = this.getOAuth2Client(tokens);
    const calendar = this.google.calendar({ version: 'v3', auth });

    await calendar.events.delete({
      calendarId: 'primary',
      eventId,
    });
  }
}

export const googleService = new GoogleService();
