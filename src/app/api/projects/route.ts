import { NextRequest, NextResponse } from "next/server";
import { insertRow, listRows } from "@/lib/sheetRepo";

export async function GET() {
  const projects = await listRows("projects");
  return NextResponse.json(projects);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.customer_id || !body.nama_acara || !body.tanggal_acara || !body.jumlah_porsi) {
      return NextResponse.json(
        { status: "error", pesan: "Pelanggan, nama acara, tanggal, dan jumlah porsi wajib diisi." },
        { status: 400 }
      );
    }

    const project = await insertRow("projects", {
      customer_id: body.customer_id,
      nama_acara: body.nama_acara,
      tanggal_acara: body.tanggal_acara,
      lokasi: body.lokasi ?? "",
      jumlah_porsi: String(body.jumlah_porsi),
      status: "draft",
      catatan: body.catatan ?? "",
    });

    return NextResponse.json({ status: "ok", project });
  } catch (err) {
    return NextResponse.json(
      { status: "error", pesan: err instanceof Error ? err.message : "Gagal menyimpan project." },
      { status: 500 }
    );
  }
}
