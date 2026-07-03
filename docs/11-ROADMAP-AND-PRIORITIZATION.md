# 11. 12-Month Roadmap & Prioritization

## Design Philosophy

The roadmap follows a **"Crawl, Walk, Run"** model: Phase 1 delivers a functional MVP that partners can use immediately; Phase 2 adds the engagement and intelligence layer; Phase 3 adds the advanced features that create competitive moats. Each phase delivers standalone value - the platform is never in an unusable state.

**WHY phased**: Big-bang launches fail. Partners need a functional platform now, not a perfect platform in 12 months. The crawl-walk-run approach also allows for data-driven iteration: Phase 1 data informs Phase 2 priorities, and Phase 2 data informs Phase 3.

---

## Phase 1: MVP (Months 1-4)

### Goal: "Partners can learn, certify, and register deals"

### Deliverables

| Category | Deliverable | Priority | Rationale |
|---|---|---|---|
| **Platform** | LMS platform selection and setup (e.g., Docebo, Skilljar, or custom) | P0 | Foundation for everything else |
| **Platform** | SSO integration with Allbound | P0 | Eliminates friction; partners access from existing portal |
| **Platform** | User sync (Allbound → Mend Learn) | P0 | Enables role-based and tier-based experiences |
| **Platform** | Responsive web design (desktop + mobile) | P0 | Partners consume content on multiple devices |
| **Content** | Level 1 Foundation Track (4 modules) | P0 | Every partner starts here; gates all other content |
| **Content** | SCA Product Track (8 modules) | P0 | Mend.io's flagship product; most partner deals start with SCA |
| **Content** | SAST Product Track (8 modules) | P0 | Second most important product for partner pipeline |
| **Content** | Sales Track (9 modules) | P0 | Sales reps need to start selling immediately |
| **Content** | 5 guided hands-on labs | P1 | Labs are the #1 learning effectiveness driver |
| **Content** | Competitive battlecards (3: vs. Snyk, Veracode, Checkmarx) | P0 | Most-used partner resource; needed from day one |
| **Content** | Partner Sales Playbook | P0 | End-to-end sales process guide |
| **Certification** | Associate certification exam | P0 | First certification milestone; drives partner activation |
| **Certification** | Credly badge integration | P0 | Digital credentials for LinkedIn sharing |
| **Gamification** | XP system (basic point tracking) | P1 | Engagement foundation; encourages return visits |
| **Gamification** | Achievement badges (first 10) | P1 | Visual motivation and progress tracking |
| **AI** | Intelligent search | P1 | Partners need to find content quickly |
| **AI** | Basic course recommendations | P1 | Reduces browsing friction |
| **Integration** | Certification status sync to Allbound | P0 | Channel managers need cert visibility |
| **Integration** | Basic progress tracking in Allbound | P1 | Manager visibility into team progress |
| **Analytics** | MAL, completion rate, certification rate dashboards | P1 | Must measure from day one |

### MVP Exit Criteria

- [ ] Partners can SSO from Allbound into Mend Learn
- [ ] Partners can complete Level 1 Foundation Track
- [ ] Partners can complete SCA, SAST, or Sales tracks
- [ ] Partners can complete at least 3 hands-on labs
- [ ] Partners can take and pass the Associate certification exam
- [ ] Badges appear on Credly and can be shared on LinkedIn
- [ ] Certification status is visible in Allbound partner profiles
- [ ] Basic analytics dashboard shows MAL, completion, and cert rates
- [ ] Platform works on desktop and mobile browsers
- [ ] Search finds content across all modules and resources

### MVP Team Requirements

| Role | FTE | Responsibility |
|---|---|---|
| Product Manager | 1 | Platform strategy, vendor management, roadmap |
| Learning Experience Designer | 1 | Course design, content architecture, assessment design |
| Content Developer | 2 | Course creation, video production, lab development |
| Full-Stack Developer | 1 | Platform customization, integrations, analytics |
| Partner Enablement Manager | 0.5 | Partner feedback, launch communications, adoption |

### Estimated Timeline

