import { NextRequest, NextResponse } from "next/server";
import { insertRow, listRows } from "@/lib/sheetRepo";

export async function GET() {
  const customers = await listRows("customers");
  return NextResponse.json(customers);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.nama) {
      return NextResponse.json({ status: "error", pesan: "Nama pelanggan wajib diisi." }, { status: 400 });
    }

    const customer = await insertRow("customers", {
      nama: body.nama,
      telepon: body.telepon ?? "",
      alamat: body.alamat ?? "",
      catatan: body.catatan ?? "",
    });

    return NextResponse.json({ status: "ok", customer });
  } catch (err) {
    return NextResponse.json(
      { status: "error", pesan: err instanceof Error ? err.message : "Gagal menyimpan pelanggan." },
      { status: 500 }
    );
  }
}
