/**
 * Opzioni per i campi labels (etichette) in Orders
 *
 * Valori secondo legacy order.php:
 * - 0 = "Non presenti"
 * - 1 = "Da stampare"
 * - 2 = "Da ricevere"
 */
export const LABEL_OPTIONS = [
    { value: 0, label: 'Non presenti' },
    { value: 1, label: 'Da stampare' },
    { value: 2, label: 'Da ricevere' },
] as const;

/**
 * Restituisce l'etichetta per un valore di etichetta
 */
export function getLabelText(value: number | null | undefined): string {
    if (value === null || value === undefined) return '';
    const option = LABEL_OPTIONS.find((opt) => opt.value === value);
    return option?.label || String(value);
}
