import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  partners, events, alerts, datacenters,
  websiteAnalysisReports, computeHealthScore,
} from "@/data";
import {
  Users, Calendar, Bell, Server, Globe, AlertTriangle,
  TrendingUp, ArrowRight, CheckCircle2, XCircle, Activity,
  Monitor, Zap,
} from "lucide-react";
import { Link } from "react-router-dom";

// ─── Static partner analytics ────────────────────────────────────────────────
const totalPartners = partners.length;
const partnersByTier = {
  platinum: partners.filter(p => p.tier === "platinum").length,
  gold: partners.filter(p => p.tier === "gold").length,
  silver: partners.filter(p => p.tier === "silver").length,
  standard: partners.filter(p => p.tier === "standard").length,
};
const partnersByRisk = {
  high: partners.filter(p => p.riskLevel === "high").length,
  medium: partners.filter(p => p.riskLevel === "medium").length,
  low: partners.filter(p => p.riskLevel === "low").length,
};
const avgEngagement = Math.round(
  partners.reduce((s, p) => s + p.engagementScore, 0) / partners.length
);
const healthScores = partners.map(p => computeHealthScore(p));
const avgHealth = Math.round(healthScores.reduce((a, b) => a + b, 0) / healthScores.length);
const healthyCount = partners.filter(p => computeHealthScore(p) >= 70).length;
const atRiskCount = partners.filter(p => computeHealthScore(p) < 45).length;

// Recently active partners (activity in last 90 days from now)
const now = new Date("2026-04-15");
const recentlyActive = partners.filter(p => {
  const days = Math.floor((now.getTime() - new Date(p.lastActivity).getTime()) / 86400000);
  return days <= 90;
}).length;

// ─── Events analytics ────────────────────────────────────────────────────────
const events2026 = events.filter(e => e.year === 2026);
const ownedEvents = events2026.filter(e => e.eventKind === "owned");
const externalEvents = events2026.filter(e => e.eventKind === "external");
// Upcoming owned events (sorted by date string — approximation)
const upcomingEvents = [...ownedEvents].slice(0, 5);

// ─── Website analysis ────────────────────────────────────────────────────────
const totalAnalysed = websiteAnalysisReports.length;
const totalAlignmentIssues = websiteAnalysisReports.reduce((s, r) => s + r.alignmentIssues.length, 0);
const totalUxIssues = websiteAnalysisReports.reduce((s, r) => s + r.uxIssues.length, 0);
const reportsWithLighthouse = websiteAnalysisReports.filter(r => r.lighthouse);
const avgDesktopPerf = reportsWithLighthouse.length
  ? Math.round(reportsWithLighthouse.reduce((s, r) => s + r.lighthouse!.desktop.performance, 0) / reportsWithLighthouse.length)
  : null;
const avgMobilePerf = reportsWithLighthouse.length
  ? Math.round(reportsWithLighthouse.reduce((s, r) => s + r.lighthouse!.mobile.performance, 0) / reportsWithLighthouse.length)
  : null;

// ─── Datacenter analytics ────────────────────────────────────────────────────
const operationalDCs = datacenters.filter(d => d.status === "operational");
const avgCapacity = Math.round(operationalDCs.reduce((s, d) => s + d.capacityUsed, 0) / operationalDCs.length);
const avgUptime = (operationalDCs.reduce((s, d) => s + d.uptime, 0) / operationalDCs.length).toFixed(2);

// ─── Country coverage ────────────────────────────────────────────────────────
const countriesCovered = new Set(partners.map(p => p.country)).size;
const regionMap: Record<string, string[]> = {
  "DACH": ["Germany", "Austria", "Switzerland"],
  "Benelux": ["Netherlands", "Belgium", "Luxembourg"],
  "UK & Ireland": ["United Kingdom", "Ireland"],
  "Nordics": ["Finland", "Sweden", "Norway", "Denmark", "Iceland"],
  "Eastern Europe": ["Poland", "Czech Republic", "Hungary", "Romania", "Bulgaria", "Latvia", "Lithuania", "Estonia", "Croatia", "Serbia", "Slovakia", "Slovenia", "Albania", "North Macedonia", "Montenegro"],
  "Southern Europe": ["France", "Spain", "Italy", "Portugal", "Greece"],
};
const partnersByRegion = Object.entries(regionMap).map(([region, countries]) => ({
  region,
  count: partners.filter(p => countries.includes(p.country)).length,
})).sort((a, b) => b.count - a.count);

// ─── Pan-Europe events (fetched) ─────────────────────────────────────────────
type PanEvent = { event_name: string; region: string; priority_tier?: string; competitive_intensity?: string };
type ResearchJSON = { events: PanEvent[]; manageengine_participation: { event_name: string; participated: string }[] };

