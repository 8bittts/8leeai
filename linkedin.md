# LinkedIn Profile Rewrites

## LinkedIn Description

20+ year software engineer and 2x Apple Design Award winner. Software Architect, CTO, Head of Product Engineering, DevOps Engineer. Built GPU-accelerated terminals, multi-tenant data platforms, AI-native products, and production DevOps tooling. Founded companies from indie apps to crypto exchanges. Obsessed with systems, speed, and my 3 kids and (sub)agents equally.

---

## Current Roles (2022 - Present)

### Software Architect -- YEN Terminal

**Nov 2025 - Present | San Francisco Bay Area | Hybrid | Part-time**

Built and shipped YEN, a GPU-accelerated macOS terminal application delivering 60 FPS rendering with sub-millisecond I/O latency. Engineered native macOS integrations including voice-to-text dictation, a Go-based TUI configuration system, and bundled CLI tooling with 15+ shell commands.

Key Technical Achievements:

- Architected vendor-overlay build system maintaining upstream compatibility while applying cosmetic customizations
- Implemented voice dictation using Apple's Speech Recognition framework with accessibility permissions
- Built configuration TUI using Go / Bubbletea with real-time terminal reload via SIGUSR2 signaling
- Deployed automated release pipeline with code signing, Apple notarization, and Sparkle delta updates

Tech Stack: Zig, Swift / SwiftUI, Go, Metal, Apple Speech Framework, Sparkle, Xcode

**Suggested Skills:** Software Architecture . macOS Development . GPU Acceleration . Terminal Applications . Zig . Swift . Go . Metal Framework . Voice Recognition . Build Systems . Code Signing . Apple Notarization

---

### Chief Technology Officer -- AltoaX

**Jun 2025 - Present | London Area, United Kingdom | Hybrid | Contract**

Core architect for a multi-tenant data intelligence platform for institutional fund managers — full ownership from database schema to production deployment.

Architecture & Infrastructure:

- Serverless-first architecture on Vercel Edge (100+ PoPs) with Next.js 16 App Router and React 19 Server Components
- PostgreSQL 15 with 248 RLS policies across 72 tables enforcing tenant isolation at the query layer, not application layer
- Cookie-based JWT auth with automatic session refresh via proxy middleware; server-side validation against auth service on every request
- Denormalised counters via database triggers eliminating N+1 queries on dashboard loads

AI & Document Processing:

- GPT-4o integration with hierarchical knowledge retrieval: custom entries → system entries → static knowledge → analytics context → LLM fallback
- Multi-format extraction pipeline (PDF, Excel, Word, CSV, ODS, PPTX) processing 1,600+ files/sec with automatic OCR fallback via GPT-4o Vision for scanned documents
- Streaming responses with 128K token context windows and fund manager-customisable system prompts

Domain-Specific Engineering:

- Portfolio analytics API: Sharpe, Sortino, Calmar ratios, CAGR, max drawdown, volatility — TypeScript implementation with optional Python FFN service for mean-variance optimisation
- Custom HyperFormula plugin with PE/VC functions (TVPI, DPI, RVPI, MOIC, ESGSCORE) integrated into AG Grid spreadsheet interface
- Security sandbox blocking dangerous Excel functions (WEBSERVICE, IMPORTDATA, HYPERLINK) to prevent data exfiltration

Performance:

- 2.5s builds, ~150ms cold starts, <100ms TTFB, <1.5s LCP
- 30-second in-memory cache with per-user isolation and FIFO eviction
- Real-time subscriptions via Supabase Realtime with RLS-filtered payloads

Tech Stack: TypeScript (strict mode), Next.js 16, React 19, Tailwind v4, shadcn/ui, Supabase (Postgres + Auth + Storage + Realtime), OpenAI, Vercel, Bun

**Suggested Skills:** System Architecture . TypeScript . Multi-Tenant Architecture . PostgreSQL . Row Level Security (RLS) . Next.js . React Server Components . AI Integration . Document Processing . FinTech . Portfolio Analytics . Real-Time Systems . Serverless Architecture

---

### Head of Product Engineering -- DeathNote

**2024 - Present | San Francisco Bay Area | Remote | Contract**

Built and deployed DeathNote, a production digital legacy platform enabling users to compose encrypted final messages with automated proof-of-life verification and conditional delivery to designated contacts. Engineered a complete end-to-end system spanning encrypted note composition, AI-powered eulogy generation, memorial pages, and a multi-stage alerting pipeline (80-hour reminders, 24-hour warnings, final delivery).

