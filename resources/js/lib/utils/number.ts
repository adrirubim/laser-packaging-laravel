/**
 * Utilità per lavorare con numeri, in particolare campi decimali
 * che arrivano come stringhe da Laravel (casting decimal:2)
 */

/**
 * Converte un valore che può essere number, string o null in number
 * Gestisce il caso dei campi decimali di Laravel che arrivano come stringhe
 *
 * @param value - Valore da parsare (number | string | null | undefined)
 * @param defaultValue - Valore di default se il valore è invalido (default: 0)
 * @returns Numero parsato o defaultValue
 */
export function parseDecimal(
    value: number | string | null | undefined,
    defaultValue: number = 0,
): number {
    if (value === null || value === undefined) {
        return defaultValue;
    }

    if (typeof value === 'number') {
        return isNaN(value) ? defaultValue : value;
    }

    if (typeof value === 'string') {
        const parsed = parseFloat(value);
        return isNaN(parsed) ? defaultValue : parsed;
    }

    return defaultValue;
}

/**
 * Formatta un numero decimale in stringa con 2 decimali
 *
 * @param value - Valore da formattare (number | string | null | undefined)
 * @param decimals - Numero di decimali (default: 2)
 * @param defaultValue - Valore di default se invalido (default: '-')
 * @returns Stringa formattata o defaultValue
 */
export function formatDecimal(
    value: number | string | null | undefined,
    decimals: number = 2,
    defaultValue: string = '-',
): string {
    const parsed = parseDecimal(value);
    if (parsed === 0 && value !== 0 && value !== '0') {
        return defaultValue;
    }
    return parsed.toFixed(decimals);
}

/**
 * Verifica se un valore decimale è valido (non null, undefined, NaN)
 *
 * @param value - Valore da verificare
 * @returns true se il valore è valido
 */
export function isValidDecimal(
    value: number | string | null | undefined,
): boolean {
    if (value === null || value === undefined) {
        return false;
    }

    const parsed = parseDecimal(value, NaN);
    return !isNaN(parsed);
}

/**
 * Calcola la percentuale di avanzamento in base a quantità lavorata vs totale
 *
 * @param worked - Quantità lavorata
 * @param total - Quantità totale
 * @returns Percentuale (0-100)
 */
export function calculateProgress(
    worked: number | string | null | undefined,
    total: number | string | null | undefined,
): number {
    const workedNum = parseDecimal(worked);
    const totalNum = parseDecimal(total);

    if (!totalNum || totalNum === 0) {
        return 0;
    }

    if (!workedNum || workedNum === 0) {
        return 0;
    }

    return Math.min(100, Math.round((workedNum / totalNum) * 100));
}
