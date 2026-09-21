import Link from "next/link";
import { notFound } from "next/navigation";
import { findById, listRows } from "@/lib/sheetRepo";
import { getProjectFinancials } from "@/lib/reports";
import { formatRupiah, formatTanggal } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function ProjectDetailPage({ params }: { params: { id: string } }) {
  const project = await findById("projects", params.id);
  if (!project || project["deleted_at"]) notFound();

  const [customer, invoices, expenses, categories, financials] = await Promise.all([
    findById("customers", project["customer_id"]),
    listRows("invoices"),
    listRows("expenses"),
    listRows("expense_categories"),
    getProjectFinancials(params.id),
  ]);

  const invoiceProject = invoices.filter((i) => i["project_id"] === params.id);
  const expenseProject = expenses.filter((e) => e["project_id"] === params.id);
  const namaKategori = (id: string) => categories.find((c) => c["id"] === id)?.["nama"] ?? "-";

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="font-display font-semibold text-xl text-brand-brownDark">{project["nama_acara"]}</h1>
        <p className="text-muted text-sm">
          {customer?.["nama"] ?? "-"} &middot; {formatTanggal(project["tanggal_acara"])} &middot;{" "}
          {project["jumlah_porsi"]} porsi
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-surface border border-border rounded-xl p-3">
          <div className="text-xs text-muted">Pendapatan</div>
          <div className="font-mono font-semibold">{formatRupiah(financials.pendapatan)}</div>
        </div>
        <div className="bg-surface border border-border rounded-xl p-3">
          <div className="text-xs text-muted">Biaya</div>
          <div className="font-mono font-semibold">{formatRupiah(financials.biaya)}</div>
        </div>
        <div className="bg-surface border border-border rounded-xl p-3">
          <div className="text-xs text-muted">Profit</div>
          <div className="font-mono font-semibold text-success">{formatRupiah(financials.profit)}</div>
        </div>
        <div className="bg-surface border border-border rounded-xl p-3">
          <div className="text-xs text-muted">Piutang</div>
          <div className="font-mono font-semibold text-warning">{formatRupiah(financials.piutang)}</div>
        </div>
      </div>

      <div className="bg-surface border border-border rounded-xl p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs uppercase tracking-wide text-muted">Invoice</span>
          <Link href={`/projects/${params.id}/invoices/new`} className="text-sm font-semibold text-warning">
            + Invoice baru
          </Link>
        </div>
        {invoiceProject.length === 0 && <p className="text-sm text-muted">Belum ada invoice.</p>}
        <div className="flex flex-col divide-y divide-border">
          {invoiceProject.map((inv) => (
            <div key={inv["id"]} className="flex justify-between py-2 text-sm">
              <span className="font-mono">{inv["nomor_invoice"]}</span>
              <span>{inv["status"]}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-surface border border-border rounded-xl p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs uppercase tracking-wide text-muted">Biaya</span>
          <Link href={`/expenses/new?project_id=${params.id}`} className="text-sm font-semibold text-warning">
            + Catat biaya
          </Link>
        </div>
        {expenseProject.length === 0 && <p className="text-sm text-muted">Belum ada biaya tercatat.</p>}
        <div className="flex flex-col divide-y divide-border">
          {expenseProject.map((e) => (
            <div key={e["id"]} className="flex justify-between py-2 text-sm">
              <span>{namaKategori(e["kategori_id"])}</span>
              <span className="font-mono">{formatRupiah(Number(e["jumlah"]))}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
