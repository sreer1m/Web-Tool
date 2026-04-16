import { useState, useMemo, useRef, useCallback, useEffect } from "react";
import { ComposableMap, Geographies, Geography, Graticule, Marker, Sphere, ZoomableGroup } from "react-simple-maps";
import { geoCentroid } from "d3-geo";
import { partners, events, datacenters } from "@/data";
import type { Partner, Event, Datacenter } from "@/data/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Globe, Users, Calendar, Server, ExternalLink, Phone, Mail, Activity, Search, Building2, MapPin, AlertCircle, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";

const GEO_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-50m.json";

// Names as they appear in world-atlas geo data (used for Geography shape rendering)
const EUROPEAN_COUNTRIES = new Set([
  "Albania", "Andorra", "Armenia", "Austria", "Azerbaijan", "Belarus", "Belgium",
  "Bosnia and Herz.", "Bulgaria", "Croatia", "Cyprus", "Czech Republic", "Czechia",
  "Denmark", "Estonia", "Finland", "France", "Georgia", "Germany", "Greece",
  "Hungary", "Iceland", "Ireland", "Italy", "Kosovo", "Latvia", "Liechtenstein",
  "Lithuania", "Luxembourg", "Malta", "Moldova", "Monaco", "Montenegro",
  "Netherlands", "North Macedonia", "Norway", "Poland", "Portugal", "Romania",
  "Russia", "San Marino", "Serbia", "Slovakia", "Slovenia", "Spain", "Sweden",
  "Switzerland", "Turkey", "Ukraine", "United Kingdom",
]);

// Names as they appear in partner/event data files (used to filter markers)
const EUROPEAN_DATA_COUNTRIES = new Set([
  "Albania", "Andorra", "Armenia", "Austria", "Azerbaijan", "Belarus", "Belgium",
  "Bosnia and Herzegovina", "Bulgaria", "Croatia", "Cyprus", "Czech Republic",
  "Denmark", "Estonia", "Finland", "France", "Georgia", "Germany", "Greece",
  "Hungary", "Iceland", "Ireland", "Italy", "Kosovo", "Latvia", "Liechtenstein",
  "Lithuania", "Luxembourg", "Malta", "Moldova", "Monaco", "Montenegro",
  "Netherlands", "North Macedonia", "Norway", "Poland", "Portugal", "Romania",
  "Russia", "San Marino", "Serbia", "Slovakia", "Slovenia", "Spain", "Sweden",
  "Switzerland", "Turkey", "Ukraine", "United Kingdom",
]);

const YEARS = [2024, 2025, 2026];
const TYPES = ["Partners", "Datacenters", "Events", "Competitors", "Third Party Events"] as const;
type LayerType = typeof TYPES[number];
const TIERS = ["All", "platinum", "gold", "silver", "standard"];
const REGION_FILTERS = ["DACH", "Benelux", "UK & Ireland", "Nordics", "Eastern Europe", "Southern Europe"];

const REGION_COLORS: Record<string, string> = {
  "DACH": "#8b5cf6",
  "Benelux": "#14b8a6",
  "UK & Ireland": "#ec4899",
  "Nordics": "#3b82f6",
  "Eastern Europe": "#06b6d4",
  "Southern Europe": "#f97316",
};

// ─── Atlas Map Constants ─────────────────────────────────────────────────────

const WATER_BODIES: { name: string; coords: [number, number] }[] = [
  { name: "ATLANTIC OCEAN", coords: [-22, 50] },
  { name: "ARCTIC OCEAN", coords: [22, 74] },
  { name: "NORWEGIAN SEA", coords: [4, 68] },
  { name: "NORTH SEA", coords: [-1, 56.5] },
  { name: "BALTIC SEA", coords: [19, 58.5] },
  { name: "BLACK SEA", coords: [33, 43.5] },
  { name: "CASPIAN SEA", coords: [51.5, 42] },
  { name: "MEDITERRANEAN SEA", coords: [13, 36.5] },
];

const CAPITAL_CITIES: { name: string; coords: [number, number] }[] = [
  { name: "Reykjavik", coords: [-21.82, 64.13] },
  { name: "London", coords: [-0.12, 51.51] },
  { name: "Dublin", coords: [-6.27, 53.34] },
  { name: "Lisbon", coords: [-9.14, 38.72] },
  { name: "Madrid", coords: [-3.70, 40.42] },
  { name: "Paris", coords: [2.35, 48.85] },
  { name: "Brussels", coords: [4.35, 50.85] },
  { name: "Amsterdam", coords: [4.90, 52.37] },
  { name: "Luxembourg", coords: [6.13, 49.61] },
  { name: "Bern", coords: [7.45, 46.95] },
  { name: "Oslo", coords: [10.75, 59.91] },
  { name: "Copenhagen", coords: [12.57, 55.68] },
  { name: "Rome", coords: [12.50, 41.90] },
  { name: "Berlin", coords: [13.40, 52.52] },
  { name: "Vienna", coords: [16.37, 48.21] },
  { name: "Bratislava", coords: [17.11, 48.15] },
  { name: "Ljubljana", coords: [14.51, 46.06] },
  { name: "Zagreb", coords: [15.98, 45.81] },
  { name: "Stockholm", coords: [18.07, 59.33] },
  { name: "Sarajevo", coords: [18.41, 43.85] },
  { name: "Podgorica", coords: [19.26, 42.44] },
  { name: "Tirana", coords: [19.82, 41.33] },
  { name: "Warsaw", coords: [21.02, 52.24] },
  { name: "Skopje", coords: [21.43, 42.00] },
  { name: "Pristina", coords: [21.17, 42.67] },
  { name: "Belgrade", coords: [20.46, 44.80] },
  { name: "Prague", coords: [14.42, 50.08] },
  { name: "Helsinki", coords: [24.94, 60.17] },
  { name: "Tallinn", coords: [24.75, 59.44] },
  { name: "Vilnius", coords: [25.28, 54.69] },
  { name: "Chisinau", coords: [28.85, 47.00] },
  { name: "Kyiv", coords: [30.52, 50.45] },
  { name: "Riga", coords: [24.11, 56.95] },
  { name: "Minsk", coords: [27.57, 53.91] },
  { name: "Bucharest", coords: [26.10, 44.44] },
  { name: "Sofia", coords: [23.32, 42.70] },
  { name: "Budapest", coords: [19.04, 47.50] },
  { name: "Athens", coords: [23.73, 37.98] },
  { name: "Nicosia", coords: [33.37, 35.17] },
  { name: "Valletta", coords: [14.51, 35.90] },
  { name: "Moscow", coords: [37.62, 55.75] },
  { name: "Istanbul", coords: [29.01, 41.01] },
  { name: "Baku", coords: [49.87, 40.41] },
  { name: "Yerevan", coords: [44.51, 40.18] },
  { name: "Tbilisi", coords: [44.83, 41.69] },
];

// Labels that need abbreviation to fit in small countries
const COUNTRY_LABEL_MAP: Record<string, string> = {
  "United Kingdom": "UNITED\nKINGDOM",
  "Bosnia and Herz.": "BOS.\nHER.",
  "North Macedonia": "N. MACED.",
  "Czech Republic": "CZ. REP.",
  "Czechia": "CZECHIA",
  "Montenegro": "MONT.",
  "Switzerland": "SWITZ.",
  "Netherlands": "NETH.",
  "Luxembourg": "LUX.",
  "Slovakia": "SLVK.",
  "Slovenia": "SLVN.",
  "Croatia": "CRO.",
  "Kosovo": "KOS.",
  "Albania": "ALB.",
  "Moldova": "MOLDOVA",
  "Belarus": "BELARUS",
  "Lithuania": "LITHUANIA",
  "Latvia": "LATVIA",
  "Estonia": "ESTONIA",
};

// Countries too small to label or with off-screen centroids
const SKIP_LABEL = new Set(["Monaco", "Liechtenstein", "Andorra", "San Marino", "Malta", "Cyprus", "Russia"]);

// ─── Research Data Types ────────────────────────────────────────────────────

type ResearchCompetitorEntry = {
  competitor_name: string;
  coordinates: [number, number];
  headquarters: string;
  founded?: number;
  stock_listing?: string;
  revenue_fy2023?: string;
  website: string;
  category: string;
  countries_active_in: string[];
  detailed_description: {
    what_the_company_does: string;
    key_products: string[];
    target_customers: string[];
    deployment_type: string;
    industries_served: string[];
    differentiator_vs_manageengine: string;
  };
  proof_of_local_presence?: string;
  analyst_recognition?: string[];
  sources?: { type: string; url: string }[];
  verification_level?: string;
};

type ResearchCompetitor = ResearchCompetitorEntry & { region: string };

