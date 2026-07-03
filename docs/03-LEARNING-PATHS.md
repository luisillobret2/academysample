# 3. Learning Paths

## Design Philosophy

Learning paths follow **Bloom's Taxonomy progression**: Level 1 (Remember/Understand) → Level 2 (Apply/Analyze) → Level 3 (Evaluate/Create). Each level gates the next, ensuring partners build genuine competency rather than skipping to advanced content.

**WHY progressive gating**: Ungated platforms (like early Snyk Learn) see high bounce rates on advanced content because users lack prerequisites. Microsoft Learn's prerequisite system reduces support tickets by 35% and increases completion rates by 50%. Partners who skip foundations create poor customer experiences that damage the Mend.io brand.

---

## Foundation Track (Required for All Roles)

### Level 1: Security & Platform Foundations

| Module | Duration | Format | Description |
|---|---|---|---|
| Application Security Fundamentals | 30 min | Video + Quiz | OWASP Top 10, threat landscape, why AppSec matters. Sets the baseline regardless of prior security knowledge. |
| Why Software Supply Chain Security Matters | 30 min | Interactive | Supply chain attack case studies (SolarWinds, Log4j, Codecov), risk quantification, regulatory trends. Creates urgency and market context for selling Mend.io. |
| Mend.io Platform Overview | 45 min | Product Tour + Video | Unified platform walkthrough: SCA, SAST, Container, Secrets, Supply Chain. Partners understand the full portfolio before specializing. |
| The Mend.io Difference | 20 min | Video + Battlecard | Competitive positioning vs. Snyk, Veracode, Checkmarx, SonarQube. Critical for sales and pre-sales personas to articulate differentiation. |

**Completion reward**: 200 XP + "Foundation Complete" badge
**Unlocks**: Level 2 product tracks, role-specific paths

---

## Product Tracks (Level 2)

### SCA (Software Composition Analysis)

| Module | Duration | Format | Prerequisites |
|---|---|---|---|
| SCA Concepts & Methodology | 30 min | Video + Reading | Level 1 |
| Mend SCA: Feature Deep Dive | 45 min | Interactive Tour | Level 1 |
| Vulnerability Prioritization with Mend | 30 min | Simulation | SCA Concepts |
| License Compliance Management | 30 min | Video + Lab | SCA Concepts |
| SCA Policy Configuration | 45 min | Hands-on Lab | Feature Deep Dive |
| SCA Reporting & Dashboards | 30 min | Lab | Feature Deep Dive |
| SCA Integration Patterns | 60 min | Lab | SCA Policy Config |
| Knowledge Check: SCA | 30 min | Exam | All above |

**WHY SCA first**: SCA is Mend.io's heritage product with the deepest market penetration. Most partner deals start with SCA. Making partners expert here first maximizes early pipeline.

### SAST (Static Application Security Testing)

| Module | Duration | Format | Prerequisites |
|---|---|---|---|
| SAST Concepts & Methodology | 30 min | Video + Reading | Level 1 |
| Mend SAST: Feature Deep Dive | 45 min | Interactive Tour | Level 1 |
| Code Analysis & Remediation | 45 min | Guided Lab | SAST Concepts |
| SAST Rule Configuration | 30 min | Lab | Feature Deep Dive |
| Custom Rules & Policies | 45 min | Lab | SAST Rule Config |
| SAST in CI/CD Pipelines | 60 min | Lab | SAST Rule Config |
| False Positive Management | 30 min | Simulation | Code Analysis |
| Knowledge Check: SAST | 30 min | Exam | All above |

**WHY SAST as separate track**: SAST requires fundamentally different positioning (code analysis vs. dependency analysis). SEs need to demo both workflows distinctly. Combining them creates confusion in customer conversations.

### Secrets Detection

| Module | Duration | Format | Prerequisites |
|---|---|---|---|
| Secrets Detection Overview | 20 min | Video | Level 1 |
| Mend Secrets: Feature Deep Dive | 30 min | Interactive Tour | Level 1 |
| Secrets Scanning Configuration | 30 min | Lab | Feature Deep Dive |
| Incident Response Workflows | 30 min | Simulation | Secrets Overview |
| Historical Scanning & Remediation | 30 min | Lab | Scanning Config |
| Knowledge Check: Secrets | 20 min | Exam | All above |

### Container Security

