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
import valueTypes from '@/routes/value-types/index';
import { type BreadcrumbItem } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { useState } from 'react';

type ValueType = {
    id: number;
    uuid: string;
};

type ValueTypesIndexProps = {
    valueTypes: {
        data: ValueType[];
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

export default function ValueTypesIndex() {
    const { t } = useTranslations();
    const { props } = usePage<ValueTypesIndexProps>();
    const { valueTypes: valueTypesPaginated, filters } = props;
    const { flash } = useFlashNotifications();

    const [deleteDialog, setDeleteDialog] = useState<{
        open: boolean;
        valueType: ValueType | null;
    }>({
        open: false,
        valueType: null,
    });
    const [isDeleting, setIsDeleting] = useState(false);

    const handleSearchChange = (value: string) => {
        router.get(
            valueTypes.index().url,
            { search: value || undefined },
            { preserveState: true, preserveScroll: true },
        );
    };

    const clearSearch = () => {
        router.get(
            valueTypes.index().url,
            {},
            { preserveState: true, preserveScroll: true },
        );
    };

    const handleDeleteClick = (valueType: ValueType) => {
        setDeleteDialog({ open: true, valueType });
    };

    const handleDeleteConfirm = () => {
        if (!deleteDialog.valueType) return;

        setIsDeleting(true);
        router.delete(
            valueTypes.destroy({ valueType: deleteDialog.valueType.uuid }).url,
            {
                preserveScroll: true,
                onSuccess: () => {
                    setDeleteDialog({ open: false, valueType: null });
                    setIsDeleting(false);
                },
                onError: () => {
                    setIsDeleting(false);
                },
            },
        );
    };

    const breadcrumbs: BreadcrumbItem[] = [
        { title: t('nav.configuration'), href: '#' },
        { title: t('value_types.page_title'), href: valueTypes.index().url },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('value_types.page_title')} />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <IndexHeader
                    title={t('value_types.page_title')}
                    subtitle={t('value_types.index.subtitle')}
                    createHref={valueTypes.create().url}
                    createLabel={t('value_types.index.create')}
                />

                <FlashNotifications flash={flash} />

                <div className="flex flex-col gap-3 rounded-xl border border-sidebar-border/70 bg-card p-4 dark:border-sidebar-border">
                    <div className="space-y-1">
                        <label className="text-xs font-medium text-muted-foreground">
                            {t('common.search')}
                        </label>
                        <SearchInput
                            value={filters.search ?? ''}
                            onChange={handleSearchChange}
                            onClear={clearSearch}
                            placeholder={t(
                                'value_types.index.search_placeholder',
                            )}
                            debounceMs={500}
                        />
                    </div>
                </div>

                <div className="relative min-h-[300px] flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 bg-card dark:border-sidebar-border">
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
                                    <th className="border-b px-3 py-2 text-right font-medium">
                                        {t('common.actions')}
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {valueTypesPaginated.data.length === 0 && (
                                    <tr>
                                        <td
                                            colSpan={3}
                                            className="px-3 py-6 text-center text-sm text-muted-foreground"
                                        >
                                            {t('value_types.index.empty')}
                                        </td>
                                    </tr>
                                )}
                                {valueTypesPaginated.data.map((valueType) => (
                                    <tr
                                        key={valueType.uuid}
                                        className="border-b last:border-b-0 hover:bg-muted/40"
                                    >
                                        <td className="px-3 py-2 align-middle text-xs">
                                            {valueType.id}
                                        </td>
                                        <td className="px-3 py-2 align-middle font-mono text-xs">
                                            {valueType.uuid}
                                        </td>
                                        <td className="px-3 py-2 text-right align-middle text-xs">
                                            <ActionsDropdown
                                                viewHref={
                                                    valueTypes.show({
                                                        valueType:
                                                            valueType.uuid,
                                                    }).url
                                                }
                                                editHref={
                                                    valueTypes.edit({
                                                        valueType:
                                                            valueType.uuid,
                                                    }).url
                                                }
                                                onDelete={() =>
                                                    handleDeleteClick(valueType)
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
                    links={valueTypesPaginated.links}
                    currentPage={valueTypesPaginated.current_page}
                    lastPage={valueTypesPaginated.last_page}
                />

                <ConfirmDeleteDialog
                    open={deleteDialog.open}
                    onOpenChange={(open) =>
                        setDeleteDialog({
                            open,
                            valueType: deleteDialog.valueType,
                        })
                    }
                    onConfirm={handleDeleteConfirm}
                    title={t('value_types.delete.title')}
                    description={t('value_types.delete.description')}
                    itemName={deleteDialog.valueType?.uuid}
                    isLoading={isDeleting}
                />
            </div>
        </AppLayout>
    );
}
