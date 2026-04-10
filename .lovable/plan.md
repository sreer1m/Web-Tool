

# Partner & Event Intelligence Platform – Europe Edition

## Overview
A comprehensive internal SaaS tool for marketing and leadership teams to manage partners, events, campaigns, and regional intelligence across Europe. Built with React + Vite + Tailwind CSS + Recharts + react-simple-maps (lightweight, no API key needed).

## Architecture
- **Sidebar layout** with collapsible navigation (Dashboard, Map, Partners, Events, Campaigns, Intelligence, Settings)
- **Fake but realistic data layer** with 25 partners, 40+ events across Germany, France, UK, Spain, Italy (2024–2026)
- **Clean SaaS design** — Stripe/Linear inspired, light theme, rounded cards, subtle shadows

## Pages

### 1. Dashboard (Home)
- KPI cards: Total Revenue, Active Partners, Events This Year, Avg Conversion Rate
- Mini Europe heatmap showing revenue density
- Revenue trend line chart (monthly, last 12 months)
- Top 5 partners table
- Alerts panel (risk warnings, low conversion alerts)

### 2. Europe Map
- Interactive SVG map via react-simple-maps focused on Europe
- Color-coded pins: blue for partners, orange for events
- **Filter bar**: Year multi-select (2024/2025/2026), Type (Partners/Events), Country, Product
- **Heatmap toggle**: Revenue / Event Impact / Demand
- **Click partner pin** → right slide-out panel with partner details (name, country, revenue, events, engagement/risk scores)
- **Click event pin** → slide-out with event details (leads, conversion, revenue impact)
- Hover tooltips with quick stats

### 3. Partners (List + Detail)
- **List view**: Sortable/filterable table with name, country, years active, revenue, ROI, risk level, last activity. Toggle between table and card view.
- **Detail page** (`/partners/:id`):
  - Overview section (region, tenure, totals)
  - Revenue trend line chart + ROI bar chart
  - Events conducted by this partner with metrics
  - Risk & engagement scores with alert badges

### 4. Events
- **Event list** with create dialog (name, location, year, budget)
- **Event dashboard**: Registration → Attendance → Conversion funnel chart, ROI per event
- **Benchmarking**: Compare events by region/year/type using bar charts
- Event detail with tracked metrics (registrations, attendance, leads, revenue)

### 5. Campaigns & Analytics
- Channel breakdown (Email/Ads/Social) with metrics cards
- Campaign performance bar charts (registrations, conversions, ROI)
- Campaign DNA section: patterns of top campaigns
- A/B comparison tool: select two campaigns, side-by-side metric comparison

### 6. Intelligence
- **Partner Coverage Gap Map**: Europe map highlighting uncovered high-demand regions
- **Event Impact Map**: Revenue impact overlay by region
- **Silent Market Detector**: High traffic / low conversion regions highlighted
- **Partner ROI Tracker**: Investment vs revenue scatter/bar chart
- **Churn Predictor**: List of at-risk partners with declining metrics
- **"Where Next" Engine**: AI-style recommendation cards ("Run events in Germany", "Invest in Spain partners")

### 7. Settings
- Simple placeholder with profile and notification preferences

## Data
- `src/data/` folder with typed mock data: partners, events, campaigns, countries, metrics
- All interconnected (events link to partners, campaigns link to events)
- Realistic European company names, revenue figures, conversion rates

## Key Libraries
- `react-simple-maps` for Europe SVG map
- `recharts` for all charts (line, bar, funnel, heatmap grid)
- `shadcn/ui` components throughout
- `react-router-dom` for routing