type ResearchEvent = {
  event_name: string;
  coordinates: [number, number];
  region: string;
  city: string;
  country: string;
  venue?: string;
  industry_focus?: string;
  target_audience?: string;
  scale?: string;
  official_website: string;
  latest_event_date?: string;
  upcoming_event_date?: string;
  key_stats_2025?: Record<string, unknown>;
  key_stats?: Record<string, unknown>;
  event_description?: {
    what_the_event_is_about: string;
    key_topics?: string[];
    typical_participants?: string[];
  };
  // Excel-imported fields
  priority_tier?: string;
  event_type?: string;
  organizer?: string;
  frequency?: string;
  business_goal?: string;
  competitive_intensity?: string;
  competitors_present?: string;
  relevant_solutions?: string;
  speaking_slot_available?: string;
  estimated_roi?: string;
  participation_type?: string;
};

type MEParticipation = {
  event_name: string;
  participated: "YES" | "NO" | "UNKNOWN";
  booth?: string;
  evidence?: { type: string; url: string; description: string }[];
  verification_level?: string;
};

type ResearchData = {
  competitors: { region: string; entries: ResearchCompetitorEntry[] }[];
  events: ResearchEvent[];
  manageengine_participation: MEParticipation[];
};

// ─── Panel types ────────────────────────────────────────────────────────────

type PanelType = "partner" | "datacenter" | "event" | "competitor" | "research_event" | null;

type TooltipData =
  | { type: "partner"; data: Partner }
  | { type: "datacenter"; data: Datacenter }
  | { type: "event"; data: Event }
  | { type: "competitor"; data: ResearchCompetitor }
  | { type: "research_event"; data: ResearchEvent; participation: MEParticipation | undefined }
  | null;

const tierColor: Record<string, string> = {
  platinum: "#6366f1",
  gold: "#f59e0b",
  silver: "#64748b",
  standard: "#94a3b8",
};

// ─── Tooltips ──────────────────────────────────────────────────────────────

