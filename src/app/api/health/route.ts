import { NextResponse } from "next/server";
import { listRows } from "@/lib/sheetRepo";

/**
 * Endpoint sederhana untuk memastikan koneksi ke Google Sheets berhasil
 * setelah environment variables diisi di Vercel.
 * Buka /api/health di browser setelah deploy untuk mengeceknya.
 */
export async function GET() {
  try {
    const customers = await listRows("customers");
    return NextResponse.json({
      status: "ok",
      pesan: "Berhasil terhubung ke Google Sheets.",
      jumlah_customer: customers.length,
    });
  } catch (err) {
    return NextResponse.json(
      {
        status: "error",
        pesan: err instanceof Error ? err.message : "Gagal terhubung ke Google Sheets.",
      },
      { status: 500 }
    );
  }
}
