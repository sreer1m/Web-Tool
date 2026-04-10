import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { partners, events, alerts, computeHealthScore } from "@/data";
import { DollarSign, Users, Calendar, TrendingUp, AlertTriangle, Zap, ArrowRight, TrendingDown } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { Link } from "react-router-dom";

const totalRevenue = partners.reduce((s, p) => s + p.totalRevenue, 0);
const activePartners = partners.filter(p => p.yearsActive.includes(2026) || p.yearsActive.includes(2025)).length;
const eventsThisYear = events.filter(e => e.year === 2026).length;
const avgConversion = (events.reduce((s, e) => s + e.conversionRate, 0) / events.length).toFixed(1);

const revenueMonths = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'].map((m, i) => ({
  month: m,
  revenue: partners.reduce((s, p) => s + (p.revenueByMonth[i]?.revenue || 0), 0),
}));

const topPartners = [...partners].sort((a, b) => b.totalRevenue - a.totalRevenue).slice(0, 5);

const trends = (() => {
  const out: { type: 'up' | 'down' | 'warn'; text: string }[] = [];
  const byCountry = Object.fromEntries(
    ['Germany','France','United Kingdom','Spain','Italy','Netherlands','Switzerland','Poland'].map(c => [
      c, partners.filter(p => p.country === c).reduce((s, p) => s + p.totalRevenue, 0),
    ])
  );
  const topCountry = Object.entries(byCountry).sort((a,b) => b[1]-a[1])[0];
  out.push({ type: 'up', text: `${topCountry[0]} leads revenue at €${(topCountry[1]/1e6).toFixed(1)}M` });
  const highRisk = partners.filter(p => p.riskLevel === 'high');
  if (highRisk.length > 0) out.push({ type: 'warn', text: `${highRisk.length} high-risk partners require urgent review` });
  const platGold = partners.filter(p => p.tier === 'platinum' || p.tier === 'gold');
  const avgHealth = Math.round(platGold.reduce((s, p) => s + computeHealthScore(p), 0) / platGold.length);
  out.push({ type: avgHealth >= 70 ? 'up' : 'down', text: `Gold/Platinum avg health: ${avgHealth}/100` });
  const rev2026 = events.filter(e=>e.year===2026).reduce((s,e)=>s+e.revenueImpact,0);
  const rev2025 = events.filter(e=>e.year===2025).reduce((s,e)=>s+e.revenueImpact,0);
  const growth = rev2025 > 0 ? Math.round((rev2026-rev2025)/rev2025*100) : 0;
  out.push({ type: growth > 0 ? 'up' : 'down', text: `Event revenue YoY: ${growth>0?'+':''}${growth}% (2025→2026)` });
  return out;
})();

const regionSummary = ['Germany','France','United Kingdom','Spain','Italy','Netherlands','Switzerland','Poland'].map(country => {
  const cPartners = partners.filter(p => p.country === country);
  const cEvents = events.filter(e => e.country === country && e.year === 2026);
  const rev = cPartners.reduce((s, p) => s + p.totalRevenue, 0);
  const avgH = cPartners.length > 0
    ? Math.round(cPartners.reduce((s,p) => s + computeHealthScore(p), 0) / cPartners.length) : 0;
  return { country, partners: cPartners.length, events: cEvents.length, revenue: rev, health: avgH };
}).filter(r => r.partners > 0).sort((a, b) => b.revenue - a.revenue);

const nextActions = [
  { text: 'Review Russia partners — geopolitical risk', priority: 'critical', link: '/alerts' },
  { text: `Urgent follow-up: ${partners.find(p=>p.riskLevel==='high')?.name || 'high-risk partner'}`, priority: 'high', link: '/actions' },
  { text: 'Plan Q3 2026 events in underserved markets', priority: 'medium', link: '/actions' },
  { text: 'Deep-invest in MicroNova AG & Set3 Solutions (Platinum)', priority: 'medium', link: '/compare' },
];

