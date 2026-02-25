import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useTranslations } from '@/hooks/use-translations';

type ConfirmCloseDialogProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: () => void;
    title?: string;
    description?: string;
    confirmLabel?: string;
    cancelLabel?: string;
};

/**
 * Componente riutilizzabile per confermare la chiusura di un modulo
 *
 * @example
 * ```tsx
 * const [showCloseConfirm, setShowCloseConfirm] = useState(false);
 *
 * <ConfirmCloseDialog
 *     open={showCloseConfirm}
 *     onOpenChange={setShowCloseConfirm}
 *     onConfirm={() => {
 *         setShowCloseConfirm(false);
 *         router.visit('/route');
 *     }}
 * />
 * ```
 */
export function ConfirmCloseDialog({
    open,
    onOpenChange,
    onConfirm,
    title,
    description,
    confirmLabel,
    cancelLabel,
}: ConfirmCloseDialogProps) {
    const { t } = useTranslations();
    const resolvedTitle = title ?? t('common.confirm_close.title');
    const resolvedDescription =
        description ?? t('common.confirm_close.description');
    const resolvedConfirmLabel = confirmLabel ?? t('common.close');
    const resolvedCancelLabel = cancelLabel ?? t('common.cancel');
    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{resolvedTitle}</AlertDialogTitle>
                    <AlertDialogDescription>
                        {resolvedDescription}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>{resolvedCancelLabel}</AlertDialogCancel>
                    <AlertDialogAction onClick={onConfirm}>
                        {resolvedConfirmLabel}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
