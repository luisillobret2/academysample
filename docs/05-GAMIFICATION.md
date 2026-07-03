# 5. Gamification

## Design Philosophy

The gamification system is built on **Self-Determination Theory (SDT)**, which identifies three innate psychological needs: **Autonomy** (choice in learning path), **Competence** (progressive mastery), and **Relatedness** (social connection and competition). Every gamification element maps to one or more of these needs.

**WHY SDT-based gamification**: Points and badges alone create short-term engagement spikes that fade (the "badge fatigue" problem). SDT-based design creates intrinsic motivation that sustains engagement over months and years. Duolingo, which has the highest retention of any learning platform, uses SDT as its gamification foundation.

---

## Points System

### Experience Points (XP)

XP measures cumulative learning effort and unlocks progressive rewards.

| Activity | XP Earned | Rationale |
|---|---|---|
| Complete a video module | 25 XP | Base engagement reward |
| Complete an interactive module | 50 XP | Higher engagement = higher reward |
| Complete a hands-on lab | 100 XP | Labs require the most effort and produce the most retention |
| Pass a knowledge check | 75 XP | Validates understanding, not just consumption |
| Pass a certification exam | 500 XP | Major milestone deserves major reward |
| Complete a learning path | 300 XP | Encourages path completion, not module-hopping |
| Complete a daily learning goal | 25 XP | Daily habit formation (streak-based) |
| Achieve a learning streak (7 days) | 100 XP bonus | Sustained engagement reward |
| Achieve a learning streak (30 days) | 500 XP bonus | Monthly commitment reward |
| AI roleplay session (min 10 min) | 50 XP | Practice counts as learning |
| Submit feedback on content | 10 XP | Encourages quality improvement loop |
| Help in community forums | 25 XP | Rewards knowledge sharing |
| Refer a colleague who completes L1 | 100 XP | Organic growth through referral |

### Skill Points (SP)

SP measures depth in specific product or skill areas. Unlike XP (cumulative), SP reflects current competency.

| Product/Skill | SP Earned By | Max SP |
|---|---|---|
| SCA Mastery | SCA track modules + labs | 1000 SP |
| SAST Mastery | SAST track modules + labs | 1000 SP |
| Container Mastery | Container track modules + labs | 1000 SP |
| Secrets Mastery | Secrets track modules + labs | 500 SP |
| Supply Chain Mastery | Supply Chain track modules + labs | 1000 SP |
| Sales Mastery | Sales track + roleplay | 1000 SP |
| Integration Mastery | CI/CD + API tracks | 1000 SP |
| Architecture Mastery | Enterprise Architecture track | 1000 SP |

**WHY two point types**: XP rewards effort (keeps everyone motivated). SP rewards depth (identifies true experts). This dual system prevents the "jack of all trades" problem where someone earns high XP by doing many easy modules but has no deep product knowledge. Salesforce Trailhead uses a similar Trailhead Points + Superbadge model.

---

## Levels

| Level | XP Required | Title | Unlock |
|---|---|---|---|
| 1 | 0 | Newcomer | Basic platform access |
| 2 | 200 | Explorer | Community forum access |
| 3 | 500 | Learner | AI Coach access |
| 4 | 1,000 | Practitioner | Lab environment access |
| 5 | 2,000 | Specialist | Certification exam eligibility |
| 6 | 3,500 | Advanced | Challenge lab access |
| 7 | 5,000 | Expert | Beta content early access |
| 8 | 7,500 | Master | Mentor status eligibility |
| 9 | 10,000 | Champion | Mend.io partner advisory board invitation |
| 10 | 15,000 | Legend | VIP event access + exclusive swag |

**WHY progressive unlocks**: Unlocking features through progression (not just time) creates a sense of earned access. Duolingo's "locked lesson" model increases completion by 40% because learners are motivated to unlock the next stage. The specific unlocks chosen here also drive business value (certification eligibility, advisory board membership).

