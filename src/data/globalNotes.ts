import type { GlobalNote } from './globalTypes';

export const defaultNotes: GlobalNote[] = [
  {
    id: 'gn_1',
    title: 'Global ITSM Market Trends 2025',
    content:
      'The global ITSM market is expected to reach $15.5B by 2026 (CAGR ~18%). Key trends driving demand:\n\n• AI-assisted service desks (co-pilot features) are becoming a purchase criterion\n• NIS2 directive in Europe is forcing organisations to invest in ITSM and audit tooling\n• Mid-market buyers (200-2000 employees) are actively replacing legacy tools (Remedy, Cherwell)\n• ServiceNow pricing is pushing mid-market buyers to evaluate alternatives — ME\'s #1 opportunity\n• Endpoint management convergence (ITSM + UEM) is a growing buyer requirement\n\nAction: Ensure AI features in ServiceDesk Plus are prominently positioned in all regional marketing.',
    category: 'Global',
    tags: ['itsm', 'trends', 'ai', 'nis2', 'servicenow'],
    createdAt: '2025-01-15',
  },
  {
    id: 'gn_2',
    title: 'GITEX Global 2025 — Strategy Notes',
    content:
      'GITEX Global (Oct 13–17, Dubai) is the most important event for Middle East market presence.\n\nKey objectives:\n• Showcase full product portfolio — ServiceDesk Plus, Log360, PAM360, OpManager\n• Target Saudi Vision 2030 project buyers and UAE government entities\n• Strengthen existing partner relationships in GCC\n• Generate leads from the 170+ country visitor base\n\nCompetitors to watch:\n• ServiceNow will have a large booth — be prepared with pricing comparisons\n• IBM and Cisco are strong in the region — differentiate on ease of deployment and TCO\n\nFollow-up: Schedule C-suite meetings 3 weeks before the event. Prepare Arabic-language collateral for government visitors.',
    category: 'Event',
    tags: ['gitex', 'dubai', 'middle-east', 'uae', 'strategy'],
    createdAt: '2025-02-10',
  },
  {
    id: 'gn_3',
    title: 'DACH Market Intelligence — Key Observations',
    content:
      'Germany, Austria, Switzerland (DACH) represent the highest-value European opportunity for ManageEngine.\n\nKey observations from partner feedback:\n• German buyers require BSI IT-Grundschutz compliance documentation — we must prepare this\n• Data sovereignty is non-negotiable — on-premise or EU-hosted cloud options must be highlighted\n• Matrix42 is losing market share — their customers are open to evaluating alternatives\n• Swiss financial sector (UBS, Credit Suisse legacy, Julius Baer) has strong ITSM needs\n• Austrian public sector is underpenetrated — opportunity for ServiceDesk Plus\n\nNext steps:\n• Develop German-language compliance white paper (BSI IT-Grundschutz alignment)\n• Engage 3 new DACH VARs in Q2 2025\n• Consider German-language webinar series on NIS2 + DACH compliance',
    category: 'Regional',
    regionId: 'dach',
    tags: ['dach', 'germany', 'bsi', 'compliance', 'partners'],
    createdAt: '2025-03-01',
  },
  {
    id: 'gn_4',
    title: 'UAE Pipeline Intelligence — Q1 2025',
    content:
      'Active pipeline observations for United Arab Emirates:\n\n• Dubai Municipality is evaluating ITSM replacement (current: ServiceDesk legacy)\n• ADNOC (oil) has an open RFQ for endpoint management — Endpoint Central is well positioned\n• Emirates Group IT team attended a ServiceDesk Plus demo — follow-up in progress\n• RTA (Roads and Transport Authority Dubai) is a warm lead from GITEX 2024 booth\n\nChallenges:\n• Local competitors (Help AG) are bidding on the same accounts with professional services\n• Arabic UI completeness is being questioned by government buyers\n\nAction: Prioritize Arabic UI improvements for ServiceDesk Plus. Engage Help AG as a potential SI partner rather than competing directly.',
    category: 'Country',
    countryCode: 'AE',
    tags: ['uae', 'pipeline', 'dubai', 'government', 'arabic'],
    createdAt: '2025-03-15',
  },
  {
    id: 'gn_5',
    title: 'NIS2 Directive — Impact Across Europe',
    content:
      'The EU NIS2 Directive (Network and Information Security) entered force in October 2024, affecting ~160,000 organisations across Europe.\n\nKey implications for ManageEngine:\n\nProducts directly relevant:\n• Log360 (SIEM) — mandatory for incident detection and reporting\n• ADAudit Plus — user activity monitoring and audit logs\n• PAM360 — privileged access management (required for critical infrastructure)\n• Vulnerability Manager Plus — asset and vulnerability tracking\n\nAffected sectors (NIS2 scope):\n• Energy, transport, banking, financial market infrastructure\n• Health, drinking water, digital infrastructure\n• Public administration, space\n\nCountries with highest urgency:\n• Germany, Netherlands, France, Belgium, Sweden (strong enforcement expected)\n• Poland, Czech Republic (growing compliance awareness)\n\nMarketing action: Create a NIS2 compliance microsite/content hub. Run NIS2 webinar series in German, French, Dutch. Develop NIS2 compliance checklist showing ME product coverage.',
    category: 'Regional',
    regionId: 'europe',
    tags: ['nis2', 'compliance', 'europe', 'gdpr', 'cybersecurity'],
    createdAt: '2025-01-20',
  },
  {
    id: 'gn_6',
    title: 'ManageEngine vs ServiceNow — Global Positioning',
    content:
      'ServiceNow is the #1 competitive threat globally. Key positioning notes for every region:\n\nPrice advantage:\n• ME ServiceDesk Plus Enterprise: ~$50/agent/month\n• ServiceNow ITSM Professional: $150-250/agent/month\n• 3-5x TCO difference — this is the strongest message for mid-market\n\nWhere ME wins:\n• Organizations with 100-2000 IT users (mid-market sweet spot)\n• Price-sensitive markets (LATAM, India, Southeast Asia, Africa)\n• Quick deployment needs (SN takes 6-18 months; ME deploys in weeks)\n• AD-centric environments (ME\'s deep AD integration is unmatched)\n\nWhere ServiceNow wins:\n• Large enterprise (5000+ users) with complex workflow needs\n• Companies already on ServiceNow (switching cost too high)\n• US Fortune 500 with Gartner-mandated vendor lists\n\nKey message: "Enterprise power, mid-market price. Deploy in weeks, not months."',
    category: 'Strategy',
    tags: ['servicenow', 'competitive', 'positioning', 'pricing', 'messaging'],
    createdAt: '2025-02-05',
  },
  {
    id: 'gn_7',
    title: 'APAC Growth Priorities 2025',
    content:
      'APAC represents ManageEngine\'s largest global revenue base. Key 2025 growth priorities:\n\nTop opportunity markets:\n1. Indonesia — largest SE Asian economy, rapid enterprise IT modernization. Partner development needed.\n2. Vietnam — fast-growing manufacturing FDI driving IT spend. Mostly mid-market.\n3. Australia — ASD Essential 8 compliance is a door-opener. Invest in government sector partners.\n4. Philippines — BPO sector (strong ITSM needs), growing enterprise market.\n\nJapan note:\n• Progress is slow — full Japanese localization is the prerequisite. Prioritize if resources allow.\n\nIndia note:\n• Home market is competitive (Freshworks). Focus on government vertical (Digital India) and NE India.\n\nKey events:\n• GITEX Asia (Singapore, April) — expanding rapidly, good for SE Asia visibility\n• AusCERT (Brisbane, May) — key for Australian cybersecurity buyers\n• Japan IT Week (Tokyo, May/October) — critical for Japan market development',
    category: 'Regional',
    regionId: 'apac',
    tags: ['apac', 'asia', 'indonesia', 'australia', 'japan', 'growth'],
    createdAt: '2025-01-25',
  },
];
