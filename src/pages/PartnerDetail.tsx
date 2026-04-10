import { useParams, Link } from "react-router-dom";
import { partners, events, eventLearnings, computeHealthScore, healthLabel, healthColor, healthBg } from "@/data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, AlertTriangle, Lightbulb, TrendingUp, TrendingDown, Clock, Phone, Mail, Globe, MapPin, Users, GitCompare } from "lucide-react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

function AutoInsights({ partner }: { partner: ReturnType<typeof partners[0]['id'] extends string ? typeof partners[number] : never> }) {
  const p = partner;
  const insights: { type: 'info' | 'warning' | 'critical'; message: string }[] = [];

  const daysInactive = Math.floor((Date.now() - new Date(p.lastActivity).getTime()) / 86400000);
  const health = computeHealthScore(p);
  const partnerEvents = events.filter(e => e.partnerId === p.id);
  const recentRevs = p.revenueByMonth.slice(-3).map(r => r.revenue);
  const prevRevs = p.revenueByMonth.slice(-6, -3).map(r => r.revenue);
  const avgRecent = recentRevs.reduce((s, v) => s + v, 0) / 3;
  const avgPrev = prevRevs.reduce((s, v) => s + v, 0) / 3;
  const revChange = avgPrev > 0 ? ((avgRecent - avgPrev) / avgPrev) * 100 : 0;

  if (daysInactive > 90) insights.push({ type: 'critical', message: `Inactive for ${daysInactive} days — immediate contact required` });
  else if (daysInactive > 30) insights.push({ type: 'warning', message: `No activity in ${daysInactive} days — follow-up recommended` });

  if (revChange < -15) insights.push({ type: 'critical', message: `Revenue dropped ${Math.abs(revChange).toFixed(0)}% in last 3 months vs prior 3 months` });
  else if (revChange < -5) insights.push({ type: 'warning', message: `Revenue declining: ${revChange.toFixed(0)}% QoQ — monitor closely` });
  else if (revChange > 10) insights.push({ type: 'info', message: `Revenue growing: +${revChange.toFixed(0)}% QoQ — strong momentum` });

  if (p.engagementScore < 50 && p.roi > 2.5) insights.push({ type: 'warning', message: `High potential (${p.roi}x ROI) but low engagement (${p.engagementScore}/100) — opportunity to deepen relationship` });
  if (p.engagementScore >= 85) insights.push({ type: 'info', message: `Top engagement score (${p.engagementScore}/100) — great candidate for co-marketing` });

  if (partnerEvents.length === 0) insights.push({ type: 'warning', message: 'No events recorded — consider planning a joint event or webinar' });
  else {
    const latestEventYear = Math.max(...partnerEvents.map(e => e.year));
    if (latestEventYear < 2025) insights.push({ type: 'warning', message: `Last event was in ${latestEventYear} — no 2025/2026 events planned` });
  }

  if (p.riskScore > 60) insights.push({ type: 'critical', message: `High risk score (${p.riskScore}/100) — review partnership terms` });
  else if (p.riskScore > 40) insights.push({ type: 'warning', message: `Elevated risk score (${p.riskScore}/100) — keep monitoring` });

  if (p.roi < 2.0) insights.push({ type: 'warning', message: `Low ROI (${p.roi}x) — review investment allocation or co-marketing strategy` });
  if (health >= 80) insights.push({ type: 'info', message: `Excellent health score (${health}/100) — partner is healthy and growing` });

  if (insights.length === 0) insights.push({ type: 'info', message: 'No critical issues detected — partner appears healthy' });

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <Lightbulb className="h-4 w-4 text-primary" /> Auto Insights
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {insights.map((ins, i) => (
          <div key={i} className={`flex items-start gap-2 rounded-lg px-3 py-2.5 text-sm border ${
            ins.type === 'critical' ? 'bg-red-50 border-red-200 text-red-800' :
            ins.type === 'warning' ? 'bg-yellow-50 border-yellow-200 text-yellow-800' :
            'bg-blue-50 border-blue-200 text-blue-800'
          }`}>
            {ins.type === 'critical' ? <AlertTriangle className="h-4 w-4 flex-shrink-0 mt-0.5" /> :
             ins.type === 'warning' ? <AlertTriangle className="h-4 w-4 flex-shrink-0 mt-0.5" /> :
             <Lightbulb className="h-4 w-4 flex-shrink-0 mt-0.5" />}
            <span>{ins.message}</span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export default function PartnerDetail() {
  const { id } = useParams();
  const partner = partners.find(p => p.id === id);
  if (!partner) return <div className="text-center py-20 text-muted-foreground">Partner not found</div>;

  const partnerEvents = events.filter(e => e.partnerId === partner.id);
  const learnings = eventLearnings.filter(l => partnerEvents.some(e => e.id === l.eventId));
  const health = computeHealthScore(partner);
  const daysInactive = Math.floor((Date.now() - new Date(partner.lastActivity).getTime()) / 86400000);

  const roiData = [
    { name: 'Investment', value: partner.investment },
    { name: 'Revenue', value: partner.totalRevenue },
  ];

  // Activity timeline (events + last activity as milestones)
  const timeline = [
    ...partnerEvents.map(e => ({
      date: `${e.year}`,
      label: e.name,
      type: 'event' as const,
      detail: `${e.type} · ${e.leads} leads · €${(e.revenueImpact / 1e3).toFixed(0)}k impact`,
    })),
    { date: partner.lastActivity, label: 'Last Activity', type: 'activity' as const, detail: `${daysInactive} days ago` },
    { date: String(Math.min(...partner.yearsActive)), label: `Partnership Started`, type: 'start' as const, detail: `${partner.yearsActive.length} years as partner` },
  ].sort((a, b) => String(b.date).localeCompare(String(a.date)));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link to="/partners"><Button variant="ghost" size="icon"><ArrowLeft className="h-4 w-4" /></Button></Link>
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-2xl font-semibold">{partner.name}</h1>
            {partner.tier && (
              <Badge variant={partner.tier === 'platinum' ? 'default' : partner.tier === 'gold' ? 'secondary' : 'outline'} className="capitalize">
                {partner.tier} Partner
              </Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground">{partner.city}, {partner.country} · {partner.product}</p>
        </div>
        <Link to="/compare">
          <Button variant="outline" size="sm" className="gap-1">
            <GitCompare className="h-3.5 w-3.5" /> Compare
          </Button>
        </Link>
      </div>

      {/* Health Score Banner */}
      <Card className={`border ${healthBg(health)}`}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-1">Partner Health Score</p>
              <div className="flex items-center gap-3">
                <span className={`text-3xl font-bold ${healthColor(health)}`}>{health}</span>
                <div>
                  <Badge variant={health >= 70 ? 'outline' : health >= 45 ? 'secondary' : 'destructive'}
                    className={healthColor(health)}>
                    {healthLabel(health)}
                  </Badge>
                  <p className="text-xs text-muted-foreground mt-0.5">Engagement · Risk · Activity</p>
                </div>
              </div>
            </div>
            <div className="text-right text-sm space-y-1">
              <p className="text-xs text-muted-foreground">Components</p>
              <div className="space-y-1 text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground w-20 text-right">Engagement</span>
                  <div className="w-24 h-1.5 bg-white/50 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: `${partner.engagementScore}%` }} />
                  </div>
                  <span className="font-medium w-8">{partner.engagementScore}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground w-20 text-right">Safety</span>
                  <div className="w-24 h-1.5 bg-white/50 rounded-full overflow-hidden">
                    <div className="h-full bg-green-500 rounded-full" style={{ width: `${100 - partner.riskScore}%` }} />
                  </div>
                  <span className="font-medium w-8">{100 - partner.riskScore}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground w-20 text-right">Activity</span>
                  <div className="w-24 h-1.5 bg-white/50 rounded-full overflow-hidden">
                    <div className="h-full bg-orange-500 rounded-full" style={{ width: `${Math.max(0, 100 - daysInactive * 1.5)}%` }} />
                  </div>
                  <span className="font-medium w-8">{Math.max(0, Math.round(100 - daysInactive * 1.5))}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact Card */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2"><Users className="h-4 w-4" /> Contact Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            {partner.address && (
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                <span className="text-muted-foreground">{partner.address}</span>
              </div>
            )}
            {partner.contactPerson && (
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <span>{partner.contactPerson}</span>
              </div>
            )}
            {partner.phone && (
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <a href={`tel:${partner.phone}`} className="text-primary hover:underline">{partner.phone}</a>
              </div>
            )}
            {partner.email && (
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <a href={`mailto:${partner.email}`} className="text-primary hover:underline">{partner.email}</a>
              </div>
            )}
            {partner.website && (
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <a href={partner.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{partner.website}</a>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Overview KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          ['Total Revenue', `€${(partner.totalRevenue / 1e6).toFixed(2)}M`],
          ['ROI', `${partner.roi}x`],
          ['Events', partnerEvents.length],
          ['Years Active', partner.yearsActive.length],
        ].map(([l, v]) => (
          <Card key={String(l)}>
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground">{l}</p>
              <p className="text-xl font-semibold mt-1">{v}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Auto Insights */}
      <AutoInsights partner={partner} />

      {/* Revenue Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-base">Revenue Trend (2025)</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={partner.revenueByMonth}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" tickFormatter={v => `€${(v / 1000).toFixed(0)}k`} />
                <Tooltip formatter={(v: number) => [`€${v.toLocaleString()}`, 'Revenue']} />
                <Line type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-base">Investment vs Revenue</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={roiData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" tickFormatter={v => `€${(v / 1e6).toFixed(1)}M`} />
                <Tooltip formatter={(v: number) => [`€${v.toLocaleString()}`, '']} />
                <Bar dataKey="value" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Activity Timeline */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2"><Clock className="h-4 w-4" /> Activity Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative pl-6 space-y-4">
            <div className="absolute left-2 top-0 bottom-0 w-px bg-border" />
            {timeline.map((item, i) => (
              <div key={i} className="relative">
                <div className={`absolute -left-4 top-1 h-3 w-3 rounded-full border-2 border-background ${
                  item.type === 'event' ? 'bg-primary' :
                  item.type === 'activity' ? 'bg-orange-500' : 'bg-green-500'
                }`} />
                <div className="pl-2">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium">{item.label}</p>
                    <Badge variant="outline" className="text-xs">{item.date}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{item.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Events */}
      <Card>
        <CardHeader className="pb-2"><CardTitle className="text-base">Events Conducted ({partnerEvents.length})</CardTitle></CardHeader>
        <CardContent>
          {partnerEvents.length === 0 ? (
            <p className="text-sm text-muted-foreground">No events recorded for this partner.</p>
          ) : (
            <div className="space-y-2">
              {partnerEvents.map(e => {
                const learning = learnings.find(l => l.eventId === e.id);
                return (
                  <div key={e.id} className="rounded-lg border p-3">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-medium">{e.name}</p>
                      <div className="flex gap-1">
                        <Badge variant="outline" className="text-xs">{e.type}</Badge>
                        <Badge variant="outline" className="text-xs">{e.year}</Badge>
                      </div>
                    </div>
                    <div className="grid grid-cols-4 gap-2 text-xs text-muted-foreground">
                      <span>Leads: <strong>{e.leads}</strong></span>
                      <span>Conv: <strong>{e.conversionRate}%</strong></span>
                      <span>Impact: <strong>€{(e.revenueImpact / 1e3).toFixed(0)}k</strong></span>
                      <span>ROI: <strong>{(e.revenueImpact / e.budget).toFixed(1)}x</strong></span>
                    </div>
                    {learning && (
                      <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                        <div className="bg-green-50 rounded px-2 py-1.5 border border-green-100">
                          <p className="font-medium text-green-700 mb-0.5">What worked</p>
                          <ul className="text-green-800 space-y-0.5">
                            {learning.whatWorked.slice(0, 2).map((w, i) => <li key={i}>· {w}</li>)}
                          </ul>
                        </div>
                        <div className="bg-red-50 rounded px-2 py-1.5 border border-red-100">
                          <p className="font-medium text-red-700 mb-0.5">What didn't work</p>
                          <ul className="text-red-800 space-y-0.5">
                            {learning.whatDidntWork.slice(0, 2).map((w, i) => <li key={i}>· {w}</li>)}
                          </ul>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Risk & Engagement */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-base">Risk & Engagement</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {[
              { label: 'Engagement Score', value: partner.engagementScore, color: 'bg-primary' },
              { label: 'Risk Score', value: partner.riskScore, color: 'bg-destructive' },
            ].map(({ label, value, color }) => (
              <div key={label} className="flex items-center justify-between gap-3">
                <span className="text-sm w-36 flex-shrink-0">{label}</span>
                <div className="flex-1 h-2 bg-accent rounded-full overflow-hidden">
                  <div className={`h-full ${color} rounded-full`} style={{ width: `${value}%` }} />
                </div>
                <span className="text-sm font-medium w-12 text-right">{value}/100</span>
              </div>
            ))}
            <Badge variant={partner.riskLevel === 'low' ? 'outline' : partner.riskLevel === 'medium' ? 'secondary' : 'destructive'}>
              {partner.riskLevel} risk
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-base">Quick Facts</CardTitle></CardHeader>
          <CardContent className="space-y-2 text-sm">
            {[
              ['Years Active', partner.yearsActive.join(', ')],
              ['Last Activity', `${partner.lastActivity} (${daysInactive} days ago)`],
              ['Products', partner.product],
              ['Investment', `€${(partner.investment / 1e3).toFixed(0)}k`],
            ].map(([l, v]) => (
              <div key={String(l)} className="flex justify-between border-b last:border-0 pb-1.5">
                <span className="text-muted-foreground">{l}</span>
                <span className="font-medium text-right max-w-48">{v}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
