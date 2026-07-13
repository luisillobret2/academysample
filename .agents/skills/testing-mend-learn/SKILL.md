---
name: testing-mend-learn
description: Test the Mend Learn static HTML prototype end-to-end. Use when verifying UI pages, filtering, navigation, AI chat, module content, quizzes, or interactive features.
---

# Testing Mend Learn Prototype

## Overview
Mend Learn is a static HTML/CSS/JS prototype (no backend, no build step). All pages are standalone `.html` files served from the repo root.

## Serving Locally
```bash
cd ~/repos/academysample && python3 -m http.server 8080 &
```
Verify with: `curl -s -o /dev/null -w "%{http_code}" http://localhost:8080/index.html` (expect 200).

If port 8080 is already in use, kill the existing process first:
```bash
fuser -k 8080/tcp 2>/dev/null; sleep 1
```

## Pages to Test
| Page | URL Path | Key Features |
|------|----------|-------------|
| Homepage | `/index.html` | Dashboard stats, streak widget, course cards, progress bars |
| Learning Paths | `/learning-paths.html` | Filter buttons (All/Beginner/Intermediate/Expert/Sales/Technical/Product), 12 path cards |
| Certifications | `/certifications.html` | 6 certification tiers, progress overview |
| Labs | `/labs.html` | Filter by type (Guided/Challenge) and product (SCA/SAST/Integration/Admin), 12 lab cards |
| Resources | `/resources.html` | Filter by type (Battlecards/Playbooks/Demo Library/Cheat Sheets/Templates/Case Studies) |
| Leaderboard | `/leaderboard.html` | Podium display, full ranking table, quarterly challenge |
| AI Coach | `/ai-coach.html` | Chat interface with keyword-matched responses, suggestion buttons |
| Profile | `/profile.html` | User stats, badges, skill points, certifications, activity feed |

## Module Content Pages (js/module.js, css/module.css)

### Editing / Regenerating Module Pages
Module pages under `modules/` are **generated** from a shared boilerplate
template. Do not hand-edit the `<head>`, scaffold, or `<script>` tags in a
`modules/**/*.html` file — edit the single source instead:
- Shared boilerplate: `templates/module.html`
- Per-module content (title, meta description, `<main>` body): `content/modules/<track>/<name>.html`

After editing either, regenerate and verify:
```bash
npm run build:modules   # content/ + template -> modules/*.html
npm run check:modules   # fails if any modules/*.html is out of sync (also run in CI)
```
The generated `modules/*.html` are committed so the site remains a pure static
deploy (no build step at serve time).

### Module Page Structure
Module pages live in `/modules/{track}/` directories with two-column layout:
- **Sidebar** (sticky left): Track title, progress bar, module list with status indicators
- **Content** (right): Breadcrumb, header with badge/level, content sections, quiz, Mark Complete

### Tracks and Module Paths
| Track | Path Prefix | Modules |
|-------|------------|---------|
| Foundation | `/modules/foundation/` | 01-appsec-fundamentals, 02-supply-chain-security, 03-mend-platform-overview |
| SCA Deep Dive | `/modules/sca/` | 01-sca-overview, 02-reachability-analysis, 03-license-compliance, 04-prioritization, 05-remediation, 06-sbom-reporting |
| SAST Product | `/modules/sast/` | 01-sast-overview, 02-ai-remediation, 03-cicd-integration, 04-custom-rules |
| Container | `/modules/container/` | 01-container-security |
| Sales | `/modules/sales/` | 01-selling-mend |
| Developer | `/modules/developer/` | 01-developer-quickstart |
| Technical SE | `/modules/technical/` | 01-technical-deep-dive |

### Navigation to Modules
- From `/learning-paths.html`: Click "Continue"/"Start"/"Review" button on a path card
- From `/index.html`: Course cards link to module pages (SCA, SAST, Sales)
- Within modules: Use sidebar links or Previous/Next buttons at page bottom

### Quiz Testing (initQuiz in js/module.js)
- Each quiz question has `data-correct` attribute with the correct answer value
- Select radio buttons and click "Check Answers"
- **Correct**: Option gets `.correct` class (green), feedback shows "Correct!"
- **Wrong**: Selected gets `.incorrect` class (red), correct option gets `.correct` (green), feedback shows "Incorrect. See the highlighted answer above."
- **Results**: Shows "X/Y (Z%). Knowledge check passed!" (green, >= 70%) or "Review the material and try again." (red, < 70%)
- Button changes to "Retry" after checking; clicking Retry resets all selections

### Mark Complete Testing (initMarkComplete in js/module.js)
- Button `.mark-complete-btn` at bottom of module pages (not on Foundation modules which are pre-completed)
- Click changes text to "✓ Module Completed", adds `.completed` class
- Toast notification appears at bottom-right: "Module completed! +{XP} XP earned" (XP from `data-xp` attribute)
- Toast auto-dismisses after ~3 seconds
- Sidebar link for active module gets checkmark status indicator

### Video Placeholders
- Click on `.video-placeholder` shows toast: "Video playback is a prototype placeholder"

## Interactive Features (js/app.js)

