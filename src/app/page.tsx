import Link from "next/link";
import { getDashboardSummary } from "@/lib/reports";
import { formatRupiah, formatTanggal } from "@/lib/format";

export const dynamic = "force-dynamic"; // selalu ambil data terbaru dari Sheets

function StatCard({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="bg-surface border border-border rounded-xl p-3">
      <div className="text-xs text-muted">{label}</div>
      <div className={`font-mono font-semibold text-lg ${accent ? "text-brand-brownDark" : ""}`}>{value}</div>
    </div>
  );
}

export default async function DashboardPage() {
  let summary;
  let errorMessage: string | null = null;
  try {
    summary = await getDashboardSummary();
  } catch (err) {
    errorMessage = err instanceof Error ? err.message : "Gagal memuat data.";
  }

  if (errorMessage) {
    return (
      <div className="bg-dangerBg border border-danger/30 text-danger rounded-xl p-4 text-sm">
        <b className="block mb-1">Belum bisa memuat data</b>
        {errorMessage}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="font-display font-semibold text-xl text-brand-brownDark">Halo, Owner</h1>
        <p className="text-muted text-sm">Ringkasan bulan ini</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <StatCard label="Pendapatan bulan ini" value={formatRupiah(summary!.pendapatanBulanIni)} accent />
        <StatCard label="Profit bulan ini" value={formatRupiah(summary!.profitBulanIni)} accent />
        <StatCard label="Piutang belum tertagih" value={formatRupiah(summary!.piutangTotal)} />
        <StatCard label="Project aktif" value={String(summary!.projectAktifCount)} />
      </div>

      <div className="bg-surface border border-border rounded-xl p-4">
        <div className="text-xs uppercase tracking-wide text-muted mb-2">Invoice terkirim, menunggu bayar</div>
        {summary!.jatuhTempo.length === 0 && <p className="text-sm text-muted">Tidak ada invoice menunggu.</p>}
        <div className="flex flex-col divide-y divide-border">
          {summary!.jatuhTempo.map((inv) => (
            <div key={inv["id"]} className="flex justify-between py-2 text-sm">
              <span>{inv["nomor_invoice"]}</span>
              <span className="text-warning font-medium">Jatuh tempo {formatTanggal(inv["tanggal_jatuh_tempo"])}</span>
            </div>
          ))}
        </div>
      </div>

      <Link
        href="/projects/new"
        className="bg-brand-yellow text-brand-brownDark font-semibold text-center rounded-xl py-3"
      >
        + Project Baru
      </Link>
    </div>
  );
}
