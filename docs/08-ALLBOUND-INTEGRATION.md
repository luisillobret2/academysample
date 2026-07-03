# 8. Allbound Integration

## Design Philosophy

The Allbound integration follows a **"single pane of glass"** principle: partners should never feel like Mend Learn and the Allbound Partner Portal are separate systems. Learning achievements should flow into Allbound seamlessly, and Allbound partner data should inform the learning experience. The integration creates a virtuous cycle: learn → certify → unlock benefits → register deals → see ROI → learn more.

**WHY deep integration**: Disconnected learning portals are the #1 complaint in partner programs (Forrester Partner Enablement Survey). Partners who must log into multiple portals, track progress in one system, and register deals in another experience friction that kills engagement. Every additional click or portal switch loses ~15% of users. Allbound already owns the partner relationship; Mend Learn should enhance it, not compete with it.

---

## Integration Architecture

```
┌─────────────────────┐                    ┌─────────────────────┐
│                     │                    │                     │
│     MEND LEARN      │◄──── SSO/SAML ───►│    ALLBOUND PRM     │
│                     │                    │                     │
│  ┌───────────────┐  │                    │  ┌───────────────┐  │
│  │ Learning      │  │    REST API /      │  │ Partner       │  │
│  │ Engine        │──┼───  Webhooks  ────►│  │ Profiles      │  │
│  │               │  │                    │  │               │  │
│  │ - Courses     │  │                    │  │ - Users       │  │
│  │ - Labs        │  │◄──── User Sync ───┤  │ - Orgs        │  │
│  │ - Certs       │  │                    │  │ - Tiers       │  │
│  │ - Gamification│  │                    │  │ - Deals       │  │
│  └───────────────┘  │                    │  └───────────────┘  │
│                     │                    │                     │
│  ┌───────────────┐  │    Webhook Events  │  ┌───────────────┐  │
│  │ Achievement   │──┼──────────────────►│  │ Badges &      │  │
│  │ Engine        │  │  cert_earned       │  │ Rewards       │  │
│  │               │  │  badge_earned      │  │               │  │
│  │               │  │  path_completed    │  │               │  │
│  │               │  │  xp_milestone      │  │               │  │
│  └───────────────┘  │                    │  └───────────────┘  │
│                     │                    │                     │
│  ┌───────────────┐  │    Analytics API   │  ┌───────────────┐  │
│  │ Analytics     │──┼──────────────────►│  │ Partner       │  │
│  │ Engine        │  │                    │  │ Scorecard     │  │
│  └───────────────┘  │                    │  └───────────────┘  │
│                     │                    │                     │
└─────────────────────┘                    └─────────────────────┘
```

---

## Integration Point 1: Single Sign-On (SSO)

### Implementation

