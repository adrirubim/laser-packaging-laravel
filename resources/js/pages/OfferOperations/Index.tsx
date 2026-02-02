import ConfirmDeleteDialog from '@/components/confirm-delete-dialog';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import offerOperations from '@/routes/offer-operations';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    Download,
    Edit,
    Eye,
    Loader2,
    MoreHorizontal,
    Plus,
    Search,
    Trash2,
    X,
} from 'lucide-react';
import { useEffect, useState } from 'react';

// Formattare interi (senza decimali)
const formatInteger = (value: number | null | undefined): string => {
    if (value === null || value === undefined || isNaN(value)) {
        return '—';
    }
    return Math.round(value)
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};

type OfferOperation = {
    id: number;
    uuid: string;
    category_uuid?: string;
    codice?: string;
    codice_univoco?: string;
    descrizione?: string;
    secondi_operazione?: number;
    filename?: string;
    category?: {
        name: string;
    };
};

const getFileDisplayName = (path?: string | null): string => {
    if (!path) return '—';
    const base = path.split('/').pop() ?? path;
    const parts = base.split('_');
    return parts.length > 1 ? parts.slice(1).join('_') : base;
};

type OfferOperationCategory = {
    uuid: string;
    name: string;
};

type OfferOperationsIndexProps = {
    operations: {
        data: OfferOperation[];
        current_page: number;
        last_page: number;
        links: { url: string | null; label: string; active: boolean }[];
    };
    categories: OfferOperationCategory[];
    filters: {
        search?: string;
        category_uuid?: string;
    };
    flash?: {
        success?: string;
        error?: string;
    };
};

