import { useState } from "react";
import { partners, events, countries, computeHealthScore } from "@/data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Zap, Users, Calendar, MapPin, TrendingUp, CheckCircle, Clock, Filter } from "lucide-react";

type Priority = 'critical' | 'high' | 'medium' | 'low';
type Category = 'partner' | 'event' | 'region' | 'campaign';

interface Action {
  id: string;
  title: string;
  reason: string;
  priority: Priority;
  category: Category;
  nextStep: string;
  impact: string;
  relatedId?: string;
  done: boolean;
}

// Auto-generate actions from live data
function generateActions(): Omit<Action, 'done'>[] {
  const actions: Omit<Action, 'done'>[] = [];

  // High-risk partners → urgent follow-up
  const highRisk = partners.filter(p => p.riskLevel === 'high');
  highRisk.forEach(p => {
    actions.push({
      id: `act-risk-${p.id}`,
      title: `Urgent review: ${p.name}`,
      reason: `Risk score ${p.riskScore}/100 — partner at high churn risk. Last active: ${p.lastActivity}.`,
      priority: 'critical',
      category: 'partner',
      nextStep: `Schedule call with ${p.contactPerson || 'partner contact'} within 48 hours. Review contract terms.`,
      impact: `Protecting €${(p.totalRevenue / 1e6).toFixed(2)}M revenue`,
      relatedId: p.id,
    });
  });

  // Low engagement partners (not high risk) → re-engagement
  const lowEngage = partners.filter(p => p.engagementScore < 60 && p.riskLevel !== 'high');
  lowEngage.slice(0, 4).forEach(p => {
    const days = Math.floor((Date.now() - new Date(p.lastActivity).getTime()) / 86400000);
    actions.push({
      id: `act-engage-${p.id}`,
      title: `Re-engage: ${p.name}`,
      reason: `Engagement score ${p.engagementScore}/100. Inactive for ${days} days. Revenue at risk.`,
      priority: days > 60 ? 'high' : 'medium',
      category: 'partner',
      nextStep: `Send personalized email with latest product updates. Offer co-marketing fund or event opportunity.`,
      impact: `Recovering engagement could add 15–20% revenue uplift`,
      relatedId: p.id,
    });
  });

  // Countries with no events in 2026 but active partners → event opportunity
  const activeCountries = [...new Set(partners.filter(p => p.yearsActive.includes(2026)).map(p => p.country))];
  const countriesWithout2026Events = activeCountries.filter(c =>
    !events.some(e => e.country === c && e.year === 2026)
  );
  countriesWithout2026Events.slice(0, 3).forEach(c => {
    const countryPartners = partners.filter(p => p.country === c);
    actions.push({
      id: `act-event-${c.replace(/\s/g, '_')}`,
      title: `Plan 2026 event in ${c}`,
      reason: `${countryPartners.length} active partner(s) in ${c} but no 2026 event planned.`,
      priority: 'medium',
      category: 'event',
      nextStep: `Contact ${countryPartners[0]?.name} to co-plan a workshop or webinar for Q3/Q4 2026.`,
      impact: `Expected 150–400 leads based on regional averages`,
    });
  });

  // Top tier partners without recent events → deepen relationship
  const platGold = partners.filter(p => (p.tier === 'platinum' || p.tier === 'gold') && p.riskLevel === 'low');
  const noRecentEvent = platGold.filter(p =>
    !events.some(e => e.partnerId === p.id && e.year === 2026)
  ).slice(0, 3);
  noRecentEvent.forEach(p => {
    actions.push({
      id: `act-invest-${p.id}`,
      title: `Increase investment: ${p.name}`,
      reason: `${p.tier?.toUpperCase()} partner with ${p.roi}x ROI and ${p.engagementScore}/100 engagement. No 2026 event yet.`,
      priority: 'high',
      category: 'partner',
      nextStep: `Offer co-branded event or MDF (Market Development Fund). Propose 2026 roadmap meeting.`,
      impact: `High-ROI partner — every €1 invested returns €${p.roi}`,
      relatedId: p.id,
    });
  });

  // Countries with demand but no partners
  const gaps = countries.filter(c => c.demand > 70 && c.partnerCount === 0);
  gaps.slice(0, 2).forEach(c => {
    actions.push({
      id: `act-expand-${c.code}`,
      title: `Expand to ${c.name}`,
      reason: `Demand score ${c.demand}/100 with ${c.traffic.toLocaleString()} monthly traffic — no partner coverage.`,
      priority: 'medium',
      category: 'region',
      nextStep: `Research local IT distributors. Post partner recruitment on ManageEngine website. Contact regional sales.`,
      impact: `Estimated €${Math.round(c.demand * 5000).toLocaleString()} annual revenue potential`,
    });
  });

  // Webinar recommendation for underperforming regions
  const lowRevCountries = countries.filter(c => c.revenue > 0 && c.revenue < 200000 && c.partnerCount > 0);
  lowRevCountries.slice(0, 2).forEach(c => {
    actions.push({
      id: `act-webinar-${c.code}`,
      title: `Run online webinar in ${c.name}`,
      reason: `Revenue of €${c.revenue.toLocaleString()} is below regional average. Low event history.`,
      priority: 'low',
      category: 'event',
      nextStep: `Coordinate with local partner to host a product webinar. Low cost, ~€2–5K budget.`,
      impact: `Webinars typically generate 30–80 qualified leads at low cost`,
    });
  });

  // Sort: critical → high → medium → low
  const order: Priority[] = ['critical', 'high', 'medium', 'low'];
  return actions.sort((a, b) => order.indexOf(a.priority) - order.indexOf(b.priority));
}

