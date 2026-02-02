/**
 * Costanti condivise per gli stati degli ordini
 */

export const ORDER_STATUS_LABELS: Record<number, string> = {
    0: 'Pianificato',
    1: 'In Allestimento',
    2: 'Lanciato',
    3: 'In Avanzamento',
    4: 'Sospeso',
    5: 'Evaso',
    6: 'Saldato',
};

export const ORDER_STATUS_COLORS: Record<number, string> = {
    0: 'bg-gray-500/10 text-gray-700 dark:text-gray-300 border-gray-500/40',
    1: 'bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/40',
    2: 'bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/40',
    3: 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-300 border-yellow-500/40',
    4: 'bg-red-500/10 text-red-700 dark:text-red-300 border-red-500/40',
    5: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/40',
    6: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/40',
};

export const ORDER_STATUS_OPTIONS = [
    { value: '', label: 'Tutti gli stati' },
    { value: '0', label: 'Pianificato' },
    { value: '1', label: 'In Allestimento' },
    { value: '2', label: 'Lanciato' },
    { value: '3', label: 'In Avanzamento' },
    { value: '4', label: 'Sospeso' },
    { value: 'completed', label: 'Completate (Evaso + Saldato)' },
];

/**
 * Restituisce l'etichetta di uno stato ordine
 */
export function getOrderStatusLabel(status: number): string {
    return ORDER_STATUS_LABELS[status] || `Stato ${status}`;
}

/**
 * Restituisce il colore di uno stato ordine
 */
export function getOrderStatusColor(status: number): string {
    return ORDER_STATUS_COLORS[status] || 'bg-muted';
}
