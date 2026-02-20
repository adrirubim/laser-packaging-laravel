import { renderToString } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import PlanningToolbar from './PlanningToolbar';
import type { RangeMode, ZoomLevel } from './types';

const noop = () => {};

const baseProps = {
    currentDate: '2026-02-17',
    today: '2026-02-17',
    rangeMode: 'day' as RangeMode,
    zoomLevel: 'hour' as ZoomLevel,
    loading: false,
    goPrev: noop,
    goNext: noop,
    goToday: noop,
    onSetRangeMode: noop,
    onSetZoomLevel: noop,
    formatDateRangeLabel: vi.fn(() => '17/02/2026'),
};

describe('PlanningToolbar', () => {
    it('renderiza los controles básicos y el botón Oggi', () => {
        const html = renderToString(<PlanningToolbar {...baseProps} />);

        expect(html).toContain('Oggi');
        expect(html).toContain('Diaria');
        expect(html).toContain('Settimanale');
        expect(html).toContain('Mensile');
        expect(baseProps.formatDateRangeLabel).toHaveBeenCalledWith(
            baseProps.currentDate,
            baseProps.rangeMode,
        );
    });

    it('marca los botones de periodo correctamente según rangeMode', () => {
        const htmlDay = renderToString(
            <PlanningToolbar {...baseProps} rangeMode={'day' as RangeMode} />,
        );
        const htmlWeek = renderToString(
            <PlanningToolbar {...baseProps} rangeMode={'week' as RangeMode} />,
        );
        const htmlMonth = renderToString(
            <PlanningToolbar {...baseProps} rangeMode={'month' as RangeMode} />,
        );

        expect(htmlDay).toContain('Diaria');
        expect(htmlWeek).toContain('Settimanale');
        expect(htmlMonth).toContain('Mensile');
    });

    it('desactiva navegación siguiente cuando loading es true', () => {
        const html = renderToString(
            <PlanningToolbar {...baseProps} loading={true} />,
        );

        expect(html).toContain('disabled');
    });
});
