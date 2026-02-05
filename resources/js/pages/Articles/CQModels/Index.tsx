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
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import AppLayout from '@/layouts/app-layout';
import articles from '@/routes/articles/index';
import { type BreadcrumbItem } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { Download } from 'lucide-react';
import { useState } from 'react';

type CQModel = {
    id: number;
    uuid: string;
    cod_model: string;
    description_model: string;
    filename?: string | null;
};

type CQModelsIndexProps = {
    models: {
        data: CQModel[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        from: number;
        to: number;
        links: { url: string | null; label: string; active: boolean }[];
    };
    filters: {
        search?: string;
        per_page?: string;
        sort_by?: string;
        sort_order?: 'asc' | 'desc';
    };
    flash?: {
        success?: string;
        error?: string;
    };
};

export default function CQModelsIndex() {
    const { props } = usePage<CQModelsIndexProps>();
    const { models: modelsPaginated, filters } = props;
    const { flash } = useFlashNotifications();

    const [deleteDialog, setDeleteDialog] = useState<{
        open: boolean;
        model: CQModel | null;
    }>({
        open: false,
        model: null,
    });
    const [isDeleting, setIsDeleting] = useState(false);

    const handleSearchChange = (value: string) => {
        router.get(
            articles.cqModels.index().url,
            {
                search: value || undefined,
                per_page: filters.per_page || undefined,
                sort_by: filters.sort_by || undefined,
                sort_order: filters.sort_order || undefined,
            },
            {
                preserveState: true,
                preserveScroll: true,
            },
        );
    };

    const handleSort = (column: string) => {
        const currentSort = filters.sort_by;
        const currentOrder = filters.sort_order || 'asc';
        const newOrder =
            currentSort === column && currentOrder === 'asc' ? 'desc' : 'asc';

        router.get(
            articles.cqModels.index().url,
            {
                ...filters,
                sort_by: column,
                sort_order: newOrder,
            },
            {
                preserveState: true,
                preserveScroll: true,
            },
        );
    };

    const handleDeleteClick = (model: CQModel) => {
        setDeleteDialog({ open: true, model });
    };

    const handleDeleteConfirm = () => {
        if (!deleteDialog.model) return;

        setIsDeleting(true);
        router.delete(
            articles.cqModels.destroy({ cqModel: deleteDialog.model.uuid }).url,
            {
                preserveScroll: true,
                onSuccess: () => {
                    setDeleteDialog({ open: false, model: null });
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
            title: 'Articoli',
            href: articles.index().url,
        },
        {
            title: 'Modelli CQ',
            href: articles.cqModels.index().url,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Modelli CQ" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <IndexHeader
                    title="Modelli CQ"
                    subtitle="Elenco dei modelli CQ attivi."
                    createHref={articles.cqModels.create().url}
                    createLabel="Nuovo Modello"
                />

                <FlashNotifications flash={flash} />

                <div className="flex flex-col gap-3 rounded-xl border border-sidebar-border/70 bg-card p-4 dark:border-sidebar-border">
                    <SearchInput
                        value={filters.search || ''}
                        onChange={handleSearchChange}
                        placeholder="Codice, descrizione o nome allegato..."
                    />
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
                                        uuid
                                    </th>
                                    <SortableTableHeader
                                        column="cod_model"
                                        currentSort={filters.sort_by}
                                        currentDirection={filters.sort_order}
                                        onSort={handleSort}
                                    >
                                        Codice Modello
                                    </SortableTableHeader>
                                    <SortableTableHeader
                                        column="description_model"
                                        currentSort={filters.sort_by}
                                        currentDirection={filters.sort_order}
                                        onSort={handleSort}
                                    >
                                        Descrizione
                                    </SortableTableHeader>
                                    <SortableTableHeader
                                        column="filename"
                                        currentSort={filters.sort_by}
                                        currentDirection={filters.sort_order}
                                        onSort={handleSort}
                                    >
                                        Filename
                                    </SortableTableHeader>
                                    <th className="border-b px-3 py-2 text-right font-medium">
                                        Azioni
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {modelsPaginated.data.length === 0 && (
                                    <tr>
                                        <td
                                            colSpan={6}
                                            className="px-3 py-8 text-center text-sm text-muted-foreground"
                                        >
                                            Nessun modello disponibile.
                                        </td>
                                    </tr>
                                )}
                                {modelsPaginated.data.map((model) => (
                                    <tr
                                        key={model.uuid}
                                        className="border-b border-sidebar-border/70 hover:bg-muted/50 dark:border-sidebar-border"
                                    >
                                        <td className="px-3 py-2 align-middle text-xs">
                                            {model.id}
                                        </td>
                                        <td className="px-3 py-2 align-middle font-mono text-xs">
                                            {model.uuid}
                                        </td>
                                        <td className="px-3 py-2 font-medium">
                                            {model.cod_model}
                                        </td>
                                        <td className="px-3 py-2">
                                            {model.description_model}
                                        </td>
                                        <td className="px-3 py-2">
                                            {model.filename || (
                                                <span className="text-muted-foreground">
                                                    -
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-3 py-2 text-right">
                                            <ActionsDropdown
                                                viewHref={
                                                    articles.cqModels.show({
                                                        cqModel: model.uuid,
                                                    }).url
                                                }
                                                editHref={
                                                    articles.cqModels.edit({
                                                        cqModel: model.uuid,
                                                    }).url
                                                }
                                                onDelete={() =>
                                                    handleDeleteClick(model)
                                                }
                                                extraItems={
                                                    model.filename ? (
                                                        <DropdownMenuItem
                                                            onSelect={(e) => {
                                                                e.preventDefault();
                                                                window.location.href =
                                                                    articles.cqModels.downloadFile(
                                                                        {
                                                                            cqModel:
                                                                                model.uuid,
                                                                        },
                                                                    ).url;
                                                            }}
                                                        >
                                                            <Download className="mr-2 h-4 w-4" />
                                                            Scarica allegato
                                                        </DropdownMenuItem>
                                                    ) : undefined
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
                    links={modelsPaginated.links}
                    currentPage={modelsPaginated.current_page}
                    lastPage={modelsPaginated.last_page}
                    totalItems={modelsPaginated.total}
                />
            </div>

            <ConfirmDeleteDialog
                open={deleteDialog.open}
                onOpenChange={(open) => setDeleteDialog({ open, model: null })}
                onConfirm={handleDeleteConfirm}
                isLoading={isDeleting}
                title="Conferma eliminazione"
                description={`Sei sicuro di voler eliminare il modello ${deleteDialog.model?.cod_model ?? ''}?\n\nQuesta azione non può essere annullata. Il modello verrà eliminato definitivamente.`}
            />
        </AppLayout>
    );
}
