/**
 * Shared constants for order status labels.
 * Use translation keys; resolve with t(getOrderStatusLabelKey(status)) in components.
 */

export const ORDER_STATUS_LABEL_KEYS: Record<number, string> = {
    0: 'orders.status.planned',
    1: 'orders.status.preparation',
    2: 'orders.status.launched',
    3: 'orders.status.advancement',
    4: 'orders.status.suspended',
    5: 'orders.status.shipped',
    6: 'orders.status.paid',
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

export const ORDER_STATUS_OPTION_KEYS = [
    { value: '', labelKey: 'orders.filter.status_all_simple' },
    { value: '0', labelKey: 'orders.status.planned' },
    { value: '1', labelKey: 'orders.status.preparation' },
    { value: '2', labelKey: 'orders.status.launched' },
    { value: '3', labelKey: 'orders.status.advancement' },
    { value: '4', labelKey: 'orders.status.suspended' },
    { value: 'completed', labelKey: 'orders.filter.status_completed' },
] as const;

/**
 * Returns the translation key for an order status
 */
export function getOrderStatusLabelKey(status: number): string {
    return ORDER_STATUS_LABEL_KEYS[status] ?? 'orders.status.unknown';
}

/**
 * Returns the Tailwind classes for an order status badge
 */
export function getOrderStatusColor(status: number): string {
    return (
        ORDER_STATUS_COLORS[status] ??
        'bg-gray-500/10 text-gray-700 dark:text-gray-300 border-gray-500/40'
    );
}
