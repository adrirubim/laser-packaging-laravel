import { ActionsDropdown } from '@/components/ActionsDropdown';
import ConfirmDeleteDialog from '@/components/confirm-delete-dialog';
import {
    FlashNotifications,
    useFlashNotifications,
} from '@/components/flash-notifications';
import { IndexHeader } from '@/components/IndexHeader';
import { Pagination } from '@/components/Pagination';
import { SearchInput } from '@/components/SearchInput';
import { useTranslations } from '@/hooks/use-translations';
import AppLayout from '@/layouts/app-layout';
import articles from '@/routes/articles/index';
import palletTypes from '@/routes/pallet-types/index';
import { type BreadcrumbItem } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { useState } from 'react';

type PalletType = {
    id: number;
    uuid: string;
    cod: string;
    description: string;
};

type PalletTypesIndexProps = {
    palletTypes: {
        data: PalletType[];
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

export default function PalletTypesIndex() {
    const { t } = useTranslations();
    const { props } = usePage<PalletTypesIndexProps>();
    const { palletTypes: palletTypesPaginated, filters } = props;
    const { flash } = useFlashNotifications();

    const [deleteDialog, setDeleteDialog] = useState<{
        open: boolean;
        palletType: PalletType | null;
    }>({ open: false, palletType: null });
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDeleteClick = (palletType: PalletType) => {
        setDeleteDialog({ open: true, palletType });
    };

    const handleDeleteConfirm = () => {
        if (!deleteDialog.palletType) return;
        setIsDeleting(true);
        router.delete(
            palletTypes.destroy({
                palletType: deleteDialog.palletType.uuid,
            }).url,
            {
                preserveScroll: true,
                onSuccess: () => {
                    setDeleteDialog({ open: false, palletType: null });
                    setIsDeleting(false);
                },
                onError: () => setIsDeleting(false),
            },
        );
    };

    const handleSearchChange = (value: string) => {
        router.get(
            palletTypes.index().url,
            {
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
            palletTypes.index().url,
            {},
            {
                preserveState: true,
                preserveScroll: true,
            },
        );
    };

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: t('nav.articles'),
            href: articles.index().url,
        },
        {
            title: t('nav.tipo_pallet'),
            href: palletTypes.index().url,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('pallet_types.title')} />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <IndexHeader
                    title={t('pallet_types.title')}
                    subtitle={t('pallet_types.index.subtitle')}
                    createHref={palletTypes.create().url}
                    createLabel={t('pallet_types.index.create')}
                />

                <FlashNotifications flash={flash} />

                <div className="flex flex-col gap-3 rounded-xl border border-sidebar-border/70 bg-card p-4 dark:border-sidebar-border">
                    <div className="space-y-1">
                        <label className="text-xs font-medium text-muted-foreground">
                            {t('common.search')}
                        </label>
                        <SearchInput
                            value={filters.search || ''}
                            onChange={handleSearchChange}
                            onClear={clearSearch}
                            placeholder={t('pallet_types.search_placeholder')}
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
                                        {t('common.code')}
                                    </th>
                                    <th className="border-b px-3 py-2 font-medium">
                                        {t('common.description')}
                                    </th>
                                    <th className="border-b px-3 py-2 text-right font-medium">
                                        {t('common.actions')}
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {palletTypesPaginated.data.length === 0 && (
                                    <tr>
                                        <td
                                            colSpan={5}
                                            className="px-3 py-6 text-center text-sm text-muted-foreground"
                                        >
                                            {t('pallet_types.empty_filtered')}
                                        </td>
                                    </tr>
                                )}
                                {palletTypesPaginated.data.map((palletType) => (
                                    <tr
                                        key={palletType.uuid}
                                        className="border-b last:border-b-0 hover:bg-muted/40"
                                    >
                                        <td className="px-3 py-2 align-middle text-xs">
                                            {palletType.id}
                                        </td>
                                        <td className="px-3 py-2 align-middle font-mono text-xs">
                                            {palletType.uuid}
                                        </td>
                                        <td className="px-3 py-2 align-middle font-mono text-xs">
                                            {palletType.cod}
                                        </td>
                                        <td className="px-3 py-2 align-middle font-medium">
                                            {palletType.description}
                                        </td>
                                        <td className="px-3 py-2 text-right align-middle text-xs">
                                            <ActionsDropdown
                                                viewHref={
                                                    palletTypes.show({
                                                        palletType:
                                                            palletType.uuid,
                                                    }).url
                                                }
                                                editHref={
                                                    palletTypes.edit({
                                                        palletType:
                                                            palletType.uuid,
                                                    }).url
                                                }
                                                onDelete={() =>
                                                    handleDeleteClick(
                                                        palletType,
                                                    )
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
                    links={palletTypesPaginated.links}
                    currentPage={palletTypesPaginated.current_page}
                    lastPage={palletTypesPaginated.last_page}
                />
            </div>

            <ConfirmDeleteDialog
                open={deleteDialog.open}
                onOpenChange={(open) =>
                    !open && setDeleteDialog({ open: false, palletType: null })
                }
                onConfirm={handleDeleteConfirm}
                isDeleting={isDeleting}
                title={t('pallet_types.delete.title')}
                description={t('pallet_types.delete.description')}
            />
        </AppLayout>
    );
}