---

## Badges

### Achievement Badges

| Badge | Criteria | Category |
|---|---|---|
| Getting Started | Complete onboarding wizard | Onboarding |
| Foundation Builder | Complete Level 1 Foundation Track | Learning |
| SCA Expert | Complete SCA track with 90%+ on knowledge check | Product |
| SAST Expert | Complete SAST track with 90%+ on knowledge check | Product |
| Container Expert | Complete Container track with 90%+ on knowledge check | Product |
| Supply Chain Expert | Complete Supply Chain track with 90%+ on knowledge check | Product |
| Secrets Expert | Complete Secrets track with 90%+ on knowledge check | Product |
| Platform Master | Complete Unified Platform track | Product |
| Sales Warrior | Complete Sales track + 5 AI roleplay sessions | Sales |
| Demo Star | Record and submit a passing demo | Technical |
| Lab Rat | Complete 10 hands-on labs | Engagement |
| Lab Legend | Complete 25 hands-on labs | Engagement |
| Speed Learner | Complete 5 modules in one day | Engagement |
| Streak Starter | 7-day learning streak | Habit |
| Streak Master | 30-day learning streak | Habit |
| Streak Legend | 90-day learning streak | Habit |
| Helpful Hand | Answer 10 community questions | Community |
| Mentor | Help 3 colleagues achieve certification | Community |
| First Deal | Register first deal in Allbound | Business |
| Pipeline Builder | Register 5 deals in a quarter | Business |
| Revenue Driver | Close first Mend.io deal | Business |
| Quarterly Champion | Top performer in quarterly challenge | Competition |

### Certification Badges

(See Section 4: Certifications for the six certification badges)

### Seasonal/Limited Badges

| Badge | Criteria | Availability |
|---|---|---|
| Early Adopter | Join Mend Learn in first 90 days | One-time |
| Beta Tester | Test and provide feedback on new content | Per release |
| Conference Scholar | Complete event-specific learning path | Per event |
| New Year Resolver | Complete a learning path in January | Annual |
| Security Awareness Champion | Complete SecurityAwareness month challenge | Annual (October) |

**WHY seasonal badges**: Limited-edition badges create urgency (FOMO) and give partners a reason to return regularly. Peloton's monthly challenges and Strava's monthly distance badges both drive re-engagement through time-limited achievements.

---

## Leaderboards

### Individual Leaderboards

| Leaderboard | Metric | Scope | Reset |
|---|---|---|---|
| Global XP | Total XP earned | All partners | Never (all-time) |
| Monthly Momentum | XP earned this month | All partners | Monthly |
| Certification Stars | Certifications earned | All partners | Never |
| Lab Champions | Labs completed | All partners | Quarterly |
| Sales Performers | AI roleplay scores | Sales reps | Monthly |
| Community Heroes | Forum contributions | All partners | Quarterly |

### Team/Organization Leaderboards

| Leaderboard | Metric | Scope | Reset |
|---|---|---|---|
| Partner Org of the Month | Average XP per team member | Partner organizations | Monthly |
| Most Certified Org | Total certifications | Partner organizations | Quarterly |
| Activation Leaders | % of team with Associate cert | New partners (< 6 months) | Rolling |
| Pipeline Performers | Deal registrations by certified reps | Partner organizations | Quarterly |

### Leaderboard Rules

- **Opt-out available**: Partners can hide from public leaderboards (GDPR/privacy). Individual progress still tracked internally.
- **Size-normalized**: Org leaderboards use per-capita metrics to prevent large partners from dominating.
- **Anti-gaming**: XP caps per day (500 XP max). Repeated module completions don't earn XP. Knowledge check scores must be > 60% to earn XP.
- **Visibility**: Leaderboards are visible in Mend Learn and synced to Allbound partner portal.

