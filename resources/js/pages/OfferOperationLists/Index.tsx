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
import offerOperationLists from '@/routes/offer-operation-lists/index';
import { type BreadcrumbItem } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { useState } from 'react';

type Offer = {
    uuid: string;
    offer_number: string;
    provisional_description?: string | null;
};

type Operation = {
    uuid: string;
    code: string;
    description?: string | null;
};

type OperationList = {
    id: number;
    uuid: string;
    num_op: number;
    offer?: Offer | null;
    operation?: Operation | null;
};

type OfferOperationListsIndexProps = {
    operationLists: {
        data: OperationList[];
        current_page: number;
        last_page: number;
        links: { url: string | null; label: string; active: boolean }[];
    };
    filters: {
        search?: string;
        offer_uuid?: string;
    };
    flash?: {
        success?: string;
        error?: string;
    };
};

export default function OfferOperationListsIndex() {
    const { props } = usePage<OfferOperationListsIndexProps>();
    const { operationLists: operationListsPaginated, filters } = props;
    const { flash } = useFlashNotifications();

    const [deleteDialog, setDeleteDialog] = useState<{
        open: boolean;
        list: OperationList | null;
    }>({ open: false, list: null });
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDeleteClick = (list: OperationList) => {
        setDeleteDialog({ open: true, list });
    };

    const handleDeleteConfirm = () => {
        if (!deleteDialog.list) return;
        setIsDeleting(true);
        router.delete(
            offerOperationLists.destroy({
                offerOperationList: deleteDialog.list.uuid,
            }).url,
            {
                preserveScroll: true,
                onSuccess: () => {
                    setDeleteDialog({ open: false, list: null });
                    setIsDeleting(false);
                },
                onError: () => setIsDeleting(false),
            },
        );
    };

    const handleSearchChange = (value: string) => {
        router.get(
            offerOperationLists.index().url,
            {
                search: value || undefined,
                offer_uuid: filters.offer_uuid || undefined,
            },
            {
                preserveState: true,
                preserveScroll: true,
            },
        );
    };

    const clearSearch = () => {
        router.get(
            offerOperationLists.index().url,
            {
                offer_uuid: filters.offer_uuid || undefined,
            },
            {
                preserveState: true,
                preserveScroll: true,
            },
        );
    };

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Offerte', href: '/offers' },
        {
            title: 'Liste Operazioni Offerta',
            href: offerOperationLists.index().url,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Liste Operazioni Offerta" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <IndexHeader
                    title="Liste Operazioni Offerta"
                    subtitle="Elenco delle operazioni assegnate alle offerte con Cerca e filtri."
                    createHref={
                        filters.offer_uuid
                            ? offerOperationLists.create().url +
                              `?offer_uuid=${filters.offer_uuid}`
                            : offerOperationLists.create().url
                    }
                    createLabel="Nuova Assegnazione"
                />

                <FlashNotifications flash={flash} />

                <div className="flex flex-col gap-3 rounded-xl border border-sidebar-border/70 bg-card p-4 dark:border-sidebar-border">
                    <div className="space-y-1">
                        <label className="text-xs font-medium text-muted-foreground">
                            Cerca
                        </label>
                        <SearchInput
                            value={filters.search || ''}
                            onChange={handleSearchChange}
                            onClear={clearSearch}
                            placeholder="Cerca per numero offerta o codice operazione..."
                        />
                    </div>
                </div>

                <div className="relative min-h-[300px] flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 bg-card dark:border-sidebar-border">
                    <div className="relative h-full w-full overflow-auto">
                        <table className="min-w-full border-separate border-spacing-0 text-left text-sm">
                            <thead className="sticky top-0 z-10 bg-muted/80 backdrop-blur">
                                <tr className="text-xs tracking-wide text-muted-foreground uppercase">
                                    <th className="border-b px-3 py-2 font-medium">
                                        Offerta
                                    </th>
                                    <th className="border-b px-3 py-2 font-medium">
                                        Operazione
                                    </th>
                                    <th className="border-b px-3 py-2 font-medium">
                                        Numero
                                    </th>
                                    <th className="border-b px-3 py-2 text-right font-medium">
                                        Azioni
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {operationListsPaginated.data.length === 0 && (
                                    <tr>
                                        <td
                                            colSpan={4}
                                            className="px-3 py-6 text-center text-sm text-muted-foreground"
                                        >
                                            Nessuna lista operazioni trovata per
                                            i filtri attuali.
                                        </td>
                                    </tr>
                                )}
                                {operationListsPaginated.data.map((list) => (
                                    <tr
                                        key={list.id}
                                        className="border-b last:border-b-0 hover:bg-muted/40"
                                    >
                                        <td className="px-3 py-2 align-middle font-mono text-xs">
                                            {list.offer?.offer_number || 'N/D'}
                                        </td>
                                        <td className="px-3 py-2 align-middle">
                                            <div className="font-mono text-xs">
                                                {list.operation?.code || 'N/D'}
                                            </div>
                                            {list.operation?.description && (
                                                <div className="text-xs text-muted-foreground">
                                                    {list.operation.description}
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-3 py-2 align-middle font-mono text-xs">
                                            {list.num_op}
                                        </td>
                                        <td className="px-3 py-2 text-right align-middle text-xs">
                                            <ActionsDropdown
                                                viewHref={
                                                    offerOperationLists.show({
                                                        offerOperationList:
                                                            list.uuid,
                                                    }).url
                                                }
                                                editHref={
                                                    offerOperationLists.edit({
                                                        offerOperationList:
                                                            list.uuid,
                                                    }).url
                                                }
                                                onDelete={() =>
                                                    handleDeleteClick(list)
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
                    links={operationListsPaginated.links}
                    currentPage={operationListsPaginated.current_page}
                    lastPage={operationListsPaginated.last_page}
                />
            </div>

            <ConfirmDeleteDialog
                open={deleteDialog.open}
                onOpenChange={(open) =>
                    !open && setDeleteDialog({ open: false, list: null })
                }
                onConfirm={handleDeleteConfirm}
                isDeleting={isDeleting}
                title="Elimina assegnazione"
                description="Sei sicuro di voler eliminare questa assegnazione operazione-offerta? L'operazione non può essere annullata."
            />
        </AppLayout>
    );
}
