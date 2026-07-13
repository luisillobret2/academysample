const js = require('@eslint/js');
const globals = require('globals');

// Shared globals defined across the vanilla browser scripts (no bundler / modules).
const appGlobals = {
    MendStore: 'readonly',
    MendTracks: 'readonly',
    MendSearch: 'readonly',
    MendBadges: 'readonly',
    Layout: 'readonly',
    showToast: 'readonly',
    escapeHtml: 'readonly',
    // Page initializers split out of app.js into focused files; invoked from
    // the app.js DOMContentLoaded bootstrap.
    initChat: 'readonly',
    initHomepageDynamic: 'readonly',
    initLeaderboardToggle: 'readonly',
    initDynamicLeaderboard: 'readonly',
    initCertRecommendations: 'readonly',
    initAchievementBadges: 'readonly',
};

module.exports = [
    js.configs.recommended,
    {
        files: ['js/**/*.js'],
        languageOptions: {
            ecmaVersion: 2022,
            sourceType: 'script',
            globals: {
                ...globals.browser,
                ...appGlobals,
            },
        },
        rules: {
            'no-unused-vars': ['warn', { args: 'none', varsIgnorePattern: '^_' }],
            'no-empty': ['warn', { allowEmptyCatch: true }],
            'no-useless-escape': 'warn',
            // The singleton objects (MendStore, etc.) are declared in one file
            // and referenced as globals elsewhere; some helpers reuse `var` names
            // across if/else branches. This is the intended no-bundler pattern.
            'no-redeclare': 'off',
        },
    },
];
