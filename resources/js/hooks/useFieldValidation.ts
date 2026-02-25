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
            (touched && validateOnBlur) || (value && validateOnChange);

        if (shouldValidate) {
            for (const rule of rules) {
                const errorMessage = rule(value);
                if (errorMessage) {
                    queueMicrotask(() => setError(errorMessage));
                    return;
                }
            }
            queueMicrotask(() => setError(null));
        } else if (!value && touched) {
            // If field is empty and has been touched, check if it's required
            const requiredRule = rules.find((rule) => {
                const result = rule('');
                return result !== null;
            });
            if (requiredRule) {
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
            if (!touched) {
                setTouched(true);
            }
        },
    };
}
