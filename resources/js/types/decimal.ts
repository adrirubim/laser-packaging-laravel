/**
 * Tipi TypeScript condivisi per campi decimali
 * che arrivano come stringhe da Laravel (casting decimal:2)
 */

/**
 * Tipo per campi decimali che possono arrivare come number, string o null da Laravel
 * Utile per campi come quantity, worked_quantity, ecc.
 */
export type DecimalField = number | string | null | undefined;

/**
 * Tipo per modelli che hanno campi decimali
 */
export interface WithDecimalFields {
    quantity?: DecimalField;
    worked_quantity?: DecimalField;
}
