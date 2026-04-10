import { useState } from "react";
import { partners, events, computeHealthScore, healthLabel, healthColor } from "@/data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar, Legend } from "recharts";
import { GitCompare, Plus, X, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";

const COLORS = ['hsl(221, 83%, 53%)', 'hsl(25, 95%, 53%)', 'hsl(142, 76%, 36%)'];

export default function Compare() {
  const [selectedIds, setSelectedIds] = useState<string[]>(['p_deu1', 'p_gbr1', 'p_fra3']);

  const add = (id: string) => {
    if (!selectedIds.includes(id) && selectedIds.length < 3) setSelectedIds(prev => [...prev, id]);
  };
  const remove = (id: string) => setSelectedIds(prev => prev.filter(x => x !== id));

  const selected = selectedIds.map(id => partners.find(p => p.id === id)!).filter(Boolean);

  const metrics = selected.map(p => {
    const partnerEvents = events.filter(e => e.partnerId === p.id);
    const health = computeHealthScore(p);
    return {
      partner: p,
      events: partnerEvents.length,
      health,
      avgConversion: partnerEvents.length > 0
        ? +(partnerEvents.reduce((s, e) => s + e.conversionRate, 0) / partnerEvents.length).toFixed(1)
        : 0,
      totalRevenueImpact: partnerEvents.reduce((s, e) => s + e.revenueImpact, 0),
    };
  });

  // Bar chart: Revenue
  const revenueData = [
    { metric: 'Revenue', ...Object.fromEntries(metrics.map(m => [m.partner.name.split(' ')[0], m.partner.totalRevenue / 1e6])) },
    { metric: 'Investment', ...Object.fromEntries(metrics.map(m => [m.partner.name.split(' ')[0], m.partner.investment / 1e6])) },
  ];

  // Radar chart data
  const radarData = [
    { subject: 'Revenue', ...Object.fromEntries(metrics.map(m => [m.partner.name.split(' ')[0], Math.min(100, m.partner.totalRevenue / 30000)])) },
    { subject: 'ROI', ...Object.fromEntries(metrics.map(m => [m.partner.name.split(' ')[0], m.partner.roi * 20])) },
    { subject: 'Engagement', ...Object.fromEntries(metrics.map(m => [m.partner.name.split(' ')[0], m.partner.engagementScore])) },
    { subject: 'Health', ...Object.fromEntries(metrics.map(m => [m.partner.name.split(' ')[0], m.health])) },
    { subject: 'Events', ...Object.fromEntries(metrics.map(m => [m.partner.name.split(' ')[0], Math.min(100, m.events * 12)])) },
    { subject: 'Safety', ...Object.fromEntries(metrics.map(m => [m.partner.name.split(' ')[0], 100 - m.partner.riskScore])) },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold flex items-center gap-2">
          <GitCompare className="h-6 w-6 text-primary" /> Partner Comparison
        </h1>
        <p className="text-sm text-muted-foreground">Compare up to 3 partners side-by-side across all key metrics</p>
      </div>

      {/* Partner Selector */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-sm font-medium text-muted-foreground">Comparing:</span>
            {selected.map((p, i) => (
              <div key={p.id} className="flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium text-white"
                style={{ backgroundColor: COLORS[i] }}>
                {p.name}
                <button onClick={() => remove(p.id)} className="hover:opacity-70">
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
            {selected.length < 3 && (
              <div className="flex items-center gap-2">
                <Select onValueChange={add}>
                  <SelectTrigger className="w-56 h-8 text-xs">
                    <SelectValue placeholder="Add partner…" />
                  </SelectTrigger>
                  <SelectContent>
                    {partners.filter(p => !selectedIds.includes(p.id)).map(p => (
                      <SelectItem key={p.id} value={p.id} className="text-xs">
                        {p.name} ({p.country})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {selected.length === 0 && (
        <Card><CardContent className="p-8 text-center text-muted-foreground text-sm">Select at least one partner to compare.</CardContent></Card>
      )}

      {selected.length > 0 && (
        <>
          {/* Key Metrics Side-by-Side */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {metrics.map((m, i) => (
              <Card key={m.partner.id} style={{ borderTopColor: COLORS[i], borderTopWidth: 3 }}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center justify-between">
                    <Link to={`/partners/${m.partner.id}`} className="hover:underline text-primary">
                      {m.partner.name}
                    </Link>
                    <Badge variant={m.partner.tier === 'platinum' ? 'default' : m.partner.tier === 'gold' ? 'secondary' : 'outline'} className="text-xs capitalize">
                      {m.partner.tier}
                    </Badge>
                  </CardTitle>
                  <p className="text-xs text-muted-foreground">{m.partner.country} · {m.partner.city}</p>
                </CardHeader>
                <CardContent className="space-y-2">
                  {[
                    ['Revenue', `€${(m.partner.totalRevenue / 1e6).toFixed(2)}M`],
                    ['ROI', `${m.partner.roi}x`],
                    ['Investment', `€${(m.partner.investment / 1e3).toFixed(0)}k`],
                    ['Events', m.events],
                    ['Engagement', `${m.partner.engagementScore}/100`],
                    ['Risk Score', `${m.partner.riskScore}/100`],
                    ['Event Revenue', `€${(m.totalRevenueImpact / 1e3).toFixed(0)}k`],
                    ['Avg Conv. Rate', m.avgConversion > 0 ? `${m.avgConversion}%` : 'N/A'],
                  ].map(([label, value]) => (
                    <div key={String(label)} className="flex justify-between text-sm border-b last:border-0 pb-1.5">
                      <span className="text-muted-foreground text-xs">{label}</span>
                      <span className="font-medium text-xs">{value}</span>
                    </div>
                  ))}
                  {/* Health Score */}
                  <div className="pt-1">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs text-muted-foreground">Health Score</span>
                      <span className={`text-xs font-semibold ${healthColor(m.health)}`}>
                        {m.health}/100 · {healthLabel(m.health)}
                      </span>
                    </div>
                    <div className="h-1.5 bg-accent rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all"
                        style={{
                          width: `${m.health}%`,
                          backgroundColor: m.health >= 70 ? '#16a34a' : m.health >= 45 ? '#ca8a04' : '#dc2626',
                        }} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Revenue Bar Chart */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Revenue vs Investment</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="metric" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                    <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" tickFormatter={v => `€${v.toFixed(1)}M`} />
                    <Tooltip formatter={(v: number) => [`€${v.toFixed(2)}M`, '']} />
                    <Legend />
                    {metrics.map((m, i) => (
                      <Bar key={m.partner.id} dataKey={m.partner.name.split(' ')[0]} fill={COLORS[i]} radius={[4, 4, 0, 0]} />
                    ))}
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Radar Chart */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-primary" /> Performance Radar
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="hsl(var(--border))" />
                    <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11 }} />
                    <Legend />
                    {metrics.map((m, i) => (
                      <Radar
                        key={m.partner.id}
                        name={m.partner.name.split(' ')[0]}
                        dataKey={m.partner.name.split(' ')[0]}
                        stroke={COLORS[i]}
                        fill={COLORS[i]}
                        fillOpacity={0.15}
                      />
                    ))}
                  </RadarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Revenue Trend Side-by-Side */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Monthly Revenue Trend (2025)</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={(() => {
                  const months = selected[0]?.revenueByMonth.map(r => r.month.slice(0, 3)) || [];
                  return months.map((m, idx) => ({
                    month: m,
                    ...Object.fromEntries(metrics.map(met => [
                      met.partner.name.split(' ')[0],
                      met.partner.revenueByMonth[idx]?.revenue || 0,
                    ])),
                  }));
                })()}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                  <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" tickFormatter={v => `€${(v / 1e3).toFixed(0)}k`} />
                  <Tooltip formatter={(v: number) => [`€${v.toLocaleString()}`, '']} />
                  <Legend />
                  {metrics.map((m, i) => (
                    <Bar key={m.partner.id} dataKey={m.partner.name.split(' ')[0]} fill={COLORS[i]} radius={[4, 4, 0, 0]} />
                  ))}
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Winner Summary */}
          <Card className="bg-primary/5 border-primary/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-primary" /> Comparison Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                {[
                  { label: 'Highest Revenue', winner: metrics.reduce((a, b) => a.partner.totalRevenue > b.partner.totalRevenue ? a : b) },
                  { label: 'Best ROI', winner: metrics.reduce((a, b) => a.partner.roi > b.partner.roi ? a : b) },
                  { label: 'Healthiest Partner', winner: metrics.reduce((a, b) => a.health > b.health ? a : b) },
                ].map(({ label, winner }) => (
                  <div key={label} className="bg-white rounded-lg p-3 border">
                    <p className="text-xs text-muted-foreground">{label}</p>
                    <p className="font-semibold mt-0.5">{winner.partner.name}</p>
                    <p className="text-xs text-muted-foreground">{winner.partner.country}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
