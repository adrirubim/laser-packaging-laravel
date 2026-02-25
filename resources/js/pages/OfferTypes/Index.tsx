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
import offerTypes from '@/routes/offer-types';
import { type BreadcrumbItem } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';

type OfferType = {
    id: number;
    uuid: string;
    name: string;
};

type OfferTypesIndexProps = {
    offerTypes: {
        data: OfferType[];
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

export default function OfferTypesIndex() {
    const { t } = useTranslations();
    const { props } = usePage<OfferTypesIndexProps>();
    const { offerTypes: offerTypesPaginated, filters } = props;
    const { flash } = useFlashNotifications();

    const [searchValue, setSearchValue] = useState(filters.search ?? '');
    const [isSearching, setIsSearching] = useState(false);
    const [deleteDialog, setDeleteDialog] = useState<{
        open: boolean;
        offerType: OfferType | null;
    }>({
        open: false,
        offerType: null,
    });
    const [isDeleting, setIsDeleting] = useState(false);

    // Sync initial state with server filters
    useEffect(() => {
        queueMicrotask(() => setSearchValue(filters.search ?? ''));
    }, [filters.search]);

    const handleSearchChange = (value: string) => {
        setIsSearching(true);
        router.get(
            offerTypes.index().url,
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
            offerTypes.index().url,
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
            offerTypes.index().url,
            {
                sort_by: filters.sort_by,
                sort_order: filters.sort_order,
            },
            { preserveState: true, preserveScroll: true },
        );
    };

    const handleDeleteClick = (offerType: OfferType) => {
        setDeleteDialog({ open: true, offerType });
    };

    const handleDeleteConfirm = () => {
        if (!deleteDialog.offerType) return;

        setIsDeleting(true);
        router.delete(
            offerTypes.destroy({ offerType: deleteDialog.offerType.uuid }).url,
            {
                preserveScroll: true,
                onSuccess: () => {
                    setDeleteDialog({ open: false, offerType: null });
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
        { title: t('nav.offer_types'), href: offerTypes.index().url },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('offer_types.page_title')} />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <IndexHeader
                    title={t('offer_types.page_title')}
                    subtitle={t('offer_types.index.subtitle')}
                    createHref={offerTypes.create().url}
                    createLabel={t('offer_types.index.create')}
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
                            placeholder={t(
                                'offer_types.index.search_placeholder',
                            )}
                            isLoading={isSearching}
                            onClear={clearSearch}
                        />
                    </div>
                </div>

                {/* Vista mobile */}
                <div className="block space-y-3 p-4 md:hidden">
                    {offerTypesPaginated.data.length === 0 ? (
                        <div className="py-8 text-center text-sm text-muted-foreground">
                            {t('offer_types.index.empty')}
                        </div>
                    ) : (
                        offerTypesPaginated.data.map((offerType) => (
                            <div
                                key={offerType.uuid}
                                className="space-y-2 rounded-lg border p-4 transition-colors hover:bg-muted/40"
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <h3 className="font-medium">
                                            {offerType.name}
                                        </h3>
                                        <p className="mt-1 font-mono text-xs text-muted-foreground">
                                            {offerType.uuid}
                                        </p>
                                    </div>
                                    <ActionsDropdown
                                        viewHref={
                                            offerTypes.show({
                                                offerType: offerType.uuid,
                                            }).url
                                        }
                                        editHref={
                                            offerTypes.edit({
                                                offerType: offerType.uuid,
                                            }).url
                                        }
                                        onDelete={() =>
                                            handleDeleteClick(offerType)
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
                                        {t('common.id')}
                                    </th>
                                    <th className="border-b px-3 py-2 font-medium">
                                        {t('common.uuid')}
                                    </th>
                                    <SortableTableHeader
                                        column="name"
                                        currentSort={filters.sort_by}
                                        currentDirection={filters.sort_order}
                                        onSort={handleSort}
                                    >
                                        {t('offer_types.form.name_label')}
                                    </SortableTableHeader>
                                    <th className="border-b px-3 py-2 text-right font-medium">
                                        {t('common.actions')}
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {offerTypesPaginated.data.length === 0 && (
                                    <tr>
                                        <td
                                            colSpan={4}
                                            className="px-3 py-6 text-center text-sm text-muted-foreground"
                                        >
                                            {t('offer_types.index.empty')}
                                        </td>
                                    </tr>
                                )}
                                {offerTypesPaginated.data.map((offerType) => (
                                    <tr
                                        key={offerType.uuid}
                                        className="border-b last:border-b-0 hover:bg-muted/40"
                                    >
                                        <td className="px-3 py-2 align-middle text-xs">
                                            {offerType.id}
                                        </td>
                                        <td className="px-3 py-2 align-middle font-mono text-xs">
                                            {offerType.uuid}
                                        </td>
                                        <td className="px-3 py-2 align-middle font-medium">
                                            {offerType.name}
                                        </td>
                                        <td className="px-3 py-2 text-right align-middle text-xs">
                                            <ActionsDropdown
                                                viewHref={
                                                    offerTypes.show({
                                                        offerType:
                                                            offerType.uuid,
                                                    }).url
                                                }
                                                editHref={
                                                    offerTypes.edit({
                                                        offerType:
                                                            offerType.uuid,
                                                    }).url
                                                }
                                                onDelete={() =>
                                                    handleDeleteClick(offerType)
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
                    links={offerTypesPaginated.links}
                    currentPage={offerTypesPaginated.current_page}
                    lastPage={offerTypesPaginated.last_page}
                />

                <ConfirmDeleteDialog
                    open={deleteDialog.open}
                    onOpenChange={(open) =>
                        setDeleteDialog({
                            open,
                            offerType: deleteDialog.offerType,
                        })
                    }
                    onConfirm={handleDeleteConfirm}
                    title={t('offer_types.delete.title')}
                    description={t('offer_types.delete.description')}
                    itemName={deleteDialog.offerType?.name}
                    isLoading={isDeleting}
                />
            </div>
        </AppLayout>
    );
}
