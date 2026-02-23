/**
 * Test de integración de la página Planning/Index.
 * Comprueba título fijo, subtítulo por vista, toolbar y que no explota al renderizar.
 */
import React from 'react';
import { renderToString } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import PlanningBoard from './Index';

// Mocks para poder renderizar Index sin Inertia, layout ni API
vi.mock('@inertiajs/react', () => ({
    Head: () => null,
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

// Lazy-loaded views: componentes mínimos para no suspender y no cargar toda la grilla
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

describe('Planning Index (integración)', () => {
    const today = '2026-02-23';

    it('renderiza sin errores con props mínimas', () => {
        const html = renderToString(<PlanningBoard today={today} />);

        expect(html).toContain('Pianificazione produzione');
        expect(html).toContain('Oggi');
        expect(html).toContain('Giornaliera');
        expect(html).toContain('Settimanale');
        expect(html).toContain('Mensile');
    });

    it('muestra subtítulo de vista giornaliera por defecto', () => {
        const html = renderToString(<PlanningBoard today={today} />);

        expect(html).toContain('Vista giornaliera per linea e ordine.');
    });

    it('incluye la leyenda y el área de controles', () => {
        const html = renderToString(<PlanningBoard today={today} />);

        expect(html).toContain('Suggerimenti tastiera');
        expect(html).toMatch(/Data:|Range:/);
    });

    it('renderiza contenido principal (toolbar + leyenda o griglia)', () => {
        const html = renderToString(<PlanningBoard today={today} />);
        const hasGridOrFallback =
            html.includes('DayGrid') || html.includes('Caricamento griglia');

        expect(hasGridOrFallback).toBe(true);
    });
});
