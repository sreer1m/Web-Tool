import { useState } from "react";
import { partners, events, computeHealthScore, healthLabel, healthColor } from "@/data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Link } from "react-router-dom";
import { Search, LayoutGrid, List, GitCompare, Heart } from "lucide-react";

const TIERS = ['all', 'platinum', 'gold', 'silver', 'standard'];
const COUNTRIES = ['all', ...Array.from(new Set(partners.map(p => p.country))).sort()];

export default function Partners() {
  const [search, setSearch] = useState("");
  const [view, setView] = useState<"table" | "cards">("table");
  const [tierFilter, setTierFilter] = useState("all");
  const [countryFilter, setCountryFilter] = useState("all");
  const [sortBy, setSortBy] = useState<"revenue" | "health" | "roi" | "name">("revenue");

  const filtered = partners
    .filter(p => {
      const q = search.toLowerCase();
      const matchSearch = p.name.toLowerCase().includes(q) ||
        p.country.toLowerCase().includes(q) ||
        (p.city || '').toLowerCase().includes(q) ||
        (p.email || '').toLowerCase().includes(q);
      const matchTier = tierFilter === 'all' || p.tier === tierFilter;
      const matchCountry = countryFilter === 'all' || p.country === countryFilter;
      return matchSearch && matchTier && matchCountry;
    })
    .sort((a, b) => {
      if (sortBy === 'revenue') return b.totalRevenue - a.totalRevenue;
      if (sortBy === 'health') return computeHealthScore(b) - computeHealthScore(a);
      if (sortBy === 'roi') return b.roi - a.roi;
      return a.name.localeCompare(b.name);
    });

  const tierVariant = (tier?: string) => {
    if (tier === 'platinum') return 'default';
    if (tier === 'gold') return 'secondary';
    return 'outline';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Partners</h1>
          <p className="text-sm text-muted-foreground">{partners.length} ManageEngine partners across Europe</p>
        </div>
        <div className="flex items-center gap-2">
          <Link to="/compare">
            <Button variant="outline" size="sm" className="gap-1">
              <GitCompare className="h-4 w-4" /> Compare
            </Button>
          </Link>
          <Button size="icon" variant={view === "table" ? "default" : "outline"} onClick={() => setView("table")}><List className="h-4 w-4" /></Button>
          <Button size="icon" variant={view === "cards" ? "default" : "outline"} onClick={() => setView("cards")}><LayoutGrid className="h-4 w-4" /></Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-3">
          <div className="flex flex-wrap gap-3 items-center">
            <div className="relative flex-1 min-w-48">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search by name, country, city, email…" className="pl-8" value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <Select value={tierFilter} onValueChange={setTierFilter}>
              <SelectTrigger className="w-36 text-xs"><SelectValue placeholder="Tier" /></SelectTrigger>
              <SelectContent>{TIERS.map(t => <SelectItem key={t} value={t} className="text-xs capitalize">{t === 'all' ? 'All Tiers' : t}</SelectItem>)}</SelectContent>
            </Select>
            <Select value={countryFilter} onValueChange={setCountryFilter}>
              <SelectTrigger className="w-44 text-xs"><SelectValue placeholder="Country" /></SelectTrigger>
              <SelectContent className="max-h-48">{COUNTRIES.map(c => <SelectItem key={c} value={c} className="text-xs">{c === 'all' ? 'All Countries' : c}</SelectItem>)}</SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={v => setSortBy(v as typeof sortBy)}>
              <SelectTrigger className="w-36 text-xs"><SelectValue placeholder="Sort by" /></SelectTrigger>
              <SelectContent>
                {[['revenue', 'Revenue'], ['health', 'Health Score'], ['roi', 'ROI'], ['name', 'Name']].map(([v, l]) => (
                  <SelectItem key={v} value={v} className="text-xs">{l}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <span className="text-xs text-muted-foreground">{filtered.length} results</span>
          </div>
        </CardContent>
      </Card>

      {/* Tier Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {['platinum', 'gold', 'silver', 'standard'].map(tier => {
          const count = partners.filter(p => p.tier === tier).length;
          const rev = partners.filter(p => p.tier === tier).reduce((s, p) => s + p.totalRevenue, 0);
          return (
            <Card key={tier} className="cursor-pointer hover:shadow-sm transition-shadow" onClick={() => setTierFilter(tier === tierFilter ? 'all' : tier)}>
              <CardContent className="p-3">
                <div className="flex items-center justify-between mb-1">
                  <Badge variant={tierVariant(tier)} className="capitalize text-xs">{tier}</Badge>
                  <span className="text-lg font-bold">{count}</span>
                </div>
                <p className="text-xs text-muted-foreground">€{(rev / 1e6).toFixed(1)}M revenue</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Table View */}
      {view === "table" ? (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Partner</TableHead>
                  <TableHead>Country</TableHead>
                  <TableHead>Tier</TableHead>
                  <TableHead className="text-right">Revenue</TableHead>
                  <TableHead className="text-right">ROI</TableHead>
                  <TableHead>Health</TableHead>
                  <TableHead>Risk</TableHead>
                  <TableHead>Last Active</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map(p => {
                  const health = computeHealthScore(p);
                  return (
                    <TableRow key={p.id} className="cursor-pointer">
                      <TableCell>
                        <Link to={`/partners/${p.id}`} className="font-medium text-primary hover:underline">
                          {p.name}
                        </Link>
                        {p.city && <p className="text-xs text-muted-foreground">{p.city}</p>}
                      </TableCell>
                      <TableCell className="text-sm">{p.country}</TableCell>
                      <TableCell>
                        <Badge variant={tierVariant(p.tier)} className="text-xs capitalize">{p.tier}</Badge>
                      </TableCell>
                      <TableCell className="text-right font-medium">€{(p.totalRevenue / 1e6).toFixed(2)}M</TableCell>
                      <TableCell className="text-right">{p.roi}x</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5">
                          <div className="w-16 h-1.5 bg-accent rounded-full overflow-hidden">
                            <div className="h-full rounded-full"
                              style={{ width: `${health}%`, backgroundColor: health >= 70 ? '#16a34a' : health >= 45 ? '#ca8a04' : '#dc2626' }} />
                          </div>
                          <span className={`text-xs font-medium ${healthColor(health)}`}>{health}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={p.riskLevel === 'low' ? 'outline' : p.riskLevel === 'medium' ? 'secondary' : 'destructive'} className="text-xs">{p.riskLevel}</Badge>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">{p.lastActivity}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(p => {
            const health = computeHealthScore(p);
            const partnerEventCount = events.filter(e => e.partnerId === p.id).length;
            return (
              <Link to={`/partners/${p.id}`} key={p.id}>
                <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1 min-w-0 mr-2">
                        <p className="font-medium text-sm leading-tight">{p.name}</p>
                        <p className="text-xs text-muted-foreground">{p.city}, {p.country}</p>
                      </div>
                      <Badge variant={tierVariant(p.tier)} className="text-xs capitalize flex-shrink-0">{p.tier}</Badge>
                    </div>

                    {/* Health Score */}
                    <div className="flex items-center gap-2 mb-3">
                      <Heart className={`h-3.5 w-3.5 ${healthColor(health)}`} />
                      <div className="flex-1 h-1.5 bg-accent rounded-full overflow-hidden">
                        <div className="h-full rounded-full transition-all"
                          style={{ width: `${health}%`, backgroundColor: health >= 70 ? '#16a34a' : health >= 45 ? '#ca8a04' : '#dc2626' }} />
                      </div>
                      <span className={`text-xs font-semibold ${healthColor(health)}`}>{health} · {healthLabel(health)}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div><p className="text-xs text-muted-foreground">Revenue</p><p className="text-sm font-semibold">€{(p.totalRevenue / 1e6).toFixed(2)}M</p></div>
                      <div><p className="text-xs text-muted-foreground">ROI</p><p className="text-sm font-semibold">{p.roi}x</p></div>
                      <div><p className="text-xs text-muted-foreground">Engagement</p><p className="text-sm font-semibold">{p.engagementScore}/100</p></div>
                      <div><p className="text-xs text-muted-foreground">Events</p><p className="text-sm font-semibold">{partnerEventCount}</p></div>
                    </div>
                    {p.email && <p className="text-xs text-muted-foreground mt-2 truncate">{p.email}</p>}
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