const INITIAL_ACTIONS = generateActions().map(a => ({ ...a, done: false }));

const categoryIcon = {
  partner: Users,
  event: Calendar,
  region: MapPin,
  campaign: TrendingUp,
};

const priorityVariant: Record<Priority, 'destructive' | 'default' | 'secondary' | 'outline'> = {
  critical: 'destructive',
  high: 'default',
  medium: 'secondary',
  low: 'outline',
};

export default function ActionCenter() {
  const [actions, setActions] = useState(INITIAL_ACTIONS);
  const [filter, setFilter] = useState<Priority | 'all'>('all');
  const [catFilter, setCatFilter] = useState<Category | 'all'>('all');

  const toggle = (id: string) =>
    setActions(prev => prev.map(a => a.id === id ? { ...a, done: !a.done } : a));

  const filtered = actions.filter(a => {
    if (filter !== 'all' && a.priority !== filter) return false;
    if (catFilter !== 'all' && a.category !== catFilter) return false;
    return true;
  });

  const pending = actions.filter(a => !a.done);
  const done = actions.filter(a => a.done);

  const criticalCount = pending.filter(a => a.priority === 'critical').length;
  const highCount = pending.filter(a => a.priority === 'high').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold flex items-center gap-2">
            <Zap className="h-6 w-6 text-primary" /> Action Center
          </h1>
          <p className="text-sm text-muted-foreground">AI-generated recommended actions based on live partner & event data</p>
        </div>
        <div className="flex items-center gap-2 text-sm">
          {criticalCount > 0 && <Badge variant="destructive">{criticalCount} Critical</Badge>}
          {highCount > 0 && <Badge>{highCount} High Priority</Badge>}
          <Badge variant="outline">{done.length} Completed</Badge>
        </div>
      </div>

      {/* KPI Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Actions', value: actions.length, color: 'text-foreground' },
          { label: 'Pending', value: pending.length, color: 'text-primary' },
          { label: 'Critical', value: criticalCount, color: 'text-destructive' },
          { label: 'Completed', value: done.length, color: 'text-green-600' },
        ].map(k => (
          <Card key={k.label}>
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground">{k.label}</p>
              <p className={`text-2xl font-semibold mt-1 ${k.color}`}>{k.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-3">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-1">
              <Filter className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-xs text-muted-foreground font-medium">Priority:</span>
              {(['all', 'critical', 'high', 'medium', 'low'] as const).map(p => (
                <Button key={p} size="sm" className="h-6 text-xs" variant={filter === p ? 'default' : 'outline'} onClick={() => setFilter(p)}>
                  {p === 'all' ? 'All' : p.charAt(0).toUpperCase() + p.slice(1)}
                </Button>
              ))}
            </div>
            <div className="flex items-center gap-1">
              <span className="text-xs text-muted-foreground font-medium">Category:</span>
              {(['all', 'partner', 'event', 'region', 'campaign'] as const).map(c => (
                <Button key={c} size="sm" className="h-6 text-xs" variant={catFilter === c ? 'default' : 'outline'} onClick={() => setCatFilter(c)}>
                  {c === 'all' ? 'All' : c.charAt(0).toUpperCase() + c.slice(1)}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Cards */}
      <div className="space-y-3">
        {filtered.length === 0 && (
          <Card><CardContent className="p-8 text-center text-muted-foreground text-sm">No actions match the current filter.</CardContent></Card>
        )}
        {filtered.map(action => {
          const Icon = categoryIcon[action.category];
          return (
            <Card key={action.id} className={`transition-all ${action.done ? 'opacity-50' : ''}`}>
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <button
                    onClick={() => toggle(action.id)}
                    className={`mt-0.5 h-5 w-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${action.done ? 'bg-green-500 border-green-500' : 'border-muted-foreground hover:border-primary'}`}
                  >
                    {action.done && <CheckCircle className="h-4 w-4 text-white" />}
                  </button>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <Badge variant={priorityVariant[action.priority]} className="text-xs">
                        {action.priority.toUpperCase()}
                      </Badge>
                      <Badge variant="outline" className="text-xs gap-1">
                        <Icon className="h-3 w-3" />{action.category}
                      </Badge>
                      <p className={`font-medium text-sm ${action.done ? 'line-through text-muted-foreground' : ''}`}>
                        {action.title}
                      </p>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">{action.reason}</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      <div className="bg-primary/5 rounded-lg px-3 py-2">
                        <p className="text-xs font-medium text-primary mb-0.5">Next Step</p>
                        <p className="text-xs text-foreground">{action.nextStep}</p>
                      </div>
                      <div className="bg-green-50 rounded-lg px-3 py-2 border border-green-100">
                        <p className="text-xs font-medium text-green-700 mb-0.5">Expected Impact</p>
                        <p className="text-xs text-green-800">{action.impact}</p>
                      </div>
                    </div>
                    {action.relatedId && (
                      <div className="mt-2">
                        <Link to={`/partners/${action.relatedId}`}>
                          <Button size="sm" variant="ghost" className="h-6 text-xs text-primary">
                            View Partner →
                          </Button>
                        </Link>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-1 text-xs text-muted-foreground flex-shrink-0">
                    <Clock className="h-3 w-3" />
                    <span>{action.done ? 'Done' : 'Pending'}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {done.length > 0 && (
        <div className="text-center">
          <Button variant="ghost" size="sm" className="text-xs text-muted-foreground"
            onClick={() => setActions(prev => prev.map(a => ({ ...a, done: false })))}>
            Reset all completed actions
          </Button>
        </div>
      )}
    </div>
  );
}
