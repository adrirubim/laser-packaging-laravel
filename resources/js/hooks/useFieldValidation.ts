import { useEffect, useState } from 'react';

type ValidationRule = (val: string) => string | null;

export function useFieldValidation(
    value: string,
    rules: ValidationRule[],
    options?: {
        validateOnChange?: boolean;
        validateOnBlur?: boolean;
    },
) {
    const [error, setError] = useState<string | null>(null);
    const [touched, setTouched] = useState(false);
    const { validateOnChange = true, validateOnBlur = true } = options || {};

    useEffect(() => {
        const shouldValidate =
            (touched === true && validateOnBlur === true) ||
            (value !== null &&
                value !== undefined &&
                value !== '' &&
                validateOnChange === true);

        if (shouldValidate === true) {
            for (const rule of rules) {
                const errorMessage = rule(value);
                if (
                    errorMessage !== null &&
                    errorMessage !== undefined &&
                    errorMessage !== ''
                ) {
                    queueMicrotask(() => setError(errorMessage));
                    return;
                }
            }
            queueMicrotask(() => setError(null));
        } else if (
            (value === null || value === undefined || value === '') &&
            touched === true
        ) {
            // If field is empty and has been touched, check if it's required
            const requiredRule = rules.find((rule) => {
                const result = rule('');
                return result !== null;
            });
            if (typeof requiredRule === 'function') {
                queueMicrotask(() => setError(requiredRule('')));
            } else {
                queueMicrotask(() => setError(null));
            }
        }
    }, [value, touched, rules, validateOnChange, validateOnBlur]);

    return {
        error,
        touched,
        setTouched,
        onBlur: () => setTouched(true),
        onFocus: () => {
            if (touched !== true) {
                setTouched(true);
            }
        },
    };
}
