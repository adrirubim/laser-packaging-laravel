import { renderToString } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import PlanningDayGridView from './PlanningDayGridView';
import type {
    PlanningContract,
    PlanningLine,
    SlotColumn,
    ZoomLevel,
} from './types';

vi.mock('@/hooks/use-translations', () => {
    const itTranslations: Record<string, string> = {
        'planning.no_columns':
            'Nessuna colonna disponibile per il periodo selezionato.',
        'planning.column_line': 'Linea',
        'common.order': 'Ordine',
        'planning.zoom_quarters': 'Zoom quarti',
        'planning.grid_caption': 'Griglia pianificazione',
        'planning.scroll_hint': 'Scroll orizzontale',
        'planning.no_lines_period': 'Nessuna linea nel periodo.',
        'planning.go_today': 'Vai a oggi',
        'planning.change_period': 'Cambia periodo',
        'common.empty_value': '—',
    };
    return {
        useTranslations: () => ({
            t: (key: string) => itTranslations[key] ?? key,
        }),
    };
});

describe('PlanningDayGridView', () => {
    const slotColumns: SlotColumn[] = [];
    const lines: PlanningLine[] = [];
    const planningData: Record<string, number> = {};
    const totalsByTimestamp: Record<number, number> = {};
    const contracts: PlanningContract[] = [];
    const zoomLevel: ZoomLevel = 'hour';

    it('se renderiza sin errores con datos vacíos', () => {
        const html = renderToString(
            <PlanningDayGridView
                slotColumns={slotColumns}
                lines={lines}
                planningData={planningData}
                totalsByTimestamp={totalsByTimestamp}
                zoomLevel={zoomLevel}
                getSummaryValueForSlot={() => 0}
                isSummaryValueCustom={() => false}
                contracts={contracts}
                loading={false}
                editingCellKey={null}
                editingValue=""
                setEditingCellKey={() => {}}
                setEditingValue={() => {}}
                onSavePlanningCell={async () => {}}
                editingSummaryKey={null}
                editingSummaryValue=""
                setEditingSummaryKey={() => {}}
                setEditingSummaryValue={() => {}}
                onSaveSummaryCell={async () => {}}
                savingCellKey={null}
                savingSummaryKey={null}
            />,
        );

        // With empty slotColumns the component shows empty state message, not table
        expect(html).toContain('Nessuna colonna disponibile');
    });
});
