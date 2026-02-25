/**
 * Options for type_lot field in Orders.
 * Use translation keys; resolve with t(getLotTypeOptionKey(value)) in components.
 *
 * Values per legacy order.php:
 * - 0 = "Manual entry"
 * - 1 = "6-digit lot"
 * - 2 = "4-digit lot"
 */
export const LOT_TYPE_OPTION_KEYS = [
    { value: 0, labelKey: 'orders.lot_type.manual' },
    { value: 1, labelKey: 'orders.lot_type.six_digits' },
    { value: 2, labelKey: 'orders.lot_type.four_digits' },
] as const;

/**
 * Returns the translation key for a lot type value
 */
export function getLotTypeOptionKey(
    value: number | null | undefined,
): string | null {
    if (value === null || value === undefined) return null;
    const option = LOT_TYPE_OPTION_KEYS.find((opt) => opt.value === value);
    return option?.labelKey ?? null;
}
