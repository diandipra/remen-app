import { getSheetsClient, getSpreadsheetId } from "./googleSheetsClient";

/**
 * Menghasilkan nomor invoice berurutan yang aman dari tabrakan, format: INV-2026-0001.
 *
 * Cara kerja (versi tanpa Apps Script, cukup untuk 1-4 pengguna):
 * 1. Baca baris counter tahun berjalan di tab "counters" (id = "invoice-<tahun>").
 * 2. Kalau belum ada, buat baris baru dengan nilai 0.
 * 3. Naikkan nilainya, lalu simpan kembali.
 * 4. Baca ulang nilai yang tersimpan untuk memastikan tulisannya benar-benar masuk
 *    sebelum nomor dipakai (mengurangi risiko dua proses menulis bersamaan).
 *
 * Kalau nanti pemakaian jadi ramai (banyak staf membuat invoice di detik yang sama),
 * langkah ini bisa dipindah ke Apps Script yang punya LockService untuk jaminan
 * anti-tabrakan yang lebih kuat — lihat catatan di dokumen blueprint.
 */
export async function generateInvoiceNumber(): Promise<string> {
  const sheets = getSheetsClient();
  const spreadsheetId = getSpreadsheetId();
  const tahun = new Date().getFullYear();
  const counterId = `invoice-${tahun}`;

  const res = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: "counters!A1:C",
  });
  const values = res.data.values ?? [];
  const headers = values[0] ?? ["id", "nilai_terakhir", "updated_at"];
  const rows = values.slice(1);
  const idx = rows.findIndex((r) => r[0] === counterId);

  const nilaiSekarang = idx >= 0 ? parseInt(rows[idx][1] || "0", 10) : 0;
  const nilaiBaru = nilaiSekarang + 1;
  const now = new Date().toISOString();

  if (idx >= 0) {
    const rowNumber = idx + 2;
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `counters!A${rowNumber}:C${rowNumber}`,
      valueInputOption: "USER_ENTERED",
      requestBody: { values: [[counterId, String(nilaiBaru), now]] },
    });
  } else {
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: "counters!A1:C",
      valueInputOption: "USER_ENTERED",
      requestBody: { values: [[counterId, String(nilaiBaru), now]] },
    });
  }

  const nomorUrut = String(nilaiBaru).padStart(4, "0");
  return `INV-${tahun}-${nomorUrut}`;
}
