# 2. User Journeys

## Design Philosophy

Every user journey follows a **Time-to-Value (TTV)** optimization model: get the partner to their first "win" as fast as possible. Wins vary by persona - a sales rep's win is a delivered pitch; an SE's win is a completed demo; an admin's win is a configured environment.

**WHY TTV-focused journeys**: Allbound's partner activation data shows that partners who achieve a first success milestone within 14 days are 5x more likely to register their first deal within 90 days. Long onboarding = partner churn.

---

## Journey 1: New Partner (Organization Onboarding)

**Persona**: Partner Manager or Practice Leader who just signed a Mend.io partnership agreement.

```
DAY 0: WELCOME
┌─────────────────────────────────────────────────┐
│ Trigger: Partnership agreement signed           │
│ Action: Automated welcome email from Allbound   │
│ Content: SSO activation link + Mend Learn access│
│ Goal: Account created within 24 hours           │
└───────────────────────┬─────────────────────────┘
                        ▼
DAY 1-3: ORIENTATION
┌─────────────────────────────────────────────────┐
│ Step 1: Role selection wizard                   │
│ "What is your primary role?"                    │
│ → Assigns default learning path                 │
│                                                 │
│ Step 2: Partner type selection                  │
│ "What type of partner are you?"                 │
│ → Customizes content and business use cases     │
│                                                 │
│ Step 3: Team setup                              │
│ "Invite your team members"                      │
│ → Bulk invite with role assignment              │
│                                                 │
│ Step 4: Quick-start module (15 min)             │
│ "Mend.io in 15 Minutes"                         │
│ → Video overview + interactive product tour     │
│                                                 │
│ Goal: Partner understands Mend.io value prop    │
│ Reward: 50 XP + "Getting Started" badge         │
└───────────────────────┬─────────────────────────┘
                        ▼
DAY 4-14: FOUNDATION
┌─────────────────────────────────────────────────┐
│ Auto-assigned: Level 1 Learning Path            │
│ - Application Security Fundamentals (30 min)    │
│ - Software Supply Chain Security (30 min)       │
│ - Mend Platform Overview (45 min)               │
│ - First Knowledge Check                         │
│                                                 │
│ Nudges: Day 5 email, Day 10 email               │
│ Manager dashboard: Team progress visibility     │
│                                                 │
│ Goal: Level 1 completion                        │
│ Reward: 200 XP + "Foundation" badge             │
└───────────────────────┬─────────────────────────┘
                        ▼
DAY 15-30: ACTIVATION
┌─────────────────────────────────────────────────┐
│ Unlock: Level 2 product-specific tracks         │
│ Unlock: Sales playbook access                   │
│ Unlock: First lab environment                   │
│ Prompt: Schedule partner kickoff call            │
│ Prompt: Register for next certification exam    │
│                                                 │
│ Goal: First deal registration in Allbound       │
│ Reward: 500 XP + "Activated Partner" badge      │
│ Allbound: Partner status updated to "Active"    │
└───────────────────────┬─────────────────────────┘
                        ▼
DAY 31-90: CERTIFICATION
┌─────────────────────────────────────────────────┐
│ Track: Associate certification path             │
│ Access: Practice exams, study guides            │
│ Lab: Hands-on certification prep labs           │
│ Exam: Proctored online certification            │
│                                                 │
│ Goal: At least 1 team member certified          │
│ Reward: Certification badge + partner tier bump │
│ Allbound: Certification status synced           │
│ Unlock: Co-marketing funds, priority support    │
└─────────────────────────────────────────────────┘
```

**WHY this journey**: The 0-3-14-30-90 cadence maps to cognitive learning theory (spaced repetition) and partner program best practices. Each phase has a clear goal and reward, preventing drop-off. Allbound integration ensures learning translates to business outcomes.

---

## Journey 2: Sales Representative

**Persona**: Partner sales rep who needs to position and sell Mend.io alongside their existing portfolio.