Key Technical Achievements:

- Architected dual-layer authentication using Clerk JWT + Supabase Row Level Security with 70+ PII filtering patterns
- Implemented 3 automated cron jobs with duplicate prevention and configurable delivery windows
- Built 25 secure API endpoints with Zod validation, rate limiting, and comprehensive error handling
- Integrated Stripe subscriptions with tiered access control (free/paid intervals, contact limits)
- Created 16 transactional email templates using React Email with Resend delivery

Tech Stack: Next.js 16, React 19, TypeScript, Supabase, Clerk, Stripe, AI SDK, Bun, Tailwind CSS, Vercel

**Suggested Skills:** Next.js . React . Product Engineering . Authentication Systems . API Development . Payment Integration . Email Systems . Security . Data Privacy . End-to-End Encryption

---

### DevOps Engineer -- Particularly Good Web Diagnostics

**2022 - Present | Remote | Contract**

Built and deployed Particular.ly, a production web platform delivering 54+ network diagnostic and DevOps utilities through 55 RESTful API endpoints. Engineered tools spanning DNS analysis (propagation, DNSSEC, reverse lookups), network diagnostics (ping, traceroute, MTR, port scanning), SSL / TLS inspection, security header auditing, and IP geolocation.

Key technical achievements:

- Architected rate-limiting infrastructure using Upstash Redis with tiered throttling
- Implemented comprehensive SSRF protection and input validation across all endpoints
- Deployed on Vercel with Next.js 16, achieving sub-second response times
- Integrated AI-powered content summarization and text-to-speech via Hugging Face APIs

Tech Stack: Next.js 16, React 19, TypeScript, Bun, Tailwind CSS, Zod, Vercel, Redis

**Suggested Skills:** DevOps . Application Programming Interfaces (API) . Network Diagnostics . DNS Analysis . Security Auditing . Rate Limiting . SSRF Protection . Redis . API Design . Infrastructure as Code

---

## Historical Roles

Entries that are already strong: **YEN Terminal**, **AltoaX**, **DeathNote**, **Particularly**. Below are rewritten versions for every other entry, plus 5-10 suggested skills/keywords per role.

---

## Founding Technical Product Manager -- Casca

**Jan 2025 - Jan 2026 | San Francisco Bay Area | On-site**

Built the product management foundation for the first AI-native loan origination platform serving community banks and credit unions. Owned the full product lifecycle from discovery through delivery, establishing repeatable workflows across design, engineering, and GTM.

Key Achievements:

- Designed and shipped an AI-powered loan decisioning pipeline leveraging MCP servers, specialized agents, and localized LLMs to automate underwriting workflows
- Built a unified design system and automated documentation workflow powering internal tooling, customer release notes, and onboarding materials
- Established cross-functional alignment rituals that reduced cycle time between product discovery and engineering delivery
- Mentored early-career staff through structured one-on-ones and team presentations on product design, development methodology, and technical documentation

Tech Stack: MCP Servers, AI Agents, LLMs, Figma, Linear, Notion

**Suggested Skills:** Product Development . Product Management . Technology Management . Model Context Protocol (MCP) . AI Agents . Loan Origination . FinTech Compliance . Cross-Functional Leadership . Agile Methodology . Design Systems

---

## Chief Product Officer -- Valkyrie

**2023 - 2024 | 1 yr**

Founding product leader at a counter-disinformation AI company building NLP and Knowledge Graph solutions for the Department of Defense, Pandora, SiriusXM, Carnival Cruise Lines, and Call of Duty. Scaled the company from zero revenue to enterprise contracts and a $4.5M pre-seed raise.

Key Achievements:

- Designed the product roadmap and system architecture as the first product hire, establishing the technical vision for LLM and Knowledge Graph-powered threat detection
- Built and led a cross-functional team of scientists, designers, engineers, product marketers, and external partners from inception through paying enterprise customers
- Defined and executed the go-to-market strategy for a novel counter-disinformation platform targeting U.S. defense and intelligence community stakeholders
- Established the principle PM workflow framework adopted across all product initiatives

Tech Stack: LLMs, Knowledge Graphs, NLP, Python, Cloud Infrastructure

