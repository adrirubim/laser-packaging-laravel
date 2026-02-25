import type { SharedData } from '@/types';
import { usePage } from '@inertiajs/react';

export type TranslationParams = Record<string, string | number>;

const missingKeys = new Set<string>();

/**
 * Returns a translation function for the current locale.
 * Uses shared `translations` from HandleInertiaRequests (lang/{locale}.json).
 * Falls back to the key if the translation is missing.
 * Supports placeholders (e.g. :count) when passing params as second argument.
 */
export function useTranslations(): {
    t: (key: string, params?: TranslationParams) => string;
} {
    const { translations } = usePage<SharedData>().props;
    const dict = (
        typeof translations === 'object' && translations !== null
            ? translations
            : {}
    ) as Record<string, string>;

    return {
        t: (key: string, params?: TranslationParams) => {
            const exists = typeof dict[key] === 'string';

            if (!exists && import.meta.env.DEV && !missingKeys.has(key)) {
                console.warn(
                    `[i18n] Missing translation key: "${key}" (current locale)`,
                );
                missingKeys.add(key);
            }

            let value = exists ? dict[key] : key;

            if (params && typeof value === 'string') {
                for (const [k, v] of Object.entries(params)) {
                    value = value.replace(new RegExp(`:${k}`, 'g'), String(v));
                }
            }

            return value;
        },
    };
}
