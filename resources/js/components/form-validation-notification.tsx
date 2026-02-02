import { X } from 'lucide-react';
import { useEffect, useState } from 'react';

type FormValidationNotificationProps = {
    errors: Record<string, string>;
    message?: string;
    autoHideDuration?: number;
    onDismiss?: () => void;
    showOnSubmit?: boolean; // Se true, mostra solo dopo aver tentato l'invio
    hasAttemptedSubmit?: boolean; // Stato esterno che indica se è stato tentato l'invio
};

/**
 * Componente per mostrare una notifica quando ci sono errori di validazione in un modulo
 *
 * @example
 * ```tsx
 * <FormValidationNotification
 *     errors={allErrors}
 *     message="Si prega di correggere gli errori nel modulo prima di salvare."
 * />
 * ```
 */
export function FormValidationNotification({
    errors,
    message = 'Si prega di correggere gli errori nel modulo prima di salvare.',
    autoHideDuration = 8000,
    onDismiss,
    showOnSubmit = true,
    hasAttemptedSubmit: externalHasAttemptedSubmit,
}: FormValidationNotificationProps) {
    const [show, setShow] = useState(false);
    const [internalHasAttemptedSubmit, setInternalHasAttemptedSubmit] =
        useState(false);
    const hasErrors = Object.keys(errors).length > 0;

    // Usare lo stato esterno se fornito, altrimenti quello interno
    const hasAttemptedSubmit =
        externalHasAttemptedSubmit !== undefined
            ? externalHasAttemptedSubmit
            : internalHasAttemptedSubmit;

    useEffect(() => {
        // Se showOnSubmit è false, mostrare sempre quando ci sono errori
        if (!showOnSubmit && hasErrors) {
            queueMicrotask(() => setShow(true));
            if (autoHideDuration > 0) {
                const timer = setTimeout(() => {
                    setShow(false);
                    if (onDismiss) onDismiss();
                }, autoHideDuration);
                return () => clearTimeout(timer);
            }
            return;
        }

        // Se showOnSubmit è true, mostrare solo se ci sono errori E si è tentato l'invio
        if (showOnSubmit && hasErrors && hasAttemptedSubmit) {
            queueMicrotask(() => setShow(true));
            if (autoHideDuration > 0) {
                const timer = setTimeout(() => {
                    setShow(false);
                    if (onDismiss) onDismiss();
                }, autoHideDuration);
                return () => clearTimeout(timer);
            }
        } else if (!hasErrors) {
            // Se non ci sono errori, nascondere
            queueMicrotask(() => setShow(false));
            if (externalHasAttemptedSubmit === undefined) {
                queueMicrotask(() => setInternalHasAttemptedSubmit(false));
            }
        }
    }, [
        hasErrors,
        hasAttemptedSubmit,
        showOnSubmit,
        autoHideDuration,
        onDismiss,
        externalHasAttemptedSubmit,
    ]);

    // Rilevare quando ci sono errori (significa che si è tentato l'invio)
    useEffect(() => {
        if (hasErrors && externalHasAttemptedSubmit === undefined) {
            queueMicrotask(() => setInternalHasAttemptedSubmit(true));
        }
    }, [hasErrors, externalHasAttemptedSubmit]);

    if (!show || !hasErrors) {
        return null;
    }

    if (showOnSubmit && !hasAttemptedSubmit) {
        return null;
    }

    return (
        <div className="flex animate-in items-center justify-between rounded-md border border-rose-500/40 bg-rose-500/5 px-3 py-2 text-sm text-rose-700 duration-300 fade-in slide-in-from-top-2 dark:text-rose-300">
            <span>{message}</span>
            <button
                onClick={() => {
                    setShow(false);
                    if (onDismiss) onDismiss();
                }}
                className="ml-2 transition-opacity hover:opacity-70"
                aria-label="Chiudi notifica"
            >
                <X className="h-4 w-4" />
            </button>
        </div>
    );
}