**Suggested Skills:** National Security . Counter-Disinformation . Knowledge Graphs . Natural Language Processing (NLP) . Large Language Models (LLMs) . Defense & Intelligence . Go-to-Market Strategy . Team Building . Pre-Seed Fundraising . Stakeholder Management

---

## VP of Product -- SupportLogic

**2023 - 2024 | 1 yr | Full-time**

Led product operations for a $9M+ ARR enterprise support intelligence platform powered by NLP, AI, and ML. Drove organizational restructuring, new product launches, and revenue growth exceeding $1M in incremental ARR.

Key Achievements:

- Redesigned the Product Development Lifecycle (PDL) to improve velocity and cross-team alignment, reducing time-to-ship for critical features
- Reorganized the product team around skill-based pods, improving ownership clarity and delivery predictability
- Launched a Product Ops function and built the roadmap across 3 revenue-generating products from discovery through GA release
- Hired and onboarded product talent to support the scaling organization
- Grew ARR by over $1M through targeted feature development and improved customer retention workflows

Tech Stack: NLP, ML, AI, Enterprise SaaS

**Suggested Skills:** Product Operations . Enterprise SaaS . Revenue Growth . NLP Platform . Machine Learning (ML) . Product-Led Growth . Team Restructuring . Annual Recurring Revenue (ARR) . Customer Retention . Product Lifecycle Management

---

## Product Leader, Engineer -- dotEARTH

**2023 | Contract**

Designed and built generative AI product experiments at an early-stage venture studio founded by Mark Pincus (CEO and Founder of Zynga). Explored GenAI applications across gaming, creator economies, and B2B/B2C verticals.

Key Achievements:

- Architected and prototyped GenAI-powered experiences using OpenAI (ChatGPT), Stable Diffusion, Midjourney, Hugging Face, and Grok across multiple product concepts
- Developed GTM strategies for AI-native products targeting creator-centric video game economies including Minecraft, Roblox, and other virtual worlds
- Conducted rapid market analysis and competitive research to evaluate GenAI product-market fit across B2B and B2C segments
- Built functional prototypes to validate hypotheses around AI-generated content, interactive experiences, and platform integrations

Tech Stack: OpenAI API, Stable Diffusion, Midjourney, Hugging Face, Python

**Suggested Skills:** Generative AI (GenAI) . Rapid Prototyping . Venture Studio . Image Generation . Prompt Engineering . Creator Economy . Gaming . B2B/B2C Strategy . Market Analysis . Competitive Research

---

## Founder, CEO -- YEN (crypto)

**2017 - 2022 | 5 yrs | Full-time**

Founded, designed, and built a cryptocurrency exchange and crypto-social network from concept through two institutional funding rounds totaling $4.1M+ from top-tier VC firms. Led a globally distributed team through product development, fundraising, and eventual wind-down.

Key Achievements:

- Raised 2 institutional rounds of venture capital ($4.1M+) through rigorous documentation, transparent investor relations, and demonstrated technical progress
- Designed and shipped the first iteration of a crypto exchange with integrated social networking features, handling real-time order books and wallet management
- Built and maintained a culture of trust, transparency, and accountability across a globally distributed team of engineers, designers, and operations staff
- Led a structured wind-down process post-venture, personally helping all staff transition to new roles

Tech Stack: Blockchain, Cryptocurrency, Node.js, React, Cloud Infrastructure

**Suggested Skills:** Cryptocurrency . Blockchain . Venture Capital Fundraising . Exchange Architecture . Distributed Teams . Startup Leadership . Investor Relations . Social Networking . Community Building . Organizational Wind-Down

---

## Founder -- Desk App

**2013 - 2018 | 5 yrs | Full-time**

Designed and shipped an award-winning minimalist macOS blogging application as a solo indie developer. Featured worldwide in the Mac App Store and recognized with 2 Apple Design Awards (2014, 2015).

Key Achievements:

- Won 2 Apple Design Awards for interface design and user experience excellence
- Achieved worldwide feature placement in the Mac App Store editorial collections
- Designed, developed, and marketed the entire product as a solo founder -- from UI/UX design through App Store optimization and customer support
- Built a sustainable indie software business with organic growth and direct customer relationships

Tech Stack: Objective-C, Cocoa, macOS SDK, Xcode

**Suggested Skills:** macOS Development . Apple Design Award . Indie Development . Objective-C . Cocoa Framework . App Store Optimization (ASO) . UI/UX Design . Solo Founder . Desktop Applications . Human Interface Guidelines

