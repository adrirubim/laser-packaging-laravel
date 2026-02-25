import { ActionsDropdown } from '@/components/ActionsDropdown';
import ConfirmDeleteDialog from '@/components/confirm-delete-dialog';
import { FlashNotifications } from '@/components/flash-notifications';
import { IndexHeader } from '@/components/IndexHeader';
import { Pagination } from '@/components/Pagination';
import { SearchInput } from '@/components/SearchInput';
import { Skeleton } from '@/components/ui/skeleton';
import { useTranslations } from '@/hooks/use-translations';
import AppLayout from '@/layouts/app-layout';
import articles from '@/routes/articles/index';
import machineryRoutes from '@/routes/machinery/index';
import { type BreadcrumbItem } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { useState } from 'react';

type ValueType = {
    uuid: string;
    id: number;
};

type Machinery = {
    id: number;
    uuid: string;
    cod: string;
    description: string;
    parameter?: string | null;
    value_type_uuid?: string | null;
    value_type?: ValueType | null;
};

type MachineryIndexProps = {
    machinery: {
        data: Machinery[];
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

export default function MachineryIndex() {
    const { t } = useTranslations();
    const { props } = usePage<MachineryIndexProps>();
    const { machinery: machineryPaginated, filters, flash } = props;

    const [isLoading, setIsLoading] = useState(false);
    const [deleteDialog, setDeleteDialog] = useState<{
        open: boolean;
        machinery: Machinery | null;
    }>({ open: false, machinery: null });
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDeleteClick = (mach: Machinery) => {
        setDeleteDialog({ open: true, machinery: mach });
    };

    const handleDeleteConfirm = () => {
        if (!deleteDialog.machinery) return;
        setIsDeleting(true);
        router.delete(
            machineryRoutes.destroy({
                machinery: deleteDialog.machinery.uuid,
            }).url,
            {
                preserveScroll: true,
                onSuccess: () => {
                    setDeleteDialog({ open: false, machinery: null });
                    setIsDeleting(false);
                },
                onError: () => setIsDeleting(false),
            },
        );
    };

    const handleSearchChange = (value: string) => {
        setIsLoading(true);
        router.get(
            machineryRoutes.index().url,
            {
                search: value || undefined,
            },
            {
                preserveState: true,
                preserveScroll: true,
                onFinish: () => setIsLoading(false),
            },
        );
    };

    const clearSearch = () => {
        setIsLoading(true);
        router.get(
            machineryRoutes.index().url,
            {},
            {
                preserveState: true,
                preserveScroll: true,
                onFinish: () => setIsLoading(false),
            },
        );
    };

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: t('nav.articles'),
            href: articles.index().url,
        },
        {
            title: t('nav.macchinari'),
            href: machineryRoutes.index().url,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('nav.macchinari')} />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <IndexHeader
                    title={t('nav.macchinari')}
                    subtitle={t('machinery.index.subtitle')}
                    createHref={machineryRoutes.create().url}
                    createLabel={t('machinery.index.create')}
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
                            placeholder={t('machinery.search_placeholder')}
                        />
                    </div>
                </div>

                <div className="relative min-h-[300px] flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 bg-card dark:border-sidebar-border">
                    <div className="relative h-full w-full overflow-auto">
                        {/* Vista mobile: cards */}
                        <div className="block space-y-3 p-4 md:hidden">
                            {isLoading && (
                                <>
                                    {Array.from({ length: 3 }).map(
                                        (_, index) => (
                                            <div
                                                key={index}
                                                className="space-y-2 rounded-lg border p-4"
                                            >
                                                <div className="flex items-start justify-between gap-3">
                                                    <div className="flex-1 space-y-2">
                                                        <Skeleton className="h-4 w-40" />
                                                        <Skeleton className="h-3 w-48" />
                                                        <Skeleton className="h-3 w-32" />
                                                    </div>
                                                    <Skeleton className="h-8 w-8 rounded-full" />
                                                </div>
                                            </div>
                                        ),
                                    )}
                                </>
                            )}
                            {!isLoading &&
                                (machineryPaginated.data.length === 0 ? (
                                    <div className="py-8 text-center text-sm text-muted-foreground">
                                        {t('machinery.index.empty_filtered')}
                                    </div>
                                ) : (
                                    machineryPaginated.data.map((mach) => (
                                        <div
                                            key={mach.uuid}
                                            className="space-y-2 rounded-lg border p-4 transition-colors hover:bg-muted/40"
                                        >
                                            <div className="flex items-start justify-between gap-3">
                                                <div className="flex-1">
                                                    <h3 className="font-medium">
                                                        {mach.cod}
                                                        {mach.description
                                                            ? ` - ${mach.description}`
                                                            : ''}
                                                    </h3>
                                                    <p className="mt-1 font-mono text-[11px] text-muted-foreground">
                                                        ID: {mach.id} · UUID:{' '}
                                                        {mach.uuid}
                                                    </p>
                                                    <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                                                        <div>
                                                            <span className="text-muted-foreground">
                                                                {t(
                                                                    'machinery.form.parameter_placeholder',
                                                                )}
                                                                :{' '}
                                                            </span>
                                                            <span>
                                                                {mach.parameter ||
                                                                    '-'}
                                                            </span>
                                                        </div>
                                                        <div>
                                                            <span className="text-muted-foreground">
                                                                {t(
                                                                    'machinery.form.value_type_label',
                                                                )}
                                                                :{' '}
                                                            </span>
                                                            <span>
                                                                {mach.value_type
                                                                    ? `ID: ${mach.value_type.id}`
                                                                    : '-'}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <ActionsDropdown
                                                    viewHref={
                                                        machineryRoutes.show({
                                                            machinery:
                                                                mach.uuid,
                                                        }).url
                                                    }
                                                    editHref={
                                                        machineryRoutes.edit({
                                                            machinery:
                                                                mach.uuid,
                                                        }).url
                                                    }
                                                    onDelete={() =>
                                                        handleDeleteClick(mach)
                                                    }
                                                />
                                            </div>
                                        </div>
                                    ))
                                ))}
                        </div>

                        {/* Vista desktop: tabla */}
                        <div className="hidden md:block">
                            <table className="min-w-full border-separate border-spacing-0 text-left text-sm">
                                <thead className="sticky top-0 z-10 bg-muted/80 backdrop-blur">
                                    <tr className="text-xs tracking-wide text-muted-foreground uppercase">
                                        <th className="border-b px-3 py-2 font-medium">
                                            {t('machinery.index.columns.id')}
                                        </th>
                                        <th className="border-b px-3 py-2 font-medium">
                                            {t('machinery.index.columns.uuid')}
                                        </th>
                                        <th className="border-b px-3 py-2 font-medium">
                                            {t(
                                                'machinery.index.columns.machinery',
                                            )}
                                        </th>
                                        <th className="border-b px-3 py-2 font-medium">
                                            {t(
                                                'machinery.index.columns.parameter',
                                            )}
                                        </th>
                                        <th className="border-b px-3 py-2 font-medium">
                                            {t(
                                                'machinery.index.columns.value_type',
                                            )}
                                        </th>
                                        <th className="border-b px-3 py-2 text-right font-medium">
                                            {t('common.actions')}
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {isLoading && (
                                        <>
                                            {Array.from({ length: 5 }).map(
                                                (_, index) => (
                                                    <tr key={index}>
                                                        <td className="px-3 py-2">
                                                            <Skeleton className="h-3 w-10" />
                                                        </td>
                                                        <td className="px-3 py-2">
                                                            <Skeleton className="h-3 w-32" />
                                                        </td>
                                                        <td className="px-3 py-2">
                                                            <Skeleton className="h-3 w-40" />
                                                        </td>
                                                        <td className="px-3 py-2">
                                                            <Skeleton className="h-3 w-24" />
                                                        </td>
                                                        <td className="px-3 py-2">
                                                            <Skeleton className="h-3 w-24" />
                                                        </td>
                                                        <td className="px-3 py-2 text-right">
                                                            <Skeleton className="ml-auto h-8 w-8 rounded-full" />
                                                        </td>
                                                    </tr>
                                                ),
                                            )}
                                        </>
                                    )}
                                    {!isLoading &&
                                        machineryPaginated.data.length ===
                                            0 && (
                                            <tr>
                                                <td
                                                    colSpan={6}
                                                    className="px-3 py-6 text-center text-sm text-muted-foreground"
                                                >
                                                    {t(
                                                        'machinery.index.empty_filtered',
                                                    )}
                                                </td>
                                            </tr>
                                        )}
                                    {!isLoading &&
                                        machineryPaginated.data.map((mach) => (
                                            <tr
                                                key={mach.uuid}
                                                className="border-b last:border-b-0 hover:bg-muted/40"
                                            >
                                                <td className="px-3 py-2 align-middle text-xs">
                                                    {mach.id}
                                                </td>
                                                <td className="px-3 py-2 align-middle font-mono text-xs">
                                                    {mach.uuid}
                                                </td>
                                                <td className="px-3 py-2 align-middle">
                                                    {mach.cod}{' '}
                                                    {mach.description
                                                        ? ` - ${mach.description}`
                                                        : ''}
                                                </td>
                                                <td className="px-3 py-2 align-middle text-xs">
                                                    {mach.parameter || (
                                                        <span className="text-muted-foreground">
                                                            -
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-3 py-2 align-middle text-xs">
                                                    {mach.value_type ? (
                                                        `ID: ${mach.value_type.id}`
                                                    ) : (
                                                        <span className="text-muted-foreground">
                                                            -
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-3 py-2 text-right align-middle text-xs">
                                                    <ActionsDropdown
                                                        viewHref={
                                                            machineryRoutes.show(
                                                                {
                                                                    machinery:
                                                                        mach.uuid,
                                                                },
                                                            ).url
                                                        }
                                                        editHref={
                                                            machineryRoutes.edit(
                                                                {
                                                                    machinery:
                                                                        mach.uuid,
                                                                },
                                                            ).url
                                                        }
                                                        onDelete={() =>
                                                            handleDeleteClick(
                                                                mach,
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
                </div>

                <Pagination
                    links={machineryPaginated.links}
                    currentPage={machineryPaginated.current_page}
                    lastPage={machineryPaginated.last_page}
                />
            </div>

            <ConfirmDeleteDialog
                open={deleteDialog.open}
                onOpenChange={(open) =>
                    !open && setDeleteDialog({ open: false, machinery: null })
                }
                onConfirm={handleDeleteConfirm}
                isDeleting={isDeleting}
                title={t('machinery.delete.title')}
                description={t('machinery.delete.description')}
            />
        </AppLayout>
    );
}
