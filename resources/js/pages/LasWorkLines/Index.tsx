import { ActionsDropdown } from '@/components/ActionsDropdown';
import ConfirmDeleteDialog from '@/components/confirm-delete-dialog';
import {
    FlashNotifications,
    useFlashNotifications,
} from '@/components/flash-notifications';
import { IndexHeader } from '@/components/IndexHeader';
import { Pagination } from '@/components/Pagination';
import AppLayout from '@/layouts/app-layout';
import lasWorkLines from '@/routes/las-work-lines';
import { type BreadcrumbItem } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { Loader2, Search, X } from 'lucide-react';
import { useEffect, useState } from 'react';

type LasWorkLine = {
    id: number;
    uuid: string;
    code: string;
    name: string;
};

type LasWorkLinesIndexProps = {
    workLines: {
        data: LasWorkLine[];
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

export default function LasWorkLinesIndex() {
    const { props } = usePage<LasWorkLinesIndexProps>();
    const { workLines: workLinesPaginated, filters } = props;
    const { flash } = useFlashNotifications();

    const [searchValue, setSearchValue] = useState(filters.search ?? '');
    const [isSearching, setIsSearching] = useState(false);
    const [deleteDialog, setDeleteDialog] = useState<{
        open: boolean;
        workLine: LasWorkLine | null;
    }>({
        open: false,
        workLine: null,
    });
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (searchValue !== (filters.search ?? '')) {
                setIsSearching(true);
                router.get(
                    lasWorkLines.index().url,
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

    const clearSearch = () => {
        setSearchValue('');
        router.get(
            lasWorkLines.index().url,
            {},
            { preserveState: true, preserveScroll: true },
        );
    };

    const handleDeleteClick = (workLine: LasWorkLine) => {
        setDeleteDialog({ open: true, workLine });
    };

    const handleDeleteConfirm = () => {
        if (!deleteDialog.workLine) return;

        setIsDeleting(true);
        router.delete(
            lasWorkLines.destroy({ lasWorkLine: deleteDialog.workLine.uuid })
                .url,
            {
                preserveScroll: true,
                onSuccess: () => {
                    setDeleteDialog({ open: false, workLine: null });
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
        { title: 'LAS Linee di Lavoro', href: lasWorkLines.index().url },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="LAS Linee di Lavoro" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <IndexHeader
                    title="LAS Linee di Lavoro"
                    subtitle="Elenco delle linee di lavoro LAS attive con Cerca."
                    createHref={lasWorkLines.create().url}
                    createLabel="Nuova Linea di Lavoro"
                />

                <FlashNotifications flash={flash} />

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
                                    placeholder="Codice o nome..."
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
                                    <th className="border-b px-3 py-2 font-medium">
                                        Codice
                                    </th>
                                    <th className="border-b px-3 py-2 font-medium">
                                        Nome
                                    </th>
                                    <th className="border-b px-3 py-2 text-right font-medium">
                                        Azioni
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {workLinesPaginated.data.length === 0 && (
                                    <tr>
                                        <td
                                            colSpan={5}
                                            className="px-3 py-6 text-center text-sm text-muted-foreground"
                                        >
                                            Nessuna linea di lavoro trovata per
                                            i filtri attuali.
                                        </td>
                                    </tr>
                                )}
                                {workLinesPaginated.data.map((workLine) => (
                                    <tr
                                        key={workLine.uuid}
                                        className="border-b last:border-b-0 hover:bg-muted/40"
                                    >
                                        <td className="px-3 py-2 align-middle text-xs">
                                            {workLine.id}
                                        </td>
                                        <td className="px-3 py-2 align-middle font-mono text-xs">
                                            {workLine.uuid}
                                        </td>
                                        <td className="px-3 py-2 align-middle font-mono text-xs">
                                            {workLine.code}
                                        </td>
                                        <td className="px-3 py-2 align-middle font-medium">
                                            {workLine.name}
                                        </td>
                                        <td className="px-3 py-2 text-right align-middle text-xs">
                                            <ActionsDropdown
                                                viewHref={
                                                    lasWorkLines.show({
                                                        lasWorkLine:
                                                            workLine.uuid,
                                                    }).url
                                                }
                                                editHref={
                                                    lasWorkLines.edit({
                                                        lasWorkLine:
                                                            workLine.uuid,
                                                    }).url
                                                }
                                                onDelete={() =>
                                                    handleDeleteClick(workLine)
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
                    links={workLinesPaginated.links}
                    currentPage={workLinesPaginated.current_page}
                    lastPage={workLinesPaginated.last_page}
                />

                <ConfirmDeleteDialog
                    open={deleteDialog.open}
                    onOpenChange={(open) =>
                        setDeleteDialog({
                            open,
                            workLine: deleteDialog.workLine,
                        })
                    }
                    onConfirm={handleDeleteConfirm}
                    title="Elimina Linea di Lavoro LAS"
                    description="Sei sicuro di voler eliminare questa linea di lavoro LAS? Questa azione non può essere annullata."
                    itemName={deleteDialog.workLine?.name}
                    isLoading={isDeleting}
                />
            </div>
        </AppLayout>
    );
}
