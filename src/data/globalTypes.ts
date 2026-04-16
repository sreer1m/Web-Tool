export type ITMaturity = 'Emerging' | 'Developing' | 'Mature';
export type EconomicStrength = 'Low' | 'Mid' | 'High';
export type GrowthPotential = 'Low' | 'Medium' | 'High';
export type MEParticipation = 'Participating' | 'Not Participating' | 'No Verified Data';
export type EventCategory =
  | 'Cybersecurity'
  | 'Cloud'
  | 'IT Infrastructure'
  | 'DevOps'
  | 'MSP'
  | 'Enterprise IT'
  | 'Digital Transformation'
  | 'ITSM';

export interface Region {
  id: string;
  name: string;
  color: string;
  hoverColor: string;
  countries: string[]; // exact names as in world-atlas Natural Earth topojson
  description: string;
  mePresenceSummary: string;
  keyOpportunities: string[];
}

export interface CountryIntelligence {
  countryName: string; // must match world-atlas topojson geo.properties.name
  countryCode: string; // ISO alpha-2
  region: string; // region id
  itMaturity: ITMaturity;
  economicStrength: EconomicStrength;
  growthPotential: GrowthPotential;
  mePresence: {
    products: string[];
    initiatives: string[];
    focus: string;
  };
  marketingStrategy: {
    gtm: string;
    channels: string[];
    priority: 'High' | 'Medium' | 'Low';
  };
  language: {
    primary: string;
    secondary?: string[];
    localizationNeeds: string;
  };
  competitors: {
    local: string[];
    regional: string[];
    global: string[];
  };
  notes?: string;
}

export interface GlobalEvent {
  id: string;
  name: string;
  countryName: string; // matches world-atlas topojson name
  countryCode: string;
  city: string;
  region: string; // region id
  category: EventCategory;
  source: string;
  date: string; // ISO date of latest edition
  dateDisplay: string; // human-readable
  coordinates?: [number, number]; // [lng, lat] for map marker
  meParticipation: MEParticipation;
  verification?: string; // URL or proof reference
  intelligence?: {
    audience?: string;
    whyMatters?: string;
    competitorPresence?: string[];
  };
}

export type GoverningUnion = 'EU' | 'EEA' | 'Non-EU' | 'CIS' | 'AU (African Union)';

export interface ComplianceRegulation {
  name: string;
  description: string;
  appliesTo: string; // e.g. 'data', 'cybersecurity', 'SaaS', 'critical infrastructure'
  sourceUrl: string;
}

export interface CountryCompliance {
  countryName: string;
  countryCode: string;
  governingUnion: GoverningUnion;
  applicableRegulations: ComplianceRegulation[];
}

export interface CompetitorEntry {
  companyName: string;
  website: string;
  country: string;
  category: string; // e.g. 'ITSM', 'IAM', 'Endpoint', 'Observability', 'SIEM'
  shortDescription: string;
  sourceUrl: string;
}

export interface GlobalNote {
  id: string;
  title: string;
  content: string;
  category: 'Global' | 'Regional' | 'Country' | 'Event' | 'Strategy';
  regionId?: string;
  countryCode?: string;
  tags: string[];
  createdAt: string;
}