export default function Dashboard() {
  const [research, setResearch] = useState<ResearchJSON | null>(null);

  useEffect(() => {
    fetch("/research-data.json").then(r => r.json()).then(setResearch).catch(() => null);
  }, []);

  const panEvents = research?.events ?? [];
  const meParticipating = research?.manageengine_participation.filter(p => p.participated === "YES").length ?? 0;
  const tier1 = panEvents.filter(e => e.priority_tier === "1").length;
  const tier2 = panEvents.filter(e => e.priority_tier === "2").length;
  const tier3 = panEvents.filter(e => e.priority_tier === "3").length;
  const highCompetition = panEvents.filter(e => e.competitive_intensity === "High").length;

  const highAlerts = alerts.filter(a => a.severity === "high");
  const mediumAlerts = alerts.filter(a => a.severity === "medium");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground">ManageEngine Europe — Partner & Event Intelligence Overview</p>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total Partners", value: totalPartners, sub: `${countriesCovered} countries`, icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
          { label: "Active Alerts", value: alerts.length, sub: `${highAlerts.length} high · ${mediumAlerts.length} medium`, icon: Bell, color: "text-red-600", bg: "bg-red-50" },
          { label: "2026 Events", value: events2026.length, sub: `${ownedEvents.length} owned · ${externalEvents.length} external`, icon: Calendar, color: "text-orange-600", bg: "bg-orange-50" },
          { label: "Datacenters", value: datacenters.length, sub: `${operationalDCs.length} operational`, icon: Server, color: "text-green-600", bg: "bg-green-50" },
        ].map(k => (
          <Card key={k.label}>
            <CardContent className="p-5 flex items-center gap-4">
              <div className={`h-10 w-10 rounded-lg ${k.bg} flex items-center justify-center flex-shrink-0`}>
                <k.icon className={`h-5 w-5 ${k.color}`} />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground">{k.label}</p>
                <p className="text-2xl font-bold leading-tight">{k.value}</p>
                <p className="text-xs text-muted-foreground truncate">{k.sub}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Partner Health + Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Partner Health */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" /> Partner Health Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Health bar */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-muted-foreground">Avg Health Score</span>
                <span className={`font-medium ${avgHealth >= 70 ? "text-green-600" : avgHealth >= 45 ? "text-yellow-600" : "text-red-600"}`}>{avgHealth}/100</span>
              </div>
              <div className="h-2 bg-accent rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all" style={{ width: `${avgHealth}%`, backgroundColor: avgHealth >= 70 ? "#16a34a" : avgHealth >= 45 ? "#ca8a04" : "#dc2626" }} />
              </div>
              <div className="flex justify-between text-xs text-muted-foreground mt-2">
                <span className="text-green-600 font-medium">{healthyCount} Healthy</span>
                <span className="text-muted-foreground">{partners.length - healthyCount - atRiskCount} Moderate</span>
                <span className="text-red-600 font-medium">{atRiskCount} At Risk</span>
              </div>
            </div>

            {/* Tier breakdown */}
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-2">By Tier</p>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { tier: "Platinum", count: partnersByTier.platinum, color: "#6366f1" },
                  { tier: "Gold", count: partnersByTier.gold, color: "#f59e0b" },
                  { tier: "Silver", count: partnersByTier.silver, color: "#64748b" },
                  { tier: "Standard", count: partnersByTier.standard, color: "#94a3b8" },
                ].map(t => (
                  <div key={t.tier} className="text-center rounded-lg p-2 bg-accent/50">
                    <p className="text-base font-bold" style={{ color: t.color }}>{t.count}</p>
                    <p className="text-xs text-muted-foreground">{t.tier}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Risk + engagement */}
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg border p-3">
                <p className="text-xs text-muted-foreground mb-1.5">Risk Distribution</p>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs"><span className="text-red-600">High Risk</span><span className="font-medium">{partnersByRisk.high}</span></div>
                  <div className="flex justify-between text-xs"><span className="text-yellow-600">Medium Risk</span><span className="font-medium">{partnersByRisk.medium}</span></div>
                  <div className="flex justify-between text-xs"><span className="text-green-600">Low Risk</span><span className="font-medium">{partnersByRisk.low}</span></div>
                </div>
              </div>
              <div className="rounded-lg border p-3">
                <p className="text-xs text-muted-foreground mb-1.5">Engagement</p>
                <p className="text-2xl font-bold text-primary">{avgEngagement}<span className="text-sm font-normal text-muted-foreground">/100</span></p>
                <p className="text-xs text-muted-foreground mt-1">Avg engagement score</p>
                <p className="text-xs text-green-600 mt-0.5">{recentlyActive} active (90d)</p>
              </div>
            </div>

            <Link to="/partners">
              <Button variant="ghost" size="sm" className="w-full text-xs">View All Partners →</Button>
            </Link>
          </CardContent>
        </Card>

        {/* Active Alerts */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Bell className="h-4 w-4 text-red-500" /> Active Alerts
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {alerts.map(a => (
              <div key={a.id} className={`flex items-start gap-2 text-xs px-3 py-2 rounded-lg border ${
                a.severity === "high" ? "bg-red-50 border-red-100" :
                a.severity === "medium" ? "bg-yellow-50 border-yellow-100" :
                "bg-blue-50 border-blue-100"
              }`}>
                {a.severity === "high" ? <AlertTriangle className="h-3.5 w-3.5 text-red-500 flex-shrink-0 mt-0.5" /> :
                 a.severity === "medium" ? <AlertTriangle className="h-3.5 w-3.5 text-yellow-500 flex-shrink-0 mt-0.5" /> :
                 <TrendingUp className="h-3.5 w-3.5 text-blue-500 flex-shrink-0 mt-0.5" />}
                <span className="leading-snug">{a.message}</span>
              </div>
            ))}
            <Link to="/alerts">
              <Button variant="ghost" size="sm" className="w-full text-xs mt-1">View All Alerts →</Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Partners by Region */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Globe className="h-4 w-4 text-primary" /> Partner Coverage by Region
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {partnersByRegion.map(r => {
              const regionColors: Record<string, string> = {
                "DACH": "#8b5cf6", "Benelux": "#14b8a6", "UK & Ireland": "#ec4899",
                "Nordics": "#3b82f6", "Eastern Europe": "#06b6d4", "Southern Europe": "#f97316",
              };
              const color = regionColors[r.region] ?? "#6b7280";
              return (
                <div key={r.region} className="rounded-lg border p-3 text-center">
                  <p className="text-xl font-bold" style={{ color }}>{r.count}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{r.region}</p>
                  <div className="h-1 rounded-full mt-2 bg-accent overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${Math.min(100, (r.count / totalPartners) * 300)}%`, backgroundColor: color }} />
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Events 2026 + Pan-Europe Events */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Owned Events 2026 */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Calendar className="h-4 w-4 text-orange-500" /> ManageEngine Events 2026
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {upcomingEvents.map(e => (
              <div key={e.id} className="flex items-center justify-between bg-orange-50 border border-orange-100 rounded-lg px-3 py-2">
                <div>
                  <p className="text-sm font-medium">{e.name}</p>
                  <p className="text-xs text-muted-foreground">{e.date} · {e.location}</p>
                </div>
                <Badge variant="outline" className="text-xs">{e.category}</Badge>
              </div>
            ))}
            <Link to="/events">
              <Button variant="ghost" size="sm" className="w-full text-xs mt-1">View All Events →</Button>
            </Link>
          </CardContent>
        </Card>

        {/* Pan-Europe Events */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Globe className="h-4 w-4 text-sky-500" /> Pan-Europe Third Party Events
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {panEvents.length === 0 ? (
              <p className="text-xs text-muted-foreground py-4 text-center">Loading event intelligence…</p>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: "Total Tracked", value: panEvents.length, color: "text-foreground" },
                    { label: "ME Participating", value: meParticipating, color: "text-green-600" },
                    { label: "Tier 1 Priority", value: tier1, color: "text-amber-600" },
                    { label: "High Competition", value: highCompetition, color: "text-red-600" },
                  ].map(s => (
                    <div key={s.label} className="bg-accent/50 rounded-lg p-2.5">
                      <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
                      <p className="text-xs text-muted-foreground">{s.label}</p>
                    </div>
                  ))}
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-1.5">Priority Tier Breakdown</p>
                  <div className="space-y-1.5">
                    {[
                      { tier: "Tier 1", count: tier1, total: panEvents.length, color: "#d97706" },
                      { tier: "Tier 2", count: tier2, total: panEvents.length, color: "#3b82f6" },
                      { tier: "Tier 3", count: tier3, total: panEvents.length, color: "#64748b" },
                    ].map(t => (
                      <div key={t.tier} className="flex items-center gap-2">
                        <span className="text-xs w-12" style={{ color: t.color }}>{t.tier}</span>
                        <div className="flex-1 h-1.5 bg-accent rounded-full overflow-hidden">
                          <div className="h-full rounded-full" style={{ width: `${(t.count / t.total) * 100}%`, backgroundColor: t.color }} />
                        </div>
                        <span className="text-xs text-muted-foreground w-6 text-right">{t.count}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <Link to="/events">
                  <Button variant="ghost" size="sm" className="w-full text-xs">View Pan-Europe Events →</Button>
                </Link>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Website Analysis + Datacenters */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Website Analysis Summary */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Monitor className="h-4 w-4 text-primary" /> Partner Website Analysis
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: "Partners Analysed", value: totalAnalysed },
                { label: "Alignment Issues", value: totalAlignmentIssues },
                { label: "UX Issues", value: totalUxIssues },
              ].map(s => (
                <div key={s.label} className="bg-accent/50 rounded-lg p-2.5 text-center">
                  <p className="text-xl font-bold text-primary">{s.value}</p>
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                </div>
              ))}
            </div>
            {avgDesktopPerf !== null && (
              <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground">Avg Lighthouse Scores</p>
                {[
                  { label: "Desktop Performance", score: avgDesktopPerf },
                  { label: "Mobile Performance", score: avgMobilePerf! },
                ].map(s => (
                  <div key={s.label}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-muted-foreground">{s.label}</span>
                      <span className={`font-medium ${s.score >= 70 ? "text-green-600" : s.score >= 50 ? "text-yellow-600" : "text-red-600"}`}>{s.score}/100</span>
                    </div>
                    <div className="h-1.5 bg-accent rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${s.score}%`, backgroundColor: s.score >= 70 ? "#16a34a" : s.score >= 50 ? "#ca8a04" : "#dc2626" }} />
                    </div>
                  </div>
                ))}
              </div>
            )}
            <Link to="/website-analysis">
              <Button variant="ghost" size="sm" className="w-full text-xs">View Full Analysis →</Button>
            </Link>
          </CardContent>
        </Card>

        {/* Datacenters */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Server className="h-4 w-4 text-green-600" /> Datacenter Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-3 gap-2 mb-1">
              {[
                { label: "Avg Uptime", value: `${avgUptime}%`, color: "text-green-600" },
                { label: "Avg Capacity", value: `${avgCapacity}%`, color: "text-blue-600" },
                { label: "Operational", value: operationalDCs.length, color: "text-green-600" },
              ].map(s => (
                <div key={s.label} className="bg-accent/50 rounded-lg p-2.5 text-center">
                  <p className={`text-lg font-bold ${s.color}`}>{s.value}</p>
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                </div>
              ))}
            </div>
            {datacenters.map(dc => (
              <div key={dc.id} className="flex items-center justify-between px-3 py-2 bg-accent/40 rounded-lg">
                <div className="flex items-center gap-2 min-w-0">
                  {dc.status === "operational"
                    ? <CheckCircle2 className="h-3.5 w-3.5 text-green-600 flex-shrink-0" />
                    : dc.status === "maintenance"
                    ? <Activity className="h-3.5 w-3.5 text-yellow-500 flex-shrink-0" />
                    : <XCircle className="h-3.5 w-3.5 text-slate-400 flex-shrink-0" />}
                  <div className="min-w-0">
                    <p className="text-xs font-medium truncate">{dc.name}</p>
                    <p className="text-xs text-muted-foreground">{dc.location}</p>
                  </div>
                </div>
                <div className="text-right flex-shrink-0 ml-2">
                  <Badge variant={dc.status === "operational" ? "outline" : "secondary"} className="text-xs capitalize">{dc.status}</Badge>
                  {dc.status === "operational" && <p className="text-xs text-muted-foreground mt-0.5">{dc.capacityUsed}% used</p>}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Zap className="h-4 w-4 text-primary" /> Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { label: "Review High-Risk Partners", desc: `${partnersByRisk.high} partners need attention`, link: "/partners", color: "border-red-200 bg-red-50" },
              { label: "View Active Alerts", desc: `${highAlerts.length} critical · ${mediumAlerts.length} medium`, link: "/alerts", color: "border-yellow-200 bg-yellow-50" },
              { label: "Explore Europe Map", desc: "Partners, events & competitors", link: "/map", color: "border-blue-200 bg-blue-50" },
              { label: "Website Analysis", desc: `${totalAlignmentIssues + totalUxIssues} total issues flagged`, link: "/website-analysis", color: "border-purple-200 bg-purple-50" },
            ].map(a => (
              <Link key={a.label} to={a.link}>
                <div className={`rounded-lg border px-3 py-3 cursor-pointer hover:shadow-sm transition-shadow ${a.color}`}>
                  <p className="text-sm font-medium">{a.label}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{a.desc}</p>
                  <ArrowRight className="h-3.5 w-3.5 text-muted-foreground mt-2" />
                </div>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
