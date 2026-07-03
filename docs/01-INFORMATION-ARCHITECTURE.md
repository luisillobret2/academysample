# 1. Information Architecture

## Design Philosophy

The IA follows a **role-first, progressive disclosure** model. Partners land on a personalized homepage based on their role and partner tier, then navigate into increasingly specific content. This mirrors Microsoft Learn's approach (role → path → module → unit) while adding the partner-commerce layer that Snyk Learn lacks.

**WHY this approach**: Partners have limited time. A role-first IA eliminates choice paralysis by showing only what's relevant. Progressive disclosure prevents cognitive overload while ensuring depth is always accessible. Research from Degreed and LinkedIn Learning shows role-based filtering increases course starts by 40%+.

---

## Site Map

```
MendLearn (learn.mend.io)
├── Homepage (Personalized Dashboard)
│   ├── My Learning Path (current progress)
│   ├── Recommended Next Steps (AI-driven)
│   ├── Certification Progress
│   ├── Points & Rank
│   ├── Announcements & New Content
│   └── Quick Actions (Resume, Explore, Certify)
│
├── Learning Paths
│   ├── By Role
│   │   ├── Sales Representative
│   │   ├── Sales Engineer / Pre-Sales
│   │   ├── Solution Architect
│   │   ├── Security Consultant
│   │   ├── Technical Administrator
│   │   ├── Developer / DevOps Engineer
│   │   ├── Executive / Practice Leader
│   │   └── Customer Success Manager
│   │
│   ├── By Product
│   │   ├── Mend SCA (Software Composition Analysis)
│   │   ├── Mend SAST (Static Application Security Testing)
│   │   ├── Mend Container Security
│   │   ├── Mend Supply Chain Security
│   │   ├── Mend Secrets Detection
│   │   └── Mend Platform (Unified)
│   │
│   ├── By Level
│   │   ├── Beginner (Level 1)
│   │   ├── Intermediate (Level 2)
│   │   └── Expert (Level 3)
│   │
│   └── By Partner Type
│       ├── VAR
│       ├── MSSP
│       ├── GSI
│       └── Technology Partner
│
├── Certifications
│   ├── Certification Catalog
│   ├── My Certifications
│   ├── Exam Center
│   ├── Study Guides
│   ├── Practice Exams
│   └── Badge Verification
│
├── Hands-On Labs
│   ├── Guided Labs (step-by-step)
│   ├── Challenge Labs (open-ended)
│   ├── Sandbox Environment
│   └── Lab Catalog
│
├── Resources
│   ├── Sales Playbooks
│   ├── Competitive Battlecards
│   ├── Demo Library
│   ├── Customer Stories
│   ├── Technical Documentation
│   └── API Reference
│
├── Community
│   ├── Discussion Forums
│   ├── Partner Showcase
│   ├── Leaderboard
│   ├── Events & Webinars
│   └── Office Hours
│
├── AI Coach
│   ├── Ask Mend AI
│   ├── Sales Roleplay
│   ├── Exam Prep
│   └── Personalized Recommendations
│
└── My Profile
    ├── Dashboard
    ├── Certifications & Badges
    ├── Learning History
    ├── Points & Achievements
    ├── Team Management (Managers)
    └── Settings
```

---

## Homepage Design

### Personalized Dashboard (Authenticated)

**WHY personalized**: AWS Skill Builder and Microsoft Learn both prove that personalized dashboards increase return visits by 3x vs. static course catalogs. Partners who see "their" progress are 67% more likely to complete a learning path (source: Docebo industry research).

| Section | Content | Rationale |
|---|---|---|
| Hero Banner | Current learning path progress + next action CTA | Reduces friction to resume; one-click continuation |
| Certification Tracker | Visual progress toward next certification | Goal visibility drives completion (gamification psychology) |
| Recommended For You | AI-curated courses based on role + history + gaps | Eliminates browsing; surfaces relevant content instantly |
| New & Updated | Latest courses, labs, and content additions | Creates return-visit habit; FOMO effect |
| Leaderboard Widget | Personal rank, team rank, partner rank | Social proof and competitive motivation |
| Quick Stats | XP earned, courses completed, badges, streak | Dopamine loops that reinforce daily engagement |
| Announcements | Product updates, new certifications, events | Keeps partners current on platform changes |

### Public Landing Page (Unauthenticated)

| Section | Content | Rationale |
|---|---|---|
| Value Proposition | "Become a Mend.io Expert. Grow Your Business." | Outcome-focused messaging for partner leaders |
| Social Proof | # of certified partners, revenue impact stats | Trust signals for decision-makers |
| Learning Path Preview | Role selector showing path overview | Let prospects see value before signup |
| Certification Showcase | Badge gallery, credential value | Demonstrates professional credibility |
| CTA | "Start Learning Free" / "Talk to Partner Team" | Dual CTA for self-serve and high-touch |

---

## Navigation Structure

### Primary Navigation (Top Bar)

```
[Mend Learn Logo] [Home] [Learning Paths] [Certifications] [Labs] [Resources] [AI Coach] [Search] [Profile/Avatar]
```

**WHY this order**: Follows the natural partner journey (learn → certify → practice → reference → get help). Search is always accessible. Profile provides quick access to progress.

### Secondary Navigation (Context-Dependent Sidebar)

When inside a learning path:
```
← Back to Paths
Path Name
├── Module 1 ✓
├── Module 2 ✓
├── Module 3 (Current) ←
├── Module 4
├── Knowledge Check
└── Certification Exam →
```

**WHY sidebar nav**: Microsoft Learn's left-rail navigation for modules is the gold standard for course progression. It provides constant context (where am I, what's next) without page reloads.

---

## Content Taxonomy

### Tags & Filters

| Dimension | Values |
|---|---|
| Role | Sales, Pre-Sales, Architect, Admin, Developer, Executive, CSM |
| Level | Beginner, Intermediate, Expert |
| Product | SCA, SAST, Container, Supply Chain, Secrets, Platform |
| Format | Video, Lab, Reading, Quiz, Simulation, Playbook |
| Duration | < 15 min, 15-30 min, 30-60 min, 1-2 hrs, 2+ hrs |
| Certification | Maps to specific cert requirements |
| Partner Type | VAR, MSSP, GSI, Tech Partner |

**WHY multi-dimensional taxonomy**: Partners need to find content through multiple lenses. A sales engineer at a GSI needs to filter by role (SE) + partner type (GSI) + product (SCA) + level (intermediate). Snyk Learn only offers topic-based browsing, which is insufficient for a partner audience.

---

## Mobile & Responsive Design

| Breakpoint | Experience |
|---|---|
| Desktop (1200px+) | Full dashboard, sidebar nav, lab environment |
| Tablet (768-1199px) | Collapsed sidebar, stacked cards, labs in full-screen mode |
| Mobile (< 768px) | Bottom nav, card-based feed, video-first content, no labs (prompt to use desktop) |

**WHY mobile matters**: Sales reps consume content between meetings. 45% of partner portal traffic is mobile (Allbound industry data). Microlearning modules must be mobile-optimized. Labs are desktop-only due to complexity requirements.
