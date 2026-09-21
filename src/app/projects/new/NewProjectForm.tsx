"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Customer = { id: string; nama: string };

export default function NewProjectForm({ customers }: { customers: Customer[] }) {
  const router = useRouter();
  const [form, setForm] = useState({
    customer_id: customers[0]?.id ?? "",
    nama_acara: "",
    tanggal_acara: "",
    lokasi: "",
    jumlah_porsi: "",
    catatan: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const res = await fetch("/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setLoading(false);
    if (data.status !== "ok") {
      setError(data.pesan ?? "Gagal menyimpan.");
      return;
    }
    router.push(`/projects/${data.project.id}`);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <h1 className="font-display font-semibold text-xl text-brand-brownDark">Project Baru</h1>

      {error && <div className="bg-dangerBg text-danger text-sm rounded-lg p-3">{error}</div>}

      <label className="flex flex-col gap-1 text-sm">
        Pelanggan
        {customers.length === 0 ? (
          <div className="text-sm text-muted border border-dashed border-border rounded-lg p-3">
            Belum ada pelanggan.{" "}
            <Link href="/customers/new" className="text-warning font-semibold">
              Tambah pelanggan dulu
            </Link>
            .
          </div>
        ) : (
          <select
            required
            className="border border-border rounded-lg px-3 py-2 bg-surface"
            value={form.customer_id}
            onChange={(e) => setForm({ ...form, customer_id: e.target.value })}
          >
            {customers.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nama}
              </option>
            ))}
          </select>
        )}
      </label>

      <label className="flex flex-col gap-1 text-sm">
        Nama acara
        <input
          required
          placeholder='Contoh: Pernikahan Sari & Budi'
          className="border border-border rounded-lg px-3 py-2 bg-surface"
          value={form.nama_acara}
          onChange={(e) => setForm({ ...form, nama_acara: e.target.value })}
        />
      </label>

      <div className="grid grid-cols-2 gap-3">
        <label className="flex flex-col gap-1 text-sm">
          Tanggal acara
          <input
            required
            type="date"
            className="border border-border rounded-lg px-3 py-2 bg-surface"
            value={form.tanggal_acara}
            onChange={(e) => setForm({ ...form, tanggal_acara: e.target.value })}
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          Jumlah porsi
          <input
            required
            type="number"
            min={1}
            className="border border-border rounded-lg px-3 py-2 bg-surface"
            value={form.jumlah_porsi}
            onChange={(e) => setForm({ ...form, jumlah_porsi: e.target.value })}
          />
        </label>
      </div>

      <label className="flex flex-col gap-1 text-sm">
        Lokasi
        <input
          className="border border-border rounded-lg px-3 py-2 bg-surface"
          value={form.lokasi}
          onChange={(e) => setForm({ ...form, lokasi: e.target.value })}
        />
      </label>

      <label className="flex flex-col gap-1 text-sm">
        Catatan
        <textarea
          className="border border-border rounded-lg px-3 py-2 bg-surface"
          value={form.catatan}
          onChange={(e) => setForm({ ...form, catatan: e.target.value })}
        />
      </label>

      <button
        type="submit"
        disabled={loading || customers.length === 0}
        className="bg-brand-yellow text-brand-brownDark font-semibold rounded-xl py-3 disabled:opacity-60"
      >
        {loading ? "Menyimpan..." : "Simpan sebagai Draft"}
      </button>
    </form>
  );
}
