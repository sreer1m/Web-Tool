import { useState, useEffect, useMemo } from "react";
import { events, partners, eventLearnings } from "@/data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { BookOpen, CheckCircle, XCircle, Lightbulb, ChevronDown, ChevronUp, Calendar, Globe2, Star, Search, CheckCircle2, AlertCircle, ExternalLink, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

// ── Types ────────────────────────────────────────────────────────────────────

type MEParticipation = {
  event_name: string;
  participated: "YES" | "NO" | "UNKNOWN";
  booth?: string;
  evidence?: { type: string; url: string; description: string }[];
};

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

type ResearchData = {
  events: ResearchEvent[];
  manageengine_participation: MEParticipation[];
};

// ── Helpers ───────────────────────────────────────────────────────────────────

const statusColor: Record<string, string> = {
  'Exhibited': 'bg-green-100 text-green-700',
  'Platinum Partner': 'bg-indigo-100 text-indigo-700',
  'Confirmed': 'bg-blue-100 text-blue-700',
  'Exhibiting': 'bg-cyan-100 text-cyan-700',
  'Owned': 'bg-purple-100 text-purple-700',
  'Not Confirmed': 'bg-yellow-100 text-yellow-700',
  'Not Participating': 'bg-slate-100 text-slate-500',
};

const categoryColor: Record<string, string> = {
  'Workshop': 'bg-orange-100 text-orange-700',
  'Seminar': 'bg-blue-100 text-blue-700',
  'User Conference': 'bg-purple-100 text-purple-700',
  'Training': 'bg-green-100 text-green-700',
  'Industry Event': 'bg-slate-100 text-slate-700',
};

const REGIONS = ["DACH", "Benelux", "UK & Ireland", "Nordics", "Eastern Europe", "Southern Europe"];

const REGION_COLORS: Record<string, string> = {
  "DACH": "#8b5cf6",
  "Benelux": "#14b8a6",
  "UK & Ireland": "#ec4899",
  "Nordics": "#3b82f6",
  "Eastern Europe": "#06b6d4",
  "Southern Europe": "#f97316",
};

function ParticipationBadge({ status }: { status: "YES" | "NO" | "UNKNOWN" | undefined }) {
  if (status === "YES") return <Badge className="bg-green-100 text-green-700 border-green-200 gap-1 text-xs"><CheckCircle2 className="h-3 w-3" />ME Participated</Badge>;
  return <Badge className="bg-slate-100 text-slate-600 border-slate-200 gap-1 text-xs"><AlertCircle className="h-3 w-3" />Not Participated</Badge>;
}

// ── Component ──────────────────────────────────────────────────────────────────

