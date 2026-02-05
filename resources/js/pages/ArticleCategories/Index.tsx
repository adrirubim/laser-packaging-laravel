import { ActionsDropdown } from '@/components/ActionsDropdown';
import ConfirmDeleteDialog from '@/components/confirm-delete-dialog';
import {
    FlashNotifications,
    useFlashNotifications,
} from '@/components/flash-notifications';
import { IndexHeader } from '@/components/IndexHeader';
import { Pagination } from '@/components/Pagination';
import { SearchInput } from '@/components/SearchInput';
import { SortableTableHeader } from '@/components/SortableTableHeader';
import AppLayout from '@/layouts/app-layout';
import articleCategories from '@/routes/article-categories/index';
import { type BreadcrumbItem } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { Tag } from 'lucide-react';
import { useState } from 'react';

type ArticleCategory = {
    id: number;
    uuid: string;
    name: string;
};

type ArticleCategoriesIndexProps = {
    categories: {
        data: ArticleCategory[];
        current_page: number;
        last_page: number;
        links: { url: string | null; label: string; active: boolean }[];
    };
    filters: {
        search?: string;
        sort_by?: string;
        sort_order?: 'asc' | 'desc';
    };
    flash?: {
        success?: string;
        error?: string;
    };
};

export default function ArticleCategoriesIndex() {
    const { props } = usePage<ArticleCategoriesIndexProps>();
    const { categories: categoriesPaginated, filters } = props;
    const { flash } = useFlashNotifications();

    const [deleteDialog, setDeleteDialog] = useState<{
        open: boolean;
        category: ArticleCategory | null;
    }>({
        open: false,
        category: null,
    });
    const [isDeleting, setIsDeleting] = useState(false);

    const handleSort = (column: string) => {
        const currentSort = filters.sort_by;
        const currentDirection = filters.sort_order || 'asc';

        let newDirection: 'asc' | 'desc' = 'asc';
        if (currentSort === column && currentDirection === 'asc') {
            newDirection = 'desc';
        }

        router.get(
            articleCategories.index().url,
            {
                ...filters,
                sort_by: column,
                sort_order: newDirection,
            },
            {
                preserveState: true,
                preserveScroll: true,
            },
        );
    };

    const handleSearchChange = (value: string) => {
        router.get(
            articleCategories.index().url,
            {
                ...filters,
                search: value || undefined,
            },
            {
                preserveState: true,
                preserveScroll: true,
            },
        );
    };

    const clearSearch = () => {
        router.get(
            articleCategories.index().url,
            { ...filters, search: undefined },
            { preserveState: true, preserveScroll: true },
        );
    };

    const handleDeleteClick = (category: ArticleCategory) => {
        setDeleteDialog({ open: true, category });
    };

    const handleDeleteConfirm = () => {
        if (!deleteDialog.category) return;

        setIsDeleting(true);
        router.delete(
            articleCategories.destroy({
                articleCategory: deleteDialog.category.uuid,
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
        {
            title: 'Categorie Articoli',
            href: articleCategories.index().url,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Categorie Articoli" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <IndexHeader
                    title="Categorie Articoli"
                    subtitle="Elenco delle categorie di articoli attive con Cerca e filtri."
                    createHref={articleCategories.create().url}
                    createLabel="Nuova Categoria"
                />

                <FlashNotifications flash={flash} />

                <div className="flex flex-col gap-3 rounded-xl border border-sidebar-border/70 bg-card p-4 dark:border-sidebar-border">
                    <div className="space-y-1">
                        <label className="text-xs font-medium text-muted-foreground">
                            Cerca
                        </label>
                        <SearchInput
                            value={filters.search ?? ''}
                            onChange={handleSearchChange}
                            placeholder="Nome categoria..."
                            debounceMs={500}
                            onClear={clearSearch}
                        />
                    </div>
                </div>

                <div className="relative min-h-[300px] flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 bg-card dark:border-sidebar-border">
                    <div className="relative h-full w-full overflow-auto">
                        <div className="block space-y-3 p-4 md:hidden">
                            {categoriesPaginated.data.length === 0 ? (
                                <div className="py-8 text-center text-sm text-muted-foreground">
                                    Nessuna categoria trovata per i filtri
                                    attuali.
                                </div>
                            ) : (
                                categoriesPaginated.data.map((category) => (
                                    <div
                                        key={category.uuid}
                                        className="space-y-2 rounded-lg border p-4 transition-colors hover:bg-muted/40"
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="flex flex-1 items-center gap-2">
                                                <Tag className="h-4 w-4 text-muted-foreground" />
                                                <h3 className="font-medium">
                                                    {category.name}
                                                </h3>
                                            </div>
                                            <ActionsDropdown
                                                viewHref={
                                                    articleCategories.show({
                                                        articleCategory:
                                                            category.uuid,
                                                    }).url
                                                }
                                                editHref={
                                                    articleCategories.edit({
                                                        articleCategory:
                                                            category.uuid,
                                                    }).url
                                                }
                                                onDelete={() =>
                                                    handleDeleteClick(category)
                                                }
                                            />
                                        </div>
                                        <div className="font-mono text-xs text-muted-foreground">
                                            UUID: {category.uuid}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                        <table className="hidden min-w-full border-separate border-spacing-0 text-left text-sm md:table">
                            <thead className="sticky top-0 z-10 bg-muted/80 backdrop-blur">
                                <tr className="text-xs tracking-wide text-muted-foreground uppercase">
                                    <th className="border-b px-3 py-2 font-medium">
                                        ID
                                    </th>
                                    <th className="border-b px-3 py-2 font-medium">
                                        UUID
                                    </th>
                                    <SortableTableHeader
                                        column="name"
                                        currentSort={filters.sort_by}
                                        currentDirection={filters.sort_order}
                                        onSort={handleSort}
                                    >
                                        Nome
                                    </SortableTableHeader>
                                    <th className="border-b px-3 py-2 text-right font-medium">
                                        Azioni
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-sidebar-border">
                                {categoriesPaginated.data.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={4}
                                            className="px-3 py-8 text-center text-sm text-muted-foreground"
                                        >
                                            Nessuna categoria trovata per i
                                            filtri attuali.
                                        </td>
                                    </tr>
                                ) : (
                                    categoriesPaginated.data.map((category) => (
                                        <tr
                                            key={category.uuid}
                                            className="border-b transition-colors last:border-b-0 hover:bg-muted/40"
                                        >
                                            <td className="px-3 py-2 align-middle text-xs">
                                                {category.id}
                                            </td>
                                            <td className="px-3 py-2 align-middle font-mono text-xs">
                                                {category.uuid}
                                            </td>
                                            <td className="px-3 py-2 align-middle">
                                                <div className="flex items-center gap-2">
                                                    <Tag className="h-4 w-4 text-muted-foreground" />
                                                    <span className="font-medium">
                                                        {category.name}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-3 py-2 text-right align-middle">
                                                <ActionsDropdown
                                                    viewHref={
                                                        articleCategories.show({
                                                            articleCategory:
                                                                category.uuid,
                                                        }).url
                                                    }
                                                    editHref={
                                                        articleCategories.edit({
                                                            articleCategory:
                                                                category.uuid,
                                                        }).url
                                                    }
                                                    onDelete={() =>
                                                        handleDeleteClick(
                                                            category,
                                                        )
                                                    }
                                                />
                                            </td>
                                        </tr>
                                    ))
                                )}
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
                    title="Elimina Categoria"
                    description="Sei sicuro di voler eliminare questa categoria di articolo? Questa azione non può essere annullata."
                    itemName={deleteDialog.category?.name}
                    isLoading={isDeleting}
                />
            </div>
        </AppLayout>
    );
}
