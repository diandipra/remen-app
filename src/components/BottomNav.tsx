import Link from "next/link";

const items = [
  { href: "/", label: "Beranda" },
  { href: "/projects", label: "Project" },
  { href: "/invoices", label: "Invoice" },
  { href: "/expenses", label: "Biaya" },
];

export default function BottomNav() {
  return (
    <nav
      className="fixed bottom-0 inset-x-0 bg-surface border-t border-border flex justify-around py-2 z-10"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 8px)" }}
    >
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className="text-xs font-semibold text-muted hover:text-brand-brown px-2 py-1"
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
