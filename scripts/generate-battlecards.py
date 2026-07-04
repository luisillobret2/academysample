#!/usr/bin/env python3
"""Generate competitive battlecard pages for Mend Learn.

Content is sourced from mend.io's public "Compare by AppSec" pages
(https://www.mend.io/mend-vs-<competitor>/). Re-run to regenerate all
battlecard-*.html files at the repo root. Idempotent.
"""
import html
import os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# Shared Mend proof points shown on every battlecard.
PROOF = [
    ("10x", "Faster SAST scans than traditional tools"),
    ("+38%", "Better SAST precision"),
    ("+48%", "Better SAST recall"),
    ("200+", "Languages &amp; frameworks supported"),
    ("1.7B", "Mend Renovate installs powering upgrade paths"),
    ("70%", "Risk reduction reported by AppSec teams"),
]

COMPETITORS = {
    "snyk": {
        "name": "Snyk",
        "short": "Developer-first SCA/SAST",
        "tagline": "Snyk is developer-friendly, but coverage, accuracy, and pricing gaps show at enterprise scale.",
        "intro": "Snyk is the most common competitor in Mend.io deals. It wins on developer love and quick onboarding, but users report noisy SAST results, a 1MB file cap, tiered per-product pricing, and AI security still in preview. Lead with accuracy, deep license governance, and production-ready AI security.",
        "features": [
            ("AI inventory &amp; AI BoM", "Continuously inventories AI models, agents, RAGs, and frameworks; generates AI Bills of Materials.", "AI component discovery requires a separate product layer; not native to core AppSec."),
            ("AI hardening &amp; red teaming", "Discovers and hardens system prompt weaknesses, then red-teams for prompt injection, bias, and exfiltration.", "Agent Guard in private preview. Not yet GA."),
            ("Reachability", "Filters non-reachable findings and prioritizes by app-specific severity, lowering MTTR.", "Risk scoring helps, but users report high false-positive volumes at scale needing manual triage."),
            ("License compliance", "File-level detection, conflict analysis, and legal insights; proactively blocks non-compliant licenses.", "Identifies licenses but lacks conflict resolution and legal guidance."),
            ("Scan reliability", "High-performance scans on commit; SAST 10x faster with +38% precision and +48% recall.", "Silent failures, missed detections, CLI inconsistencies, complaints of false positives/negatives in SAST."),
            ("Dependency management", "Leverages 1.7B Renovate pulls and Merge Confidence for optimal upgrade paths.", "Not as broad in language and configuration depth; no beta version suggestions."),
        ],
        "wins": [
            ("Scan accuracy that reduces risk", "Mend SAST scans 10x faster with +38% precision and +48% recall, every commit, every file. Snyk users report noisy SAST and a 1MB cap that silently skips critical code."),
            ("AI security production-ready today", "Mend AI delivers continuous AI inventory, AI BoM, prompt hardening, and red teaming, all GA. Snyk's Agent Guard remains in private preview."),
            ("License governance that goes deep", "Mend.io detects license conflicts at the file level and provides legal insights. Snyk lists licenses but lacks conflict analysis."),
            ("Simple pricing that scales", "Transparent pricing with no scan limits. Snyk's tiered per-product pricing piles on extra contracts and add-ons."),
        ],
        "quotes": [],
    },
    "veracode": {
        "name": "Veracode",
        "short": "Established enterprise SAST",
        "tagline": "Veracode is enterprise-proven but heavy: consulting-led rollouts, queue-based scans, and per-app pricing.",
        "intro": "Veracode is a legacy enterprise AppSec incumbent. It carries brand trust but frustrates modern teams with compiling requirements, queue-based scans, legacy dashboards, and unpredictable per-app/per-scan costs. Win on time-to-value, developer flow, and unified AI coverage.",
        "features": [
            ("Deployment &amp; onboarding", "Lightweight setup, seamless CI/CD + IDE integrations, fast time-to-value.", "Heavy rollout, consulting-dependent, complex configuration."),
            ("Scanning performance &amp; UX", "One unified engine with instant feedback in PRs and IDEs.", "Compiling requirements, slow scans, queue-based, legacy dashboards."),
            ("Noise &amp; prioritization", "Reachability-based filtering + AI-powered triage for actionable results.", "High false positives, manual triage burden."),
            ("Remediation &amp; automation", "AI-generated fixes, grouped PRs, automated dependency updates.", "AI-powered fixes for SAST only."),
            ("License governance", "File-level detection, dual-license conflict checks, automated workflows.", "Limited to open-source license policy checks only."),
            ("AI security coverage", "Secures AI-generated code, AI components, and AI behavioral risks; maintains AI BoM and hardens prompts.", "AI-generated code coverage only."),
            ("Pricing &amp; scale", "Unlimited scans and apps, transparent elastic pricing.", "Per-app/per-scan pricing, unpredictable costs."),
            ("Language coverage", "200+ modern stacks and frameworks.", "Narrower and slower language support expansion."),
        ],
        "wins": [
            ("Secure what Veracode can't", "Mend.io extends protection beyond code to secure AI models, prompts, and components that drive modern applications."),
            ("Purchase to protection in one sprint", "Mend.io deploys in hours, not weeks, and scales across repos, pipelines, and teams. No consultants required."),
            ("Clarity in cost, confidence in coverage", "Unlimited scans, transparent pricing, predictable ROI. No per-scan penalties or performance slowdowns."),
            ("Fix in flow, not in a queue", "Instant feedback in IDEs and PRs, automated fix PRs, and AI-powered remediation let developers fix in flow."),
        ],
        "quotes": [],
    },
    "checkmarx": {
        "name": "Checkmarx",
        "short": "Established SAST / ASPM",
        "tagline": "Checkmarx has deep SAST heritage but is slow, noisy, and expensive to operate at scale.",
        "intro": "Checkmarx is a long-standing SAST vendor. It offers broad coverage but is widely cited for slow, resource-intensive scans, high false positives requiring dedicated triage staff, and escalating TCO from managed services. Win on scan speed, precision, and total cost of ownership.",
        "features": [
            ("AI inventory &amp; AI BoM", "Continuously inventories AI models, agents, RAGs, and frameworks; generates AI Bills of Materials.", "Some AI asset scanning, but dedicated AI inventory and AI BoM are not core capabilities."),
            ("AI hardening &amp; red teaming", "Hardens system prompt weaknesses and red-teams for prompt injection, bias, and exfiltration.", "No AI red teaming capability."),
            ("Scan speed &amp; accuracy", "High-performance scans on commit; 10x faster with +38% precision and +48% recall, no file size limits.", "Resource-intensive scans with performance delays at scale; high false positives needing manual tuning."),
            ("Malicious package detection", "Behavioral analysis, heuristics, and real-time intelligence catch threats signatures miss.", "Limited, signature-based approach."),
            ("Compliance &amp; governance", "File-level license detection, conflict analysis, and legal insights; blocks non-compliant packages.", "Complex setup, relies on custom scripts."),
            ("Pricing &amp; scalability", "Transparent, developer-based pricing includes dedicated support.", "High cost, requires managed services."),
        ],
        "wins": [
            ("Scans that don't slow you down", "Mend SAST scans 10x faster with +38% precision and +48% recall, no file size limits. Checkmarx users cite slow, resource-intensive scans as a primary frustration."),
            ("AI security beyond code scanning", "Mend AI inventories models and agents, generates AI BoM, hardens prompts, and runs red teaming. Checkmarx centers on AI-generated code and ASPM correlation only."),
            ("Fewer false positives, faster triage", "Mend.io prioritizes real risks with reachability context and automated remediation. Checkmarx is widely reported to generate high false-positive volumes."),
            ("Simple pricing that scales", "Transparent pricing with no scan limits. Checkmarx TCO escalates through managed services fees, premium support, and add-on modules."),
        ],
        "quotes": [],
    },
    "black-duck": {
        "name": "Black Duck",
        "short": "Legacy SCA / license compliance",
        "tagline": "Black Duck built its name on compliance, but compliance isn't security, and it isn't speed.",
        "intro": "Black Duck (now part of a fragmented Coverity + Black Duck + Polaris + Seeker portfolio) is strong on open-source license compliance but relies on legacy, service-heavy tooling with disjointed licensing and no AI security. Win on unified platform, deployment speed, and modern AI coverage.",
        "features": [
            ("Unified AppSec platform", "Unified cloud-native platform for SAST, SCA, Container, and AI Security, tightly integrated.", "Fragmented legacy tools (Coverity, Black Duck, Seeker) requiring separate deployments and training."),
            ("IDE experience", "Real-time, in-IDE remediation (VS Code, IntelliJ, AI-native IDEs) with actionable fixes.", "Limited IDE plugins; often forces devs into external portals."),
            ("AI-powered remediation &amp; AI security", "AI remediation, AI-generated code support, AI components, and AI red teaming built in.", "No AI-security offering; no AI-generated code remediation or model-level governance."),
            ("Automated dependency updates", "Mend Renovate Enterprise auto-PRs for public/private packages with auto-fix workflows.", "No native automated dependency updates; lower patch velocity."),
            ("Scalable modern deployment", "Hybrid SaaS, hosted cloud, or dedicated instance; fast rollout.", "On-prem or legacy hybrid setups, complex maintenance, slower time-to-value."),
            ("Transparent pricing, single SKU", "Simple, transparent pricing with no scan limits or hidden upsells.", "Disjointed licensing across Coverity, Black Duck, and Polaris; unpredictable pricing."),
            ("Faster time-to-fix", "Best-fix location surfaced across sources/sinks; remediate directly in pull requests.", "Generic guidance; transitive dependency issues lead to longer remediation cycles."),
        ],
        "wins": [
            ("Faster, simpler deployment", "Black Duck's multi-component rollout can take weeks and needs consultants. Mend.io deploys in minutes, cloud-native and integrated into SCM, CI/CD, and IDEs."),
            ("Shorter MTTR, happier devs", "Mend.io automates remediation with auto-PRs, Merge Confidence, and in-IDE fixes, plus reachability-based prioritization that spots what's truly exploitable."),
            ("Security that understands AI", "Mend.io covers AI-generated code, AI components, behavioral AI risks, and AI BoM, and runs AI Red Teaming, visibility legacy tools lack."),
            ("Simple pricing that scales", "Transparent pricing with no scan limits. Black Duck's modular model (Black Duck + Coverity + Polaris) piles on contracts, add-ons, and service fees."),
        ],
        "quotes": [
            ("Accuracy", "It's still a bit inconsistent. Sometimes a scan reveals components or vulnerabilities, and the next day they don't show up. It doesn't clearly show whether vulnerabilities are direct or transitive.", "The accuracy of vulnerability detection is impressive, and we have rarely encountered false positives."),
            ("Cost", "The price charged by Black Duck is exorbitant. There are many other products that offer better features and support at a lower cost.", "The pricing is reasonable and scalable, making it a good fit for our growing business."),
            ("Integration", "Black Duck SCA lacks integration with IntelliJ IDEA and needs more native integration with Coverity.", "The integration with our existing tools (JIRA, Jenkins) was seamless, saving us a lot of time and effort."),
            ("Support", "I don't find reliable or feasible documents to help me debug issues, and contacting support is difficult.", "The support team is knowledgeable and responsive, and the documentation is thorough and easy to understand."),
        ],
    },
    "github-advanced-security": {
        "name": "GitHub Advanced Security",
        "short": "GHAS - native GitHub AppSec",
        "tagline": "GHAS is convenient inside GitHub, but it stops at the edge of the GitHub ecosystem.",
        "intro": "GitHub Advanced Security (GHAS) is attractive for GitHub-native teams, but it only covers the GitHub/Azure DevOps ecosystem, lacks reachability, and struggles with false positives and scale, especially as AI-generated code volume grows. Win on ecosystem breadth, prioritization, and enterprise policy control.",
        "features": [
            ("Supported ecosystems", "GitHub, Azure, GitLab, Bitbucket, or self-hosted, plus IDEs, package managers, and CI/CD tools.", "GitHub and Azure DevOps ecosystem only."),
            ("AI &amp; AppSec coverage", "AI, SAST, SCA, Container, and automated dependency updates.", "SAST, secrets, dependency updates; incomplete for modern AI risk."),
            ("Accuracy, speed &amp; scale", "10x faster scans with +38% precision and +48% recall; built for large-scale apps.", "False positives, struggles with complex risks, performance degradation on large codebases, worse with AI-generated code."),
            ("Risk prioritization", "Reachability and exploitability-based.", "Lacks reachability and execution-flow insight."),
            ("Malicious package detection", "Behavioral analysis, heuristics, threat intelligence.", "Limited to dependency manifests."),
            ("Transitive dependencies", "Deep visibility using 1.7B Renovate installs for optimal upgrade paths.", "Incomplete, noisy suggestions."),
            ("Policies &amp; reporting", "Pre-built templates, custom policy builders, and workflows to enforce risk tolerances.", "Lacks sophisticated workflows and centralized reporting; needs custom scripts."),
            ("Operationalization", "Global configuration, high adoption for both developers and AppSec.", "Steep learning curve, custom queries required."),
        ],
        "wins": [
            ("Built for AI", "GHAS leaves teams buried in alert fatigue and backlogs as AI-generated code accelerates. Mend.io delivers high-precision detection and automated remediation that scales."),
            ("Secure all your code, not just GitHub", "If your stack spans multiple repos, containers, or AI components, GHAS won't cover it. Mend.io unifies GitHub, Bitbucket, GitLab, Kubernetes, and beyond."),
            ("Detect and block malicious packages", "GHAS analyzes manifests but lacks behavioral analysis. Mend.io blocks malicious packages using ML models, heuristics, and real-time intelligence."),
            ("Reachability and exploitability insight", "GHAS can't deeply assess reachability. Mend.io traces vulnerabilities through execution flow, focusing on what's actually at risk."),
        ],
        "quotes": [],
    },
    "sonatype": {
        "name": "Sonatype",
        "short": "Supply chain / SCA specialist",
        "tagline": "Sonatype is strong on supply chain, but it has no SAST and leaves your proprietary code unscanned.",
        "intro": "Sonatype focuses exclusively on open-source and supply chain risk. It has no SAST capability, so proprietary code vulnerabilities are a blind spot, and full coverage requires stitching together multiple separately-priced products. Win on custom code scanning, AI security, and unified pricing.",
        "features": [
            ("Custom code scanning (SAST)", "High-performance SAST 10x faster with +38% precision and +48% recall, no file size limits.", "No SAST capability; focus is exclusively open source and supply chain."),
            ("AI inventory &amp; AI BoM", "Continuously inventories AI models, agents, RAGs, and frameworks; generates AI BoM.", "No full AI component risk analysis or AI BoM generation."),
            ("AI hardening &amp; red teaming", "Hardens system prompt weaknesses and red-teams for prompt injection, bias, and exfiltration.", "No AI red teaming capability."),
            ("Reachability analysis", "Precise static analysis confirms runtime invocation, reducing false positives and alert fatigue.", "Offers limited-scope 'call flow analysis' only."),
            ("Automated dependency updates", "1.7B Renovate pulls and Merge Confidence recommend the optimal upgrade path.", "No native automated PR workflow equivalent to Mend Renovate."),
            ("Pricing", "Transparent pricing, no scan limits.", "Full coverage requires separate purchases (Lifecycle, Repository Firewall, Guide, AI SCA)."),
        ],
        "wins": [
            ("Your proprietary code has vulnerabilities too", "Mend SAST scans custom code 10x faster with +38% precision and +48% recall. Sonatype has no SAST, leaving self-written code unscanned."),
            ("AI security beyond the supply chain", "Mend AI inventories models and agents, generates AI BoM, hardens prompts, and runs red teaming. Sonatype AI SCA governs model usage but offers no red teaming or behavioral analysis."),
            ("Prioritization that cuts through noise", "Mend.io reachability confirms whether a vulnerable function is actually invoked. Sonatype's false-positive rate in JS/Python is a frequently cited pain point."),
            ("Simple pricing that scales", "Transparent pricing with no scan limits. Comparable Sonatype coverage requires buying Lifecycle, Repository Firewall, Guide, and AI SCA separately."),
        ],
        "quotes": [],
    },
}

