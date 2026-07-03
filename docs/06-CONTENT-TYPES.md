# 6. Content Types

## Design Philosophy

Content types follow the **70-20-10 Learning Model**: 70% experiential (labs, simulations, practice), 20% social (discussions, roleplay, mentoring), 10% formal (videos, reading). Most learning platforms invert this ratio, producing passive consumers who can't apply knowledge.

**WHY 70-20-10**: Research from the Center for Creative Leadership shows that experiential learning produces 4x better skill transfer than passive consumption. Partners need to DO things (run demos, configure policies, handle objections), not just watch videos about them. Every content type below is chosen for its contribution to this ratio.

---

## Experiential Content (70%)

### Interactive Labs (Hands-On)

**What**: Browser-based lab environments with real Mend.io instances where partners complete guided or open-ended tasks.

**Examples**:
- Configure SCA scanning for a Java project with 50+ dependencies
- Set up CI/CD integration with GitHub Actions
- Build a custom policy that blocks critical vulnerabilities
- Troubleshoot a broken integration (intentionally misconfigured)

**WHY**: Labs are the single most impactful content type. AWS Skill Builder's labs drive 85% of skill transfer. Partners who complete labs are 3x more likely to successfully deploy Mend.io at customer sites. Labs also reduce Mend.io's support burden by training partners before they engage customers.

**Implementation**: Use a cloud lab provider (e.g., Instruqt, Skillable, or CloudShare) to provision sandboxed Mend.io environments on demand. Labs auto-validate completion via API checks.

### Product Walkthroughs (Interactive Tours)

**What**: Guided, click-through tours of the Mend.io platform with annotations, tooltips, and embedded quizzes.

**Examples**:
- Navigate the Mend.io dashboard and understand each widget
- Walk through the vulnerability detail page and remediation flow
- Explore the policy configuration interface

**WHY**: Walkthroughs bridge the gap between videos (passive) and labs (complex). They let partners explore the product at their own pace without needing a full lab environment. Pendo and WalkMe data shows that guided walkthroughs increase feature adoption by 60%.

**Implementation**: Build with a tool like Navattic, Storylane, or custom React components. Walkthroughs should be embeddable in any module.

### Simulations (Scenario-Based)

**What**: Realistic customer scenarios where partners make decisions and see consequences.

**Examples**:
- "You're in a POC. The customer's CISO asks why Mend.io flagged 200 vulnerabilities when Snyk only found 50. What do you say?" → Branch based on response quality
- "A customer wants to block all builds with critical vulnerabilities but their dev team pushes back. Design a phased rollout policy." → Submit policy design, receive AI feedback
- "You discover a critical vulnerability in a customer's production dependency. Walk through the incident response." → Timed simulation

**WHY**: Simulations build judgment, not just knowledge. They force partners to apply learning in context, which is how real customer engagements work. Medical education has used simulation-based training for decades with proven outcomes; tech is just catching up.

### Demo Recordings (Practice + Library)

**What**: Pre-recorded demos that partners watch and then record their own versions for self-assessment or certification.

**Examples**:
- "The 15-Minute SCA Demo" - standard demo script delivered by a Mend.io SE
- "Enterprise SAST Demo" - technical deep-dive demo for security teams
- "Executive Demo" - business-value-focused demo for CISOs

**WHY**: Demo delivery is the SE's most critical skill. Watching good demos teaches structure and messaging. Recording their own demos builds muscle memory and confidence. Cisco's dCloud demo library is the gold standard for this approach.

### AI Roleplay (Objection Handling & Pitch Practice)

**What**: AI-powered conversational simulations where partners practice sales conversations with realistic buyer personas.

**Examples**:
- "Pitch Mend.io to a skeptical VP of Engineering who loves open-source tools"
- "Handle objections from a CISO who's loyal to their current Snyk deployment"
- "Deliver a 2-minute elevator pitch to a CTO you meet at a conference"
- "Negotiate pricing with a procurement director who's comparing three vendors"

**WHY**: Sales is a performance skill that improves with repetition, not reading. AI roleplay provides unlimited, judgment-free practice at any time. Second Nature AI and Rehearsal VRP data shows that sales reps who practice with AI roleplay close 20% more deals and ramp 30% faster.

---

## Social Content (20%)

### Community Forums / Discussion

**What**: Moderated discussion boards organized by topic, product, and region.

**Topics**:
- Technical Q&A (product-specific channels)
- Sales strategy sharing
- Customer success stories
- Feature requests and feedback
- Regional partner networking

**WHY**: Peer learning is the most underutilized content type in partner enablement. Partners trust other partners more than vendor materials. Cisco's Partner Community generates 40% of support answers from peers, reducing vendor support costs while increasing partner satisfaction.

### Customer Scenarios (Case-Based Discussion)

**What**: Detailed anonymized customer scenarios posted for group analysis and discussion.

**Examples**:
- "A financial services firm with 500 developers needs to comply with DORA. How would you architect their Mend.io deployment?"
- "An MSSP wants to offer Mend.io as a managed service to 50 SMB customers. Design their operating model."

**WHY**: Case-based learning is the MBA model applied to technical enablement. Discussing real scenarios with peers develops judgment that no quiz can test. It also surfaces partner expertise that Mend.io can leverage for content creation.

