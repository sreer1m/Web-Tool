import { useState } from "react";
import { partners, events, countries, computeHealthScore } from "@/data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { MapPin, TrendingDown, Eye, Target, AlertTriangle, Compass, FlaskConical, TrendingUp } from "lucide-react";

// ─── Coverage Gaps ───────────────────────────────────────────────────────────
const gapCountries = countries.filter(c => c.demand > 55 && c.partnerCount === 0);

// ─── Underperformers ─────────────────────────────────────────────────────────
const underperformers = partners
  .filter(p => computeHealthScore(p) < 50)
  .sort((a, b) => computeHealthScore(a) - computeHealthScore(b))
  .slice(0, 8);

// ─── Underperforming Regions ─────────────────────────────────────────────────
const regionPerf = ['Germany','France','United Kingdom','Spain','Italy','Netherlands','Switzerland','Poland'].map(c => ({
  country: c.slice(0, 3).toUpperCase(),
  fullName: c,
  impact: events.filter(e => e.country === c).reduce((s, e) => s + e.revenueImpact, 0),
  partners: partners.filter(p => p.country === c).length,
  avgRoi: partners.filter(p => p.country === c).length > 0
    ? +(partners.filter(p => p.country === c).reduce((s,p)=>s+p.roi,0) / partners.filter(p=>p.country===c).length).toFixed(1)
    : 0,
}));

// ─── Strategic Recommendations ────────────────────────────────────────────────
const recommendations = [
  { action: 'Expand to Scandinavia', reason: 'INUIT AB (Sweden) performing well — explore Norway/Finland depth', priority: 'high' },
  { action: 'Accelerate Turkey growth', reason: 'Vitel A.S. is sole partner with 85/100 demand score — add second partner', priority: 'high' },
  { action: 'Double down on Germany', reason: 'MicroNova AG (Platinum) delivers €2.6M — highest single-partner revenue', priority: 'high' },
  { action: 'Modernize Balkans network', reason: '4sec d.o.o. covers 5 countries (Bosnia, Kosovo, etc.) — risk of single point of failure', priority: 'medium' },
  { action: 'Review Ukraine strategy', reason: 'Two partners inactive 7+ months — revenue risk amid geopolitical uncertainty', priority: 'high' },
  { action: 'Activate Belgium for events', reason: 'Sertalink BV has no 2026 event — Brussels is EU HQ hub with strategic value', priority: 'medium' },
  { action: 'Pilot webinar in Georgia & Armenia', reason: 'SYNTAX and ME Ltd are small but growing — low-cost webinar can test demand', priority: 'low' },
  { action: 'Leverage Channel IT multi-country reach', reason: 'Cyprus, Greece, Malta all covered — coordinate regional campaigns', priority: 'medium' },
];

// ─── What-If Simulator ────────────────────────────────────────────────────────
const SIMILAR_EVENTS = events.filter(e => e.year === 2025);
const avgLeadPerEvent = SIMILAR_EVENTS.reduce((s,e)=>s+e.leads,0) / SIMILAR_EVENTS.length;
const avgConvRate = SIMILAR_EVENTS.reduce((s,e)=>s+e.conversionRate,0) / SIMILAR_EVENTS.length;
const avgRevenuePerEvent = SIMILAR_EVENTS.reduce((s,e)=>s+e.revenueImpact,0) / SIMILAR_EVENTS.length;

