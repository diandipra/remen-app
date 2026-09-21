import { NextResponse } from "next/server";
import { getSheetsClient, getSpreadsheetId } from "@/lib/googleSheetsClient";
import { TABS } from "@/lib/schema";

/**
 * Setup sekali jalan: membuat tab yang belum ada di spreadsheet dan menulis
 * baris header sesuai skema di src/lib/schema.ts. Aman dipanggil berkali-kali —
 * tab yang sudah ada tidak akan ditimpa datanya, hanya dipastikan headernya benar.
 *
 * Buka /api/setup di browser (GET) setelah deploy & env variables terisi.
 */
export async function GET() {
  try {
    const sheets = getSheetsClient();
    const spreadsheetId = getSpreadsheetId();

    const meta = await sheets.spreadsheets.get({ spreadsheetId });
    const existingTitles = new Set((meta.data.sheets ?? []).map((s) => s.properties?.title));

    const tabNames = Object.keys(TABS) as (keyof typeof TABS)[];
    const tabsToCreate = tabNames.filter((t) => !existingTitles.has(t));

    if (tabsToCreate.length > 0) {
      await sheets.spreadsheets.batchUpdate({
        spreadsheetId,
        requestBody: {
          requests: tabsToCreate.map((title) => ({ addSheet: { properties: { title } } })),
        },
      });
    }

    // Tulis header di setiap tab (aman walau tab sudah ada isinya, baris 1 dipastikan sesuai skema).
    const results: Record<string, string> = {};
    for (const tab of tabNames) {
      const headers = TABS[tab];
      await sheets.spreadsheets.values.update({
        spreadsheetId,
        range: `${tab}!A1:${String.fromCharCode(64 + headers.length)}1`,
        valueInputOption: "USER_ENTERED",
        requestBody: { values: [[...headers]] },
      });
      results[tab] = tabsToCreate.includes(tab) ? "dibuat baru" : "sudah ada, header diperbarui";
    }

    return NextResponse.json({
      status: "ok",
      pesan: "Setup selesai. Semua tab dan header sudah siap dipakai.",
      detail: results,
    });
  } catch (err) {
    return NextResponse.json(
      {
        status: "error",
        pesan: err instanceof Error ? err.message : "Setup gagal.",
        saran:
          "Pastikan GOOGLE_SERVICE_ACCOUNT_EMAIL, GOOGLE_PRIVATE_KEY, GOOGLE_SPREADSHEET_ID sudah benar, " +
          "dan spreadsheet sudah dibagikan (Share) ke email service account sebagai Editor.",
      },
      { status: 500 }
    );
  }
}
