import { router } from '@inertiajs/react';
import { useState } from 'react';

type UseDeleteConfirmationOptions<T> = {
    deleteUrl: (item: T) => string;
    onSuccess?: () => void;
    onError?: () => void;
};

export function useDeleteConfirmation<T extends { id: number; name?: string }>(
    options: UseDeleteConfirmationOptions<T>,
) {
    const [deleteDialog, setDeleteDialog] = useState<{
        open: boolean;
        item: T | null;
    }>({
        open: false,
        item: null,
    });
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDeleteClick = (item: T) => {
        setDeleteDialog({ open: true, item });
    };

    const handleDeleteConfirm = () => {
        if (!deleteDialog.item) return;

        setIsDeleting(true);
        router.delete(options.deleteUrl(deleteDialog.item), {
            preserveScroll: true,
            onSuccess: () => {
                setDeleteDialog({ open: false, item: null });
                setIsDeleting(false);
                options.onSuccess?.();
            },
            onError: () => {
                setIsDeleting(false);
                options.onError?.();
            },
        });
    };

    return {
        deleteDialog,
        setDeleteDialog,
        isDeleting,
        handleDeleteClick,
        handleDeleteConfirm,
    };
}
