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
import offerSeasonalities from '@/routes/offer-seasonalities';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { Edit, Eye, MoreHorizontal, Plus, Trash2, X } from 'lucide-react';
import { useEffect, useState } from 'react';

type OfferSeasonality = {
    id: number;
    uuid: string;
    name: string;
};

type OfferSeasonalitiesIndexProps = {
    seasonalities: {
        data: OfferSeasonality[];
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

export default function OfferSeasonalitiesIndex() {
    const { props } = usePage<OfferSeasonalitiesIndexProps>();
    const { seasonalities: seasonalitiesPaginated, filters, flash } = props;

    const [searchValue, setSearchValue] = useState(filters.search ?? '');
    const [isSearching, setIsSearching] = useState(false);
    const [showFlash, setShowFlash] = useState(true);
    const [deleteDialog, setDeleteDialog] = useState<{
        open: boolean;
        seasonality: OfferSeasonality | null;
    }>({
        open: false,
        seasonality: null,
    });
    const [isDeleting, setIsDeleting] = useState(false);

    // Sincronizzare stato iniziale con i filtri del server
    useEffect(() => {
        queueMicrotask(() => setSearchValue(filters.search ?? ''));
    }, [filters.search]);

    const handleSearchChange = (value: string) => {
        setIsSearching(true);
        router.get(
            offerSeasonalities.index().url,
            {
                search: value || undefined,
                sort_by: filters.sort_by,
                sort_order: filters.sort_order,
            },
            {
                preserveState: true,
                preserveScroll: true,
                onFinish: () => setIsSearching(false),
            },
        );
    };

    const handleSort = (column: string) => {
        const currentSort = filters.sort_by;
        const currentDirection = filters.sort_order || 'asc';

        let newDirection: 'asc' | 'desc' = 'asc';
        if (currentSort === column && currentDirection === 'asc') {
            newDirection = 'desc';
        }

        router.get(
            offerSeasonalities.index().url,
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

    useEffect(() => {
        if (flash?.success || flash?.error) {
            queueMicrotask(() => setShowFlash(true));
            const timer = setTimeout(() => setShowFlash(false), 5000);
            return () => clearTimeout(timer);
        }
    }, [flash]);

    const clearSearch = () => {
        setSearchValue('');
        router.get(
            offerSeasonalities.index().url,
            {
                sort_by: filters.sort_by,
                sort_order: filters.sort_order,
            },
            { preserveState: true, preserveScroll: true },
        );
    };

    const handleDeleteClick = (seasonality: OfferSeasonality) => {
        setDeleteDialog({ open: true, seasonality });
    };

    const handleDeleteConfirm = () => {
        if (!deleteDialog.seasonality) return;

        setIsDeleting(true);
        router.delete(
            offerSeasonalities.destroy({
                offerSeasonality: deleteDialog.seasonality.uuid,
            }).url,
            {
                preserveScroll: true,
                onSuccess: () => {
                    setDeleteDialog({ open: false, seasonality: null });
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
        { title: 'Stagionalità', href: offerSeasonalities.index().url },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Stagionalità" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between gap-3">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">
                            Stagionalità
                        </h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Elenco delle stagionalità attive con Cerca.
                        </p>
                    </div>
                    <Link
                        href={offerSeasonalities.create().url}
                        className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm hover:bg-primary/90"
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        Nuova Stagionalità
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

                <div className="flex flex-col gap-3 rounded-xl border border-sidebar-border/70 bg-card p-4 dark:border-sidebar-border">
                    <div className="space-y-1">
                        <label className="text-xs font-medium text-muted-foreground">
                            Cerca
                        </label>
                        <SearchInput
                            value={searchValue}
                            onChange={handleSearchChange}
                            placeholder="Nome stagionalità..."
                            isLoading={isSearching}
                            onClear={clearSearch}
                        />
                    </div>
                </div>

                {/* Vista mobile */}
                <div className="block space-y-3 p-4 md:hidden">
                    {seasonalitiesPaginated.data.length === 0 ? (
                        <div className="py-8 text-center text-sm text-muted-foreground">
                            Nessuna stagionalità trovata per i filtri attuali.
                        </div>
                    ) : (
                        seasonalitiesPaginated.data.map((seasonality) => (
                            <div
                                key={seasonality.uuid}
                                className="space-y-2 rounded-lg border p-4 transition-colors hover:bg-muted/40"
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <h3 className="font-medium">
                                            {seasonality.name}
                                        </h3>
                                        <p className="mt-1 font-mono text-xs text-muted-foreground">
                                            {seasonality.uuid}
                                        </p>
                                    </div>
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
                                                        offerSeasonalities.show(
                                                            {
                                                                offerSeasonality:
                                                                    seasonality.uuid,
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
                                                        offerSeasonalities.edit(
                                                            {
                                                                offerSeasonality:
                                                                    seasonality.uuid,
                                                            },
                                                        ).url,
                                                    );
                                                }}
                                            >
                                                <Edit className="mr-2 h-4 w-4" />
                                                Modifica
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                variant="destructive"
                                                onSelect={(e) => {
                                                    e.preventDefault();
                                                    handleDeleteClick(
                                                        seasonality,
                                                    );
                                                }}
                                            >
                                                <Trash2 className="mr-2 h-4 w-4" />
                                                Elimina
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Vista desktop */}
                <div className="relative hidden min-h-[300px] flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 bg-card md:block dark:border-sidebar-border">
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
                            <tbody>
                                {seasonalitiesPaginated.data.length === 0 && (
                                    <tr>
                                        <td
                                            colSpan={4}
                                            className="px-3 py-6 text-center text-sm text-muted-foreground"
                                        >
                                            Nessuna stagionalità trovata per i
                                            filtri attuali.
                                        </td>
                                    </tr>
                                )}
                                {seasonalitiesPaginated.data.map(
                                    (seasonality) => (
                                        <tr
                                            key={seasonality.uuid}
                                            className="border-b last:border-b-0 hover:bg-muted/40"
                                        >
                                            <td className="px-3 py-2 align-middle text-xs">
                                                {seasonality.id}
                                            </td>
                                            <td className="px-3 py-2 align-middle font-mono text-xs">
                                                {seasonality.uuid}
                                            </td>
                                            <td className="px-3 py-2 align-middle font-medium">
                                                {seasonality.name}
                                            </td>
                                            <td className="px-3 py-2 text-right align-middle text-xs">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger
                                                        asChild
                                                    >
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
                                                                    offerSeasonalities.show(
                                                                        {
                                                                            offerSeasonality:
                                                                                seasonality.uuid,
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
                                                                    offerSeasonalities.edit(
                                                                        {
                                                                            offerSeasonality:
                                                                                seasonality.uuid,
                                                                        },
                                                                    ).url,
                                                                );
                                                            }}
                                                        >
                                                            <Edit className="mr-2 h-4 w-4" />
                                                            Modifica
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            variant="destructive"
                                                            onSelect={(e) => {
                                                                e.preventDefault();
                                                                handleDeleteClick(
                                                                    seasonality,
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
                                    ),
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                <Pagination
                    links={seasonalitiesPaginated.links}
                    currentPage={seasonalitiesPaginated.current_page}
                    lastPage={seasonalitiesPaginated.last_page}
                />

                <ConfirmDeleteDialog
                    open={deleteDialog.open}
                    onOpenChange={(open) =>
                        setDeleteDialog({
                            open,
                            seasonality: deleteDialog.seasonality,
                        })
                    }
                    onConfirm={handleDeleteConfirm}
                    title="Elimina Stagionalità"
                    description="Sei sicuro di voler eliminare questa stagionalità? Questa azione non può essere annullata."
                    itemName={deleteDialog.seasonality?.name}
                    isLoading={isDeleting}
                />
            </div>
        </AppLayout>
    );
}