```
ENTRY POINT: Invited by Partner Manager or self-registered
                        │
                        ▼
WEEK 1: PITCH READY (Critical Path)
┌─────────────────────────────────────────────────┐
│ Module 1: "Sell Mend.io in 30 Minutes" (30 min) │
│ - Market landscape & problem statement          │
│ - Mend.io value proposition                     │
│ - Ideal customer profile                        │
│ - 3 killer use cases                            │
│ - Competitive positioning (vs. Snyk, Veracode)  │
│                                                 │
│ Module 2: "The 5-Minute Pitch" (15 min)         │
│ - Elevator pitch template                       │
│ - Discovery questions                           │
│ - Objection handling (top 10)                   │
│                                                 │
│ Module 3: AI Sales Roleplay (20 min)            │
│ - Practice pitch with AI buyer persona          │
│ - Objection handling simulation                 │
│ - Instant feedback on messaging                 │
│                                                 │
│ Reward: 300 XP + "Pitch Ready" badge            │
│ Unlock: Access to demo request form in Allbound │
└───────────────────────┬─────────────────────────┘
                        ▼
WEEK 2-3: DEAL DRIVER
┌─────────────────────────────────────────────────┐
│ Module 4: Pricing & Packaging (20 min)          │
│ Module 5: Customer Success Stories (20 min)     │
│ Module 6: Deal Registration Process (15 min)    │
│ Module 7: Demo Recording Library (self-paced)   │
│                                                 │
│ Lab: Practice deal registration in sandbox      │
│ Resource: Download battlecards & one-pagers     │
│                                                 │
│ Reward: 300 XP + "Deal Driver" badge            │
│ Unlock: Deal registration in Allbound           │
└───────────────────────┬─────────────────────────┘
                        ▼
WEEK 4-6: SALES SPECIALIST
┌─────────────────────────────────────────────────┐
│ Advanced: Industry vertical positioning         │
│ Advanced: Enterprise selling strategies         │
│ Advanced: Multi-product bundling                │
│ Certification: Partner Sales Specialist exam    │
│                                                 │
│ Reward: Certification + priority lead routing   │
└─────────────────────────────────────────────────┘
```

**WHY "Pitch Ready in Week 1"**: Sales reps are coin-operated. If they can't pitch the product within a week, they'll default to selling what they already know. The 30-minute "Sell Mend.io" module is the single most important piece of content on the platform. AI roleplay reinforces it experientially, not just cognitively.

---

## Journey 3: Sales Engineer / Pre-Sales

**Persona**: Technical pre-sales resource who runs demos, POCs, and technical evaluations.

```
ENTRY POINT: Invited or self-registered with SE role
                        │
                        ▼
WEEK 1-2: DEMO READY
┌─────────────────────────────────────────────────┐
│ Module 1: Mend Platform Architecture (45 min)   │
│ - Platform components and data flow             │
│ - Deployment models (SaaS, hybrid)              │
│ - Integration ecosystem overview                │
│                                                 │
│ Module 2: "The Perfect Demo" (60 min)           │
│ - Demo environment setup                        │
│ - Standard demo script (SCA flow)               │
│ - Standard demo script (SAST flow)              │
│ - Demo do's and don'ts                          │
│                                                 │
│ Lab 1: Guided Demo Lab (90 min)                 │
│ - Set up demo environment                       │
│ - Run standard demo end-to-end                  │
│ - Record yourself delivering the demo           │
│                                                 │
│ Reward: 500 XP + "Demo Ready" badge             │
│ Unlock: Demo environment provisioning           │
└───────────────────────┬─────────────────────────┘
                        ▼
WEEK 3-6: TECHNICAL DEPTH
┌─────────────────────────────────────────────────┐
│ Product Deep-Dives (choose relevant products):  │
│ - SCA Deep Dive + Lab (2 hrs)                   │
│ - SAST Deep Dive + Lab (2 hrs)                  │
│ - Container Security + Lab (2 hrs)              │
│ - Supply Chain Security + Lab (2 hrs)           │
│ - Secrets Detection + Lab (1.5 hrs)             │
│                                                 │
│ Integration Labs:                               │
│ - GitHub/GitLab/Azure DevOps integration        │
│ - Jenkins/CircleCI CI/CD integration            │
│ - IDE plugin walkthrough                        │
│ - SIEM/SOAR integration                         │
│                                                 │
│ POC Management:                                 │
│ - POC best practices                            │
│ - Success criteria definition                   │
│ - POC-to-close playbook                         │
│                                                 │
│ Reward: 800 XP + "Technical Specialist" badge   │
└───────────────────────┬─────────────────────────┘
                        ▼
WEEK 7-12: CERTIFICATION
┌─────────────────────────────────────────────────┐
│ Certification: Partner Technical Specialist     │
│ - Study guide + practice exam                   │
│ - Lab-based practical exam                      │
│ - Proctored knowledge exam                      │
│                                                 │
│ Reward: Certification + advanced lab access     │
│ Unlock: POC support from Mend.io SE team        │
└─────────────────────────────────────────────────┘
```

