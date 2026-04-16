import { useState, useMemo, useRef, useCallback } from "react";
import { ComposableMap, Geographies, Geography, Marker, ZoomableGroup } from "react-simple-maps";
import { regions, COUNTRY_TO_REGION } from "@/data/regions";
import { countryIntelligence } from "@/data/globalMarkets";
import { globalEvents } from "@/data/globalEvents";
import { defaultNotes } from "@/data/globalNotes";
import type { CountryIntelligence, GlobalEvent, GlobalNote, MEParticipation } from "@/data/globalTypes";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle,
} from "@/components/ui/sheet";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Globe, TrendingUp, Shield, Users, CheckCircle2, XCircle, HelpCircle,
  ExternalLink, Zap, BookOpen, ChevronRight,
} from "lucide-react";

const GEO_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-50m.json";

// ── helpers ────────────────────────────────────────────────────────────────────

function maturityColor(m: string) {
  return m === 'Mature' ? 'bg-green-100 text-green-700'
    : m === 'Developing' ? 'bg-blue-100 text-blue-700'
    : 'bg-yellow-100 text-yellow-700';
}
function strengthColor(s: string) {
  return s === 'High' ? 'bg-green-100 text-green-700'
    : s === 'Mid' ? 'bg-amber-100 text-amber-700'
    : 'bg-red-100 text-red-700';
}
function growthColor(g: string) {
  return g === 'High' ? 'bg-emerald-100 text-emerald-700'
    : g === 'Medium' ? 'bg-blue-100 text-blue-700'
    : 'bg-slate-100 text-slate-600';
}
function priorityColor(p: string) {
  return p === 'High' ? 'bg-red-100 text-red-700'
    : p === 'Medium' ? 'bg-amber-100 text-amber-700'
    : 'bg-slate-100 text-slate-600';
}

function ParticipationBadge({ status }: { status: MEParticipation }) {
  if (status === 'Participating') return (
    <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700 font-medium">
      <CheckCircle2 className="h-3 w-3" /> Participating
    </span>
  );
  if (status === 'Not Participating') return (
    <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-700 font-medium">
      <XCircle className="h-3 w-3" /> Not Participating
    </span>
  );
  return (
    <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700 font-medium">
      <HelpCircle className="h-3 w-3" /> No Verified Data
    </span>
  );
}

// ── sub-panels ─────────────────────────────────────────────────────────────────

