/* ============================================
   MEND LEARN - AI Coach Chat
   Keyword-matched chat responses (extracted from app.js)
   ============================================ */

function initChat() {
    const chatInput = document.querySelector('.ai-chat-input input');
    const chatSend = document.querySelector('.ai-chat-input .btn');
    const chatMessages = document.querySelector('.ai-chat-messages');

    if (!chatInput || !chatSend || !chatMessages) return;

    /* Accessibility: ARIA roles for chat */
    chatMessages.setAttribute('role', 'log');
    chatMessages.setAttribute('aria-label', 'Chat messages');
    chatMessages.setAttribute('aria-live', 'polite');
    chatInput.setAttribute('aria-label', 'Type a message to Mend Mentor');
    chatSend.setAttribute('aria-label', 'Send message');

    /* Build context from user progress */
    let ctx = { modules: 0, xp: 0, level: 1, certs: 0, streak: 0, name: 'Jane' };
    if (typeof MendStore !== 'undefined') {
        const d = MendStore.load();
        ctx = { modules: d.completedModules.length, xp: d.xp, level: d.level, certs: d.certifications.length, streak: d.streak, name: d.userName.split(/\s+/)[0] };
    }

    const responses = [
        {
            keywords: ['sca', 'composition', 'dependency', 'open source', 'open-source'],
            response: "Great question! <strong>Mend SCA</strong> (Software Composition Analysis) helps you find and fix vulnerabilities in open-source dependencies. Key capabilities:\n\n<strong>1. Reachability Analysis</strong> \u2014 Know if vulnerable code is actually called in your app\n<strong>2. License Compliance</strong> \u2014 Detect copyleft, restrictive, and custom license policies\n<strong>3. Auto-Remediation</strong> \u2014 Automated PRs with safe upgrade paths\n<strong>4. SBOM Generation</strong> \u2014 CycloneDX and SPDX format export\n\nThe <strong>SCA Deep Dive</strong> learning path covers all 6 modules. <a href='learning-paths.html'>Start learning &rarr;</a>"
        },
        {
            keywords: ['sast', 'static', 'code analysis', 'source code'],
            response: "Mend SAST performs static analysis on your source code before it reaches production. Highlights:\n\n<strong>1. AI-Powered Remediation</strong> \u2014 Automatically generates fix suggestions\n<strong>2. Custom Rules</strong> \u2014 Create org-specific security policies\n<strong>3. Low False Positives</strong> \u2014 Context-aware analysis reduces noise\n<strong>4. CI/CD Native</strong> \u2014 Integrates into GitHub Actions, Jenkins, GitLab CI\n\nThe <strong>SAST Product Track</strong> has 5 modules. <a href='learning-paths.html'>Check it out &rarr;</a>"
        },
        {
            keywords: ['container', 'docker', 'kubernetes', 'k8s', 'image'],
            response: "Mend Container Security scans your container images for vulnerabilities. Key features:\n\n<strong>1. Registry Scanning</strong> \u2014 Scan images in Docker Hub, ECR, ACR, GCR\n<strong>2. Kubernetes Integration</strong> \u2014 Runtime protection and admission control\n<strong>3. Docker VEX</strong> \u2014 Reduce noise with Docker's Vulnerability Exploitability eXchange\n<strong>4. Base Image Recommendations</strong> \u2014 Suggest safer base images\n\nCheck out the <strong>Container Security</strong> track for hands-on learning. <a href='modules/container/01-container-security.html'>Start here &rarr;</a>"
        },
        {
            keywords: ['secret', 'secrets', 'credential', 'api key', 'token', 'password'],
            response: "Mend Secrets Detection scans your codebase and commit history for leaked credentials. It covers:\n\n<strong>1. 200+ secret types</strong> \u2014 API keys, tokens, passwords, certificates\n<strong>2. Pre-commit hooks</strong> \u2014 Catch secrets before they enter the repo\n<strong>3. Historical scanning</strong> \u2014 Find secrets in old commits\n<strong>4. Rotation guidance</strong> \u2014 Step-by-step remediation for each secret type\n\nExplore the <strong>Secrets Detection</strong> track. <a href='modules/secrets/01-secrets-scanning.html'>Start learning &rarr;</a>"
        },
        {
            keywords: ['supply chain', 'sbom', 'dependency risk', 'package'],
            response: "Supply chain security is critical in today's threat landscape. Mend helps with:\n\n<strong>1. SBOM Generation</strong> \u2014 Full software bill of materials in CycloneDX/SPDX\n<strong>2. Malicious Package Detection</strong> \u2014 Identify typosquatting and compromised packages\n<strong>3. Dependency Risk Scoring</strong> \u2014 Assess health, maintenance, and security of dependencies\n<strong>4. Policy Enforcement</strong> \u2014 Block risky packages before they enter your codebase\n\nThe <strong>Supply Chain Security</strong> track covers this in depth. <a href='learning-paths.html'>View track &rarr;</a>"
        },
        {
            keywords: ['certification', 'cert', 'exam', 'certified', 'prepare'],
            response: `Based on your progress (${ctx.modules} modules, ${ctx.xp.toLocaleString()} XP), here's my recommendation:\n\n` +
                (ctx.certs === 0
                    ? "<strong>Target: Associate Certification</strong>\n\u2022 Complete the Foundation Track (5 modules)\n\u2022 60-min online exam, 50 questions, 70% to pass\n\u2022 Estimated prep time: 4\u20136 hours"
                    : "<strong>Target: Professional Certification</strong>\n\u2022 Complete SCA, SAST, and CI/CD tracks\n\u2022 90-min proctored exam, 60 questions, 75% to pass\n\u2022 Estimated prep time: 10\u201312 hours") +
                "\n\n<a href='certifications.html'>View all certifications &rarr;</a>"
        },
        {
            keywords: ['compete', 'snyk', 'competitor'],
            response: "Key differentiators <strong>Mend vs. Snyk</strong>:\n\n<strong>1. Reachability Analysis</strong> \u2014 Mend identifies if vulnerable code is actually called (Snyk doesn't)\n<strong>2. Language Coverage</strong> \u2014 200+ languages vs. Snyk's ~30\n<strong>3. Auto-Remediation</strong> \u2014 Automated PR generation for fixes\n<strong>4. Unified Platform</strong> \u2014 SCA + SAST + Container + Secrets in one\n<strong>5. License Compliance</strong> \u2014 More comprehensive license policy engine\n\nSee the full comparison in our <a href='resources.html'>Competitive Battlecards &rarr;</a>"
        },
        {
            keywords: ['veracode'],
            response: "Key differentiators <strong>Mend vs. Veracode</strong>:\n\n<strong>1. Developer-First</strong> \u2014 IDE, CLI, and PR-native vs. Veracode's scan-and-wait model\n<strong>2. Speed</strong> \u2014 Real-time scanning vs. hours-long static analysis\n<strong>3. Open Source Focus</strong> \u2014 Best-in-class SCA with reachability analysis\n<strong>4. Pricing</strong> \u2014 More competitive, per-developer pricing\n\nPractice positioning with our <a href='resources.html'>Veracode Battlecard &rarr;</a>"
        },
        {
            keywords: ['checkmarx'],
            response: "Key differentiators <strong>Mend vs. Checkmarx</strong>:\n\n<strong>1. AI Remediation</strong> \u2014 Auto-generated fixes vs. manual triage\n<strong>2. Developer Experience</strong> \u2014 Native IDE and CI/CD integration\n<strong>3. SCA Strength</strong> \u2014 Industry-leading open-source vulnerability database\n<strong>4. Simpler Deployment</strong> \u2014 SaaS-first vs. complex on-prem setup\n\nSee the <a href='resources.html'>Checkmarx Battlecard &rarr;</a>"
        },
        {
            keywords: ['demo', 'poc', 'presentation', 'show'],
            response: "For demo preparation, I recommend the <strong>Demo Mastery</strong> module. Here's a quick demo flow:\n\n<strong>1. Start with the Dashboard</strong> \u2014 Show org-level risk posture (2 min)\n<strong>2. SCA Scan</strong> \u2014 Run a scan, show reachability analysis (5 min)\n<strong>3. Auto-Fix</strong> \u2014 Generate a PR with the fix (3 min)\n<strong>4. Policy Gates</strong> \u2014 Show PR blocked by policy, then approved (3 min)\n<strong>5. SAST Finding</strong> \u2014 Show AI-generated code fix (3 min)\n\nTotal: ~16 min. <a href='modules/technical/02-demo-mastery.html'>View Demo Mastery module &rarr;</a>"
        },
        {
            keywords: ['objection', 'sales', 'pitch', 'sell', 'deal', 'pricing', 'price'],
            response: "Common objections and how to handle them:\n\n<strong>\"We already use Snyk\"</strong>\n\u2192 \"Snyk is great for basic SCA. Mend goes deeper with reachability analysis \u2014 so your team fixes what actually matters, not just what exists.\"\n\n<strong>\"It's too expensive\"</strong>\n\u2192 \"Consider the cost of a breach vs. the cost of prevention. Mend customers see 70% reduction in critical vulnerabilities within 90 days.\"\n\n<strong>\"Our developers won't adopt another tool\"</strong>\n\u2192 \"Mend integrates directly into IDEs and CI/CD \u2014 developers don't change their workflow.\"\n\nPractice more in the <a href='modules/sales/03-objection-handling.html'>Objection Handling module &rarr;</a>"
        },
        {
            keywords: ['cicd', 'ci/cd', 'pipeline', 'jenkins', 'github actions', 'gitlab'],
            response: "Mend integrates with all major CI/CD platforms:\n\n<strong>1. GitHub Actions</strong> \u2014 Native app + workflow action\n<strong>2. Jenkins</strong> \u2014 Plugin with policy gates\n<strong>3. GitLab CI</strong> \u2014 Scanner integration with MR comments\n<strong>4. Azure DevOps</strong> \u2014 Extension with dashboard\n<strong>5. Bitbucket Pipelines</strong> \u2014 Pipe with PR annotations\n\nThe <strong>CI/CD Integration</strong> track covers setup and automation. <a href='modules/cicd/01-pipeline-fundamentals.html'>Start here &rarr;</a>"
        },
        {
            keywords: ['renovate', 'upgrade', 'update', 'dependency management'],
            response: "Mend Renovate automatically keeps your dependencies up-to-date:\n\n<strong>1. Automated PRs</strong> \u2014 Creates PRs when new versions are available\n<strong>2. Merge Confidence</strong> \u2014 Shows adoption rate and test pass rate for new versions\n<strong>3. Scheduling</strong> \u2014 Configure update windows (e.g., weekdays only)\n<strong>4. Grouping</strong> \u2014 Bundle related updates into single PRs\n\nLearn more in the <a href='modules/developer/04-renovate-setup.html'>Renovate Setup module &rarr;</a>"
        },
        {
            keywords: ['api', 'automat', 'script', 'integrate'],
            response: "The Mend API enables full automation:\n\n<strong>REST API</strong> \u2014 Manage orgs, projects, policies, and scan results\n<strong>Webhooks</strong> \u2014 Get real-time notifications on new vulnerabilities\n<strong>CLI Tool</strong> \u2014 Script scans in any pipeline\n<strong>SDK</strong> \u2014 Python and Node.js client libraries\n\nThe <a href='modules/enterprise/02-api-automation.html'>API & Automation module</a> covers this in depth."
        },
        {
            keywords: ['license', 'compliance', 'gpl', 'legal'],
            response: "Mend License Compliance helps manage open-source legal risk:\n\n<strong>1. License Detection</strong> \u2014 Identifies licenses for all dependencies\n<strong>2. Policy Engine</strong> \u2014 Block copyleft (GPL), restrict specific licenses\n<strong>3. Attribution Reports</strong> \u2014 Auto-generate NOTICE files\n<strong>4. License Compatibility</strong> \u2014 Flag conflicting license combinations\n\nLearn more in the <a href='modules/sca/03-license-compliance.html'>License Compliance module &rarr;</a>"
        },
        {
            keywords: ['badge', 'achievement', 'reward', 'gamif'],
            response: `You currently have <strong>${MendBadges ? MendBadges.getEarnedBadges().length : 0} badges</strong> earned! Badges are awarded for:\n\n\u2022 <strong>First Steps</strong> \u2014 Complete your first module\n\u2022 <strong>Track Champion</strong> \u2014 Complete any full track\n\u2022 <strong>Quiz Master</strong> \u2014 Score 100% on any quiz\n\u2022 <strong>Streak Hero</strong> \u2014 Maintain a 7-day streak\n\u2022 <strong>XP Milestone</strong> \u2014 Reach 1,000 / 5,000 / 10,000 XP\n\nVisit your <a href='profile.html'>Profile</a> to see all your achievements!`
        },
        {
            keywords: ['progress', 'status', 'how am i', 'my stats', 'dashboard'],
            response: `Here's your current progress, ${ctx.name}:\n\n<strong>Level:</strong> ${ctx.level} (${typeof MendStore !== 'undefined' ? MendStore.levelTitle(ctx.level) : ''})\n<strong>XP:</strong> ${ctx.xp.toLocaleString()}\n<strong>Modules Completed:</strong> ${ctx.modules} / 61\n<strong>Certifications:</strong> ${ctx.certs}\n<strong>Current Streak:</strong> ${ctx.streak} days\n\n` +
                (ctx.modules === 0
                    ? "You haven't started any modules yet. I'd recommend beginning with the <a href='modules/foundation/01-appsec-fundamentals.html'>Foundation Track</a>!"
                    : ctx.modules < 20
                    ? "Great progress! Keep building momentum by completing more tracks."
                    : "Impressive work! You're well on your way to expert level.")
        },
        {
            keywords: ['hello', 'hi', 'hey', 'help', 'what can you'],
            response: `Hello ${ctx.name}! I'm <strong>Mend Mentor</strong>, your AI learning coach. I can help you with:\n\n\u2022 <strong>Product Knowledge</strong> \u2014 SCA, SAST, Containers, Secrets, Supply Chain\n\u2022 <strong>Certification Prep</strong> \u2014 Study plans and exam readiness\n\u2022 <strong>Competitive Positioning</strong> \u2014 Snyk, Veracode, Checkmarx battlecards\n\u2022 <strong>Sales & Demo</strong> \u2014 Objection handling, demo scripts, pitch practice\n\u2022 <strong>Technical Topics</strong> \u2014 CI/CD, API, Renovate, integrations\n\u2022 <strong>Your Progress</strong> \u2014 Stats, badges, and recommendations\n\nTry asking: \"How do I prepare for certification?\" or \"Compare Mend vs Snyk\"`
        },
        {
            keywords: ['recommend', 'suggest', 'what should', 'next', 'where do i start'],
            response: (ctx.modules === 0
                ? `Welcome ${ctx.name}! I'd recommend starting with the <strong>Foundation Track</strong>:\n\n1. AppSec Fundamentals (25 min)\n2. Supply Chain Security (20 min)\n3. Mend Platform Overview (30 min)\n4. Vulnerability Types (25 min)\n5. Compliance Overview (20 min)\n\nThis gives you the base knowledge for all other tracks. <a href='modules/foundation/01-appsec-fundamentals.html'>Start now &rarr;</a>`
                : ctx.modules < 10
                ? `Nice start, ${ctx.name}! Based on your progress, I'd suggest:\n\n1. <strong>SCA Deep Dive</strong> \u2014 The most popular track for partners\n2. <strong>Sales Enablement</strong> \u2014 Great for customer-facing roles\n3. <strong>Developer Track</strong> \u2014 If you're more technical\n\n<a href='learning-paths.html'>Browse all tracks &rarr;</a>`
                : `You're doing great, ${ctx.name}! With ${ctx.modules} modules done, consider:\n\n1. <strong>Technical SE Track</strong> \u2014 Deep technical positioning\n2. <strong>Enterprise Architecture</strong> \u2014 Large deployment patterns\n3. <strong>Certification exam</strong> \u2014 You might be ready!\n\n<a href='certifications.html'>Check your certification readiness &rarr;</a>`)
        },
        {
            keywords: ['partner', 'allbound', 'portal', 'tier', 'silver', 'gold', 'platinum'],
            response: "Mend's partner program has three tiers:\n\n<strong>Silver</strong> \u2014 Foundation access, basic deal registration\n<strong>Gold</strong> \u2014 Advanced training, co-marketing, priority support\n<strong>Platinum</strong> \u2014 Executive sponsorship, joint solutions, dedicated SE\n\nYour learning progress directly impacts your partner status. Certified partners get <strong>higher deal registration margins</strong> and <strong>priority lead distribution</strong>."
        }
    ];

    const defaultResponse = "That's a great question! While I search for the best resources, here are some starting points:\n\n\u2022 <a href='learning-paths.html'>Learning Paths</a> \u2014 Structured courses by topic\n\u2022 <a href='resources.html'>Resources</a> \u2014 Battlecards, guides, and references\n\u2022 <a href='certifications.html'>Certifications</a> \u2014 Validate your knowledge\n\nCould you tell me more about what specific area you'd like to explore?";

    function sendMessage(text) {
        if (!text.trim()) return;

        /* Award AI Student badge on first chat message */
        if (typeof MendBadges !== 'undefined') MendBadges.earn('ai-student');

        const userMsg = document.createElement('div');
        userMsg.className = 'chat-message user';
        userMsg.innerHTML = `
            <div class="chat-bubble">${escapeHtml(text)}</div>
        `;
        chatMessages.appendChild(userMsg);
        chatInput.value = '';
        chatMessages.scrollTop = chatMessages.scrollHeight;

        /* Show typing indicator */
        const typing = document.createElement('div');
        typing.className = 'chat-message ai';
        typing.innerHTML = '<div class="chat-bubble chat-typing"><span></span><span></span><span></span></div>';
        chatMessages.appendChild(typing);
        chatMessages.scrollTop = chatMessages.scrollHeight;

        setTimeout(() => {
            typing.remove();
            const lower = text.toLowerCase();
            const match = responses.find(r =>
                r.keywords.some(k => lower.includes(k))
            );

            const aiMsg = document.createElement('div');
            aiMsg.className = 'chat-message ai';
            const reply = match ? (typeof match.response === 'function' ? match.response() : match.response) : defaultResponse;
            aiMsg.innerHTML = `<div class="chat-bubble">${reply}</div>`;
            chatMessages.appendChild(aiMsg);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }, 1000 + Math.random() * 500);
    }

    chatSend.addEventListener('click', () => sendMessage(chatInput.value));
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage(chatInput.value);
    });

    document.querySelectorAll('.chat-suggestion').forEach(btn => {
        btn.setAttribute('role', 'button');
        btn.setAttribute('tabindex', '0');
        btn.addEventListener('click', () => {
            sendMessage(btn.textContent);
        });
        btn.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                sendMessage(btn.textContent);
            }
        });
    });
}

/* --- Search (delegates to MendSearch in search.js) --- */
