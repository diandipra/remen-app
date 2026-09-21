export default function TopBar() {
  return (
    <header className="sticky top-0 z-10 bg-bg border-b border-border">
      <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-3">
        <span className="bg-brand-yellow text-brand-brownDark font-display font-bold text-lg px-4 py-1 rounded-full">
          Rémen
        </span>
        <span className="text-muted text-sm">Manajemen Catering</span>
      </div>
    </header>
  );
}
