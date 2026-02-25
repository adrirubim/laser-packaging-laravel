/**
 * Integration test for Planning/Index page.
 * Asserts fixed title, subtitle per view, toolbar, and that it renders without errors.
 * useTranslations is mocked to isolate i18n; real keys are validated by i18n-check.
 */
import React from 'react';
import { renderToString } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import PlanningBoard from './Index';

vi.mock('@/hooks/use-translations', () => ({
    useTranslations: () => ({ t: (key: string) => key }),
}));

vi.mock('@inertiajs/react', () => ({
    Head: () => null,
    usePage: () => ({ props: {} }),
}));

vi.mock('@/layouts/app-layout', () => ({
    default: ({ children }: { children: React.ReactNode }) => children,
}));

vi.mock('@/components/error-boundary', () => ({
    ErrorBoundary: ({ children }: { children: React.ReactNode }) => children,
}));

vi.mock('sonner', () => ({
    toast: { success: vi.fn() },
}));

vi.mock('@/routes', () => ({
    dashboard: () => ({ url: () => '/' }),
}));

vi.mock('@/routes/api', () => ({
    default: {
        planning: {
            data: { url: () => '/api/planning/data' },
            save: { url: () => '/api/planning/save' },
            summary: { save: { url: () => '/api/planning/summary/save' } },
        },
    },
}));

vi.mock('@/routes/planning', () => ({
    default: { index: { url: () => '/planning' } },
}));

// Lazy-loaded views: minimal components to avoid suspense and loading the full grid
vi.mock('./PlanningDayGridView', () => ({
    default: function MockDayGrid() {
        return React.createElement(
            'div',
            { 'data-testid': 'day-grid' },
            'DayGrid',
        );
    },
}));

vi.mock('./PlanningMonthSummary', () => ({
    default: function MockMonthSummary() {
        return React.createElement(
            'div',
            { 'data-testid': 'month-summary' },
            'MonthSummary',
        );
    },
}));

describe('Planning Index (integration)', () => {
    const today = '2026-02-23';

    it('renders without errors with minimal props', () => {
        const html = renderToString(<PlanningBoard today={today} />);

        expect(html).toContain('planning.page_title');
        expect(html).toContain('planning.today');
        expect(html).toContain('planning.range_day');
        expect(html).toContain('planning.range_week');
        expect(html).toContain('planning.range_month');
    });

    it('shows day view subtitle by default', () => {
        const html = renderToString(<PlanningBoard today={today} />);

        expect(html).toContain('planning.view_description_day');
    });

    it('includes legend and controls area', () => {
        const html = renderToString(<PlanningBoard today={today} />);

        expect(html).toContain('planning.legend_keyboard_hints');
        expect(html).toMatch(/planning\.date_label|planning\.range_label/);
    });

    it('renders main content (toolbar + legend or grid)', () => {
        const html = renderToString(<PlanningBoard today={today} />);
        const hasGridOrFallback =
            html.includes('DayGrid') || html.includes('planning.loading_grid');

        expect(hasGridOrFallback).toBe(true);
    });
});
