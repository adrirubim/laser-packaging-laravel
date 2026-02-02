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
    Download,
    Edit,
    Eye,
    MoreHorizontal,
    Package,
    Plus,
    Trash2,
    X,
} from 'lucide-react';
import { useEffect, useState } from 'react';

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
    const { instructions: instructionsPaginated, filters, flash } = props;

    const [searchValue, setSearchValue] = useState(filters.search ?? '');
    const [isSearching, setIsSearching] = useState(false);
    const [showFlash, setShowFlash] = useState(true);
    const [deleteDialog, setDeleteDialog] = useState<{
        open: boolean;
        instruction: PackagingInstruction | null;
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
            title: 'Articoli',
            href: articles.index().url,
        },
        {
            title: 'Istruzioni di Confezionamento',
            href: articles.packagingInstructions.index().url,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Istruzioni di Confezionamento" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between gap-3">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">
                            Istruzioni di Confezionamento
                        </h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Elenco delle istruzioni di confezionamento attive
                            con Cerca e filtri.
                        </p>
                    </div>
                    <Link
                        href={articles.packagingInstructions.create().url}
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
                                                    <Package className="h-4 w-4 text-blue-600 dark:text-blue-400" />
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
                                                                    articles.packagingInstructions.show(
                                                                        {
                                                                            packagingInstruction:
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
                                                                    articles.packagingInstructions.edit(
                                                                        {
                                                                            packagingInstruction:
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
                                            {instruction.filename && (
                                                <div className="text-xs text-muted-foreground">
                                                    Allegato:{' '}
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
                                                        Scarica
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
                                            colSpan={6}
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
                                                                    articles.packagingInstructions.show(
                                                                        {
                                                                            packagingInstruction:
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
                                                                    articles.packagingInstructions.edit(
                                                                        {
                                                                            packagingInstruction:
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
                                                                    articles.packagingInstructions.download(
                                                                        {
                                                                            packagingInstruction:
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