function OverviewPanel({ intel }: { intel: CountryIntelligence }) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-2">
        <div className="rounded-lg border p-3 text-center">
          <p className="text-xs text-muted-foreground mb-1">IT Maturity</p>
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${maturityColor(intel.itMaturity)}`}>
            {intel.itMaturity}
          </span>
        </div>
        <div className="rounded-lg border p-3 text-center">
          <p className="text-xs text-muted-foreground mb-1">Economic Strength</p>
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${strengthColor(intel.economicStrength)}`}>
            {intel.economicStrength}
          </span>
        </div>
        <div className="rounded-lg border p-3 text-center">
          <p className="text-xs text-muted-foreground mb-1">Growth Potential</p>
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${growthColor(intel.growthPotential)}`}>
            {intel.growthPotential}
          </span>
        </div>
      </div>

      <div className="rounded-lg border p-3 space-y-2">
        <div className="flex items-center gap-1.5 text-sm font-medium">
          <Zap className="h-4 w-4 text-primary" /> ManageEngine Presence
        </div>
        <p className="text-xs text-muted-foreground">{intel.mePresence.focus}</p>
        <div className="flex flex-wrap gap-1">
          {intel.mePresence.products.map(p => (
            <span key={p} className="text-xs px-1.5 py-0.5 bg-primary/10 text-primary rounded">{p}</span>
          ))}
        </div>
        {intel.mePresence.initiatives.length > 0 && (
          <ul className="text-xs text-muted-foreground space-y-0.5 mt-1">
            {intel.mePresence.initiatives.map(i => (
              <li key={i} className="flex items-start gap-1"><ChevronRight className="h-3 w-3 mt-0.5 flex-shrink-0" />{i}</li>
            ))}
          </ul>
        )}
      </div>

      <div className="rounded-lg border p-3 space-y-1">
        <div className="flex items-center gap-1.5 text-sm font-medium mb-1">
          <Globe className="h-4 w-4 text-primary" /> Language & Localization
        </div>
        <p className="text-xs"><span className="font-medium">Primary:</span> {intel.language.primary}</p>
        {intel.language.secondary && (
          <p className="text-xs"><span className="font-medium">Secondary:</span> {intel.language.secondary.join(', ')}</p>
        )}
        <p className="text-xs text-muted-foreground">{intel.language.localizationNeeds}</p>
      </div>

      {intel.notes && (
        <div className="rounded-lg bg-accent/40 border p-3">
          <p className="text-xs font-medium mb-1 flex items-center gap-1">
            <BookOpen className="h-3.5 w-3.5" /> Market Notes
          </p>
          <p className="text-xs text-muted-foreground">{intel.notes}</p>
        </div>
      )}
    </div>
  );
}

function EventsPanel({ events, countryName }: { events: GlobalEvent[]; countryName: string }) {
  const [filterCat, setFilterCat] = useState('all');
  const [filterPart, setFilterPart] = useState('all');

  const categories = useMemo(() => ['all', ...Array.from(new Set(events.map(e => e.category)))], [events]);
  const filtered = useMemo(() => events
    .filter(e => filterCat === 'all' || e.category === filterCat)
    .filter(e => filterPart === 'all' || e.meParticipation === filterPart),
    [events, filterCat, filterPart]);

  if (events.length === 0) return (
    <div className="text-center py-10 text-muted-foreground text-sm">
      No events data for {countryName}
    </div>
  );

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <Select value={filterCat} onValueChange={setFilterCat}>
          <SelectTrigger className="h-8 text-xs flex-1">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map(c => <SelectItem key={c} value={c} className="text-xs">{c === 'all' ? 'All Categories' : c}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={filterPart} onValueChange={setFilterPart}>
          <SelectTrigger className="h-8 text-xs flex-1">
            <SelectValue placeholder="ME Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all" className="text-xs">All Statuses</SelectItem>
            <SelectItem value="Participating" className="text-xs">Participating</SelectItem>
            <SelectItem value="Not Participating" className="text-xs">Not Participating</SelectItem>
            <SelectItem value="No Verified Data" className="text-xs">No Verified Data</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filtered.map(e => (
        <div key={e.id} className="rounded-lg border p-3 space-y-1.5">
          <div className="flex items-start justify-between gap-2">
            <p className="text-sm font-medium leading-snug">{e.name}</p>
            <ParticipationBadge status={e.meParticipation} />
          </div>
          <div className="flex flex-wrap gap-1 text-xs text-muted-foreground">
            <span>{e.dateDisplay}</span>
            <span>·</span>
            <span>{e.city}</span>
            <span>·</span>
            <span className="bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">{e.category}</span>
          </div>
          {e.intelligence?.whyMatters && (
            <p className="text-xs text-muted-foreground">{e.intelligence.whyMatters}</p>
          )}
          {e.verification && (
            <p className="text-xs text-amber-600 bg-amber-50 rounded px-2 py-1">{e.verification}</p>
          )}
          <a href={e.source} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs text-primary hover:underline">
            <ExternalLink className="h-3 w-3" /> Official source
          </a>
        </div>
      ))}
    </div>
  );
}

function StrategyPanel({ intel }: { intel: CountryIntelligence }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">Market Priority:</span>
        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${priorityColor(intel.marketingStrategy.priority)}`}>
          {intel.marketingStrategy.priority}
        </span>
      </div>

      <div className="rounded-lg border p-3 space-y-2">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">GTM Strategy</p>
        <p className="text-sm">{intel.marketingStrategy.gtm}</p>
      </div>

      <div className="rounded-lg border p-3 space-y-2">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Key Channels</p>
        <div className="flex flex-wrap gap-1.5">
          {intel.marketingStrategy.channels.map(c => (
            <span key={c} className="text-xs px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full border border-blue-200">{c}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

function CompetitorsPanel({ intel }: { intel: CountryIntelligence }) {
  const sections = [
    { label: 'Local Competitors', items: intel.competitors.local, color: 'bg-red-50 text-red-700 border-red-200' },
    { label: 'Regional Competitors', items: intel.competitors.regional, color: 'bg-orange-50 text-orange-700 border-orange-200' },
    { label: 'Global Competitors', items: intel.competitors.global, color: 'bg-slate-50 text-slate-700 border-slate-200' },
  ];

  return (
    <div className="space-y-3">
      {sections.map(s => (
        <div key={s.label} className="rounded-lg border p-3">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">{s.label}</p>
          {s.items.length === 0 ? (
            <p className="text-xs text-muted-foreground italic">None identified</p>
          ) : (
            <div className="flex flex-wrap gap-1.5">
              {s.items.map(c => (
                <span key={c} className={`text-xs px-2 py-0.5 rounded-full border font-medium ${s.color}`}>{c}</span>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function NotesPanel({
  countryCode,
  countryName,
  notes,
  localNote,
  onLocalNoteChange,
}: {
  countryCode: string;
  countryName: string;
  notes: GlobalNote[];
  localNote: string;
  onLocalNoteChange: (v: string) => void;
}) {
  return (
    <div className="space-y-3">
      {notes.map(n => (
        <div key={n.id} className="rounded-lg border p-3 space-y-1">
          <p className="text-sm font-medium">{n.title}</p>
          <p className="text-xs text-muted-foreground whitespace-pre-wrap">{n.content}</p>
          <div className="flex flex-wrap gap-1 mt-1">
            {n.tags.map(t => (
              <span key={t} className="text-xs px-1.5 py-0.5 bg-accent rounded text-muted-foreground">#{t}</span>
            ))}
          </div>
        </div>
      ))}

      <div>
        <p className="text-xs font-medium text-muted-foreground mb-1">Add a note for {countryName}</p>
        <Textarea
          value={localNote}
          onChange={e => onLocalNoteChange(e.target.value)}
          placeholder={`Write your intelligence notes for ${countryName}…`}
          className="text-xs h-28"
        />
      </div>
    </div>
  );
}

// ── main CountryPanel (Sheet content) ──────────────────────────────────────────

function CountryPanel({
  countryName,
  intel,
  events,
  notes,
  localNote,
  onLocalNoteChange,
}: {
  countryName: string;
  intel: CountryIntelligence | undefined;
  events: GlobalEvent[];
  notes: GlobalNote[];
  localNote: string;
  onLocalNoteChange: (v: string) => void;
}) {
  const regionId = COUNTRY_TO_REGION[countryName];
  const region = regions.find(r => r.id === regionId);

  return (
    <>
      <SheetHeader className="pb-3 border-b">
        <SheetTitle className="flex items-center gap-2 text-lg">
          {countryName}
        </SheetTitle>
        {region && (
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-full inline-block" style={{ backgroundColor: region.color }} />
            <span className="text-xs text-muted-foreground">{region.name}</span>
          </div>
        )}
      </SheetHeader>

      {!intel ? (
        <div className="mt-6 space-y-3">
          <div className="rounded-lg bg-accent/40 border p-4 text-sm text-muted-foreground">
            No detailed market intelligence available for <strong>{countryName}</strong> yet.
            {region && (
              <p className="mt-2">This country is in the <strong>{region.name}</strong> region. {region.mePresenceSummary}</p>
            )}
          </div>
          {events.length > 0 && (
            <div>
              <p className="text-sm font-medium mb-2">Events in {countryName}</p>
              <EventsPanel events={events} countryName={countryName} />
            </div>
          )}
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-1">Add a note</p>
            <Textarea
              value={localNote}
              onChange={e => onLocalNoteChange(e.target.value)}
              placeholder={`Write your intelligence notes for ${countryName}…`}
              className="text-xs h-24"
            />
          </div>
        </div>
      ) : (
        <Tabs defaultValue="overview" className="mt-4">
          <TabsList className="grid grid-cols-5 h-8 text-xs">
            <TabsTrigger value="overview" className="text-xs">Overview</TabsTrigger>
            <TabsTrigger value="events" className="text-xs">Events {events.length > 0 && `(${events.length})`}</TabsTrigger>
            <TabsTrigger value="strategy" className="text-xs">Strategy</TabsTrigger>
            <TabsTrigger value="competitors" className="text-xs">Rivals</TabsTrigger>
            <TabsTrigger value="notes" className="text-xs">Notes</TabsTrigger>
          </TabsList>

          <div className="mt-4">
            <TabsContent value="overview">
              <OverviewPanel intel={intel} />
            </TabsContent>
            <TabsContent value="events">
              <EventsPanel events={events} countryName={countryName} />
            </TabsContent>
            <TabsContent value="strategy">
              <StrategyPanel intel={intel} />
            </TabsContent>
            <TabsContent value="competitors">
              <CompetitorsPanel intel={intel} />
            </TabsContent>
            <TabsContent value="notes">
              <NotesPanel
                countryCode={intel.countryCode}
                countryName={countryName}
                notes={notes}
                localNote={localNote}
                onLocalNoteChange={onLocalNoteChange}
              />
            </TabsContent>
          </div>
        </Tabs>
      )}
    </>
  );
}

// ── Region overview panel ──────────────────────────────────────────────────────

function RegionOverviewCard({ regionId, onClose }: { regionId: string; onClose: () => void }) {
  const region = regions.find(r => r.id === regionId);
  if (!region) return null;

  const regionEvents = globalEvents.filter(e => e.region === regionId);
  const participating = regionEvents.filter(e => e.meParticipation === 'Participating').length;

  return (
    <Card className="border-l-4 shadow-sm" style={{ borderLeftColor: region.color }}>
      <CardContent className="p-3 space-y-2">
        <div className="flex items-start justify-between">
          <div>
            <p className="font-semibold text-sm">{region.name}</p>
            <p className="text-xs text-muted-foreground">{region.description.slice(0, 100)}…</p>
          </div>
          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={onClose}>✕</Button>
        </div>
        <p className="text-xs">{region.mePresenceSummary}</p>
        <div className="flex gap-3 text-xs text-muted-foreground">
          <span>{regionEvents.length} events</span>
          <span>{participating} ME participating</span>
          <span>{region.countries.length} countries</span>
        </div>
        <div className="flex flex-wrap gap-1">
          {region.keyOpportunities.map(o => (
            <span key={o} className="text-xs px-1.5 py-0.5 bg-accent rounded">{o}</span>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// ── main page ─────────────────────────────────────────────────────────────────

export default function GlobalMap() {
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [selectedRegionFilter, setSelectedRegionFilter] = useState<string>('all');
  const [selectedRegionCard, setSelectedRegionCard] = useState<string | null>(null);
  const [filterParticipation, setFilterParticipation] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [hoveredGeo, setHoveredGeo] = useState<string | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [countryNotes, setCountryNotes] = useState<Record<string, string>>({});
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((evt: React.MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (rect) setMousePos({ x: evt.clientX - rect.left, y: evt.clientY - rect.top });
  }, []);

  const selectedIntel = useMemo(
    () => countryIntelligence.find(c => c.countryName === selectedCountry),
    [selectedCountry],
  );

  const countryEvents = useMemo(
    () => globalEvents.filter(e =>
      e.countryName === selectedCountry &&
      (filterParticipation === 'all' || e.meParticipation === filterParticipation) &&
      (filterCategory === 'all' || e.category === filterCategory),
    ),
    [selectedCountry, filterParticipation, filterCategory],
  );

  const countrySpecificNotes = useMemo(
    () => defaultNotes.filter(n =>
      n.countryCode === selectedIntel?.countryCode ||
      (n.regionId && n.regionId === selectedIntel?.region),
    ),
    [selectedIntel],
  );

  const visibleEventMarkers = useMemo(
    () => globalEvents.filter(e =>
      e.coordinates &&
      (selectedRegionFilter === 'all' || e.region === selectedRegionFilter) &&
      (filterParticipation === 'all' || e.meParticipation === filterParticipation) &&
      (filterCategory === 'all' || e.category === filterCategory),
    ),
    [selectedRegionFilter, filterParticipation, filterCategory],
  );

  const getCountryFill = useCallback((name: string) => {
    const regionId = COUNTRY_TO_REGION[name];
    if (!regionId) return '#e2e8f0';
    if (selectedRegionFilter !== 'all' && selectedRegionFilter !== regionId) return '#f1f5f9';
    const region = regions.find(r => r.id === regionId);
    return region?.color ?? '#e2e8f0';
  }, [selectedRegionFilter]);

  const getHoverFill = useCallback((name: string) => {
    const regionId = COUNTRY_TO_REGION[name];
    if (!regionId) return '#cbd5e1';
    if (selectedRegionFilter !== 'all' && selectedRegionFilter !== regionId) return '#e2e8f0';
    const region = regions.find(r => r.id === regionId);
    return region?.hoverColor ?? '#cbd5e1';
  }, [selectedRegionFilter]);

  // aggregate stats
  const totalEvents = globalEvents.length;
  const meParticipating = globalEvents.filter(e => e.meParticipation === 'Participating').length;
  const countriesWithIntel = countryIntelligence.length;

  return (
    <div className="flex flex-col gap-3 h-full">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h1 className="text-xl font-semibold">Global IT Market Intelligence</h1>
          <p className="text-xs text-muted-foreground">
            {countriesWithIntel} countries with detailed intelligence · {totalEvents} real events tracked · {meParticipating} ME confirmed participations
          </p>
        </div>
        <div className="flex gap-2">
          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger className="h-8 text-xs w-44">
              <SelectValue placeholder="Event Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all" className="text-xs">All Categories</SelectItem>
              {['Cybersecurity', 'Cloud', 'Enterprise IT', 'ITSM', 'Digital Transformation', 'MSP', 'IT Infrastructure', 'DevOps'].map(c => (
                <SelectItem key={c} value={c} className="text-xs">{c}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={filterParticipation} onValueChange={setFilterParticipation}>
            <SelectTrigger className="h-8 text-xs w-44">
              <SelectValue placeholder="ME Participation" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all" className="text-xs">All Participation</SelectItem>
              <SelectItem value="Participating" className="text-xs">✅ Participating</SelectItem>
              <SelectItem value="Not Participating" className="text-xs">❌ Not Participating</SelectItem>
              <SelectItem value="No Verified Data" className="text-xs">⚠️ No Verified Data</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Region card */}
      {selectedRegionCard && (
        <RegionOverviewCard regionId={selectedRegionCard} onClose={() => setSelectedRegionCard(null)} />
      )}

      <div className="flex gap-3 flex-1 min-h-0">
        {/* Region legend sidebar */}
        <div className="w-48 flex-shrink-0 flex flex-col gap-0.5">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">Regions</p>
          <button
            onClick={() => { setSelectedRegionFilter('all'); setSelectedRegionCard(null); }}
            className={`flex items-center gap-2 w-full text-xs px-2 py-1.5 rounded-md transition-colors ${selectedRegionFilter === 'all' ? 'bg-accent font-medium' : 'hover:bg-accent/60'}`}
          >
            <span className="h-2.5 w-2.5 rounded-full bg-slate-400 flex-shrink-0" />
            All Regions
          </button>
          {regions.map(r => {
            const evtCount = globalEvents.filter(e => e.region === r.id).length;
            return (
              <button
                key={r.id}
                onClick={() => {
                  setSelectedRegionFilter(f => f === r.id ? 'all' : r.id);
                  setSelectedRegionCard(r.id === selectedRegionFilter ? null : r.id);
                }}
                className={`flex items-center gap-2 w-full text-xs px-2 py-1.5 rounded-md transition-colors text-left ${selectedRegionFilter === r.id ? 'bg-accent font-medium' : 'hover:bg-accent/60'}`}
              >
                <span className="h-2.5 w-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: r.color }} />
                <span className="flex-1 truncate">{r.name}</span>
                {evtCount > 0 && <span className="text-muted-foreground">{evtCount}</span>}
              </button>
            );
          })}

          <div className="mt-auto pt-3 border-t space-y-1">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Event Legend</p>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span className="h-2.5 w-2.5 rounded-full bg-green-500 flex-shrink-0" />
              ME Participating
            </div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span className="h-2.5 w-2.5 rounded-full bg-slate-400 flex-shrink-0" />
              No Verified Data
            </div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span className="h-2.5 w-2.5 rounded-full bg-red-400 flex-shrink-0" />
              Not Participating
            </div>
          </div>
        </div>

        {/* Map */}
        <div
          ref={containerRef}
          className="flex-1 relative bg-slate-50 rounded-xl overflow-hidden border"
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setHoveredGeo(null)}
        >
          <ComposableMap
            projectionConfig={{ scale: 147, center: [10, 20] }}
            style={{ width: '100%', height: '100%' }}
          >
            <ZoomableGroup>
              <Geographies geography={GEO_URL}>
                {({ geographies }) =>
                  geographies.map(geo => {
                    const name: string = geo.properties.name;
                    const fill = getCountryFill(name);
                    const hoverFill = getHoverFill(name);
                    const hasIntel = countryIntelligence.some(c => c.countryName === name);
                    return (
                      <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        fill={fill}
                        stroke="#ffffff"
                        strokeWidth={0.4}
                        onClick={() => {
                          setSelectedCountry(name);
                        }}
                        onMouseEnter={() => setHoveredGeo(name)}
                        onMouseLeave={() => setHoveredGeo(null)}
                        style={{
                          default: { fill, outline: 'none' },
                          hover: {
                            fill: hoverFill,
                            outline: 'none',
                            cursor: 'pointer',
                            opacity: 0.85,
                          },
                          pressed: { outline: 'none', opacity: 0.7 },
                        }}
                      />
                    );
                  })
                }
              </Geographies>

              {/* Event markers */}
              {visibleEventMarkers.map(e => (
                <Marker key={e.id} coordinates={e.coordinates!}>
                  <circle
                    r={4}
                    fill={
                      e.meParticipation === 'Participating' ? '#22c55e'
                      : e.meParticipation === 'Not Participating' ? '#ef4444'
                      : '#94a3b8'
                    }
                    stroke="#ffffff"
                    strokeWidth={1.5}
                    style={{ cursor: 'pointer' }}
                    onClick={() => setSelectedCountry(e.countryName)}
                  />
                </Marker>
              ))}
            </ZoomableGroup>
          </ComposableMap>

          {/* Hover tooltip */}
          {hoveredGeo && (
            <div
              className="absolute pointer-events-none z-10 bg-white border shadow-lg rounded-lg p-2.5 text-xs min-w-[140px]"
              style={{
                left: Math.min(mousePos.x + 14, (containerRef.current?.offsetWidth ?? 600) - 160),
                top: mousePos.y > 120 ? mousePos.y - 70 : mousePos.y + 14,
              }}
            >
              <p className="font-semibold">{hoveredGeo}</p>
              {(() => {
                const regionId = COUNTRY_TO_REGION[hoveredGeo];
                const region = regions.find(r => r.id === regionId);
                const intel = countryIntelligence.find(c => c.countryName === hoveredGeo);
                return (
                  <div className="mt-0.5 space-y-0.5">
                    {region && (
                      <div className="flex items-center gap-1">
                        <span className="h-2 w-2 rounded-full" style={{ backgroundColor: region.color }} />
                        <span className="text-muted-foreground">{region.name}</span>
                      </div>
                    )}
                    {intel && (
                      <div className="flex gap-1 flex-wrap">
                        <span className={`px-1.5 py-0.5 rounded text-xs ${maturityColor(intel.itMaturity)}`}>{intel.itMaturity}</span>
                        <span className={`px-1.5 py-0.5 rounded text-xs ${growthColor(intel.growthPotential)}`}>{intel.growthPotential} growth</span>
                      </div>
                    )}
                    <p className="text-primary text-xs">Click for details →</p>
                  </div>
                );
              })()}
            </div>
          )}
        </div>
      </div>

      {/* Country detail sheet */}
      <Sheet open={!!selectedCountry} onOpenChange={open => !open && setSelectedCountry(null)}>
        <SheetContent
          className="w-[560px] max-w-full overflow-y-auto"
          style={{ maxHeight: '100vh' }}
        >
          {selectedCountry && (
            <CountryPanel
              countryName={selectedCountry}
              intel={selectedIntel}
              events={countryEvents}
              notes={countrySpecificNotes}
              localNote={countryNotes[selectedCountry] ?? ''}
              onLocalNoteChange={v => setCountryNotes(p => ({ ...p, [selectedCountry]: v }))}
            />
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
