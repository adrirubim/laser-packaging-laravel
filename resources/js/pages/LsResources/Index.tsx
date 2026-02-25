import { ActionsDropdown } from '@/components/ActionsDropdown';
import ConfirmDeleteDialog from '@/components/confirm-delete-dialog';
import {
    FlashNotifications,
    useFlashNotifications,
} from '@/components/flash-notifications';
import { IndexHeader } from '@/components/IndexHeader';
import { Pagination } from '@/components/Pagination';
import { useTranslations } from '@/hooks/use-translations';
import AppLayout from '@/layouts/app-layout';
import lsResources from '@/routes/ls-resources';
import offers from '@/routes/offers';
import { type BreadcrumbItem } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { Loader2, Search, X } from 'lucide-react';
import { useEffect, useState } from 'react';

type LsResource = {
    id: number;
    uuid: string;
    code: string;
    name: string;
};

type LsResourcesIndexProps = {
    resources: {
        data: LsResource[];
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

export default function LsResourcesIndex() {
    const { t } = useTranslations();
    const { props } = usePage<LsResourcesIndexProps>();
    const { resources: resourcesPaginated, filters } = props;
    const { flash } = useFlashNotifications();

    const [searchValue, setSearchValue] = useState(filters.search ?? '');
    const [isSearching, setIsSearching] = useState(false);
    const [deleteDialog, setDeleteDialog] = useState<{
        open: boolean;
        resource: LsResource | null;
    }>({
        open: false,
        resource: null,
    });
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (searchValue !== (filters.search ?? '')) {
                setIsSearching(true);
                router.get(
                    lsResources.index().url,
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
            lsResources.index().url,
            {},
            { preserveState: true, preserveScroll: true },
        );
    };

    const handleDeleteClick = (resource: LsResource) => {
        setDeleteDialog({ open: true, resource });
    };

    const handleDeleteConfirm = () => {
        if (!deleteDialog.resource) return;

        setIsDeleting(true);
        router.delete(
            lsResources.destroy({ lsResource: deleteDialog.resource.uuid }).url,
            {
                preserveScroll: true,
                onSuccess: () => {
                    setDeleteDialog({ open: false, resource: null });
                    setIsDeleting(false);
                },
                onError: () => {
                    setIsDeleting(false);
                },
            },
        );
    };

    const breadcrumbs: BreadcrumbItem[] = [
        { title: t('nav.offers'), href: offers.index().url },
        {
            title: t('offer_ls_resources.page_title'),
            href: lsResources.index().url,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('offer_ls_resources.page_title')} />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <IndexHeader
                    title={t('offer_ls_resources.page_title')}
                    subtitle={t('offer_ls_resources.index.subtitle')}
                    createHref={lsResources.create().url}
                    createLabel={t('offer_ls_resources.index.create')}
                />

                <FlashNotifications flash={flash} />

                <div className="flex flex-col gap-3 rounded-xl border border-sidebar-border/70 bg-card p-4">
                    <div className="space-y-1">
                        <label className="text-xs font-medium text-muted-foreground">
                            {t('common.search')}
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
                                    placeholder={t(
                                        'offer_ls_resources.search_placeholder',
                                    )}
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
                                        {t('common.code')}
                                    </th>
                                    <th className="border-b px-3 py-2 font-medium">
                                        {t(
                                            'offer_ls_resources.form.name_label',
                                        )}
                                    </th>
                                    <th className="border-b px-3 py-2 text-right font-medium">
                                        {t('common.actions')}
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {resourcesPaginated.data.length === 0 && (
                                    <tr>
                                        <td
                                            colSpan={5}
                                            className="px-3 py-6 text-center text-sm text-muted-foreground"
                                        >
                                            {t(
                                                'offer_ls_resources.index.empty',
                                            )}
                                        </td>
                                    </tr>
                                )}
                                {resourcesPaginated.data.map((resource) => (
                                    <tr
                                        key={resource.uuid}
                                        className="border-b last:border-b-0 hover:bg-muted/40"
                                    >
                                        <td className="px-3 py-2 align-middle text-xs">
                                            {resource.id}
                                        </td>
                                        <td className="px-3 py-2 align-middle font-mono text-xs">
                                            {resource.uuid}
                                        </td>
                                        <td className="px-3 py-2 align-middle font-mono text-xs">
                                            {resource.code}
                                        </td>
                                        <td className="px-3 py-2 align-middle font-medium">
                                            {resource.name}
                                        </td>
                                        <td className="px-3 py-2 text-right align-middle text-xs">
                                            <ActionsDropdown
                                                viewHref={
                                                    lsResources.show({
                                                        lsResource:
                                                            resource.uuid,
                                                    }).url
                                                }
                                                editHref={
                                                    lsResources.edit({
                                                        lsResource:
                                                            resource.uuid,
                                                    }).url
                                                }
                                                onDelete={() =>
                                                    handleDeleteClick(resource)
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
                    links={resourcesPaginated.links}
                    currentPage={resourcesPaginated.current_page}
                    lastPage={resourcesPaginated.last_page}
                />

                <ConfirmDeleteDialog
                    open={deleteDialog.open}
                    onOpenChange={(open) =>
                        setDeleteDialog({
                            open,
                            resource: deleteDialog.resource,
                        })
                    }
                    onConfirm={handleDeleteConfirm}
                    title={t('offer_ls_resources.delete.title')}
                    description={t('offer_ls_resources.delete.description', {
                        name: deleteDialog.resource?.name ?? '',
                        code: deleteDialog.resource?.code ?? '',
                    })}
                    itemName={
                        deleteDialog.resource?.name ||
                        deleteDialog.resource?.code
                    }
                    isLoading={isDeleting}
                />
            </div>
        </AppLayout>
    );
}
