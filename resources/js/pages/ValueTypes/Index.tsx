import ConfirmDeleteDialog from '@/components/confirm-delete-dialog';
import AppLayout from '@/layouts/app-layout';
import valueTypes from '@/routes/value-types';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { Edit, Eye, Loader2, Plus, Search, Trash2, X } from 'lucide-react';
import { useEffect, useState } from 'react';

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
    const { props } = usePage<ValueTypesIndexProps>();
    const { valueTypes: valueTypesPaginated, filters, flash } = props;

    const [searchValue, setSearchValue] = useState(filters.search ?? '');
    const [isSearching, setIsSearching] = useState(false);
    const [showFlash, setShowFlash] = useState(true);
    const [deleteDialog, setDeleteDialog] = useState<{
        open: boolean;
        valueType: ValueType | null;
    }>({
        open: false,
        valueType: null,
    });
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (searchValue !== (filters.search ?? '')) {
                setIsSearching(true);
                router.get(
                    valueTypes.index().url,
                    {
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
        { title: 'Configurazione', href: '#' },
        { title: 'Tipi di Valore', href: valueTypes.index().url },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tipi di Valore" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between gap-3">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">
                            Tipi di Valore
                        </h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Elenco dei tipi di valore attivi con Cerca.
                        </p>
                    </div>
                    <Link
                        href={valueTypes.create().url}
                        className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm hover:bg-primary/90"
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        Nuovo Tipo
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
                                    placeholder="UUID..."
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
                                    <th className="border-b px-3 py-2 text-right font-medium">
                                        Azioni
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
                                            Nessun tipo di valore trovato per i
                                            filtri attuali.
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
                                            <div className="flex items-center justify-end gap-2">
                                                <Link
                                                    href={
                                                        valueTypes.show({
                                                            valueType:
                                                                valueType.uuid,
                                                        }).url
                                                    }
                                                    className="inline-flex items-center text-primary hover:underline"
                                                    title="Visualizza"
                                                >
                                                    <Eye className="h-4 w-4" />
                                                </Link>
                                                <Link
                                                    href={
                                                        valueTypes.edit({
                                                            valueType:
                                                                valueType.uuid,
                                                        }).url
                                                    }
                                                    className="inline-flex items-center text-primary hover:underline"
                                                    title="Modifica"
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </Link>
                                                <button
                                                    onClick={() =>
                                                        handleDeleteClick(
                                                            valueType,
                                                        )
                                                    }
                                                    className="inline-flex items-center text-destructive hover:underline"
                                                    title="Elimina"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {valueTypesPaginated.links.length > 1 && (
                    <div className="flex items-center justify-between gap-3 text-xs text-muted-foreground">
                        <div>
                            Pagina{' '}
                            <strong>{valueTypesPaginated.current_page}</strong>{' '}
                            di <strong>{valueTypesPaginated.last_page}</strong>
                        </div>
                        <div className="flex flex-wrap items-center gap-1">
                            {valueTypesPaginated.links.map((link, index) => {
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
                            valueType: deleteDialog.valueType,
                        })
                    }
                    onConfirm={handleDeleteConfirm}
                    title="Elimina Tipo di Valore"
                    description="Sei sicuro di voler eliminare questo tipo di valore? Questa azione non può essere annullata."
                    itemName={deleteDialog.valueType?.uuid}
                    isLoading={isDeleting}
                />
            </div>
        </AppLayout>
    );
}
