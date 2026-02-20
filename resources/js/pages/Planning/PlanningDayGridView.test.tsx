import { renderToString } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import PlanningDayGridView from './PlanningDayGridView';
import type {
    PlanningContract,
    PlanningLine,
    SlotColumn,
    ZoomLevel,
} from './types';

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

        // Con slotColumns vacío el componente muestra mensaje de estado vacío, no tabla
        expect(html).toContain('Nessuna colonna disponibile');
    });
});
