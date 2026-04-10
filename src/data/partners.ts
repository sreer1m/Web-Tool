import { Partner } from './types';

// Deterministic seeded random for reproducible revenue data
function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) & 0x7fffffff;
    return s / 0x7fffffff;
  };
}

const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
function genRevenue(base: number, seed: number) {
  const rand = seeded(seed);
  return months.map((m, i) => ({
    month: `${m} 2025`,
    revenue: Math.round(base * (0.75 + rand() * 0.5) + i * base * 0.015),
  }));
}

export const partners: Partner[] = [
  // ─── ALBANIA ──────────────────────────────────────────────────────────────
  {
    id: 'p_alb1', name: '4sec d.o.o.', country: 'Albania', countryCode: 'AL',
    coordinates: [19.82, 41.33], city: 'Tirana',
    address: 'P.O. box 1705, 1001 Tirana, Albania',
    contactPerson: 'Sanjan Ostro', phone: '+355 68 6080 440',
    email: 'sanjan.ostro@4sec.hr', website: 'https://www.4sec.hr/',
    tier: 'standard',
    yearsActive: [2023,2024,2025], totalRevenue: 96000, roi: 1.8,
    riskLevel: 'medium', engagementScore: 58, riskScore: 44,
    lastActivity: '2025-12-10', product: 'ManageEngine Suite',
    revenueByMonth: genRevenue(8000, 101), investment: 53000,
  },

  // ─── ARMENIA ──────────────────────────────────────────────────────────────
  {
    id: 'p_arm1', name: 'ME Ltd (Agneko)', country: 'Armenia', countryCode: 'AM',
    coordinates: [44.51, 40.18], city: 'Yerevan',
    address: '3A Moskovyan Street, Yerevan, Armenia',
    contactPerson: 'Razmik Gurdjyan', phone: '+3747 725 3039',
    email: 'sales@agneko.am', website: 'http://agneko.am',
    tier: 'standard',
    yearsActive: [2024,2025], totalRevenue: 120000, roi: 2.0,
    riskLevel: 'medium', engagementScore: 62, riskScore: 40,
    lastActivity: '2026-01-15', product: 'ManageEngine Suite',
    revenueByMonth: genRevenue(10000, 102), investment: 60000,
  },

  // ─── AUSTRIA ──────────────────────────────────────────────────────────────
  {
    id: 'p_aut1', name: 'NESTEC Scharf IT-Solutions OG', country: 'Austria', countryCode: 'AT',
    coordinates: [14.37, 48.20], city: 'St. Florian',
    address: 'Pummerinplatz 5, A-4490 St. Florian',
    phone: '+43 (7223) 80703-0', email: 'office@nestec.at',
    website: 'http://www.nestec.at/',
    tier: 'silver',
    yearsActive: [2022,2023,2024,2025,2026], totalRevenue: 540000, roi: 2.6,
    riskLevel: 'low', engagementScore: 78, riskScore: 22,
    lastActivity: '2026-03-20', product: 'IT Management Suite',
    revenueByMonth: genRevenue(45000, 103), investment: 207000,
  },

  // ─── AZERBAIJAN ───────────────────────────────────────────────────────────
  {
    id: 'p_aze1', name: 'Rabalon', country: 'Azerbaijan', countryCode: 'AZ',
    coordinates: [49.87, 40.41], city: 'Baku',
    address: '152 Haydar Aliyev Avenue, Baku, Azerbaijan, AZ1029',
    phone: '+994 50 2613551', email: 'info@rabalon.com',
    website: 'https://rabalon.com/',
    tier: 'standard',
    yearsActive: [2024,2025], totalRevenue: 144000, roi: 1.9,
    riskLevel: 'medium', engagementScore: 55, riskScore: 48,
    lastActivity: '2025-11-30', product: 'ManageEngine Suite',
    revenueByMonth: genRevenue(12000, 104), investment: 75000,
  },

  // ─── BELGIUM ──────────────────────────────────────────────────────────────
  {
    id: 'p_bel1', name: 'Sertalink BV', country: 'Belgium', countryCode: 'BE',
    coordinates: [4.14, 51.16], city: 'Sint-Niklaas',
    address: 'Nieuwe Baan 17, 9111 Sint-Niklaas, Belgium',
    phone: '+32(0)33371701', email: 'sales@sertalink.com',
    website: 'https://www.sertalink.com',
    tier: 'gold',
    yearsActive: [2021,2022,2023,2024,2025,2026], totalRevenue: 680000, roi: 3.1,
    riskLevel: 'low', engagementScore: 84, riskScore: 18,
    lastActivity: '2026-03-28', product: 'Enterprise IT Suite',
    revenueByMonth: genRevenue(56000, 105), investment: 219000,
  },

  // ─── BOSNIA AND HERZEGOVINA ───────────────────────────────────────────────
  {
    id: 'p_bih1', name: '4sec d.o.o. (Bosnia)', country: 'Bosnia and Herzegovina', countryCode: 'BA',
    coordinates: [18.41, 43.85], city: 'Sarajevo',
    address: 'Postanski pretinac 338, 71000 Sarajevo',
    contactPerson: 'Sanjan Ostro', phone: '+387 65 332 253',
    email: 'sanjan.ostro@4sec.hr', website: 'http://www.4sec.hr',
    tier: 'standard',
    yearsActive: [2023,2024,2025], totalRevenue: 84000, roi: 1.7,
    riskLevel: 'medium', engagementScore: 52, riskScore: 50,
    lastActivity: '2025-10-15', product: 'ManageEngine Suite',
    revenueByMonth: genRevenue(7000, 106), investment: 49000,
  },

  // ─── BULGARIA ─────────────────────────────────────────────────────────────
  {
    id: 'p_bgr1', name: 'Infomera Ltd.', country: 'Bulgaria', countryCode: 'BG',
    coordinates: [23.32, 42.70], city: 'Sofia',
    address: '108 Georgi S. Rakovski Str., Sofia 1000, Bulgaria',
    phone: '+359 878 441131', email: 'sales@infomera.bg',
    website: 'http://www.infomera.bg/',
    tier: 'silver',
    yearsActive: [2022,2023,2024,2025,2026], totalRevenue: 300000, roi: 2.3,
    riskLevel: 'low', engagementScore: 72, riskScore: 28,
    lastActivity: '2026-02-14', product: 'ManageEngine Suite',
    revenueByMonth: genRevenue(25000, 107), investment: 130000,
  },

  // ─── CROATIA ──────────────────────────────────────────────────────────────
  {
    id: 'p_hrv1', name: '4sec d.o.o. (Croatia)', country: 'Croatia', countryCode: 'HR',
    coordinates: [15.98, 45.81], city: 'Zagreb',
    address: 'Ulica grada Vukovara 269D, 10 000 Zagreb',
    contactPerson: 'Sanjan Ostro', phone: '+385 1 5571 090',
    email: 'sanjan.ostro@4sec.hr', website: 'http://www.4sec.hr',
    tier: 'silver',
    yearsActive: [2021,2022,2023,2024,2025,2026], totalRevenue: 216000, roi: 2.1,
    riskLevel: 'low', engagementScore: 68, riskScore: 32,
    lastActivity: '2026-02-28', product: 'ManageEngine Suite',
    revenueByMonth: genRevenue(18000, 108), investment: 102000,
  },

  // ─── CYPRUS ───────────────────────────────────────────────────────────────
  {
    id: 'p_cyp1', name: 'Channel IT Ltd (Cyprus)', country: 'Cyprus', countryCode: 'CY',
    coordinates: [33.37, 35.16], city: 'Nicosia',
    address: 'Nikis & 1 Kastoros Str., 1087 Nicosia',
    phone: '+357 2 2256 811', email: 'cnc@channel-it.com',
    website: 'http://www.channel-it.com',
    tier: 'silver',
    yearsActive: [2022,2023,2024,2025], totalRevenue: 180000, roi: 2.2,
    riskLevel: 'low', engagementScore: 70, riskScore: 30,
    lastActivity: '2026-01-20', product: 'ManageEngine Suite',
    revenueByMonth: genRevenue(15000, 109), investment: 81000,
  },

  // ─── CZECH REPUBLIC ───────────────────────────────────────────────────────
  {
    id: 'p_cze1', name: 'MWT Solutions S.A.', country: 'Czech Republic', countryCode: 'CZ',
    coordinates: [14.42, 50.09], city: 'Prague',
    address: 'Freyova 82/27, Vysočany, Praha 9 – 19000',
    phone: '+420 728 299 254', email: 'info@mwtsolutions.cz',
    website: 'https://mwtsolutions.eu/cs/',
    tier: 'gold',
    yearsActive: [2021,2022,2023,2024,2025,2026], totalRevenue: 600000, roi: 2.8,
    riskLevel: 'low', engagementScore: 80, riskScore: 20,
    lastActivity: '2026-03-15', product: 'IT Management Suite',
    revenueByMonth: genRevenue(50000, 110), investment: 214000,
  },

  // ─── DENMARK ──────────────────────────────────────────────────────────────
  {
    id: 'p_dnk1', name: 'Dediko A/S', country: 'Denmark', countryCode: 'DK',
    coordinates: [12.47, 55.81], city: 'Holte',
    address: 'Højbjerg Vang 18, DK-2840 Holte, Danmark',
    contactPerson: 'Søren Bo Raavig / Christian Schmidt',
    phone: '+45 45 76 20 21', email: 'sbr@dediko.dk',
    website: 'https://dediko.dk',
    tier: 'gold',
    yearsActive: [2020,2021,2022,2023,2024,2025,2026], totalRevenue: 504000, roi: 2.7,
    riskLevel: 'low', engagementScore: 82, riskScore: 18,
    lastActivity: '2026-03-25', product: 'IT Management Suite',
    revenueByMonth: genRevenue(42000, 111), investment: 186000,
  },

  // ─── FINLAND ──────────────────────────────────────────────────────────────
  {
    id: 'p_fin1', name: 'Ironnet Oy', country: 'Finland', countryCode: 'FI',
    coordinates: [24.66, 60.21], city: 'Espoo',
    address: 'Sinikalliontie 10, FI-02630 Espoo',
    contactPerson: 'Timo Lindfors', phone: '+358 40 735 1701',
    email: 'timo.lindfors@ironnet.net', website: 'http://www.ironnet.fi/',
    tier: 'silver',
    yearsActive: [2022,2023,2024,2025,2026], totalRevenue: 420000, roi: 2.5,
    riskLevel: 'low', engagementScore: 76, riskScore: 24,
    lastActivity: '2026-03-10', product: 'IT Management Suite',
    revenueByMonth: genRevenue(35000, 112), investment: 168000,
  },

  // ─── FRANCE ───────────────────────────────────────────────────────────────
  {
    id: 'p_fra1', name: 'ByTheWay', country: 'France', countryCode: 'FR',
    coordinates: [3.06, 50.55], city: 'Vendeville',
    address: '8 rue d\'Avelin, 59175 VENDEVILLE, France',
    phone: '03 20 47 41 75', email: 'manageengine@bytheway.fr',
    website: 'http://www.bytheway.fr/',
    tier: 'silver',
    yearsActive: [2021,2022,2023,2024,2025,2026], totalRevenue: 780000, roi: 2.9,
    riskLevel: 'low', engagementScore: 79, riskScore: 21,
    lastActivity: '2026-03-18', product: 'ManageEngine Suite',
    revenueByMonth: genRevenue(65000, 113), investment: 268000,
  },
  {
    id: 'p_fra2', name: 'LAZAR SOFT', country: 'France', countryCode: 'FR',
    coordinates: [3.97, 43.64], city: 'Saint-Brès',
    address: 'Actipôle – 76 Impasse de la Pépinière, 34670 Saint-Brès, France',
    phone: '01 76 21 60 43', email: 'sales@lazarsoft.com',
    website: 'http://www.lazarsoft.com',
    tier: 'silver',
    yearsActive: [2022,2023,2024,2025,2026], totalRevenue: 540000, roi: 2.4,
    riskLevel: 'low', engagementScore: 74, riskScore: 26,
    lastActivity: '2026-02-25', product: 'ManageEngine Suite',
    revenueByMonth: genRevenue(45000, 114), investment: 225000,
  },
  {
    id: 'p_fra3', name: 'PG Software Europe', country: 'France', countryCode: 'FR',
    coordinates: [-1.88, 46.85], city: 'Challans',
    address: '4 Rue Henri Becquerel, 85300 CHALLANS',
    phone: '+332 51.60.26.75', email: 'sales@pgsoftware.fr',
    website: 'http://www.pgsoftware.fr',
    tier: 'gold',
    yearsActive: [2020,2021,2022,2023,2024,2025,2026], totalRevenue: 1080000, roi: 3.4,
    riskLevel: 'low', engagementScore: 88, riskScore: 14,
    lastActivity: '2026-04-02', product: 'Enterprise IT Suite',
    revenueByMonth: genRevenue(90000, 115), investment: 317000,
  },
  {
    id: 'p_fra4', name: 'NETWARX', country: 'France', countryCode: 'FR',
    coordinates: [2.35, 48.86], city: 'Paris',
    address: '17-21 Rue Saint Fiacre, 75002 Paris, France',
    phone: '+337 87 583 454', email: 'sales@netwarx.com',
    website: 'http://www.netwarx.com',
    tier: 'gold',
    yearsActive: [2021,2022,2023,2024,2025,2026], totalRevenue: 960000, roi: 3.2,
    riskLevel: 'low', engagementScore: 85, riskScore: 15,
    lastActivity: '2026-04-05', product: 'Enterprise IT Suite',
    revenueByMonth: genRevenue(80000, 116), investment: 300000,
  },

  // ─── GEORGIA ──────────────────────────────────────────────────────────────
  {
    id: 'p_geo1', name: 'SYNTAX LLC', country: 'Georgia', countryCode: 'GE',
    coordinates: [44.83, 41.69], city: 'Tbilisi',
    address: '106 Beliashvili street, 0159 Tbilisi, Georgia',
    phone: '+995 322880099', email: 'info@syntax.ge',
    tier: 'standard',
    yearsActive: [2023,2024,2025], totalRevenue: 180000, roi: 2.1,
    riskLevel: 'medium', engagementScore: 63, riskScore: 38,
    lastActivity: '2026-01-10', product: 'ManageEngine Suite',
    revenueByMonth: genRevenue(15000, 117), investment: 85000,
  },

  // ─── GERMANY ──────────────────────────────────────────────────────────────
  {
    id: 'p_deu1', name: 'MicroNova AG', country: 'Germany', countryCode: 'DE',
    coordinates: [11.56, 48.26], city: 'Vierkirchen',
    address: 'Unterfeldring 6, D-85256 Vierkirchen, Germany',
    phone: '+49-(0) 8139-9300-456', email: 'sales-manageengine@micronova.de',
    website: 'http://www.manageengine.de',
    tier: 'platinum',
    yearsActive: [2018,2019,2020,2021,2022,2023,2024,2025,2026], totalRevenue: 2640000, roi: 3.8,
    riskLevel: 'low', engagementScore: 96, riskScore: 8,
    lastActivity: '2026-04-08', product: 'Enterprise IT Suite',
    revenueByMonth: genRevenue(220000, 118), investment: 695000,
  },

  // ─── GREECE ───────────────────────────────────────────────────────────────
  {
    id: 'p_grc1', name: 'Channel IT Ltd (Greece)', country: 'Greece', countryCode: 'GR',
    coordinates: [23.73, 37.98], city: 'Athens',
    address: '29, Ag. Fotinis Str., 17121 Athens',
    phone: '+30 210 935 4833', email: 'anc@channel-it.com',
    website: 'http://www.channel-it.com',
    tier: 'silver',
    yearsActive: [2021,2022,2023,2024,2025,2026], totalRevenue: 420000, roi: 2.4,
    riskLevel: 'low', engagementScore: 74, riskScore: 26,
    lastActivity: '2026-02-20', product: 'IT Management Suite',
    revenueByMonth: genRevenue(35000, 119), investment: 175000,
  },

  // ─── HUNGARY ──────────────────────────────────────────────────────────────
  {
    id: 'p_hun1', name: 'RelNet Technology Ltd.', country: 'Hungary', countryCode: 'HU',
    coordinates: [19.04, 47.50], city: 'Budapest',
    address: 'Vaci ut 71, Budapest, Hungary 1047',
    contactPerson: 'Attila Borbély / Szilárd Bodnar',
    phone: '+36 1 48 48-300', email: 'sales@relnet.hu',
    website: 'https://manageengine.relnet.hu/',
    tier: 'gold',
    yearsActive: [2020,2021,2022,2023,2024,2025,2026], totalRevenue: 480000, roi: 2.7,
    riskLevel: 'low', engagementScore: 81, riskScore: 19,
    lastActivity: '2026-03-22', product: 'IT Management Suite',
    revenueByMonth: genRevenue(40000, 120), investment: 177000,
  },
  {
    id: 'p_hun2', name: 'MWT Solutions (Hungary)', country: 'Hungary', countryCode: 'HU',
    coordinates: [19.06, 47.52], city: 'Budapest',
    address: 'Radnóti Miklós u. 2, Budapest, 1137 Hungary',
    contactPerson: 'Gergely Orosz-Rizák',
    email: 'gergely.orosz-rizak@mwtsolutions.eu',
    website: 'https://mwtsolutions.eu/hu/',
    tier: 'silver',
    yearsActive: [2022,2023,2024,2025,2026], totalRevenue: 300000, roi: 2.3,
    riskLevel: 'low', engagementScore: 72, riskScore: 28,
    lastActivity: '2026-03-01', product: 'ManageEngine Suite',
    revenueByMonth: genRevenue(25000, 121), investment: 130000,
  },

  // ─── IRELAND ──────────────────────────────────────────────────────────────
  {
    id: 'p_irl1', name: 'Servaplex Ltd', country: 'Ireland', countryCode: 'IE',
    coordinates: [-6.18, 53.30], city: 'Blackrock',
    address: '14 Main Street, Blackrock, Co Dublin, Ireland',
    phone: '+353 1 2304242', email: 'info@servaplex.com',
    website: 'https://servaplex.com',
    tier: 'gold',
    yearsActive: [2020,2021,2022,2023,2024,2025,2026], totalRevenue: 600000, roi: 2.9,
    riskLevel: 'low', engagementScore: 82, riskScore: 18,
    lastActivity: '2026-03-30', product: 'IT Management Suite',
    revenueByMonth: genRevenue(50000, 122), investment: 206000,
  },

  // ─── ITALY ────────────────────────────────────────────────────────────────
  {
    id: 'p_ita1', name: 'Bludis srl', country: 'Italy', countryCode: 'IT',
    coordinates: [12.50, 41.90], city: 'Rome',
    address: 'Via Adriano Olivetti, 24, 00131 Roma',
    phone: '+39 06 4323 0077', email: 'sales@bludis.it',
    website: 'http://www.bludis.it',
    tier: 'gold',
    yearsActive: [2019,2020,2021,2022,2023,2024,2025,2026], totalRevenue: 1080000, roi: 3.3,
    riskLevel: 'low', engagementScore: 87, riskScore: 13,
    lastActivity: '2026-04-06', product: 'Enterprise IT Suite',
    revenueByMonth: genRevenue(90000, 123), investment: 327000,
  },

  // ─── KOSOVO ───────────────────────────────────────────────────────────────
  {
    id: 'p_xkx1', name: 'SAFEBIT LLC', country: 'Kosovo', countryCode: 'XK',
    coordinates: [21.17, 42.67], city: 'Prishtine',
    address: 'Nazim Gafurri 203 Prishtine, 10000 Kosovo',
    phone: '+383 44 114 721', email: 'sales@safebit-ks.com',
    website: 'http://www.safebit-ks.com/',
    tier: 'standard',
    yearsActive: [2023,2024,2025], totalRevenue: 96000, roi: 1.9,
    riskLevel: 'medium', engagementScore: 60, riskScore: 42,
    lastActivity: '2025-12-20', product: 'ManageEngine Suite',
    revenueByMonth: genRevenue(8000, 124), investment: 50000,
  },
  {
    id: 'p_xkx2', name: '4sec d.o.o. (Kosovo)', country: 'Kosovo', countryCode: 'XK',
    coordinates: [21.19, 42.65], city: 'Pristina',
    address: 'P.O. box 807, 10000 Pristina, Kosovo',
    contactPerson: 'Sanjan Ostro', phone: '+383 45 775 883',
    email: 'sanjan.ostro@4sec.hr', website: 'https://www.4sec.hr/',
    tier: 'standard',
    yearsActive: [2024,2025], totalRevenue: 72000, roi: 1.7,
    riskLevel: 'medium', engagementScore: 54, riskScore: 46,
    lastActivity: '2025-11-15', product: 'ManageEngine Suite',
    revenueByMonth: genRevenue(6000, 125), investment: 42000,
  },

  // ─── LATVIA & ESTONIA ─────────────────────────────────────────────────────
  {
    id: 'p_lva1', name: 'MWT Solutions (Baltics)', country: 'Latvia', countryCode: 'LV',
    coordinates: [25.28, 54.69], city: 'Vilnius',
    address: 'A. Goštauto g. 8-340 Vilnius, III aukštas LT – 01108',
    phone: '+37 063 242 468', email: 'info@mwtsolutions.eu',
    website: 'https://baltics.mwtsolutions.eu/',
    tier: 'silver',
    yearsActive: [2022,2023,2024,2025,2026], totalRevenue: 240000, roi: 2.2,
    riskLevel: 'low', engagementScore: 70, riskScore: 30,
    lastActivity: '2026-02-10', product: 'ManageEngine Suite',
    revenueByMonth: genRevenue(20000, 126), investment: 109000,
  },

  // ─── LITHUANIA ────────────────────────────────────────────────────────────
  {
    id: 'p_ltu1', name: 'Baltimax', country: 'Lithuania', countryCode: 'LT',
    coordinates: [25.26, 54.71], city: 'Vilnius',
    address: 'Laisvės pr. 3, 04215 Vilnius, Lithuania',
    contactPerson: 'Andrius Mickevičius',
    email: 'business@baltimax.com', website: 'https://www.baltimax.com',
    tier: 'silver',
    yearsActive: [2021,2022,2023,2024,2025,2026], totalRevenue: 240000, roi: 2.3,
    riskLevel: 'low', engagementScore: 72, riskScore: 28,
    lastActivity: '2026-02-15', product: 'ManageEngine Suite',
    revenueByMonth: genRevenue(20000, 127), investment: 104000,
  },
  {
    id: 'p_ltu2', name: 'MWT Solutions Lithuania', country: 'Lithuania', countryCode: 'LT',
    coordinates: [25.30, 54.67], city: 'Vilnius',
    address: 'A. Goštauto g. 8-340 Vilnius, III aukštas LT – 01108',
    phone: '+37 063 245 610', email: 'info@mwtsolutions.eu',
    website: 'https://baltics.mwtsolutions.eu/',
    tier: 'standard',
    yearsActive: [2023,2024,2025], totalRevenue: 168000, roi: 2.0,
    riskLevel: 'low', engagementScore: 65, riskScore: 35,
    lastActivity: '2026-01-25', product: 'ManageEngine Suite',
    revenueByMonth: genRevenue(14000, 128), investment: 84000,
  },

  // ─── LUXEMBOURG ───────────────────────────────────────────────────────────
  {
    id: 'p_lux1', name: 'Sertalink SA', country: 'Luxembourg', countryCode: 'LU',
    coordinates: [5.97, 49.65], city: 'Capellen',
    address: 'Business Center Capellen, 77 Route d\'Arlon, Bloc C, L-8311 Capellen',
    phone: '+352 27 940 659', email: 'sales@sertalink.lu',
    tier: 'gold',
    yearsActive: [2021,2022,2023,2024,2025,2026], totalRevenue: 360000, roi: 2.8,
    riskLevel: 'low', engagementScore: 78, riskScore: 22,
    lastActivity: '2026-03-12', product: 'Enterprise IT Suite',
    revenueByMonth: genRevenue(30000, 129), investment: 128000,
  },

  // ─── MACEDONIA ────────────────────────────────────────────────────────────
  {
    id: 'p_mkd1', name: '4sec d.o.o. (Macedonia)', country: 'North Macedonia', countryCode: 'MK',
    coordinates: [21.43, 41.99], city: 'Skopje',
    address: 'Postanski fah 821, 1000 Skopje, Macedonia',
    contactPerson: 'Sanjan Ostro', phone: '+389 77 901 249',
    email: 'sanjan.ostro@4sec.hr', website: 'http://www.4sec.hr',
    tier: 'standard',
    yearsActive: [2023,2024,2025], totalRevenue: 108000, roi: 1.9,
    riskLevel: 'medium', engagementScore: 58, riskScore: 44,
    lastActivity: '2025-12-05', product: 'ManageEngine Suite',
    revenueByMonth: genRevenue(9000, 130), investment: 56000,
  },

  // ─── MALTA ────────────────────────────────────────────────────────────────
  {
    id: 'p_mlt1', name: 'Channel IT Malta Ltd.', country: 'Malta', countryCode: 'MT',
    coordinates: [14.46, 35.89], city: 'Birkirkara',
    address: '1, Floor 2, Falzun Street C/W Naxxar Road, Birkirkara BKR 1441',
    phone: '+356 21 440 056', email: 'cnc@channel-it.com',
    tier: 'standard',
    yearsActive: [2022,2023,2024,2025], totalRevenue: 120000, roi: 2.0,
    riskLevel: 'low', engagementScore: 66, riskScore: 34,
    lastActivity: '2026-01-30', product: 'ManageEngine Suite',
    revenueByMonth: genRevenue(10000, 131), investment: 60000,
  },

  // ─── MOLDOVA ──────────────────────────────────────────────────────────────
  {
    id: 'p_mda1', name: 'Reliable Solutions Distributor S.R.L.', country: 'Moldova', countryCode: 'MD',
    coordinates: [28.86, 47.01], city: 'Chisinau',
    address: 'Chisinau, Alexandrul cel Bun st. no. 85, MD-2012',
    phone: '+373 22 210 208', email: 'sales@rsd.md',
    website: 'http://www.rsd.md',
    tier: 'standard',
    yearsActive: [2023,2024,2025], totalRevenue: 132000, roi: 2.0,
    riskLevel: 'medium', engagementScore: 62, riskScore: 40,
    lastActivity: '2026-01-08', product: 'ManageEngine Suite',
    revenueByMonth: genRevenue(11000, 132), investment: 66000,
  },

  // ─── MONTENEGRO ───────────────────────────────────────────────────────────
  {
    id: 'p_mne1', name: '4sec d.o.o. (Montenegro)', country: 'Montenegro', countryCode: 'ME',
    coordinates: [19.26, 42.44], city: 'Podgorica',
    address: 'Postanski fah 62, 810000 Podgorica',
    contactPerson: 'Sanjan Ostro', phone: '+382 69 298 133',
    email: 'sanjan.ostro@4sec.hr', website: 'http://www.4sec.hr',
    tier: 'standard',
    yearsActive: [2023,2024,2025], totalRevenue: 84000, roi: 1.7,
    riskLevel: 'medium', engagementScore: 52, riskScore: 50,
    lastActivity: '2025-10-20', product: 'ManageEngine Suite',
    revenueByMonth: genRevenue(7000, 133), investment: 49000,
  },

  // ─── NETHERLANDS ──────────────────────────────────────────────────────────
  {
    id: 'p_nld1', name: 'CBA IT Tools', country: 'Netherlands', countryCode: 'NL',
    coordinates: [4.90, 52.37], city: 'Amsterdam',
    address: 'Entrada 234, 1114 AA Amsterdam, The Netherlands',
    phone: '+31 (0)20 610 4888', email: 'sales@cbabenelux.com',
    website: 'http://cbabenelux.nl',
    tier: 'gold',
    yearsActive: [2020,2021,2022,2023,2024,2025,2026], totalRevenue: 900000, roi: 3.2,
    riskLevel: 'low', engagementScore: 86, riskScore: 14,
    lastActivity: '2026-04-01', product: 'Enterprise IT Suite',
    revenueByMonth: genRevenue(75000, 134), investment: 281000,
  },
  {
    id: 'p_nld2', name: 'Dekkers IT Solutions', country: 'Netherlands', countryCode: 'NL',
    coordinates: [4.91, 51.58], city: 'Rijen',
    address: 'Ericssonstraat 2, 5121 ML Rijen, Netherlands',
    phone: '+31 (0)88 007 93 00', email: 'info@dekkersit.com',
    website: 'http://www.dekkersit.com/',
    tier: 'silver',
    yearsActive: [2022,2023,2024,2025,2026], totalRevenue: 540000, roi: 2.6,
    riskLevel: 'low', engagementScore: 78, riskScore: 22,
    lastActivity: '2026-03-15', product: 'IT Management Suite',
    revenueByMonth: genRevenue(45000, 135), investment: 207000,
  },

  // ─── NORWAY ───────────────────────────────────────────────────────────────
  {
    id: 'p_nor1', name: 'Provendo AS', country: 'Norway', countryCode: 'NO',
    coordinates: [9.61, 59.21], city: 'Skien',
    address: 'Nensetbakken 20, 3736 Skien, Norway',
    phone: '+47 35499990', email: 'hjelp@provendo.no',
    website: 'http://www.provendo.no/',
    tier: 'silver',
    yearsActive: [2021,2022,2023,2024,2025,2026], totalRevenue: 540000, roi: 2.5,
    riskLevel: 'low', engagementScore: 75, riskScore: 25,
    lastActivity: '2026-03-05', product: 'IT Management Suite',
    revenueByMonth: genRevenue(45000, 136), investment: 216000,
  },

  // ─── POLAND ───────────────────────────────────────────────────────────────
  {
    id: 'p_pol1', name: 'MWT Solutions S.A.', country: 'Poland', countryCode: 'PL',
    coordinates: [16.93, 52.41], city: 'Poznań',
    address: 'ul. Szyperska 14, 61-754 Poznań, Poland',
    phone: '+48 (0) 61 6222 394', email: 'sprzedaz@mwtsolutions.pl',
    website: 'https://mwtsolutions.eu',
    tier: 'gold',
    yearsActive: [2019,2020,2021,2022,2023,2024,2025,2026], totalRevenue: 840000, roi: 3.0,
    riskLevel: 'low', engagementScore: 83, riskScore: 17,
    lastActivity: '2026-04-03', product: 'Enterprise IT Suite',
    revenueByMonth: genRevenue(70000, 137), investment: 280000,
  },

  // ─── PORTUGAL ─────────────────────────────────────────────────────────────
  {
    id: 'p_prt1', name: 'ALSO Portugal', country: 'Portugal', countryCode: 'PT',
    coordinates: [-8.71, 41.22], city: 'Perafita',
    address: 'R. da Guarda, 675, 4455-466 Perafita, Porto, Portugal',
    phone: '229 993 900', email: 'info.pt@also.com',
    website: 'http://www.also.pt',
    tier: 'silver',
    yearsActive: [2022,2023,2024,2025,2026], totalRevenue: 360000, roi: 2.3,
    riskLevel: 'low', engagementScore: 71, riskScore: 29,
    lastActivity: '2026-02-20', product: 'IT Management Suite',
    revenueByMonth: genRevenue(30000, 138), investment: 156000,
  },

  // ─── ROMANIA ──────────────────────────────────────────────────────────────
  {
    id: 'p_rou1', name: 'Romsym Data SRL', country: 'Romania', countryCode: 'RO',
    coordinates: [26.10, 44.44], city: 'Bucharest',
    address: 'str. Popa Nan 108A, Sector 3, Bucharest-030583',
    phone: '0040-21-3231431', email: 'office@romsym.ro',
    website: 'http://www.romsym.ro/',
    tier: 'silver',
    yearsActive: [2020,2021,2022,2023,2024,2025,2026], totalRevenue: 420000, roi: 2.4,
    riskLevel: 'low', engagementScore: 73, riskScore: 27,
    lastActivity: '2026-02-28', product: 'ManageEngine Suite',
    revenueByMonth: genRevenue(35000, 139), investment: 175000,
  },

  // ─── RUSSIA ───────────────────────────────────────────────────────────────
  {
    id: 'p_rus1', name: 'Syssoft LLC', country: 'Russia', countryCode: 'RU',
    coordinates: [37.55, 55.78], city: 'Moscow',
    address: 'Pohodniy proezd 4/1, Moscow Russia',
    contactPerson: 'Svyatoslav Melm', phone: '+7 (495) 646 14 71',
    email: 'info@syssoft.ru', website: 'http://www.syssoft.ru',
    tier: 'gold',
    yearsActive: [2019,2020,2021,2022,2023,2024,2025], totalRevenue: 960000, roi: 2.8,
    riskLevel: 'high', engagementScore: 45, riskScore: 72,
    lastActivity: '2024-12-15', product: 'ManageEngine Suite',
    revenueByMonth: genRevenue(80000, 140), investment: 342000,
  },
  {
    id: 'p_rus2', name: 'Systems 21 LLC', country: 'Russia', countryCode: 'RU',
    coordinates: [37.60, 55.76], city: 'Moscow',
    address: '125057 Ostryakova str. 3, Moscow Russia',
    contactPerson: 'Tatiana Nikitina', phone: '+7 (499) 649 49 52',
    email: 'info@prodmag.ru', website: 'http://www.prodmag.ru',
    tier: 'silver',
    yearsActive: [2020,2021,2022,2023,2024], totalRevenue: 480000, roi: 2.2,
    riskLevel: 'high', engagementScore: 38, riskScore: 80,
    lastActivity: '2024-09-10', product: 'ManageEngine Suite',
    revenueByMonth: genRevenue(40000, 141), investment: 218000,
  },
  {
    id: 'p_rus3', name: 'Softline Company', country: 'Russia', countryCode: 'RU',
    coordinates: [37.63, 55.72], city: 'Moscow',
    address: 'Derbenevskaja emb. 7, Building 8, Moscow Russia, 115114',
    contactPerson: 'Natalya Boldyreva', phone: '+7 (473) 250-20-23',
    email: 'info@softline.com', website: 'https://softline.com/',
    tier: 'gold',
    yearsActive: [2018,2019,2020,2021,2022,2023,2024], totalRevenue: 1200000, roi: 2.5,
    riskLevel: 'high', engagementScore: 35, riskScore: 85,
    lastActivity: '2024-06-30', product: 'Enterprise IT Suite',
    revenueByMonth: genRevenue(100000, 142), investment: 480000,
  },
  {
    id: 'p_rus4', name: 'AGNEKO Company LLC', country: 'Russia', countryCode: 'RU',
    coordinates: [37.18, 56.00], city: 'Zelenograd',
    address: '124617, Zelenograd, bld 1454, office 151, Moscow',
    contactPerson: 'Konstantin Gnedovskiy', phone: '+7 (495) 660 35 90',
    email: 'sales@agneko.com', website: 'http://agneko.com',
    tier: 'silver',
    yearsActive: [2019,2020,2021,2022,2023,2024], totalRevenue: 720000, roi: 2.4,
    riskLevel: 'high', engagementScore: 40, riskScore: 78,
    lastActivity: '2024-08-20', product: 'ManageEngine Suite',
    revenueByMonth: genRevenue(60000, 143), investment: 300000,
  },

  // ─── SERBIA ───────────────────────────────────────────────────────────────
  {
    id: 'p_srb1', name: 'Reliable Software Distributor doo', country: 'Serbia', countryCode: 'RS',
    coordinates: [20.40, 44.77], city: 'Zeleznik',
    address: 'Stjepana Supanca 18 V, 11250 Zeleznik, Serbia',
    contactPerson: 'Miodrag Simic', phone: '+381 11 2189 484',
    email: 'miodrag.simic@reliable.rs',
    tier: 'silver',
    yearsActive: [2021,2022,2023,2024,2025,2026], totalRevenue: 240000, roi: 2.2,
    riskLevel: 'low', engagementScore: 68, riskScore: 32,
    lastActivity: '2026-02-05', product: 'ManageEngine Suite',
    revenueByMonth: genRevenue(20000, 144), investment: 109000,
  },

  // ─── SLOVAKIA ─────────────────────────────────────────────────────────────
  {
    id: 'p_svk1', name: 'MWT Solutions (Slovakia)', country: 'Slovakia', countryCode: 'SK',
    coordinates: [17.11, 48.15], city: 'Bratislava',
    address: 'SKY PARK Offices, Bottova 7939/2A, 811 09 Bratislava',
    contactPerson: 'Peter Števčať',
    email: 'peter.stevcat@mwtsolutions.eu',
    website: 'https://sk.mwtsolutions.eu/',
    tier: 'silver',
    yearsActive: [2021,2022,2023,2024,2025,2026], totalRevenue: 300000, roi: 2.3,
    riskLevel: 'low', engagementScore: 70, riskScore: 30,
    lastActivity: '2026-02-18', product: 'ManageEngine Suite',
    revenueByMonth: genRevenue(25000, 145), investment: 130000,
  },

  // ─── SLOVENIA ─────────────────────────────────────────────────────────────
  {
    id: 'p_svn1', name: 'Viris d.o.o.', country: 'Slovenia', countryCode: 'SI',
    coordinates: [14.50, 46.05], city: 'Ljubljana',
    address: 'Smartinska cesta 130, SI-1000 Ljubljana',
    contactPerson: 'Milan Gabor', phone: '+386 (0)59 070 900',
    email: 'info@viris.si', website: 'http://www.viris.si',
    tier: 'silver',
    yearsActive: [2021,2022,2023,2024,2025,2026], totalRevenue: 240000, roi: 2.2,
    riskLevel: 'low', engagementScore: 69, riskScore: 31,
    lastActivity: '2026-02-10', product: 'ManageEngine Suite',
    revenueByMonth: genRevenue(20000, 146), investment: 109000,
  },

  // ─── SPAIN ────────────────────────────────────────────────────────────────
  {
    id: 'p_esp1', name: 'IREO Soluciones y Servicios, S.L.', country: 'Spain', countryCode: 'ES',
    coordinates: [-3.70, 40.42], city: 'Madrid',
    address: 'Castrobarto, 10 - planta 4, 28042 Madrid, Spain',
    phone: '+34 90 232 11 22', email: 'info@ireo.com',
    website: 'http://www.ireo.com',
    tier: 'gold',
    yearsActive: [2019,2020,2021,2022,2023,2024,2025,2026], totalRevenue: 1200000, roi: 3.1,
    riskLevel: 'low', engagementScore: 84, riskScore: 16,
    lastActivity: '2026-04-04', product: 'Enterprise IT Suite',
    revenueByMonth: genRevenue(100000, 147), investment: 387000,
  },

  // ─── SWEDEN ───────────────────────────────────────────────────────────────
  {
    id: 'p_swe1', name: 'INUIT AB', country: 'Sweden', countryCode: 'SE',
    coordinates: [18.04, 59.40], city: 'Danderyd',
    address: 'Enebybergsvagen 10 A, 182 36 Danderyd, Sweden',
    phone: '+46-(0) 8-753 0510', email: 'sales@inuit.se',
    website: 'http://www.inuit.se',
    tier: 'gold',
    yearsActive: [2019,2020,2021,2022,2023,2024,2025,2026], totalRevenue: 960000, roi: 3.0,
    riskLevel: 'low', engagementScore: 85, riskScore: 15,
    lastActivity: '2026-04-07', product: 'Enterprise IT Suite',
    revenueByMonth: genRevenue(80000, 148), investment: 320000,
  },

  // ─── SWITZERLAND ──────────────────────────────────────────────────────────
  {
    id: 'p_che1', name: 'KIDAN SA', country: 'Switzerland', countryCode: 'CH',
    coordinates: [6.40, 46.48], city: 'Allaman',
    address: 'Chemin des Grangettes 2, CH-1165 Allaman, Switzerland',
    phone: '+41 58 595 60 40', email: 'sales@kidan.com',
    website: 'https://kidan.com/',
    tier: 'gold',
    yearsActive: [2020,2021,2022,2023,2024,2025,2026], totalRevenue: 1080000, roi: 3.3,
    riskLevel: 'low', engagementScore: 88, riskScore: 12,
    lastActivity: '2026-04-05', product: 'Enterprise IT Suite',
    revenueByMonth: genRevenue(90000, 149), investment: 327000,
  },
  {
    id: 'p_che2', name: 'ITRIS ONE AG', country: 'Switzerland', countryCode: 'CH',
    coordinates: [8.37, 47.42], city: 'Spreitenbach',
    address: 'Industriestrasse 169, CH-8957 Spreitenbach, Switzerland',
    phone: '+41 56 418 64 64', email: 'one@itris.ch',
    tier: 'silver',
    yearsActive: [2022,2023,2024,2025,2026], totalRevenue: 540000, roi: 2.8,
    riskLevel: 'low', engagementScore: 79, riskScore: 21,
    lastActivity: '2026-03-20', product: 'IT Management Suite',
    revenueByMonth: genRevenue(45000, 150), investment: 192000,
  },

  // ─── TURKEY ───────────────────────────────────────────────────────────────
  {
    id: 'p_tur1', name: 'Vitel A.S.', country: 'Turkey', countryCode: 'TR',
    coordinates: [29.01, 41.01], city: 'Istanbul',
    address: '19 Mayis Mah. Inonu Cad. Yildiz Sok. STFA Bloklari B7 Blok No:17/1, 34736 Kozyatagi Kadikoy Istanbul',
    phone: '+90 216 464 50 00', email: 'info@vitel.com.tr',
    website: 'http://www.vitel.com.tr',
    tier: 'gold',
    yearsActive: [2019,2020,2021,2022,2023,2024,2025,2026], totalRevenue: 960000, roi: 2.9,
    riskLevel: 'low', engagementScore: 82, riskScore: 18,
    lastActivity: '2026-04-03', product: 'Enterprise IT Suite',
    revenueByMonth: genRevenue(80000, 151), investment: 331000,
  },

  // ─── UKRAINE ──────────────────────────────────────────────────────────────
  {
    id: 'p_ukr1', name: 'AXOFT Ukraine', country: 'Ukraine', countryCode: 'UA',
    coordinates: [30.50, 50.47], city: 'Kyiv',
    address: 'st. Saksaganskogo, 119, 6th floor, Botanic Tower, Kyiv, Ukraine, 01032',
    phone: '+380 (44) 201 03 03', email: 'axoft@axoft.ua',
    website: 'https://axoft.ua/en/',
    tier: 'silver',
    yearsActive: [2021,2022,2023,2024,2025], totalRevenue: 300000, roi: 2.1,
    riskLevel: 'high', engagementScore: 48, riskScore: 65,
    lastActivity: '2025-09-15', product: 'ManageEngine Suite',
    revenueByMonth: genRevenue(25000, 152), investment: 142000,
  },
  {
    id: 'p_ukr2', name: 'Softico LLC', country: 'Ukraine', countryCode: 'UA',
    coordinates: [30.52, 50.43], city: 'Kyiv',
    address: '03150, 86 L, Malevich Str., Kyiv, Ukraine',
    phone: '+38 (044) 383-44-10', email: 'info@softico.ua',
    website: 'http://www.softico.ua',
    tier: 'standard',
    yearsActive: [2022,2023,2024,2025], totalRevenue: 192000, roi: 1.9,
    riskLevel: 'high', engagementScore: 42, riskScore: 70,
    lastActivity: '2025-08-20', product: 'ManageEngine Suite',
    revenueByMonth: genRevenue(16000, 153), investment: 101000,
  },

  // ─── UNITED KINGDOM ───────────────────────────────────────────────────────
  {
    id: 'p_gbr1', name: 'Set3 Solutions', country: 'United Kingdom', countryCode: 'GB',
    coordinates: [-0.40, 51.00], city: 'West Grinstead',
    address: 'Unit 4, Pondtail Farm, West Grinstead, West Sussex, RH13 8LN',
    phone: '+44 (0) 1403 588898', email: 'info@set3solutions.co.uk',
    website: 'https://set3solutions.co.uk/',
    tier: 'platinum',
    yearsActive: [2018,2019,2020,2021,2022,2023,2024,2025,2026], totalRevenue: 2400000, roi: 4.0,
    riskLevel: 'low', engagementScore: 95, riskScore: 7,
    lastActivity: '2026-04-08', product: 'Enterprise IT Suite',
    revenueByMonth: genRevenue(200000, 154), investment: 600000,
  },
  {
    id: 'p_gbr2', name: 'MccormickCo Security', country: 'United Kingdom', countryCode: 'GB',
    coordinates: [-1.02, 53.43], city: 'Bircotes',
    address: '3 Brierly Road, Bircotes, Nottinghamshire. DN11 8GL',
    phone: '+44 (0) 1483 948090', email: 'hello@mccormickco.co.uk',
    website: 'https://www.mccormickcosecurity.co.uk/',
    tier: 'silver',
    yearsActive: [2022,2023,2024,2025,2026], totalRevenue: 480000, roi: 2.7,
    riskLevel: 'low', engagementScore: 76, riskScore: 24,
    lastActivity: '2026-03-25', product: 'Security Suite',
    revenueByMonth: genRevenue(40000, 155), investment: 177000,
  },
];