**WHY demo-first for SEs**: The SE's primary job is to run convincing demos and manage POCs. Making them "Demo Ready" in 2 weeks means they can start supporting deals immediately. Lab-based learning is critical because SEs learn by doing, not watching. Every Cisco, Palo Alto, and CrowdStrike partner SE program leads with demo readiness.

---

## Journey 4: Security Consultant

**Persona**: Security professional at an MSSP or consulting firm who advises customers on AppSec strategy and implements Mend.io.

```
ENTRY POINT: Self-registered or invited with Security Consultant role
                        │
                        ▼
WEEK 1-2: SECURITY FOUNDATIONS
┌─────────────────────────────────────────────────┐
│ Module 1: AppSec Landscape & Trends (30 min)    │
│ - OWASP Top 10 refresher                        │
│ - Software supply chain threat model            │
│ - Regulatory landscape (SOC2, FedRAMP, etc.)    │
│                                                 │
│ Module 2: Mend.io for Security Teams (45 min)   │
│ - How Mend fits in the security stack           │
│ - Vulnerability prioritization methodology      │
│ - Policy-as-code approach                       │
│ - Reporting and compliance capabilities         │
│                                                 │
│ Module 3: Customer Advisory Framework (30 min)  │
│ - AppSec maturity assessment model              │
│ - Recommendation frameworks                     │
│ - ROI calculation methodology                   │
│                                                 │
│ Reward: 400 XP + "Security Advisor" badge       │
└───────────────────────┬─────────────────────────┘
                        ▼
WEEK 3-6: IMPLEMENTATION EXPERTISE
┌─────────────────────────────────────────────────┐
│ Lab: Enterprise Deployment Design (2 hrs)       │
│ - Multi-org architecture                        │
│ - SSO/SCIM configuration                        │
│ - Policy hierarchy design                       │
│ - Notification and workflow setup               │
│                                                 │
│ Lab: Security Program Design (2 hrs)            │
│ - Vulnerability triage workflow                 │
│ - SLA and remediation policy setup              │
│ - Developer enablement strategy                 │
│ - Executive reporting configuration             │
│                                                 │
│ Simulation: Customer Workshop (1.5 hrs)         │
│ - Lead an AppSec assessment workshop            │
│ - Present findings and recommendations          │
│ - Handle executive objections                   │
│                                                 │
│ Reward: 700 XP + "Implementation Expert" badge  │
└───────────────────────┬─────────────────────────┘
                        ▼
WEEK 7-12: MASTERY & CERTIFICATION
┌─────────────────────────────────────────────────┐
│ Advanced: Multi-product orchestration           │
│ Advanced: Enterprise governance                 │
│ Advanced: Compliance mapping (SOC2, ISO27001)   │
│ Certification: Partner Technical Specialist     │
│                                                 │
│ Optional: Master Architect certification path   │
│                                                 │
│ Reward: Certification + consulting engagement   │
│         referral eligibility from Mend.io       │
└─────────────────────────────────────────────────┘
```

**WHY advisory-first for consultants**: Security consultants sell expertise, not products. They need to position Mend.io within a broader security strategy. The customer advisory framework and workshop simulation differentiate Mend Learn from competitors that only teach product features. MSSP consultants who can run maturity assessments generate 3x more pipeline than those who only demo features.