**WHY team leaderboards**: Individual leaderboards motivate high-performers but can discourage low-performers. Team leaderboards create peer accountability (managers push teams) and social motivation (no one wants to be the lowest-performing org). Allbound's partner benchmarking shows that partner orgs visible on leaderboards have 2x activation rates.

---

## Partner Rankings / Tiers

Learning achievements contribute to overall partner tier status in the Mend.io Partner Program.

| Partner Tier | Learning Requirements | Additional Benefits |
|---|---|---|
| Registered | At least 1 team member completes Level 1 | Basic portal access, deal registration |
| Silver | 2+ Associate certifications | 10% deal registration discount, co-branded materials |
| Gold | 2+ Professional certifications + 1 Technical Specialist | 15% discount, joint marketing funds, priority support |
| Platinum | 3+ Professional + 2 Technical Specialists + 1 Expert | 20% discount, dedicated partner manager, executive briefings |
| Diamond | All above + Master Architect + 5,000+ org XP/quarter | Top discount, strategic account alignment, advisory board seat |

**WHY tie tiers to learning**: This creates organizational accountability for enablement. Partner managers will push their teams to certify because it directly impacts their margin and support level. Palo Alto Networks' NextWave partner program uses this model, and partners with higher certification levels generate 4x more revenue per rep.

---

## Quarterly Challenges

| Quarter | Challenge | Theme | Reward |
|---|---|---|---|
| Q1 | "New Year, New Skills" | Complete 2 new learning paths | 1,000 XP bonus + exclusive badge + $50 gift card |
| Q2 | "Certification Sprint" | Earn a new certification | 2,000 XP bonus + certification discount (if paid) |
| Q3 | "Lab Marathon" | Complete 15 labs | 1,500 XP bonus + Mend.io swag box |
| Q4 | "Pipeline Challenge" | Register 3 deals with certified reps | 3,000 XP bonus + bonus deal registration discount |

### Challenge Mechanics

- **Individual track**: Personal goals and rewards
- **Team track**: Org-level goals with team rewards (team lunch, swag for the office)
- **Global track**: Top 10 individuals and top 5 orgs recognized at partner summit
- **Progress visibility**: Real-time challenge dashboard with countdown timer

**WHY quarterly cadence**: Monthly is too frequent (fatigue). Annual is too infrequent (forgotten). Quarterly aligns with business cycles (QBRs, pipeline reviews) and gives enough time for meaningful achievement. Q4's pipeline challenge directly ties learning to revenue, reinforcing the platform's ROI story.

---

## Rewards

### Digital Rewards

| Reward | Trigger | Value |
|---|---|---|
| Credly Badge | Certification or achievement | Professional credibility |
| LinkedIn Certificate | Certification | Social proof |
| Email signature badge | Any certification | Ongoing visibility |
| Profile frame | Level milestone | Social status |
| Custom avatar items | XP milestones | Personalization |

### Physical Rewards

| Reward | Trigger | Value |
|---|---|---|
| Mend.io swag (t-shirt, hoodie) | Level 5+ or quarterly challenge winner | Brand affinity |
| Master Architect trophy | Master Architect certification | Prestige ($0 cost, immense emotional value) |
| Conference ticket | Top 10 quarterly leaderboard | Network access |
| Exclusive dinner with Mend.io leadership | Diamond tier + Master Architect | Relationship building |

### Business Rewards

| Reward | Trigger | Value |
|---|---|---|
| Priority lead routing | Sales Specialist certification | Direct revenue impact |
| Co-marketing funds | Gold tier+ | Marketing support |
| Demo environment access | Demo Star badge | Tooling access |
| Beta product access | Level 7+ | Early market advantage |
| Speaking slot at partner summit | Master Architect | Thought leadership visibility |

**WHY business rewards**: Points and swag create short-term motivation. Business rewards (leads, co-marketing, beta access) create long-term, sustainable engagement because they directly impact the partner's bottom line. This is the key differentiator between a "gamified LMS" and a "partner enablement engine."