export default function Intelligence() {
  const [simCountry, setSimCountry] = useState('Germany');
  const [simEvents, setSimEvents] = useState(3);
  const [simBudget, setSimBudget] = useState(80000);

  const simLeads = Math.round(avgLeadPerEvent * simEvents);
  const simConversions = Math.round(simLeads * (avgConvRate / 100));
  const simRevenue = Math.round(avgRevenuePerEvent * simEvents);
  const simROI = simBudget > 0 ? (simRevenue / (simBudget * simEvents)).toFixed(1) : 'N/A';

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Intelligence</h1>
        <p className="text-sm text-muted-foreground">Strategic insights, gap analysis, and decision support</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Coverage Gaps */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2"><MapPin className="h-4 w-4 text-primary" /> Partner Coverage Gaps</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {gapCountries.length === 0
              ? <p className="text-sm text-muted-foreground">No significant coverage gaps detected.</p>
              : gapCountries.slice(0, 8).map(c => (
              <div key={c.code} className="flex items-center justify-between py-2 px-3 rounded-lg bg-accent/50">
                <div>
                  <p className="text-sm font-medium">{c.name}</p>
                  <p className="text-xs text-muted-foreground">{c.traffic.toLocaleString()} monthly traffic</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-primary">Demand: {c.demand}</p>
                  <Badge variant="outline" className="text-xs">Opportunity</Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Event Impact by Region */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2"><Target className="h-4 w-4 text-primary" /> Event Revenue Impact by Region</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={regionPerf}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="country" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" tickFormatter={v => `€${(v/1e6).toFixed(1)}M`} />
                <Tooltip formatter={(v: number) => [`€${v.toLocaleString()}`, 'Revenue']} />
                <Bar dataKey="impact" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Underperformance Detector */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2"><TrendingDown className="h-4 w-4 text-destructive" /> Underperformance Detector</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-xs text-muted-foreground mb-2">Partners with health score &lt; 50 — action needed</p>
            {underperformers.map(p => {
              const health = computeHealthScore(p);
              return (
                <div key={p.id} className="flex items-center justify-between py-2 px-3 rounded-lg bg-red-50 border border-red-100">
                  <div>
                    <p className="text-sm font-medium">{p.name}</p>
                    <p className="text-xs text-muted-foreground">{p.country} · Last active: {p.lastActivity}</p>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-bold ${health < 30 ? 'text-red-600' : 'text-yellow-600'}`}>{health}/100</p>
                    <Badge variant="destructive" className="text-xs">At Risk</Badge>
                  </div>
                </div>
              );
            })}
            {underperformers.length === 0 && <p className="text-sm text-muted-foreground">No underperforming partners detected.</p>}
          </CardContent>
        </Card>

        {/* Where We Should Go Next */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2"><Compass className="h-4 w-4 text-green-600" /> Strategic Recommendations</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {recommendations.map((r, i) => (
              <div key={i} className="py-2 px-3 rounded-lg bg-accent/50">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">{r.action}</p>
                  <Badge variant={r.priority === 'high' ? 'default' : r.priority === 'medium' ? 'secondary' : 'outline'} className="text-xs">{r.priority}</Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-1">{r.reason}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* What-If Simulator */}
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <FlaskConical className="h-4 w-4 text-primary" /> What-If Event Simulator
          </CardTitle>
          <p className="text-xs text-muted-foreground">Simulate revenue outcomes based on historical event data averages</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <Label className="text-xs">Country / Region</Label>
              <Select value={simCountry} onValueChange={setSimCountry}>
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {['Germany','France','United Kingdom','Spain','Italy','Netherlands','Switzerland','Poland','Turkey','Sweden','Belgium','Austria'].map(c => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs">Number of Events</Label>
              <Input type="number" min={1} max={10} value={simEvents} onChange={e => setSimEvents(Number(e.target.value))}
                className="mt-1" />
            </div>
            <div>
              <Label className="text-xs">Budget per Event (€)</Label>
              <Input type="number" min={10000} step={5000} value={simBudget} onChange={e => setSimBudget(Number(e.target.value))}
                className="mt-1" />
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Est. Leads', value: simLeads.toLocaleString(), icon: '👥' },
              { label: 'Est. Conversions', value: simConversions.toLocaleString(), icon: '✅' },
              { label: 'Est. Revenue Impact', value: `€${(simRevenue / 1e3).toFixed(0)}k`, icon: '💰' },
              { label: 'Est. ROI', value: `${simROI}x`, icon: '📈' },
            ].map(({ label, value, icon }) => (
              <div key={label} className="bg-white rounded-lg p-4 border text-center">
                <div className="text-2xl mb-1">{icon}</div>
                <p className="text-xs text-muted-foreground">{label}</p>
                <p className="text-xl font-bold text-primary mt-0.5">{value}</p>
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-3">
            Based on {SIMILAR_EVENTS.length} events in 2025 · Avg leads/event: {Math.round(avgLeadPerEvent)} · Avg conversion: {avgConvRate.toFixed(1)}% · Avg revenue: €{(avgRevenuePerEvent/1e3).toFixed(0)}k
          </p>
        </CardContent>
      </Card>

      {/* ROI Tracker */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2"><TrendingUp className="h-4 w-4 text-primary" /> Partner ROI Tracker (Top 12)</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={[...partners].sort((a,b)=>b.roi-a.roi).slice(0,12).map(p => ({
              name: p.name.split(' ')[0],
              investment: +(p.investment / 1e3).toFixed(0),
              revenue: +(p.totalRevenue / 1e3).toFixed(0),
              roi: p.roi,
            }))} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis type="number" tick={{ fontSize: 10 }} tickFormatter={v => `€${v}k`} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 10 }} width={70} />
              <Tooltip formatter={(v: number) => [`€${v}k`, '']} />
              <Bar dataKey="investment" fill="hsl(var(--muted-foreground))" radius={[0, 4, 4, 0]} name="Investment" />
              <Bar dataKey="revenue" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} name="Revenue" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