export default function OfferOperationsIndex() {
    const { props } = usePage<OfferOperationsIndexProps>();
    const {
        operations: operationsPaginated,
        categories,
        filters,
        flash,
    } = props;

    const [searchValue, setSearchValue] = useState(filters.search ?? '');
    const [isSearching, setIsSearching] = useState(false);
    const [showFlash, setShowFlash] = useState(true);
    const [deleteDialog, setDeleteDialog] = useState<{
        open: boolean;
        operation: OfferOperation | null;
    }>({
        open: false,
        operation: null,
    });
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (searchValue !== (filters.search ?? '')) {
                setIsSearching(true);
                router.get(
                    offerOperations.index().url,
                    {
                        ...filters,
                        search: searchValue || undefined,
                    },
                    {
                        preserveState: true,
                        preserveScroll: true,
                        onFinish: () => setIsSearching(false),
                    },
                );
            }
        }, 500);
        return () => clearTimeout(timer);
        // eslint-disable-next-line react-hooks/exhaustive-deps -- debounce: run on searchValue only to avoid loops
    }, [searchValue]);

    useEffect(() => {
        if (flash?.success || flash?.error) {
            queueMicrotask(() => setShowFlash(true));
            const timer = setTimeout(() => setShowFlash(false), 5000);
            return () => clearTimeout(timer);
        }
    }, [flash]);

    const clearSearch = () => {
        setSearchValue('');
        router.get(
            offerOperations.index().url,
            {
                category_uuid: filters.category_uuid,
            },
            { preserveState: true, preserveScroll: true },
        );
    };

    const handleDeleteClick = (operation: OfferOperation) => {
        setDeleteDialog({ open: true, operation });
    };

    const handleDeleteConfirm = () => {
        if (!deleteDialog.operation) return;

        setIsDeleting(true);
        router.delete(
            offerOperations.destroy({
                offerOperation: deleteDialog.operation.uuid,
            }).url,
            {
                preserveScroll: true,
                onSuccess: () => {
                    setDeleteDialog({ open: false, operation: null });
                    setIsDeleting(false);
                },
                onError: () => {
                    setIsDeleting(false);
                },
            },
        );
    };

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Offerte', href: '/offers' },
        { title: 'Operazioni', href: offerOperations.index().url },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Operazioni" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between gap-3">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">
                            Operazioni
                        </h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Elenco delle operazioni attive con Cerca e filtri.
                        </p>
                    </div>
                    <Link
                        href={offerOperations.create().url}
                        className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm hover:bg-primary/90"
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        Nuova Operazione
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

                <div className="flex flex-col gap-3 rounded-xl border border-sidebar-border/70 bg-card p-4">
                    <div className="grid gap-3 md:grid-cols-2">
                        <div className="space-y-1">
                            <label className="text-xs font-medium text-muted-foreground">
                                Cerca
                            </label>
                            <div className="relative flex items-center gap-2">
                                <div className="relative flex-1">
                                    <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-muted-foreground" />
                                    <input
                                        type="text"
                                        value={searchValue}
                                        onChange={(e) =>
                                            setSearchValue(e.target.value)
                                        }
                                        placeholder="Codice, descrizione..."
                                        className="w-full rounded-md border border-input bg-background px-3 py-2 pr-9 pl-9 text-sm shadow-sm focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none"
                                    />
                                    {isSearching && (
                                        <Loader2 className="absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 transform animate-spin text-muted-foreground" />
                                    )}
                                    {searchValue && !isSearching && (
                                        <button
                                            onClick={clearSearch}
                                            className="absolute top-1/2 right-3 -translate-y-1/2 transform transition-opacity hover:opacity-70"
                                        >
                                            <X className="h-4 w-4 text-muted-foreground" />
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>

                        {categories.length > 0 && (
                            <div className="space-y-1">
                                <label className="text-xs font-medium text-muted-foreground">
                                    Categoria
                                </label>
                                <Select
                                    value={
                                        (filters.category_uuid ?? '') || 'all'
                                    }
                                    onValueChange={(value) => {
                                        const next =
                                            value === 'all' ? '' : value;
                                        router.get(
                                            offerOperations.index().url,
                                            {
                                                ...filters,
                                                category_uuid:
                                                    next || undefined,
                                            },
                                            {
                                                preserveState: true,
                                                preserveScroll: true,
                                            },
                                        );
                                    }}
                                >
                                    <SelectTrigger
                                        className="w-full"
                                        aria-label="Categoria"
                                    >
                                        <SelectValue placeholder="Tutte le categorie" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">
                                            Tutte le categorie
                                        </SelectItem>
                                        {categories.map((category) => (
                                            <SelectItem
                                                key={category.uuid}
                                                value={category.uuid}
                                            >
                                                {category.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        )}
                    </div>
                </div>

                <div className="relative min-h-[300px] flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 bg-card">
                    <div className="relative h-full w-full overflow-auto">
                        <table className="min-w-full border-separate border-spacing-0 text-left text-sm">
                            <thead className="sticky top-0 z-10 bg-muted/80 backdrop-blur">
                                <tr className="text-xs tracking-wide text-muted-foreground uppercase">
                                    <th className="border-b px-3 py-2 font-medium">
                                        ID
                                    </th>
                                    <th className="border-b px-3 py-2 font-medium">
                                        uuid
                                    </th>
                                    <th className="border-b px-3 py-2 font-medium">
                                        Categoria
                                    </th>
                                    <th className="border-b px-3 py-2 font-medium">
                                        Codice univoco
                                    </th>
                                    <th className="border-b px-3 py-2 font-medium">
                                        Codice operazione
                                    </th>
                                    <th className="border-b px-3 py-2 font-medium">
                                        Descrizione Operazione
                                    </th>
                                    <th className="border-b px-3 py-2 font-medium">
                                        sec/op.
                                    </th>
                                    <th className="border-b px-3 py-2 font-medium">
                                        Allegato operazione
                                    </th>
                                    <th className="border-b px-3 py-2 text-right font-medium">
                                        Azioni
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {operationsPaginated.data.length === 0 && (
                                    <tr>
                                        <td
                                            colSpan={9}
                                            className="px-3 py-6 text-center text-sm text-muted-foreground"
                                        >
                                            Nessuna operazione trovata per i
                                            filtri attuali.
                                        </td>
                                    </tr>
                                )}
                                {operationsPaginated.data.map((operation) => (
                                    <tr
                                        key={operation.uuid}
                                        className="border-b last:border-b-0 hover:bg-muted/40"
                                    >
                                        <td className="px-3 py-2 align-middle text-xs">
                                            {operation.id}
                                        </td>
                                        <td className="px-3 py-2 align-middle font-mono text-xs">
                                            {operation.uuid}
                                        </td>
                                        <td className="px-3 py-2 align-middle text-xs">
                                            {operation.category?.name ?? '—'}
                                        </td>
                                        <td className="px-3 py-2 align-middle font-mono text-xs">
                                            {operation.codice_univoco ?? '—'}
                                        </td>
                                        <td className="px-3 py-2 align-middle font-mono text-xs">
                                            {operation.codice ?? '—'}
                                        </td>
                                        <td className="px-3 py-2 align-middle font-medium">
                                            {operation.descrizione ?? '—'}
                                        </td>
                                        <td className="px-3 py-2 text-right align-middle font-mono text-xs tabular-nums">
                                            {formatInteger(
                                                operation.secondi_operazione,
                                            )}
                                        </td>
                                        <td className="px-3 py-2 align-middle text-xs">
                                            {getFileDisplayName(
                                                operation.filename,
                                            )}
                                        </td>
                                        <td className="px-3 py-2 text-right align-middle text-xs">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
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
                                                                offerOperations.show(
                                                                    {
                                                                        offerOperation:
                                                                            operation.uuid,
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
                                                                offerOperations.edit(
                                                                    {
                                                                        offerOperation:
                                                                            operation.uuid,
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
                                                            !operation.filename
                                                        }
                                                        onSelect={(e) => {
                                                            e.preventDefault();
                                                            if (
                                                                !operation.filename
                                                            )
                                                                return;
                                                            window.location.href =
                                                                offerOperations.downloadFile(
                                                                    {
                                                                        offerOperation:
                                                                            operation.uuid,
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
                                                                operation,
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
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {operationsPaginated.links.length > 1 && (
                    <div className="flex items-center justify-between gap-3 text-xs text-muted-foreground">
                        <div>
                            Pagina{' '}
                            <strong>{operationsPaginated.current_page}</strong>{' '}
                            di <strong>{operationsPaginated.last_page}</strong>
                        </div>
                        <div className="flex flex-wrap items-center gap-1">
                            {operationsPaginated.links.map((link, index) => {
                                if (
                                    link.label.includes('&laquo;') ||
                                    link.label.includes('&raquo;')
                                ) {
                                    return null;
                                }
                                return (
                                    <Link
                                        key={`${link.label}-${index}`}
                                        href={link.url ?? '#'}
                                        className={`min-w-[2.5rem] rounded-md px-3 py-2 text-center transition-colors ${
                                            link.active
                                                ? 'bg-primary text-primary-foreground'
                                                : 'border border-input hover:bg-muted'
                                        }`}
                                    >
                                        <span
                                            dangerouslySetInnerHTML={{
                                                __html: link.label,
                                            }}
                                        />
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                )}

                <ConfirmDeleteDialog
                    open={deleteDialog.open}
                    onOpenChange={(open) =>
                        setDeleteDialog({
                            open,
                            operation: deleteDialog.operation,
                        })
                    }
                    onConfirm={handleDeleteConfirm}
                    title="Elimina Operazione"
                    description="Sei sicuro di voler eliminare questa operazione? Questa azione non può essere annullata."
                    itemName={
                        deleteDialog.operation?.codice ||
                        deleteDialog.operation?.descrizione
                    }
                    isLoading={isDeleting}
                />
            </div>
        </AppLayout>
    );
}
