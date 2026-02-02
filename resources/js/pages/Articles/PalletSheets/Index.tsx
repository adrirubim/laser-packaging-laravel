import ConfirmDeleteDialog from '@/components/confirm-delete-dialog';
import { Pagination } from '@/components/Pagination';
import { SearchInput } from '@/components/SearchInput';
import { SortableTableHeader } from '@/components/SortableTableHeader';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import AppLayout from '@/layouts/app-layout';
import articles from '@/routes/articles';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    Download,
    Edit,
    Eye,
    MoreHorizontal,
    Plus,
    Trash2,
    X,
} from 'lucide-react';
import { useEffect, useState } from 'react';

type PalletSheet = {
    id: number;
    uuid: string;
    code: string;
    description: string;
    filename?: string | null;
};

type PalletSheetsIndexProps = {
    sheets: {
        data: PalletSheet[];
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

export default function PalletSheetsIndex() {
    const { props } = usePage<PalletSheetsIndexProps>();
    const { sheets: sheetsPaginated, filters, flash } = props;

    const [showFlash, setShowFlash] = useState(true);
    const [deleteDialog, setDeleteDialog] = useState<{
        open: boolean;
        sheet: PalletSheet | null;
    }>({
        open: false,
        sheet: null,
    });
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        if (flash?.success || flash?.error) {
            queueMicrotask(() => setShowFlash(true));
            const timer = setTimeout(() => setShowFlash(false), 5000);
            return () => clearTimeout(timer);
        }
    }, [flash]);

    const handleSearchChange = (value: string) => {
        router.get(
            articles.palletSheets.index().url,
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
            articles.palletSheets.index().url,
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

    const handleDeleteClick = (sheet: PalletSheet) => {
        setDeleteDialog({ open: true, sheet });
    };

    const handleDeleteConfirm = () => {
        if (!deleteDialog.sheet) return;

        setIsDeleting(true);
        router.delete(
            articles.palletSheets.destroy({
                palletSheet: deleteDialog.sheet.uuid,
            }).url,
            {
                preserveScroll: true,
                onSuccess: () => {
                    setDeleteDialog({ open: false, sheet: null });
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
            title: 'Fogli Pallet',
            href: articles.palletSheets.index().url,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Fogli Pallet" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between gap-3">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">
                            Fogli Pallet
                        </h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Elenco dei fogli pallet attivi.
                        </p>
                    </div>
                    <Link
                        href={articles.palletSheets.create().url}
                        className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm hover:bg-primary/90"
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        Nuovo Foglio
                    </Link>
                </div>

                {showFlash && flash?.success && (
                    <div className="flex animate-in items-center justify-between rounded-md border border-emerald-500/40 bg-emerald-500/5 px-3 py-2 text-sm text-emerald-700 duration-300 fade-in slide-in-from-top-2 dark:text-emerald-300">
                        <span>{flash.success}</span>
                        <button
                            onClick={() => setShowFlash(false)}
                            className="ml-2 transition-opacity hover:opacity-70"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                )}
                {showFlash && flash?.error && (
                    <div className="flex animate-in items-center justify-between rounded-md border border-rose-500/40 bg-rose-500/5 px-3 py-2 text-sm text-rose-700 duration-300 fade-in slide-in-from-top-2 dark:text-rose-300">
                        <span>{flash.error}</span>
                        <button
                            onClick={() => setShowFlash(false)}
                            className="ml-2 transition-opacity hover:opacity-70"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                )}

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
                                        column="code"
                                        currentSort={filters.sort_by}
                                        currentDirection={filters.sort_order}
                                        onSort={handleSort}
                                    >
                                        Codice
                                    </SortableTableHeader>
                                    <SortableTableHeader
                                        column="description"
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
                                {sheetsPaginated.data.length === 0 && (
                                    <tr>
                                        <td
                                            colSpan={6}
                                            className="px-3 py-8 text-center text-sm text-muted-foreground"
                                        >
                                            Nessun foglio pallet disponibile.
                                        </td>
                                    </tr>
                                )}
                                {sheetsPaginated.data.map((sheet) => (
                                    <tr
                                        key={sheet.uuid}
                                        className="border-b border-sidebar-border/70 hover:bg-muted/50 dark:border-sidebar-border"
                                    >
                                        <td className="px-3 py-2 align-middle text-xs">
                                            {sheet.id}
                                        </td>
                                        <td className="px-3 py-2 align-middle font-mono text-xs">
                                            {sheet.uuid}
                                        </td>
                                        <td className="px-3 py-2 font-medium">
                                            {sheet.code}
                                        </td>
                                        <td className="px-3 py-2">
                                            {sheet.description}
                                        </td>
                                        <td className="px-3 py-2">
                                            {sheet.filename || (
                                                <span className="text-muted-foreground">
                                                    -
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-3 py-2 text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8"
                                                        aria-label="Apri menu azioni"
                                                    >
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem
                                                        onSelect={(e) => {
                                                            e.preventDefault();
                                                            router.visit(
                                                                articles.palletSheets.show(
                                                                    {
                                                                        palletSheet:
                                                                            sheet.uuid,
                                                                    },
                                                                ).url,
                                                            );
                                                        }}
                                                    >
                                                        <Eye className="mr-2 h-4 w-4" />
                                                        Visualizza
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        onSelect={(e) => {
                                                            e.preventDefault();
                                                            router.visit(
                                                                articles.palletSheets.edit(
                                                                    {
                                                                        palletSheet:
                                                                            sheet.uuid,
                                                                    },
                                                                ).url,
                                                            );
                                                        }}
                                                    >
                                                        <Edit className="mr-2 h-4 w-4" />
                                                        Modifica
                                                    </DropdownMenuItem>
                                                    {sheet.filename && (
                                                        <DropdownMenuItem
                                                            onSelect={(e) => {
                                                                e.preventDefault();
                                                                window.location.href =
                                                                    articles.palletSheets.downloadFile(
                                                                        {
                                                                            palletSheet:
                                                                                sheet.uuid,
                                                                        },
                                                                    ).url;
                                                            }}
                                                        >
                                                            <Download className="mr-2 h-4 w-4" />
                                                            Scarica allegato
                                                        </DropdownMenuItem>
                                                    )}
                                                    <DropdownMenuItem
                                                        variant="destructive"
                                                        onSelect={(e) => {
                                                            e.preventDefault();
                                                            handleDeleteClick(
                                                                sheet,
                                                            );
                                                        }}
                                                    >
                                                        <Trash2 className="mr-2 h-4 w-4" />
                                                        Elimina
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <Pagination
                    links={sheetsPaginated.links}
                    currentPage={sheetsPaginated.current_page}
                    lastPage={sheetsPaginated.last_page}
                    totalItems={sheetsPaginated.total}
                />
            </div>

            <ConfirmDeleteDialog
                open={deleteDialog.open}
                onOpenChange={(open) => setDeleteDialog({ open, sheet: null })}
                onConfirm={handleDeleteConfirm}
                isLoading={isDeleting}
                title="Conferma eliminazione"
                description={`Sei sicuro di voler eliminare il foglio pallet ${deleteDialog.sheet?.code}? Questa azione non può essere annullata. Il foglio pallet verrà eliminato definitivamente.`}
            />
        </AppLayout>
    );
}