| Module | Duration | Format | Prerequisites |
|---|---|---|---|
| Container Security Fundamentals | 30 min | Video + Reading | Level 1 |
| Mend Container: Feature Deep Dive | 45 min | Interactive Tour | Level 1 |
| Image Scanning & Analysis | 45 min | Lab | Container Fundamentals |
| Base Image Recommendations | 30 min | Lab | Image Scanning |
| Registry Integration | 45 min | Lab | Feature Deep Dive |
| Kubernetes Security Scanning | 45 min | Lab | Image Scanning |
| Knowledge Check: Container | 30 min | Exam | All above |

### Supply Chain Security

| Module | Duration | Format | Prerequisites |
|---|---|---|---|
| Supply Chain Threat Landscape | 30 min | Video + Case Studies | Level 1 |
| Mend Supply Chain: Feature Deep Dive | 45 min | Interactive Tour | Level 1 |
| SBOM Generation & Management | 30 min | Lab | Threat Landscape |
| Dependency Risk Scoring | 30 min | Lab | Feature Deep Dive |
| Policy Enforcement for Supply Chain | 45 min | Lab | SBOM Generation |
| Provenance & Attestation | 30 min | Video + Lab | Dep Risk Scoring |
| Knowledge Check: Supply Chain | 30 min | Exam | All above |

### Mend Platform (Unified)

| Module | Duration | Format | Prerequisites |
|---|---|---|---|
| Prioritization Engine | 45 min | Lab | Any 2 product tracks |
| Unified Policy Management | 45 min | Lab | Any 2 product tracks |
| Cross-Product Reporting | 30 min | Lab | Prioritization Engine |
| Governance & Compliance | 45 min | Lab + Simulation | Unified Policy |
| Enterprise Deployment Patterns | 60 min | Architecture Workshop | All platform modules |
| Knowledge Check: Platform | 30 min | Exam | All above |

**WHY a unified platform track**: Most enterprise deals involve multiple Mend products. Partners must understand how products work together, not just individually. This track is the bridge to Expert-level certifications.

---

## Role-Specific Tracks (Level 2)

### Sales Track

| Module | Duration | Format | Prerequisites |
|---|---|---|---|
| Mend.io Market Positioning | 30 min | Video + Battlecard | Level 1 |
| Ideal Customer Profile & Personas | 20 min | Reading + Quiz | Level 1 |
| Discovery Questions Framework | 30 min | Simulation | Market Positioning |
| Competitive Differentiation | 30 min | Battlecard + Roleplay | Market Positioning |
| Pricing & Packaging | 20 min | Video + Calculator | ICP & Personas |
| Objection Handling (Top 15) | 45 min | AI Roleplay | Discovery Questions |
| Customer Success Stories | 20 min | Case Study Library | ICP & Personas |
| Deal Registration & Partner Benefits | 15 min | Walkthrough | All above |
| The Perfect Pitch: Live Practice | 30 min | AI Roleplay + Recording | All above |

**WHY objection handling via AI roleplay**: Static objection-handling documents have < 15% recall after 30 days. Interactive roleplay achieves 65% recall (source: Gartner sales enablement research). AI roleplay is scalable, available 24/7, and provides personalized feedback.

### Technical / SE Track

| Module | Duration | Format | Prerequisites |
|---|---|---|---|
| Demo Environment Setup | 30 min | Lab | Level 1 |
| Standard Demo Flow: SCA | 45 min | Lab + Recording | Demo Env Setup |
| Standard Demo Flow: SAST | 45 min | Lab + Recording | Demo Env Setup |
| POC Planning & Execution | 45 min | Playbook + Simulation | Both demo flows |
| Technical Discovery Questions | 30 min | Simulation | Level 1 |
| Integration Architecture Patterns | 60 min | Lab | POC Planning |
| Competitive Technical Comparison | 30 min | Lab + Battlecard | Any 2 product tracks |
| Customer Workshop Facilitation | 45 min | Simulation | All above |

### Developer Track

| Module | Duration | Format | Prerequisites |
|---|---|---|---|
| Mend.io for Developers | 30 min | Interactive Tutorial | Level 1 |
| IDE Plugin Setup & Usage | 30 min | Lab | Mend for Devs |
| CLI Scanning | 30 min | Lab | Mend for Devs |
| GitHub Actions / GitLab CI Integration | 45 min | Lab | CLI Scanning |
| API Deep Dive | 60 min | Lab + API Explorer | CLI Scanning |
| Custom Integrations & Webhooks | 60 min | Lab | API Deep Dive |
| Contributing to the Mend Ecosystem | 20 min | Reading | API Deep Dive |

**WHY a developer track**: Technology partners and GSIs employ developers who build integrations with Mend.io. This track serves integration engineers, not end-user developers. It reduces support burden and accelerates technology partnership value.

### Executive / Practice Leader Track

