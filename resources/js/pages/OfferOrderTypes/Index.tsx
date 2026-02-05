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
import offerOrderTypes from '@/routes/offer-order-types';
import { type BreadcrumbItem } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';

type OfferOrderType = {
    id: number;
    uuid: string;
    code: string;
    name: string;
};

type OfferOrderTypesIndexProps = {
    orderTypes: {
        data: OfferOrderType[];
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

export default function OfferOrderTypesIndex() {
    const { props } = usePage<OfferOrderTypesIndexProps>();
    const { orderTypes: orderTypesPaginated, filters } = props;
    const { flash } = useFlashNotifications();

    const [searchValue, setSearchValue] = useState(filters.search ?? '');
    const [isSearching, setIsSearching] = useState(false);
    const [deleteDialog, setDeleteDialog] = useState<{
        open: boolean;
        orderType: OfferOrderType | null;
    }>({
        open: false,
        orderType: null,
    });
    const [isDeleting, setIsDeleting] = useState(false);

    // Sincronizzare stato iniziale con i filtri del server
    useEffect(() => {
        queueMicrotask(() => setSearchValue(filters.search ?? ''));
    }, [filters.search]);

    const handleSearchChange = (value: string) => {
        setIsSearching(true);
        router.get(
            offerOrderTypes.index().url,
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
            offerOrderTypes.index().url,
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

    const clearSearch = () => {
        setSearchValue('');
        router.get(
            offerOrderTypes.index().url,
            {
                sort_by: filters.sort_by,
                sort_order: filters.sort_order,
            },
            { preserveState: true, preserveScroll: true },
        );
    };

    const handleDeleteClick = (orderType: OfferOrderType) => {
        setDeleteDialog({ open: true, orderType });
    };

    const handleDeleteConfirm = () => {
        if (!deleteDialog.orderType) return;

        setIsDeleting(true);
        router.delete(
            offerOrderTypes.destroy({
                offerOrderType: deleteDialog.orderType.uuid,
            }).url,
            {
                preserveScroll: true,
                onSuccess: () => {
                    setDeleteDialog({ open: false, orderType: null });
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
        { title: 'Tipi ordini', href: '/offers/order-types' },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tipi ordini" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <IndexHeader
                    title="Tipi ordini"
                    subtitle="Elenco dei tipi ordine attivi con Cerca."
                    createHref={offerOrderTypes.create().url}
                    createLabel="Nuovo Tipo Ordine"
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
                            placeholder="Nome o codice..."
                            isLoading={isSearching}
                            onClear={clearSearch}
                        />
                    </div>
                </div>

                {/* Vista mobile */}
                <div className="block space-y-3 p-4 md:hidden">
                    {orderTypesPaginated.data.length === 0 ? (
                        <div className="py-8 text-center text-sm text-muted-foreground">
                            Nessun tipo ordine trovato per i filtri attuali.
                        </div>
                    ) : (
                        orderTypesPaginated.data.map((orderType) => (
                            <div
                                key={orderType.uuid}
                                className="space-y-2 rounded-lg border p-4 transition-colors hover:bg-muted/40"
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <h3 className="font-medium">
                                            {orderType.name}
                                        </h3>
                                        {orderType.code && (
                                            <p className="mt-1 text-sm text-muted-foreground">
                                                Codice: {orderType.code}
                                            </p>
                                        )}
                                        <p className="mt-1 font-mono text-xs text-muted-foreground">
                                            {orderType.uuid}
                                        </p>
                                    </div>
                                    <ActionsDropdown
                                        viewHref={
                                            offerOrderTypes.show({
                                                offerOrderType: orderType.uuid,
                                            }).url
                                        }
                                        editHref={
                                            offerOrderTypes.edit({
                                                offerOrderType: orderType.uuid,
                                            }).url
                                        }
                                        onDelete={() =>
                                            handleDeleteClick(orderType)
                                        }
                                    />
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
                                        column="code"
                                        currentSort={filters.sort_by}
                                        currentDirection={filters.sort_order}
                                        onSort={handleSort}
                                    >
                                        Codice
                                    </SortableTableHeader>
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
                                {orderTypesPaginated.data.length === 0 && (
                                    <tr>
                                        <td
                                            colSpan={5}
                                            className="px-3 py-6 text-center text-sm text-muted-foreground"
                                        >
                                            Nessun tipo ordine trovato per i
                                            filtri attuali.
                                        </td>
                                    </tr>
                                )}
                                {orderTypesPaginated.data.map((orderType) => (
                                    <tr
                                        key={orderType.uuid}
                                        className="border-b last:border-b-0 hover:bg-muted/40"
                                    >
                                        <td className="px-3 py-2 align-middle text-xs">
                                            {orderType.id}
                                        </td>
                                        <td className="px-3 py-2 align-middle font-mono text-xs">
                                            {orderType.uuid}
                                        </td>
                                        <td className="px-3 py-2 align-middle">
                                            {orderType.code ?? '—'}
                                        </td>
                                        <td className="px-3 py-2 align-middle font-medium">
                                            {orderType.name}
                                        </td>
                                        <td className="px-3 py-2 text-right align-middle text-xs">
                                            <ActionsDropdown
                                                viewHref={
                                                    offerOrderTypes.show({
                                                        offerOrderType:
                                                            orderType.uuid,
                                                    }).url
                                                }
                                                editHref={
                                                    offerOrderTypes.edit({
                                                        offerOrderType:
                                                            orderType.uuid,
                                                    }).url
                                                }
                                                onDelete={() =>
                                                    handleDeleteClick(orderType)
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
                    links={orderTypesPaginated.links}
                    currentPage={orderTypesPaginated.current_page}
                    lastPage={orderTypesPaginated.last_page}
                />

                <ConfirmDeleteDialog
                    open={deleteDialog.open}
                    onOpenChange={(open) =>
                        setDeleteDialog({
                            open,
                            orderType: deleteDialog.orderType,
                        })
                    }
                    onConfirm={handleDeleteConfirm}
                    title="Elimina Tipo Ordine"
                    description="Sei sicuro di voler eliminare questo tipo ordine? Questa azione non può essere annullata."
                    itemName={deleteDialog.orderType?.name}
                    isLoading={isDeleting}
                />
            </div>
        </AppLayout>
    );
}
