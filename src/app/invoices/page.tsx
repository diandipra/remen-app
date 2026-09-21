import { listRows } from "@/lib/sheetRepo";
import { formatRupiah, formatTanggal } from "@/lib/format";

export const dynamic = "force-dynamic";

const STATUS_STYLE: Record<string, string> = {
  draft: "bg-surface2 text-muted",
  terkirim: "bg-warningBg text-warning",
  lunas: "bg-successBg text-success",
  batal: "bg-dangerBg text-danger",
};

export default async function InvoicesPage() {
  const invoices = await listRows("invoices");
  const urut = [...invoices].sort((a, b) => (a["tanggal_terbit"] < b["tanggal_terbit"] ? 1 : -1));

  return (
    <div className="flex flex-col gap-4">
      <h1 className="font-display font-semibold text-xl text-brand-brownDark">Invoice</h1>

      {urut.length === 0 && (
        <p className="text-sm text-muted">
          Belum ada invoice. Invoice dibuat dari halaman detail sebuah project.
        </p>
      )}

      <div className="flex flex-col gap-3">
        {urut.map((inv) => (
          <div key={inv["id"]} className="bg-surface border border-border rounded-xl p-4 flex flex-col gap-1">
            <div className="flex justify-between items-start gap-2">
              <span className="font-mono font-semibold">{inv["nomor_invoice"]}</span>
              <span
                className={`text-[11px] font-semibold px-2 py-0.5 rounded-full whitespace-nowrap ${
                  STATUS_STYLE[inv["status"]] ?? "bg-surface2 text-muted"
                }`}
              >
                {inv["status"]}
              </span>
            </div>
            <div className="text-sm text-muted">
              Jatuh tempo {formatTanggal(inv["tanggal_jatuh_tempo"])} &middot; {formatRupiah(Number(inv["total"]))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
