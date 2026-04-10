import { useState, useRef, useEffect } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Input } from "@/components/ui/input";
import { partners, events } from "@/data";
import { Search, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

type SearchResult = { id: string; label: string; sub: string; url: string; type: 'partner' | 'event' | 'country' };

function GlobalSearch() {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const ref = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!query.trim()) { setResults([]); setOpen(false); return; }
    const q = query.toLowerCase();
    const pr: SearchResult[] = partners
      .filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.country.toLowerCase().includes(q) ||
        (p.city || '').toLowerCase().includes(q) ||
        (p.email || '').toLowerCase().includes(q) ||
        (p.tier || '').toLowerCase().includes(q)
      )
      .slice(0, 5)
      .map(p => ({ id: p.id, label: p.name, sub: `${p.city || ''}, ${p.country} · ${p.tier}`, url: `/partners/${p.id}`, type: 'partner' as const }));

    const ev: SearchResult[] = events
      .filter(e =>
        e.name.toLowerCase().includes(q) ||
        e.country.toLowerCase().includes(q) ||
        e.type.toLowerCase().includes(q) ||
        String(e.year).includes(q)
      )
      .slice(0, 5)
      .map(e => ({ id: e.id, label: e.name, sub: `${e.country} · ${e.year} · ${e.type}`, url: '/events', type: 'event' as const }));

    setResults([...pr, ...ev].slice(0, 8));
    setOpen(true);
  }, [query]);

  useEffect(() => {
    const handle = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, []);

  const go = (url: string) => {
    navigate(url);
    setQuery("");
    setOpen(false);
  };

  const typeColor: Record<SearchResult['type'], string> = {
    partner: 'bg-blue-100 text-blue-700',
    event: 'bg-orange-100 text-orange-700',
    country: 'bg-green-100 text-green-700',
  };

  return (
    <div ref={ref} className="relative flex-1 max-w-md">
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search partners, events, countries…"
          className="pl-8 pr-8 h-9 text-sm"
          value={query}
          onChange={e => setQuery(e.target.value)}
          onFocus={() => query && setOpen(true)}
        />
        {query && (
          <button className="absolute right-2.5 top-2.5 text-muted-foreground hover:text-foreground" onClick={() => { setQuery(""); setOpen(false); }}>
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
      {open && results.length > 0 && (
        <div className="absolute top-10 left-0 right-0 z-50 bg-card border rounded-lg shadow-lg overflow-hidden">
          {results.map(r => (
            <button key={r.id} className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-accent text-left transition-colors"
              onClick={() => go(r.url)}>
              <span className={`text-xs px-1.5 py-0.5 rounded font-medium flex-shrink-0 ${typeColor[r.type]}`}>{r.type}</span>
              <div className="min-w-0">
                <p className="text-sm font-medium truncate">{r.label}</p>
                <p className="text-xs text-muted-foreground truncate">{r.sub}</p>
              </div>
            </button>
          ))}
        </div>
      )}
      {open && query && results.length === 0 && (
        <div className="absolute top-10 left-0 right-0 z-50 bg-card border rounded-lg shadow-lg px-3 py-4 text-center text-sm text-muted-foreground">
          No results for "{query}"
        </div>
      )}
    </div>
  );
}

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-14 flex items-center border-b px-4 gap-3 bg-card shrink-0">
            <SidebarTrigger className="mr-1" />
            <GlobalSearch />
            <span className="text-sm font-medium text-muted-foreground whitespace-nowrap hidden sm:block">Europe Edition</span>
          </header>
          <main className="flex-1 overflow-auto p-6">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
