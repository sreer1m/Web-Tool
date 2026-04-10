import { EventLearning } from './types';

// Event learnings now reference new 2026 event IDs
export const eventLearnings: EventLearning[] = [
  {
    id: 'el1', eventId: 'e_w1',
    whatWorked: ['Hands-on product demos drove high post-event trial requests', 'Local ITSM community attendance was strong', 'Partner-hosted venue reduced logistics cost'],
    whatDidntWork: ['Limited seating created waitlist issues', 'No live streaming for remote attendees'],
    notes: 'ServiceDesk Plus workshops in London consistently generate quality ITSM leads. Morning slots see better attendance than afternoon.',
    rating: 4,
    similarEventIds: ['e_w4', 'e_s8'],
  },
  {
    id: 'el2', eventId: 'e_c5',
    whatWorked: ['Two-day format allowed deeper product exploration', 'Local language sessions had 90%+ satisfaction', 'Executive roundtable generated high-value contacts'],
    whatDidntWork: ['Travel logistics for day-2 attendees reduced retention', 'English track had lower attendance than Turkish'],
    notes: 'UserConf Türkiye is a flagship retention event. Istanbul timing in April avoids summer travel conflicts.',
    rating: 5,
    similarEventIds: ['e_c10', 'e_x6'],
  },
  {
    id: 'el3', eventId: 'e_x1',
    whatWorked: ['17,000+ attendee footfall provided exceptional brand exposure', 'Keynote slot drove significant social media impressions', 'Live product demonstration attracted enterprise prospects'],
    whatDidntWork: ['High noise level at exhibition floor made demos difficult', 'Lead capture required more staff than allocated'],
    notes: 'Tech Show London is one of the best brand-awareness events in the calendar. ROI is stronger for awareness than direct conversion.',
    rating: 4,
    similarEventIds: ['e_x3', 'e_x4'],
  },
  {
    id: 'el4', eventId: 'e_x2',
    whatWorked: ['Platinum partner status gave exclusive floor positioning', 'Cybersecurity audience alignment with Log360 and PAM products', '20,000+ attendees from 65+ countries'],
    whatDidntWork: ['French-language barrier limited engagement from UK/US attendees', 'Travel cost from London office was high'],
    notes: 'InCyber Forum is strategically important for positioning ManageEngine in the European cybersecurity space. Recommend maintaining Platinum status.',
    rating: 5,
    similarEventIds: ['e_x4', 'e_x7'],
  },
];
