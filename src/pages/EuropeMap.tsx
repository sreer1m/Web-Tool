import { useState, useMemo, useRef, useCallback } from "react";
import { ComposableMap, Geographies, Geography, Marker, ZoomableGroup } from "react-simple-maps";
import { partners, events, datacenters } from "@/data";
import type { Partner, Event, Datacenter } from "@/data/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Globe, Users, Calendar, Server, ExternalLink, Phone, Mail, Activity } from "lucide-react";
import { Link } from "react-router-dom";

const GEO_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-50m.json";

const YEARS = [2024, 2025, 2026];
const TYPES = ["Partners", "Datacenters", "Events"];
const TIERS = ["All", "platinum", "gold", "silver", "standard"];

type PanelType = 'partner' | 'datacenter' | 'event' | null;

type TooltipData =
  | { type: 'partner'; data: Partner }
  | { type: 'datacenter'; data: Datacenter }
  | { type: 'event'; data: Event }
  | null;

const tierColor: Record<string, string> = {
  platinum: '#6366f1',
  gold: '#f59e0b',
  silver: '#64748b',
  standard: '#94a3b8',
};

function PartnerTooltip({ p }: { p: Partner }) {
  return (
    <div>
      <p className="font-semibold text-sm">{p.name}</p>
      <p className="text-muted-foreground text-xs mb-2">{p.city}, {p.country}</p>
      <div className="flex gap-1 flex-wrap mb-2">
        <span className="px-1.5 py-0.5 rounded text-xs font-medium capitalize"
          style={{ background: tierColor[p.tier || 'standard'] + '22', color: tierColor[p.tier || 'standard'], border: `1px solid ${tierColor[p.tier || 'standard']}44` }}>
          {p.tier}
        </span>
        <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${p.riskLevel === 'low' ? 'bg-green-100 text-green-700' : p.riskLevel === 'medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
          {p.riskLevel} risk
        </span>
      </div>
      <div className="grid grid-cols-2 gap-x-4 gap-y-0.5 text-xs">
        <span className="text-muted-foreground">Revenue</span>
        <span className="font-medium">€{(p.totalRevenue / 1e6).toFixed(2)}M</span>
        <span className="text-muted-foreground">ROI</span>
        <span className="font-medium">{p.roi}x</span>
        <span className="text-muted-foreground">Engagement</span>
        <span className="font-medium">{p.engagementScore}/100</span>
      </div>
      {p.phone && (
        <p className="text-xs text-muted-foreground mt-1.5 flex items-center gap-1">
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
        <span className={`px-1.5 py-0.5 rounded text-xs font-medium capitalize ${dc.type === 'primary' ? 'bg-blue-100 text-blue-700' : dc.type === 'secondary' ? 'bg-purple-100 text-purple-700' : 'bg-slate-100 text-slate-700'}`}>
          {dc.type}
        </span>
        <span className={`px-1.5 py-0.5 rounded text-xs font-medium capitalize ${dc.status === 'operational' ? 'bg-green-100 text-green-700' : dc.status === 'maintenance' ? 'bg-yellow-100 text-yellow-700' : 'bg-slate-100 text-slate-700'}`}>
          {dc.status}
        </span>
      </div>
      {dc.status !== 'planned' && (
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

export default function EuropeMap() {
  const [selectedYears, setSelectedYears] = useState<number[]>([2024, 2025, 2026]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>(["Partners", "Datacenters", "Events"]);
  const [tierFilter, setTierFilter] = useState("All");
  const [panelType, setPanelType] = useState<PanelType>(null);
  const [panelData, setPanelData] = useState<Partner | Datacenter | Event | null>(null);
  const [tooltip, setTooltip] = useState<TooltipData>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const toggleYear = (y: number) =>
    setSelectedYears(prev => prev.includes(y) ? prev.filter(v => v !== y) : [...prev, y]);
  const toggleType = (t: string) =>
    setSelectedTypes(prev => prev.includes(t) ? prev.filter(v => v !== t) : [...prev, t]);

  const filteredPartners = useMemo(() => {
    if (!selectedTypes.includes("Partners")) return [];
    return partners.filter(p => {
      if (tierFilter !== "All" && p.tier !== tierFilter) return false;
      return p.yearsActive.some(y => selectedYears.includes(y));
    });
  }, [selectedYears, selectedTypes, tierFilter]);

  const filteredEvents = useMemo(() => {
    if (!selectedTypes.includes("Events")) return [];
    return events.filter(e => selectedYears.includes(e.year));
  }, [selectedYears, selectedTypes]);

  const filteredDCs = useMemo(() =>
    selectedTypes.includes("Datacenters") ? datacenters : [],
    [selectedTypes]
  );

  const openPartner = (p: Partner) => { setPanelType('partner'); setPanelData(p); };
  const openDC = (dc: Datacenter) => { setPanelType('datacenter'); setPanelData(dc); };
  const openEvent = (e: Event) => { setPanelType('event'); setPanelData(e); };
  const closePanel = () => { setPanelType(null); setPanelData(null); };

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (rect) {
      setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    }
  }, []);

  const clearTooltip = useCallback(() => setTooltip(null), []);

  // Compute tooltip position: flip left if near right edge, flip up if near bottom
  const tooltipStyle = useMemo(() => {
    const containerWidth = containerRef.current?.offsetWidth ?? 800;
    const containerHeight = containerRef.current?.offsetHeight ?? 500;
    const tooltipW = 220;
    const tooltipH = 160;
    const x = mousePos.x + 14;
    const y = mousePos.y - 10;
    return {
      left: x + tooltipW > containerWidth ? mousePos.x - tooltipW - 6 : x,
      top: y + tooltipH > containerHeight ? mousePos.y - tooltipH - 6 : y,
    };
  }, [mousePos]);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold flex items-center gap-2">
          <Globe className="h-6 w-6 text-primary" /> Europe Map
        </h1>
        <p className="text-sm text-muted-foreground">Interactive map of ManageEngine partners, datacenters, and events</p>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
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
              <p className="text-xs font-medium text-muted-foreground mb-2">Layer</p>
              <div className="flex gap-1">
                {TYPES.map(t => (
                  <Button key={t} size="sm" variant={selectedTypes.includes(t) ? "default" : "outline"}
                    onClick={() => toggleType(t)} className="text-xs h-7">{t}</Button>
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
              projection="geoAzimuthalEqualArea"
              projectionConfig={{ rotate: [-15, -52, 0], scale: 750 }}
              style={{ width: "100%", height: "auto" }}
              viewBox="0 0 800 500"
            >
              <ZoomableGroup>
                <Geographies geography={GEO_URL}>
                  {({ geographies }) =>
                    geographies.map(geo => (
                      <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        fill="hsl(220, 14%, 96%)"
                        stroke="hsl(220, 13%, 82%)"
                        strokeWidth={0.5}
                        style={{
                          default: { outline: "none" },
                          hover: { fill: "hsl(220, 14%, 90%)", outline: "none" },
                          pressed: { outline: "none" },
                        }}
                      />
                    ))
                  }
                </Geographies>

                {/* Events (orange circles, behind partners) */}
                {filteredEvents.map(e => (
                  <Marker key={e.id} coordinates={e.coordinates}>
                    <circle
                      r={4}
                      fill="hsl(25, 95%, 53%)"
                      stroke="#fff"
                      strokeWidth={1.5}
                      className="cursor-pointer transition-opacity"
                      style={{ opacity: tooltip?.type === 'event' && (tooltip.data as Event).id === e.id ? 1 : undefined }}
                      onMouseEnter={() => setTooltip({ type: 'event', data: e })}
                      onMouseLeave={clearTooltip}
                      onClick={() => openEvent(e)}
                    />
                  </Marker>
                ))}

                {/* Partners (colored by tier) */}
                {filteredPartners.map(p => (
                  <Marker key={p.id} coordinates={p.coordinates}>
                    <circle
                      r={p.tier === 'platinum' ? 7 : p.tier === 'gold' ? 6 : 5}
                      fill={tierColor[p.tier || 'standard']}
                      stroke="#fff"
                      strokeWidth={1.5}
                      className="cursor-pointer transition-opacity"
                      onMouseEnter={() => setTooltip({ type: 'partner', data: p })}
                      onMouseLeave={clearTooltip}
                      onClick={() => openPartner(p)}
                    />
                  </Marker>
                ))}

                {/* Datacenters (green squares) */}
                {filteredDCs.map(dc => (
                  <Marker key={dc.id} coordinates={dc.coordinates}>
                    <rect
                      x={-6} y={-6} width={12} height={12}
                      fill={dc.status === 'operational' ? '#16a34a' : dc.status === 'maintenance' ? '#ca8a04' : '#94a3b8'}
                      stroke="#fff"
                      strokeWidth={1.5}
                      rx={2}
                      className="cursor-pointer transition-opacity"
                      onMouseEnter={() => setTooltip({ type: 'datacenter', data: dc })}
                      onMouseLeave={clearTooltip}
                      onClick={() => openDC(dc)}
                    />
                  </Marker>
                ))}
              </ZoomableGroup>
            </ComposableMap>

            {/* Hover Tooltip */}
            {tooltip && (
              <div
                className="absolute z-50 bg-card border rounded-lg shadow-xl p-3 pointer-events-none"
                style={{
                  left: tooltipStyle.left,
                  top: tooltipStyle.top,
                  minWidth: 180,
                  maxWidth: 220,
                }}
              >
                {tooltip.type === 'partner' && <PartnerTooltip p={tooltip.data as Partner} />}
                {tooltip.type === 'datacenter' && <DatacenterTooltip dc={tooltip.data as Datacenter} />}
                {tooltip.type === 'event' && <EventTooltip e={tooltip.data as Event} />}
              </div>
            )}
          </div>

          {/* Legend */}
          <div className="flex flex-wrap items-center gap-4 p-3 border-t text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5 font-medium text-foreground">Partners:</span>
            <span className="flex items-center gap-1"><span className="h-3 w-3 rounded-full inline-block" style={{ backgroundColor: '#6366f1' }} /> Platinum ({filteredPartners.filter(p => p.tier === 'platinum').length})</span>
            <span className="flex items-center gap-1"><span className="h-3 w-3 rounded-full inline-block" style={{ backgroundColor: '#f59e0b' }} /> Gold ({filteredPartners.filter(p => p.tier === 'gold').length})</span>
            <span className="flex items-center gap-1"><span className="h-3 w-3 rounded-full inline-block" style={{ backgroundColor: '#64748b' }} /> Silver ({filteredPartners.filter(p => p.tier === 'silver').length})</span>
            <span className="flex items-center gap-1"><span className="h-3 w-3 rounded-full inline-block" style={{ backgroundColor: '#94a3b8' }} /> Standard ({filteredPartners.filter(p => p.tier === 'standard').length})</span>
            <span className="flex items-center gap-1"><span className="h-3 w-3 rounded-full bg-orange-500 inline-block" /> Events ({filteredEvents.length})</span>
            <span className="flex items-center gap-1"><span className="h-3 w-3 rounded bg-green-600 inline-block" /> Datacenters ({filteredDCs.length})</span>
          </div>
        </CardContent>
      </Card>

      {/* ─── Partner Detail Sheet ─── */}
      <Sheet open={panelType === 'partner'} onOpenChange={closePanel}>
        <SheetContent className="overflow-y-auto">
          {panelType === 'partner' && panelData && (() => {
            const p = panelData as Partner;
            const pEvents = events.filter(e => e.partnerId === p.id);
            return (
              <>
                <SheetHeader>
                  <SheetTitle className="flex items-center gap-2">
                    <Users className="h-4 w-4" /> {p.name}
                  </SheetTitle>
                  <SheetDescription>{p.city}, {p.country}</SheetDescription>
                </SheetHeader>
                <div className="space-y-4 mt-4">
                  <div className="flex gap-2 flex-wrap">
                    <Badge variant={p.tier === 'platinum' ? 'default' : p.tier === 'gold' ? 'secondary' : 'outline'} className="capitalize">{p.tier}</Badge>
                    <Badge variant={p.riskLevel === 'low' ? 'outline' : p.riskLevel === 'medium' ? 'secondary' : 'destructive'}>{p.riskLevel} risk</Badge>
                    <Badge variant="outline">{p.yearsActive.length} yrs active</Badge>
                  </div>

                  {/* Contact Info */}
                  <div className="space-y-1.5 text-sm">
                    {p.address && <p className="text-muted-foreground text-xs">{p.address}</p>}
                    {p.contactPerson && (
                      <div className="flex items-center gap-2"><Users className="h-3.5 w-3.5 text-muted-foreground" /><span>{p.contactPerson}</span></div>
                    )}
                    {p.phone && (
                      <div className="flex items-center gap-2"><Phone className="h-3.5 w-3.5 text-muted-foreground" /><a href={`tel:${p.phone}`} className="text-primary hover:underline">{p.phone}</a></div>
                    )}
                    {p.email && (
                      <div className="flex items-center gap-2"><Mail className="h-3.5 w-3.5 text-muted-foreground" /><a href={`mailto:${p.email}`} className="text-primary hover:underline">{p.email}</a></div>
                    )}
                    {p.website && (
                      <div className="flex items-center gap-2"><ExternalLink className="h-3.5 w-3.5 text-muted-foreground" /><a href={p.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{p.website}</a></div>
                    )}
                  </div>

                  {/* Metrics Grid */}
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      ['Revenue', `€${(p.totalRevenue / 1e6).toFixed(2)}M`],
                      ['ROI', `${p.roi}x`],
                      ['Engagement', `${p.engagementScore}/100`],
                      ['Risk Score', `${p.riskScore}/100`],
                      ['Events', pEvents.length],
                      ['Investment', `€${(p.investment / 1e3).toFixed(0)}k`],
                    ].map(([l, v]) => (
                      <div key={String(l)} className="bg-accent rounded-lg p-2.5">
                        <p className="text-xs text-muted-foreground">{l}</p>
                        <p className="text-sm font-semibold mt-0.5">{v}</p>
                      </div>
                    ))}
                  </div>

                  {/* Recent Events */}
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
      <Sheet open={panelType === 'datacenter'} onOpenChange={closePanel}>
        <SheetContent className="overflow-y-auto">
          {panelType === 'datacenter' && panelData && (() => {
            const dc = panelData as Datacenter;
            return (
              <>
                <SheetHeader>
                  <SheetTitle className="flex items-center gap-2">
                    <Server className="h-4 w-4" /> {dc.name}
                  </SheetTitle>
                  <SheetDescription>{dc.location}</SheetDescription>
                </SheetHeader>
                <div className="space-y-4 mt-4">
                  <div className="flex gap-2 flex-wrap">
                    <Badge variant={dc.type === 'primary' ? 'default' : dc.type === 'secondary' ? 'secondary' : 'outline'} className="capitalize">{dc.type}</Badge>
                    <Badge variant={dc.status === 'operational' ? 'outline' : dc.status === 'maintenance' ? 'secondary' : 'destructive'} className="capitalize">{dc.status}</Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      ['Region', dc.region],
                      ['Uptime', dc.status === 'planned' ? 'N/A' : `${dc.uptime}%`],
                      ['Capacity Used', dc.status === 'planned' ? 'N/A' : `${dc.capacityUsed}%`],
                      ['Latency', dc.status === 'planned' ? 'N/A' : `${dc.latency}ms`],
                    ].map(([l, v]) => (
                      <div key={String(l)} className="bg-accent rounded-lg p-2.5">
                        <p className="text-xs text-muted-foreground">{l}</p>
                        <p className="text-sm font-semibold mt-0.5">{v}</p>
                      </div>
                    ))}
                  </div>
                  {dc.status !== 'planned' && (
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
      <Sheet open={panelType === 'event'} onOpenChange={closePanel}>
        <SheetContent className="overflow-y-auto">
          {panelType === 'event' && panelData && (() => {
            const e = panelData as Event;
            const hostPartner = e.partnerId ? partners.find(p => p.id === e.partnerId) : null;
            return (
              <>
                <SheetHeader>
                  <SheetTitle className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" /> {e.name}
                  </SheetTitle>
                  <SheetDescription>
                    {e.location || e.country} · {e.date || e.year} · {e.category || e.type}
                  </SheetDescription>
                </SheetHeader>
                <div className="space-y-4 mt-4">
                  <div className="flex gap-2 flex-wrap">
                    <Badge variant="outline">{e.category || e.type}</Badge>
                    {e.eventKind && <Badge variant={e.eventKind === 'owned' ? 'default' : 'secondary'} className="capitalize">{e.eventKind}</Badge>}
                    {e.status && <Badge variant="outline">{e.status}</Badge>}
                  </div>

                  {e.audience && (
                    <div className="text-sm"><span className="text-muted-foreground text-xs">Audience: </span>{e.audience}</div>
                  )}
                  {e.strategicValue && (
                    <div className="bg-blue-50 rounded-lg p-3 text-xs text-blue-800">{e.strategicValue}</div>
                  )}

                  {(e.registrations > 0 || e.revenueImpact > 0) && (
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        e.budget > 0 && ['Budget', `€${(e.budget / 1e3).toFixed(0)}k`],
                        e.revenueImpact > 0 && ['Revenue Impact', `€${(e.revenueImpact / 1e3).toFixed(0)}k`],
                        e.registrations > 0 && ['Registrations', e.registrations.toLocaleString()],
                        e.attendance > 0 && ['Attendance', e.attendance.toLocaleString()],
                        e.leads > 0 && ['Leads', e.leads],
                        e.conversions > 0 && ['Conversions', e.conversions],
                        e.conversionRate > 0 && ['Conv. Rate', `${e.conversionRate}%`],
                        e.budget > 0 && e.revenueImpact > 0 && ['ROI', `${(e.revenueImpact / e.budget).toFixed(1)}x`],
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
    </div>
  );
}
