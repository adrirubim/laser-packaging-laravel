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
import { useTranslations } from '@/hooks/use-translations';
import AppLayout from '@/layouts/app-layout';
import offerSectors from '@/routes/offer-sectors';
import { type BreadcrumbItem } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';

type OfferSector = {
    id: number;
    uuid: string;
    name: string;
};

type OfferSectorsIndexProps = {
    sectors: {
        data: OfferSector[];
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

export default function OfferSectorsIndex() {
    const { t } = useTranslations();
    const { props } = usePage<OfferSectorsIndexProps>();
    const { sectors: sectorsPaginated, filters } = props;
    const { flash } = useFlashNotifications();

    const [searchValue, setSearchValue] = useState(filters.search ?? '');
    const [isSearching, setIsSearching] = useState(false);
    const [deleteDialog, setDeleteDialog] = useState<{
        open: boolean;
        sector: OfferSector | null;
    }>({
        open: false,
        sector: null,
    });
    const [isDeleting, setIsDeleting] = useState(false);

    // Sync initial state with server filters
    useEffect(() => {
        queueMicrotask(() => setSearchValue(filters.search ?? ''));
    }, [filters.search]);

    const handleSearchChange = (value: string) => {
        setIsSearching(true);
        router.get(
            offerSectors.index().url,
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
            offerSectors.index().url,
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
            offerSectors.index().url,
            {
                sort_by: filters.sort_by,
                sort_order: filters.sort_order,
            },
            { preserveState: true, preserveScroll: true },
        );
    };

    const handleDeleteClick = (sector: OfferSector) => {
        setDeleteDialog({ open: true, sector });
    };

    const handleDeleteConfirm = () => {
        if (!deleteDialog.sector) return;

        setIsDeleting(true);
        router.delete(
            offerSectors.destroy({ offerSector: deleteDialog.sector.uuid }).url,
            {
                preserveScroll: true,
                onSuccess: () => {
                    setDeleteDialog({ open: false, sector: null });
                    setIsDeleting(false);
                },
                onError: () => {
                    setIsDeleting(false);
                },
            },
        );
    };

    const breadcrumbs: BreadcrumbItem[] = [
        { title: t('nav.offers'), href: '/offers' },
        {
            title: t('offer_sectors.page_title'),
            href: offerSectors.index().url,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('offer_sectors.page_title')} />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <IndexHeader
                    title={t('offer_sectors.page_title')}
                    subtitle={t('offer_sectors.index.subtitle')}
                    createHref={offerSectors.create().url}
                    createLabel={t('offer_sectors.index.create')}
                />

                <FlashNotifications flash={flash} />

                <div className="flex flex-col gap-3 rounded-xl border border-sidebar-border/70 bg-card p-4 dark:border-sidebar-border">
                    <div className="space-y-1">
                        <label className="text-xs font-medium text-muted-foreground">
                            {t('common.search')}
                        </label>
                        <SearchInput
                            value={searchValue}
                            onChange={handleSearchChange}
                            placeholder={t('offer_sectors.search_placeholder')}
                            isLoading={isSearching}
                            onClear={clearSearch}
                        />
                    </div>
                </div>

                {/* Vista mobile */}
                <div className="block space-y-3 p-4 md:hidden">
                    {sectorsPaginated.data.length === 0 ? (
                        <div className="py-8 text-center text-sm text-muted-foreground">
                            {t('offer_sectors.index.empty')}
                        </div>
                    ) : (
                        sectorsPaginated.data.map((sector) => (
                            <div
                                key={sector.uuid}
                                className="space-y-2 rounded-lg border p-4 transition-colors hover:bg-muted/40"
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <h3 className="font-medium">
                                            {sector.name}
                                        </h3>
                                        <p className="mt-1 font-mono text-xs text-muted-foreground">
                                            {sector.uuid}
                                        </p>
                                    </div>
                                    <ActionsDropdown
                                        viewHref={
                                            offerSectors.show({
                                                offerSector: sector.uuid,
                                            }).url
                                        }
                                        editHref={
                                            offerSectors.edit({
                                                offerSector: sector.uuid,
                                            }).url
                                        }
                                        onDelete={() =>
                                            handleDeleteClick(sector)
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
                                        {t('offer_sectors.form.name_label')}
                                    </SortableTableHeader>
                                    <th className="border-b px-3 py-2 text-right font-medium">
                                        {t('common.actions')}
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {sectorsPaginated.data.length === 0 && (
                                    <tr>
                                        <td
                                            colSpan={4}
                                            className="px-3 py-6 text-center text-sm text-muted-foreground"
                                        >
                                            {t('offer_sectors.index.empty')}
                                        </td>
                                    </tr>
                                )}
                                {sectorsPaginated.data.map((sector) => (
                                    <tr
                                        key={sector.uuid}
                                        className="border-b last:border-b-0 hover:bg-muted/40"
                                    >
                                        <td className="px-3 py-2 align-middle text-xs">
                                            {sector.id}
                                        </td>
                                        <td className="px-3 py-2 align-middle font-mono text-xs">
                                            {sector.uuid}
                                        </td>
                                        <td className="px-3 py-2 align-middle font-medium">
                                            {sector.name}
                                        </td>
                                        <td className="px-3 py-2 text-right align-middle text-xs">
                                            <ActionsDropdown
                                                viewHref={
                                                    offerSectors.show({
                                                        offerSector:
                                                            sector.uuid,
                                                    }).url
                                                }
                                                editHref={
                                                    offerSectors.edit({
                                                        offerSector:
                                                            sector.uuid,
                                                    }).url
                                                }
                                                onDelete={() =>
                                                    handleDeleteClick(sector)
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
                    links={sectorsPaginated.links}
                    currentPage={sectorsPaginated.current_page}
                    lastPage={sectorsPaginated.last_page}
                />

                <ConfirmDeleteDialog
                    open={deleteDialog.open}
                    onOpenChange={(open) =>
                        setDeleteDialog({ open, sector: deleteDialog.sector })
                    }
                    onConfirm={handleDeleteConfirm}
                    title={t('offer_sectors.delete.title')}
                    description={t('offer_sectors.delete.description')}
                    itemName={deleteDialog.sector?.name}
                    isLoading={isDeleting}
                />
            </div>
        </AppLayout>
    );
}
