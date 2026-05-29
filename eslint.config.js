const js = require('@eslint/js');
const globals = require('globals');
const playwright = require('eslint-plugin-playwright');

/**
 * ESLint configuration.
 *
 * Uses the modern flat-config format (eslint.config.js, not .eslintrc).
 * Three layers of rules:
 *   1. ESLint's recommended JavaScript rules
 *   2. Playwright plugin's recommended rules (no waitForTimeout, etc.)
 *   3. Project-specific tweaks
 */
module.exports = [
  // 1. Base JavaScript rules
  js.configs.recommended,

  // 2. Settings for all our source files
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'commonjs',
      globals: {
        ...globals.node,    // recognise Node.js globals (process, require, etc.)
      },
    },
    rules: {
      // Catch real bugs
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      'no-console': 'warn',
      'no-undef': 'error',

      // Style: things that should be consistent
      'semi': ['error', 'always'],
      'quotes': ['error', 'single', { avoidEscape: true }],
      'indent': ['error', 2, { SwitchCase: 1 }],
      'comma-dangle': ['error', 'always-multiline'],

      // Best practices
      'eqeqeq': ['error', 'always'],          // require === instead of ==
      'prefer-const': 'warn',
      'no-var': 'error',
    },
  },

  // 3. Extra rules just for test files
  {
    files: ['tests/**/*.js'],
    plugins: {
      playwright,
    },
    rules: {
      ...playwright.configs['flat/recommended'].rules,
      // We're stricter in test files
      'playwright/no-wait-for-timeout': 'error',
      'playwright/no-conditional-in-test': 'warn',
      'playwright/no-focused-test': 'error',
      'playwright/expect-expect': 'error',
    },
  },

  // 4. Ignore folders we don't care about
  {
    ignores: [
      'node_modules/',
      'playwright-report/',
      'test-results/',
      'blob-report/',
    ],
  },
];
