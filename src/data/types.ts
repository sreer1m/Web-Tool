export type RiskLevel = 'low' | 'medium' | 'high';
export type Channel = 'email' | 'ads' | 'social';
export type PartnerTier = 'platinum' | 'gold' | 'silver' | 'standard';

export interface Partner {
  id: string;
  name: string;
  country: string;
  countryCode: string;
  coordinates: [number, number]; // [lng, lat]
  yearsActive: number[];
  totalRevenue: number;
  roi: number;
  riskLevel: RiskLevel;
  engagementScore: number;
  riskScore: number;
  lastActivity: string;
  product: string;
  revenueByMonth: { month: string; revenue: number }[];
  investment: number;
  // Real partner contact fields
  address?: string;
  city?: string;
  contactPerson?: string;
  phone?: string;
  email?: string;
  website?: string;
  tier?: PartnerTier;
}

export interface Event {
  id: string;
  name: string;
  country: string;
  countryCode: string;
  coordinates: [number, number];
  year: number;
  partnerId?: string;
  budget: number;
  registrations: number;
  attendance: number;
  leads: number;
  conversions: number;
  conversionRate: number;
  revenueImpact: number;
  type: string;
  // Extended fields for 2026 event redesign
  date?: string;
  location?: string;
  eventKind?: 'owned' | 'external';
  category?: string;
  status?: string;        // e.g. "Exhibited", "Confirmed", "Not Participating"
  audience?: string;
  strategicValue?: string;
}

export interface Campaign {
  id: string;
  name: string;
  channel: Channel;
  eventId?: string;
  registrations: number;
  conversions: number;
  roi: number;
  engagement: number;
  spend: number;
  revenue: number;
  startDate: string;
  endDate: string;
}

export interface CountryData {
  name: string;
  code: string;
  coordinates: [number, number];
  revenue: number;
  demand: number;
  partnerCount: number;
  eventCount: number;
  conversionRate: number;
  traffic: number;
}

export interface Alert {
  id: string;
  type: 'risk' | 'conversion' | 'inactive' | 'opportunity';
  message: string;
  severity: RiskLevel;
  relatedId?: string;
}

export interface Datacenter {
  id: string;
  name: string;
  location: string;
  country: string;
  countryCode: string;
  coordinates: [number, number];
  type: 'primary' | 'secondary' | 'edge';
  status: 'operational' | 'maintenance' | 'planned';
  capacityUsed: number; // percentage
  latency: number; // ms
  services: string[];
  uptime: number; // percentage
  region: string;
}

export interface EventLearning {
  id: string;
  eventId: string;
  whatWorked: string[];
  whatDidntWork: string[];
  notes: string;
  rating: number; // 1-5
  similarEventIds: string[];
}

export interface Action {
  id: string;
  title: string;
  reason: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  category: 'partner' | 'event' | 'region' | 'campaign';
  nextStep: string;
  relatedId?: string;
  impact: string;
}
