/**
 * Regole di validazione riutilizzabili per i formulari
 */

export const validationRules = {
    /**
     * Verifica che il campo sia obbligatorio
     */
    required: (
        message: string = 'Questo campo è obbligatorio',
    ): ((val: string) => string | null) => {
        return (val: string) => {
            if (!val || val.trim() === '') {
                return message;
            }
            return null;
        };
    },

    /**
     * Verifica lunghezza minima
     */
    minLength: (
        min: number,
        message?: string,
    ): ((val: string) => string | null) => {
        return (val: string) => {
            if (val && val.length < min) {
                return message || `Deve contenere almeno ${min} caratteri`;
            }
            return null;
        };
    },

    /**
     * Verifica lunghezza massima
     */
    maxLength: (
        max: number,
        message?: string,
    ): ((val: string) => string | null) => {
        return (val: string) => {
            if (val && val.length > max) {
                return message || `Non può superare ${max} caratteri`;
            }
            return null;
        };
    },

    /**
     * Verifica lunghezza esatta
     */
    exactLength: (
        length: number,
        message?: string,
    ): ((val: string) => string | null) => {
        return (val: string) => {
            if (val && val.length !== length) {
                return (
                    message || `Deve contenere esattamente ${length} caratteri`
                );
            }
            return null;
        };
    },

    /**
     * Verifica formato email
     */
    email: (
        message: string = 'Inserire un indirizzo email valido',
    ): ((val: string) => string | null) => {
        return (val: string) => {
            if (val && val.trim() !== '') {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(val)) {
                    return message;
                }
            }
            return null;
        };
    },

    /**
     * Verifica che contenga solo numeri
     */
    numeric: (
        message: string = 'Deve contenere solo numeri',
    ): ((val: string) => string | null) => {
        return (val: string) => {
            if (val && !/^\d+$/.test(val)) {
                return message;
            }
            return null;
        };
    },

    /**
     * Verifica formato CAP italiano (5 cifre)
     */
    postalCode: (
        message: string = 'Il CAP deve contenere esattamente 5 cifre',
    ): ((val: string) => string | null) => {
        return (val: string) => {
            if (val && val.trim() !== '') {
                if (!/^\d{5}$/.test(val)) {
                    return message;
                }
            }
            return null;
        };
    },

    /**
     * Verifica formato Partita IVA italiana (11 cifre)
     */
    vatNumber: (
        message: string = 'La Partita IVA deve contenere esattamente 11 cifre',
    ): ((val: string) => string | null) => {
        return (val: string) => {
            if (val && val.trim() !== '') {
                if (!/^\d{11}$/.test(val)) {
                    return message;
                }
            }
            return null;
        };
    },

    /**
     * Verifica formato provincia italiana (2 lettere maiuscole)
     */
    province: (
        message: string = 'La provincia deve essere di 2 lettere maiuscole',
    ): ((val: string) => string | null) => {
        return (val: string) => {
            if (val && val.trim() !== '') {
                if (!/^[A-Z]{2}$/.test(val)) {
                    return message;
                }
            }
            return null;
        };
    },

    /**
     * Verifica pattern personalizzato
     */
    pattern: (
        regex: RegExp,
        message: string,
    ): ((val: string) => string | null) => {
        return (val: string) => {
            if (val && val.trim() !== '') {
                if (!regex.test(val)) {
                    return message;
                }
            }
            return null;
        };
    },
};
