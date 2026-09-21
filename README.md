# Rémen — Manajemen Catering

Aplikasi pembukuan, invoicing, dan profit per project untuk usaha catering.
Next.js (App Router) + Tailwind, dengan Google Sheets sebagai database.

## Cara kerja singkat

- Setiap "tabel" adalah satu tab di satu Google Spreadsheet.
- Aplikasi terhubung ke Sheets lewat Google Sheets API memakai service account
  (bukan login Google pengguna), lihat `src/lib/googleSheetsClient.ts`.
- Semua baca/tulis data lewat `src/lib/sheetRepo.ts` — satu lapisan generik untuk
  semua tab, supaya kalau nanti pindah ke database lain cukup ganti file ini.
- Definisi kolom tiap tab ada di `src/lib/schema.ts`, sesuai dokumen blueprint.

## Environment variables yang dibutuhkan

Lihat `.env.example`. Tiga yang wajib:

- `GOOGLE_SERVICE_ACCOUNT_EMAIL`
- `GOOGLE_PRIVATE_KEY`
- `GOOGLE_SPREADSHEET_ID`

## Setelah deploy pertama kali

1. Buka `https://<domain-aplikasi>/api/setup` sekali di browser. Ini otomatis
   membuat semua tab (customers, projects, invoices, dst.) beserta header
   kolomnya di spreadsheet — tidak perlu bikin tab manual.
2. Buka `https://<domain-aplikasi>/api/health` untuk memastikan koneksi ke
   Sheets berhasil.
3. Buka halaman utama, mulai dengan menambah pelanggan lalu project pertama.

## Menjalankan di komputer sendiri (opsional, untuk developer)

```bash
npm install
cp .env.example .env.local   # isi dengan kredensial asli
npm run dev
```

## Status pengembangan

Sudah ada: dashboard ringkasan, daftar & detail project (dengan hitung profit
otomatis), daftar invoice, daftar biaya, tambah pelanggan, tambah project.

Menyusul: form buat invoice (dengan penomoran otomatis INV-2026-0001), form
catat pembayaran, form catat biaya, dan modul katalog menu — mengikuti
wireframe di dokumen blueprint.

