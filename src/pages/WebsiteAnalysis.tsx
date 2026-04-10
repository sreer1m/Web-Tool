import { useState, useRef, useEffect } from "react";
import { partners } from "@/data";
import { websiteAnalysisReports } from "@/data/websiteAnalysis";
import type { WebsiteAnalysisReport } from "@/data/websiteAnalysis";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Search, Globe, CheckCircle, XCircle, AlertTriangle, Lightbulb,
  Monitor, Smartphone, Star, ExternalLink, Shield, Zap,
} from "lucide-react";
import { Link } from "react-router-dom";

function ScoreBar({ label, score, color }: { label: string; score: number; color: string }) {
  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-semibold">{score}</span>
      </div>
      <div className="h-2 bg-accent rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${score}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}

function scoreColor(score: number): string {
  if (score >= 90) return '#16a34a';
  if (score >= 70) return '#ca8a04';
  if (score >= 50) return '#ea580c';
  return '#dc2626';
}

function scoreBadge(score: number): { label: string; cls: string } {
  if (score >= 90) return { label: 'Excellent', cls: 'bg-green-100 text-green-700' };
  if (score >= 70) return { label: 'Good', cls: 'bg-yellow-100 text-yellow-700' };
  if (score >= 50) return { label: 'Needs Work', cls: 'bg-orange-100 text-orange-700' };
  return { label: 'Poor', cls: 'bg-red-100 text-red red-700' };
}

function LighthousePanel({ report }: { report: WebsiteAnalysisReport }) {
  const [tab, setTab] = useState<'desktop' | 'mobile'>('desktop');
  if (!report.lighthouse) return null;
  const audit = tab === 'desktop' ? report.lighthouse.desktop : report.lighthouse.mobile;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Zap className="h-4 w-4 text-yellow-500" /> Lighthouse Audit
        </CardTitle>
        <div className="flex gap-2 mt-1">
          <button
            onClick={() => setTab('desktop')}
            className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-md transition-colors ${tab === 'desktop' ? 'bg-primary text-primary-foreground' : 'bg-accent text-muted-foreground hover:bg-accent/80'}`}
          >
            <Monitor className="h-3 w-3" /> Desktop
          </button>
          <button
            onClick={() => setTab('mobile')}
            className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-md transition-colors ${tab === 'mobile' ? 'bg-primary text-primary-foreground' : 'bg-accent text-muted-foreground hover:bg-accent/80'}`}
          >
            <Smartphone className="h-3 w-3" /> Mobile
          </button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Score pills */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Performance', score: audit.performance },
            { label: 'Accessibility', score: audit.accessibility },
            { label: 'Best Practices', score: audit.bestPractices },
            { label: 'SEO', score: audit.seo },
          ].map(({ label, score }) => {
            const badge = scoreBadge(score);
            return (
              <div key={label} className="text-center bg-accent/50 rounded-lg p-3">
                <div
                  className="text-2xl font-bold"
                  style={{ color: scoreColor(score) }}
                >{score}</div>
                <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
                <span className={`text-xs px-1.5 py-0.5 rounded font-medium mt-1 inline-block ${badge.cls}`}>{badge.label}</span>
              </div>
            );
          })}
        </div>

        {/* Score bars */}
        <div className="space-y-2">
          <ScoreBar label="Performance" score={audit.performance} color={scoreColor(audit.performance)} />
          <ScoreBar label="Accessibility" score={audit.accessibility} color={scoreColor(audit.accessibility)} />
          <ScoreBar label="Best Practices" score={audit.bestPractices} color={scoreColor(audit.bestPractices)} />
          <ScoreBar label="SEO" score={audit.seo} color={scoreColor(audit.seo)} />
        </div>

        {/* Summary */}
        <div className="bg-accent/40 rounded-lg p-3">
          <p className="text-xs font-medium mb-1">{tab === 'desktop' ? 'Desktop' : 'Mobile'} Summary</p>
          <p className="text-xs text-muted-foreground leading-relaxed">{audit.summary}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function ReportView({ report }: { report: WebsiteAnalysisReport }) {
  const partner = partners.find(p => p.id === report.partnerId);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold">{report.companyName}</h2>
          <p className="text-sm text-muted-foreground">{report.location}</p>
          <a
            href={report.website}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-primary hover:underline flex items-center gap-1 mt-1"
          >
            <ExternalLink className="h-3.5 w-3.5" /> {report.website}
          </a>
        </div>
        {partner && (
          <Link
            to={`/partners/${partner.id}`}
            className="text-xs px-3 py-1.5 bg-primary text-primary-foreground rounded-md hover:opacity-90 transition-opacity whitespace-nowrap"
          >
            View Partner Profile →
          </Link>
        )}
      </div>

      {/* Overall status */}
      <div className="grid grid-cols-3 gap-3">
        <div className={`rounded-lg p-3 text-center ${report.alignmentIssues.length === 0 ? 'bg-green-50 border border-green-100' : 'bg-red-50 border border-red-100'}`}>
          <p className={`text-lg font-bold ${report.alignmentIssues.length === 0 ? 'text-green-700' : 'text-red-700'}`}>
            {report.alignmentIssues.length}
          </p>
          <p className="text-xs text-muted-foreground">Alignment Issues</p>
        </div>
        <div className={`rounded-lg p-3 text-center ${report.uxIssues.length === 0 ? 'bg-green-50 border border-green-100' : 'bg-yellow-50 border border-yellow-100'}`}>
          <p className={`text-lg font-bold ${report.uxIssues.length === 0 ? 'text-green-700' : 'text-yellow-700'}`}>
            {report.uxIssues.length}
          </p>
          <p className="text-xs text-muted-foreground">UX Issues</p>
        </div>
        <div className="rounded-lg p-3 text-center bg-blue-50 border border-blue-100">
          <p className="text-lg font-bold text-blue-700">
            {report.recommendations.reduce((s, r) => s + r.items.length, 0)}
          </p>
          <p className="text-xs text-muted-foreground">Recommendations</p>
        </div>
      </div>

      {/* Partner Strengths */}
      {report.partnerStrengths && report.partnerStrengths.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2 text-green-700">
              <Star className="h-4 w-4 fill-green-500 text-green-500" /> Partner Strengths
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-1.5">
              {report.partnerStrengths.map((s, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <CheckCircle className="h-3.5 w-3.5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Alignment Issues */}
      {report.alignmentIssues.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Shield className="h-4 w-4 text-red-500" /> ManageEngine Partner Alignment Issues
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {report.alignmentIssues.map((issue, i) => (
              <div key={i} className="bg-red-50 border border-red-100 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <XCircle className="h-3.5 w-3.5 text-red-600 flex-shrink-0" />
                  <p className="text-sm font-semibold text-red-800">{issue.title}</p>
                </div>
                <p className="text-xs text-red-700 pl-5 leading-relaxed">{issue.description}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* UX Issues */}
      {report.uxIssues.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-yellow-500" /> Website Functionality & UX Issues
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {report.uxIssues.map((issue, i) => (
              <div key={i} className="bg-yellow-50 border border-yellow-100 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <AlertTriangle className="h-3.5 w-3.5 text-yellow-600 flex-shrink-0" />
                  <p className="text-sm font-semibold text-yellow-800">{issue.title}</p>
                </div>
                <p className="text-xs text-yellow-700 pl-5 leading-relaxed">{issue.description}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* No issues badge */}
      {report.alignmentIssues.length === 0 && report.uxIssues.length === 0 && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
          <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
          <div>
            <p className="text-sm font-semibold text-green-800">No Issues Found</p>
            <p className="text-xs text-green-700">A live review confirmed no ManageEngine branding or UX issues on this site.</p>
          </div>
        </div>
      )}

      {/* Recommendations */}
      {report.recommendations.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Lightbulb className="h-4 w-4 text-blue-500" /> Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {report.recommendations.map((rec, i) => (
              <div key={i}>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">{rec.category}</p>
                <ul className="space-y-1.5">
                  {rec.items.map((item, j) => (
                    <li key={j} className="flex items-start gap-2 text-sm">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0 mt-1.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                {i < report.recommendations.length - 1 && <Separator className="mt-3" />}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Lighthouse */}
      <LighthousePanel report={report} />
    </div>
  );
}

export default function WebsiteAnalysis() {
  const [query, setQuery] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState<WebsiteAnalysisReport | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  // Filter reports by query
  const matchedReports = query.trim().length > 0
    ? websiteAnalysisReports.filter(r => {
        const q = query.toLowerCase();
        return (
          r.companyName.toLowerCase().includes(q) ||
          r.location.toLowerCase().includes(q) ||
          r.website.toLowerCase().includes(q)
        );
      })
    : [];

  // Click outside to close dropdown
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const selectReport = (r: WebsiteAnalysisReport) => {
    setSelectedReport(r);
    setQuery(r.companyName);
    setDropdownOpen(false);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-semibold flex items-center gap-2">
          <Globe className="h-6 w-6 text-primary" /> Partner Website Analysis
        </h1>
        <p className="text-sm text-muted-foreground">
          Search for a partner to view their website audit report — branding alignment, UX issues, Lighthouse scores and recommendations.
        </p>
      </div>

      {/* Search */}
      <div ref={ref} className="relative max-w-lg">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by company name, location, or website…"
            className="pl-9"
            value={query}
            onChange={e => { setQuery(e.target.value); setDropdownOpen(true); if (!e.target.value) setSelectedReport(null); }}
            onFocus={() => query && setDropdownOpen(true)}
          />
        </div>

        {/* Dropdown */}
        {dropdownOpen && matchedReports.length > 0 && (
          <div className="absolute top-full mt-1 left-0 right-0 z-50 bg-card border rounded-lg shadow-lg overflow-hidden">
            {matchedReports.map(r => {
              const partner = partners.find(p => p.id === r.partnerId);
              const issueCount = r.alignmentIssues.length + r.uxIssues.length;
              return (
                <button
                  key={r.partnerId}
                  className="w-full flex items-center justify-between px-4 py-3 hover:bg-accent text-left transition-colors border-b last:border-b-0"
                  onClick={() => selectReport(r)}
                >
                  <div>
                    <p className="text-sm font-medium">{r.companyName}</p>
                    <p className="text-xs text-muted-foreground">{r.location} · {r.website}</p>
                  </div>
                  <div className="flex gap-2 items-center flex-shrink-0 ml-4">
                    {partner && (
                      <span className={`text-xs px-1.5 py-0.5 rounded font-medium capitalize ${partner.tier === 'platinum' ? 'bg-indigo-100 text-indigo-700' : partner.tier === 'gold' ? 'bg-yellow-100 text-yellow-700' : 'bg-slate-100 text-slate-700'}`}>
                        {partner.tier}
                      </span>
                    )}
                    {issueCount > 0 ? (
                      <span className="text-xs bg-red-100 text-red-700 px-1.5 py-0.5 rounded font-medium">{issueCount} issue{issueCount > 1 ? 's' : ''}</span>
                    ) : (
                      <span className="text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded font-medium">Clean</span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {dropdownOpen && query.trim() && matchedReports.length === 0 && (
          <div className="absolute top-full mt-1 left-0 right-0 z-50 bg-card border rounded-lg shadow-lg px-4 py-3 text-sm text-muted-foreground">
            No analysis report found for "{query}"
          </div>
        )}
      </div>

      {/* Overview Cards (when no report selected) */}
      {!selectedReport && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              ['Reports Available', websiteAnalysisReports.length],
              ['With Issues', websiteAnalysisReports.filter(r => r.alignmentIssues.length + r.uxIssues.length > 0).length],
              ['Clean Sites', websiteAnalysisReports.filter(r => r.alignmentIssues.length === 0 && r.uxIssues.length === 0).length],
              ['Total Issues', websiteAnalysisReports.reduce((s, r) => s + r.alignmentIssues.length + r.uxIssues.length, 0)],
            ].map(([l, v]) => (
              <Card key={String(l)}>
                <CardContent className="p-4">
                  <p className="text-xs text-muted-foreground">{l}</p>
                  <p className="text-xl font-semibold mt-1">{v}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">All Partners with Reports</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y">
                {websiteAnalysisReports.map(r => {
                  const partner = partners.find(p => p.id === r.partnerId);
                  const issueCount = r.alignmentIssues.length + r.uxIssues.length;
                  const desktopPerf = r.lighthouse?.desktop.performance;
                  const mobilePerf = r.lighthouse?.mobile.performance;
                  return (
                    <button
                      key={r.partnerId}
                      className="w-full flex items-center justify-between px-4 py-3 hover:bg-accent text-left transition-colors"
                      onClick={() => selectReport(r)}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="text-sm font-medium">{r.companyName}</p>
                          {partner && (
                            <span className={`text-xs px-1.5 py-0.5 rounded font-medium capitalize ${partner.tier === 'platinum' ? 'bg-indigo-100 text-indigo-700' : partner.tier === 'gold' ? 'bg-yellow-100 text-yellow-700' : 'bg-slate-100 text-slate-700'}`}>
                              {partner.tier}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">{r.location}</p>
                      </div>
                      <div className="flex items-center gap-3 flex-shrink-0 ml-4">
                        {desktopPerf !== undefined && (
                          <div className="text-center hidden sm:block">
                            <p className="text-xs text-muted-foreground">Desktop</p>
                            <p className="text-sm font-bold" style={{ color: scoreColor(desktopPerf) }}>{desktopPerf}</p>
                          </div>
                        )}
                        {mobilePerf !== undefined && (
                          <div className="text-center hidden sm:block">
                            <p className="text-xs text-muted-foreground">Mobile</p>
                            <p className="text-sm font-bold" style={{ color: scoreColor(mobilePerf) }}>{mobilePerf}</p>
                          </div>
                        )}
                        {issueCount > 0 ? (
                          <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded font-medium">{issueCount} issue{issueCount > 1 ? 's' : ''}</span>
                        ) : (
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded font-medium flex items-center gap-1">
                            <CheckCircle className="h-3 w-3" /> Clean
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {/* Report */}
      {selectedReport && (
        <div>
          <button
            className="text-xs text-muted-foreground hover:text-foreground mb-4 flex items-center gap-1 transition-colors"
            onClick={() => { setSelectedReport(null); setQuery(""); }}
          >
            ← Back to all reports
          </button>
          <ReportView report={selectedReport} />
        </div>
      )}
    </div>
  );
}
