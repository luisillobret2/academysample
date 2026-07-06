/* ============================================
   MEND LEARN - Client-Side Search
   Fuzzy search across all modules, pages, and
   resources with a dropdown results panel.
   ============================================ */

const MendSearch = {
    /* Static index of all searchable content */
    catalog: [
        /* --- Top-level pages --- */
        { title: 'Home', href: 'index.html', category: 'Page', tags: 'dashboard home welcome' },
        { title: 'Learning Paths', href: 'learning-paths.html', category: 'Page', tags: 'tracks courses paths' },
        { title: 'Certifications', href: 'certifications.html', category: 'Page', tags: 'certs badges exams' },
        { title: 'Labs', href: 'labs.html', category: 'Page', tags: 'hands-on practice sandbox' },
        { title: 'Resources', href: 'resources.html', category: 'Page', tags: 'battlecards guides playbooks' },
        { title: 'Leaderboard', href: 'leaderboard.html', category: 'Page', tags: 'ranking xp points' },
        { title: 'AI Coach', href: 'ai-coach.html', category: 'Page', tags: 'chat assistant mentor' },
        { title: 'Profile', href: 'profile.html', category: 'Page', tags: 'account settings badges' },
        { title: 'The Mend Platform 2026', href: 'mend-platform-2026.html', category: 'Resource', tags: 'platform overview strategy' },

        /* --- Foundation Track --- */
        { title: 'Application Security Fundamentals', href: 'modules/foundation/01-appsec-fundamentals.html', category: 'Foundation', tags: 'appsec basics owasp vulnerabilities' },
        { title: 'Supply Chain Security', href: 'modules/foundation/02-supply-chain-security.html', category: 'Foundation', tags: 'supply chain sbom dependencies' },
        { title: 'Mend Platform Overview', href: 'modules/foundation/03-mend-platform-overview.html', category: 'Foundation', tags: 'platform sca sast overview' },
        { title: 'Vulnerability Types', href: 'modules/foundation/04-vulnerability-types.html', category: 'Foundation', tags: 'cve cwe vulnerabilities injection xss' },
        { title: 'Compliance Overview', href: 'modules/foundation/05-compliance-overview.html', category: 'Foundation', tags: 'compliance gdpr hipaa pci sox' },

        /* --- SCA Track --- */
        { title: 'SCA Overview', href: 'modules/sca/01-sca-overview.html', category: 'SCA', tags: 'software composition analysis open source' },
        { title: 'Reachability Analysis', href: 'modules/sca/02-reachability-analysis.html', category: 'SCA', tags: 'reachability call graph prioritization' },
        { title: 'License Compliance', href: 'modules/sca/03-license-compliance.html', category: 'SCA', tags: 'license gpl mit apache compliance' },
        { title: 'Vulnerability Prioritization', href: 'modules/sca/04-prioritization.html', category: 'SCA', tags: 'prioritization risk scoring cvss' },
        { title: 'Remediation & Auto-Fix', href: 'modules/sca/05-remediation.html', category: 'SCA', tags: 'remediation auto fix pull request renovate' },
        { title: 'SBOM & Reporting', href: 'modules/sca/06-sbom-reporting.html', category: 'SCA', tags: 'sbom reporting spdx cyclonedx' },

        /* --- SAST Track --- */
        { title: 'SAST Overview', href: 'modules/sast/01-sast-overview.html', category: 'SAST', tags: 'static analysis code scanning' },
        { title: 'AI-Powered Remediation', href: 'modules/sast/02-ai-remediation.html', category: 'SAST', tags: 'ai remediation autofix code' },
        { title: 'CI/CD Integration', href: 'modules/sast/03-cicd-integration.html', category: 'SAST', tags: 'cicd pipeline github gitlab jenkins' },
        { title: 'Custom Rules', href: 'modules/sast/04-custom-rules.html', category: 'SAST', tags: 'custom rules policies code quality' },
        { title: 'Language Analysis', href: 'modules/sast/05-language-analysis.html', category: 'SAST', tags: 'language java python javascript typescript' },

        /* --- Sales Track --- */
        { title: 'Selling Mend.io', href: 'modules/sales/01-selling-mend.html', category: 'Sales', tags: 'pitch value proposition selling' },
        { title: 'Competitive Positioning', href: 'modules/sales/02-competitive-positioning.html', category: 'Sales', tags: 'competitive snyk veracode checkmarx' },
        { title: 'Objection Handling', href: 'modules/sales/03-objection-handling.html', category: 'Sales', tags: 'objections responses pricing' },
        { title: 'Demo & POV', href: 'modules/sales/04-demo-pov.html', category: 'Sales', tags: 'demo proof of value presentation' },
        { title: 'Deal Registration', href: 'modules/sales/05-deal-registration.html', category: 'Sales', tags: 'deal registration pipeline allbound' },

        /* --- Developer Track --- */
        { title: 'Developer Quickstart', href: 'modules/developer/01-developer-quickstart.html', category: 'Developer', tags: 'quickstart setup getting started' },
        { title: 'IDE Integration', href: 'modules/developer/02-ide-integration.html', category: 'Developer', tags: 'ide vscode intellij plugin' },
        { title: 'CLI & Automation', href: 'modules/developer/03-cli-automation.html', category: 'Developer', tags: 'cli command line automation scripts' },
        { title: 'Renovate Setup', href: 'modules/developer/04-renovate-setup.html', category: 'Developer', tags: 'renovate dependency updates automated pr' },
        { title: 'Custom Policies', href: 'modules/developer/05-custom-policies.html', category: 'Developer', tags: 'policies rules enforcement developer' },

        /* --- Container Track --- */
        { title: 'Container Security', href: 'modules/container/01-container-security.html', category: 'Container', tags: 'container docker security scanning' },
        { title: 'Image Scanning', href: 'modules/container/02-image-scanning.html', category: 'Container', tags: 'image scanning docker vulnerability' },
        { title: 'Kubernetes Security', href: 'modules/container/03-kubernetes-security.html', category: 'Container', tags: 'kubernetes k8s security policies' },
        { title: 'Registry Scanning', href: 'modules/container/04-registry-scanning.html', category: 'Container', tags: 'registry ecr gcr acr scanning' },
        { title: 'Runtime Protection', href: 'modules/container/05-runtime-protection.html', category: 'Container', tags: 'runtime monitoring protection container' },

        /* --- CI/CD Track --- */
        { title: 'Pipeline Fundamentals', href: 'modules/cicd/01-pipeline-fundamentals.html', category: 'CI/CD', tags: 'pipeline cicd fundamentals security gates' },
        { title: 'GitOps Integration', href: 'modules/cicd/02-gitops-integration.html', category: 'CI/CD', tags: 'gitops scm github gitlab bitbucket' },
        { title: 'IaC Scanning', href: 'modules/cicd/03-iac-scanning.html', category: 'CI/CD', tags: 'iac infrastructure terraform cloudformation' },
        { title: 'Workflow Automation', href: 'modules/cicd/04-workflow-automation.html', category: 'CI/CD', tags: 'workflow automation actions pipelines' },
        { title: 'Multi-Tool Orchestration', href: 'modules/cicd/05-multi-tool-orchestration.html', category: 'CI/CD', tags: 'orchestration multi-tool integration' },

        /* --- Secrets Track --- */
        { title: 'Secrets Scanning', href: 'modules/secrets/01-secrets-scanning.html', category: 'Secrets', tags: 'secrets scanning detection api keys' },
        { title: 'Incident Response', href: 'modules/secrets/02-incident-response.html', category: 'Secrets', tags: 'incident response rotation revoke' },
        { title: 'Secrets Rotation', href: 'modules/secrets/03-secrets-rotation.html', category: 'Secrets', tags: 'rotation automated secrets management' },
        { title: 'Vault Integration', href: 'modules/secrets/04-vault-integration.html', category: 'Secrets', tags: 'vault hashicorp aws secrets manager' },
        { title: 'Secrets Compliance', href: 'modules/secrets/05-secrets-compliance.html', category: 'Secrets', tags: 'compliance audit secrets governance' },

        /* --- Supply Chain Track --- */
        { title: 'Supply Chain Threats', href: 'modules/supply-chain/01-supply-chain-threats.html', category: 'Supply Chain', tags: 'threats typosquatting dependency confusion' },
        { title: 'SBOM Governance', href: 'modules/supply-chain/02-sbom-governance.html', category: 'Supply Chain', tags: 'sbom governance inventory management' },
        { title: 'Dependency Risk', href: 'modules/supply-chain/03-dependency-risk.html', category: 'Supply Chain', tags: 'dependency risk assessment scoring' },
        { title: 'Package Security', href: 'modules/supply-chain/04-package-security.html', category: 'Supply Chain', tags: 'package npm pypi maven security' },
        { title: 'Supply Chain Prevention', href: 'modules/supply-chain/05-supply-chain-prevention.html', category: 'Supply Chain', tags: 'prevention mitigation best practices' },

        /* --- Technical Track --- */
        { title: 'Technical Deep Dive', href: 'modules/technical/01-technical-deep-dive.html', category: 'Technical', tags: 'technical architecture integration' },
        { title: 'Demo Mastery', href: 'modules/technical/02-demo-mastery.html', category: 'Technical', tags: 'demo presentation poc sales engineer' },
        { title: 'POC Management', href: 'modules/technical/03-poc-management.html', category: 'Technical', tags: 'poc proof of concept trial evaluation' },
        { title: 'Advanced Integrations', href: 'modules/technical/04-advanced-integrations.html', category: 'Technical', tags: 'api integrations webhooks automation' },
        { title: 'Troubleshooting', href: 'modules/technical/05-troubleshooting.html', category: 'Technical', tags: 'troubleshooting debugging issues support' },

        /* --- Executive Track --- */
        { title: 'Security Strategy', href: 'modules/executive/01-security-strategy.html', category: 'Executive', tags: 'strategy executive ciso business case' },
        { title: 'Building a Security Practice', href: 'modules/executive/02-building-practice.html', category: 'Executive', tags: 'practice building services consulting' },
        { title: 'ROI Metrics', href: 'modules/executive/03-roi-metrics.html', category: 'Executive', tags: 'roi metrics business value tco' },
        { title: 'Customer Success Stories', href: 'modules/executive/04-customer-success.html', category: 'Executive', tags: 'customer success stories case study' },
        { title: 'Partner Growth', href: 'modules/executive/05-partner-growth.html', category: 'Executive', tags: 'partner growth scaling revenue' },

        /* --- Enterprise Track --- */
        { title: 'Enterprise Deployment', href: 'modules/enterprise/01-enterprise-deployment.html', category: 'Enterprise', tags: 'enterprise deployment architecture scaling' },
        { title: 'API & Automation', href: 'modules/enterprise/02-api-automation.html', category: 'Enterprise', tags: 'api automation rest webhooks' },
        { title: 'Compliance & Governance', href: 'modules/enterprise/03-compliance-governance.html', category: 'Enterprise', tags: 'compliance governance frameworks policies' },
        { title: 'SSO & User Management', href: 'modules/enterprise/04-sso-user-management.html', category: 'Enterprise', tags: 'sso saml scim user management' },
        { title: 'Reporting & Analytics', href: 'modules/enterprise/05-reporting-analytics.html', category: 'Enterprise', tags: 'reporting analytics dashboards metrics' },

        /* --- Battlecards --- */
        { title: 'Battlecard: Mend vs Snyk', href: 'battlecard-snyk.html', category: 'Battlecard', tags: 'snyk competitive comparison' },
        { title: 'Battlecard: Mend vs Veracode', href: 'battlecard-veracode.html', category: 'Battlecard', tags: 'veracode competitive comparison' },
        { title: 'Battlecard: Mend vs Checkmarx', href: 'battlecard-checkmarx.html', category: 'Battlecard', tags: 'checkmarx competitive comparison' },
        { title: 'Battlecard: Mend vs Black Duck', href: 'battlecard-black-duck.html', category: 'Battlecard', tags: 'black duck synopsys competitive' },
        { title: 'Battlecard: Mend vs GitHub Advanced Security', href: 'battlecard-github-advanced-security.html', category: 'Battlecard', tags: 'github advanced security ghas competitive' },
        { title: 'Battlecard: Mend vs Sonatype', href: 'battlecard-sonatype.html', category: 'Battlecard', tags: 'sonatype nexus competitive' }
    ],

    /* Simple fuzzy matching: split query into words, check if every word
       appears somewhere in the item's title, category, or tags. */
    search(query) {
        if (!query || !query.trim()) return [];
        const words = query.toLowerCase().split(/\s+/).filter(Boolean);
        const scored = [];

        for (const item of this.catalog) {
            const haystack = (item.title + ' ' + item.category + ' ' + item.tags).toLowerCase();
            let matchCount = 0;
            for (const w of words) {
                if (haystack.includes(w)) matchCount++;
            }
            if (matchCount === words.length) {
                const titleLower = item.title.toLowerCase();
                const boost = words.some(w => titleLower.includes(w)) ? 10 : 0;
                scored.push({ ...item, score: matchCount + boost });
            }
        }

        scored.sort((a, b) => b.score - a.score);
        return scored.slice(0, 10);
    },

    /* Build and inject the search results dropdown. Called from app.js. */
    init() {
        const searchContainer = document.querySelector('.nav-search');
        const searchInput = document.querySelector('#nav-search-input');
        if (!searchContainer || !searchInput) return;

        /* Determine URL prefix (module pages are nested deeper) */
        const inModule = /\/modules\//.test(window.location.pathname);
        const prefix = inModule ? '../../' : '';

        /* Create results dropdown */
        const dropdown = document.createElement('div');
        dropdown.className = 'search-dropdown';
        dropdown.setAttribute('role', 'listbox');
        dropdown.setAttribute('aria-label', 'Search results');
        searchContainer.style.position = 'relative';
        searchContainer.appendChild(dropdown);

        let debounce;
        searchInput.addEventListener('input', () => {
            clearTimeout(debounce);
            debounce = setTimeout(() => {
                const query = searchInput.value.trim();
                if (query.length < 2) {
                    dropdown.innerHTML = '';
                    dropdown.classList.remove('open');
                    return;
                }
                const results = this.search(query);
                this.renderResults(dropdown, results, prefix, query);
            }, 200);
        });

        searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                dropdown.innerHTML = '';
                dropdown.classList.remove('open');
                searchInput.blur();
            }
            if (e.key === 'Enter') {
                const first = dropdown.querySelector('.search-result-item');
                if (first) {
                    first.click();
                    e.preventDefault();
                }
            }
        });

        document.addEventListener('click', (e) => {
            if (!e.target.closest('.nav-search')) {
                dropdown.innerHTML = '';
                dropdown.classList.remove('open');
            }
        });
    },

    renderResults(dropdown, results, prefix, query) {
        if (results.length === 0) {
            dropdown.innerHTML = '<div class="search-no-results">No results found</div>';
            dropdown.classList.add('open');
            return;
        }

        const highlight = (text) => {
            const words = query.toLowerCase().split(/\s+/).filter(Boolean);
            let highlighted = text;
            for (const w of words) {
                const regex = new RegExp('(' + w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'gi');
                highlighted = highlighted.replace(regex, '<mark>$1</mark>');
            }
            return highlighted;
        };

        dropdown.innerHTML = results.map(item => `
            <a href="${prefix}${item.href}" class="search-result-item" role="option">
                <span class="search-result-category">${item.category}</span>
                <span class="search-result-title">${highlight(item.title)}</span>
            </a>
        `).join('');
        dropdown.classList.add('open');
    }
};