---

## Founder, CSO -- The Iron Yard

**2012 - 2016 | 4 yrs | Full-time**

Cofounded and scaled the largest software coding bootcamp in the world, growing from a single accelerator cohort to 15 campuses across 10 states before acquisition by Apollo Global Management (Fortune 500). Responsible for all campus operational systems and the first 50 hires.

Key Achievements:

- Designed and built the campus operational infrastructure supporting 15 simultaneous locations, including enrollment, scheduling, facilities, and instructor management systems
- Hired the first 50 staff members, establishing the organizational culture and operational playbook that scaled across all campuses
- Pivoted the business model from a TechStars-style accelerator to a tuition-based education platform, unlocking the growth trajectory to national scale
- Navigated the company through acquisition by Apollo Global Management, ensuring continuity for students, staff, and partners

Tech Stack: WordPress, Ruby on Rails, Cloud Infrastructure

**Suggested Skills:** EdTech . Coding Bootcamp . Campus Operations . Organizational Scaling . Talent Acquisition . Accelerator Programs . Education Technology . Multi-Campus Management . Acquisition (M&A) . Curriculum Development

---

## Founder -- Pressgram

**2012 - 2014 | 2 yrs | Full-time**

Built and launched an iOS image-sharing application through a successful $56K+ Kickstarter campaign. Grew a content community, raised an additional $300K for version 2.0, and navigated the product through market exploration.

Key Achievements:

- Crowdfunded $56K+ on Kickstarter, validating market demand and building a launch community before writing a single line of code
- Designed and shipped a native iOS photo-sharing app with custom filters, social feeds, and WordPress publishing integration
- Raised an additional $300K in follow-on funding to pursue a platform pivot and expanded feature set
- Built and managed a content creator community through organic marketing and direct engagement

Tech Stack: Objective-C, iOS SDK, WordPress API, Xcode

**Suggested Skills:** iOS Development . Crowdfunding . Kickstarter . Mobile App Design . Community Management . Content Creator Platforms . Photo Sharing . Social Media . WordPress Integration . Seed Fundraising

---

## Founder, CEO -- 8BIT

**2009 - 2013 | 4 yrs | Full-time**

Built a Top 10 "premium" WordPress theme company and a leading WordPress-centric news publication. Grew the business to a 13-person team with two revenue streams (themes + services) before both products were acquired -- themes by Automattic (WooThemes) and the content network by WPEngine.

Key Achievements:

- Designed and shipped premium WordPress themes that consistently ranked in the Top 10 marketplace listings, generating recurring revenue from thousands of customers
- Launched and scaled a WordPress news blog to a top industry publication, serving as Editor in Chief and primary writer
- Built and managed a hybrid open-source business model balancing free community themes with premium paid offerings
- Achieved two successful exits: theme business acquired by Automattic (WooThemes) and content network acquired by WPEngine

Tech Stack: PHP, WordPress, MySQL, HTML/CSS, JavaScript

**Suggested Skills:** WordPress Development . PHP . Open Source . Theme Development . Content Strategy . Editorial Leadership . Dual Acquisition . Digital Publishing . E-Commerce . MySQL

---

## Creative Director -- North Point Community Church

**2008 - 2010 | 2 yrs | Full-time**

Led digital product strategy and creative technology initiatives for one of the largest churches in the United States. Oversaw the design and development of websites, mobile applications, and live streaming infrastructure.

Key Achievements:

- Directed the development and launch of the organization's first end-to-end mobile applications for event management and community engagement
- Oversaw deployment of their first live streaming platform with real-time chat and integrated online giving -- a pioneering implementation in the nonprofit space
- Introduced Web 2.0 technologies and modern development practices to the organization, coaching senior leadership on digital strategy and best practices
- Managed the full product lifecycle for both internal tools (ChMS) and public-facing digital experiences

Tech Stack: HTML/CSS, JavaScript, Flash, WordPress, Streaming Infrastructure

**Suggested Skills:** Creative Direction . Live Streaming . Mobile App Development . Nonprofit Technology . Digital Strategy . Church Management Systems (ChMS) . Event Technology . Online Giving . Web 2.0 . Stakeholder Coaching

---

## Product Director -- Fox Corporation

**2008 - 2009 | 1 yr | Full-time**

