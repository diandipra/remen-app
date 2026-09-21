import { listRows } from "./sheetRepo";
import { toNumber } from "./format";

/**
 * Semua rumus profit di satu tempat, sesuai dokumen blueprint:
 *
 *   Pendapatan = total invoice (status != batal) milik project
 *   Kas Masuk  = jumlah payments untuk invoice-invoice project itu
 *   Piutang    = Pendapatan - Kas Masuk
 *   Biaya      = jumlah expenses milik project
 *   Profit     = Pendapatan - Biaya          (akrual)
 *   Profit Kas = Kas Masuk - Biaya           (berbasis uang yang sudah masuk)
 *
 * Tidak ada angka ini yang disimpan permanen — selalu dihitung ulang dari data
 * mentah supaya tidak pernah tidak sinkron.
 */

export type ProjectFinancials = {
  pendapatan: number;
  kasMasuk: number;
  piutang: number;
  biaya: number;
  profit: number;
  profitKas: number;
};

export async function getProjectFinancials(projectId: string): Promise<ProjectFinancials> {
  const [invoices, payments, expenses] = await Promise.all([
    listRows("invoices"),
    listRows("payments"),
    listRows("expenses"),
  ]);

  const invoicesProject = invoices.filter((i) => i["project_id"] === projectId && i["status"] !== "batal");
  const invoiceIds = new Set(invoicesProject.map((i) => i["id"]));

  const pendapatan = invoicesProject.reduce((sum, i) => sum + toNumber(i["total"]), 0);
  const kasMasuk = payments
    .filter((p) => invoiceIds.has(p["invoice_id"]))
    .reduce((sum, p) => sum + toNumber(p["jumlah"]), 0);
  const biaya = expenses
    .filter((e) => e["project_id"] === projectId)
    .reduce((sum, e) => sum + toNumber(e["jumlah"]), 0);

  return {
    pendapatan,
    kasMasuk,
    piutang: pendapatan - kasMasuk,
    biaya,
    profit: pendapatan - biaya,
    profitKas: kasMasuk - biaya,
  };
}

export async function getDashboardSummary() {
  const [projects, invoices, payments, expenses] = await Promise.all([
    listRows("projects"),
    listRows("invoices"),
    listRows("payments"),
    listRows("expenses"),
  ]);

  const now = new Date();
  const bulanIni = (iso: string) => {
    const d = new Date(iso);
    return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
  };

  const invoiceBulanIni = invoices.filter((i) => i["status"] !== "batal" && bulanIni(i["tanggal_terbit"]));
  const pendapatanBulanIni = invoiceBulanIni.reduce((sum, i) => sum + toNumber(i["total"]), 0);

  const invoiceIdsBulanIni = new Set(invoiceBulanIni.map((i) => i["id"]));
  const kasMasukBulanIni = payments
    .filter((p) => invoiceIdsBulanIni.has(p["invoice_id"]))
    .reduce((sum, p) => sum + toNumber(p["jumlah"]), 0);

  const biayaBulanIni = expenses
    .filter((e) => bulanIni(e["tanggal"]))
    .reduce((sum, e) => sum + toNumber(e["jumlah"]), 0);

  const invoiceAktif = invoices.filter((i) => i["status"] !== "batal");
  const invoiceAktifIds = new Set(invoiceAktif.map((i) => i["id"]));
  const totalKasMasukSemua = payments
    .filter((p) => invoiceAktifIds.has(p["invoice_id"]))
    .reduce((sum, p) => sum + toNumber(p["jumlah"]), 0);
  const totalPendapatanSemua = invoiceAktif.reduce((sum, i) => sum + toNumber(i["total"]), 0);

  const jatuhTempo = invoices
    .filter((i) => i["status"] === "terkirim")
    .sort((a, b) => (a["tanggal_jatuh_tempo"] > b["tanggal_jatuh_tempo"] ? 1 : -1))
    .slice(0, 5);

  const projectAktif = projects.filter((p) => p["status"] === "dikonfirmasi" || p["status"] === "draft");

  return {
    pendapatanBulanIni,
    profitBulanIni: pendapatanBulanIni - biayaBulanIni,
    piutangTotal: totalPendapatanSemua - totalKasMasukSemua,
    projectAktifCount: projectAktif.length,
    jatuhTempo,
    projects,
  };
}
