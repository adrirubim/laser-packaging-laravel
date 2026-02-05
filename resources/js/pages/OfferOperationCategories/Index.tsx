import { ActionsDropdown } from '@/components/ActionsDropdown';
import ConfirmDeleteDialog from '@/components/confirm-delete-dialog';
import {
    FlashNotifications,
    useFlashNotifications,
} from '@/components/flash-notifications';
import { IndexHeader } from '@/components/IndexHeader';
import { Pagination } from '@/components/Pagination';
import { SearchInput } from '@/components/SearchInput';
import AppLayout from '@/layouts/app-layout';
import offerOperationCategories from '@/routes/offer-operation-categories/index';
import { type BreadcrumbItem } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';

type OfferOperationCategory = {
    id: number;
    uuid: string;
    code: string;
    name: string;
};

type OfferOperationCategoriesIndexProps = {
    categories: {
        data: OfferOperationCategory[];
        current_page: number;
        last_page: number;
        links: { url: string | null; label: string; active: boolean }[];
    };
    filters: {
        search?: string;
    };
    flash?: {
        success?: string;
        error?: string;
    };
};

export default function OfferOperationCategoriesIndex() {
    const { props } = usePage<OfferOperationCategoriesIndexProps>();
    const { categories: categoriesPaginated, filters } = props;
    const { flash } = useFlashNotifications();

    const [searchValue, setSearchValue] = useState(filters.search ?? '');
    const [isSearching, setIsSearching] = useState(false);
    const [deleteDialog, setDeleteDialog] = useState<{
        open: boolean;
        category: OfferOperationCategory | null;
    }>({
        open: false,
        category: null,
    });
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        queueMicrotask(() => setSearchValue(filters.search ?? ''));
    }, [filters.search]);

    const handleSearchChange = (value: string) => {
        setIsSearching(true);
        router.get(
            offerOperationCategories.index().url,
            { search: value || undefined },
            {
                preserveState: true,
                preserveScroll: true,
                onFinish: () => setIsSearching(false),
            },
        );
    };

    const clearSearch = () => {
        setSearchValue('');
        router.get(
            offerOperationCategories.index().url,
            {},
            { preserveState: true, preserveScroll: true },
        );
    };

    const handleDeleteClick = (category: OfferOperationCategory) => {
        setDeleteDialog({ open: true, category });
    };

    const handleDeleteConfirm = () => {
        if (!deleteDialog.category) return;

        setIsDeleting(true);
        router.delete(
            offerOperationCategories.destroy({
                offerOperationCategory: deleteDialog.category.uuid,
            }).url,
            {
                preserveScroll: true,
                onSuccess: () => {
                    setDeleteDialog({ open: false, category: null });
                    setIsDeleting(false);
                },
                onError: () => {
                    setIsDeleting(false);
                },
            },
        );
    };

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Offerte', href: '/offers' },
        {
            title: 'Categorie Operazioni',
            href: offerOperationCategories.index().url,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Categorie Operazioni" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <IndexHeader
                    title="Categorie Operazioni"
                    subtitle="Elenco delle categorie operazioni attive con Cerca."
                    createHref={offerOperationCategories.create().url}
                    createLabel="Nuova Categoria"
                />

                <FlashNotifications flash={flash} />

                <div className="flex flex-col gap-3 rounded-xl border border-sidebar-border/70 bg-card p-4 dark:border-sidebar-border">
                    <div className="space-y-1">
                        <label className="text-xs font-medium text-muted-foreground">
                            Cerca
                        </label>
                        <SearchInput
                            value={searchValue}
                            onChange={handleSearchChange}
                            placeholder="Codice o nome..."
                            isLoading={isSearching}
                            onClear={clearSearch}
                        />
                    </div>
                </div>

                <div className="relative min-h-[300px] flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 bg-card dark:border-sidebar-border">
                    <div className="relative h-full w-full overflow-auto">
                        <table className="min-w-full border-separate border-spacing-0 text-left text-sm">
                            <thead className="sticky top-0 z-10 bg-muted/80 backdrop-blur">
                                <tr className="text-xs tracking-wide text-muted-foreground uppercase">
                                    <th className="border-b px-3 py-2 font-medium">
                                        ID
                                    </th>
                                    <th className="border-b px-3 py-2 font-medium">
                                        UUID
                                    </th>
                                    <th className="border-b px-3 py-2 font-medium">
                                        Codice categoria
                                    </th>
                                    <th className="border-b px-3 py-2 font-medium">
                                        Nome categoria
                                    </th>
                                    <th className="border-b px-3 py-2 text-right font-medium">
                                        Azioni
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {categoriesPaginated.data.length === 0 && (
                                    <tr>
                                        <td
                                            colSpan={5}
                                            className="px-3 py-6 text-center text-sm text-muted-foreground"
                                        >
                                            Nessuna categoria trovata per i
                                            filtri attuali.
                                        </td>
                                    </tr>
                                )}
                                {categoriesPaginated.data.map((category) => (
                                    <tr
                                        key={category.uuid}
                                        className="border-b last:border-b-0 hover:bg-muted/40"
                                    >
                                        <td className="px-3 py-2 align-middle text-xs">
                                            {category.id}
                                        </td>
                                        <td className="px-3 py-2 align-middle font-mono text-xs">
                                            {category.uuid}
                                        </td>
                                        <td className="px-3 py-2 align-middle font-mono text-xs">
                                            {category.code}
                                        </td>
                                        <td className="px-3 py-2 align-middle font-medium">
                                            {category.name}
                                        </td>
                                        <td className="px-3 py-2 text-right align-middle text-xs">
                                            <ActionsDropdown
                                                viewHref={
                                                    offerOperationCategories.show(
                                                        {
                                                            offerOperationCategory:
                                                                category.uuid,
                                                        },
                                                    ).url
                                                }
                                                editHref={
                                                    offerOperationCategories.edit(
                                                        {
                                                            offerOperationCategory:
                                                                category.uuid,
                                                        },
                                                    ).url
                                                }
                                                onDelete={() =>
                                                    handleDeleteClick(category)
                                                }
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <Pagination
                    links={categoriesPaginated.links}
                    currentPage={categoriesPaginated.current_page}
                    lastPage={categoriesPaginated.last_page}
                />

                <ConfirmDeleteDialog
                    open={deleteDialog.open}
                    onOpenChange={(open) =>
                        setDeleteDialog({
                            open,
                            category: deleteDialog.category,
                        })
                    }
                    onConfirm={handleDeleteConfirm}
                    title="Elimina Categoria Operazione"
                    description="Sei sicuro di voler eliminare questa categoria operazione? Questa azione non può essere annullata."
                    itemName={deleteDialog.category?.name}
                    isLoading={isDeleting}
                />
            </div>
        </AppLayout>
    );
}
