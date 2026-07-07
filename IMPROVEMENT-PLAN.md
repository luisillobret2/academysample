# Mend Learn - Improvement Plan

## Current State Summary

The project is a **static HTML/CSS/JS prototype** of a Mend.io partner learning platform. It includes 61 module pages across 12 tracks, 6 battlecards, gamification (XP, badges, streaks, leaderboard), an AI Coach chat (keyword-based), client-side search, dark mode, quiz functionality, certificate generation, and localStorage-based persistence. No build tools, no backend, no framework.

---

## Priority 1 - Critical / High Impact

### 1. Accessibility (A11Y) Gaps
- **No skip-to-content link** on any page
- **Missing ARIA roles** on interactive widgets (filter bar buttons, chat panel, notification dropdown, quiz options)
- **Keyboard navigation** is incomplete: chat suggestions, filter buttons, and quiz options lack `tabindex` / keyboard event handlers
- **Color contrast** issues in dark mode (muted text on dark backgrounds may not meet WCAG AA 4.5:1)
- **No `alt` text** on decorative emoji icons used as functional indicators
- **No focus management** when modals open (certificate modal, profile edit modal) - focus should be trapped inside

### 2. No Automated Testing
- Zero unit tests, integration tests, or end-to-end tests
- No CI pipeline (no GitHub Actions, no linting, no test runner)
- **Recommendation:** Add at minimum:
  - ESLint + Stylelint for code quality
  - Playwright or Cypress E2E tests for critical flows (quiz submission, module completion, search, certificate generation)
  - GitHub Actions CI workflow to run lint + tests on PRs

### 3. No Build/Bundle Step
- 4 raw JS files loaded via `<script>` tags (~2,600 lines total)
- 4 CSS files loaded separately (~3,400 lines total)
- No minification, no tree-shaking, no bundling
- **Recommendation:** Introduce a lightweight bundler (Vite is ideal for this) to:
  - Bundle and minify JS/CSS
  - Enable hot module reloading for development
  - Add source maps for debugging
  - Enable future framework migration (e.g., to React/Svelte)

### 4. AI Coach Is Keyword-Only (No Real AI)
- The "AI Coach" chat uses hardcoded keyword matching with static response templates
- No LLM integration, no RAG, no real intelligence
- Users who ask questions outside the ~20 keyword groups get a generic fallback
- **Recommendation:** Integrate a real LLM API (OpenAI, Anthropic, etc.) with RAG over the module content. This is the single highest-impact feature improvement.

---

## Priority 2 - Important / Medium Impact

### 5. Data Persistence is localStorage-Only
- All user progress, quiz scores, badges, and certifications exist only in the browser's localStorage
- Clearing browser data wipes everything
- No cross-device sync, no server-side persistence
- **Recommendation:** Add a backend (even a simple one: Firebase/Supabase/serverless functions) with user authentication and database persistence

### 6. No Authentication / User Management
- Hardcoded default user "Jane Doe" / "Acme Security"
- No login/registration system
- No SSO integration (Allbound integration is documented but not implemented)
- **Recommendation:** This is essential before any real deployment. Even for a prototype demo, consider adding a mock auth flow

### 7. Duplicated HTML Across 61+ Module Pages
- Every module page is a standalone ~300-line HTML file with duplicated boilerplate (sidebar nav, breadcrumbs, head section)
- Adding a new module or changing the sidebar requires editing 61 files
- **Recommendation:** Move to a template system:
  - Option A: Static site generator (Eleventy/11ty is closest to current approach)
  - Option B: Component framework (Astro, Next.js, SvelteKit)
  - Option C: At minimum, use JS-based template injection (similar to current `layout.js` approach but extended to module content)

### 8. No Real Lab Environments
- Labs page exists but all lab buttons show "coming soon" toast
- No sandbox, no embedded environments
- **Recommendation:** Integrate with Instruqt, Killercoda, or a custom Docker-based lab provider

### 9. Mobile Experience Issues
- Mobile menu search is injected dynamically but has no close button
- Module sidebar doesn't have a mobile-friendly collapse/expand
- Certificate modal is not responsive (fixed width)
- Quiz options are small tap targets on mobile

---

## Priority 3 - Nice to Have / Polish

### 10. Performance Optimizations
- Google Fonts (Poppins) loaded from CDN on every page - could be self-hosted
- No lazy loading on images
- No service worker / offline support (would be valuable for a learning platform)
- Search catalog is a hardcoded array - could use a search index (lunr.js, flexsearch)

### 11. Code Quality & Maintainability
- `app.js` is 1,359 lines in a single file with mixed concerns (chat, badges, leaderboard, cert recommendations, homepage dynamic content)
- Inconsistent coding style: some functions use `var`, others use `const/let`; some use arrow functions, others use `function` declarations
- DOM querying is done by CSS selectors with fragile assumptions (e.g., `.grid-3`, `.card-flat.card-accent`) rather than `data-*` attributes
- Magic numbers throughout (e.g., XP thresholds, track module counts)
- **Recommendation:** Split `app.js` into focused modules (`chat.js`, `badges.js`, `leaderboard.js`, `cert-recommendations.js`, `homepage.js`)

### 12. Content & Feature Completions
- Footer copyright says "2025" - should be 2026
- "Forums", "Events", "Partner Showcase", "Documentation", "Contact", "Allbound Portal" footer links all show "coming soon"
- No progress export (e.g., print transcript, download progress report)
- No bookmark/favorites feature for modules
- Quarterly Challenge section on homepage is static ("Q3 2025", "47 Days Remaining")
- Leaderboard has no time-period filtering (the "This Week / This Month / All Time" tabs don't actually filter)
- Profile page has no avatar upload

### 13. SEO & Meta Tags
- No Open Graph / Twitter Card meta tags
- No structured data (JSON-LD for courses, certifications)
- No sitemap.xml
- No favicon

### 14. Security Considerations
- Quiz answers are "obfuscated" with base64 (`atob`) which is trivially decodable
- Certificate IDs are generated from `Date.now()` - predictable and not unique across users
- localStorage data can be trivially manipulated (users can give themselves unlimited XP, badges, certifications)

---

## Suggested Improvement Roadmap

| Phase | Focus | Estimated Effort |
|-------|-------|-----------------|
| **Phase A** (Quick Wins) | A11Y fixes, ESLint/Stylelint setup, footer copyright fix, favicon, meta tags, split `app.js` | 1-2 days |
| **Phase B** (Foundation) | Introduce Vite build, E2E tests with Playwright, GitHub Actions CI | 2-3 days |
| **Phase C** (Templates) | Migrate module pages to 11ty/Astro templates to eliminate duplication | 3-5 days |
| **Phase D** (Backend) | Add auth + database persistence (Firebase/Supabase) | 3-5 days |
| **Phase E** (AI) | Integrate real LLM for AI Coach with RAG over module content | 3-5 days |
| **Phase F** (Labs) | Set up real lab environments (Instruqt or similar) | 5-10 days |

---

## What's Working Well (Keep)

- Clean, professional visual design with good Mend.io branding
- Comprehensive content architecture (12 tracks, 61 modules)
- Good gamification mechanics (XP, levels, badges, streaks, leaderboard)
- Dark mode support
- Client-side search works well for the content size
- Certificate PDF generation is a nice touch
- Notification center adds engagement
- Module quiz + retry system with score history
- Progress-aware certification recommendations
