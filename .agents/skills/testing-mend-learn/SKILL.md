---
name: testing-mend-learn
description: Test the Mend Learn static HTML prototype end-to-end. Use when verifying UI pages, filtering, navigation, AI chat, or interactive features.
---

# Testing Mend Learn Prototype

## Overview
Mend Learn is a static HTML/CSS/JS prototype (no backend, no build step). All pages are standalone `.html` files served from the repo root.

## Serving Locally
```bash
cd ~/repos/MendLearn && python3 -m http.server 8080 &
```
Verify with: `curl -s -o /dev/null -w "%{http_code}" http://localhost:8080/index.html` (expect 200).

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

## Interactive Features (js/app.js)

### Filtering
- Filter bars use `data-filter` on buttons and `data-category` on cards
- Single-select by default; clicking a filter hides non-matching cards via `display:none`
- "All" filter shows everything
- Test by clicking a filter and counting visible cards

### AI Chat Keywords
The chat responds to these keywords with specific responses:
- `sca`, `composition`, `dependency` → SCA product info
- `sast`, `static`, `code analysis` → SAST product info
- `certification`, `cert`, `exam`, `certified` → Certification study plan
- `compete`, `snyk`, `veracode`, `checkmarx` → Competitive positioning
- `demo`, `poc`, `presentation` → Demo preparation
- `hello`, `hi`, `hey`, `help` → Greeting/help menu
- Anything else → Default generic response

Suggestion buttons in the chat also trigger messages when clicked.

### Course Start Buttons
- Buttons with `data-action="start-course"` change text to "In Progress", swap to secondary style, become disabled, set progress bar to 15%, and show a toast notification
- Buttons with `data-action="launch-lab"` show a toast notification

### Navigation
- All pages link to each other via the header nav
- The avatar/JD circle in the header links to profile.html
- Logo links to index.html

## Expected Mock Data
The prototype uses a fixed persona: Jane Doe, Sales Engineer at Acme Security (VAR), Silver Partner.
- Level 5, 2,450 XP, 14-day streak, 8 badges, 1 certification (Associate)
- Professional certification: 68% in-progress
- Rank #23 on leaderboard

## Browser Setup Notes
- Chrome may need to be installed: `wget -q https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb -O /tmp/chrome.deb && sudo dpkg -i /tmp/chrome.deb && sudo apt-get -f install -y`
- Launch: `DISPLAY=:0 google-chrome-stable --no-first-run --disable-session-crashed-bubble --no-default-browser-check --disable-gpu http://localhost:8080/index.html &`
- Maximize: `DISPLAY=:0 wmctrl -r :ACTIVE: -b add,maximized_vert,maximized_horz`

## Devin Secrets Needed
None — this is a fully static prototype with no authentication or API calls.
