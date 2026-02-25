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
import { Button } from '@/components/ui/button';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { useTranslations } from '@/hooks/use-translations';
import AppLayout from '@/layouts/app-layout';
import articles from '@/routes/articles/index';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { Download } from 'lucide-react';
import { useState } from 'react';

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
    const { t } = useTranslations();
    const { props } = usePage<PalletSheetsIndexProps>();
    const { sheets: sheetsPaginated, filters } = props;
    const { flash } = useFlashNotifications();

    const [deleteDialog, setDeleteDialog] = useState<{
        open: boolean;
        sheet: PalletSheet | null;
    }>({
        open: false,
        sheet: null,
    });
    const [isDeleting, setIsDeleting] = useState(false);

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
            title: t('nav.articles'),
            href: articles.index().url,
        },
        {
            title: t('articles.pallet_sheets.title'),
            href: articles.palletSheets.index().url,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('articles.pallet_sheets.title')} />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <IndexHeader
                    title={t('articles.pallet_sheets.title')}
                    subtitle={t('articles.pallet_sheets.index.subtitle')}
                    createHref={articles.palletSheets.create().url}
                    createLabel={t('articles.pallet_sheets.index.create')}
                />

                <FlashNotifications flash={flash} />

                <div className="flex flex-col gap-3 rounded-xl border border-sidebar-border/70 bg-card p-4 dark:border-sidebar-border">
                    <SearchInput
                        value={filters.search || ''}
                        onChange={handleSearchChange}
                        placeholder={t(
                            'articles.pallet_sheets.search_placeholder',
                        )}
                    />
                </div>

                <div className="relative min-h-[300px] flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 bg-card dark:border-sidebar-border">
                    <div className="relative h-full w-full overflow-auto">
                        <table className="min-w-full border-separate border-spacing-0 text-left text-sm">
                            <thead className="sticky top-0 z-10 bg-muted/80 backdrop-blur">
                                <tr className="text-xs tracking-wide text-muted-foreground uppercase">
                                    <th className="border-b px-3 py-2 font-medium">
                                        {t(
                                            'articles.pallet_sheets.index.columns.id',
                                        )}
                                    </th>
                                    <th className="border-b px-3 py-2 font-medium">
                                        {t(
                                            'articles.pallet_sheets.index.columns.uuid',
                                        )}
                                    </th>
                                    <SortableTableHeader
                                        column="code"
                                        currentSort={filters.sort_by}
                                        currentDirection={filters.sort_order}
                                        onSort={handleSort}
                                    >
                                        {t(
                                            'articles.pallet_sheets.index.columns.code',
                                        )}
                                    </SortableTableHeader>
                                    <SortableTableHeader
                                        column="description"
                                        currentSort={filters.sort_by}
                                        currentDirection={filters.sort_order}
                                        onSort={handleSort}
                                    >
                                        {t(
                                            'articles.pallet_sheets.index.columns.description',
                                        )}
                                    </SortableTableHeader>
                                    <SortableTableHeader
                                        column="filename"
                                        currentSort={filters.sort_by}
                                        currentDirection={filters.sort_order}
                                        onSort={handleSort}
                                    >
                                        {t(
                                            'articles.pallet_sheets.index.columns.filename',
                                        )}
                                    </SortableTableHeader>
                                    <th className="border-b px-3 py-2 text-right font-medium">
                                        {t('common.actions')}
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
                                            <div className="flex flex-col items-center justify-center gap-3">
                                                <p>
                                                    {t(
                                                        'articles.pallet_sheets.index.empty',
                                                    )}
                                                </p>
                                                <Button asChild size="sm">
                                                    <Link
                                                        href={
                                                            articles.palletSheets.create()
                                                                .url
                                                        }
                                                    >
                                                        {t(
                                                            'articles.pallet_sheets.index.add_first',
                                                        )}
                                                    </Link>
                                                </Button>
                                            </div>
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
                                            <ActionsDropdown
                                                viewHref={
                                                    articles.palletSheets.show({
                                                        palletSheet: sheet.uuid,
                                                    }).url
                                                }
                                                editHref={
                                                    articles.palletSheets.edit({
                                                        palletSheet: sheet.uuid,
                                                    }).url
                                                }
                                                onDelete={() =>
                                                    handleDeleteClick(sheet)
                                                }
                                                extraItems={
                                                    sheet.filename ? (
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
                                                            {t(
                                                                'articles.pallet_sheets.index.download_attachment',
                                                            )}
                                                        </DropdownMenuItem>
                                                    ) : undefined
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
                title={t('articles.pallet_sheets.delete.title')}
                description={t('articles.pallet_sheets.delete.description', {
                    code: deleteDialog.sheet?.code ?? '',
                })}
            />
        </AppLayout>
    );
}
