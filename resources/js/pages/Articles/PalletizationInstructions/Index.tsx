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
import { Box, Download } from 'lucide-react';
import { useState } from 'react';

type PalletizationInstruction = {
    id: number;
    uuid: string;
    code: string;
    number?: string | null;
    length_cm?: number | null;
    depth_cm?: number | null;
    height_cm?: number | null;
    volume_dmc?: number | null;
    plan_packaging?: number | null;
    pallet_plans?: number | null;
    qty_pallet?: number | null;
    units_per_neck?: number | null;
    units_pallet?: number | null;
    interlayer_every_floors?: number | null;
    filename?: string | null;
};

type PalletizationInstructionsIndexProps = {
    instructions: {
        data: PalletizationInstruction[];
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

export default function PalletizationInstructionsIndex() {
    const { t } = useTranslations();
    const { props } = usePage<PalletizationInstructionsIndexProps>();
    const { instructions: instructionsPaginated, filters } = props;
    const { flash } = useFlashNotifications();

    const [searchValue, setSearchValue] = useState(filters.search ?? '');
    const [isSearching, setIsSearching] = useState(false);
    const [deleteDialog, setDeleteDialog] = useState<{
        open: boolean;
        instruction: PalletizationInstruction | null;
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
            articles.palletizationInstructions.index().url,
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
            articles.palletizationInstructions.index().url,
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
            articles.palletizationInstructions.index().url,
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

    const handleDeleteClick = (instruction: PalletizationInstruction) => {
        setDeleteDialog({ open: true, instruction });
    };

    const handleDeleteConfirm = () => {
        if (!deleteDialog.instruction) return;

        setIsDeleting(true);
        router.delete(
            articles.palletizationInstructions.destroy({
                palletizationInstruction: deleteDialog.instruction.uuid,
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
            title: t('articles.palletization_instructions.index.title'),
            href: articles.palletizationInstructions.index().url,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head
                title={t('articles.palletization_instructions.index.title')}
            />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <IndexHeader
                    title={t('articles.palletization_instructions.index.title')}
                    subtitle={t(
                        'articles.palletization_instructions.index.subtitle',
                    )}
                    createHref={articles.palletizationInstructions.create().url}
                    createLabel={t(
                        'articles.palletization_instructions.index.create',
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
                                'articles.palletization_instructions.index.search_placeholder',
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
                                            'articles.palletization_instructions.index.empty',
                                        )}
                                    </p>
                                    <Button asChild>
                                        <Link
                                            href={
                                                articles.palletizationInstructions.create()
                                                    .url
                                            }
                                        >
                                            {t(
                                                'articles.palletization_instructions.index.add_first',
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
                                                    <Box className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                                                    <div>
                                                        <h3 className="font-medium">
                                                            {instruction.code}
                                                        </h3>
                                                        {instruction.number && (
                                                            <p className="text-xs text-muted-foreground">
                                                                {t(
                                                                    'articles.palletization_instructions.index.number_label',
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
                                                        articles.palletizationInstructions.show(
                                                            {
                                                                palletizationInstruction:
                                                                    instruction.uuid,
                                                            },
                                                        ).url
                                                    }
                                                    editHref={
                                                        articles.palletizationInstructions.edit(
                                                            {
                                                                palletizationInstruction:
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
                                            <div className="grid grid-cols-2 gap-2 text-xs">
                                                {instruction.filename && (
                                                    <div>
                                                        <span className="text-muted-foreground">
                                                            {t(
                                                                'articles.palletization_instructions.index.attachment_label',
                                                            )}{' '}
                                                        </span>
                                                        <span>
                                                            {
                                                                instruction.filename
                                                            }
                                                        </span>{' '}
                                                        <button
                                                            type="button"
                                                            className="ml-1 text-primary underline-offset-2 hover:underline"
                                                            onClick={() => {
                                                                window.location.href =
                                                                    articles.palletizationInstructions.download(
                                                                        {
                                                                            palletizationInstruction:
                                                                                instruction.uuid,
                                                                        },
                                                                    ).url;
                                                            }}
                                                        >
                                                            {t(
                                                                'articles.palletization_instructions.index.download',
                                                            )}
                                                        </button>
                                                    </div>
                                                )}
                                                {instruction.plan_packaging !==
                                                    null &&
                                                    instruction.plan_packaging !==
                                                        undefined && (
                                                        <div>
                                                            <span className="text-muted-foreground">
                                                                {t(
                                                                    'articles.palletization_instructions.index.colli_piano',
                                                                )}{' '}
                                                            </span>
                                                            <span>
                                                                {
                                                                    instruction.plan_packaging
                                                                }
                                                            </span>
                                                        </div>
                                                    )}
                                            </div>
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
                                            'articles.palletization_instructions.index.columns.id',
                                        )}
                                    </th>
                                    <th className="border-b px-3 py-2 font-medium">
                                        {t(
                                            'articles.palletization_instructions.index.columns.uuid',
                                        )}
                                    </th>
                                    <SortableTableHeader
                                        column="code"
                                        currentSort={filters.sort_by}
                                        currentDirection={filters.sort_order}
                                        onSort={handleSort}
                                    >
                                        {t(
                                            'articles.palletization_instructions.index.columns.code',
                                        )}
                                    </SortableTableHeader>
                                    <SortableTableHeader
                                        column="number"
                                        currentSort={filters.sort_by}
                                        currentDirection={filters.sort_order}
                                        onSort={handleSort}
                                    >
                                        {t(
                                            'articles.palletization_instructions.index.columns.number',
                                        )}
                                    </SortableTableHeader>
                                    <th className="border-b px-3 py-2 font-medium">
                                        {t(
                                            'articles.palletization_instructions.index.columns.length_cm',
                                        )}
                                    </th>
                                    <th className="border-b px-3 py-2 font-medium">
                                        {t(
                                            'articles.palletization_instructions.index.columns.depth_cm',
                                        )}
                                    </th>
                                    <th className="border-b px-3 py-2 font-medium">
                                        {t(
                                            'articles.palletization_instructions.index.columns.height_cm',
                                        )}
                                    </th>
                                    <th className="border-b px-3 py-2 font-medium">
                                        {t(
                                            'articles.palletization_instructions.index.columns.plan_packaging',
                                        )}
                                    </th>
                                    <th className="border-b px-3 py-2 font-medium">
                                        {t(
                                            'articles.palletization_instructions.index.columns.pallet_plans',
                                        )}
                                    </th>
                                    <th className="border-b px-3 py-2 font-medium">
                                        {t(
                                            'articles.palletization_instructions.index.columns.units_per_neck',
                                        )}
                                    </th>
                                    <th className="border-b px-3 py-2 font-medium">
                                        {t(
                                            'articles.palletization_instructions.index.columns.interlayer',
                                        )}
                                    </th>
                                    <SortableTableHeader
                                        column="filename"
                                        currentSort={filters.sort_by}
                                        currentDirection={filters.sort_order}
                                        onSort={handleSort}
                                    >
                                        {t(
                                            'articles.palletization_instructions.index.columns.filename',
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
                                            colSpan={13}
                                            className="px-3 py-8 text-center text-sm text-muted-foreground"
                                        >
                                            <div className="flex flex-col items-center justify-center gap-3">
                                                <p>
                                                    {t(
                                                        'articles.palletization_instructions.index.empty',
                                                    )}
                                                </p>
                                                <Button asChild size="sm">
                                                    <Link
                                                        href={
                                                            articles.palletizationInstructions.create()
                                                                .url
                                                        }
                                                    >
                                                        {t(
                                                            'articles.palletization_instructions.index.add_first',
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
                                                {instruction.code || (
                                                    <span className="text-muted-foreground">
                                                        —
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-3 py-2 align-middle text-xs">
                                                {instruction.number || (
                                                    <span className="text-muted-foreground">
                                                        —
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-3 py-2 align-middle text-xs">
                                                {instruction.length_cm !==
                                                    null &&
                                                instruction.length_cm !==
                                                    undefined ? (
                                                    <span>
                                                        {instruction.length_cm}
                                                    </span>
                                                ) : (
                                                    <span className="text-muted-foreground">
                                                        —
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-3 py-2 align-middle text-xs">
                                                {instruction.depth_cm !==
                                                    null &&
                                                instruction.depth_cm !==
                                                    undefined ? (
                                                    <span>
                                                        {instruction.depth_cm}
                                                    </span>
                                                ) : (
                                                    <span className="text-muted-foreground">
                                                        —
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-3 py-2 align-middle text-xs">
                                                {instruction.height_cm !==
                                                    null &&
                                                instruction.height_cm !==
                                                    undefined ? (
                                                    <span>
                                                        {instruction.height_cm}
                                                    </span>
                                                ) : (
                                                    <span className="text-muted-foreground">
                                                        —
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-3 py-2 align-middle text-xs">
                                                {instruction.plan_packaging !==
                                                    null &&
                                                instruction.plan_packaging !==
                                                    undefined ? (
                                                    <span>
                                                        {
                                                            instruction.plan_packaging
                                                        }
                                                    </span>
                                                ) : (
                                                    <span className="text-muted-foreground">
                                                        —
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-3 py-2 align-middle text-xs">
                                                {instruction.pallet_plans !==
                                                    null &&
                                                instruction.pallet_plans !==
                                                    undefined ? (
                                                    <span>
                                                        {
                                                            instruction.pallet_plans
                                                        }
                                                    </span>
                                                ) : (
                                                    <span className="text-muted-foreground">
                                                        —
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-3 py-2 align-middle text-xs">
                                                {instruction.units_per_neck !==
                                                    null &&
                                                instruction.units_per_neck !==
                                                    undefined ? (
                                                    <span>
                                                        {
                                                            instruction.units_per_neck
                                                        }
                                                    </span>
                                                ) : (
                                                    <span className="text-muted-foreground">
                                                        —
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-3 py-2 align-middle text-xs">
                                                {instruction.interlayer_every_floors !==
                                                    null &&
                                                instruction.interlayer_every_floors !==
                                                    undefined ? (
                                                    <span>
                                                        {
                                                            instruction.interlayer_every_floors
                                                        }
                                                    </span>
                                                ) : (
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
                                                        articles.palletizationInstructions.show(
                                                            {
                                                                palletizationInstruction:
                                                                    instruction.uuid,
                                                            },
                                                        ).url
                                                    }
                                                    editHref={
                                                        articles.palletizationInstructions.edit(
                                                            {
                                                                palletizationInstruction:
                                                                    instruction.uuid,
                                                            },
                                                        ).url
                                                    }
                                                    onDelete={() =>
                                                        handleDeleteClick(
                                                            instruction,
                                                        )
                                                    }
                                                    extraItems={
                                                        instruction.filename ? (
                                                            <DropdownMenuItem
                                                                onSelect={(
                                                                    e,
                                                                ) => {
                                                                    e.preventDefault();
                                                                    window.location.href =
                                                                        articles.palletizationInstructions.download(
                                                                            {
                                                                                palletizationInstruction:
                                                                                    instruction.uuid,
                                                                            },
                                                                        ).url;
                                                                }}
                                                            >
                                                                <Download className="mr-2 h-4 w-4" />
                                                                {t(
                                                                    'articles.palletization_instructions.index.download_attachment',
                                                                )}
                                                            </DropdownMenuItem>
                                                        ) : undefined
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
                    title={t(
                        'articles.palletization_instructions.delete.title',
                    )}
                    description={t(
                        'articles.palletization_instructions.delete.description',
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
