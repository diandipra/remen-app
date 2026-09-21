/**
 * Nama tab dan header kolom sesuai dokumen blueprint.
 * File ini jadi rujukan tunggal saat menyiapkan spreadsheet pertama kali:
 * baris pertama tiap tab di Google Sheets harus persis sama dengan array di bawah.
 */

export const TABS = {
  users: ["id", "nama", "email", "peran", "aktif", "created_at", "updated_at"],
  customers: ["id", "nama", "telepon", "alamat", "catatan", "created_at", "updated_at", "deleted_at"],
  projects: [
    "id",
    "customer_id",
    "nama_acara",
    "tanggal_acara",
    "lokasi",
    "jumlah_porsi",
    "status",
    "catatan",
    "dibuat_oleh",
    "created_at",
    "updated_at",
    "deleted_at",
  ],
  menu_items: ["id", "nama", "satuan", "harga_default", "aktif", "created_at", "updated_at"],
  invoices: [
    "id",
    "nomor_invoice",
    "project_id",
    "tanggal_terbit",
    "tanggal_jatuh_tempo",
    "diskon",
    "total",
    "status",
    "terkunci",
    "created_at",
    "updated_at",
    "deleted_at",
  ],
  invoice_items: ["id", "invoice_id", "menu_item_id", "deskripsi", "qty", "harga_satuan", "subtotal"],
  payments: ["id", "invoice_id", "tanggal_bayar", "jumlah", "metode", "catatan", "dicatat_oleh", "created_at"],
  expense_categories: ["id", "nama", "tipe"],
  vendors: ["id", "nama", "kontak", "catatan"],
  expenses: [
    "id",
    "project_id",
    "kategori_id",
    "vendor_id",
    "tanggal",
    "jumlah",
    "deskripsi",
    "bukti_url",
    "dicatat_oleh",
    "created_at",
    "updated_at",
    "deleted_at",
  ],
  audit_logs: ["id", "tabel", "record_id", "aksi", "perubahan", "oleh", "waktu"],
  counters: ["id", "nilai_terakhir", "updated_at"],
} as const;

export type TabName = keyof typeof TABS;

export const PROJECT_STATUS = ["draft", "dikonfirmasi", "selesai", "batal"] as const;
export const INVOICE_STATUS = ["draft", "terkirim", "lunas", "batal"] as const;
export const PAYMENT_METODE = ["tunai", "transfer", "qris", "lainnya"] as const;
