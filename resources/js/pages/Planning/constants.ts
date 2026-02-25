/** Configurazione orari e righe riepilogo (allineata a ZOOM_LEVELS / SUMMARY_ROWS storici). */

export const PLANNING_CONFIG = {
    startHour: 6,
    endHour: 22,
} as const;

export const START_HOUR = PLANNING_CONFIG.startHour;
export const END_HOUR = PLANNING_CONFIG.endHour;

export const SUMMARY_ROWS: { id: string; editable?: boolean }[] = [
    { id: 'totale_impegno' },
    { id: 'da_impiegare' },
    { id: 'assenze', editable: true },
    { id: 'disponibili' },
    { id: 'caporeparto', editable: true },
    { id: 'magazzinieri', editable: true },
];