| Month | Focus |
|---|---|
| Month 1 | Platform selection, SSO setup, IA finalization, content planning |
| Month 2 | Foundation Track + SCA Track development, lab environment setup |
| Month 3 | SAST Track + Sales Track, Associate exam development, Allbound integration |
| Month 4 | Testing, soft launch (10 pilot partners), iteration, general availability |

---

## Phase 2: Engagement & Intelligence (Months 5-8)

### Goal: "Partners are engaged, motivated, and AI-assisted"

### Deliverables

| Category | Deliverable | Priority | Rationale |
|---|---|---|---|
| **Content** | Secrets Detection Track | P1 | Expanding product coverage |
| **Content** | Container Security Track | P1 | Expanding product coverage |
| **Content** | Supply Chain Security Track | P1 | High market demand; competitive positioning |
| **Content** | Technical/SE Track (8 modules) | P0 | SEs need demo and POC readiness |
| **Content** | Developer Track (7 modules) | P1 | Tech partner and GSI developer enablement |
| **Content** | 10 additional hands-on labs (15 total) | P0 | Lab catalog needs critical mass |
| **Content** | Demo recordings library (5 demos) | P1 | SEs need demo templates to practice |
| **Content** | 3 customer scenario simulations | P1 | Experiential learning for consultants |
| **Certification** | Professional certification exam | P0 | Second-tier cert; validates deeper competency |
| **Certification** | Partner Sales Specialist exam | P0 | Sales-specific credential with deal incentives |
| **Gamification** | Leaderboards (individual + team) | P0 | Competitive motivation driver |
| **Gamification** | Learning streaks | P1 | Daily engagement habit formation |
| **Gamification** | First quarterly challenge | P0 | Time-limited engagement event |
| **Gamification** | Partner tier integration (learning → tier) | P0 | Connects learning to business benefits |
| **AI** | Knowledge chatbot ("Ask Mend") | P0 | Reduces support burden; improves content discovery |
| **AI** | Certification prep (adaptive practice) | P1 | Increases pass rates; reduces study time |
| **AI** | Content summaries | P1 | Quick-consumption layer for time-pressed partners |
| **AI** | AI sales roleplay (basic) | P1 | Highest-impact AI feature for sales enablement |
| **Integration** | Deal registration incentives (cert-linked) | P0 | Directly ties learning to revenue |
| **Integration** | Manager dashboard in Allbound | P1 | Partner managers need team visibility |
| **Integration** | Badge sync to Allbound | P1 | Achievement visibility in partner portal |
| **Integration** | Leaderboard widget in Allbound | P1 | Competitive visibility in partner portal |
| **Analytics** | Revenue per certified partner dashboard | P0 | ROI measurement for executive buy-in |
| **Analytics** | Content performance analytics | P1 | Data-driven content improvement |

### Phase 2 Team Additions

| Role | Additional FTE | Responsibility |
|---|---|---|
| AI/ML Engineer | 1 | RAG pipeline, chatbot, recommendation engine, roleplay |
| Content Developer | 1 (total: 3) | Expanded content catalog |
| Lab Developer | 1 | Lab environment management and creation |

---

## Phase 3: Advanced & Scale (Months 9-12)

### Goal: "Partners have a world-class, AI-powered enablement experience"

### Deliverables

