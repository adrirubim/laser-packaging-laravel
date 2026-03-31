import { useTranslations } from '#app/hooks/use-translations';
import { usePage } from '@inertiajs/react';
import { X } from 'lucide-react';
import { useEffect, useState } from 'react';

type FlashMessages = {
    success?: string;
    error?: string;
    warning?: string;
    info?: string;
};

type FlashNotificationsProps = {
    flash?: FlashMessages;
    onDismiss?: () => void;
    autoHideDuration?: number;
};

export function FlashNotifications({
    flash,
    onDismiss,
    autoHideDuration = 5000,
}: FlashNotificationsProps) {
    const { t } = useTranslations();
    const [showSuccess, setShowSuccess] = useState(false);
    const [showError, setShowError] = useState(false);
    const [showWarning, setShowWarning] = useState(false);
    const [showInfo, setShowInfo] = useState(false);
    const [messages, setMessages] = useState<FlashMessages>({});

    useEffect(() => {
        const successMessage = flash?.success;
        const errorMessage = flash?.error;
        const warningMessage = flash?.warning;
        const infoMessage = flash?.info;

        if (
            successMessage !== null &&
            successMessage !== undefined &&
            successMessage !== ''
        ) {
            queueMicrotask(() => {
                setMessages((prev) => ({
                    ...prev,
                    success: successMessage,
                }));
                setShowSuccess(true);
            });
            const timer = setTimeout(() => {
                setShowSuccess(false);
                if (typeof onDismiss === 'function') {
                    onDismiss();
                }
            }, autoHideDuration);
            return () => clearTimeout(timer);
        }
        if (
            errorMessage !== null &&
            errorMessage !== undefined &&
            errorMessage !== ''
        ) {
            queueMicrotask(() => {
                setMessages((prev) => ({ ...prev, error: errorMessage }));
                setShowError(true);
            });
            const timer = setTimeout(() => {
                setShowError(false);
                if (typeof onDismiss === 'function') {
                    onDismiss();
                }
            }, autoHideDuration);
            return () => clearTimeout(timer);
        }
        if (
            warningMessage !== null &&
            warningMessage !== undefined &&
            warningMessage !== ''
        ) {
            queueMicrotask(() => {
                setMessages((prev) => ({
                    ...prev,
                    warning: warningMessage,
                }));
                setShowWarning(true);
            });
            const timer = setTimeout(() => {
                setShowWarning(false);
                if (typeof onDismiss === 'function') {
                    onDismiss();
                }
            }, autoHideDuration);
            return () => clearTimeout(timer);
        }
        if (
            infoMessage !== null &&
            infoMessage !== undefined &&
            infoMessage !== ''
        ) {
            queueMicrotask(() => {
                setMessages((prev) => ({ ...prev, info: infoMessage }));
                setShowInfo(true);
            });
            const timer = setTimeout(() => {
                setShowInfo(false);
                if (typeof onDismiss === 'function') {
                    onDismiss();
                }
            }, autoHideDuration);
            return () => clearTimeout(timer);
        }
    }, [flash, autoHideDuration, onDismiss]);

    return (
        <div className="space-y-2">
            {showSuccess === true &&
                messages.success !== null &&
                messages.success !== undefined &&
                messages.success !== '' && (
                    <div className="flex animate-in items-center justify-between rounded-md border border-emerald-500/40 bg-emerald-500/5 px-3 py-2 text-sm text-emerald-700 duration-300 fade-in slide-in-from-top-2 dark:text-emerald-300">
                        <span>{messages.success}</span>
                        <button
                            onClick={() => {
                                setShowSuccess(false);
                                if (typeof onDismiss === 'function') {
                                    onDismiss();
                                }
                            }}
                            className="ml-2 transition-opacity hover:opacity-70"
                            aria-label={t('common.close_notification')}
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                )}
            {showError === true &&
                messages.error !== null &&
                messages.error !== undefined &&
                messages.error !== '' && (
                    <div className="flex animate-in items-center justify-between rounded-md border border-rose-500/40 bg-rose-500/5 px-3 py-2 text-sm text-rose-700 duration-300 fade-in slide-in-from-top-2 dark:text-rose-300">
                        <span>{messages.error}</span>
                        <button
                            onClick={() => {
                                setShowError(false);
                                if (typeof onDismiss === 'function') {
                                    onDismiss();
                                }
                            }}
                            className="ml-2 transition-opacity hover:opacity-70"
                            aria-label={t('common.close_notification')}
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                )}
            {showWarning === true &&
                messages.warning !== null &&
                messages.warning !== undefined &&
                messages.warning !== '' && (
                    <div className="flex animate-in items-center justify-between rounded-md border border-amber-500/40 bg-amber-500/5 px-3 py-2 text-sm text-amber-700 duration-300 fade-in slide-in-from-top-2 dark:text-amber-300">
                        <span>{messages.warning}</span>
                        <button
                            onClick={() => {
                                setShowWarning(false);
                                if (typeof onDismiss === 'function') {
                                    onDismiss();
                                }
                            }}
                            className="ml-2 transition-opacity hover:opacity-70"
                            aria-label={t('common.close_notification')}
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                )}
            {showInfo === true &&
                messages.info !== null &&
                messages.info !== undefined &&
                messages.info !== '' && (
                    <div className="flex animate-in items-center justify-between rounded-md border border-blue-500/40 bg-blue-500/5 px-3 py-2 text-sm text-blue-700 duration-300 fade-in slide-in-from-top-2 dark:text-blue-300">
                        <span>{messages.info}</span>
                        <button
                            onClick={() => {
                                setShowInfo(false);
                                if (typeof onDismiss === 'function') {
                                    onDismiss();
                                }
                            }}
                            className="ml-2 transition-opacity hover:opacity-70"
                            aria-label={t('common.close_notification')}
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                )}
        </div>
    );
}

/**
 * Hook per usare notifiche flash in qualsiasi componente
 *
 * @example
 * ```tsx
 * const { flash } = useFlashNotifications();
 * return <FlashNotifications flash={flash} />;
 * ```
 */
export function useFlashNotifications() {
    const { props } = usePage();
    const flash = (props as { flash?: FlashMessages }).flash;

    return { flash };
}