# Order of cards / nav.
ORDER = ["snyk", "veracode", "checkmarx", "black-duck", "github-advanced-security", "sonatype"]


def esc(s):
    return s  # content already uses HTML entities where needed


def build_page(slug, d):
    name = d["name"]
    rows = "\n".join(
        f'                            <tr><td class="col-feature">{f}</td>'
        f'<td class="col-mend">{m}</td><td>{c}</td></tr>'
        for (f, m, c) in d["features"]
    )
    wins = "\n".join(
        f'                    <div class="win-card"><h4>{t}</h4><p>{b}</p></div>'
        for (t, b) in d["wins"]
    )
    proof = "\n".join(
        f'                    <div class="proof-stat"><div class="num">{n}</div>'
        f'<div class="lbl">{l}</div></div>'
        for (n, l) in PROOF
    )

    quotes_section = ""
    if d["quotes"]:
        cards = "\n".join(
            f'                    <div class="quote-card"><div class="quote-topic">{topic}</div>'
            f'<blockquote>&ldquo;{comp}&rdquo;</blockquote>'
            f'<div class="quote-attr">{name} user</div>'
            f'<blockquote class="quote-mend">&ldquo;{mend}&rdquo;</blockquote>'
            f'<div class="quote-attr">Mend.io user</div></div>'
            for (topic, comp, mend) in d["quotes"]
        )
        quotes_section = f'''
            <section class="battlecard-section">
                <h2>Voice of the Customer</h2>
                <p class="text-sm text-muted mb-16">Public G2 / Capterra review themes comparing {name} and Mend.io.</p>
                <div class="quote-grid">
{cards}
                </div>
            </section>
'''

    other_links = "\n".join(
        f'                    <a href="battlecard-{s}.html" class="btn btn-secondary btn-sm">vs. {COMPETITORS[s]["name"]}</a>'
        for s in ORDER if s != slug
    )

    return f'''<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Battlecard: Mend vs. {name} - Mend Learn</title>
    <meta name="description" content="Competitive battlecard: how Mend.io compares to {name}. Feature matrix, win themes, and proof points.">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="css/styles.css">
    <link rel="stylesheet" href="css/module.css">
    <link rel="stylesheet" href="css/battlecard.css">
</head>
<body>
    <header id="site-header" class="site-header"></header>

    <section class="hero" style="padding: 36px 0;">
        <div class="container">
            <div class="hero-content">
                <span class="badge badge-orange mb-4">&#9876; Battlecard</span>
                <h1>Mend.io vs. <span class="accent">{name}</span></h1>
                <p>{d["tagline"]}</p>
            </div>
        </div>
    </section>

    <main class="battlecard-main">
        <div class="container">
            <a href="resources.html" class="battlecard-back">&#8592; Back to Resources</a>

            <section class="battlecard-section">
                <h2>Positioning Summary</h2>
                <div class="key-concept">
                    <h4>&#128161; The One-Liner</h4>
                    <p>{d["intro"]}</p>
                </div>
            </section>

            <section class="battlecard-section">
                <h2>Feature Comparison</h2>
                <div class="compare-table">
                    <table>
                        <thead>
                            <tr><th class="col-feature">Feature</th><th class="col-mend">Mend.io</th><th>{name}</th></tr>
                        </thead>
                        <tbody>
{rows}
                        </tbody>
                    </table>
                </div>
            </section>

            <section class="battlecard-section">
                <h2>Why Teams Switch to Mend.io</h2>
                <div class="win-grid">
{wins}
                </div>
            </section>
{quotes_section}
            <section class="battlecard-section">
                <h2>Mend.io Proof Points</h2>
                <div class="proof-grid">
{proof}
                </div>
            </section>

            <section class="battlecard-section">
                <h2>Objection-Handling Reminder</h2>
                <div class="warning-box">
                    <h4>&#9888;&#65039; Keep It Classy</h4>
                    <p>Never disparage a competitor by name in front of a customer. Contrast on outcomes (noise reduction, time-to-fix, total cost of ownership) and let the buyer draw their own conclusion.</p>
                </div>
            </section>

            <section class="battlecard-section">
                <h2>Other Battlecards</h2>
                <div class="flex" style="flex-wrap: wrap; gap: 8px;">
{other_links}
                </div>
            </section>

            <p class="battlecard-source">Source: Mend.io &ldquo;Compare by AppSec&rdquo; &middot; <a href="https://www.mend.io/mend-vs-{slug}/" target="_blank" rel="noopener">mend.io/mend-vs-{slug}</a>. For partner enablement use.</p>
        </div>
    </main>

    <footer id="site-footer" class="site-footer"></footer>

    <script src="js/layout.js"></script>
    <script src="js/store.js"></script>
    <script src="js/app.js"></script>
</body>
</html>
'''


def main():
    for slug, d in COMPETITORS.items():
        path = os.path.join(ROOT, f"battlecard-{slug}.html")
        with open(path, "w", encoding="utf-8") as f:
            f.write(build_page(slug, d))
        print(f"wrote {os.path.basename(path)}")


if __name__ == "__main__":
    main()