function PartnerTooltip({ p }: { p: Partner }) {
  return (
    <div>
      <p className="font-semibold text-sm">{p.name}</p>
      <p className="text-muted-foreground text-xs mb-2">{p.city}, {p.country}</p>
      <div className="flex gap-1 flex-wrap mb-2">
        <span className="px-1.5 py-0.5 rounded text-xs font-medium capitalize"
          style={{ background: tierColor[p.tier || "standard"] + "22", color: tierColor[p.tier || "standard"], border: `1px solid ${tierColor[p.tier || "standard"]}44` }}>
          {p.tier}
        </span>
        <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${p.riskLevel === "low" ? "bg-green-100 text-green-700" : p.riskLevel === "medium" ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700"}`}>
          {p.riskLevel} risk
        </span>
      </div>
      {p.contactPerson && <p className="text-xs text-muted-foreground">{p.contactPerson}</p>}
      {p.phone && (
        <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
          <Phone className="h-3 w-3" /> {p.phone}
        </p>
      )}
      <p className="text-xs text-primary mt-1.5">Click for full details →</p>
    </div>
  );
}

function DatacenterTooltip({ dc }: { dc: Datacenter }) {
  return (
    <div>
      <p className="font-semibold text-sm">{dc.name}</p>
      <p className="text-muted-foreground text-xs mb-2">{dc.location}</p>
      <div className="flex gap-1 flex-wrap mb-2">
        <span className={`px-1.5 py-0.5 rounded text-xs font-medium capitalize ${dc.type === "primary" ? "bg-blue-100 text-blue-700" : dc.type === "secondary" ? "bg-purple-100 text-purple-700" : "bg-slate-100 text-slate-700"}`}>
          {dc.type}
        </span>
        <span className={`px-1.5 py-0.5 rounded text-xs font-medium capitalize ${dc.status === "operational" ? "bg-green-100 text-green-700" : dc.status === "maintenance" ? "bg-yellow-100 text-yellow-700" : "bg-slate-100 text-slate-700"}`}>
          {dc.status}
        </span>
      </div>
      {dc.status !== "planned" && (
        <div className="grid grid-cols-2 gap-x-4 gap-y-0.5 text-xs">
          <span className="text-muted-foreground">Capacity</span>
          <span className="font-medium">{dc.capacityUsed}%</span>
          <span className="text-muted-foreground">Latency</span>
          <span className="font-medium">{dc.latency}ms</span>
          <span className="text-muted-foreground">Uptime</span>
          <span className="font-medium">{dc.uptime}%</span>
        </div>
      )}
      <p className="text-xs text-primary mt-1.5">Click for full details →</p>
    </div>
  );
}

function EventTooltip({ e }: { e: Event }) {
  return (
    <div>
      <p className="font-semibold text-sm">{e.name}</p>
      <p className="text-muted-foreground text-xs mb-1">{e.location || e.country}</p>
      {e.date && <p className="text-xs text-muted-foreground mb-2">{e.date}</p>}
      <div className="flex gap-1 flex-wrap mb-2">
        <span className="px-1.5 py-0.5 rounded text-xs font-medium bg-orange-100 text-orange-700">{e.category || e.type}</span>
        {e.status && <span className="px-1.5 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-700">{e.status}</span>}
      </div>
      {e.strategicValue && <p className="text-xs text-muted-foreground">{e.strategicValue}</p>}
      {!e.strategicValue && e.registrations > 0 && (
        <div className="grid grid-cols-2 gap-x-4 gap-y-0.5 text-xs">
          <span className="text-muted-foreground">Registrations</span>
          <span className="font-medium">{e.registrations.toLocaleString()}</span>
          <span className="text-muted-foreground">Revenue</span>
          <span className="font-medium">€{(e.revenueImpact / 1e3).toFixed(0)}k</span>
        </div>
      )}
      <p className="text-xs text-primary mt-1.5">Click for full details →</p>
    </div>
  );
}

function CompetitorTooltip({ c }: { c: ResearchCompetitor }) {
  return (
    <div>
      <p className="font-semibold text-sm">{c.competitor_name}</p>
      <p className="text-muted-foreground text-xs mb-1">{c.headquarters}</p>
      <div className="flex gap-1 flex-wrap mb-2">
        <span className="px-1.5 py-0.5 rounded text-xs font-medium bg-violet-100 text-violet-700">{c.region}</span>
        <span className="px-1.5 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-600">{c.category}</span>
      </div>
      <p className="text-xs text-muted-foreground line-clamp-2">{c.detailed_description.differentiator_vs_manageengine}</p>
      <p className="text-xs text-primary mt-1.5">Click for full profile →</p>
    </div>
  );
}

function ResearchEventTooltip({ e, participation }: { e: ResearchEvent; participation: MEParticipation | undefined }) {
  const participated = participation?.participated;
  return (
    <div>
      <p className="font-semibold text-sm">{e.event_name}</p>
      <p className="text-muted-foreground text-xs mb-1">{e.city}, {e.country}</p>
      {e.upcoming_event_date && <p className="text-xs text-muted-foreground mb-2">Next: {e.upcoming_event_date}</p>}
      <div className="flex gap-1 flex-wrap mb-2">
        <span className="px-1.5 py-0.5 rounded text-xs font-medium"
          style={{ background: (REGION_COLORS[e.region] || "#6b7280") + "22", color: REGION_COLORS[e.region] || "#6b7280" }}>
          {e.region}
        </span>
        <span className={`px-1.5 py-0.5 rounded text-xs font-medium flex items-center gap-0.5 ${participated === "YES" ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-600"}`}>
          ME: {participated === "YES" ? "Participated" : "Not Participated"}
        </span>
      </div>
      <p className="text-xs text-primary mt-1">Click for details →</p>
    </div>
  );
}

// ─── Participation Badge ────────────────────────────────────────────────────

function ParticipationBadge({ status }: { status: "YES" | "NO" | "UNKNOWN" | undefined }) {
  if (status === "YES") return <Badge className="bg-green-100 text-green-700 border-green-200 gap-1"><CheckCircle2 className="h-3 w-3" />Participated</Badge>;
  return <Badge className="bg-slate-100 text-slate-600 border-slate-200 gap-1"><AlertCircle className="h-3 w-3" />Not Participated</Badge>;
}

// ─── Main Component ─────────────────────────────────────────────────────────

export default function EuropeMap() {
  // ── Existing filter state ──
  const [selectedYears, setSelectedYears] = useState<number[]>([2024, 2025, 2026]);
  const [activeLayer, setActiveLayer] = useState<LayerType>("Partners");
  const [tierFilter, setTierFilter] = useState("All");
  const [panelType, setPanelType] = useState<PanelType>(null);
  const [panelData, setPanelData] = useState<Partner | Datacenter | Event | ResearchCompetitor | ResearchEvent | null>(null);
  const [tooltip, setTooltip] = useState<TooltipData>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // ── Research data state ──
  const [researchData, setResearchData] = useState<ResearchData | null>(null);
  const [researchLoading, setResearchLoading] = useState(false);
  const [researchError, setResearchError] = useState<string | null>(null);

  // ── Region filter ──
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);

  // ── Search ──
  const [searchQuery, setSearchQuery] = useState("");

  // ── Participation filter (for research events) ──
  const [participationFilter, setParticipationFilter] = useState<"all" | "participated" | "not_participated">("all");

  // ── Country click ──
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);

  // ── Fetch research data ──
  useEffect(() => {
    setResearchLoading(true);
    fetch("/research-data.json")
      .then(res => {
        if (!res.ok) throw new Error(`Failed to load research data: ${res.status}`);
        return res.json();
      })
      .then((data: ResearchData) => {
        setResearchData(data);
        setResearchError(null);
      })
      .catch((err: Error) => {
        setResearchError(err.message);
      })
      .finally(() => setResearchLoading(false));
  }, []);

  // ── Toggles ──
  const toggleYear = (y: number) =>
    setSelectedYears(prev => prev.includes(y) ? prev.filter(v => v !== y) : [...prev, y]);

  // ── Filters ──
  const filteredPartners = useMemo(() => {
    if (activeLayer !== "Partners") return [];
    return partners.filter(p => {
      if (!EUROPEAN_DATA_COUNTRIES.has(p.country)) return false;
      if (tierFilter !== "All" && p.tier !== tierFilter) return false;
      if (!p.yearsActive.some(y => selectedYears.includes(y))) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return (
          p.name.toLowerCase().includes(q) ||
          p.city.toLowerCase().includes(q) ||
          p.country.toLowerCase().includes(q) ||
          (p.contactPerson || "").toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [selectedYears, activeLayer, tierFilter, searchQuery]);

  const filteredEvents = useMemo(() => {
    if (activeLayer !== "Events") return [];
    return events.filter(e =>
      selectedYears.includes(e.year) && EUROPEAN_DATA_COUNTRIES.has(e.country)
    );
  }, [selectedYears, activeLayer]);

  const filteredDCs = useMemo(() =>
    activeLayer === "Datacenters" ? datacenters : [],
    [activeLayer]
  );

  // ── Flat competitors ──
  const flatCompetitors = useMemo<ResearchCompetitor[]>(() => {
    if (!researchData) return [];
    return researchData.competitors.flatMap(rg =>
      rg.entries.map(entry => ({ ...entry, region: rg.region }))
    );
  }, [researchData]);


  const getParticipation = useCallback((eventName: string): MEParticipation | undefined => {
    if (!researchData) return undefined;
    const nameLower = eventName.toLowerCase();
    return researchData.manageengine_participation.find(p =>
      p.event_name.toLowerCase().includes(nameLower) ||
      nameLower.includes(p.event_name.toLowerCase().split(" (")[0])
    );
  }, [researchData]);

  // ── Filtered competitors ──
  const filteredCompetitors = useMemo(() => {
    if (activeLayer !== "Competitors") return [];
    return flatCompetitors.filter(c => {
      if (selectedRegion && c.region !== selectedRegion) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return (
          c.competitor_name.toLowerCase().includes(q) ||
          c.category.toLowerCase().includes(q) ||
          c.headquarters.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [flatCompetitors, activeLayer, selectedRegion, searchQuery]);

  // ── Filtered research events ──
  const filteredResearchEvents = useMemo(() => {
    if (!researchData || activeLayer !== "Third Party Events") return [];
    return researchData.events.filter(e => {
      if (selectedRegion && e.region !== selectedRegion) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        if (
          !e.event_name.toLowerCase().includes(q) &&
          !e.city.toLowerCase().includes(q) &&
          !e.country.toLowerCase().includes(q)
        ) return false;
      }
      if (participationFilter !== "all") {
        const p = getParticipation(e.event_name);
        if (participationFilter === "participated" && p?.participated !== "YES") return false;
        if (participationFilter === "not_participated" && p?.participated === "YES") return false;
      }
      return true;
    });
  }, [researchData, activeLayer, selectedRegion, searchQuery, participationFilter, getParticipation]);

  // ── Panel open/close ──
  const openPartner = (p: Partner) => { setPanelType("partner"); setPanelData(p); };
  const openDC = (dc: Datacenter) => { setPanelType("datacenter"); setPanelData(dc); };
  const openEvent = (e: Event) => { setPanelType("event"); setPanelData(e); };
  const openCompetitor = (c: ResearchCompetitor) => { setPanelType("competitor"); setPanelData(c); };
  const openResearchEvent = (e: ResearchEvent) => { setPanelType("research_event"); setPanelData(e); };
  const closePanel = () => { setPanelType(null); setPanelData(null); };

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (rect) setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  }, []);

  const clearTooltip = useCallback(() => setTooltip(null), []);

  const tooltipStyle = useMemo(() => {
    const containerWidth = containerRef.current?.offsetWidth ?? 800;
    const containerHeight = containerRef.current?.offsetHeight ?? 500;
    const tooltipW = 230;
    const tooltipH = 170;
    const x = mousePos.x + 14;
    const y = mousePos.y - 10;
    return {
      left: x + tooltipW > containerWidth ? mousePos.x - tooltipW - 6 : x,
      top: y + tooltipH > containerHeight ? mousePos.y - tooltipH - 6 : y,
    };
  }, [mousePos]);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold flex items-center gap-2">
          <Globe className="h-6 w-6 text-primary" /> Europe Intelligence Map
        </h1>
        <p className="text-sm text-muted-foreground">Click any country to see partners, events, and competitors. Use layers to toggle what's shown on the map.</p>
      </div>

      {/* Research data status */}
      {researchError && (
        <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          <span>Research data unavailable: {researchError}</span>
        </div>
      )}
      {researchLoading && (
        <div className="text-sm text-muted-foreground bg-accent/50 rounded-lg px-3 py-2">
          Loading competitor intelligence data…
        </div>
      )}

      {/* Filters */}
      <Card>
        <CardContent className="p-4 space-y-3">
          <div className="flex flex-wrap gap-6">
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-2">Year</p>
              <div className="flex gap-1">
                {YEARS.map(y => (
                  <Button key={y} size="sm" variant={selectedYears.includes(y) ? "default" : "outline"}
                    onClick={() => toggleYear(y)} className="text-xs h-7">{y}</Button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-2">Layer (select one)</p>
              <div className="flex gap-1 flex-wrap">
                {TYPES.map(t => (
                  <Button key={t} size="sm" variant={activeLayer === t ? "default" : "outline"}
                    onClick={() => setActiveLayer(t)} className="text-xs h-7">{t}</Button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-2">Partner Tier</p>
              <div className="flex gap-1 flex-wrap">
                {TIERS.map(t => (
                  <Button key={t} size="sm" variant={tierFilter === t ? "default" : "outline"}
                    onClick={() => setTierFilter(t)} className="text-xs h-7 capitalize">{t}</Button>
                ))}
              </div>
            </div>
          </div>

          {/* Region filter bar */}
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-2">Region Filter (Competitors & Research Events)</p>
            <div className="flex gap-1.5 flex-wrap">
              <Button
                size="sm"
                variant={selectedRegion === null ? "default" : "outline"}
                onClick={() => setSelectedRegion(null)}
                className="text-xs h-7"
              >
                All Regions
              </Button>
              {REGION_FILTERS.map(r => (
                <Button
                  key={r}
                  size="sm"
                  variant={selectedRegion === r ? "default" : "outline"}
                  onClick={() => setSelectedRegion(prev => prev === r ? null : r)}
                  className="text-xs h-7"
                  style={selectedRegion === r ? {} : { borderColor: REGION_COLORS[r] + "66", color: REGION_COLORS[r] }}
                >
                  {r}
                </Button>
              ))}
            </div>
          </div>

          {/* Search + Participation filter */}
          <div className="flex gap-3 flex-wrap">
            <div className="relative flex-1 min-w-48 max-w-xs">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
              <Input
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search competitors, events, countries…"
                className="pl-8 h-8 text-xs"
              />
            </div>
            <div>
              <div className="flex gap-1">
                <p className="text-xs text-muted-foreground self-center mr-1">ME at event:</p>
                {(["all", "participated", "not_participated"] as const).map(f => (
                  <Button key={f} size="sm" variant={participationFilter === f ? "default" : "outline"}
                    onClick={() => setParticipationFilter(f)} className="text-xs h-8 capitalize">
                    {f === "not_participated" ? "Not Participated" : f === "participated" ? "Participated" : "All"}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Map */}
      <Card>
        <CardContent className="p-0 overflow-hidden rounded-lg">
          <div
            ref={containerRef}
            className="relative"
            onMouseMove={handleMouseMove}
            onMouseLeave={clearTooltip}
          >
            <ComposableMap
              projection="geoMercator"
              projectionConfig={{ center: [15, 54], scale: 680 }}
              style={{ width: "100%", height: "auto", background: "#9cc8e2" }}
              viewBox="0 0 800 560"
            >
              <ZoomableGroup>
                {/* Ocean background */}
                <Sphere id="rsm-sphere" fill="#9cc8e2" stroke="#7aade0" strokeWidth={0.5} />

                {/* Lat/lon grid */}
                <Graticule stroke="#7aade0" strokeWidth={0.3} step={[10, 10]} />

                {/* ── All world countries (geographic context) + European countries styled ── */}
                <Geographies geography={GEO_URL}>
                  {({ geographies }) => {
                    const regionMap: Record<string, string[]> = {
                      "DACH": ["Germany", "Austria", "Switzerland"],
                      "Benelux": ["Netherlands", "Belgium", "Luxembourg"],
                      "UK & Ireland": ["United Kingdom", "Ireland"],
                      "Nordics": ["Finland", "Sweden", "Norway", "Denmark", "Iceland"],
                      "Eastern Europe": ["Poland", "Czech Republic", "Czechia", "Hungary", "Romania", "Bulgaria", "Latvia", "Lithuania", "Estonia", "Croatia", "Serbia", "Slovakia", "Slovenia", "Albania", "North Macedonia", "Montenegro", "Armenia", "Azerbaijan", "Georgia", "Belarus", "Ukraine", "Moldova", "Kosovo"],
                      "Southern Europe": ["France", "Spain", "Italy", "Portugal", "Greece", "Turkey", "Cyprus"],
                    };
                    const europeanGeos = geographies.filter(geo => EUROPEAN_COUNTRIES.has(geo.properties?.name as string));

                    return (
                      <>
                        {/* Non-European countries as muted tan (geographic context) */}
                        {geographies
                          .filter(geo => !EUROPEAN_COUNTRIES.has(geo.properties?.name as string))
                          .map(geo => (
                            <Geography
                              key={geo.rsmKey}
                              geography={geo}
                              fill="#d6c9a8"
                              stroke="#b8a888"
                              strokeWidth={0.3}
                              style={{ default: { outline: "none" }, hover: { outline: "none", fill: "#cfc0a0" }, pressed: { outline: "none" } }}
                            />
                          ))
                        }

                        {/* European country shapes */}
                        {europeanGeos.map(geo => {
                          const name = geo.properties?.name as string | undefined;
                          const regionForCountry = name
                            ? (REGION_FILTERS.find(r => regionMap[r]?.includes(name)) ?? null)
                            : null;
                          const isHighlighted = !!(selectedRegion && regionForCountry === selectedRegion);
                          const isFaded = !!(selectedRegion && regionForCountry !== selectedRegion);
                          const regionColor = regionForCountry ? REGION_COLORS[regionForCountry] : null;

                          // Atlas beige base, with optional region tinting
                          const fill = isHighlighted
                            ? (regionColor ? regionColor + "88" : "#ddc898")
                            : isFaded
                              ? "#e8ddc8"
                              : regionColor
                                ? regionColor + "38"
                                : "#f0e6cc";

                          return (
                            <Geography
                              key={geo.rsmKey}
                              geography={geo}
                              onClick={() => { if (name) setSelectedCountry(name); }}
                              fill={fill}
                              stroke="#8b7355"
                              strokeWidth={isHighlighted ? 1.2 : 0.6}
                              style={{
                                default: { outline: "none", cursor: "pointer" },
                                hover: { fill: regionColor ? regionColor + "66" : "#ddc898", outline: "none", cursor: "pointer" },
                                pressed: { outline: "none" },
                              }}
                            />
                          );
                        })}

                        {/* Country name labels (uppercase bold atlas style) */}
                        {europeanGeos.map(geo => {
                          const name = geo.properties?.name as string;
                          if (SKIP_LABEL.has(name)) return null;
                          const centroid = geoCentroid(geo);
                          if (!centroid || isNaN(centroid[0]) || isNaN(centroid[1])) return null;
                          const rawLabel = COUNTRY_LABEL_MAP[name] ?? name.toUpperCase();
                          const lines = rawLabel.split("\n");
                          return (
                            <Marker key={`lbl-${name}`} coordinates={centroid as [number, number]}>
                              <text
                                textAnchor="middle"
                                dominantBaseline="central"
                                style={{ pointerEvents: "none", userSelect: "none" }}
                              >
                                {lines.map((line, i) => (
                                  <tspan
                                    key={i}
                                    x={0}
                                    dy={i === 0 ? (lines.length > 1 ? "-0.5em" : "0") : "1.1em"}
                                    style={{
                                      fontSize: 5.5,
                                      fontFamily: "'Arial Narrow', Arial, sans-serif",
                                      fontWeight: 700,
                                      letterSpacing: 0.4,
                                      fill: "#1a1205",
                                      stroke: "#f0e6cc",
                                      strokeWidth: 2,
                                      paintOrder: "stroke",
                                    }}
                                  >
                                    {line}
                                  </tspan>
                                ))}
                              </text>
                            </Marker>
                          );
                        })}
                      </>
                    );
                  }}
                </Geographies>

                {/* ── Russia label (fixed position — geographic centroid is in Siberia, off-screen) ── */}
                <Marker coordinates={[44, 58]}>
                  <text
                    textAnchor="middle"
                    dominantBaseline="central"
                    style={{ pointerEvents: "none", userSelect: "none" }}
                  >
                    <tspan
                      style={{
                        fontSize: 6.5,
                        fontFamily: "'Arial Narrow', Arial, sans-serif",
                        fontWeight: 700,
                        letterSpacing: 0.4,
                        fill: "#1a1205",
                        stroke: "#f0e6cc",
                        strokeWidth: 2,
                        paintOrder: "stroke",
                      }}
                    >
                      RUSSIA
                    </tspan>
                  </text>
                </Marker>

                {/* ── Water body labels ── */}
                {WATER_BODIES.map(wb => (
                  <Marker key={wb.name} coordinates={wb.coords}>
                    <text
                      textAnchor="middle"
                      dominantBaseline="central"
                      style={{
                        fontSize: 5.5,
                        fontFamily: "'Arial Narrow', Arial, sans-serif",
                        fontWeight: 600,
                        fontStyle: "italic",
                        fill: "#1e5a8a",
                        stroke: "#9cc8e2",
                        strokeWidth: 1.5,
                        paintOrder: "stroke",
                        pointerEvents: "none",
                        userSelect: "none",
                        letterSpacing: 0.6,
                      }}
                    >
                      {wb.name}
                    </text>
                  </Marker>
                ))}

                {/* ── Capital city dots + names (always visible as geographic reference) ── */}
                {CAPITAL_CITIES.map(city => (
                  <Marker key={`cap-${city.name}`} coordinates={city.coords}>
                    {/* Star-like dot */}
                    <circle r={1.2} fill="#1a1205" stroke="#f0e6cc" strokeWidth={0.5} style={{ pointerEvents: "none" }} />
                    <text
                      textAnchor="middle"
                      y={-4}
                      style={{
                        fontSize: 4,
                        fontFamily: "Arial, sans-serif",
                        fontWeight: 400,
                        fill: "#1a1205",
                        stroke: "#f0e6cc",
                        strokeWidth: 1.5,
                        paintOrder: "stroke",
                        pointerEvents: "none",
                        userSelect: "none",
                      }}
                    >
                      {city.name}
                    </text>
                  </Marker>
                ))}

                {/* ── Research Events (triangles) ── */}
                {filteredResearchEvents.map(e => {
                  const participation = getParticipation(e.event_name);
                  const participated = participation?.participated;
                  const fillColor = participated === "YES" ? "#16a34a" : "#94a3b8";
                  return (
                    <Marker key={`re-${e.event_name}`} coordinates={e.coordinates}>
                      <polygon
                        points="0,-6 5.2,3 -5.2,3"
                        fill={fillColor}
                        stroke="#fff"
                        strokeWidth={1.5}
                        className="cursor-pointer"
                        onMouseEnter={() => setTooltip({ type: "research_event", data: e, participation })}
                        onMouseLeave={clearTooltip}
                        onClick={() => openResearchEvent(e)}
                      />
                    </Marker>
                  );
                })}

                {/* ── Events (orange circles) ── */}
                {filteredEvents.map(e => (
                  <Marker key={e.id} coordinates={e.coordinates}>
                    <circle
                      r={4}
                      fill="hsl(25, 95%, 53%)"
                      stroke="#fff"
                      strokeWidth={1.5}
                      className="cursor-pointer transition-opacity"
                      onMouseEnter={() => setTooltip({ type: "event", data: e })}
                      onMouseLeave={clearTooltip}
                      onClick={() => openEvent(e)}
                    />
                  </Marker>
                ))}

                {/* ── Partners (colored by tier) ── */}
                {filteredPartners.map(p => (
                  <Marker key={p.id} coordinates={p.coordinates}>
                    <circle
                      r={p.tier === "platinum" ? 7 : p.tier === "gold" ? 6 : 5}
                      fill={tierColor[p.tier || "standard"]}
                      stroke="#fff"
                      strokeWidth={1.5}
                      className="cursor-pointer transition-opacity"
                      onMouseEnter={() => setTooltip({ type: "partner", data: p })}
                      onMouseLeave={clearTooltip}
                      onClick={() => openPartner(p)}
                    />
                  </Marker>
                ))}

                {/* ── Datacenters (green squares) ── */}
                {filteredDCs.map(dc => (
                  <Marker key={dc.id} coordinates={dc.coordinates}>
                    <rect
                      x={-6} y={-6} width={12} height={12}
                      fill={dc.status === "operational" ? "#16a34a" : dc.status === "maintenance" ? "#ca8a04" : "#94a3b8"}
                      stroke="#fff"
                      strokeWidth={1.5}
                      rx={2}
                      className="cursor-pointer transition-opacity"
                      onMouseEnter={() => setTooltip({ type: "datacenter", data: dc })}
                      onMouseLeave={clearTooltip}
                      onClick={() => openDC(dc)}
                    />
                  </Marker>
                ))}

                {/* ── Competitors (purple diamonds) ── */}
                {filteredCompetitors.map(c => {
                  const rColor = REGION_COLORS[c.region] ?? "#7c3aed";
                  return (
                    <Marker key={`comp-${c.competitor_name}`} coordinates={c.coordinates}>
                      <polygon
                        points="0,-7 6,0 0,7 -6,0"
                        fill={rColor}
                        stroke="#fff"
                        strokeWidth={1.5}
                        className="cursor-pointer"
                        onMouseEnter={() => setTooltip({ type: "competitor", data: c })}
                        onMouseLeave={clearTooltip}
                        onClick={() => openCompetitor(c)}
                      />
                    </Marker>
                  );
                })}
              </ZoomableGroup>
            </ComposableMap>

            {/* Hover Tooltip */}
            {tooltip && (
              <div
                className="absolute z-50 bg-card border rounded-lg shadow-xl p-3 pointer-events-none"
                style={{
                  left: tooltipStyle.left,
                  top: tooltipStyle.top,
                  minWidth: 190,
                  maxWidth: 230,
                }}
              >
                {tooltip.type === "partner" && <PartnerTooltip p={tooltip.data as Partner} />}
                {tooltip.type === "datacenter" && <DatacenterTooltip dc={tooltip.data as Datacenter} />}
                {tooltip.type === "event" && <EventTooltip e={tooltip.data as Event} />}
                {tooltip.type === "competitor" && <CompetitorTooltip c={tooltip.data as ResearchCompetitor} />}
                {tooltip.type === "research_event" && (
                  <ResearchEventTooltip
                    e={tooltip.data as ResearchEvent}
                    participation={(tooltip as { type: "research_event"; data: ResearchEvent; participation: MEParticipation | undefined }).participation}
                  />
                )}
              </div>
            )}
          </div>

          {/* Legend */}
          <div className="flex flex-wrap items-center gap-4 p-3 border-t text-xs text-muted-foreground">
            {activeLayer === "Partners" && <>
              <span className="flex items-center gap-1.5 font-medium text-foreground">Partners ({filteredPartners.length}):</span>
              <span className="flex items-center gap-1"><span className="h-3 w-3 rounded-full inline-block" style={{ backgroundColor: "#6366f1" }} /> Platinum ({filteredPartners.filter(p => p.tier === "platinum").length})</span>
              <span className="flex items-center gap-1"><span className="h-3 w-3 rounded-full inline-block" style={{ backgroundColor: "#f59e0b" }} /> Gold ({filteredPartners.filter(p => p.tier === "gold").length})</span>
              <span className="flex items-center gap-1"><span className="h-3 w-3 rounded-full inline-block" style={{ backgroundColor: "#64748b" }} /> Silver ({filteredPartners.filter(p => p.tier === "silver").length})</span>
              <span className="flex items-center gap-1"><span className="h-3 w-3 rounded-full inline-block" style={{ backgroundColor: "#94a3b8" }} /> Standard ({filteredPartners.filter(p => p.tier === "standard").length})</span>
            </>}
            {activeLayer === "Events" && <span className="flex items-center gap-1"><span className="h-3 w-3 rounded-full bg-orange-500 inline-block" /> Events ({filteredEvents.length})</span>}
            {activeLayer === "Datacenters" && <span className="flex items-center gap-1"><span className="h-3 w-3 rounded bg-green-600 inline-block" /> Datacenters ({filteredDCs.length})</span>}
            {activeLayer === "Competitors" && <span className="flex items-center gap-1">
              <svg width="12" height="12" viewBox="0 0 12 12"><polygon points="6,0 12,6 6,12 0,6" fill="#7c3aed" /></svg>
              Competitors ({filteredCompetitors.length}) — colored by region
            </span>}
            {activeLayer === "Third Party Events" && <span className="flex items-center gap-1">
              <svg width="12" height="10" viewBox="0 0 12 10"><polygon points="6,0 12,10 0,10" fill="#16a34a" /></svg>
              Research Events ({filteredResearchEvents.length}) — ▲ green = ME participated, grey = not participated
            </span>}
          </div>
        </CardContent>
      </Card>

      {/* ─── Partner Detail Sheet ─── */}
      <Sheet open={panelType === "partner"} onOpenChange={closePanel}>
        <SheetContent className="overflow-y-auto">
          {panelType === "partner" && panelData && (() => {
            const p = panelData as Partner;
            const pEvents = events.filter(e => e.partnerId === p.id);
            return (
              <>
                <SheetHeader>
                  <SheetTitle className="flex items-center gap-2"><Users className="h-4 w-4" /> {p.name}</SheetTitle>
                  <SheetDescription>{p.city}, {p.country}</SheetDescription>
                </SheetHeader>
                <div className="space-y-4 mt-4">
                  <div className="flex gap-2 flex-wrap">
                    <Badge variant={p.tier === "platinum" ? "default" : p.tier === "gold" ? "secondary" : "outline"} className="capitalize">{p.tier}</Badge>
                    <Badge variant={p.riskLevel === "low" ? "outline" : p.riskLevel === "medium" ? "secondary" : "destructive"}>{p.riskLevel} risk</Badge>
                    <Badge variant="outline">{p.yearsActive.length} yrs active</Badge>
                  </div>
                  <div className="space-y-1.5 text-sm">
                    {p.address && <p className="text-muted-foreground text-xs">{p.address}</p>}
                    {p.contactPerson && <div className="flex items-center gap-2"><Users className="h-3.5 w-3.5 text-muted-foreground" /><span>{p.contactPerson}</span></div>}
                    {p.phone && <div className="flex items-center gap-2"><Phone className="h-3.5 w-3.5 text-muted-foreground" /><a href={`tel:${p.phone}`} className="text-primary hover:underline">{p.phone}</a></div>}
                    {p.email && <div className="flex items-center gap-2"><Mail className="h-3.5 w-3.5 text-muted-foreground" /><a href={`mailto:${p.email}`} className="text-primary hover:underline">{p.email}</a></div>}
                    {p.website && <div className="flex items-center gap-2"><ExternalLink className="h-3.5 w-3.5 text-muted-foreground" /><a href={p.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{p.website}</a></div>}
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      ["Years Active", p.yearsActive.join(", ")],
                      ["Events", pEvents.length],
                    ].map(([l, v]) => (
                      <div key={String(l)} className="bg-accent rounded-lg p-2.5">
                        <p className="text-xs text-muted-foreground">{l}</p>
                        <p className="text-sm font-semibold mt-0.5">{v}</p>
                      </div>
                    ))}
                  </div>
                  {pEvents.length > 0 && (
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> Events</p>
                      <div className="space-y-1.5">
                        {pEvents.slice(0, 4).map(e => (
                          <div key={e.id} className="flex justify-between text-xs px-2 py-1.5 bg-accent/50 rounded">
                            <span>{e.name}</span>
                            <span className="text-muted-foreground">{e.date || e.year}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  <Link to={`/partners/${p.id}`} onClick={closePanel}>
                    <Button className="w-full mt-2" size="sm">View Full Partner Profile →</Button>
                  </Link>
                </div>
              </>
            );
          })()}
        </SheetContent>
      </Sheet>

      {/* ─── Datacenter Detail Sheet ─── */}
      <Sheet open={panelType === "datacenter"} onOpenChange={closePanel}>
        <SheetContent className="overflow-y-auto">
          {panelType === "datacenter" && panelData && (() => {
            const dc = panelData as Datacenter;
            return (
              <>
                <SheetHeader>
                  <SheetTitle className="flex items-center gap-2"><Server className="h-4 w-4" /> {dc.name}</SheetTitle>
                  <SheetDescription>{dc.location}</SheetDescription>
                </SheetHeader>
                <div className="space-y-4 mt-4">
                  <div className="flex gap-2 flex-wrap">
                    <Badge variant={dc.type === "primary" ? "default" : dc.type === "secondary" ? "secondary" : "outline"} className="capitalize">{dc.type}</Badge>
                    <Badge variant={dc.status === "operational" ? "outline" : dc.status === "maintenance" ? "secondary" : "destructive"} className="capitalize">{dc.status}</Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      ["Region", dc.region],
                      ["Uptime", dc.status === "planned" ? "N/A" : `${dc.uptime}%`],
                      ["Capacity Used", dc.status === "planned" ? "N/A" : `${dc.capacityUsed}%`],
                      ["Latency", dc.status === "planned" ? "N/A" : `${dc.latency}ms`],
                    ].map(([l, v]) => (
                      <div key={String(l)} className="bg-accent rounded-lg p-2.5">
                        <p className="text-xs text-muted-foreground">{l}</p>
                        <p className="text-sm font-semibold mt-0.5">{v}</p>
                      </div>
                    ))}
                  </div>
                  {dc.status !== "planned" && (
                    <>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Capacity</p>
                        <div className="h-2 bg-accent rounded-full overflow-hidden">
                          <div className="h-full rounded-full bg-primary" style={{ width: `${dc.capacityUsed}%` }} />
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">{dc.capacityUsed}% utilized</p>
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5 mb-1">
                          <Activity className="h-3.5 w-3.5 text-green-600" />
                          <p className="text-xs text-muted-foreground">Uptime</p>
                        </div>
                        <div className="h-2 bg-accent rounded-full overflow-hidden">
                          <div className="h-full rounded-full bg-green-500" style={{ width: `${dc.uptime}%` }} />
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">{dc.uptime}% SLA</p>
                      </div>
                    </>
                  )}
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-2">Hosted Services</p>
                    <div className="flex flex-wrap gap-1.5">
                      {dc.services.map(s => (
                        <Badge key={s} variant="outline" className="text-xs">{s}</Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            );
          })()}
        </SheetContent>
      </Sheet>

      {/* ─── Event Detail Sheet ─── */}
      <Sheet open={panelType === "event"} onOpenChange={closePanel}>
        <SheetContent className="overflow-y-auto">
          {panelType === "event" && panelData && (() => {
            const e = panelData as Event;
            const hostPartner = e.partnerId ? partners.find(p => p.id === e.partnerId) : null;
            return (
              <>
                <SheetHeader>
                  <SheetTitle className="flex items-center gap-2"><Calendar className="h-4 w-4" /> {e.name}</SheetTitle>
                  <SheetDescription>{e.location || e.country} · {e.date || e.year} · {e.category || e.type}</SheetDescription>
                </SheetHeader>
                <div className="space-y-4 mt-4">
                  <div className="flex gap-2 flex-wrap">
                    <Badge variant="outline">{e.category || e.type}</Badge>
                    {e.eventKind && <Badge variant={e.eventKind === "owned" ? "default" : "secondary"} className="capitalize">{e.eventKind}</Badge>}
                    {e.status && <Badge variant="outline">{e.status}</Badge>}
                  </div>
                  {e.audience && <div className="text-sm"><span className="text-muted-foreground text-xs">Audience: </span>{e.audience}</div>}
                  {e.strategicValue && <div className="bg-blue-50 rounded-lg p-3 text-xs text-blue-800">{e.strategicValue}</div>}
                  {(e.registrations > 0 || e.revenueImpact > 0) && (
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        e.budget > 0 && ["Budget", `€${(e.budget / 1e3).toFixed(0)}k`],
                        e.revenueImpact > 0 && ["Revenue Impact", `€${(e.revenueImpact / 1e3).toFixed(0)}k`],
                        e.registrations > 0 && ["Registrations", e.registrations.toLocaleString()],
                        e.attendance > 0 && ["Attendance", e.attendance.toLocaleString()],
                        e.leads > 0 && ["Leads", e.leads],
                        e.conversions > 0 && ["Conversions", e.conversions],
                        e.conversionRate > 0 && ["Conv. Rate", `${e.conversionRate}%`],
                        e.budget > 0 && e.revenueImpact > 0 && ["ROI", `${(e.revenueImpact / e.budget).toFixed(1)}x`],
                      ].filter(Boolean).map(item => {
                        const [l, v] = item as [string, string | number];
                        return (
                          <div key={String(l)} className="bg-accent rounded-lg p-2.5">
                            <p className="text-xs text-muted-foreground">{l}</p>
                            <p className="text-sm font-semibold mt-0.5">{v}</p>
                          </div>
                        );
                      })}
                    </div>
                  )}
                  {hostPartner && (
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-1">Hosted by</p>
                      <div className="flex items-center justify-between bg-accent/50 rounded-lg px-3 py-2">
                        <span className="text-sm">{hostPartner.name}</span>
                        <Link to={`/partners/${hostPartner.id}`} onClick={closePanel}>
                          <Button size="sm" variant="ghost" className="h-6 text-xs text-primary">View →</Button>
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              </>
            );
          })()}
        </SheetContent>
      </Sheet>

      {/* ─── Competitor Detail Sheet ─── */}
      <Sheet open={panelType === "competitor"} onOpenChange={closePanel}>
        <SheetContent className="overflow-y-auto w-full sm:max-w-lg">
          {panelType === "competitor" && panelData && (() => {
            const c = panelData as ResearchCompetitor;
            const rColor = REGION_COLORS[c.region] ?? "#7c3aed";
            return (
              <>
                <SheetHeader>
                  <SheetTitle className="flex items-center gap-2">
                    <Building2 className="h-4 w-4" /> {c.competitor_name}
                  </SheetTitle>
                  <SheetDescription>{c.headquarters}</SheetDescription>
                </SheetHeader>
                <div className="space-y-5 mt-4">
                  {/* Badges */}
                  <div className="flex gap-2 flex-wrap">
                    <Badge style={{ background: rColor + "22", color: rColor, border: `1px solid ${rColor}44` }}>{c.region}</Badge>
                    <Badge variant="outline">{c.category}</Badge>
                    {c.founded && <Badge variant="outline">Est. {c.founded}</Badge>}
                    {c.stock_listing && <Badge variant="outline" className="text-xs">{c.stock_listing}</Badge>}
                    {c.verification_level === "high" && <Badge className="bg-green-100 text-green-700 border-green-200">Verified</Badge>}
                  </div>

                  {/* Quick links */}
                  {c.website && (
                    <a href={c.website} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-xs text-primary hover:underline">
                      <ExternalLink className="h-3.5 w-3.5" /> {c.website}
                    </a>
                  )}

                  {/* Overview */}
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1.5">Overview</p>
                    <p className="text-sm leading-relaxed">{c.detailed_description.what_the_company_does}</p>
                  </div>

                  {/* Key Products */}
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1.5">Key Products</p>
                    <ul className="space-y-1">
                      {c.detailed_description.key_products.map((kp, i) => (
                        <li key={i} className="text-xs flex gap-2">
                          <span className="text-muted-foreground mt-0.5">•</span>
                          <span>{kp}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Details grid */}
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-accent rounded-lg p-2.5">
                      <p className="text-xs text-muted-foreground">Deployment</p>
                      <p className="text-xs font-medium mt-0.5">{c.detailed_description.deployment_type}</p>
                    </div>
                    {c.revenue_fy2023 && (
                      <div className="bg-accent rounded-lg p-2.5">
                        <p className="text-xs text-muted-foreground">Revenue (FY2023)</p>
                        <p className="text-xs font-medium mt-0.5">{c.revenue_fy2023}</p>
                      </div>
                    )}
                  </div>

                  {/* Target customers */}
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1.5">Target Customers</p>
                    <div className="flex flex-wrap gap-1.5">
                      {c.detailed_description.target_customers.map((tc, i) => (
                        <Badge key={i} variant="outline" className="text-xs">{tc}</Badge>
                      ))}
                    </div>
                  </div>

                  {/* Industries */}
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1.5">Industries Served</p>
                    <div className="flex flex-wrap gap-1.5">
                      {c.detailed_description.industries_served.map((ind, i) => (
                        <Badge key={i} variant="secondary" className="text-xs">{ind}</Badge>
                      ))}
                    </div>
                  </div>

                  {/* Active in */}
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1.5">Active In</p>
                    <div className="flex flex-wrap gap-1.5">
                      {c.countries_active_in.map((country, i) => (
                        <Badge key={i} variant="outline" className="text-xs flex items-center gap-1">
                          <MapPin className="h-2.5 w-2.5" />{country}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Differentiator */}
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1.5">vs ManageEngine</p>
                    <div className="bg-orange-50 border border-orange-100 rounded-lg p-3 text-xs text-orange-900 leading-relaxed">
                      {c.detailed_description.differentiator_vs_manageengine}
                    </div>
                  </div>

                  {/* Analyst recognition */}
                  {c.analyst_recognition && c.analyst_recognition.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1.5">Analyst Recognition</p>
                      <ul className="space-y-1">
                        {c.analyst_recognition.map((ar, i) => (
                          <li key={i} className="text-xs flex gap-2">
                            <CheckCircle2 className="h-3.5 w-3.5 text-green-600 flex-shrink-0 mt-0.5" />
                            <span>{ar}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Sources */}
                  {c.sources && c.sources.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1.5">Sources</p>
                      <div className="space-y-1">
                        {c.sources.map((s, i) => (
                          <a key={i} href={s.url} target="_blank" rel="noopener noreferrer"
                            className="flex items-center gap-1.5 text-xs text-primary hover:underline">
                            <ExternalLink className="h-3 w-3" />
                            <span className="capitalize">{s.type}</span>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </>
            );
          })()}
        </SheetContent>
      </Sheet>

      {/* ─── Research Event Detail Sheet ─── */}
      <Sheet open={panelType === "research_event"} onOpenChange={closePanel}>
        <SheetContent className="overflow-y-auto w-full sm:max-w-lg">
          {panelType === "research_event" && panelData && (() => {
            const e = panelData as ResearchEvent;
            const participation = getParticipation(e.event_name);
            const rColor = REGION_COLORS[e.region] ?? "#6b7280";
            const allStats = { ...(e.key_stats_2025 ?? {}), ...(e.key_stats ?? {}) };
            return (
              <>
                <SheetHeader>
                  <SheetTitle className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" /> {e.event_name}
                  </SheetTitle>
                  <SheetDescription>{e.city}, {e.country}</SheetDescription>
                </SheetHeader>
                <div className="space-y-5 mt-4">
                  {/* Badges */}
                  <div className="flex gap-2 flex-wrap items-center">
                    <Badge style={{ background: rColor + "22", color: rColor, border: `1px solid ${rColor}44` }}>{e.region}</Badge>
                    {e.scale && <Badge variant="outline" className="capitalize">{e.scale}</Badge>}
                    <ParticipationBadge status={participation?.participated} />
                  </div>

                  {/* Booth */}
                  {participation?.booth && (
                    <div className="bg-green-50 border border-green-100 rounded-lg px-3 py-2 text-xs text-green-800 flex items-center gap-2">
                      <MapPin className="h-3.5 w-3.5" /> ManageEngine Booth: <strong>{participation.booth}</strong>
                    </div>
                  )}

                  {/* Dates */}
                  <div className="grid grid-cols-2 gap-2">
                    {e.latest_event_date && (
                      <div className="bg-accent rounded-lg p-2.5">
                        <p className="text-xs text-muted-foreground">Last Held</p>
                        <p className="text-xs font-medium mt-0.5">{e.latest_event_date}</p>
                      </div>
                    )}
                    {e.upcoming_event_date && (
                      <div className="bg-accent rounded-lg p-2.5">
                        <p className="text-xs text-muted-foreground">Next Edition</p>
                        <p className="text-xs font-medium mt-0.5">{e.upcoming_event_date}</p>
                      </div>
                    )}
                  </div>

                  {/* Venue */}
                  {e.venue && (
                    <div className="flex items-start gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                      <span>{e.venue}</span>
                    </div>
                  )}

                  {/* Description */}
                  {e.event_description?.what_the_event_is_about && (
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1.5">About</p>
                      <p className="text-sm leading-relaxed">{e.event_description.what_the_event_is_about}</p>
                    </div>
                  )}

                  {/* Industry focus */}
                  {e.industry_focus && (
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1.5">Industry Focus</p>
                      <p className="text-xs">{e.industry_focus}</p>
                    </div>
                  )}

                  {/* Audience */}
                  {e.target_audience && (
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1.5">Target Audience</p>
                      <p className="text-xs">{e.target_audience}</p>
                    </div>
                  )}

                  {/* Excel event metadata */}
                  {(e.organizer || e.frequency || e.event_type || e.priority_tier) && (
                    <div className="grid grid-cols-2 gap-2">
                      {e.event_type && <div className="bg-accent rounded-lg p-2.5"><p className="text-xs text-muted-foreground">Type</p><p className="text-xs font-medium mt-0.5">{e.event_type}</p></div>}
                      {e.organizer && <div className="bg-accent rounded-lg p-2.5"><p className="text-xs text-muted-foreground">Organizer</p><p className="text-xs font-medium mt-0.5">{e.organizer}</p></div>}
                      {e.frequency && <div className="bg-accent rounded-lg p-2.5"><p className="text-xs text-muted-foreground">Frequency</p><p className="text-xs font-medium mt-0.5">{e.frequency}</p></div>}
                      {e.priority_tier && <div className="bg-accent rounded-lg p-2.5"><p className="text-xs text-muted-foreground">Priority Tier</p><p className="text-xs font-medium mt-0.5">Tier {e.priority_tier}</p></div>}
                      {e.competitive_intensity && <div className="bg-accent rounded-lg p-2.5"><p className="text-xs text-muted-foreground">Competitive Intensity</p><p className="text-xs font-medium mt-0.5">{e.competitive_intensity}</p></div>}
                      {e.estimated_roi && <div className="bg-accent rounded-lg p-2.5"><p className="text-xs text-muted-foreground">Estimated ROI</p><p className="text-xs font-medium mt-0.5">{e.estimated_roi}</p></div>}
                    </div>
                  )}

                  {/* Business goal */}
                  {e.business_goal && (
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1.5">Business Goal</p>
                      <p className="text-xs">{e.business_goal}</p>
                    </div>
                  )}

                  {/* ME Solutions */}
                  {e.relevant_solutions && (
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1.5">Relevant ME Solutions</p>
                      <div className="flex flex-wrap gap-1.5">
                        {e.relevant_solutions.split(",").map((s, i) => <Badge key={i} variant="outline" className="text-xs">{s.trim()}</Badge>)}
                      </div>
                    </div>
                  )}

                  {/* Competitors present */}
                  {e.competitors_present && (
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1.5">Competitors Present</p>
                      <div className="flex flex-wrap gap-1.5">
                        {e.competitors_present.split(",").map((c, i) => <Badge key={i} variant="secondary" className="text-xs">{c.trim()}</Badge>)}
                      </div>
                    </div>
                  )}

                  {/* Key topics */}
                  {e.event_description?.key_topics && e.event_description.key_topics.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1.5">Key Topics</p>
                      <div className="flex flex-wrap gap-1.5">
                        {e.event_description.key_topics.map((t, i) => (
                          <Badge key={i} variant="outline" className="text-xs">{t}</Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Stats */}
                  {Object.keys(allStats).length > 0 && (
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1.5">Key Stats</p>
                      <div className="grid grid-cols-2 gap-2">
                        {Object.entries(allStats).filter(([, v]) => typeof v === "string" || typeof v === "number").map(([k, v]) => (
                          <div key={k} className="bg-accent rounded-lg p-2.5">
                            <p className="text-xs text-muted-foreground capitalize">{k.replace(/_/g, " ")}</p>
                            <p className="text-xs font-medium mt-0.5">{String(v)}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Typical participants */}
                  {e.event_description?.typical_participants && e.event_description.typical_participants.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1.5">Typical Participants</p>
                      <div className="flex flex-wrap gap-1.5">
                        {e.event_description.typical_participants.map((p, i) => (
                          <Badge key={i} variant="secondary" className="text-xs">{p}</Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* ME Participation evidence */}
                  {participation && (
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1.5">ManageEngine Participation</p>
                      <div className="space-y-2">
                        {participation.evidence?.map((ev, i) => (
                          <div key={i} className="bg-accent/60 rounded-lg p-2.5">
                            <p className="text-xs font-medium capitalize mb-0.5">{ev.type.replace(/_/g, " ")}</p>
                            <p className="text-xs text-muted-foreground mb-1">{ev.description}</p>
                            {ev.url && (
                              <a href={ev.url} target="_blank" rel="noopener noreferrer"
                                className="text-xs text-primary hover:underline flex items-center gap-1">
                                <ExternalLink className="h-3 w-3" /> Source
                              </a>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Official website */}
                  {e.official_website && (
                    <a href={e.official_website} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-xs text-primary hover:underline">
                      <ExternalLink className="h-3.5 w-3.5" /> Official Website
                    </a>
                  )}
                </div>
              </>
            );
          })()}
        </SheetContent>
      </Sheet>

      {/* ─── Country Detail Sheet (layer-scoped) ─── */}
      <Sheet open={!!selectedCountry} onOpenChange={() => setSelectedCountry(null)}>
        <SheetContent className="overflow-y-auto w-full sm:max-w-lg">
          {selectedCountry && (() => {
            const regionForCountry = REGION_FILTERS.find(r => {
              const map: Record<string, string[]> = {
                "DACH": ["Germany", "Austria", "Switzerland"],
                "Benelux": ["Netherlands", "Belgium", "Luxembourg"],
                "UK & Ireland": ["United Kingdom", "Ireland"],
                "Nordics": ["Finland", "Sweden", "Norway", "Denmark", "Iceland"],
                "Eastern Europe": ["Poland", "Czech Republic", "Czechia", "Hungary", "Romania", "Bulgaria", "Latvia", "Lithuania", "Estonia", "Croatia", "Serbia", "Slovakia", "Slovenia", "Albania", "North Macedonia", "Montenegro"],
                "Southern Europe": ["France", "Spain", "Italy", "Portugal", "Greece"],
              };
              return map[r]?.includes(selectedCountry);
            });
            const rColor = regionForCountry ? REGION_COLORS[regionForCountry] : "#6b7280";

            // Only compute what's needed for the active layer
            const countryPartners = activeLayer === "Partners"
              ? partners.filter(p => p.country === selectedCountry) : [];
            const countryEvents = activeLayer === "Events"
              ? events.filter(e => e.country === selectedCountry) : [];
            const countryDCs = activeLayer === "Datacenters"
              ? datacenters.filter(dc => dc.location?.includes(selectedCountry)) : [];
            const countryResearchEvents = activeLayer === "Third Party Events"
              ? (researchData?.events.filter(e => e.country === selectedCountry) ?? []) : [];
            const countryCompetitors = activeLayer === "Competitors"
              ? flatCompetitors.filter(c => c.countries_active_in?.includes(selectedCountry)) : [];

            const isEmpty =
              countryPartners.length === 0 && countryEvents.length === 0 &&
              countryDCs.length === 0 && countryResearchEvents.length === 0 &&
              countryCompetitors.length === 0;

            return (
              <>
                <SheetHeader>
                  <SheetTitle className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" /> {selectedCountry}
                  </SheetTitle>
                  <SheetDescription>
                    {regionForCountry && (
                      <span className="px-1.5 py-0.5 rounded text-xs font-medium mr-2"
                        style={{ background: rColor + "22", color: rColor, border: `1px solid ${rColor}44` }}>
                        {regionForCountry}
                      </span>
                    )}
                    {activeLayer} view
                  </SheetDescription>
                </SheetHeader>

                <div className="space-y-4 mt-4">
                  {/* Partners layer */}
                  {activeLayer === "Partners" && (
                    countryPartners.length > 0 ? (
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2 flex items-center gap-1.5">
                          <Users className="h-3.5 w-3.5" /> Partners ({countryPartners.length})
                        </p>
                        <div className="space-y-2">
                          {countryPartners.map(p => (
                            <div key={p.id} className="flex items-center justify-between bg-accent/50 rounded-lg px-3 py-2.5">
                              <div>
                                <p className="text-sm font-medium">{p.name}</p>
                                <p className="text-xs text-muted-foreground">{p.city} · {p.contactPerson}</p>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="px-1.5 py-0.5 rounded text-xs font-medium capitalize"
                                  style={{ background: tierColor[p.tier || "standard"] + "22", color: tierColor[p.tier || "standard"] }}>
                                  {p.tier}
                                </span>
                                <Link to={`/partners/${p.id}`} onClick={() => setSelectedCountry(null)}>
                                  <Button size="sm" variant="ghost" className="h-6 text-xs text-primary px-2">View →</Button>
                                </Link>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground bg-accent/30 rounded-lg px-3 py-2">No partners in {selectedCountry}</p>
                    )
                  )}

                  {/* Events layer */}
                  {activeLayer === "Events" && (
                    countryEvents.length > 0 ? (
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2 flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5" /> Events ({countryEvents.length})
                        </p>
                        <div className="space-y-2">
                          {countryEvents.map(e => (
                            <div key={e.id} className="bg-orange-50 border border-orange-100 rounded-lg px-3 py-2">
                              <div className="flex items-center justify-between">
                                <p className="text-sm font-medium">{e.name}</p>
                                {e.eventKind && <Badge variant={e.eventKind === "owned" ? "default" : "secondary"} className="text-xs capitalize">{e.eventKind}</Badge>}
                              </div>
                              <p className="text-xs text-muted-foreground mt-0.5">{e.date || e.year} · {e.location}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground bg-accent/30 rounded-lg px-3 py-2">No events in {selectedCountry}</p>
                    )
                  )}

                  {/* Datacenters layer */}
                  {activeLayer === "Datacenters" && (
                    countryDCs.length > 0 ? (
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2 flex items-center gap-1.5">
                          <Server className="h-3.5 w-3.5" /> Datacenters ({countryDCs.length})
                        </p>
                        <div className="space-y-2">
                          {countryDCs.map(dc => (
                            <div key={dc.id} className="bg-accent/50 rounded-lg px-3 py-2">
                              <p className="text-sm font-medium">{dc.name}</p>
                              <p className="text-xs text-muted-foreground">{dc.location} · {dc.type} · {dc.status}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground bg-accent/30 rounded-lg px-3 py-2">No datacenters in {selectedCountry}</p>
                    )
                  )}

                  {/* Third Party Events layer */}
                  {activeLayer === "Third Party Events" && (
                    countryResearchEvents.length > 0 ? (
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2 flex items-center gap-1.5">
                          <Activity className="h-3.5 w-3.5 text-sky-600" /> Third Party Events ({countryResearchEvents.length})
                        </p>
                        <div className="space-y-2">
                          {countryResearchEvents.map(e => {
                            const participation = getParticipation(e.event_name);
                            return (
                              <div key={e.event_name} className="bg-sky-50 border border-sky-100 rounded-lg px-3 py-2">
                                <div className="flex items-center justify-between">
                                  <p className="text-sm font-medium">{e.event_name}</p>
                                  <ParticipationBadge status={participation?.participated} />
                                </div>
                                <p className="text-xs text-muted-foreground mt-0.5">{e.city}</p>
                                {e.upcoming_event_date && <p className="text-xs text-sky-700 mt-0.5">Next: {e.upcoming_event_date}</p>}
                                <Button size="sm" variant="ghost" className="h-6 text-xs text-primary px-0 mt-1"
                                  onClick={() => { openResearchEvent(e); setSelectedCountry(null); }}>
                                  Full details →
                                </Button>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground bg-accent/30 rounded-lg px-3 py-2">No third party events in {selectedCountry}</p>
                    )
                  )}

                  {/* Competitors layer */}
                  {activeLayer === "Competitors" && (
                    countryCompetitors.length > 0 ? (
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2 flex items-center gap-1.5">
                          <Building2 className="h-3.5 w-3.5 text-violet-600" /> Competitors Active Here ({countryCompetitors.length})
                        </p>
                        <div className="space-y-2">
                          {countryCompetitors.map(c => (
                            <div key={c.competitor_name} className="flex items-center justify-between bg-violet-50 border border-violet-100 rounded-lg px-3 py-2">
                              <div>
                                <p className="text-sm font-medium">{c.competitor_name}</p>
                                <p className="text-xs text-muted-foreground">{c.category}</p>
                              </div>
                              <Button size="sm" variant="ghost" className="h-6 text-xs text-primary px-2"
                                onClick={() => { openCompetitor(c); setSelectedCountry(null); }}>
                                Profile →
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground bg-accent/30 rounded-lg px-3 py-2">No competitors tracked in {selectedCountry}</p>
                    )
                  )}

                  {isEmpty && (
                    <p className="text-sm text-muted-foreground text-center py-4">No {activeLayer.toLowerCase()} data for {selectedCountry}</p>
                  )}
                </div>
              </>
            );
          })()}
        </SheetContent>
      </Sheet>
    </div>
  );
}
