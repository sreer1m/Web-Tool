import { useState } from "react";
import { campaigns } from "@/data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function Campaigns() {
  const [compareA, setCompareA] = useState(campaigns[0].id);
  const [compareB, setCompareB] = useState(campaigns[2].id);

  const byChannel = (['email', 'ads', 'social'] as const).map(ch => {
    const chs = campaigns.filter(c => c.channel === ch);
    return {
      channel: ch.charAt(0).toUpperCase() + ch.slice(1),
      registrations: chs.reduce((s, c) => s + c.registrations, 0),
      conversions: chs.reduce((s, c) => s + c.conversions, 0),
      roi: +(chs.reduce((s, c) => s + c.roi, 0) / chs.length).toFixed(1),
      spend: chs.reduce((s, c) => s + c.spend, 0),
    };
  });

  const campA = campaigns.find(c => c.id === compareA)!;
  const campB = campaigns.find(c => c.id === compareB)!;

  const bestPerforming = [...campaigns].sort((a, b) => b.roi - a.roi).slice(0, 3);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Campaigns & Analytics</h1>
        <p className="text-sm text-muted-foreground">Campaign performance and insights</p>
      </div>

      {/* Channel Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {byChannel.map(ch => (
          <Card key={ch.channel}>
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <p className="font-medium">{ch.channel}</p>
                <Badge variant="outline">{ch.roi}x ROI</Badge>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div><p className="text-xs text-muted-foreground">Registrations</p><p className="font-semibold">{ch.registrations.toLocaleString()}</p></div>
                <div><p className="text-xs text-muted-foreground">Conversions</p><p className="font-semibold">{ch.conversions}</p></div>
                <div><p className="text-xs text-muted-foreground">Spend</p><p className="font-semibold">€{(ch.spend / 1e3).toFixed(0)}k</p></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Performance Chart */}
      <Card>
        <CardHeader className="pb-2"><CardTitle className="text-base">Campaign Performance</CardTitle></CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={campaigns.slice(0, 8)}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" angle={-20} textAnchor="end" height={60} />
              <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
              <Tooltip />
              <Bar dataKey="conversions" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} name="Conversions" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Campaign DNA */}
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-base">Campaign DNA — Top Patterns</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {bestPerforming.map(c => (
              <div key={c.id} className="flex items-center justify-between py-2 px-3 rounded-lg bg-accent/50">
                <div>
                  <p className="text-sm font-medium">{c.name}</p>
                  <p className="text-xs text-muted-foreground">{c.channel} · {c.startDate}</p>
                </div>
                <Badge>{c.roi}x ROI</Badge>
              </div>
            ))}
            <div className="text-xs text-muted-foreground mt-2 space-y-1">
              <p>✓ Best channel: <strong>Email</strong> (highest avg ROI)</p>
              <p>✓ Best timing: <strong>Q1 launches</strong></p>
              <p>✓ Best audience: <strong>Existing partner networks</strong></p>
            </div>
          </CardContent>
        </Card>

        {/* A/B Comparison */}
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-base">A/B Campaign Comparison</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Campaign A</p>
                <Select value={compareA} onValueChange={setCompareA}>
                  <SelectTrigger className="text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>{campaigns.map(c => <SelectItem key={c.id} value={c.id} className="text-xs">{c.name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Campaign B</p>
                <Select value={compareB} onValueChange={setCompareB}>
                  <SelectTrigger className="text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>{campaigns.map(c => <SelectItem key={c.id} value={c.id} className="text-xs">{c.name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              {[
                ['Conversions', campA.conversions, campB.conversions],
                ['ROI', `${campA.roi}x`, `${campB.roi}x`],
                ['Engagement', campA.engagement, campB.engagement],
                ['Registrations', campA.registrations, campB.registrations],
              ].map(([metric, a, b]) => (
                <div key={String(metric)} className="flex items-center justify-between text-sm py-1 border-b last:border-0">
                  <span className="text-muted-foreground">{metric}</span>
                  <div className="flex gap-6">
                    <span className="font-medium text-primary">{a}</span>
                    <span className="font-medium">{b}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