| Category | Deliverable | Priority | Rationale |
|---|---|---|---|
| **Content** | Platform Unified Track (6 modules) | P1 | Multi-product expertise for enterprise deals |
| **Content** | Executive/Practice Leader Track | P1 | Engages partner decision-makers |
| **Content** | MSSP Operations Track | P1 | MSSP-specific enablement |
| **Content** | Expert Tracks (Enterprise Architecture, CI/CD, API) | P1 | Advanced content for senior practitioners |
| **Content** | 10 additional labs (25 total) | P1 | Comprehensive lab catalog |
| **Content** | Challenge labs (open-ended) | P1 | Skill validation beyond guided exercises |
| **Content** | Microlearning series | P2 | Mobile-first, bite-sized content |
| **Certification** | Expert certification exam | P0 | Top-tier general certification |
| **Certification** | Partner Technical Specialist exam | P0 | Premier SE credential |
| **Certification** | Master Architect program (application process) | P1 | Elite capstone certification |
| **Certification** | CEU renewal system | P1 | Ongoing professional development |
| **Gamification** | Full quarterly challenge program | P1 | Ongoing engagement events |
| **Gamification** | Partner rankings / scorecard | P1 | Organizational competition |
| **Gamification** | Rewards program (swag, events, etc.) | P1 | Physical and business rewards |
| **AI** | Personal learning coach ("Mend Mentor") | P1 | Adaptive, personalized guidance |
| **AI** | Advanced AI sales roleplay (6 personas) | P0 | Full sales roleplay with evaluation |
| **AI** | Lab assistant | P1 | Reduces lab abandonment |
| **Integration** | Automated tier evaluation | P1 | Transparent, objective tier management |
| **Integration** | Analytics sync to data warehouse | P1 | Unified partner analytics |
| **Integration** | Community forums | P1 | Peer learning and knowledge sharing |
| **Integration** | Peer mentoring program | P2 | Community-building and retention |
| **Analytics** | Full attribution model | P0 | Revenue attribution to learning |
| **Analytics** | Executive ROI dashboard | P0 | Investment justification |

### Phase 3 Team Additions

| Role | Additional FTE | Responsibility |
|---|---|---|
| Community Manager | 1 | Forums, mentoring, events, challenges |
| Data Analyst | 1 | Attribution modeling, executive reporting |

---

## Quick Wins (Can Be Delivered Independently)

These items deliver immediate value with minimal effort and can be shipped at any time:

| Quick Win | Effort | Impact | Timeline |
|---|---|---|---|
| Competitive battlecards (PDF) | 2-3 days each | High | Immediately |
| Customer discovery questions cheat sheet | 1 day | High | Immediately |
| Mend.io elevator pitch template | 1 day | Medium | Immediately |
| POC success criteria template | 1 day | High | Immediately |
| Pricing calculator guide | 2 days | Medium | Week 1 |
| "Mend.io in 15 Minutes" overview video | 3 days | Very High | Week 1-2 |
| Partner welcome email sequence (5 emails) | 3 days | High | Week 1-2 |
| Monthly partner newsletter with learning tips | 1 day/month | Medium | Ongoing |
| Integration compatibility matrix | 1 day | Medium | Week 2 |
| FAQ document for partner sales reps | 2 days | Medium | Week 2 |

**WHY quick wins**: These can be produced before the platform is built and distributed via email, Allbound, or a simple landing page. They demonstrate momentum and provide immediate value while the platform is in development.

---

## Long-Term Vision (Year 2+)

| Initiative | Description | Impact |
|---|---|---|
| **Multi-language support** | Content in Spanish, French, German, Japanese, Portuguese | Global partner scale |
| **Customer education portal** | Extend Mend Learn to end-customers (not just partners) | Broader adoption |
| **Partner-created content** | Partners submit courses and labs for the community | Scalable content creation |
| **Live instructor-led training** | Virtual classroom sessions with Mend.io experts | Premium learning experience |
| **Certification proctoring center** | Physical testing centers for high-stakes exams | Enterprise credibility |
| **Mobile app** | Native iOS/Android app with offline content | Mobile-first learning |
| **VR/AR labs** | Immersive lab environments for complex architectures | Innovation leader positioning |
| **LMS marketplace** | Integrate with customer LMS platforms (Cornerstone, Degreed) | Enterprise learning ecosystem |

---

## Impact vs. Effort Matrix

