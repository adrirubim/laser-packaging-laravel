import { useTranslations } from '@/hooks/use-translations';
import { X } from 'lucide-react';
import { useEffect, useState } from 'react';

type FormValidationNotificationProps = {
    errors: Record<string, string>;
    message?: string;
    autoHideDuration?: number;
    onDismiss?: () => void;
    showOnSubmit?: boolean; // If true, show only after submit attempted
    hasAttemptedSubmit?: boolean; // External state indicating if submit was attempted
};

/**
 * Component to show notification when there are validation errors in a form
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
    message,
    autoHideDuration = 8000,
    onDismiss,
    showOnSubmit = true,
    hasAttemptedSubmit: externalHasAttemptedSubmit,
}: FormValidationNotificationProps) {
    const { t } = useTranslations();
    const [show, setShow] = useState(false);
    const displayMessage = message ?? t('common.validation_fix_errors');
    const [internalHasAttemptedSubmit, setInternalHasAttemptedSubmit] =
        useState(false);
    const hasErrors = Object.keys(errors).length > 0;

    // Use external state if provided, otherwise internal
    const hasAttemptedSubmit =
        externalHasAttemptedSubmit !== undefined
            ? externalHasAttemptedSubmit
            : internalHasAttemptedSubmit;

    useEffect(() => {
        // If showOnSubmit is false, always show when there are errors
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

        // If showOnSubmit is true, show only if there are errors AND submit was attempted
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
            // If no errors, hide
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

    // Detect when there are errors (means submit was attempted)
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
            <span>{displayMessage}</span>
            <button
                onClick={() => {
                    setShow(false);
                    if (onDismiss) onDismiss();
                }}
                className="ml-2 transition-opacity hover:opacity-70"
                aria-label={t('common.close_notification')}
            >
                <X className="h-4 w-4" />
            </button>
        </div>
    );
}
