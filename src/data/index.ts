export { partners } from './partners';
export { events } from './events';
export { campaigns } from './campaigns';
export { countries, alerts } from './countries';
export { datacenters } from './datacenters';
export { eventLearnings } from './eventLearnings';
export { websiteAnalysisReports } from './websiteAnalysis';
export { regions, COUNTRY_TO_REGION } from './regions';
export { countryIntelligence } from './globalMarkets';
export { globalEvents } from './globalEvents';
export { defaultNotes } from './globalNotes';
export type * from './types';
export type * from './globalTypes';

// Utility: compute partner health score (0–100)
import { Partner } from './types';
export function computeHealthScore(partner: Partner): number {
  const activityDays = Math.floor((Date.now() - new Date(partner.lastActivity).getTime()) / 86400000);
  const activityScore = Math.max(0, 100 - activityDays * 1.5);
  const score = Math.round(
    partner.engagementScore * 0.40 +
    (100 - partner.riskScore) * 0.35 +
    Math.min(100, activityScore) * 0.25
  );
  return Math.max(0, Math.min(100, score));
}

export function healthLabel(score: number): 'Healthy' | 'Moderate' | 'At Risk' {
  if (score >= 70) return 'Healthy';
  if (score >= 45) return 'Moderate';
  return 'At Risk';
}

export function healthColor(score: number): string {
  if (score >= 70) return 'text-green-600';
  if (score >= 45) return 'text-yellow-600';
  return 'text-red-600';
}

export function healthBg(score: number): string {
  if (score >= 70) return 'bg-green-50 border-green-200';
  if (score >= 45) return 'bg-yellow-50 border-yellow-200';
  return 'bg-red-50 border-red-200';
}
