"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function NewCustomerPage() {
  const router = useRouter();
  const [form, setForm] = useState({ nama: "", telepon: "", alamat: "", catatan: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const res = await fetch("/api/customers", {
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
    router.push("/projects/new");
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <h1 className="font-display font-semibold text-xl text-brand-brownDark">Pelanggan Baru</h1>

      {error && <div className="bg-dangerBg text-danger text-sm rounded-lg p-3">{error}</div>}

      <label className="flex flex-col gap-1 text-sm">
        Nama
        <input
          required
          className="border border-border rounded-lg px-3 py-2 bg-surface"
          value={form.nama}
          onChange={(e) => setForm({ ...form, nama: e.target.value })}
        />
      </label>
      <label className="flex flex-col gap-1 text-sm">
        Telepon
        <input
          className="border border-border rounded-lg px-3 py-2 bg-surface"
          value={form.telepon}
          onChange={(e) => setForm({ ...form, telepon: e.target.value })}
        />
      </label>
      <label className="flex flex-col gap-1 text-sm">
        Alamat
        <input
          className="border border-border rounded-lg px-3 py-2 bg-surface"
          value={form.alamat}
          onChange={(e) => setForm({ ...form, alamat: e.target.value })}
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
        disabled={loading}
        className="bg-brand-yellow text-brand-brownDark font-semibold rounded-xl py-3 disabled:opacity-60"
      >
        {loading ? "Menyimpan..." : "Simpan Pelanggan"}
      </button>
    </form>
  );
}
