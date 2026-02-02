/**
 * Opzioni per il campo type_lot in Orders
 *
 * Valori secondo legacy order.php:
 * - 0 = "Inserimento Manuale"
 * - 1 = "Lotto a 6 cifre"
 * - 2 = "Lotto a 4 cifre"
 */
export const LOT_TYPE_OPTIONS = [
    { value: 0, label: 'Inserimento Manuale' },
    { value: 1, label: 'Lotto a 6 cifre' },
    { value: 2, label: 'Lotto a 4 cifre' },
] as const;

/**
 * Restituisce l'etichetta per un valore di tipo lotto
 */
export function getLotTypeText(value: number | null | undefined): string {
    if (value === null || value === undefined) return '';
    const option = LOT_TYPE_OPTIONS.find((opt) => opt.value === value);
    return option?.label || String(value);
}
