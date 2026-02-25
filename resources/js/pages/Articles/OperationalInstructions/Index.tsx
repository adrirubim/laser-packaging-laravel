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
import { Download, FileText } from 'lucide-react';
import { useState } from 'react';

type OperationalInstruction = {
    id: number;
    uuid: string;
    code: string;
    number?: string | null;
    filename?: string | null;
};

type OperationalInstructionsIndexProps = {
    instructions: {
        data: OperationalInstruction[];
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

export default function OperationalInstructionsIndex() {
    const { props } = usePage<OperationalInstructionsIndexProps>();
    const { instructions: instructionsPaginated, filters } = props;
    const { flash } = useFlashNotifications();
    const { t } = useTranslations();

    const [searchValue, setSearchValue] = useState(filters.search ?? '');
    const [isSearching, setIsSearching] = useState(false);
    const [deleteDialog, setDeleteDialog] = useState<{
        open: boolean;
        instruction: OperationalInstruction | null;
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
            articles.operationalInstructions.index().url,
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
            articles.operationalInstructions.index().url,
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
            articles.operationalInstructions.index().url,
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

    const handleDeleteClick = (instruction: OperationalInstruction) => {
        setDeleteDialog({ open: true, instruction });
    };

    const handleDeleteConfirm = () => {
        if (!deleteDialog.instruction) return;

        setIsDeleting(true);
        router.delete(
            articles.operationalInstructions.destroy({
                operationalInstruction: deleteDialog.instruction.uuid,
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
            title: t('nav.istruzioni_operative'),
            href: articles.operationalInstructions.index().url,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('operational_instructions.index.head_title')} />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <IndexHeader
                    title={t('operational_instructions.index.title')}
                    subtitle={t('operational_instructions.index.subtitle')}
                    createHref={articles.operationalInstructions.create().url}
                    createLabel={t(
                        'operational_instructions.index.create_label',
                    )}
                />

                <FlashNotifications flash={flash} />

                <div className="flex flex-col gap-3 rounded-xl border border-sidebar-border/70 bg-card p-4 dark:border-sidebar-border">
                    <div className="space-y-1">
                        <label className="text-xs font-medium text-muted-foreground">
                            {t('operational_instructions.index.search_label')}
                        </label>
                        <SearchInput
                            value={searchValue}
                            onChange={handleSearchChange}
                            placeholder={t(
                                'operational_instructions.index.search_placeholder',
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
                                            'operational_instructions.index.empty',
                                        )}
                                    </p>
                                    <Button asChild>
                                        <Link
                                            href={
                                                articles.operationalInstructions.create()
                                                    .url
                                            }
                                        >
                                            {t(
                                                'operational_instructions.index.add',
                                            )}
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
                                                    <FileText className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                                                    <div>
                                                        <h3 className="font-medium">
                                                            {instruction.code}
                                                        </h3>
                                                        {instruction.number && (
                                                            <p className="text-xs text-muted-foreground">
                                                                {t(
                                                                    'operational_instructions.index.th_number',
                                                                )}
                                                                :{' '}
                                                                {
                                                                    instruction.number
                                                                }
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                                <ActionsDropdown
                                                    viewHref={
                                                        articles.operationalInstructions.show(
                                                            {
                                                                operationalInstruction:
                                                                    instruction.uuid,
                                                            },
                                                        ).url
                                                    }
                                                    editHref={
                                                        articles.operationalInstructions.edit(
                                                            {
                                                                operationalInstruction:
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
                                                        'operational_instructions.index.attachment_prefix',
                                                    )}{' '}
                                                    {instruction.filename}{' '}
                                                    <button
                                                        type="button"
                                                        className="ml-1 text-primary underline-offset-2 hover:underline"
                                                        onClick={() => {
                                                            window.location.href =
                                                                articles.operationalInstructions.download(
                                                                    {
                                                                        operationalInstruction:
                                                                            instruction.uuid,
                                                                    },
                                                                ).url;
                                                        }}
                                                        aria-label={t(
                                                            'operational_instructions.index.download',
                                                        )}
                                                    >
                                                        {t(
                                                            'operational_instructions.index.download',
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
                                            'operational_instructions.index.th_id',
                                        )}
                                    </th>
                                    <th className="border-b px-3 py-2 font-medium">
                                        {t(
                                            'operational_instructions.index.th_uuid',
                                        )}
                                    </th>
                                    <SortableTableHeader
                                        column="code"
                                        currentSort={filters.sort_by}
                                        currentDirection={filters.sort_order}
                                        onSort={handleSort}
                                    >
                                        {t(
                                            'operational_instructions.index.th_code',
                                        )}
                                    </SortableTableHeader>
                                    <SortableTableHeader
                                        column="number"
                                        currentSort={filters.sort_by}
                                        currentDirection={filters.sort_order}
                                        onSort={handleSort}
                                    >
                                        {t(
                                            'operational_instructions.index.th_number',
                                        )}
                                    </SortableTableHeader>
                                    <SortableTableHeader
                                        column="filename"
                                        currentSort={filters.sort_by}
                                        currentDirection={filters.sort_order}
                                        onSort={handleSort}
                                    >
                                        {t(
                                            'operational_instructions.index.th_filename',
                                        )}
                                    </SortableTableHeader>
                                    <th className="border-b px-3 py-2 text-right font-medium">
                                        {t(
                                            'operational_instructions.index.th_actions',
                                        )}
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
                                                        'operational_instructions.index.empty',
                                                    )}
                                                </p>
                                                <Button asChild size="sm">
                                                    <Link
                                                        href={
                                                            articles.operationalInstructions.create()
                                                                .url
                                                        }
                                                    >
                                                        {t(
                                                            'operational_instructions.index.add',
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
                                                        articles.operationalInstructions.show(
                                                            {
                                                                operationalInstruction:
                                                                    instruction.uuid,
                                                            },
                                                        ).url
                                                    }
                                                    editHref={
                                                        articles.operationalInstructions.edit(
                                                            {
                                                                operationalInstruction:
                                                                    instruction.uuid,
                                                            },
                                                        ).url
                                                    }
                                                    extraItems={
                                                        <DropdownMenuItem
                                                            onSelect={(e) => {
                                                                e.preventDefault();
                                                                window.location.href =
                                                                    articles.operationalInstructions.download(
                                                                        {
                                                                            operationalInstruction:
                                                                                instruction.uuid,
                                                                        },
                                                                    ).url;
                                                            }}
                                                        >
                                                            <Download className="mr-2 h-4 w-4" />
                                                            {t(
                                                                'operational_instructions.index.download',
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
                        setDeleteDialog({
                            open,
                            instruction: deleteDialog.instruction,
                        })
                    }
                    onConfirm={handleDeleteConfirm}
                    isLoading={isDeleting}
                    title={t('operational_instructions.delete_confirm_title')}
                    description={t(
                        'operational_instructions.delete_confirm_description',
                    )}
                    itemName={deleteDialog.instruction?.code}
                />
            </div>
        </AppLayout>
    );
}
