/**
 * Google Drive API Service for BibleAppPro
 * Handles synchronization of user data using the appDataFolder.
 */

declare const gapi: any;
declare const google: any;

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const DISCOVERY_DOC = 'https://www.googleapis.com/discovery/v1/apis/drive/v3/rest';
const SCOPES = 'https://www.googleapis.com/auth/drive.appdata';

let gapiInited = false;
let gisInited = false;
let tokenClient: any = null;

export interface BackupStatus {
    lastSync: string | null;
    status: 'idle' | 'syncing' | 'error' | 'success';
    error?: string;
}

class GoogleDriveService {
    async init() {
        return new Promise<void>((resolve) => {
            const script1 = document.createElement('script');
            script1.src = 'https://apis.google.com/js/api.js';
            script1.onload = () => {
                gapi.load('client', async () => {
                    await gapi.client.init({
                        discoveryDocs: [DISCOVERY_DOC],
                    });
                    gapiInited = true;
                    this.checkInit(resolve);
                });
            };
            document.body.appendChild(script1);

            const script2 = document.createElement('script');
            script2.src = 'https://accounts.google.com/gsi/client';
            script2.onload = () => {
                tokenClient = google.accounts.oauth2.initTokenClient({
                    client_id: CLIENT_ID,
                    scope: SCOPES,
                    callback: '', // defined at request time
                });
                gisInited = true;
                this.checkInit(resolve);
            };
            document.body.appendChild(script2);
        });
    }

    private checkInit(resolve: () => void) {
        if (gapiInited && gisInited) resolve();
    }

    async authenticate() {
        return new Promise<void>((resolve, reject) => {
            tokenClient.callback = async (resp: any) => {
                if (resp.error !== undefined) reject(resp);
                resolve();
            };

            if (gapi.client.getToken() === null) {
                tokenClient.requestAccessToken({ prompt: 'consent' });
            } else {
                tokenClient.requestAccessToken({ prompt: '' });
            }
        });
    }

    async saveBackup(data: any) {
        try {
            const fileName = 'bibleapp_backup.json';
            const fileContent = JSON.stringify(data);

            // Search for existing file
            const response = await gapi.client.drive.files.list({
                spaces: 'appDataFolder',
                fields: 'files(id, name)',
                q: `name = '${fileName}'`,
            });

            const existingFile = response.result.files?.[0];

            const metadata = {
                name: fileName,
                mimeType: 'application/json',
                parents: existingFile ? undefined : ['appDataFolder'],
            };

            const boundary = '-------314159265358979323846';
            const delimiter = "\r\n--" + boundary + "\r\n";
            const close_delim = "\r\n--" + boundary + "--";

            const body =
                delimiter +
                'Content-Type: application/json\r\n\r\n' +
                JSON.stringify(metadata) +
                delimiter +
                'Content-Type: application/json\r\n\r\n' +
                fileContent +
                close_delim;

            const request = gapi.client.request({
                path: existingFile
                    ? `/upload/drive/v3/files/${existingFile.id}?uploadType=multipart`
                    : '/upload/drive/v3/files?uploadType=multipart',
                method: existingFile ? 'PATCH' : 'POST',
                params: { uploadType: 'multipart' },
                headers: {
                    'Content-Type': 'multipart/related; boundary="' + boundary + '"',
                },
                body: body,
            });

            await request;
            return true;
        } catch (error) {
            console.error('Backup failed:', error);
            throw error;
        }
    }

    async loadBackup() {
        try {
            const fileName = 'bibleapp_backup.json';
            const response = await gapi.client.drive.files.list({
                spaces: 'appDataFolder',
                fields: 'files(id, name)',
                q: `name = '${fileName}'`,
            });

            const file = response.result.files?.[0];
            if (!file) return null;

            const contentResp = await gapi.client.drive.files.get({
                fileId: file.id,
                alt: 'media',
            });

            return contentResp.result;
        } catch (error) {
            console.error('Restore failed:', error);
            throw error;
        }
    }
}

export const googleDriveService = new GoogleDriveService();
