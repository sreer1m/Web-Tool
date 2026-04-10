export interface LighthouseScore {
  performance: number;
  accessibility: number;
  bestPractices: number;
  seo: number;
  summary: string;
}

export interface AnalysisIssue {
  title: string;
  description: string;
}

export interface WebsiteAnalysisReport {
  partnerId: string;
  companyName: string;
  location: string;
  website: string;
  partnerStrengths?: string[];
  alignmentIssues: AnalysisIssue[];
  uxIssues: AnalysisIssue[];
  recommendations: { category: string; items: string[] }[];
  lighthouse?: {
    desktop: LighthouseScore;
    mobile: LighthouseScore;
  };
}

export const websiteAnalysisReports: WebsiteAnalysisReport[] = [
  // ─── 4sec d.o.o. (Albania) ────────────────────────────────────────────────
  {
    partnerId: 'p_alb1',
    companyName: '4sec d.o.o.',
    location: 'Albania, Croatia, Kosovo, Macedonia',
    website: 'https://www.4sec.hr/',
    alignmentIssues: [
      {
        title: 'Outdated ManageEngine Branding',
        description: 'The website currently uses an outdated version of the ManageEngine logo across key sections, which creates inconsistency with official branding guidelines and may reduce credibility by suggesting an inactive or outdated partnership presence.',
      },
      {
        title: 'Inactive ManageEngine Content',
        description: 'No ManageEngine-related updates or newsletters have been published since August 2022, which may signal a lack of ongoing engagement and negatively impact user trust, content relevance, and search visibility.',
      },
      {
        title: 'Newsletter Implementation Limitation',
        description: 'ManageEngine newsletters are presented as static images rather than structured content, which limits user interaction, prevents link accessibility, and reduces SEO effectiveness.',
      },
      {
        title: 'Outdated Product Representation',
        description: 'Product visuals displayed on the website do not reflect the current ManageEngine interface, which may lead to misinterpretation of product capabilities and reduce user confidence.',
      },
    ],
    uxIssues: [
      {
        title: 'Signup Functionality Issue',
        description: 'The signup process results in a 403 Forbidden error, preventing successful user registration and indicating potential backend or configuration issues that may lead to user drop-off.',
      },
      {
        title: 'Login Experience Inconsistency',
        description: 'Login error messages are displayed outside the intended login interface, which may confuse users and reduce overall usability and professionalism.',
      },
      {
        title: 'Broken Social Sharing Feature',
        description: 'The social bookmarking functionality redirects to "oracle.com", suggesting a misconfiguration that affects usability and external engagement opportunities.',
      },
      {
        title: 'Carousel Display Issue',
        description: 'The product/services carousel fails to render images correctly and displays only alternative text, which impacts visual presentation and user engagement.',
      },
      {
        title: 'Incomplete Contact Information',
        description: 'The contact page does not include essential business details such as phone number, email address, or location, which may reduce trust and hinder user communication.',
      },
    ],
    recommendations: [
      {
        category: 'ManageEngine Alignment',
        items: [
          'Update all ManageEngine branding elements to align with the latest official guidelines.',
          'Refresh website content to reflect recent ManageEngine updates, including newsletters and announcements.',
          'Transition newsletters from image format to structured HTML content to improve accessibility and SEO.',
          'Replace outdated product visuals with current interface screenshots.',
          'Strengthen partnership positioning by including certifications, case studies, and recent activities.',
        ],
      },
      {
        category: 'Website Improvements',
        items: [
          'Resolve signup errors to ensure a seamless user onboarding process.',
          'Improve login experience by aligning error messaging with standard UI practices.',
          'Remove or secure administrative access points from public visibility.',
          'Audit and correct broken links and misdirected functionalities.',
          'Restore proper carousel functionality for improved visual engagement.',
          'Provide complete and accurate contact information.',
          'Enhance overall UI/UX to meet modern usability standards.',
          'Optimize performance, particularly for mobile users.',
        ],
      },
    ],
    lighthouse: {
      desktop: {
        performance: 81, accessibility: 71, bestPractices: 92, seo: 100,
        summary: 'Solid performance at 81. SEO is fully optimized at 100. Accessibility at 71 needs improvement. Key bottlenecks: inefficient cache lifetimes (≈3,794 KiB savings), render-blocking resources (≈2,250ms delay), and unoptimized images (≈2,460 KiB). Speed Index at 5.5s is slightly slow. Addressing caching and render-blocking resources would push performance into 90+.',
      },
      mobile: {
        performance: 59, accessibility: 72, bestPractices: 65, seo: 100,
        summary: 'Mobile performance is significantly weaker at 59. FCP: 4.0s, LCP: 7.3s, Speed Index: 13.8s — all above acceptable thresholds. Heavy render-blocking resources (≈4,180ms delay) are the primary culprit. Best Practices drops to 65. Eliminating render-blocking CSS/JS, implementing caching, and optimising images are the key focus areas.',
      },
    },
  },

  // ─── Agneko AM (Armenia) ──────────────────────────────────────────────────
  {
    partnerId: 'p_arm1',
    companyName: 'Agneko AM',
    location: 'Armenia',
    website: 'http://agneko.am',
    partnerStrengths: [
      'Every ManageEngine product comes with a detailed description, system requirements, and pricing context.',
      'Navigation is structured by solution category, making it easy to explore.',
      'Dedicated Telegram community for ManageEngine users in Russia — shows real community investment.',
      'Blog content was active through April 2026.',
      'Customer testimonials on the homepage add social proof.',
      'Enterprise Disaster Recovery Assessment CTA is a smart lead-gen tactic.',
    ],
    alignmentIssues: [
      {
        title: 'Outdated ManageEngine Logo',
        description: 'The old ManageEngine logo (featuring the "Powering IT ahead" tagline) is still displayed across key pages. This creates a perception gap, particularly for first-time visitors who may cross-reference the branding against official ManageEngine channels.',
      },
      {
        title: 'No Partnership Statement on Homepage',
        description: 'The website lists ManageEngine products in detail but there is no brief, prominent statement on the homepage establishing Agneko as an official ManageEngine partner. A short trust signal such as "Official ManageEngine Partner for Armenia and the CIS region" would build credibility immediately.',
      },
    ],
    uxIssues: [],
    recommendations: [
      {
        category: 'ManageEngine Alignment',
        items: [
          'Replace the old ManageEngine logo with the current official version across all pages.',
          'Add a short, prominent partnership statement on the homepage such as "Official ManageEngine Partner".',
          'Consider adding a dedicated ManageEngine section on the homepage with a brief overview and link to the full product catalogue.',
        ],
      },
      {
        category: 'Website Improvements',
        items: [
          'The overall UX is solid. Product pages are well structured with useful technical content.',
          'Consider adding an English-language toggle to expand the site\'s reach beyond Russian and Armenian-speaking audiences.',
          'Adding a contact form or live chat widget specifically for ManageEngine enquiries could help capture leads faster.',
        ],
      },
    ],
    lighthouse: {
      desktop: {
        performance: 81, accessibility: 71, bestPractices: 92, seo: 100,
        summary: 'Desktop performance at 81 is decent. SEO is perfect at 100, Best Practices at 92 is strong. Main drag: inefficient cache lifetimes (≈3,794 KiB savings), render-blocking requests (2,250ms delay), and image delivery (≈2,460 KiB). Speed Index of 5.5s is slower than ideal. Total Blocking Time at 30ms and zero CLS show a stable experience.',
      },
      mobile: {
        performance: 59, accessibility: 72, bestPractices: 65, seo: 100,
        summary: 'Mobile drops to 59. LCP is 7.3s and Speed Index is 13.8s — well above acceptable B2B thresholds. FCP at 4.0s means users see a blank or partially loaded page for several seconds. Render-blocking requests account for 4,180ms delay on mobile. Image delivery and cache optimisation would have the biggest impact.',
      },
    },
  },

  // ─── NESTEC (Austria) ─────────────────────────────────────────────────────
  {
    partnerId: 'p_aut1',
    companyName: 'NESTEC Scharf IT-Solutions OG',
    location: 'Austria',
    website: 'http://www.nestec.at/',
    partnerStrengths: [
      'Homepage prominently features ManageEngine alongside other vendors with the current logo displayed correctly.',
      'Site was recently redesigned with a clean, modern look.',
      'Blog content published as recently as March 2026 includes a dedicated post about ManageEngine DDI Central.',
      'Co-hosted a ManageEngine IAM and Cybersecurity Seminar in Vienna in September 2025.',
      'Attended ManageEngine Partner Meeting 2026.',
      'Active LinkedIn presence regularly featuring ManageEngine content.',
      'Redirects to the ManageEngine Germany portal for regional continuity.',
    ],
    alignmentIssues: [],
    uxIssues: [
      {
        title: 'ManageEngine Products Buried Under Navigation',
        description: 'ManageEngine products are accessible via a top-level "Losungen" (Solutions) category, but a visitor has to hover through a multi-level dropdown to find specific product pages. There is no standalone "ManageEngine" tab in the primary navigation — a significant discoverability issue for their primary vendor.',
      },
    ],
    recommendations: [
      {
        category: 'ManageEngine Alignment',
        items: [
          'Maintain current standards and continue the active blog and event publishing cadence.',
          'Add a dedicated ManageEngine top-level navigation item or a prominent homepage section linking directly to ME product categories.',
          'Consider adding a customer testimonial or case study from an Austrian company who deployed ManageEngine through NESTEC.',
        ],
      },
      {
        category: 'Website Improvements',
        items: [
          'Continue publishing blog content in German to build regional SEO authority.',
          'Embed upcoming events directly on the homepage or ManageEngine product page to reduce friction.',
          'Address mobile performance: defer render-blocking requests (≈2,050ms savings), optimise images (622 KiB savings), and fix Cumulative Layout Shift of 0.271.',
        ],
      },
    ],
    lighthouse: {
      desktop: {
        performance: 52, accessibility: 82, bestPractices: 92, seo: 100,
        summary: 'Desktop performance at 52 is lower than expected for a recently redesigned site. SEO is perfect at 100. Main drag: render-blocking requests (660ms savings), font display issues (230ms), and image delivery (194 KiB savings). Total Blocking Time of 480ms is high, indicating heavy JavaScript execution. LCP of 2.2s and Speed Index of 3.5s suggest content settles slowly.',
      },
      mobile: {
        performance: 40, accessibility: 82, bestPractices: 92, seo: 100,
        summary: 'Mobile performance at 40 is a significant concern. FCP is 3.7s and LCP reaches 3.9s. Speed Index of 8.8s means the page finishes loading very slowly. CLS of 0.271 is a notable issue with content visibly jumping as the page loads. Render-blocking requests (≈2,050ms delay) are the primary culprit.',
      },
    },
  },

  // ─── Rabalon (Azerbaijan) ─────────────────────────────────────────────────
  {
    partnerId: 'p_aze1',
    companyName: 'Rabalon',
    location: 'Azerbaijan',
    website: 'https://rabalon.com/',
    alignmentIssues: [
      {
        title: 'Outdated ManageEngine Logo on Partners Page',
        description: 'The ManageEngine logo shown on the Our Tech Partners page is the old version. Rabalon co-hosted ITCON Azerbaijan 2024 and ManageEngine Meetup Azerbaijan 2025, making this inconsistency particularly jarring for event delegates who then visit the website.',
      },
      {
        title: 'ManageEngine Not Listed in Main Navigation or Homepage',
        description: 'The homepage focuses on generic service categories (Software Development, Cloud, Security, AI) with no mention of ManageEngine. The ME relationship only surfaces on the "Our Tech Partners" page among 13+ other logos — far below what the official partnership deserves.',
      },
      {
        title: 'No Dedicated ManageEngine Product Pages',
        description: 'None of the solution pages mention ManageEngine products by name. There are no pages for ServiceDesk Plus, Endpoint Central, Log360, or any other product. A prospective buyer has no information to reference and would have to go elsewhere.',
      },
      {
        title: 'Broken Case Study Links',
        description: 'The Case Studies page lists entries but "Read More" links return blank or missing content. This is especially damaging because case studies are a primary tool for building confidence with enterprise buyers in government and financial sectors.',
      },
    ],
    uxIssues: [],
    recommendations: [
      {
        category: 'ManageEngine Alignment',
        items: [
          'Update the ManageEngine logo on the Tech Partners page to the current version immediately.',
          'Add ManageEngine as a featured partner on the homepage with a brief description and link to a dedicated ME products page.',
          'Build out individual ManageEngine product pages for at least ServiceDesk Plus, Endpoint Central, and Log360.',
          'Replace the outdated ITCON 2024 banner with content about current or upcoming ManageEngine activities.',
          'Fix or remove the broken case study links.',
        ],
      },
      {
        category: 'Website Improvements',
        items: [
          'Update the homepage hero section regularly to keep content current and relevant.',
          'Fix all broken internal links and set up 404 monitoring.',
          'The mobile performance score of 30 is critical — LCP of 23.4s and TBT of 1,320ms are failures. Render-blocking requests (≈5,310ms delay) need immediate attention.',
        ],
      },
    ],
    lighthouse: {
      desktop: {
        performance: 40, accessibility: 80, bestPractices: 54, seo: 77,
        summary: 'Desktop performance at 40 is poor. Best Practices at 54 is the lowest in the network for desktop. TBT of 1,360ms indicates significant JavaScript blocking. Render-blocking requests (480ms delay), font display issues (430ms), and CLS of 0.201 all contribute. SEO at 77 and Best Practices at 54 need urgent attention.',
      },
      mobile: {
        performance: 30, accessibility: 89, bestPractices: 54, seo: 77,
        summary: 'Mobile at 30 is among the worst in the partner network. LCP of 23.4s is completely unacceptable — main content takes nearly 25 seconds to load. FCP of 9.3s means users see a blank page for almost 10 seconds. Render-blocking requests account for 5,310ms delay. Accessibility at 89 is a rare positive.',
      },
    },
  },

  // ─── Infomera Ltd. (Bulgaria) ─────────────────────────────────────────────
  {
    partnerId: 'p_bgr1',
    companyName: 'Infomera Ltd.',
    location: 'Bulgaria',
    website: 'http://infomera.bg',
    alignmentIssues: [
      {
        title: 'Outdated ManageEngine Logo Used Twice',
        description: 'The old ManageEngine logo appears twice on the Partners page, doubling the branding inconsistency. Using the wrong logo on a dedicated partners page is particularly noticeable because that is exactly where visitors go to verify official vendor relationships.',
      },
      {
        title: 'No News or Blog Activity Since January 2015',
        description: 'The News section shows a last post dated January 6, 2015 — over a decade ago. A site with no new content for ten years is essentially invisible for any competitive keyword. This is one of the most significant credibility risks across the entire portfolio reviewed.',
      },
      {
        title: 'Outdated Event Banner Still Displayed',
        description: 'A banner for ITCON23 (a 2023 conference) is still featured with no accompanying post-event content, no recap article, and no speaker highlights. Stale promotional banners for events concluded over a year ago look neglected.',
      },
      {
        title: 'ManageEngine Product Pages Lack Service Descriptions',
        description: 'While ManageEngine products are listed, the pages do not explain what Infomera specifically offers for those products in terms of implementation, support, or consulting. A generic description is not enough for a buyer to understand why they should purchase through Infomera.',
      },
    ],
    uxIssues: [
      {
        title: 'Blank Reference Pages',
        description: 'Government, Private, and Financial reference pages exist in the navigation but contain no content, creating dead ends for prospective enterprise clients.',
      },
      {
        title: 'Missing Browser Caching and Compression',
        description: 'No browser caching headers are set and GZIP/Brotli compression is missing, meaning repeat visitors always get a cold load and transfer sizes are unnecessarily large.',
      },
    ],
    recommendations: [
      {
        category: 'ManageEngine Alignment',
        items: [
          'Replace both instances of the outdated ManageEngine logo on the Partners page with the current official version.',
          'Publish at least a monthly blog post about ManageEngine products or industry trends to break the decade-long content freeze.',
          'Remove the ITCON23 banner or replace it with a post-event article and a forward-looking announcement.',
          'Expand ManageEngine product pages to include a clear description of implementation services, licensing support, or ongoing helpdesk.',
        ],
      },
      {
        category: 'Website Improvements',
        items: [
          'Populate the blank Government, Private, and Financial reference pages, or remove them from navigation entirely.',
          'Implement browser caching headers and enable GZIP/Brotli compression.',
          'Consider a full site content audit to identify and fix all stale, incomplete, or missing pages.',
        ],
      },
    ],
    lighthouse: {
      desktop: {
        performance: 86, accessibility: 94, bestPractices: 96, seo: 92,
        summary: 'Desktop performance at 86 is the strongest score for this site. Accessibility at 94 and Best Practices at 96 are strong. The main issue is the complete absence of browser caching (1,614 KiB in cacheable assets with no cache headers). Render-blocking requests add 540ms and image delivery could save 212 KiB. FCP of 0.8s and LCP of 1.6s are good results.',
      },
      mobile: {
        performance: 61, accessibility: 90, bestPractices: 92, seo: 92,
        summary: 'Mobile at 61 is moderate but well behind what the desktop score suggests. LCP of 7.2s and Speed Index of 8.1s are the main weaknesses, driven by the 265 KiB ITCON banner image. Render-blocking requests add 3,100ms. The absence of caching means all 1,284 KiB of assets are re-downloaded on every visit.',
      },
    },
  },

  // ─── Sertalink BV (Belgium) ───────────────────────────────────────────────
  {
    partnerId: 'p_bel1',
    companyName: 'Sertalink BV',
    location: 'Belgium / Luxembourg',
    website: 'https://sertalink.com',
    alignmentIssues: [
      {
        title: 'ManageEngine Hard to Find Through Navigation',
        description: 'ManageEngine products are accessible through the Products menu, but the dropdown is extremely long and visually dense, covering nearly every ManageEngine product category. There is no clear landing page explaining Sertalink\'s ManageEngine focus before the visitor is dropped into a specific product page.',
      },
      {
        title: 'Events Page Is Completely Empty',
        description: 'The dedicated Events page exists in the navigation but contains no content at all. Based on LinkedIn activity, Sertalink does post about webinars, but none of this is reflected on the website. An empty events page is worse than no events page.',
      },
      {
        title: 'Desktop Central Referenced Instead of Endpoint Central',
        description: 'The old product name "Desktop Central MSP" is still used in both the navigation and dedicated product page. ManageEngine rebranded this product to "Endpoint Central" some time ago, creating confusion for prospects searching for the current product name.',
      },
    ],
    uxIssues: [
      {
        title: 'Slow Page Load Speed',
        description: 'The site is noticeably slow to load, which is a significant problem for a B2B technology company. Slow load times increase bounce rates and directly affect search engine rankings through Core Web Vitals metrics.',
      },
    ],
    recommendations: [
      {
        category: 'ManageEngine Alignment',
        items: [
          'Create a dedicated ManageEngine landing page explaining Sertalink\'s ME partner relationship, key product categories, and a clear contact CTA.',
          'Populate the Events page with upcoming webinars and past event summaries, at minimum linking to LinkedIn posts that already exist.',
          'Update all references to Desktop Central to Endpoint Central.',
        ],
      },
      {
        category: 'Website Improvements',
        items: [
          'Invest in performance optimization: implement browser caching, compress images, and reduce render-blocking scripts.',
          'Simplify the navigation dropdown by grouping products into broad categories with a link to a full product listing page.',
          'Add a homepage section that highlights key ManageEngine solution categories.',
        ],
      },
    ],
  },

  // ─── Channel IT Ltd (Cyprus / Greece) ────────────────────────────────────
  {
    partnerId: 'p_cyp1',
    companyName: 'Channel IT Ltd',
    location: 'Cyprus / Greece',
    website: 'https://channel-it.com',
    partnerStrengths: [
      'Clearly positions itself as a ManageEngine Authorized VAD Partner (visible in browser tab title).',
      'Uses the current ManageEngine logo consistently and correctly across the site.',
      'Offers comprehensive product coverage with dedicated pages for IAM, ITOM, UEM, ITSM, and Security solutions.',
      'Content is up-to-date, with latest updates confirmed as of January 2026.',
      'References the InfoCom Security Conference 2026, demonstrating active industry engagement.',
      'Strong credibility signals: Gartner PAM recognition, Forrester research, NIS2 and DORA compliance coverage.',
      'Customer testimonials from well-known organizations: ERGO Hellas, Olympia Electronics, Astrobank, Island Oil.',
      'Features a "Free IT Tools" section, effectively attracting first-time visitors.',
    ],
    alignmentIssues: [],
    uxIssues: [
      {
        title: 'Critical Mobile and Desktop Performance Issues',
        description: 'Despite being the strongest site for content, channel-it.com has a serious performance problem. On mobile, LCP is 30.2s and Speed Index is 27.9s, driven by 11,620ms of render-blocking requests from 30+ CSS/JS files. Page weight exceeds 5,700 KiB. On desktop, performance scores 38 with TBT of 460ms. Over 2,400 KiB of unused CSS and JavaScript are loaded unnecessarily.',
      },
      {
        title: 'Robots.txt Validation Error Affecting SEO Crawlability',
        description: 'The robots.txt file is invalid and could not be successfully downloaded by Lighthouse. Search engine crawlers may encounter errors when indexing, potentially limiting visibility for a content-rich site that depends heavily on organic discovery of ManageEngine product pages.',
      },
    ],
    recommendations: [
      {
        category: 'ManageEngine Alignment',
        items: [
          'This site sets the benchmark for the partner network for content and alignment. Continue the active event and content publishing cadence.',
          'Consider adding a dedicated partner enablement or reseller section to attract sub-partners across Greece and Cyprus.',
        ],
      },
      {
        category: 'Website Improvements',
        items: [
          'Performance is the most urgent improvement. Consolidate render-blocking CSS from the Porto theme, defer non-critical scripts, and remove the 1,445 KiB of unused CSS and 954 KiB of unused JavaScript.',
          'Fix the robots.txt validation error so search engine crawlers can properly index all product and compliance pages.',
          'Add descriptive anchor text to the 18 non-descriptive links flagged in the accessibility audit.',
        ],
      },
    ],
    lighthouse: {
      desktop: {
        performance: 38, accessibility: 95, bestPractices: 96, seo: 85,
        summary: 'Desktop performance at 38 is the lowest in the partner network. Accessibility at 95 and Best Practices at 96 are excellent. Render-blocking requests cause 3,530ms delay from 30+ CSS/JS files. Page loads 5,707 KiB total. TBT of 460ms, server response of 970ms, and font display blocking (2,110ms) are the main issues. SEO at 85 impacted by robots.txt error.',
      },
      mobile: {
        performance: 47, accessibility: 80, bestPractices: 96, seo: 85,
        summary: 'Mobile at 47 is critical. LCP of 30.2s and Speed Index of 27.9s mean users wait nearly 30 seconds for the page to complete loading. Render-blocking requests cause 11,620ms delay from Porto theme\'s 30+ synchronously loaded CSS files. DOM size of 2,316 elements significantly increases layout reflow time. Font display adds 2,120ms.',
      },
    },
  },

  // ─── MWT Solutions (Czech Republic / multi-country) ───────────────────────
  {
    partnerId: 'p_cze1',
    companyName: 'MWT Solutions S.A.',
    location: 'Czech Republic / Hungary / Latvia / Estonia / Poland / Slovakia / Romania',
    website: 'https://mwtsolutions.eu',
    partnerStrengths: [
      'Recognized as one of the most operationally active ManageEngine partners in Europe.',
      'Brand identity fully centered around ManageEngine with 14+ years as exclusive distributor.',
      'Geographic coverage across Poland, Czech Republic, Slovakia, Hungary, Romania, and Baltic countries.',
      'Maintains localized websites in Polish and Czech with deep product content.',
      'Strong market traction: 500+ implementations, 2,000+ customers.',
      'High-profile client logos including Nokia, PKO Ubezpieczenia, Bonprix, SWPS University.',
      'Actively runs ManageEngine RoadShow events across multiple cities.',
      'Operates a dedicated demo portal (demomwtsolutions.eu).',
      'Publishes comparison articles on ManageEngine AI tools, showing thought leadership.',
      'Participates in ManageEngine Partner Summits.',
    ],
    alignmentIssues: [],
    uxIssues: [
      {
        title: 'Website Requires Language Selection to Access Content',
        description: 'Visiting mwtsolutions.eu redirects to a language selection or returns a 415 error, meaning international visitors encounter a friction point before viewing any content. The regional sub-sites work individually but the root domain does not redirect smoothly to a default language version.',
      },
      {
        title: 'Core Web Vitals Assessment Failed',
        description: 'The Lighthouse audit shows a Core Web Vitals assessment failure on both mobile and desktop. LCP of 3.2s (mobile) and CLS of 0.14 (mobile) and 0.17 (desktop) are above passing thresholds. TTFB is elevated at 1.9s on mobile. A failed Core Web Vitals assessment can directly impact Google search rankings.',
      },
    ],
    recommendations: [
      {
        category: 'ManageEngine Alignment',
        items: [
          'Continue the current excellent content and event strategy. This is a model partner operation.',
          'Consider adding an English-language version for international visibility and cross-border enquiries.',
        ],
      },
      {
        category: 'Website Improvements',
        items: [
          'Fix the root domain redirect so visitors land on usable content rather than a language selection screen or error.',
          'Address Core Web Vitals failures: reduce CLS by setting explicit dimensions on images and dynamic content, improve TTFB through server-side caching or a CDN.',
          'The demo portal at demomwtsolutions.eu is an excellent asset. Link it more prominently from the main site navigation.',
        ],
      },
    ],
    lighthouse: {
      desktop: {
        performance: 76, accessibility: 89, bestPractices: 77, seo: 85,
        summary: 'Desktop at 76 is reasonable but Core Web Vitals failed due to CLS of 0.17 and LCP of 2.6s. TTFB of 1.8s suggests server or hosting could be improved. FCP of 0.9s and TBT of 110ms are positive. Fixing layout shift issues and improving server response time would pass Core Web Vitals.',
      },
      mobile: {
        performance: 47, accessibility: 91, bestPractices: 77, seo: 85,
        summary: 'Mobile at 47 with failed Core Web Vitals. LCP of 9.8s and Speed Index of 12.9s are well above thresholds. FCP of 4.1s means visible content is significantly delayed. Render-blocking requests cause ≈3,750ms delay and cache inefficiency could save 8,175 KiB. TTFB of 1.9s on mobile compounds the slow start.',
      },
    },
  },

  // ─── Dediko A/S (Denmark) ─────────────────────────────────────────────────
  {
    partnerId: 'p_dnk1',
    companyName: 'Dediko A/S',
    location: 'Denmark',
    website: 'https://dediko.dk',
    alignmentIssues: [
      {
        title: 'Outdated ManageEngine Logo on Homepage and Vendors Page',
        description: 'The old ManageEngine logo is still in use on the homepage vendor section and on the Vendors page. This is especially noticeable because Dediko runs monthly ManageEngine webinars and produces ManageEngine CIS 18 compliance guides — the branding inconsistency creates a disconnect between their content quality and visual presentation.',
      },
      {
        title: 'Desktop Central Name Still Used in Product Content',
        description: 'The Vendors page and associated product references still refer to "Desktop Central" rather than the current name "Endpoint Central". This risks confusing prospects searching specifically for Endpoint Central and appearing out of date to existing customers.',
      },
    ],
    uxIssues: [
      {
        title: 'Limited English Content for International Visitors',
        description: 'The English version is accessible via a language toggle, but English content is significantly thinner than the Danish version. Key product pages, webinar archives, and blog posts are only available in Danish, limiting discovery from outside Denmark.',
      },
      {
        title: 'Very Slow Mobile Load',
        description: 'Mobile performance score of 45 with LCP of 26.0s is among the highest LCP times in the entire partner network. Render-blocking requests (4,160ms) and font display issues (1,860ms) are the primary causes. Critical for active webinars where mobile users need to act quickly.',
      },
    ],
    recommendations: [
      {
        category: 'ManageEngine Alignment',
        items: [
          'Update all ManageEngine logo instances to the current version on the homepage and Vendors page.',
          'Replace all references to Desktop Central with Endpoint Central across all product content.',
          'Promote the ManageEngine CIS 18 compliance guide more visibly as a download CTA.',
        ],
      },
      {
        category: 'Website Improvements',
        items: [
          'Expand English-language content to match the Danish version, particularly for product pages and webinar content.',
          'The "Meet the ManageEngine team" section is a strong trust signal — make it visible earlier in the ME product journey.',
        ],
      },
    ],
    lighthouse: {
      desktop: {
        performance: 52, accessibility: 73, bestPractices: 96, seo: 92,
        summary: 'Desktop at 52 is below average. Best Practices at 96 and SEO at 92 are solid. Main issues: inefficient cache lifetimes (442 KiB savings), font display blocking (1,610ms), render-blocking requests (2,190ms delay), and LCP of 4.5s. TBT of 370ms indicates JavaScript execution load. Accessibility at 73 should be reviewed for contrast, ARIA labelling, and heading structure.',
      },
      mobile: {
        performance: 45, accessibility: 73, bestPractices: 96, seo: 92,
        summary: 'Mobile at 45 with LCP of 26.0s is one of the longest in the partner network. FCP of 3.6s and Speed Index of 9.6s are significantly above thresholds. Render-blocking requests (4,160ms) and font display issues (1,860ms) are the primary causes. Cache inefficiency adds 439 KiB in avoidable downloads. Accessibility of 73 mirrors the desktop finding.',
      },
    },
  },

  // ─── IronNet / Advania Finland ────────────────────────────────────────────
  {
    partnerId: 'p_fin1',
    companyName: 'IronNet Oy (now Advania Finland)',
    location: 'Finland',
    website: 'https://advania.fi',
    alignmentIssues: [
      {
        title: 'Partner Directory Identity Mismatch',
        description: 'The ManageEngine partner directory lists "IronNet Oy" as the Finland partner, but IronNet Oy was legally merged into Advania Finland Oy on 31 December 2022. The domain ironnet.fi now redirects to advania.fi. Visitors following the partner directory link land on Advania Finland with no confirmation they have reached the right company.',
      },
      {
        title: 'No Dedicated ManageEngine Content on Advania Finland Site',
        description: 'While ManageEngine is listed with a short description, there are no dedicated ManageEngine product pages, no ManageEngine case studies, and no ManageEngine-specific CTAs anywhere on the Advania Finland website.',
      },
      {
        title: 'ManageEngine Engagement Not Visible in Recent Content',
        description: 'Advania Finland\'s blog and news sections show no ManageEngine-related content. Recent articles focus on Microsoft 365, managed IT services, and general company news. There is no evidence of ManageEngine events, webinars, or product campaigns since the IronNet merger.',
      },
    ],
    uxIssues: [],
    recommendations: [
      {
        category: 'ManageEngine Alignment',
        items: [
          'Update the ManageEngine partner directory entry from IronNet to Advania Finland with the correct URL and contact details.',
          'Create a dedicated ManageEngine landing page on advania.fi covering key product families, partnership history, and a contact CTA.',
          'Publish at least one ManageEngine-focused blog post or case study to demonstrate the partnership is active under the Advania Finland brand.',
        ],
      },
      {
        category: 'Website Improvements',
        items: [
          'Ensure the ironnet.fi redirect leads directly to the Advania Finland ManageEngine partner page rather than the generic homepage.',
          'If the ManageEngine relationship is actively maintained, consider adding Advania Finland to ManageEngine event pages for Finland.',
        ],
      },
    ],
  },

  // ─── SYNTAX LLC (Georgia) ─────────────────────────────────────────────────
  {
    partnerId: 'p_geo1',
    companyName: 'SYNTAX LLC',
    location: 'Georgia',
    website: 'https://syntax.ge/en/main/',
    partnerStrengths: [
      'Uses the current ManageEngine logo correctly.',
      'Has product pages with industry-specific regional content.',
      'Clean site structure and reasonable content quality.',
    ],
    alignmentIssues: [
      {
        title: 'Very Low Digital Visibility and Discoverability',
        description: 'SYNTAX LLC\'s website is not appearing meaningfully in search results for ManageEngine-related queries in Georgia. The site has little to no SEO presence, and without content investment such as blog posts, case studies, or event pages, the company is essentially invisible to anyone searching for ManageEngine solutions in the Georgian market.',
      },
    ],
    uxIssues: [],
    recommendations: [
      {
        category: 'ManageEngine Alignment',
        items: [
          'Invest in basic SEO: add keyword-rich meta titles and descriptions, create product-specific pages for key ME solutions, and ensure the site is indexable by Google.',
          'Establish a LinkedIn company page and post about ManageEngine products at least bi-monthly.',
          'Publish at least one ManageEngine event or webinar per quarter to demonstrate active partnership engagement.',
        ],
      },
      {
        category: 'Website Improvements',
        items: [
          'Add a clear contact section with phone, email, and address.',
          'Link the site to the official ManageEngine Georgia partner listing and make the partnership visually prominent on the homepage.',
        ],
      },
    ],
    lighthouse: {
      desktop: {
        performance: 80, accessibility: 83, bestPractices: 77, seo: 77,
        summary: 'Desktop at 80 is the best technical result for SYNTAX LLC. Best Practices at 77 and SEO at 77 are below average. Main issues: very large cache inefficiency (25,624 KiB — assets not being cached at all), render-blocking requests (2,480ms delay), and image delivery savings of 1,251 KiB. Speed Index of 8.3s is high for an 80 performance score.',
      },
      mobile: {
        performance: 56, accessibility: 83, bestPractices: 77, seo: 77,
        summary: 'Mobile at 56 with LCP of 4.1s and Speed Index of 22.3s indicates the page takes very long to become fully visual. Render-blocking requests account for 3,750ms delay and the site has no caching configured (8,175 KiB re-downloaded on every visit). The SEO score of 77 compounds the already-identified issue of low search visibility.',
      },
    },
  },

  // ─── MicroNova AG (Germany) ───────────────────────────────────────────────
  {
    partnerId: 'p_deu1',
    companyName: 'MicroNova AG',
    location: 'Germany',
    website: 'https://manageengine.de',
    partnerStrengths: [
      'Operates manageengine.de — the official ManageEngine Germany domain — making it the gold standard for regional partner sites.',
      'Domain name provides strong SEO authority and immediate trust.',
      'Features dedicated product pages with embedded demo links and clear solution breakdowns.',
      'Includes regional customer testimonials, strengthening local credibility.',
      'Maintains actively updated news and events sections.',
      'Strong localisation for Germany and the DACH region.',
      'Uses both LinkedIn and XING for professional outreach (aligned with regional preferences).',
      'Consistent participation in events.',
      'Website is fast, well-structured, and user-friendly.',
      'Clearly positions ManageEngine as the core business focus, not a secondary offering.',
    ],
    alignmentIssues: [],
    uxIssues: [],
    recommendations: [
      {
        category: 'ManageEngine Alignment',
        items: [
          'This is the flagship regional site in the European network. Maintain current standards.',
          'Continue publishing German-language customer case studies and technical guides to build local SEO authority.',
          'Consider adding a formal certification or competency badge display to make the partnership tier more visible to enterprise buyers.',
        ],
      },
      {
        category: 'Website Improvements',
        items: [
          'Ensure product demo links and the embedded demo environment remain current with the latest ManageEngine UI.',
          'Continue the XING presence alongside LinkedIn as it remains commercially relevant in the DACH market.',
        ],
      },
    ],
    lighthouse: {
      desktop: {
        performance: 81, accessibility: 84, bestPractices: 96, seo: 92,
        summary: 'Desktop at 81 is strong for the flagship site. Best Practices at 96 and SEO at 92 are excellent. The website is fast, well-structured, and user-friendly. This is the benchmark performance standard for the European partner network.',
      },
      mobile: {
        performance: 72, accessibility: 82, bestPractices: 96, seo: 92,
        summary: 'Mobile performance at 72 is among the best in the network. The site maintains good load times and strong usability across devices. Minor improvements to render-blocking resources could push the score higher, but overall mobile experience is solid.',
      },
    },
  },
];