export default function Events() {
  const [expandedEvent, setExpandedEvent] = useState<string | null>(null);
  const [userNotes, setUserNotes] = useState<Record<string, string>>({});

  // Research data state
  const [researchData, setResearchData] = useState<ResearchData | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [regionFilter, setRegionFilter] = useState<string | null>(null);
  const [countryFilter, setCountryFilter] = useState("");
  const [meFilter, setMeFilter] = useState<"all" | "yes" | "no">("all");
  const [tierFilter, setTierFilter] = useState<"" | "1" | "2" | "3">("");
  const [activeTab, setActiveTab] = useState<"owned" | "external" | "market">("owned");

  useEffect(() => {
    fetch("/research-data.json")
      .then(res => res.json())
      .then((data: ResearchData) => setResearchData(data))
      .catch(() => null);
  }, []);

  const ownedEvents = events.filter(e => e.eventKind === "owned");
  const externalEvents = events.filter(e => e.eventKind === "external");

  // Participation lookup for research events
  const getParticipation = (eventName: string): MEParticipation | undefined => {
    if (!researchData) return undefined;
    const nameLower = eventName.toLowerCase();
    return researchData.manageengine_participation.find(p =>
      p.event_name.toLowerCase().includes(nameLower) ||
      nameLower.includes(p.event_name.toLowerCase().split(" (")[0])
    );
  };

  // All unique countries from research events
  const allCountries = useMemo(() => {
    if (!researchData) return [];
    return Array.from(new Set(researchData.events.map(e => e.country))).sort();
  }, [researchData]);

  // Filtered research events
  const filteredResearchEvents = useMemo(() => {
    if (!researchData) return [];
    return researchData.events.filter(e => {
      if (regionFilter && e.region !== regionFilter) return false;
      if (countryFilter && e.country !== countryFilter) return false;
      if (tierFilter && (e as ResearchEvent).priority_tier !== tierFilter) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        if (!e.event_name.toLowerCase().includes(q) && !e.city.toLowerCase().includes(q) && !e.country.toLowerCase().includes(q)) return false;
      }
      if (meFilter !== "all") {
        const p = getParticipation(e.event_name);
        if (meFilter === "yes" && p?.participated !== "YES") return false;
        if (meFilter === "no" && p?.participated === "YES") return false;
      }
      return true;
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [researchData, regionFilter, countryFilter, tierFilter, searchQuery, meFilter]);

  // Filtered owned events
  const filteredOwned = useMemo(() => {
    if (!searchQuery) return ownedEvents;
    const q = searchQuery.toLowerCase();
    return ownedEvents.filter(e =>
      e.name.toLowerCase().includes(q) || e.country.toLowerCase().includes(q) || (e.location || "").toLowerCase().includes(q)
    );
  }, [ownedEvents, searchQuery]);

  // Filtered external events
  const filteredExternal = useMemo(() => {
    if (!searchQuery) return externalEvents;
    const q = searchQuery.toLowerCase();
    return externalEvents.filter(e =>
      e.name.toLowerCase().includes(q) || e.country.toLowerCase().includes(q) || (e.location || "").toLowerCase().includes(q)
    );
  }, [externalEvents, searchQuery]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Events</h1>
        <p className="text-sm text-muted-foreground">
          {ownedEvents.length} ManageEngine events · {externalEvents.length} external events · {researchData?.events.length ?? "…"} pan-Europe events
        </p>
      </div>

      {/* Tab bar */}
      <div className="flex gap-1 border-b pb-0">
        {([
          { key: "owned", label: `ME Events (${ownedEvents.length})` },
          { key: "external", label: `External (${externalEvents.length})` },
          { key: "market", label: `Pan-Europe Events (${researchData?.events.length ?? "…"})` },
        ] as { key: typeof activeTab; label: string }[]).map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab.key
                ? "border-primary text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Search bar (all tabs) */}
      <div className="relative max-w-sm">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
        <Input
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder={activeTab === "market" ? "Search events, cities, countries…" : "Search events, locations…"}
          className="pl-8 h-8 text-xs"
        />
      </div>

      {/* ── ManageEngine Owned Events ── */}
      {activeTab === "owned" && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Calendar className="h-4 w-4 text-primary" /> ManageEngine Owned Events
            </CardTitle>
            <p className="text-xs text-muted-foreground">
              Focus on product education, conversion, and customer retention. UserConf events play a key role in strengthening relationships and driving upsell.
            </p>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Event</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Learnings</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOwned.map(e => {
                  const learning = eventLearnings.find(l => l.eventId === e.id);
                  const hostPartner = e.partnerId ? partners.find(p => p.id === e.partnerId) : null;
                  const isExpanded = expandedEvent === e.id;

                  return (
                    <>
                      <TableRow
                        key={e.id}
                        className="cursor-pointer"
                        onClick={() => setExpandedEvent(isExpanded ? null : e.id)}
                      >
                        <TableCell>
                          <div className="font-medium text-sm">{e.name}</div>
                          {hostPartner && (
                            <Link to={`/partners/${hostPartner.id}`} className="text-xs text-primary hover:underline" onClick={ev => ev.stopPropagation()}>
                              {hostPartner.name}
                            </Link>
                          )}
                        </TableCell>
                        <TableCell>
                          <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${categoryColor[e.category || ''] || 'bg-slate-100 text-slate-700'}`}>
                            {e.category}
                          </span>
                        </TableCell>
                        <TableCell className="text-sm whitespace-nowrap">{e.date}</TableCell>
                        <TableCell className="text-sm">{e.location}, {e.country}</TableCell>
                        <TableCell>
                          {learning ? (
                            <div className="flex items-center gap-1 text-xs text-primary">
                              <BookOpen className="h-3.5 w-3.5" />
                              {isExpanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                            </div>
                          ) : (
                            <span className="text-xs text-muted-foreground">—</span>
                          )}
                        </TableCell>
                      </TableRow>

                      {isExpanded && (
                        <TableRow key={`${e.id}-learning`}>
                          <TableCell colSpan={5} className="bg-accent/30 p-4">
                            <div className="space-y-3">
                              {learning ? (
                                <>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <div className="bg-green-50 rounded-lg p-3 border border-green-100">
                                      <div className="flex items-center gap-1.5 mb-2">
                                        <CheckCircle className="h-3.5 w-3.5 text-green-600" />
                                        <p className="text-xs font-semibold text-green-700">What Worked</p>
                                      </div>
                                      <ul className="text-xs text-green-800 space-y-1">
                                        {learning.whatWorked.map((w, i) => <li key={i}>· {w}</li>)}
                                      </ul>
                                    </div>
                                    <div className="bg-red-50 rounded-lg p-3 border border-red-100">
                                      <div className="flex items-center gap-1.5 mb-2">
                                        <XCircle className="h-3.5 w-3.5 text-red-600" />
                                        <p className="text-xs font-semibold text-red-700">What Didn't Work</p>
                                      </div>
                                      <ul className="text-xs text-red-800 space-y-1">
                                        {learning.whatDidntWork.map((w, i) => <li key={i}>· {w}</li>)}
                                      </ul>
                                    </div>
                                  </div>
                                  <div className="bg-blue-50 rounded-lg p-3 border border-blue-100">
                                    <div className="flex items-center gap-1.5 mb-1">
                                      <Lightbulb className="h-3.5 w-3.5 text-blue-600" />
                                      <p className="text-xs font-semibold text-blue-700">Notes</p>
                                      <Badge variant="outline" className="text-xs ml-auto">
                                        <Star className="h-3 w-3 mr-0.5 fill-yellow-400 text-yellow-400" />
                                        {learning.rating}/5
                                      </Badge>
                                    </div>
                                    <p className="text-xs text-blue-800">{learning.notes}</p>
                                  </div>
                                </>
                              ) : null}
                              <div>
                                <p className="text-xs font-medium text-muted-foreground mb-1">Your Notes</p>
                                <Textarea
                                  placeholder="Add your notes for this event…"
                                  className="text-xs h-20"
                                  value={userNotes[e.id] || ''}
                                  onChange={ev => setUserNotes(prev => ({ ...prev, [e.id]: ev.target.value }))}
                                  onClick={ev => ev.stopPropagation()}
                                />
                              </div>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* ── External Industry Events ── */}
      {activeTab === "external" && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Globe2 className="h-4 w-4 text-primary" /> External Industry Events
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Event</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Audience</TableHead>
                  <TableHead>Strategic Value</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredExternal.map(e => (
                  <TableRow key={e.id}>
                    <TableCell className="font-medium text-sm whitespace-nowrap">{e.name}</TableCell>
                    <TableCell className="text-sm whitespace-nowrap text-muted-foreground">{e.date}</TableCell>
                    <TableCell className="text-sm">{e.location}, {e.country}</TableCell>
                    <TableCell>
                      <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${statusColor[e.status || ''] || 'bg-slate-100 text-slate-700'}`}>
                        {e.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">{e.audience}</TableCell>
                    <TableCell className="text-xs text-muted-foreground max-w-[200px]">{e.strategicValue}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* ── Market Events (Research Data) ── */}
      {activeTab === "market" && (
        <div className="space-y-4">
          {/* Filters */}
          <Card>
            <CardContent className="p-4 space-y-3">
              <div className="flex flex-wrap gap-4">
                {/* Region filter */}
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-2">Region</p>
                  <div className="flex gap-1 flex-wrap">
                    <Button
                      size="sm" variant={regionFilter === null ? "default" : "outline"}
                      onClick={() => { setRegionFilter(null); setCountryFilter(""); }}
                      className="text-xs h-7"
                    >
                      All
                    </Button>
                    {REGIONS.map(r => (
                      <Button
                        key={r} size="sm"
                        variant={regionFilter === r ? "default" : "outline"}
                        onClick={() => { setRegionFilter(prev => prev === r ? null : r); setCountryFilter(""); }}
                        className="text-xs h-7"
                        style={regionFilter === r ? {} : { borderColor: REGION_COLORS[r] + "66", color: REGION_COLORS[r] }}
                      >
                        {r}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Priority Tier filter */}
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-2">Priority Tier</p>
                  <div className="flex gap-1">
                    <Button size="sm" variant={tierFilter === "" ? "default" : "outline"} onClick={() => setTierFilter("")} className="text-xs h-7">All</Button>
                    <Button size="sm" variant={tierFilter === "1" ? "default" : "outline"} onClick={() => setTierFilter("1")} className="text-xs h-7 text-amber-700 border-amber-300">Tier 1</Button>
                    <Button size="sm" variant={tierFilter === "2" ? "default" : "outline"} onClick={() => setTierFilter("2")} className="text-xs h-7 text-blue-700 border-blue-300">Tier 2</Button>
                    <Button size="sm" variant={tierFilter === "3" ? "default" : "outline"} onClick={() => setTierFilter("3")} className="text-xs h-7">Tier 3</Button>
                  </div>
                </div>

                {/* ME Participation filter */}
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-2">ME Participation</p>
                  <div className="flex gap-1">
                    {(["all", "yes", "no"] as const).map(f => (
                      <Button key={f} size="sm" variant={meFilter === f ? "default" : "outline"}
                        onClick={() => setMeFilter(f)} className="text-xs h-7 capitalize">
                        {f === "yes" ? "Participated" : f === "no" ? "Not Participated" : "All"}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Country filter */}
              {allCountries.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-2">Country</p>
                  <div className="flex gap-1 flex-wrap">
                    <Button size="sm" variant={countryFilter === "" ? "default" : "outline"}
                      onClick={() => setCountryFilter("")} className="text-xs h-7">All Countries</Button>
                    {allCountries
                      .filter(c => !regionFilter || (researchData?.events ?? []).some(e => e.country === c && e.region === regionFilter))
                      .map(c => (
                        <Button key={c} size="sm" variant={countryFilter === c ? "default" : "outline"}
                          onClick={() => setCountryFilter(prev => prev === c ? "" : c)} className="text-xs h-7">
                          {c}
                        </Button>
                      ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Results count */}
          <p className="text-xs text-muted-foreground px-1">
            {filteredResearchEvents.length} event{filteredResearchEvents.length !== 1 ? "s" : ""}
            {regionFilter ? ` in ${regionFilter}` : ""}
            {countryFilter ? `, ${countryFilter}` : ""}
          </p>

          {/* Market events grid */}
          {filteredResearchEvents.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground text-sm">No events match the current filters.</div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {filteredResearchEvents.map(e => {
                const participation = getParticipation(e.event_name);
                const rColor = REGION_COLORS[e.region] ?? "#6b7280";
                return (
                  <Card key={e.event_name} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4 space-y-3">
                      {/* Header */}
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="font-semibold text-sm leading-snug">{e.event_name}</p>
                          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                            <MapPin className="h-3 w-3" /> {e.city}, {e.country}
                          </p>
                        </div>
                        <ParticipationBadge status={participation?.participated} />
                      </div>

                      {/* Region + scale + tier badges */}
                      <div className="flex gap-1.5 flex-wrap">
                        <span className="px-1.5 py-0.5 rounded text-xs font-medium"
                          style={{ background: rColor + "22", color: rColor, border: `1px solid ${rColor}44` }}>
                          {e.region}
                        </span>
                        {e.priority_tier && (
                          <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${e.priority_tier === "1" ? "bg-amber-100 text-amber-700" : e.priority_tier === "2" ? "bg-blue-100 text-blue-700" : "bg-slate-100 text-slate-600"}`}>
                            Tier {e.priority_tier}
                          </span>
                        )}
                        {e.scale && <Badge variant="outline" className="text-xs capitalize">{e.scale}</Badge>}
                        {e.event_type && <Badge variant="outline" className="text-xs">{e.event_type}</Badge>}
                      </div>

                      {/* Dates & meta row */}
                      <div className="flex gap-3 text-xs text-muted-foreground flex-wrap">
                        {e.upcoming_event_date && <span>Next: <strong className="text-foreground">{e.upcoming_event_date}</strong></span>}
                        {e.organizer && <span>By: <strong className="text-foreground">{e.organizer}</strong></span>}
                        {e.competitive_intensity && <span>Competition: <strong className={`${e.competitive_intensity === "High" ? "text-red-600" : e.competitive_intensity === "Medium" ? "text-amber-600" : "text-foreground"}`}>{e.competitive_intensity}</strong></span>}
                      </div>

                      {/* Description */}
                      {e.event_description?.what_the_event_is_about && (
                        <p className="text-xs text-muted-foreground line-clamp-2">{e.event_description.what_the_event_is_about}</p>
                      )}

                      {/* Business goal */}
                      {e.business_goal && (
                        <div className="text-xs"><span className="text-muted-foreground">Goal: </span><span className="font-medium">{e.business_goal}</span></div>
                      )}

                      {/* ME solutions */}
                      {e.relevant_solutions && (
                        <div className="flex gap-1 flex-wrap">
                          {e.relevant_solutions.split(",").slice(0, 4).map((s, i) => (
                            <Badge key={i} variant="secondary" className="text-xs">{s.trim()}</Badge>
                          ))}
                          {e.relevant_solutions.split(",").length > 4 && (
                            <Badge variant="outline" className="text-xs">+{e.relevant_solutions.split(",").length - 4} more</Badge>
                          )}
                        </div>
                      )}

                      {/* Footer */}
                      {e.official_website && (
                        <a href={e.official_website} target="_blank" rel="noopener noreferrer"
                          className="flex items-center gap-1 text-xs text-primary hover:underline">
                          <ExternalLink className="h-3 w-3" /> Official Website
                        </a>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
