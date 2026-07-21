/* ============================================
   TRACKS DATA - Single source of truth for all
   module sidebar navigation across 61 pages.
   Edit here to add/rename/reorder modules.
   ============================================ */

var MendTracks = {
    foundation: {
        title: 'Foundation Track',
        modules: [
            { file: '01-appsec-fundamentals.html', title: 'Application Security Fundamentals', duration: '30 min' },
            { file: '02-supply-chain-security.html', title: 'Software Supply Chain Security', duration: '25 min' },
            { file: '03-mend-platform-overview.html', title: 'Mend Platform Overview', duration: '35 min' },
            { file: '04-vulnerability-types.html', title: 'Security Vulnerability Types', duration: '35 min' },
            { file: '05-compliance-overview.html', title: 'Compliance & Regulatory Overview', duration: '30 min' }
        ]
    },
    sca: {
        title: 'SCA Deep Dive',
        modules: [
            { file: '01-sca-overview.html', title: 'SCA Overview', duration: '30 min' },
            { file: '02-reachability-analysis.html', title: 'Reachability Analysis', duration: '35 min' },
            { file: '03-license-compliance.html', title: 'License Compliance', duration: '25 min' },
            { file: '04-prioritization.html', title: 'Vulnerability Prioritization', duration: '30 min' },
            { file: '05-remediation.html', title: 'Automated Remediation', duration: '35 min' },
            { file: '06-sbom-reporting.html', title: 'SBOM & Reporting', duration: '25 min' },
            { file: '07-policy-enforcement.html', title: 'Policy Enforcement & Governance', duration: '35 min' },
            { file: '08-enterprise-scaling.html', title: 'Enterprise SCA at Scale', duration: '40 min' }
        ]
    },
    sast: {
        title: 'SAST Product Track',
        modules: [
            { file: '01-sast-overview.html', title: 'SAST Fundamentals', duration: '30 min' },
            { file: '02-ai-remediation.html', title: 'AI-Powered Remediation', duration: '35 min' },
            { file: '03-cicd-integration.html', title: 'CI/CD Integration', duration: '30 min' },
            { file: '04-custom-rules.html', title: 'Custom Rules & Configuration', duration: '35 min' },
            { file: '05-language-analysis.html', title: 'Language-Specific Analysis', duration: '35 min' },
            { file: '06-false-positive-management.html', title: 'False Positive Management', duration: '30 min' },
            { file: '07-security-review-workflows.html', title: 'Security Review Workflows', duration: '35 min' },
            { file: '08-advanced-sast-config.html', title: 'Advanced SAST Configuration', duration: '40 min' }
        ]
    },
    container: {
        title: 'Container Security',
        modules: [
            { file: '01-container-security.html', title: 'Container Security Fundamentals', duration: '45 min' },
            { file: '02-image-scanning.html', title: 'Container Image Scanning', duration: '40 min' },
            { file: '03-kubernetes-security.html', title: 'Kubernetes Security', duration: '45 min' },
            { file: '04-registry-scanning.html', title: 'Registry Scanning & Image Lifecycle', duration: '35 min' },
            { file: '05-runtime-protection.html', title: 'Runtime Protection & Monitoring', duration: '40 min' }
        ]
    },
    secrets: {
        title: 'Secrets Detection',
        modules: [
            { file: '01-secrets-scanning.html', title: 'Secrets Scanning & Detection', duration: '40 min' },
            { file: '02-incident-response.html', title: 'Incident Response & Remediation', duration: '35 min' },
            { file: '03-secrets-rotation.html', title: 'Secrets Rotation & Lifecycle', duration: '35 min' },
            { file: '04-vault-integration.html', title: 'Vault Integration & Secrets Management', duration: '40 min' },
            { file: '05-secrets-compliance.html', title: 'Secrets Compliance & Policy Enforcement', duration: '30 min' }
        ]
    },
    'supply-chain': {
        title: 'Supply Chain Security',
        modules: [
            { file: '01-supply-chain-threats.html', title: 'Supply Chain Threat Landscape', duration: '45 min' },
            { file: '02-sbom-governance.html', title: 'SBOM & Governance', duration: '40 min' },
            { file: '03-dependency-risk.html', title: 'Dependency Risk Assessment', duration: '40 min' },
            { file: '04-package-security.html', title: 'Package Manager Security', duration: '35 min' },
            { file: '05-supply-chain-prevention.html', title: 'Supply Chain Attack Prevention', duration: '35 min' }
        ]
    },
    sales: {
        title: 'Sales Enablement',
        modules: [
            { file: '01-selling-mend.html', title: 'Selling Mend.io', duration: '45 min' },
            { file: '02-competitive-positioning.html', title: 'Competitive Positioning & Battlecards', duration: '40 min' },
            { file: '03-objection-handling.html', title: 'Objection Handling & Negotiation', duration: '35 min' },
            { file: '04-demo-pov.html', title: 'Demo & Proof of Value', duration: '40 min' },
            { file: '05-deal-registration.html', title: 'Deal Registration & Pipeline', duration: '30 min' },
            { file: '06-pricing-licensing.html', title: 'Pricing & Licensing Models', duration: '35 min' },
            { file: '07-partner-program.html', title: 'Partner Program & Tier Benefits', duration: '30 min' },
            { file: '08-vertical-selling.html', title: 'Vertical-Specific Selling Strategies', duration: '35 min' },
            { file: '09-customer-success-stories.html', title: 'Customer Success Stories & Case Studies', duration: '30 min' }
        ]
    },
    developer: {
        title: 'Developer Track',
        modules: [
            { file: '01-developer-quickstart.html', title: 'Developer Quickstart', duration: '30 min' },
            { file: '02-ide-integration.html', title: 'IDE Plugins & Developer Workflow', duration: '35 min' },
            { file: '03-cli-automation.html', title: 'Mend CLI & Automation', duration: '35 min' },
            { file: '04-renovate-setup.html', title: 'Mend Renovate Setup & Configuration', duration: '40 min' },
            { file: '05-custom-policies.html', title: 'Custom Security Policies for Developers', duration: '30 min' },
            { file: '06-api-integration.html', title: 'API Integration & Webhooks', duration: '40 min' },
            { file: '07-devsecops-culture.html', title: 'DevSecOps Culture & Developer Adoption', duration: '35 min' }
        ]
    },
    technical: {
        title: 'Technical SE Track',
        modules: [
            { file: '01-technical-deep-dive.html', title: 'Architecture & Deployment Deep Dive', duration: '50 min' },
            { file: '02-demo-mastery.html', title: 'Demo Mastery & Lab Setup', duration: '45 min' },
            { file: '03-poc-management.html', title: 'POC & Trial Management', duration: '40 min' },
            { file: '04-advanced-integrations.html', title: 'Advanced Integrations', duration: '40 min' },
            { file: '05-troubleshooting.html', title: 'Troubleshooting & Support', duration: '35 min' },
            { file: '06-security-architecture-review.html', title: 'Security Architecture Review', duration: '40 min' },
            { file: '07-customer-workshops.html', title: 'Customer Workshop Facilitation', duration: '35 min' },
            { file: '08-migration-strategies.html', title: 'Migration & Consolidation Strategies', duration: '40 min' }
        ]
    },
    cicd: {
        title: 'CI/CD & DevOps',
        modules: [
            { file: '01-pipeline-fundamentals.html', title: 'Pipeline Security Fundamentals', duration: '45 min' },
            { file: '02-gitops-integration.html', title: 'GitOps & SCM Integration', duration: '40 min' },
            { file: '03-iac-scanning.html', title: 'IaC Scanning', duration: '40 min' },
            { file: '04-workflow-automation.html', title: 'Custom Workflow Automation', duration: '40 min' },
            { file: '05-multi-tool-orchestration.html', title: 'Multi-Tool Orchestration', duration: '45 min' }
        ]
    },
    executive: {
        title: 'Executive / Practice Leader',
        modules: [
            { file: '01-security-strategy.html', title: 'Application Security Strategy', duration: '40 min' },
            { file: '02-building-practice.html', title: 'Building an AppSec Practice', duration: '40 min' },
            { file: '03-roi-metrics.html', title: 'ROI Measurement & Business Metrics', duration: '35 min' },
            { file: '04-customer-success.html', title: 'Customer Success & Expansion', duration: '35 min' },
            { file: '05-partner-growth.html', title: 'Partner Growth & Program Optimization', duration: '30 min' }
        ]
    },
    enterprise: {
        title: 'Enterprise Architecture',
        modules: [
            { file: '01-enterprise-deployment.html', title: 'Enterprise Deployment Architecture', duration: '45 min' },
            { file: '02-api-automation.html', title: 'API & Automation', duration: '45 min' },
            { file: '03-compliance-governance.html', title: 'Compliance & Governance Frameworks', duration: '40 min' },
            { file: '04-sso-user-management.html', title: 'SSO & User Management', duration: '35 min' },
            { file: '05-reporting-analytics.html', title: 'Reporting & Security Analytics', duration: '35 min' }
        ]
    },
    'platform-unified': {
        title: 'Platform Unified Track',
        modules: [
            { file: '01-platform-unified-overview.html', title: 'Platform Unified Overview', duration: '35 min' },
            { file: '02-cross-product-policy.html', title: 'Cross-Product Policy & Governance', duration: '40 min' },
            { file: '03-unified-reporting.html', title: 'Unified Reporting & Dashboards', duration: '35 min' },
            { file: '04-integrated-workflows.html', title: 'Integrated Security Workflows', duration: '40 min' },
            { file: '05-deployment-strategy.html', title: 'Platform Deployment Strategy', duration: '40 min' },
            { file: '06-platform-roi.html', title: 'Platform ROI & Business Value', duration: '30 min' }
        ]
    },
    mssp: {
        title: 'MSSP Operations Track',
        modules: [
            { file: '01-mssp-operations-overview.html', title: 'MSSP Operations Overview', duration: '35 min' },
            { file: '02-tenant-onboarding.html', title: 'Tenant Onboarding & Segmentation', duration: '40 min' },
            { file: '03-multi-customer-reporting.html', title: 'Multi-Customer Reporting & SLAs', duration: '35 min' },
            { file: '04-service-delivery.html', title: 'Service Delivery & Operational Excellence', duration: '40 min' },
            { file: '05-mssp-growth.html', title: 'MSSP Growth & Portfolio Expansion', duration: '30 min' }
        ]
    }
};