### Filtering
- Filter bars use `data-filter` on buttons and `data-category` on cards
- Single-select by default; clicking a filter hides non-matching cards via `display:none`
- "All" filter shows everything
- Test by clicking a filter and counting visible cards

### AI Chat Keywords (20+ keyword groups)
The chat responds to keywords with context-aware responses that read from `MendStore.load()` (user progress, XP, level, certs, streak). Key groups:
- `sca`, `composition`, `dependency` → SCA product info
- `sast`, `static`, `code analysis` → SAST product info
- `container`, `docker`, `kubernetes`, `registry` → Container Security features
- `secret`, `credential`, `token`, `leak` → Secrets Detection info
- `supply chain`, `sbom`, `software bill` → Supply Chain Security
- `cicd`, `ci/cd`, `pipeline`, `jenkins`, `github actions` → CI/CD integration
- `renovate`, `dependency update`, `auto-merge` → Renovate/dependency management
- `api`, `rest`, `webhook`, `automation` → API & Automation
- `license`, `compliance`, `gpl`, `copyleft` → License compliance
- `certification`, `cert`, `exam`, `certified` → Context-aware cert recommendation (adapts based on user progress)
- `snyk` → Snyk-specific competitive response
- `veracode` → Veracode-specific competitive response
- `checkmarx` → Checkmarx-specific competitive response
- `objection`, `concern`, `pushback`, `too expensive` → Sales objection handling
- `demo`, `poc`, `presentation` → Demo preparation
- `progress`, `status`, `how am i doing`, `my level` → Real-time user progress from localStorage
- `hello`, `hi`, `hey`, `help` → Greeting/help menu
- Anything else → Default generic response

Test the context-aware responses by checking that progress/cert queries return real localStorage values (not hardcoded). A fresh localStorage will show Level 1, 0 XP, 0/61 modules.

Suggestion buttons in the chat also trigger messages when clicked.

### Notification Center (layout.js)
- Bell icon in nav header (`.nav-notifications`) between dark mode toggle and XP display
- Red `.notif-badge` shows unread count
- Click bell to toggle `.notif-dropdown` (320px wide, up to 400px tall)
- Seeded with 5 notifications on first load (stored in `localStorage` key `mendlearn_notifications`)
- Badge earn events auto-inject into the notification feed
- "Mark all read" link clears unread count; badge hides
- Clicking outside dropdown closes it
- To reset notifications for testing: `localStorage.removeItem('mendlearn_notifications')`

### Achievement Badges (MendBadges in app.js)
- 16 badges total, dynamically awarded based on `MendStore` data
- `MendBadges.checkAndAward()` runs on DOMContentLoaded
- Awards based on: module count, XP thresholds (1000/5000/10000), streak (3/7 days), quiz best scores, track completion, certifications
- "Early Adopter" badge is always awarded (unconditional)
- New earns trigger `.achievement-toast` (fixed bottom-right, auto-dismisses ~3.5s)
- Profile page renders badges in `.profile-badges-dynamic` container via `initAchievementBadges()`
- Earned badges: `.badge-earned` (blue border, accent background)
- Locked badges: `.badge-locked` (opacity 0.35, grayscale filter)
- To test toast: `localStorage.removeItem('mendlearn_badges')` then reload
- localStorage key: `mendlearn_badges` (JSON array of earned badge IDs)

### Dark Mode Toggle
- Moon/sun button in nav header (`.dark-mode-toggle`)
- Toggles `dark-mode` class on `<html>` element
- Persists to `localStorage` key `mendlearn_darkmode`
- All CSS variables update (backgrounds, text, cards, borders)

### Course Start Buttons
- Buttons with `data-action="start-course"` change text to "In Progress", swap to secondary style, become disabled, set progress bar to 15%, and show a toast notification
- Buttons with `data-action="launch-lab"` show a toast notification

### Navigation
- All pages link to each other via the header nav
- The avatar/JD circle in the header links to profile.html
- Logo links to index.html

## Expected Mock Data
The prototype uses a fixed persona: Jane Doe, Sales Engineer at Acme Security (VAR), Silver Partner.
- Initial state (fresh localStorage): Level 1, 0 XP, 0-day streak, 0 modules, 0 certifications
- Static HTML elements still show some hardcoded values (e.g. Rank #23, Certified Associate on profile)
- Dynamic values (hero stats, AI Coach progress response, badge count) read from `MendStore.load()`

## localStorage Keys
| Key | Purpose |
|-----|--------|
| `mendlearn_data` | User progress (XP, modules, certs, streak, profile) |
| `mendlearn_darkmode` | Dark mode state (boolean) |
| `mendlearn_badges` | Earned badge IDs (JSON array) |
| `mendlearn_notifications` | Notification feed (JSON array) |
| `mendlearn_quizscores` | Quiz attempt history and best scores |

## Browser Setup Notes
- Chrome is typically already running in the Devin environment
- Navigate via address bar: triple-click to select URL, type new URL, press Enter
- Maximize: `sudo apt-get install -y wmctrl 2>/dev/null; DISPLAY=:0 wmctrl -r :ACTIVE: -b add,maximized_vert,maximized_horz`

## Devin Secrets Needed
None — this is a fully static prototype with no authentication or API calls.
