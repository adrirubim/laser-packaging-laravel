/**
 * Indicador de fortaleza de contraseña (solo informativo, no bloquea envío).
 * Debole / Media / Forte según longitud y variedad de caracteres.
 */
import { useMemo } from 'react';

type Strength = 'debole' | 'media' | 'forte' | null;

function getStrength(password: string): Strength {
    if (!password.length) return null;
    const hasLetter = /[a-zA-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecial = /[^a-zA-Z0-9]/.test(password);
    const types = [hasLetter, hasNumber, hasSpecial].filter(Boolean).length;
    if (password.length < 6) return 'debole';
    if (password.length >= 12 && types >= 2) return 'forte';
    if (password.length >= 8 || types >= 2) return 'media';
    return 'debole';
}

const labels: Record<NonNullable<Strength>, string> = {
    debole: 'Debole',
    media: 'Media',
    forte: 'Forte',
};

const barWidth: Record<NonNullable<Strength>, string> = {
    debole: 'w-1/3',
    media: 'w-2/3',
    forte: 'w-full',
};

const barColor: Record<NonNullable<Strength>, string> = {
    debole: 'bg-destructive',
    media: 'bg-amber-500',
    forte: 'bg-green-600',
};

export function PasswordStrengthIndicator({ password }: { password: string }) {
    const strength = useMemo(() => getStrength(password), [password]);

    if (strength === null) return null;

    return (
        <div className="mt-1.5 flex items-center gap-2">
            <div
                className="h-1 flex-1 overflow-hidden rounded-full bg-muted"
                role="presentation"
                aria-hidden
            >
                <div
                    className={`h-full transition-all duration-200 ${barWidth[strength]} ${barColor[strength]}`}
                />
            </div>
            <span
                className={`text-xs font-medium ${
                    strength === 'debole'
                        ? 'text-destructive'
                        : strength === 'media'
                          ? 'text-amber-600 dark:text-amber-400'
                          : 'text-green-600 dark:text-green-400'
                }`}
            >
                {labels[strength]}
            </span>
        </div>
    );
}