const kpis = [
  { label: 'Total Revenue', value: `€${(totalRevenue / 1e6).toFixed(1)}M`, icon: DollarSign, change: '+8.4% YoY', positive: true },
  { label: 'Active Partners', value: activePartners, icon: Users, change: `${partners.length} total`, positive: true },
  { label: 'Events (2026)', value: eventsThisYear, icon: Calendar, change: '+3 YoY', positive: true },
  { label: 'Avg Conversion', value: `${avgConversion}%`, icon: TrendingUp, change: '+0.2%', positive: true },
];

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground">ManageEngine Partner & Event Intelligence — Europe</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map(k => (
          <Card key={k.label}>
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{k.label}</p>
                  <p className="text-2xl font-semibold mt-1">{k.value}</p>
                  <p className={`text-xs mt-1 ${k.positive ? 'text-green-600' : 'text-destructive'}`}>{k.change}</p>
                </div>
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <k.icon className="h-5 w-5 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Trend Highlights + Next Best Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" /> Trend Highlights
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {trends.map((t, i) => (
              <div key={i} className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${
                t.type === 'up' ? 'bg-green-50 text-green-800 border border-green-100' :
                t.type === 'down' ? 'bg-red-50 text-red-800 border border-red-100' :
                'bg-yellow-50 text-yellow-800 border border-yellow-100'
              }`}>
                {t.type === 'up' ? <TrendingUp className="h-3.5 w-3.5 flex-shrink-0" /> :
                 t.type === 'down' ? <TrendingDown className="h-3.5 w-3.5 flex-shrink-0" /> :
                 <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />}
                {t.text}
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Zap className="h-4 w-4 text-primary" /> Next Best Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {nextActions.map((a, i) => (
              <Link key={i} to={a.link}>
                <div className={`flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer hover:opacity-90 transition-opacity mb-1 ${
                  a.priority === 'critical' ? 'bg-red-50 border border-red-100' :
                  a.priority === 'high' ? 'bg-orange-50 border border-orange-100' :
                  'bg-blue-50 border border-blue-100'
                }`}>
                  <div className="flex items-center gap-2">
                    <Badge variant={a.priority === 'critical' ? 'destructive' : a.priority === 'high' ? 'default' : 'secondary'} className="text-xs">{a.priority}</Badge>
                    <span className="text-xs">{a.text}</span>
                  </div>
                  <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
                </div>
              </Link>
            ))}
            <Link to="/actions">
              <Button variant="ghost" size="sm" className="w-full text-xs mt-1">View All Actions →</Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Revenue + Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2"><CardTitle className="text-base">Revenue Trend (2025 Monthly)</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={revenueMonths}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" tickFormatter={v => `€${(v/1e6).toFixed(1)}M`} />
                <Tooltip formatter={(v: number) => [`€${v.toLocaleString()}`, 'Revenue']} />
                <Line type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-yellow-500" /> Active Alerts
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {alerts.slice(0, 5).map(a => (
              <div key={a.id} className={`flex items-start gap-2 text-xs px-2 py-2 rounded-lg ${
                a.severity === 'high' ? 'bg-red-50 border border-red-100' :
                a.severity === 'medium' ? 'bg-yellow-50 border border-yellow-100' :
                'bg-blue-50 border border-blue-100'
              }`}>
                <Badge variant={a.severity === 'high' ? 'destructive' : a.severity === 'medium' ? 'secondary' : 'outline'} className="text-xs flex-shrink-0">{a.severity}</Badge>
                <span className="leading-tight">{a.message}</span>
              </div>
            ))}
            <Link to="/alerts">
              <Button variant="ghost" size="sm" className="w-full text-xs">View All Alerts →</Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Region Summary Cards */}
      <div>
        <h2 className="text-base font-semibold mb-3">Region Summary</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {regionSummary.map(r => (
            <Card key={r.country} className="hover:shadow-sm transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium">{r.country}</p>
                  <div className="h-1.5 w-14 bg-accent rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${r.health}%`, backgroundColor: r.health >= 70 ? '#16a34a' : r.health >= 45 ? '#ca8a04' : '#dc2626' }} />
                  </div>
                </div>
                <p className="text-xl font-bold text-primary">€{(r.revenue / 1e6).toFixed(1)}M</p>
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>{r.partners} partner{r.partners !== 1 ? 's' : ''}</span>
                  <span>{r.events} '26 event{r.events !== 1 ? 's' : ''}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Top Partners + Revenue Bar */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-base">Top 5 Partners by Revenue</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {topPartners.map((p, i) => (
              <div key={p.id} className="flex items-center justify-between py-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground w-4">{i + 1}</span>
                  <div>
                    <Link to={`/partners/${p.id}`} className="text-sm font-medium text-primary hover:underline">{p.name}</Link>
                    <p className="text-xs text-muted-foreground">{p.country}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold">€{(p.totalRevenue / 1e6).toFixed(2)}M</p>
                  <Badge variant="outline" className="text-xs capitalize">{p.tier}</Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-base">Revenue by Region</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={regionSummary.slice(0, 6)} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis type="number" tick={{ fontSize: 10 }} tickFormatter={v => `€${(v/1e6).toFixed(1)}M`} />
                <YAxis type="category" dataKey="country" tick={{ fontSize: 11 }} width={100} />
                <Tooltip formatter={(v: number) => [`€${(v/1e6).toFixed(2)}M`, 'Revenue']} />
                <Bar dataKey="revenue" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
