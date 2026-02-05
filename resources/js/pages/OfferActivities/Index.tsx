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
import offerActivities from '@/routes/offer-activities';
import { type BreadcrumbItem } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';

type OfferActivity = {
    id: number;
    uuid: string;
    name: string;
};

type OfferActivitiesIndexProps = {
    activities: {
        data: OfferActivity[];
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

export default function OfferActivitiesIndex() {
    const { props } = usePage<OfferActivitiesIndexProps>();
    const { activities: activitiesPaginated, filters } = props;
    const { flash } = useFlashNotifications();

    const [searchValue, setSearchValue] = useState(filters.search ?? '');
    const [isSearching, setIsSearching] = useState(false);
    const [deleteDialog, setDeleteDialog] = useState<{
        open: boolean;
        activity: OfferActivity | null;
    }>({
        open: false,
        activity: null,
    });
    const [isDeleting, setIsDeleting] = useState(false);

    // Sincronizzare stato iniziale con i filtri del server
    useEffect(() => {
        queueMicrotask(() => setSearchValue(filters.search ?? ''));
    }, [filters.search]);

    const handleSearchChange = (value: string) => {
        setIsSearching(true);
        router.get(
            offerActivities.index().url,
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
            offerActivities.index().url,
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
            offerActivities.index().url,
            {
                sort_by: filters.sort_by,
                sort_order: filters.sort_order,
            },
            { preserveState: true, preserveScroll: true },
        );
    };

    const handleDeleteClick = (activity: OfferActivity) => {
        setDeleteDialog({ open: true, activity });
    };

    const handleDeleteConfirm = () => {
        if (!deleteDialog.activity) return;

        setIsDeleting(true);
        router.delete(
            offerActivities.destroy({
                offerActivity: deleteDialog.activity.uuid,
            }).url,
            {
                preserveScroll: true,
                onSuccess: () => {
                    setDeleteDialog({ open: false, activity: null });
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
        { title: 'Attività', href: offerActivities.index().url },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Attività" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <IndexHeader
                    title="Attività"
                    subtitle="Elenco delle attività attive con Cerca."
                    createHref={offerActivities.create().url}
                    createLabel="Nuova Attività"
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
                            placeholder="Nome attività..."
                            isLoading={isSearching}
                            onClear={clearSearch}
                        />
                    </div>
                </div>

                {/* Vista mobile */}
                <div className="block space-y-3 p-4 md:hidden">
                    {activitiesPaginated.data.length === 0 ? (
                        <div className="py-8 text-center text-sm text-muted-foreground">
                            Nessuna attività trovata per i filtri attuali.
                        </div>
                    ) : (
                        activitiesPaginated.data.map((activity) => (
                            <div
                                key={activity.uuid}
                                className="space-y-2 rounded-lg border p-4 transition-colors hover:bg-muted/40"
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <h3 className="font-medium">
                                            {activity.name}
                                        </h3>
                                        <p className="mt-1 font-mono text-xs text-muted-foreground">
                                            {activity.uuid}
                                        </p>
                                    </div>
                                    <ActionsDropdown
                                        viewHref={
                                            offerActivities.show({
                                                offerActivity: activity.uuid,
                                            }).url
                                        }
                                        editHref={
                                            offerActivities.edit({
                                                offerActivity: activity.uuid,
                                            }).url
                                        }
                                        onDelete={() =>
                                            handleDeleteClick(activity)
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
                                {activitiesPaginated.data.length === 0 && (
                                    <tr>
                                        <td
                                            colSpan={4}
                                            className="px-3 py-6 text-center text-sm text-muted-foreground"
                                        >
                                            Nessuna attività trovata per i
                                            filtri attuali.
                                        </td>
                                    </tr>
                                )}
                                {activitiesPaginated.data.map((activity) => (
                                    <tr
                                        key={activity.uuid}
                                        className="border-b last:border-b-0 hover:bg-muted/40"
                                    >
                                        <td className="px-3 py-2 align-middle text-xs">
                                            {activity.id}
                                        </td>
                                        <td className="px-3 py-2 align-middle font-mono text-xs">
                                            {activity.uuid}
                                        </td>
                                        <td className="px-3 py-2 align-middle font-medium">
                                            {activity.name}
                                        </td>
                                        <td className="px-3 py-2 text-right align-middle text-xs">
                                            <ActionsDropdown
                                                viewHref={
                                                    offerActivities.show({
                                                        offerActivity:
                                                            activity.uuid,
                                                    }).url
                                                }
                                                editHref={
                                                    offerActivities.edit({
                                                        offerActivity:
                                                            activity.uuid,
                                                    }).url
                                                }
                                                onDelete={() =>
                                                    handleDeleteClick(activity)
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
                    links={activitiesPaginated.links}
                    currentPage={activitiesPaginated.current_page}
                    lastPage={activitiesPaginated.last_page}
                />

                <ConfirmDeleteDialog
                    open={deleteDialog.open}
                    onOpenChange={(open) =>
                        setDeleteDialog({
                            open,
                            activity: deleteDialog.activity,
                        })
                    }
                    onConfirm={handleDeleteConfirm}
                    title="Elimina Attività"
                    description="Sei sicuro di voler eliminare questa attività? Questa azione non può essere annullata."
                    itemName={deleteDialog.activity?.name}
                    isLoading={isDeleting}
                />
            </div>
        </AppLayout>
    );
}
