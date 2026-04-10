import { useState } from "react";
import { partners, events, alerts, computeHealthScore } from "@/data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Bell, AlertTriangle, TrendingDown, Clock, Lightbulb, X, RefreshCw } from "lucide-react";
import type { Alert } from "@/data/types";

type Severity = 'high' | 'medium' | 'low';

interface LiveAlert extends Alert {
  dismissed: boolean;
  timestamp: string;
}

function generateLiveAlerts(): Omit<LiveAlert, 'dismissed'>[] {
  const live: Omit<LiveAlert, 'dismissed'>[] = [];
  const now = new Date();

  // Inactive partners (no activity > 60 days)
  partners.forEach(p => {
    const days = Math.floor((now.getTime() - new Date(p.lastActivity).getTime()) / 86400000);
    if (days > 90) {
      live.push({
        id: `live-inactive-${p.id}`,
        type: 'inactive',
        severity: 'high',
        message: `${p.name} (${p.country}) inactive for ${days} days`,
        relatedId: p.id,
        timestamp: new Date(Date.now() - Math.random() * 86400000 * 2).toISOString(),
      });
    } else if (days > 60) {
      live.push({
        id: `live-inactive-${p.id}`,
        type: 'inactive',
        severity: 'medium',
        message: `${p.name} (${p.country}) inactive for ${days} days`,
        relatedId: p.id,
        timestamp: new Date(Date.now() - Math.random() * 86400000 * 3).toISOString(),
      });
    }
  });

  // High-risk partners
  partners.filter(p => p.riskLevel === 'high').forEach(p => {
    live.push({
      id: `live-risk-${p.id}`,
      type: 'risk',
      severity: 'high',
      message: `High-risk partner: ${p.name} — risk score ${p.riskScore}/100, engagement ${p.engagementScore}/100`,
      relatedId: p.id,
      timestamp: new Date(Date.now() - Math.random() * 86400000).toISOString(),
    });
  });

  // Low health score partners
  partners.forEach(p => {
    const health = computeHealthScore(p);
    if (health < 40 && p.riskLevel !== 'high') {
      live.push({
        id: `live-health-${p.id}`,
        type: 'risk',
        severity: 'medium',
        message: `Low health score: ${p.name} — ${health}/100 health score`,
        relatedId: p.id,
        timestamp: new Date(Date.now() - Math.random() * 86400000 * 2).toISOString(),
      });
    }
  });

  // Low conversion rate events in 2025
  const low2025 = events.filter(e => e.year === 2025 && e.conversionRate < 7.0);
  if (low2025.length > 0) {
    live.push({
      id: 'live-conv-2025',
      type: 'conversion',
      severity: 'medium',
      message: `${low2025.length} events in 2025 had below-average conversion rates (<7.0%)`,
      timestamp: new Date(Date.now() - 86400000 * 5).toISOString(),
    });
  }

  // Partners with no 2026 events
  const partnersWith2026 = new Set(events.filter(e => e.year === 2026).map(e => e.partnerId));
  const platGoldWithout = partners.filter(p =>
    (p.tier === 'platinum' || p.tier === 'gold') && !partnersWith2026.has(p.id) && p.yearsActive.includes(2026)
  );
  if (platGoldWithout.length > 0) {
    live.push({
      id: 'live-noevent-2026',
      type: 'opportunity',
      severity: 'low',
      message: `${platGoldWithout.length} Gold/Platinum partner(s) have no scheduled 2026 events — revenue opportunity`,
      timestamp: new Date(Date.now() - 86400000 * 3).toISOString(),
    });
  }

  // Add static alerts from data
  alerts.forEach(a => {
    live.push({
      ...a,
      timestamp: new Date(Date.now() - Math.random() * 86400000 * 7).toISOString(),
    });
  });

  // Sort: high → medium → low, then newest first
  const sevOrder: Severity[] = ['high', 'medium', 'low'];
  return live.sort((a, b) => {
    const sd = sevOrder.indexOf(a.severity as Severity) - sevOrder.indexOf(b.severity as Severity);
    if (sd !== 0) return sd;
    return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
  });
}

const INITIAL_ALERTS: LiveAlert[] = generateLiveAlerts().map(a => ({ ...a, dismissed: false }));

const typeIcon = {
  risk: AlertTriangle,
  conversion: TrendingDown,
  inactive: Clock,
  opportunity: Lightbulb,
};

const typeColor = {
  risk: 'text-destructive',
  conversion: 'text-warning',
  inactive: 'text-orange-500',
  opportunity: 'text-primary',
};

const typeBg = {
  risk: 'bg-red-50 border-red-100',
  conversion: 'bg-yellow-50 border-yellow-100',
  inactive: 'bg-orange-50 border-orange-100',
  opportunity: 'bg-blue-50 border-blue-100',
};