| Attribute | Detail |
|---|---|
| Protocol | SAML 2.0 or OIDC (depending on Allbound's supported protocols) |
| Direction | Allbound as IdP, Mend Learn as SP |
| User Experience | Partner clicks "Learning" in Allbound → seamlessly opens Mend Learn (no second login) |
| Session Management | Shared session tokens; logout from either system logs out both |
| Fallback | Direct Mend Learn login for partners not yet in Allbound (redirects to Allbound post-login) |

### Implementation Steps

1. Configure Mend Learn as a SAML/OIDC service provider
2. Register Mend Learn in Allbound's SSO application catalog
3. Map Allbound user attributes to Mend Learn user profile fields
4. Test with all partner types (VAR, MSSP, GSI, Tech Partner)
5. Enable deep linking (Allbound links directly to specific Mend Learn courses)

**WHY SSO-first**: SSO is the foundation of the integration. Without it, every other integration point suffers from user identity mismatches. 90% of enterprise partner portals require SSO for compliance (SOC2 control). Partners who experience SSO friction are 3x less likely to use the learning portal.

---

## Integration Point 2: User Sync

### Direction: Allbound → Mend Learn

| Allbound Field | Mend Learn Field | Sync Trigger |
|---|---|---|
| User ID | External ID | On user creation/update |
| Email | Email (primary key) | On user creation/update |
| First/Last Name | Display Name | On user creation/update |
| Partner Organization | Organization | On user creation/update |
| Partner Type | Partner Type (VAR/MSSP/GSI/Tech) | On org creation/update |
| Partner Tier | Partner Tier (Registered/Silver/Gold/Platinum/Diamond) | On tier change |
| Role in Org | Role (Sales/SE/Architect/Admin/Exec) | On user creation/update |
| Active/Inactive Status | Account Status | On status change |
| Region | Region | On user creation/update |

### Direction: Mend Learn → Allbound

| Mend Learn Field | Allbound Field | Sync Trigger |
|---|---|---|
| Certification Status | Custom field: "Certifications" | On certification earned/expired |
| Learning Path Progress | Custom field: "Enablement Status" | On path completion |
| XP / Level | Custom field: "Learning Level" | On level change |
| Badge Count | Custom field: "Badges Earned" | On badge earned |
| Last Active Date | Custom field: "Last Learning Activity" | Daily sync |

### Sync Mechanism

- **Primary**: Webhooks for real-time events (user created, tier changed, cert earned)
- **Secondary**: Batch sync (daily) for data reconciliation and catching missed webhooks
- **Conflict Resolution**: Allbound is source of truth for user/org data; Mend Learn is source of truth for learning data

**WHY bi-directional sync**: Allbound needs learning data to make smart decisions (e.g., "only route leads to certified partners"). Mend Learn needs Allbound data to personalize the experience (e.g., "show MSSP content to MSSP partners"). Without bi-directional sync, partner managers must manually track certifications in spreadsheets, which defeats the purpose of integration.

---

## Integration Point 3: Partner Segmentation

### How Allbound Data Drives Mend Learn Experience

| Allbound Segment | Mend Learn Experience |
|---|---|
| Partner Type: VAR | Sales-heavy learning path, deal registration tutorials |
| Partner Type: MSSP | MSSP-specific tracks, multi-tenant labs, managed services content |
| Partner Type: GSI | Enterprise architecture tracks, large-scale deployment content |
| Partner Type: Tech Partner | Developer/API tracks, integration labs |
| Tier: Registered | Foundation tracks only, limited lab access |
| Tier: Silver | Full lab access, certification exams |
| Tier: Gold+ | Challenge labs, beta content, advanced tracks |
| Region: EMEA | GDPR-specific content, EU-localized case studies |
| Region: APJ | APJ-specific customer scenarios, local competitive landscape |

### Content Gating by Tier

| Content | Registered | Silver | Gold | Platinum | Diamond |
|---|---|---|---|---|---|
| Foundation (L1) | Yes | Yes | Yes | Yes | Yes |
| Product Tracks (L2) | Yes | Yes | Yes | Yes | Yes |
| Basic Labs | Limited (3/month) | Unlimited | Unlimited | Unlimited | Unlimited |
| Challenge Labs | No | No | Yes | Yes | Yes |
| Expert Tracks (L3) | No | Yes | Yes | Yes | Yes |
| AI Roleplay | Limited (5/month) | Unlimited | Unlimited | Unlimited | Unlimited |
| Certification Exams | Paid | Free | Free | Free | Free |
| Beta Content | No | No | No | Yes | Yes |
| 1:1 Mentoring | No | No | No | Yes | Yes |

**WHY tier-based gating**: Gating creates an incentive to tier up (which requires more certifications and deal activity). It also prevents freeloaders from consuming expensive lab resources without contributing to the partnership. The gating is generous enough that Registered partners can still learn and certify but restrictive enough that they see value in upgrading.

---

## Integration Point 4: Certification Status Sync

### Data Flow

```
Partner passes cert exam in Mend Learn
        │
        ▼
Mend Learn fires webhook: cert_earned
{
  "event": "certification_earned",
  "user_email": "jane@partner.com",
  "org_id": "allbound_org_123",
  "certification": "professional",
  "cert_date": "2025-06-15",
  "expiry_date": "2026-12-15",
  "badge_url": "https://credly.com/badges/...",
  "score": 82
}
        │
        ▼
Allbound receives webhook
        │
        ├──► Updates partner profile: "Professional Certified"
        ├──► Triggers tier evaluation (does this cert unlock next tier?)
        ├──► Updates partner scorecard
        ├──► Sends congratulatory notification to partner manager
        └──► Unlocks new benefits (lead routing, co-marketing, etc.)
```

### Expiry Management

- Mend Learn sends `certification_expiring` webhook 60 and 30 days before expiry
- Allbound displays expiry warning in partner profile
- Upon expiry, Allbound removes certification status and adjusts tier if needed
- Mend Learn sends renewal reminder emails with direct link to renewal path

**WHY real-time cert sync**: Certification status determines deal routing, margin, and support levels in most partner programs. Delays in syncing certification status mean missed leads and incorrect discounting. Real-time webhooks ensure that the moment a partner passes an exam, they immediately benefit from their new credential.

---

## Integration Point 5: Badge Sync

### Implementation

- Badges earned in Mend Learn appear in the partner's Allbound profile
- Allbound displays a "Badges & Achievements" section on the partner profile page
- Badges are visual (rendered from Credly or custom image URLs)
- Clicking a badge links back to the achievement details in Mend Learn

### Badge Categories in Allbound

| Category | Visibility | Purpose |
|---|---|---|
| Certification Badges | Public (visible to Mend.io team) | Credentialing |
| Achievement Badges | Public | Engagement proof |
| Milestone Badges | Internal (partner org only) | Team motivation |
| Seasonal Badges | Public | Event participation |

**WHY badge sync**: Badges in Allbound make learning achievements visible to Mend.io channel managers who use Allbound daily. When a channel manager sees a partner with 12 badges and a Professional cert, they know that partner is invested and should receive priority attention. Without sync, badges only live in Mend Learn where channel managers never look.

---

## Integration Point 6: Points & Leaderboards

### Allbound Integration

- **Partner Scorecard**: XP and level appear as metrics in the Allbound partner scorecard alongside deal activity, MDF usage, and engagement
- **Leaderboard Widget**: Embeddable leaderboard widget (iframe or API) displayed in Allbound's partner dashboard
- **Ranking Factor**: XP contributes to partner health scoring in Allbound (alongside deal registration, support usage, marketing participation)

**WHY in Allbound**: Partner managers use Allbound for partner health assessment. Including learning metrics in the scorecard creates a complete picture. A partner with high deal volume but low learning scores is a risk (they may be mis-selling). A partner with high learning scores but low deals may need sales support.

---

## Integration Point 7: Progress Tracking

### Data Synced to Allbound

| Metric | Update Frequency | Display |
|---|---|---|
| Overall learning progress (%) | Real-time (webhook) | Progress bar on partner profile |
| Current learning path | Real-time | Text field on partner profile |
| Modules completed | Daily batch | Number on partner scorecard |
| Labs completed | Real-time (webhook) | Number on partner scorecard |
| Last activity date | Daily batch | Date on partner profile |
| Time spent learning | Weekly batch | Hours on partner scorecard |
| Team completion rates | Weekly batch | Percentage on org scorecard |

### Manager Dashboard in Allbound

Partner managers see an "Enablement" tab in Allbound with:
- Team learning progress overview
- Individual team member status
- Certification pipeline (who's studying for what)
- Overdue modules and at-risk learners
- Comparison to peer organizations

**WHY progress tracking in Allbound**: Partner managers live in Allbound. If they have to log into Mend Learn to check team progress, they won't. Embedding progress in Allbound makes enablement data part of the natural workflow. This is the difference between "nice to have" learning data and "integrated into decisions" learning data.

---

## Integration Point 8: Deal Registration Incentives

### Certification-Linked Deal Benefits

| Scenario | Incentive |
|---|---|
| Sales rep is Sales Specialist certified | +2% deal registration discount |
| SE is Technical Specialist certified | Priority POC support from Mend.io SE team |
| Both rep and SE certified on deal | +5% combined discount + fast-track approval |
| Partner org has 80%+ team certification rate | Premium tier benefits (regardless of current tier) |
| Partner registers deal within 30 days of certification | Bonus 500 XP + "Fast Start" badge |

### Implementation

- Allbound deal registration form checks certification status via API
- If certified, additional discounts are automatically applied
- If not certified, form displays message: "Get certified to unlock additional discounts →" (links to Mend Learn)
- Monthly report: "Revenue from certified vs. uncertified partners"

**WHY certification-linked incentives**: This is the ultimate alignment mechanism. Partners who invest in learning get better economics. Mend.io gets better-prepared partners who close deals faster and create fewer support issues. Cisco and Palo Alto both report that certified partners have 50% shorter sales cycles and 30% higher win rates. Linking discounts to certification makes the ROI of learning tangible and immediate.

---

## Integration Point 9: Partner Tiers

### Tier Requirements (Learning Component)

| Tier | Learning Requirements | Allbound Configuration |
|---|---|---|
| Registered | 1 team member Level 1 complete | Auto-assign on Level 1 completion |
| Silver | 2 Associate certifications | Auto-evaluate on cert sync |
| Gold | 2 Professional + 1 Technical Specialist | Auto-evaluate on cert sync |
| Platinum | 3 Professional + 2 Technical Specialist + 1 Expert | Auto-evaluate on cert sync |
| Diamond | All above + Master Architect + 5,000 org XP/quarter | Manual review + auto-metrics |

### Tier Evaluation Logic

```
ON certification_earned OR quarterly_review:
  1. Count active certifications for partner org
  2. Check certification types against tier requirements
  3. Check quarterly XP (for Diamond tier)
  4. IF meets next tier requirements:
     - Update tier in Allbound
     - Notify partner manager
     - Unlock new benefits
     - Send congratulations email
  5. IF drops below current tier requirements (cert expiry):
     - Send warning (60 days grace period)
     - If not remediated, downgrade tier
     - Notify partner manager
```

**WHY automated tier evaluation**: Manual tier management doesn't scale and creates disputes ("we should be Gold!"). Automated evaluation tied to objective learning data is transparent and fair. Partners can see exactly what they need for the next tier and self-serve their way up.

---

## Technical Implementation Summary

| Component | Technology | Priority |
|---|---|---|
| SSO | SAML 2.0 / OIDC | Phase 1 (MVP) |
| User Sync (Allbound → Learn) | Allbound API + Webhooks | Phase 1 (MVP) |
| Certification Status Sync | Webhooks + REST API | Phase 1 (MVP) |
| Badge Display | Credly API + Allbound custom fields | Phase 1 (MVP) |
| Progress Tracking | REST API + daily batch sync | Phase 2 |
| Points/Leaderboard Widget | Embeddable iframe or API | Phase 2 |
| Deal Registration Integration | Allbound API hooks | Phase 2 |
| Manager Dashboard | Custom Allbound page/tab | Phase 2 |
| Tier Automation | Allbound automation rules + Mend Learn API | Phase 3 |
| Analytics Sync | BI pipeline (Allbound → data warehouse) | Phase 3 |
