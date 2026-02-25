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
import { Download, Package } from 'lucide-react';
import { useState } from 'react';

type PackagingInstruction = {
    id: number;
    uuid: string;
    code: string;
    number?: string | null;
    filename?: string | null;
};

type PackagingInstructionsIndexProps = {
    instructions: {
        data: PackagingInstruction[];
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

export default function PackagingInstructionsIndex() {
    const { props } = usePage<PackagingInstructionsIndexProps>();
    const { instructions: instructionsPaginated, filters } = props;
    const { flash } = useFlashNotifications();
    const { t } = useTranslations();

    const [searchValue, setSearchValue] = useState(filters.search ?? '');
    const [isSearching, setIsSearching] = useState(false);
    const [deleteDialog, setDeleteDialog] = useState<{
        open: boolean;
        instruction: PackagingInstruction | null;
    }>({
        open: false,
        instruction: null,
    });
    const [isDeleting, setIsDeleting] = useState(false);

    const handleSort = (column: string) => {
        const currentSort = filters.sort_by;
        const currentDirection = filters.sort_order || 'asc';

        let newDirection: 'asc' | 'desc' = 'asc';
        if (currentSort === column && currentDirection === 'asc') {
            newDirection = 'desc';
        }

        router.get(
            articles.packagingInstructions.index().url,
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

    const handleSearchChange = (value: string) => {
        setSearchValue(value);
        setIsSearching(true);
        router.get(
            articles.packagingInstructions.index().url,
            {
                ...filters,
                search: value || undefined,
            },
            {
                preserveState: true,
                preserveScroll: true,
                onFinish: () => setIsSearching(false),
            },
        );
    };

    const clearSearch = () => {
        setSearchValue('');
        router.get(
            articles.packagingInstructions.index().url,
            {
                ...filters,
                search: undefined,
            },
            {
                preserveState: true,
                preserveScroll: true,
            },
        );
    };

    const handleDeleteClick = (instruction: PackagingInstruction) => {
        setDeleteDialog({ open: true, instruction });
    };

    const handleDeleteConfirm = () => {
        if (!deleteDialog.instruction) return;

        setIsDeleting(true);
        router.delete(
            articles.packagingInstructions.destroy({
                packagingInstruction: deleteDialog.instruction.uuid,
            }).url,
            {
                preserveScroll: true,
                onSuccess: () => {
                    setDeleteDialog({ open: false, instruction: null });
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
            title: t('nav.istruzioni_confezionamento'),
            href: articles.packagingInstructions.index().url,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('articles.packaging_instructions.index.title')} />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <IndexHeader
                    title={t('articles.packaging_instructions.index.title')}
                    subtitle={t(
                        'articles.packaging_instructions.index.subtitle',
                    )}
                    createHref={articles.packagingInstructions.create().url}
                    createLabel={t(
                        'articles.packaging_instructions.index.create',
                    )}
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
                                'articles.packaging_instructions.index.search_placeholder',
                            )}
                            isLoading={isSearching}
                            onClear={clearSearch}
                        />
                    </div>
                </div>

                <div className="relative min-h-[300px] flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 bg-card dark:border-sidebar-border">
                    <div className="relative h-full w-full overflow-auto">
                        <div className="block space-y-3 p-4 md:hidden">
                            {instructionsPaginated.data.length === 0 ? (
                                <div className="flex flex-col items-center justify-center gap-4 py-12 text-center">
                                    <p className="text-sm text-muted-foreground">
                                        {t(
                                            'articles.packaging_instructions.index.empty',
                                        )}
                                    </p>
                                    <Button asChild>
                                        <Link
                                            href={
                                                articles.packagingInstructions.create()
                                                    .url
                                            }
                                        >
                                            {t('common.new')}
                                        </Link>
                                    </Button>
                                </div>
                            ) : (
                                instructionsPaginated.data.map(
                                    (instruction) => (
                                        <div
                                            key={instruction.uuid}
                                            className="space-y-2 rounded-lg border p-4 transition-colors hover:bg-muted/40"
                                        >
                                            <div className="flex items-start justify-between">
                                                <div className="flex flex-1 items-center gap-2">
                                                    <Package className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                                    <div>
                                                        <h3 className="font-medium">
                                                            {instruction.code}
                                                        </h3>
                                                        {instruction.number && (
                                                            <p className="text-xs text-muted-foreground">
                                                                {t(
                                                                    'articles.packaging_instructions.index.number_label',
                                                                )}{' '}
                                                                {
                                                                    instruction.number
                                                                }
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                                <ActionsDropdown
                                                    viewHref={
                                                        articles.packagingInstructions.show(
                                                            {
                                                                packagingInstruction:
                                                                    instruction.uuid,
                                                            },
                                                        ).url
                                                    }
                                                    editHref={
                                                        articles.packagingInstructions.edit(
                                                            {
                                                                packagingInstruction:
                                                                    instruction.uuid,
                                                            },
                                                        ).url
                                                    }
                                                    onDelete={() =>
                                                        handleDeleteClick(
                                                            instruction,
                                                        )
                                                    }
                                                />
                                            </div>
                                            {instruction.filename && (
                                                <div className="text-xs text-muted-foreground">
                                                    {t(
                                                        'articles.packaging_instructions.index.attachment_label',
                                                    )}{' '}
                                                    {instruction.filename}{' '}
                                                    <button
                                                        type="button"
                                                        className="ml-1 text-primary underline-offset-2 hover:underline"
                                                        onClick={() => {
                                                            window.location.href =
                                                                articles.packagingInstructions.download(
                                                                    {
                                                                        packagingInstruction:
                                                                            instruction.uuid,
                                                                    },
                                                                ).url;
                                                        }}
                                                    >
                                                        {t(
                                                            'articles.packaging_instructions.index.download',
                                                        )}
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    ),
                                )
                            )}
                        </div>
                        <table className="hidden min-w-full border-separate border-spacing-0 text-left text-sm md:table">
                            <thead className="sticky top-0 z-10 bg-muted/80 backdrop-blur">
                                <tr className="text-xs tracking-wide text-muted-foreground uppercase">
                                    <th className="border-b px-3 py-2 font-medium">
                                        {t(
                                            'articles.packaging_instructions.index.columns.id',
                                        )}
                                    </th>
                                    <th className="border-b px-3 py-2 font-medium">
                                        {t(
                                            'articles.packaging_instructions.index.columns.uuid',
                                        )}
                                    </th>
                                    <SortableTableHeader
                                        column="code"
                                        currentSort={filters.sort_by}
                                        currentDirection={filters.sort_order}
                                        onSort={handleSort}
                                    >
                                        {t('common.code')}
                                    </SortableTableHeader>
                                    <SortableTableHeader
                                        column="number"
                                        currentSort={filters.sort_by}
                                        currentDirection={filters.sort_order}
                                        onSort={handleSort}
                                    >
                                        {t(
                                            'articles.packaging_instructions.index.columns.number',
                                        )}
                                    </SortableTableHeader>
                                    <SortableTableHeader
                                        column="filename"
                                        currentSort={filters.sort_by}
                                        currentDirection={filters.sort_order}
                                        onSort={handleSort}
                                    >
                                        {t(
                                            'articles.packaging_instructions.index.columns.filename',
                                        )}
                                    </SortableTableHeader>
                                    <th className="border-b px-3 py-2 text-right font-medium">
                                        {t('common.actions')}
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {instructionsPaginated.data.length === 0 && (
                                    <tr>
                                        <td
                                            colSpan={6}
                                            className="px-3 py-8 text-center text-sm text-muted-foreground"
                                        >
                                            <div className="flex flex-col items-center justify-center gap-3">
                                                <p>
                                                    {t(
                                                        'articles.packaging_instructions.index.empty',
                                                    )}
                                                </p>
                                                <Button asChild size="sm">
                                                    <Link
                                                        href={
                                                            articles.packagingInstructions.create()
                                                                .url
                                                        }
                                                    >
                                                        {t(
                                                            'articles.packaging_instructions.index.create',
                                                        )}
                                                    </Link>
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                                {instructionsPaginated.data.map(
                                    (instruction) => (
                                        <tr
                                            key={instruction.uuid}
                                            className="border-b border-sidebar-border/70 last:border-b-0 hover:bg-muted/50 dark:border-sidebar-border"
                                        >
                                            <td className="px-3 py-2 align-middle text-xs">
                                                {instruction.id}
                                            </td>
                                            <td className="px-3 py-2 align-middle font-mono text-xs">
                                                {instruction.uuid}
                                            </td>
                                            <td className="px-3 py-2 align-middle font-medium">
                                                {instruction.code}
                                            </td>
                                            <td className="px-3 py-2 align-middle">
                                                {instruction.number || (
                                                    <span className="text-muted-foreground">
                                                        —
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-3 py-2 align-middle text-xs">
                                                {instruction.filename || (
                                                    <span className="text-muted-foreground">
                                                        —
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-3 py-2 text-right align-middle text-xs">
                                                <ActionsDropdown
                                                    viewHref={
                                                        articles.packagingInstructions.show(
                                                            {
                                                                packagingInstruction:
                                                                    instruction.uuid,
                                                            },
                                                        ).url
                                                    }
                                                    editHref={
                                                        articles.packagingInstructions.edit(
                                                            {
                                                                packagingInstruction:
                                                                    instruction.uuid,
                                                            },
                                                        ).url
                                                    }
                                                    extraItems={
                                                        <DropdownMenuItem
                                                            onSelect={(e) => {
                                                                e.preventDefault();
                                                                window.location.href =
                                                                    articles.packagingInstructions.download(
                                                                        {
                                                                            packagingInstruction:
                                                                                instruction.uuid,
                                                                        },
                                                                    ).url;
                                                            }}
                                                        >
                                                            <Download className="mr-2 h-4 w-4" />
                                                            {t(
                                                                'articles.packaging_instructions.index.download',
                                                            )}
                                                        </DropdownMenuItem>
                                                    }
                                                    onDelete={() =>
                                                        handleDeleteClick(
                                                            instruction,
                                                        )
                                                    }
                                                />
                                            </td>
                                        </tr>
                                    ),
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                <Pagination
                    links={instructionsPaginated.links}
                    currentPage={instructionsPaginated.current_page}
                    lastPage={instructionsPaginated.last_page}
                    totalItems={instructionsPaginated.data.length}
                />

                <ConfirmDeleteDialog
                    open={deleteDialog.open}
                    onOpenChange={(open) =>
                        !open &&
                        setDeleteDialog({ open: false, instruction: null })
                    }
                    onConfirm={handleDeleteConfirm}
                    isLoading={isDeleting}
                    title={t('common.confirm_delete')}
                    description={t(
                        'articles.packaging_instructions.delete.description',
                    )}
                    itemName={
                        deleteDialog.instruction
                            ? deleteDialog.instruction.code +
                              (deleteDialog.instruction.number ?? '')
                            : undefined
                    }
                />
            </div>
        </AppLayout>
    );
}