```
                        HIGH IMPACT
                            │
     ┌──────────────────────┼──────────────────────┐
     │                      │                      │
     │  DO FIRST (P0)       │  BIG BETS (P1)       │
     │                      │                      │
     │  • SSO Integration   │  • AI Sales Roleplay │
     │  • Foundation Track  │  • Lab Infrastructure│
     │  • SCA/SAST Tracks   │  • Knowledge Chatbot │
     │  • Sales Track       │  • Revenue Attribution│
     │  • Associate Cert    │  • Expert Cert       │
     │  • Battlecards       │  • Technical Specialist│
     │  • Cert Sync         │  • Master Architect  │
     │  • XP System         │  • Mend Mentor AI    │
     │  • Basic Search      │  • Challenge Labs    │
LOW  │                      │                      │  HIGH
EFFORT├──────────────────────┼──────────────────────┤EFFORT
     │                      │                      │
     │  EASY WINS (P1)      │  DEPRIORITIZE (P2)   │
     │                      │                      │
     │  • Badges            │  • Mobile App        │
     │  • Cheat Sheets      │  • VR/AR Labs        │
     │  • Email Sequences   │  • Multi-Language     │
     │  • Streaks           │  • Customer Portal   │
     │  • Content Summaries │  • Physical Test Ctrs│
     │  • Leaderboards      │  • LMS Marketplace   │
     │  • Microlearning     │  • Partner-Created    │
     │  • Community Forums  │    Content           │
     │                      │                      │
     └──────────────────────┼──────────────────────┘
                            │
                        LOW IMPACT
```

### Priority Definitions

| Priority | Description | Timeline |
|---|---|---|
| **P0 - DO FIRST** | High impact, low-medium effort. These are the MVP essentials. | Months 1-4 |
| **P1 - BIG BETS** | High impact, high effort. These create competitive moats. | Months 5-12 |
| **P1 - EASY WINS** | Medium impact, low effort. Ship these whenever capacity allows. | Ongoing |
| **P2 - DEPRIORITIZE** | Lower impact or very high effort. Year 2+ initiatives. | Year 2+ |

---

## Launch Strategy

### Soft Launch (Month 4, Week 1-2)

- **Audience**: 10 pilot partners (mix of VAR, MSSP, GSI)
- **Content**: Foundation + SCA + Sales tracks only
- **Goal**: Validate UX, content quality, and certification process
- **Feedback**: Structured interviews + in-platform surveys
- **Success Criteria**: 80% completion rate, > 40 NPS, > 70% cert pass rate

### General Availability (Month 4, Week 3-4)

- **Audience**: All registered partners
- **Announcement**: Email campaign + Allbound notification + partner webinar
- **Content**: All Phase 1 deliverables
- **Promotion**: "Early Adopter" badge for partners who join in first 30 days
- **Goal**: 50% of active partners create accounts within 60 days

### Ongoing Growth

- **Monthly**: New content releases (2-4 modules/month)
- **Quarterly**: New certification level or specialization
- **Quarterly**: Engagement challenge
- **Bi-annually**: Platform feature release (aligned with Phase 2 and 3)
- **Annually**: Partner learning summit (virtual) with keynotes, workshops, and awards

---

## Budget Estimate (Year 1)

| Category | Estimate | Notes |
|---|---|---|
| LMS Platform | $50,000 - $150,000/yr | Depends on vendor (Docebo, Skilljar, custom) |
| Lab Infrastructure | $30,000 - $80,000/yr | Cloud lab provider (Instruqt, Skillable) |
| Content Production | $100,000 - $200,000 | Video, labs, assessments, playbooks |
| AI Infrastructure | $20,000 - $50,000/yr | LLM API costs, vector DB, compute |
| Credly Badges | $5,000 - $15,000/yr | Based on badge volume |
| Personnel (net new) | $300,000 - $500,000 | 2-3 new hires (content, AI, community) |
| Integration Development | $30,000 - $60,000 | Allbound API, SSO, analytics |
| Swag & Rewards | $10,000 - $25,000 | T-shirts, trophies, event tickets |
| **Total Year 1** | **$545,000 - $1,080,000** | |

### ROI Projection

| Metric | Conservative | Optimistic |
|---|---|---|
| Additional certified partners (Year 1) | 200 | 500 |
| Revenue lift per certified partner | $15,000/yr | $30,000/yr |
| Additional partner-sourced revenue | $3,000,000/yr | $15,000,000/yr |
| **ROI** | **3:1 to 6:1** | **14:1 to 28:1** |

**WHY these projections**: Industry data from Cisco, Palo Alto, and CrowdStrike consistently shows that certified partners generate 3-5x more revenue than uncertified. Even the conservative estimate (200 certified partners x $15K lift) delivers a strong ROI against a $1M investment. The optimistic scenario assumes the AI and gamification features drive above-industry certification rates.
