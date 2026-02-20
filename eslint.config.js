import { fixupPluginRules } from '@eslint/compat';
import js from '@eslint/js';
import prettier from 'eslint-config-prettier/flat';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import globals from 'globals';
import typescript from 'typescript-eslint';

/** @type {import('eslint').Linter.Config[]} */
export default [
    js.configs.recommended,
    // fixupPluginRules adapta plugins legacy (getSourceCode, etc.) a la API de ESLint 9/10
    { plugins: { 'react-hooks': fixupPluginRules(reactHooks) }, rules: reactHooks.configs.recommended.rules },
    ...typescript.configs.recommended,
    {
        plugins: { react: fixupPluginRules(react) },
        languageOptions: {
            globals: { ...globals.browser },
            parserOptions: { ecmaFeatures: { jsx: true } },
        },
        rules: {
            ...react.configs.recommended.rules,
            'react/react-in-jsx-scope': 'off',
            'react/prop-types': 'off',
            'react/no-unescaped-entities': 'off',
        },
        settings: {
            react: { version: 'detect' },
        },
    },
    {
        ignores: [
            'eslint.config.js',
            'vendor',
            'node_modules',
            'public',
            'storage',
            'bootstrap/ssr',
            'tailwind.config.js',
        ],
    },
    // Scripts Node (.cjs): globals node y permitir require
    {
        files: ['scripts/**/*.cjs'],
        languageOptions: {
            globals: { ...globals.node },
            parserOptions: { ecmaVersion: 2022 },
        },
        rules: {
            '@typescript-eslint/no-require-imports': 'off',
            'no-undef': 'off',
            '@typescript-eslint/no-unused-vars': 'off',
        },
    },
    prettier, // Turn off all rules that might conflict with Prettier
];