### Peer Mentoring

**What**: Structured mentoring program pairing new partners with experienced, certified partners.

**Mechanics**:
- Mentors: Must be Professional or Expert certified + 6 months active
- Mentees: Any new partner in first 90 days
- Format: 30-minute bi-weekly calls + async messaging
- Duration: 3-month program
- Reward: Mentors earn 5 CEU per mentee cycle + Mentor badge

**WHY**: Mentoring creates emotional connection to the platform and the partner community. Partners with mentors are 2x more likely to achieve certification (source: Cisco Partner Program data). It also creates a pipeline of community leaders and brand advocates.

---

## Formal Content (10%)

### Video Lessons

**What**: Short, focused video lessons (5-15 minutes) with embedded knowledge checks.

**Production Standards**:
- Professional quality (studio or high-quality remote recording)
- Expert presenters (Mend.io product team, field SEs, or certified partners)
- Closed captions in English (auto-translate for other languages)
- Chaptered for easy navigation
- Maximum 15 minutes (shorter is better)

**WHY**: Videos are necessary for initial knowledge transfer but should be the smallest content type. They're passive, have low retention (10% after 30 days without reinforcement), and are expensive to keep updated. The 15-minute cap follows Khan Academy and Coursera research showing attention drops sharply after 12 minutes.

### Knowledge Checks (Quizzes)

**What**: Short assessments embedded within or after modules.

**Formats**:
- Multiple choice (4 options, 1 correct)
- Multiple select (4-6 options, 2-3 correct)
- Drag-and-drop (ordering, matching)
- True/False with explanation
- Scenario-based ("What should you do?")

**WHY**: Knowledge checks serve two purposes: (1) reinforce learning through active recall, and (2) gate progression to ensure readiness for the next module. They should be formative (learning-focused), not just summative (grade-focused). Immediate feedback with explanations is critical for the learning effect.

### PDF Guides & Cheat Sheets

**What**: Downloadable reference documents for quick access during customer engagements.

**Examples**:
- Mend.io Quick Reference Card (2-page product overview)
- Competitive Battlecard: Mend vs. Snyk (2 pages)
- Competitive Battlecard: Mend vs. Veracode (2 pages)
- Competitive Battlecard: Mend vs. Checkmarx (2 pages)
- POC Success Criteria Template (1 page)
- Customer Discovery Questions Cheat Sheet (1 page)
- Pricing Calculator Quick Guide (1 page)
- Integration Compatibility Matrix (1 page)

**WHY**: Partners need offline, at-a-glance resources during live customer meetings. PDF battlecards are the most-used partner resource across all vendor programs (Forrester Partner Enablement survey). They complement but don't replace interactive learning.

### Playbooks

**What**: Comprehensive, step-by-step guides for specific partner activities.

**Examples**:
- Partner Sales Playbook (end-to-end deal process)
- POC Execution Playbook (technical evaluation management)
- MSSP Onboarding Playbook (managed service setup)
- Enterprise Deployment Playbook (large-scale rollout)
- Competitive Displacement Playbook (ripping out a competitor)

**WHY**: Playbooks are "do this, then this, then this" guides that reduce cognitive load during complex activities. They're the bridge between learning (I understand) and doing (I can execute). HubSpot's partner playbooks are cited as best practice by Forrester.

### Microlearning

**What**: 3-5 minute bite-sized learning units designed for mobile consumption.

**Examples**:
- "1 Vulnerability, 1 Minute" - daily vulnerability spotlight
- "Mend.io Tip of the Day" - feature highlight
- "Quick Objection" - single objection + response
- "Product Update" - new feature summary

**WHY**: Microlearning fills the gap between formal training sessions. It maintains learning momentum without requiring dedicated time blocks. Sales reps consume microlearning between meetings, in airports, and during commutes. Axonify research shows that 3-5 minute daily microlearning improves long-term retention by 50%.

---

## Content Priority Matrix

| Content Type | Impact | Effort | Priority | Phase |
|---|---|---|---|---|
| Interactive Labs | Very High | High | P1 | MVP |
| Product Walkthroughs | High | Medium | P1 | MVP |
| Video Lessons | Medium | Medium | P1 | MVP |
| Knowledge Checks | High | Low | P1 | MVP |
| PDF Battlecards | High | Low | P1 | MVP |
| Playbooks | High | Medium | P1 | MVP |
| AI Roleplay | Very High | High | P2 | Phase 2 |
| Simulations | High | High | P2 | Phase 2 |
| Demo Recordings | High | Medium | P2 | Phase 2 |
| Community Forums | Medium | Medium | P2 | Phase 2 |
| Customer Scenarios | Medium | Low | P2 | Phase 2 |
| Microlearning | Medium | Low | P3 | Phase 3 |
| Peer Mentoring | Medium | Medium | P3 | Phase 3 |
| Cheat Sheets | Medium | Low | P1 | MVP |

**WHY this prioritization**: MVP must include the minimum content that enables a partner to learn, certify, and start selling. Labs, walkthroughs, and videos provide the learning. Knowledge checks validate it. Battlecards and playbooks enable the selling. Phase 2 adds the high-impact but high-effort experiential content (AI roleplay, simulations). Phase 3 adds community and ongoing engagement content.