| Module | Duration | Format | Prerequisites |
|---|---|---|---|
| AppSec Market Opportunity | 15 min | Executive Brief | None |
| Building a Mend.io Practice | 30 min | Playbook | Market Opportunity |
| Partner Economics & ROI | 20 min | Calculator + Case Study | Market Opportunity |
| Go-to-Market Planning | 30 min | Template + Workshop | Building a Practice |
| Customer Advisory Board Insights | 15 min | Video | None |
| Quarterly Business Review Prep | 20 min | Template | Partner Economics |

**WHY an executive track**: Practice leaders control resource allocation. If they don't see ROI in the Mend.io partnership, they won't assign SEs and reps. Short, business-focused modules with ROI calculators address their decision criteria directly. Palo Alto Networks' Beacon platform proves that executive tracks increase partner investment by 40%.

---

## Expert Tracks (Level 3)

### Enterprise Architecture

| Module | Duration | Format | Prerequisites |
|---|---|---|---|
| Multi-Tenant Architecture Design | 60 min | Workshop | Platform Unified track |
| High-Availability & Disaster Recovery | 45 min | Architecture Lab | Multi-Tenant |
| Performance Tuning & Optimization | 45 min | Lab | Multi-Tenant |
| Compliance & Governance Frameworks | 60 min | Lab + Simulation | Platform Unified track |
| Migration Strategies (Competitor → Mend) | 45 min | Playbook + Lab | All above |

### CI/CD & DevOps Integration

| Module | Duration | Format | Prerequisites |
|---|---|---|---|
| Advanced Pipeline Design Patterns | 60 min | Lab | Any product CI/CD module |
| GitOps Integration | 45 min | Lab | Pipeline Design |
| Infrastructure-as-Code Scanning | 45 min | Lab | Pipeline Design |
| Custom Workflow Automation | 60 min | Lab | Pipeline Design |
| Multi-Tool Orchestration | 45 min | Lab | Custom Workflow |

### API & Reporting

| Module | Duration | Format | Prerequisites |
|---|---|---|---|
| Advanced API Usage Patterns | 60 min | Lab | Developer Track API module |
| Custom Dashboard Development | 45 min | Lab | Advanced API |
| Executive Reporting Automation | 45 min | Lab | Custom Dashboard |
| Data Export & BI Integration | 45 min | Lab | Custom Dashboard |
| Compliance Reporting Templates | 30 min | Lab + Templates | Executive Reporting |

### Managed Security Services (MSSP-Specific)

| Module | Duration | Format | Prerequisites |
|---|---|---|---|
| Multi-Customer Management | 45 min | Lab | Enterprise Architecture |
| MSSP Operations Playbook | 60 min | Playbook + Lab | Multi-Customer |
| SLA Management & Alerting | 30 min | Lab | MSSP Operations |
| White-Label Reporting | 30 min | Lab | MSSP Operations |
| MSSP Go-to-Market | 30 min | Playbook | All above |

**WHY MSSP-specific content**: MSSPs represent the fastest-growing partner segment in cybersecurity. They have unique requirements (multi-tenancy, white-labeling, SLA management) that generic admin training doesn't address. Dedicated MSSP content signals that Mend.io understands their business model.

---

## Learning Path Summary

| Track | Modules | Total Duration | Target Persona |
|---|---|---|---|
| Foundation (L1) | 4 | 2 hrs 5 min | Everyone |
| SCA (L2) | 8 | 5 hrs | All technical + sales |
| SAST (L2) | 8 | 5 hrs | All technical + sales |
| Secrets (L2) | 6 | 2 hrs 40 min | All technical |
| Container (L2) | 7 | 4 hrs 30 min | All technical |
| Supply Chain (L2) | 7 | 4 hrs | All technical |
| Platform Unified (L2) | 6 | 4 hrs 15 min | SEs + Architects |
| Sales (L2) | 9 | 4 hrs 20 min | Sales reps |
| Technical/SE (L2) | 8 | 5 hrs 30 min | SEs + Pre-Sales |
| Developer (L2) | 7 | 4 hrs 35 min | Developers + Tech Partners |
| Executive (L2) | 6 | 2 hrs 10 min | Practice leaders |
| Enterprise Architecture (L3) | 5 | 4 hrs 15 min | Architects + Admins |
| CI/CD & DevOps (L3) | 5 | 4 hrs 15 min | DevOps + Admins |
| API & Reporting (L3) | 5 | 3 hrs 45 min | Developers + Admins |
| MSSP Operations (L3) | 5 | 3 hrs 15 min | MSSP partners |