function timeAgo(ts: string) {
  const diff = Date.now() - new Date(ts).getTime();
  const hours = Math.floor(diff / 3600000);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export default function Alerts() {
  const [alertList, setAlertList] = useState<LiveAlert[]>(INITIAL_ALERTS);
  const [severityFilter, setSeverityFilter] = useState<Severity | 'all'>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [showDismissed, setShowDismissed] = useState(false);

  const dismiss = (id: string) =>
    setAlertList(prev => prev.map(a => a.id === id ? { ...a, dismissed: true } : a));
  const restore = () =>
    setAlertList(prev => prev.map(a => ({ ...a, dismissed: false })));

  const visible = alertList.filter(a => {
    if (!showDismissed && a.dismissed) return false;
    if (severityFilter !== 'all' && a.severity !== severityFilter) return false;
    if (typeFilter !== 'all' && a.type !== typeFilter) return false;
    return true;
  });

  const active = alertList.filter(a => !a.dismissed);
  const highCount = active.filter(a => a.severity === 'high').length;
  const medCount = active.filter(a => a.severity === 'medium').length;
  const lowCount = active.filter(a => a.severity === 'low').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold flex items-center gap-2">
            <Bell className="h-6 w-6 text-primary" /> Alerts Center
          </h1>
          <p className="text-sm text-muted-foreground">Real-time alerts generated from partner and event data</p>
        </div>
        <Button variant="outline" size="sm" onClick={restore} className="gap-1">
          <RefreshCw className="h-3.5 w-3.5" /> Restore All
        </Button>
      </div>

      {/* Summary KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Active', value: active.length, cls: 'text-foreground' },
          { label: 'High', value: highCount, cls: 'text-destructive' },
          { label: 'Medium', value: medCount, cls: 'text-yellow-600' },
          { label: 'Low / Opportunity', value: lowCount, cls: 'text-primary' },
        ].map(k => (
          <Card key={k.label}>
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground">{k.label}</p>
              <p className={`text-2xl font-semibold mt-1 ${k.cls}`}>{k.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-3">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-1">
              <span className="text-xs text-muted-foreground font-medium">Severity:</span>
              {(['all', 'high', 'medium', 'low'] as const).map(s => (
                <Button key={s} size="sm" className="h-6 text-xs"
                  variant={severityFilter === s ? 'default' : 'outline'}
                  onClick={() => setSeverityFilter(s)}>
                  {s === 'all' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)}
                </Button>
              ))}
            </div>
            <div className="flex items-center gap-1">
              <span className="text-xs text-muted-foreground font-medium">Type:</span>
              {(['all', 'risk', 'inactive', 'conversion', 'opportunity']).map(t => (
                <Button key={t} size="sm" className="h-6 text-xs"
                  variant={typeFilter === t ? 'default' : 'outline'}
                  onClick={() => setTypeFilter(t)}>
                  {t === 'all' ? 'All' : t.charAt(0).toUpperCase() + t.slice(1)}
                </Button>
              ))}
            </div>
            <Button variant="ghost" size="sm" className="h-6 text-xs ml-auto"
              onClick={() => setShowDismissed(d => !d)}>
              {showDismissed ? 'Hide dismissed' : 'Show dismissed'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Alert List */}
      <div className="space-y-2">
        {visible.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center text-muted-foreground text-sm">
              No alerts match the current filter.
            </CardContent>
          </Card>
        )}
        {visible.map(alert => {
          const Icon = typeIcon[alert.type];
          return (
            <Card key={alert.id}
              className={`border transition-all ${alert.dismissed ? 'opacity-40' : typeBg[alert.type]}`}>
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <Icon className={`h-4 w-4 mt-0.5 flex-shrink-0 ${typeColor[alert.type]}`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <Badge
                        variant={alert.severity === 'high' ? 'destructive' : alert.severity === 'medium' ? 'secondary' : 'outline'}
                        className="text-xs">
                        {alert.severity.toUpperCase()}
                      </Badge>
                      <Badge variant="outline" className="text-xs capitalize">{alert.type}</Badge>
                      <span className="text-xs text-muted-foreground">{timeAgo(alert.timestamp)}</span>
                    </div>
                    <p className="text-sm text-foreground">{alert.message}</p>
                    {alert.relatedId && (
                      <Link to={`/partners/${alert.relatedId}`}>
                        <Button size="sm" variant="ghost" className="mt-1 h-6 text-xs text-primary px-0">
                          View Partner →
                        </Button>
                      </Link>
                    )}
                  </div>
                  {!alert.dismissed && (
                    <button onClick={() => dismiss(alert.id)} className="text-muted-foreground hover:text-foreground flex-shrink-0">
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