/* ============================================
   AUTO-GENERATE MODULE SIDEBAR
   Replaces static sidebar HTML with dynamic
   generation from the tracks data above.
   ============================================ */
(function () {
    'use strict';

    var sidebar = document.querySelector('.module-sidebar');
    if (!sidebar) return;

    /* Detect current track from URL path */
    var pathParts = window.location.pathname.split('/');
    var modulesIdx = pathParts.indexOf('modules');
    if (modulesIdx === -1) return;

    var trackSlug = pathParts[modulesIdx + 1];
    var currentFile = pathParts[pathParts.length - 1];
    var track = MendTracks[trackSlug];
    if (!track) return;

    /* Find current module index */
    var currentIndex = track.modules.findIndex(function (m) { return m.file === currentFile; });

    /* Build sidebar HTML */
    var navLinks = track.modules.map(function (mod, i) {
        var active = mod.file === currentFile ? ' active' : '';
        var title = mod.title.replace(/&/g, '&amp;');
        return '<a href="' + mod.file + '" class="module-link' + active + '">' +
            '<span class="module-status">' + (i + 1) + '</span>' +
            '<div><span class="module-title">' + title + '</span>' +
            '<span class="module-duration">' + mod.duration + '</span></div></a>';
    }).join('\n                ');

    var totalModules = track.modules.length;

    var sidebarHTML = '<div class="sidebar-header">' +
        '<a href="../../learning-paths.html" class="back-link">&#8592; Learning Paths</a>' +
        '<h3>' + track.title + '</h3>' +
        '<div class="sidebar-progress">' +
        '<div class="progress-bar"><div class="fill" data-progress="0%" style="width: 0%"></div></div>' +
        '<span class="sidebar-progress-text">0/' + totalModules + ' Complete</span>' +
        '</div></div>' +
        '<nav class="module-nav" aria-label="' + track.title + ' modules">' +
        navLinks + '</nav>';

    sidebar.innerHTML = sidebarHTML;
    sidebar.setAttribute('role', 'complementary');
    sidebar.setAttribute('aria-label', 'Module navigation');

    /* Update progress from store data */
    if (typeof MendStore !== 'undefined') {
        var data = MendStore.load();
        var completed = data.completedModules || [];
        var trackCompleted = track.modules.filter(function (m) {
            var moduleId = trackSlug + '/' + m.file.replace('.html', '');
            return completed.indexOf(moduleId) !== -1;
        }).length;
        var pct = Math.round((trackCompleted / totalModules) * 100);
        var fill = sidebar.querySelector('.fill');
        var progressText = sidebar.querySelector('.sidebar-progress-text');
        if (fill) {
            fill.style.width = pct + '%';
            fill.setAttribute('data-progress', pct + '%');
        }
        if (progressText) {
            progressText.textContent = trackCompleted + '/' + totalModules + ' Complete';
        }

        /* Mark completed modules in nav */
        var navLinksEls = sidebar.querySelectorAll('.module-link');
        navLinksEls.forEach(function (link, i) {
            var moduleId = trackSlug + '/' + track.modules[i].file.replace('.html', '');
            if (completed.indexOf(moduleId) !== -1) {
                link.querySelector('.module-status').innerHTML = '&#10003;';
                link.querySelector('.module-status').classList.add('completed');
            }
        });
    }
})();
