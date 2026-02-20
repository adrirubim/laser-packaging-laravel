import { renderToString } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import PlanningLegend from './PlanningLegend';
import type { RangeMode, ZoomLevel } from './types';

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