Managed technology M&A integration and product strategy for Fox Corporation's digital business units. Led the acquisition and technical integration of Beliefnet (the largest Christian forum and social network) into the Fox Sports digital ecosystem.

Key Achievements:

- Led the end-to-end M&A process for Beliefnet, from due diligence through technical integration into Fox's global business portfolio
- Managed the migration and integration of a large-scale social networking platform (millions of users) into Fox Sports' existing infrastructure
- Coordinated cross-functional teams across engineering, legal, and business development to execute the acquisition on schedule
- Evaluated additional acquisition targets and technology partnerships for Fox's digital expansion strategy

Tech Stack: Enterprise CMS, Social Networking Platforms, Cloud Infrastructure

**Suggested Skills:** Mergers & Acquisitions (M&A) . Technology Integration . Media & Entertainment . Social Network Migration . Due Diligence . Digital Media Strategy . Platform Integration . Corporate Development . Cross-Functional Coordination . Enterprise Architecture

---

## Developer -- Dell Technologies

**2006 - 2008 | 2 yrs | Full-time**

Delivered software and content updates for Dell.com's enterprise e-commerce platform, one of the highest-traffic commercial websites in the world. Wrote production code and technical specifications spanning operations, production, legal, and compliance.

Key Achievements:

- Developed and deployed features on Dell.com's enterprise e-commerce platform serving millions of daily transactions across global markets
- Authored technical specifications for cross-departmental stakeholders including operations, production, legal, and compliance teams
- Pioneered an internal newsletter on emerging Web 2.0 technologies, evangelizing modern development practices across the organization
- Delivered production software under enterprise change management and compliance review processes

Tech Stack: HTML/CSS, JavaScript, Enterprise CMS, E-Commerce Platforms

**Suggested Skills:** Enterprise E-Commerce . Large-Scale Web Development . Technical Writing . Change Management . Compliance . Dell Technologies . Web 2.0 . Content Management . Cross-Departmental Collaboration . Production Deployment

---

## Developer -- Johnson & Johnson

**1999 - 2005 | 6 yrs | Full-time**

Started as an intern and advanced to a full development role building internal tools and consumer-facing websites for Acuvue.com, one of J&J's flagship consumer brands. Introduced interactive multimedia technologies to the organization.

Key Achievements:

- Built and maintained internal tools and external websites for the Acuvue brand, supporting marketing campaigns and e-commerce initiatives across a Fortune 50 organization
- Introduced Macromedia Flash to the organization, designing and developing an interactive prototype with motion graphics, soundtrack, and rich media elements
- Progressed from intern to full-time developer over 6 years, demonstrating consistent delivery and growing technical scope
- Delivered production web experiences under enterprise QA, accessibility, and brand compliance standards

Tech Stack: HTML/CSS, JavaScript, Macromedia Flash, ActionScript, ASP

**Suggested Skills:** Fortune 50 Enterprise . Acuvue . Consumer Brand Development . Macromedia Flash . ActionScript . Interactive Media . Motion Graphics . Healthcare Technology . Internal Tooling . Enterprise Web Development

---

## Keyword Summary (Non-Duplicative Across All Entries)

Below are all suggested keywords consolidated, excluding those already used in the YEN Terminal / AltoaX / DeathNote / Particularly entries:

| Category | Keywords |
|----------|----------|
| **AI/ML** | Knowledge Graphs, Counter-Disinformation, Prompt Engineering, Image Generation, Generative AI (GenAI), Loan Origination |
| **Product** | Product Operations, Product-Led Growth, Product Lifecycle Management, Agile Methodology, Rapid Prototyping |
| **Business** | Venture Capital Fundraising, Investor Relations, Pre-Seed Fundraising, Seed Fundraising, Dual Acquisition, Corporate Development |
| **Industry** | National Security, Defense & Intelligence, EdTech, Healthcare Technology, Media & Entertainment, Nonprofit Technology, FinTech Compliance |
| **Engineering** | Blockchain, Cryptocurrency, Exchange Architecture, iOS Development, macOS Development, Objective-C, Cocoa Framework, PHP, WordPress Development, ActionScript, Macromedia Flash |
| **Operations** | Multi-Campus Management, Organizational Scaling, Change Management, M&A, Technology Integration, Cross-Functional Leadership |
| **Growth** | Community Building, Creator Economy, Crowdfunding, Content Strategy, Digital Publishing, App Store Optimization (ASO) |
