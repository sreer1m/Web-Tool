import { useState } from "react";
import { events, partners, eventLearnings } from "@/data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { BookOpen, CheckCircle, XCircle, Lightbulb, ChevronDown, ChevronUp, Calendar, Globe2, Star } from "lucide-react";
import { Link } from "react-router-dom";

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

export default function Events() {
  const [expandedEvent, setExpandedEvent] = useState<string | null>(null);
  const [userNotes, setUserNotes] = useState<Record<string, string>>({});

  const ownedEvents = events.filter(e => e.eventKind === 'owned');
  const externalEvents = events.filter(e => e.eventKind === 'external');

  // KPIs for owned events only
  const totalReg = ownedEvents.reduce((s, e) => s + e.registrations, 0);
  const totalConv = ownedEvents.reduce((s, e) => s + e.conversions, 0);
  const totalImpact = ownedEvents.reduce((s, e) => s + e.revenueImpact, 0);
  const totalExternalImpact = externalEvents.reduce((s, e) => s + e.revenueImpact, 0);

  // Chart data: owned events by revenue impact (non-zero)
  const revenueChartData = ownedEvents
    .filter(e => e.revenueImpact > 0)
    .sort((a, b) => b.revenueImpact - a.revenueImpact)
    .map(e => ({
      name: e.name.replace(/\s+(Workshop|Seminar|Training|Conference)/i, '').slice(0, 18),
      revenue: e.revenueImpact,
    }));

  const funnelData = [
    { name: 'Registrations', value: totalReg },
    { name: 'Conversions', value: totalConv },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Events 2026</h1>
        <p className="text-sm text-muted-foreground">
          {ownedEvents.length} owned events · {externalEvents.length} external industry events
        </p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          ['Owned Events', ownedEvents.length],
          ['Total Registrations', totalReg.toLocaleString()],
          ['Owned Revenue', `€${(totalImpact / 1e3).toFixed(0)}k`],
          ['External Revenue', `€${(totalExternalImpact / 1e3).toFixed(0)}k`],
        ].map(([l, v]) => (
          <Card key={String(l)}>
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground">{l}</p>
              <p className="text-xl font-semibold mt-1">{v}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      {revenueChartData.length > 0 && (
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-base">Owned Events — Revenue Impact</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={revenueChartData} layout="vertical" margin={{ left: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" tickFormatter={v => `€${(v / 1e3).toFixed(0)}k`} />
                <YAxis type="category" dataKey="name" width={120} tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                <Tooltip formatter={(v: number) => [`€${v.toLocaleString()}`, 'Revenue']} />
                <Bar dataKey="revenue" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Owned Events Table */}
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
                <TableHead className="text-right">Registrations</TableHead>
                <TableHead className="text-right">Revenue Impact</TableHead>
                <TableHead>Learnings</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ownedEvents.map(e => {
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
                      <TableCell className="text-sm">{e.location}</TableCell>
                      <TableCell className="text-right">{e.registrations.toLocaleString()}</TableCell>
                      <TableCell className="text-right font-medium">
                        {e.revenueImpact > 0 ? `€${(e.revenueImpact / 1e3).toFixed(0)}k` : '—'}
                      </TableCell>
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
                        <TableCell colSpan={7} className="bg-accent/30 p-4">
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

      {/* External Industry Events Table */}
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
                <TableHead className="text-right">Revenue</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {externalEvents.map(e => (
                <TableRow key={e.id}>
                  <TableCell className="font-medium text-sm whitespace-nowrap">{e.name}</TableCell>
                  <TableCell className="text-sm whitespace-nowrap text-muted-foreground">{e.date}</TableCell>
                  <TableCell className="text-sm">{e.location}</TableCell>
                  <TableCell>
                    <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${statusColor[e.status || ''] || 'bg-slate-100 text-slate-700'}`}>
                      {e.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">{e.audience}</TableCell>
                  <TableCell className="text-xs text-muted-foreground max-w-[200px]">{e.strategicValue}</TableCell>
                  <TableCell className="text-right text-sm font-medium">
                    {e.revenueImpact > 0 ? `€${(e.revenueImpact / 1e3).toFixed(0)}k` : '—'}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
