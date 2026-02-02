import ConfirmDeleteDialog from '@/components/confirm-delete-dialog';
import { Pagination } from '@/components/Pagination';
import { SearchInput } from '@/components/SearchInput';
import { SortableTableHeader } from '@/components/SortableTableHeader';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import AppLayout from '@/layouts/app-layout';
import articles from '@/routes/articles';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    Box,
    Download,
    Edit,
    Eye,
    MoreHorizontal,
    Plus,
    Trash2,
    X,
} from 'lucide-react';
import { useEffect, useState } from 'react';

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
    const { props } = usePage<PalletizationInstructionsIndexProps>();
    const { instructions: instructionsPaginated, filters, flash } = props;

    const [searchValue, setSearchValue] = useState(filters.search ?? '');
    const [isSearching, setIsSearching] = useState(false);
    const [showFlash, setShowFlash] = useState(true);
    const [deleteDialog, setDeleteDialog] = useState<{
        open: boolean;
        instruction: PalletizationInstruction | null;
    }>({
        open: false,
        instruction: null,
    });
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        if (flash?.success || flash?.error) {
            queueMicrotask(() => setShowFlash(true));
            const timer = setTimeout(() => setShowFlash(false), 5000);
            return () => clearTimeout(timer);
        }
    }, [flash]);

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
            title: 'Articoli',
            href: articles.index().url,
        },
        {
            title: 'Istruzioni di Pallettizzazione',
            href: articles.palletizationInstructions.index().url,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Istruzioni di Pallettizzazione" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between gap-3">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">
                            Istruzioni di Pallettizzazione
                        </h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Elenco delle istruzioni di pallettizzazione attive
                            con Cerca e filtri.
                        </p>
                    </div>
                    <Link
                        href={articles.palletizationInstructions.create().url}
                        className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm hover:bg-primary/90"
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        Nuova Istruzione
                    </Link>
                </div>

                {showFlash && flash?.success && (
                    <div className="flex animate-in items-center justify-between rounded-md border border-emerald-500/40 bg-emerald-500/5 px-3 py-2 text-sm text-emerald-700 duration-300 fade-in slide-in-from-top-2 dark:text-emerald-300">
                        <span>{flash.success}</span>
                        <button
                            onClick={() => setShowFlash(false)}
                            className="ml-2 transition-opacity hover:opacity-70"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                )}
                {showFlash && flash?.error && (
                    <div className="flex animate-in items-center justify-between rounded-md border border-rose-500/40 bg-rose-500/5 px-3 py-2 text-sm text-rose-700 duration-300 fade-in slide-in-from-top-2 dark:text-rose-300">
                        <span>{flash.error}</span>
                        <button
                            onClick={() => setShowFlash(false)}
                            className="ml-2 transition-opacity hover:opacity-70"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                )}

                <div className="flex flex-col gap-3 rounded-xl border border-sidebar-border/70 bg-card p-4 dark:border-sidebar-border">
                    <div className="space-y-1">
                        <label className="text-xs font-medium text-muted-foreground">
                            Cerca
                        </label>
                        <SearchInput
                            value={searchValue}
                            onChange={handleSearchChange}
                            placeholder="Codice, numero o nome allegato..."
                            isLoading={isSearching}
                            onClear={clearSearch}
                        />
                    </div>
                </div>

                <div className="relative min-h-[300px] flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 bg-card dark:border-sidebar-border">
                    <div className="relative h-full w-full overflow-auto">
                        <div className="block space-y-3 p-4 md:hidden">
                            {instructionsPaginated.data.length === 0 ? (
                                <div className="py-8 text-center text-sm text-muted-foreground">
                                    Nessuna istruzione trovata per i filtri
                                    attuali.
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
                                                                Numero:{' '}
                                                                {
                                                                    instruction.number
                                                                }
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger
                                                        asChild
                                                    >
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8"
                                                            aria-label="Apri menu azioni"
                                                        >
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem
                                                            onSelect={(e) => {
                                                                e.preventDefault();
                                                                router.visit(
                                                                    articles.palletizationInstructions.show(
                                                                        {
                                                                            palletizationInstruction:
                                                                                instruction.uuid,
                                                                        },
                                                                    ).url,
                                                                );
                                                            }}
                                                        >
                                                            <Eye className="mr-2 h-4 w-4" />
                                                            Visualizza
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            onSelect={(e) => {
                                                                e.preventDefault();
                                                                router.visit(
                                                                    articles.palletizationInstructions.edit(
                                                                        {
                                                                            palletizationInstruction:
                                                                                instruction.uuid,
                                                                        },
                                                                    ).url,
                                                                );
                                                            }}
                                                        >
                                                            <Edit className="mr-2 h-4 w-4" />
                                                            Modifica
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            variant="destructive"
                                                            onSelect={(e) => {
                                                                e.preventDefault();
                                                                handleDeleteClick(
                                                                    instruction,
                                                                );
                                                            }}
                                                        >
                                                            <Trash2 className="mr-2 h-4 w-4" />
                                                            Elimina
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>
                                            <div className="grid grid-cols-2 gap-2 text-xs">
                                                {instruction.filename && (
                                                    <div>
                                                        <span className="text-muted-foreground">
                                                            Allegato:{' '}
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
                                                            Scarica
                                                        </button>
                                                    </div>
                                                )}
                                                {instruction.plan_packaging !==
                                                    null &&
                                                    instruction.plan_packaging !==
                                                        undefined && (
                                                        <div>
                                                            <span className="text-muted-foreground">
                                                                Colli/piano:{' '}
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
                                        ID
                                    </th>
                                    <th className="border-b px-3 py-2 font-medium">
                                        UUID
                                    </th>
                                    <SortableTableHeader
                                        column="code"
                                        currentSort={filters.sort_by}
                                        currentDirection={filters.sort_order}
                                        onSort={handleSort}
                                    >
                                        Codice
                                    </SortableTableHeader>
                                    <SortableTableHeader
                                        column="number"
                                        currentSort={filters.sort_by}
                                        currentDirection={filters.sort_order}
                                        onSort={handleSort}
                                    >
                                        Numero
                                    </SortableTableHeader>
                                    <th className="border-b px-3 py-2 font-medium">
                                        Larghezza collo
                                    </th>
                                    <th className="border-b px-3 py-2 font-medium">
                                        Profondità collo
                                    </th>
                                    <th className="border-b px-3 py-2 font-medium">
                                        Altezza collo
                                    </th>
                                    <th className="border-b px-3 py-2 font-medium">
                                        Colli per piano
                                    </th>
                                    <th className="border-b px-3 py-2 font-medium">
                                        Piani per pallet
                                    </th>
                                    <th className="border-b px-3 py-2 font-medium">
                                        Unità per collo
                                    </th>
                                    <th className="border-b px-3 py-2 font-medium">
                                        Interfalda ogni
                                    </th>
                                    <SortableTableHeader
                                        column="filename"
                                        currentSort={filters.sort_by}
                                        currentDirection={filters.sort_order}
                                        onSort={handleSort}
                                    >
                                        Filename
                                    </SortableTableHeader>
                                    <th className="border-b px-3 py-2 text-right font-medium">
                                        Azioni
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
                                            Nessuna istruzione trovata per i
                                            filtri attuali.
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
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger
                                                        asChild
                                                    >
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8"
                                                            aria-label="Apri menu azioni"
                                                        >
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem
                                                            onSelect={(e) => {
                                                                e.preventDefault();
                                                                router.visit(
                                                                    articles.palletizationInstructions.show(
                                                                        {
                                                                            palletizationInstruction:
                                                                                instruction.uuid,
                                                                        },
                                                                    ).url,
                                                                );
                                                            }}
                                                        >
                                                            <Eye className="mr-2 h-4 w-4" />
                                                            Visualizza
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            onSelect={(e) => {
                                                                e.preventDefault();
                                                                router.visit(
                                                                    articles.palletizationInstructions.edit(
                                                                        {
                                                                            palletizationInstruction:
                                                                                instruction.uuid,
                                                                        },
                                                                    ).url,
                                                                );
                                                            }}
                                                        >
                                                            <Edit className="mr-2 h-4 w-4" />
                                                            Modifica
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            disabled={
                                                                !instruction.filename
                                                            }
                                                            onSelect={(e) => {
                                                                e.preventDefault();
                                                                if (
                                                                    !instruction.filename
                                                                )
                                                                    return;
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
                                                            Scarica allegato
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            variant="destructive"
                                                            onSelect={(e) => {
                                                                e.preventDefault();
                                                                handleDeleteClick(
                                                                    instruction,
                                                                );
                                                            }}
                                                        >
                                                            <Trash2 className="mr-2 h-4 w-4" />
                                                            Elimina
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
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
                    title="Conferma eliminazione"
                    description={`Sei sicuro di voler eliminare l'istruzione? Questa azione non può essere annullata. L'istruzione verrà eliminata definitivamente.`}
                    itemName={deleteDialog.instruction?.code}
                />
            </div>
        </AppLayout>
    );
}
