import Link from "next/link";
import { listRows } from "@/lib/sheetRepo";
import { formatTanggal } from "@/lib/format";

export const dynamic = "force-dynamic";

const STATUS_STYLE: Record<string, string> = {
  draft: "bg-surface2 text-muted",
  dikonfirmasi: "bg-successBg text-success",
  selesai: "bg-successBg text-success",
  batal: "bg-dangerBg text-danger",
};

export default async function ProjectsPage() {
  const [projects, customers] = await Promise.all([listRows("projects"), listRows("customers")]);
  const namaCustomer = (id: string) => customers.find((c) => c["id"] === id)?.["nama"] ?? "-";

  const urut = [...projects].sort((a, b) => (a["tanggal_acara"] < b["tanggal_acara"] ? 1 : -1));

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="font-display font-semibold text-xl text-brand-brownDark">Daftar Project</h1>
        <Link href="/projects/new" className="text-sm font-semibold text-warning">
          + Baru
        </Link>
      </div>

      {urut.length === 0 && (
        <p className="text-sm text-muted">Belum ada project. Tap &quot;+ Baru&quot; untuk membuat yang pertama.</p>
      )}

      <div className="flex flex-col gap-3">
        {urut.map((p) => (
          <Link
            key={p["id"]}
            href={`/projects/${p["id"]}`}
            className="bg-surface border border-border rounded-xl p-4 flex flex-col gap-1"
          >
            <div className="flex justify-between items-start gap-2">
              <span className="font-semibold">{p["nama_acara"]}</span>
              <span
                className={`text-[11px] font-semibold px-2 py-0.5 rounded-full whitespace-nowrap ${
                  STATUS_STYLE[p["status"]] ?? "bg-surface2 text-muted"
                }`}
              >
                {p["status"]}
              </span>
            </div>
            <div className="text-sm text-muted">
              {namaCustomer(p["customer_id"])} &middot; {formatTanggal(p["tanggal_acara"])} &middot;{" "}
              {p["jumlah_porsi"]} porsi
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
