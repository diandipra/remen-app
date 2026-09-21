import { v4 as uuidv4 } from "uuid";
import { getSheetsClient, getSpreadsheetId } from "./googleSheetsClient";

/**
 * Repository generik di atas satu tab Google Sheets.
 * Baris pertama tab dianggap header (nama kolom), dan setiap baris berikutnya
 * dipetakan jadi objek { namaKolom: nilai }. Ini yang membuat satu fungsi bisa
 * dipakai untuk semua tab (customers, projects, invoices, dst).
 *
 * Catatan desain (lihat dokumen blueprint):
 * - Setiap tabel punya kolom id (uuid), created_at, updated_at.
 * - Tabel yang boleh soft-delete juga punya deleted_at (kosong = masih aktif).
 * - Tidak ada baris yang benar-benar dihapus dari Sheets lewat aplikasi ini.
 */

type Row = Record<string, string>;

const RANGE_ALL = (tab: string) => `${tab}!A1:ZZ`;

async function readTab(tab: string): Promise<{ headers: string[]; rows: Row[] }> {
  const sheets = getSheetsClient();
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: getSpreadsheetId(),
    range: RANGE_ALL(tab),
  });

  const values = res.data.values ?? [];
  if (values.length === 0) return { headers: [], rows: [] };

  const headers = values[0].map((h) => String(h).trim());
  const rows: Row[] = values.slice(1).map((line) => {
    const obj: Row = {};
    headers.forEach((h, i) => {
      obj[h] = line[i] !== undefined ? String(line[i]) : "";
    });
    return obj;
  });

  return { headers, rows };
}

/** Ambil semua baris aktif (deleted_at kosong, kalau kolom itu ada di tab). */
export async function listRows(tab: string, opts?: { includeDeleted?: boolean }): Promise<Row[]> {
  const { headers, rows } = await readTab(tab);
  if (!headers.includes("deleted_at") || opts?.includeDeleted) return rows;
  return rows.filter((r) => !r["deleted_at"]);
}

export async function findById(tab: string, id: string): Promise<Row | null> {
  const rows = await listRows(tab, { includeDeleted: true });
  return rows.find((r) => r["id"] === id) ?? null;
}

/** Tambah baris baru. id, created_at, updated_at diisi otomatis kalau kolomnya ada. */
export async function insertRow(tab: string, data: Row): Promise<Row> {
  const sheets = getSheetsClient();
  const { headers } = await readTab(tab);
  if (headers.length === 0) {
    throw new Error(`Tab "${tab}" belum punya baris header. Tambahkan header dulu di Sheets.`);
  }

  const now = new Date().toISOString();
  const full: Row = { ...data };
  if (headers.includes("id") && !full["id"]) full["id"] = uuidv4();
  if (headers.includes("created_at") && !full["created_at"]) full["created_at"] = now;
  if (headers.includes("updated_at")) full["updated_at"] = now;

  const line = headers.map((h) => full[h] ?? "");

  await sheets.spreadsheets.values.append({
    spreadsheetId: getSpreadsheetId(),
    range: RANGE_ALL(tab),
    valueInputOption: "USER_ENTERED",
    requestBody: { values: [line] },
  });

  return full;
}

/** Perbarui sebagian kolom pada baris dengan id tertentu. */
export async function updateRow(tab: string, id: string, patch: Row): Promise<Row> {
  const sheets = getSheetsClient();
  const { headers, rows } = await readTab(tab);
  const idx = rows.findIndex((r) => r["id"] === id);
  if (idx === -1) throw new Error(`Baris dengan id "${id}" tidak ditemukan di tab "${tab}".`);

  const now = new Date().toISOString();
  const updated: Row = { ...rows[idx], ...patch };
  if (headers.includes("updated_at")) updated["updated_at"] = now;

  const line = headers.map((h) => updated[h] ?? "");
  const sheetRowNumber = idx + 2; // +1 header, +1 karena idx berbasis 0

  await sheets.spreadsheets.values.update({
    spreadsheetId: getSpreadsheetId(),
    range: `${tab}!A${sheetRowNumber}:${columnLetter(headers.length)}${sheetRowNumber}`,
    valueInputOption: "USER_ENTERED",
    requestBody: { values: [line] },
  });

  return updated;
}

/** "Hapus" baris tanpa benar-benar menghilangkannya (data tidak boleh mudah hilang). */
export async function softDeleteRow(tab: string, id: string): Promise<void> {
  await updateRow(tab, id, { deleted_at: new Date().toISOString() });
}

function columnLetter(n: number): string {
  let s = "";
  while (n > 0) {
    const rem = (n - 1) % 26;
    s = String.fromCharCode(65 + rem) + s;
    n = Math.floor((n - 1) / 26);
  }
  return s;
}
