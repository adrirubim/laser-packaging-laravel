import { renderToString } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import PlanningLegend from './PlanningLegend';
import type { RangeMode, ZoomLevel } from './types';

vi.mock('@/hooks/use-translations', () => {
    const itTranslations: Record<string, string> = {
        'planning.legend_title': 'Legenda',
        'planning.legend_sr_occupied': 'Occupato',
        'planning.legend_occupied': 'Verde = occupato (addetti)',
        'planning.legend_sr_free': 'Libero',
        'planning.legend_free': 'Grigio = libero',
        'planning.legend_sr_deficit': 'Deficit / scaduto',
        'planning.legend_deficit': 'Rosso = deficit',
        'planning.legend_sr_deadline': 'Deadline',
        'planning.legend_deadline': 'Bordo ambra = deadline',
        'planning.legend_sr_mixed': 'Valori misti',
        'planning.legend_mixed': '* = valori misti',
        'planning.legend_keyboard_hints':
            'Suggerimenti tastiera: Tab / Enter per spostarsi tra celle.',
    };
    return {
        useTranslations: () => ({
            t: (key: string) => itTranslations[key] ?? key,
        }),
    };
});

describe('PlanningLegend', () => {
    it('se renderiza sin errores y muestra la leyenda', () => {
        const html = renderToString(
            <PlanningLegend
                rangeMode={'day' as RangeMode}
                zoomLevel={'hour' as ZoomLevel}
            />,
        );

        expect(html.toLowerCase()).toContain('legenda');
    });

    it('incluye los suggerimenti de teclado', () => {
        const html = renderToString(
            <PlanningLegend
                rangeMode={'week' as RangeMode}
                zoomLevel={'hour' as ZoomLevel}
            />,
        );

        expect(html).toContain('Suggerimenti tastiera');
    });
});
