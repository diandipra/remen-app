import { google, sheets_v4 } from "googleapis";

/**
 * Satu klien Google Sheets untuk seluruh aplikasi.
 * Autentikasi pakai service account (bukan OAuth pengguna) supaya
 * server bisa baca/tulis tanpa perlu login Google berulang.
 */

let cachedClient: sheets_v4.Sheets | null = null;

function getCredentials() {
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const rawKey = process.env.GOOGLE_PRIVATE_KEY;
  const spreadsheetId = process.env.GOOGLE_SPREADSHEET_ID;

  if (!email || !rawKey || !spreadsheetId) {
    throw new Error(
      "Konfigurasi Google Sheets belum lengkap. Pastikan GOOGLE_SERVICE_ACCOUNT_EMAIL, " +
        "GOOGLE_PRIVATE_KEY, dan GOOGLE_SPREADSHEET_ID sudah diisi di environment variables."
    );
  }

  // Di Vercel, newline di private key sering tersimpan sebagai teks "\n" literal.
  const privateKey = rawKey.includes("\\n") ? rawKey.replace(/\\n/g, "\n") : rawKey;

  return { email, privateKey, spreadsheetId };
}

export function getSpreadsheetId(): string {
  return getCredentials().spreadsheetId;
}

export function getSheetsClient(): sheets_v4.Sheets {
  if (cachedClient) return cachedClient;

  const { email, privateKey } = getCredentials();
  const auth = new google.auth.JWT({
    email,
    key: privateKey,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  cachedClient = google.sheets({ version: "v4", auth });
  return cachedClient;
}
