import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Upload, FileText, CheckCircle, AlertTriangle, Download } from "lucide-react";
import { partners, events } from "@/data";

type ParseResult = { rows: Record<string, string>[]; errors: string[] };

function parseCSV(text: string): ParseResult {
  const lines = text.trim().split('\n');
  if (lines.length < 2) return { rows: [], errors: ['CSV must have a header row and at least one data row'] };
  const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
  const rows: Record<string, string>[] = [];
  const errors: string[] = [];
  lines.slice(1).forEach((line, i) => {
    const vals = line.split(',').map(v => v.trim().replace(/"/g, ''));
    if (vals.length !== headers.length) {
      errors.push(`Row ${i + 2}: column count mismatch`);
      return;
    }
    rows.push(Object.fromEntries(headers.map((h, j) => [h, vals[j]])));
  });
  return { rows, errors };
}

function generateWeeklyReport(): string {
  const now = new Date();
  const topPartners = [...partners].sort((a, b) => b.totalRevenue - a.totalRevenue).slice(0, 5);
  const lowRisk = partners.filter(p => p.riskLevel === 'low').length;
  const highRisk = partners.filter(p => p.riskLevel === 'high').length;
  const events2026 = events.filter(e => e.year === 2026);
  const totalRevenue = partners.reduce((s, p) => s + p.totalRevenue, 0);
  const totalEventRev = events2026.reduce((s, e) => s + e.revenueImpact, 0);

  return `
PARTNER & EVENT INTELLIGENCE — WEEKLY REPORT
ManageEngine Europe Edition
Generated: ${now.toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}
══════════════════════════════════════════════

EXECUTIVE SUMMARY
─────────────────
Total Partner Revenue:    €${(totalRevenue/1e6).toFixed(2)}M
Total Partners:           ${partners.length}
High-Risk Partners:       ${highRisk}
Healthy Partners (low):   ${lowRisk}
Events in 2026:           ${events2026.length}
Event Revenue (2026):     €${(totalEventRev/1e6).toFixed(2)}M

TOP 5 PARTNERS
─────────────────
${topPartners.map((p, i) =>
  `${i+1}. ${p.name} (${p.country}) — €${(p.totalRevenue/1e6).toFixed(2)}M · ROI: ${p.roi}x · Tier: ${p.tier?.toUpperCase()}`
).join('\n')}

LOW PERFORMERS (High Risk)
─────────────────
${partners.filter(p => p.riskLevel === 'high').map(p =>
  `· ${p.name} (${p.country}) — Risk: ${p.riskScore}/100 · Engagement: ${p.engagementScore}/100 · Last Active: ${p.lastActivity}`
).join('\n') || 'None'}

2026 EVENTS
─────────────────
${events2026.map(e =>
  `· ${e.name} (${e.country}) — ${e.leads} leads · ${e.conversions} conversions · €${(e.revenueImpact/1e3).toFixed(0)}k impact`
).join('\n')}

RECOMMENDED ACTIONS
─────────────────
· Review all high-risk partners immediately
· Plan Q3 2026 events in underserved markets
· Leverage platinum partners for co-marketing
· Monitor inactive partners (>60 days)

══════════════════════════════════════════════
ManageEngine Partner & Event Intelligence Platform
`.trim();
}

export default function SettingsPage() {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploadResult, setUploadResult] = useState<ParseResult | null>(null);
  const [uploadType, setUploadType] = useState<'partner' | 'event'>('partner');
  const [uploading, setUploading] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleFile = (file: File) => {
    setUploading(true);
    const reader = new FileReader();
    reader.onload = e => {
      const text = e.target?.result as string;
      const result = parseCSV(text);
      setUploadResult(result);
      setUploading(false);
    };
    reader.readAsText(file);
  };

  const handleDrop = (ev: React.DragEvent) => {
    ev.preventDefault();
    const file = ev.dataTransfer.files[0];
    if (file && file.name.endsWith('.csv')) handleFile(file);
  };

  const downloadReport = () => {
    const report = generateWeeklyReport();
    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ManageEngine_Weekly_Report_${new Date().toISOString().slice(0,10)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const partnerTemplate = 'name,country,city,email,phone,website,tier,revenue,roi\nExample Partner,Germany,Berlin,info@example.com,+49 000 000,https://example.com,gold,500000,2.5';
  const eventTemplate = 'name,country,year,type,budget,registrations,attendance,leads,conversions,conversionRate,revenueImpact\nExample Event,Germany,2026,Conference,80000,1000,750,250,50,6.7,400000';

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-semibold">Settings</h1>
        <p className="text-sm text-muted-foreground">Manage your preferences and data</p>
      </div>

      {/* Profile */}
      <Card>
        <CardHeader><CardTitle className="text-base">Profile</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div><Label htmlFor="name">Name</Label><Input id="name" defaultValue="Admin User" /></div>
            <div><Label htmlFor="email">Email</Label><Input id="email" defaultValue="admin@manageengine.com" /></div>
          </div>
          <div><Label htmlFor="role">Role</Label><Input id="role" defaultValue="Partner Manager — Europe" disabled /></div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader><CardTitle className="text-base">Notifications</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          {[
            ['Partner risk alerts', true],
            ['Low conversion warnings', true],
            ['Weekly performance digest', true],
            ['New event registrations', false],
            ['Action Center reminders', true],
          ].map(([label, defaultVal]) => (
            <div key={String(label)} className="flex items-center justify-between">
              <Label>{label}</Label>
              <Switch defaultChecked={defaultVal as boolean} />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Weekly Report Generator */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <FileText className="h-4 w-4" /> Weekly Auto Report
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Generate a downloadable weekly intelligence report covering top partners, low performers, and 2026 events.
          </p>
          <div className="bg-accent/50 rounded-lg p-3 text-xs font-mono text-muted-foreground">
            Includes: {partners.length} partners · {events.filter(e=>e.year===2026).length} 2026 events · Risk analysis · Recommendations
          </div>
          <Button onClick={downloadReport} className="gap-2">
            <Download className="h-4 w-4" /> Download Weekly Report
          </Button>
        </CardContent>
      </Card>

      {/* Data Upload */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Upload className="h-4 w-4" /> Data Upload (CSV)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Button size="sm" variant={uploadType === 'partner' ? 'default' : 'outline'} onClick={() => { setUploadType('partner'); setUploadResult(null); }}>
              Partner Data
            </Button>
            <Button size="sm" variant={uploadType === 'event' ? 'default' : 'outline'} onClick={() => { setUploadType('event'); setUploadResult(null); }}>
              Event Data
            </Button>
          </div>

          {/* Template Download */}
          <div className="text-xs text-muted-foreground">
            <span className="font-medium">CSV Template: </span>
            <button
              className="text-primary hover:underline"
              onClick={() => {
                const template = uploadType === 'partner' ? partnerTemplate : eventTemplate;
                const blob = new Blob([template], { type: 'text/csv' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `${uploadType}_template.csv`;
                a.click();
              }}>
              Download {uploadType} template
            </button>
          </div>

          {/* Drop Zone */}
          <div
            className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-primary/50 transition-colors"
            onDrop={handleDrop}
            onDragOver={e => e.preventDefault()}
            onClick={() => fileRef.current?.click()}
          >
            <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">Drag & drop a CSV file here, or click to browse</p>
            <p className="text-xs text-muted-foreground mt-1">Uploading {uploadType} data</p>
            <input ref={fileRef} type="file" accept=".csv" className="hidden"
              onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])} />
          </div>

          {uploading && <p className="text-sm text-muted-foreground">Parsing CSV…</p>}

          {/* Upload Result */}
          {uploadResult && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                {uploadResult.errors.length === 0
                  ? <CheckCircle className="h-4 w-4 text-green-600" />
                  : <AlertTriangle className="h-4 w-4 text-yellow-600" />}
                <span className="text-sm font-medium">
                  {uploadResult.rows.length} rows parsed
                  {uploadResult.errors.length > 0 ? ` · ${uploadResult.errors.length} error(s)` : ' successfully'}
                </span>
                <Badge variant={uploadResult.errors.length === 0 ? 'outline' : 'secondary'}>
                  {uploadResult.errors.length === 0 ? 'Valid' : 'Warnings'}
                </Badge>
              </div>

              {uploadResult.errors.length > 0 && (
                <div className="bg-yellow-50 rounded-lg p-3 text-xs text-yellow-800 space-y-1">
                  {uploadResult.errors.map((err, i) => <p key={i}>· {err}</p>)}
                </div>
              )}

              {uploadResult.rows.length > 0 && (
                <div className="overflow-auto max-h-48 border rounded-lg">
                  <table className="w-full text-xs">
                    <thead className="bg-accent">
                      <tr>{Object.keys(uploadResult.rows[0]).map(h => <th key={h} className="px-2 py-1.5 text-left font-medium">{h}</th>)}</tr>
                    </thead>
                    <tbody>
                      {uploadResult.rows.slice(0, 10).map((row, i) => (
                        <tr key={i} className="border-t">
                          {Object.values(row).map((v, j) => <td key={j} className="px-2 py-1 text-muted-foreground">{v}</td>)}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {uploadResult.rows.length > 10 && <p className="text-xs text-muted-foreground p-2">+{uploadResult.rows.length - 10} more rows…</p>}
                </div>
              )}

              {uploadResult.rows.length > 0 && uploadResult.errors.length === 0 && (
                <Button size="sm" className="gap-1" onClick={() => setSaved(true)}>
                  <CheckCircle className="h-3.5 w-3.5" />
                  {saved ? 'Saved (demo mode)' : `Import ${uploadResult.rows.length} ${uploadType}s`}
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <Separator />
      <div className="flex justify-end">
        <Button>Save Preferences</Button>
      </div>
    </div>
  );
}
