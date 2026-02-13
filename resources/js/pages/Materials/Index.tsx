import { ActionsDropdown } from '@/components/ActionsDropdown';
import ConfirmDeleteDialog from '@/components/confirm-delete-dialog';
import { FlashNotifications } from '@/components/flash-notifications';
import { IndexHeader } from '@/components/IndexHeader';
import { Pagination } from '@/components/Pagination';
import { SearchInput } from '@/components/SearchInput';
import { Skeleton } from '@/components/ui/skeleton';
import AppLayout from '@/layouts/app-layout';
import materials from '@/routes/materials/index';
import { type BreadcrumbItem } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { useState } from 'react';

type Material = {
    id: number;
    uuid: string;
    cod: string;
    description: string;
};

type MaterialsIndexProps = {
    materials: {
        data: Material[];
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

export default function MaterialsIndex() {
    const { props } = usePage<MaterialsIndexProps>();
    const { materials: materialsPaginated, filters, flash } = props;

    const [isLoading, setIsLoading] = useState(false);
    const [deleteDialog, setDeleteDialog] = useState<{
        open: boolean;
        material: Material | null;
    }>({ open: false, material: null });
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDeleteClick = (material: Material) => {
        setDeleteDialog({ open: true, material });
    };

    const handleDeleteConfirm = () => {
        if (!deleteDialog.material) return;
        setIsDeleting(true);
        router.delete(
            materials.destroy({ material: deleteDialog.material.uuid }).url,
            {
                preserveScroll: true,
                onSuccess: () => {
                    setDeleteDialog({ open: false, material: null });
                    setIsDeleting(false);
                },
                onError: () => setIsDeleting(false),
            },
        );
    };

    const handleSearchChange = (value: string) => {
        setIsLoading(true);
        router.get(
            materials.index().url,
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
            materials.index().url,
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
            title: 'Materiali',
            href: materials.index().url,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Materiali" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <IndexHeader
                    title="Materiali"
                    subtitle="Elenco dei materiali attivi con Cerca."
                    createHref={materials.create().url}
                    createLabel="Nuovo materiale"
                />

                <FlashNotifications flash={flash} />

                <div className="flex flex-col gap-3 rounded-xl border border-sidebar-border/70 bg-card p-4 dark:border-sidebar-border">
                    <div className="space-y-1">
                        <label className="text-xs font-medium text-muted-foreground">
                            Cerca
                        </label>
                        <SearchInput
                            value={filters.search || ''}
                            onChange={handleSearchChange}
                            onClear={clearSearch}
                            placeholder="Codice o descrizione..."
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
                                                        <Skeleton className="h-4 w-32" />
                                                        <Skeleton className="h-3 w-40" />
                                                        <Skeleton className="h-3 w-48" />
                                                    </div>
                                                    <Skeleton className="h-8 w-8 rounded-full" />
                                                </div>
                                            </div>
                                        ),
                                    )}
                                </>
                            )}
                            {!isLoading &&
                                (materialsPaginated.data.length === 0 ? (
                                    <div className="py-8 text-center text-sm text-muted-foreground">
                                        Nessun materiale trovato per i filtri
                                        attuali.
                                    </div>
                                ) : (
                                    materialsPaginated.data.map((material) => (
                                        <div
                                            key={material.uuid}
                                            className="space-y-2 rounded-lg border p-4 transition-colors hover:bg-muted/40"
                                        >
                                            <div className="flex items-start justify-between gap-3">
                                                <div className="flex-1">
                                                    <h3 className="font-medium">
                                                        {material.cod}
                                                    </h3>
                                                    <p className="mt-1 text-sm text-muted-foreground">
                                                        {material.description}
                                                    </p>
                                                    <p className="mt-1 font-mono text-[11px] text-muted-foreground">
                                                        ID: {material.id} ·
                                                        UUID: {material.uuid}
                                                    </p>
                                                </div>
                                                <ActionsDropdown
                                                    viewHref={
                                                        materials.show({
                                                            material:
                                                                material.uuid,
                                                        }).url
                                                    }
                                                    editHref={
                                                        materials.edit({
                                                            material:
                                                                material.uuid,
                                                        }).url
                                                    }
                                                    onDelete={() =>
                                                        handleDeleteClick(
                                                            material,
                                                        )
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
                                            ID
                                        </th>
                                        <th className="border-b px-3 py-2 font-medium">
                                            uuid
                                        </th>
                                        <th className="border-b px-3 py-2 font-medium">
                                            Codice
                                        </th>
                                        <th className="border-b px-3 py-2 font-medium">
                                            Descrizione
                                        </th>
                                        <th className="border-b px-3 py-2 text-right font-medium">
                                            Azioni
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
                                                            <Skeleton className="h-3 w-24" />
                                                        </td>
                                                        <td className="px-3 py-2">
                                                            <Skeleton className="h-3 w-40" />
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
                                        materialsPaginated.data.length ===
                                            0 && (
                                            <tr>
                                                <td
                                                    colSpan={5}
                                                    className="px-3 py-6 text-center text-sm text-muted-foreground"
                                                >
                                                    Nessun materiale trovato per
                                                    i filtri attuali.
                                                </td>
                                            </tr>
                                        )}
                                    {!isLoading &&
                                        materialsPaginated.data.map(
                                            (material) => (
                                                <tr
                                                    key={material.uuid}
                                                    className="border-b last:border-b-0 hover:bg-muted/40"
                                                >
                                                    <td className="px-3 py-2 align-middle text-xs">
                                                        {material.id}
                                                    </td>
                                                    <td className="px-3 py-2 align-middle font-mono text-xs">
                                                        {material.uuid}
                                                    </td>
                                                    <td className="px-3 py-2 align-middle font-mono text-xs">
                                                        {material.cod}
                                                    </td>
                                                    <td className="px-3 py-2 align-middle font-medium">
                                                        {material.description}
                                                    </td>
                                                    <td className="px-3 py-2 text-right align-middle text-xs">
                                                        <ActionsDropdown
                                                            viewHref={
                                                                materials.show({
                                                                    material:
                                                                        material.uuid,
                                                                }).url
                                                            }
                                                            editHref={
                                                                materials.edit({
                                                                    material:
                                                                        material.uuid,
                                                                }).url
                                                            }
                                                            onDelete={() =>
                                                                handleDeleteClick(
                                                                    material,
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
                </div>

                <Pagination
                    links={materialsPaginated.links}
                    currentPage={materialsPaginated.current_page}
                    lastPage={materialsPaginated.last_page}
                />
            </div>

            <ConfirmDeleteDialog
                open={deleteDialog.open}
                onOpenChange={(open) =>
                    !open && setDeleteDialog({ open: false, material: null })
                }
                onConfirm={handleDeleteConfirm}
                isDeleting={isDeleting}
                title="Elimina Materiale"
                description="Sei sicuro di voler eliminare questo materiale? L'operazione non può essere annullata."
            />
        </AppLayout>
    );
}
