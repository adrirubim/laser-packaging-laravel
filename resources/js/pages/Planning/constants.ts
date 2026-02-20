/** Configurazione orari e righe riepilogo (allineata a ZOOM_LEVELS / SUMMARY_ROWS storici). */

export const PLANNING_CONFIG = {
    startHour: 6,
    endHour: 22,
} as const;

export const START_HOUR = PLANNING_CONFIG.startHour;
export const END_HOUR = PLANNING_CONFIG.endHour;

export const SUMMARY_ROWS: { id: string; label: string; editable?: boolean }[] =
    [
        { id: 'totale_impegno', label: 'TOTALE IMPEGNO' },
        { id: 'da_impiegare', label: 'DA IMPIEGARE' },
        { id: 'assenze', label: 'ASSENZE', editable: true },
        { id: 'disponibili', label: 'DISPONIBILI' },
        { id: 'caporeparto', label: 'CAPOREPARTO', editable: true },
        { id: 'magazzinieri', label: 'MAGAZZINIERI', editable: true },
    ];
