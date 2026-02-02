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
    title = 'Conferma chiusura',
    description = 'Sei sicuro di voler chiudere? I dati non salvati andranno persi.',
    confirmLabel = 'Chiudi',
    cancelLabel = 'Annulla',
}: ConfirmCloseDialogProps) {
    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{title}</AlertDialogTitle>
                    <AlertDialogDescription>
                        {description}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>{cancelLabel}</AlertDialogCancel>
                    <AlertDialogAction onClick={onConfirm}>
                        {confirmLabel}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