---

## Journey 5: Technical Administrator

**Persona**: IT/DevOps engineer at a partner or customer responsible for deploying, configuring, and maintaining Mend.io.

```
ENTRY POINT: Assigned by partner manager or self-registered
                        │
                        ▼
WEEK 1: PLATFORM SETUP
┌─────────────────────────────────────────────────┐
│ Module 1: Mend.io Architecture (30 min)         │
│ - System components                             │
│ - Data flow and processing                      │
│ - Network requirements                          │
│ - SaaS vs. hybrid deployment                    │
│                                                 │
│ Lab 1: Initial Setup (60 min)                   │
│ - Organization creation                         │
│ - SSO configuration (SAML/OIDC)                 │
│ - First project scan                            │
│ - Result review and triage                      │
│                                                 │
│ Reward: 300 XP + "Platform Setup" badge         │
└───────────────────────┬─────────────────────────┘
                        ▼
WEEK 2-4: INTEGRATION & CONFIGURATION
┌─────────────────────────────────────────────────┐
│ Lab 2: SCM Integration (60 min)                 │
│ - GitHub/GitLab/Bitbucket/Azure DevOps setup    │
│ - Webhook configuration                         │
│ - Branch protection rules                       │
│                                                 │
│ Lab 3: CI/CD Pipeline Integration (90 min)      │
│ - Jenkins pipeline setup                        │
│ - GitHub Actions workflow                       │
│ - Azure Pipelines configuration                 │
│ - Fail conditions and thresholds                │
│                                                 │
│ Lab 4: Policy Management (60 min)               │
│ - Policy creation and hierarchy                 │
│ - Auto-remediation rules                        │
│ - License compliance policies                   │
│ - Notification configuration                    │
│                                                 │
│ Reward: 600 XP + "Integration Specialist" badge │
└───────────────────────┬─────────────────────────┘
                        ▼
WEEK 5-8: ADVANCED ADMINISTRATION
┌─────────────────────────────────────────────────┐
│ Lab 5: API and Automation (90 min)              │
│ - REST API overview                             │
│ - Webhook event handling                        │
│ - Custom reporting via API                      │
│ - Automation scripting                          │
│                                                 │
│ Lab 6: Enterprise Administration (60 min)       │
│ - Multi-org management                          │
│ - RBAC configuration                            │
│ - Audit logging                                 │
│ - Usage monitoring and optimization             │
│                                                 │
│ Module: Troubleshooting & Support (45 min)      │
│ - Common issues and resolutions                 │
│ - Log analysis                                  │
│ - Support escalation procedures                 │
│                                                 │
│ Reward: 700 XP + "Advanced Admin" badge         │
│ Certification: Professional certification path  │
└─────────────────────────────────────────────────┘
```

**WHY lab-heavy for admins**: Administrators learn exclusively by doing. Every module has a corresponding lab because watching a video about CI/CD integration teaches nothing - configuring a real pipeline does. AWS Skill Builder and Google Cloud Skills Boost both prove that lab-based admin training achieves 85% knowledge retention vs. 20% for video-only.

---

## Cross-Journey Engagement Mechanisms

| Mechanism | Trigger | Purpose |
|---|---|---|
| Email nudges | 3 days of inactivity | Re-engage learners before they churn |
| Manager reports | Weekly digest | Enable partner managers to track team progress |
| Milestone celebrations | Badge/cert earned | Dopamine hit + social sharing opportunity |
| Peer challenges | Monthly | Create friendly competition within partner orgs |
| Certification reminders | 30 days before exam | Drive certification completion |
| Content recommendations | After each module | Keep the learning momentum going |
| Allbound notifications | Cert earned / path completed | Sync achievements to partner portal |

**WHY these mechanisms**: Learning platform engagement follows a power law - 80% of users drop off without active nudging. These mechanisms address every stage of the dropout curve: awareness (nudges), motivation (challenges), accountability (manager reports), and reward (celebrations).
