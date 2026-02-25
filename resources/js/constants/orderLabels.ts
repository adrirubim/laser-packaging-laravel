/**
 * Options for label fields (labels) in Orders.
 * Use translation keys; resolve with t(getLabelOptionKey(value)) in components.
 *
 * Values per legacy order.php:
 * - 0 = "Not present"
 * - 1 = "To print"
 * - 2 = "To receive"
 */
export const LABEL_OPTION_KEYS = [
    { value: 0, labelKey: 'orders.labels.not_present' },
    { value: 1, labelKey: 'orders.labels.to_print' },
    { value: 2, labelKey: 'orders.labels.to_receive' },
] as const;

/**
 * Returns the translation key for a label value
 */
export function getLabelOptionKey(
    value: number | null | undefined,
): string | null {
    if (value === null || value === undefined) return null;
    const option = LABEL_OPTION_KEYS.find((opt) => opt.value === value);
    return option?.labelKey ?? null;
}
