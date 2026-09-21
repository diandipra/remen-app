import { listRows } from "@/lib/sheetRepo";
import { formatRupiah, formatTanggal } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function ExpensesPage() {
  const [expenses, categories, projects] = await Promise.all([
    listRows("expenses"),
    listRows("expense_categories"),
    listRows("projects"),
  ]);

  const namaKategori = (id: string) => categories.find((c) => c["id"] === id)?.["nama"] ?? "-";
  const namaProject = (id: string) => (id ? projects.find((p) => p["id"] === id)?.["nama_acara"] ?? "-" : "Biaya umum");

  const urut = [...expenses].sort((a, b) => (a["tanggal"] < b["tanggal"] ? 1 : -1));

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="font-display font-semibold text-xl text-brand-brownDark">Biaya</h1>
        <span className="text-sm font-semibold text-warning">+ Catat</span>
      </div>

      {urut.length === 0 && <p className="text-sm text-muted">Belum ada biaya tercatat.</p>}

      <div className="flex flex-col gap-3">
        {urut.map((e) => (
          <div key={e["id"]} className="bg-surface border border-border rounded-xl p-4 flex flex-col gap-1">
            <div className="flex justify-between items-start gap-2">
              <span className="font-semibold">{namaKategori(e["kategori_id"])}</span>
              <span className="font-mono">{formatRupiah(Number(e["jumlah"]))}</span>
            </div>
            <div className="text-sm text-muted">
              {namaProject(e["project_id"])} &middot; {formatTanggal(e["tanggal"])}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
