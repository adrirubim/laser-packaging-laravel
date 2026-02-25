import { ActionsDropdown } from '@/components/ActionsDropdown';
import ConfirmDeleteDialog from '@/components/confirm-delete-dialog';
import {
    FlashNotifications,
    useFlashNotifications,
} from '@/components/flash-notifications';
import { IndexHeader } from '@/components/IndexHeader';
import { useTranslations } from '@/hooks/use-translations';
import AppLayout from '@/layouts/app-layout';
import criticalIssues from '@/routes/critical-issues/index';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    AlertTriangle,
    ChevronLeft,
    ChevronRight,
    Loader2,
    Search,
    X,
} from 'lucide-react';
import { useEffect, useState } from 'react';

type CriticalIssue = {
    id: number;
    uuid: string;
    name: string;
};

type CriticalIssuesIndexProps = {
    criticalIssues: {
        data: CriticalIssue[];
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

export default function CriticalIssuesIndex() {
    const { props } = usePage<CriticalIssuesIndexProps>();
    const { criticalIssues: criticalIssuesPaginated, filters } = props;
    const { t } = useTranslations();
    const { flash } = useFlashNotifications();

    const [searchValue, setSearchValue] = useState(filters.search ?? '');
    const [isSearching, setIsSearching] = useState(false);
    const [deleteDialog, setDeleteDialog] = useState<{
        open: boolean;
        criticalIssue: CriticalIssue | null;
    }>({
        open: false,
        criticalIssue: null,
    });
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (searchValue !== (filters.search ?? '')) {
                setIsSearching(true);
                router.get(
                    criticalIssues.index().url,
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

    const clearSearch = () => {
        setSearchValue('');
        router.get(
            criticalIssues.index().url,
            {},
            { preserveState: true, preserveScroll: true },
        );
    };

    const handleDeleteClick = (criticalIssue: CriticalIssue) => {
        setDeleteDialog({ open: true, criticalIssue });
    };

    const handleDeleteConfirm = () => {
        if (!deleteDialog.criticalIssue) return;

        setIsDeleting(true);
        router.delete(
            criticalIssues.destroy({
                criticalIssue: deleteDialog.criticalIssue.uuid,
            }).url,
            {
                preserveScroll: true,
                onSuccess: () => {
                    setDeleteDialog({ open: false, criticalIssue: null });
                    setIsDeleting(false);
                },
                onError: () => {
                    setIsDeleting(false);
                },
            },
        );
    };

    const getPaginationLinks = () => {
        const links = criticalIssuesPaginated.links;
        const prevLink = links.find((link) => link.label.includes('&laquo;'));
        const nextLink = links.find((link) => link.label.includes('&raquo;'));
        const pageLinks = links.filter(
            (link) =>
                !link.label.includes('&laquo;') &&
                !link.label.includes('&raquo;') &&
                link.url !== null,
        );
        return { prevLink, nextLink, pageLinks };
    };

    const { prevLink, nextLink, pageLinks } = getPaginationLinks();

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: t('critical_issues.breadcrumb'),
            href: criticalIssues.index().url,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('critical_issues.title')} />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <IndexHeader
                    title={t('critical_issues.title')}
                    subtitle={t('critical_issues.index.subtitle')}
                    createHref={criticalIssues.create().url}
                    createLabel={t('critical_issues.index.create')}
                />

                <FlashNotifications flash={flash} />

                <div className="flex flex-col gap-3 rounded-xl border border-sidebar-border/70 bg-card p-4 dark:border-sidebar-border">
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
                                        'critical_issues.search_placeholder',
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

                <div className="relative min-h-[300px] flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 bg-card dark:border-sidebar-border">
                    <div className="relative h-full w-full overflow-auto">
                        <div className="block space-y-3 p-4 md:hidden">
                            {criticalIssuesPaginated.data.length === 0 ? (
                                <div className="py-8 text-center text-sm text-muted-foreground">
                                    {t('critical_issues.index.empty_filtered')}
                                </div>
                            ) : (
                                criticalIssuesPaginated.data.map(
                                    (criticalIssue) => (
                                        <div
                                            key={criticalIssue.uuid}
                                            className="space-y-2 rounded-lg border p-4 transition-colors hover:bg-muted/40"
                                        >
                                            <div className="flex items-start justify-between">
                                                <div className="flex flex-1 items-center gap-2">
                                                    <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                                                    <h3 className="font-medium">
                                                        {criticalIssue.name}
                                                    </h3>
                                                </div>
                                                <ActionsDropdown
                                                    viewHref={
                                                        criticalIssues.show({
                                                            criticalIssue:
                                                                criticalIssue.uuid,
                                                        }).url
                                                    }
                                                    editHref={
                                                        criticalIssues.edit({
                                                            criticalIssue:
                                                                criticalIssue.uuid,
                                                        }).url
                                                    }
                                                    onDelete={() =>
                                                        handleDeleteClick(
                                                            criticalIssue,
                                                        )
                                                    }
                                                />
                                            </div>
                                            <div className="font-mono text-xs text-muted-foreground">
                                                UUID: {criticalIssue.uuid}
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
                                        {t('critical_issues.columns.id')}
                                    </th>
                                    <th className="border-b px-3 py-2 font-medium">
                                        {t('critical_issues.columns.uuid')}
                                    </th>
                                    <th className="border-b px-3 py-2 font-medium">
                                        {t('critical_issues.columns.name')}
                                    </th>
                                    <th className="border-b px-3 py-2 text-right font-medium">
                                        {t('common.actions')}
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-sidebar-border">
                                {criticalIssuesPaginated.data.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={4}
                                            className="px-3 py-8 text-center text-sm text-muted-foreground"
                                        >
                                            {t(
                                                'critical_issues.index.empty_filtered',
                                            )}
                                        </td>
                                    </tr>
                                ) : (
                                    criticalIssuesPaginated.data.map(
                                        (criticalIssue) => (
                                            <tr
                                                key={criticalIssue.uuid}
                                                className="transition-colors hover:bg-muted/40"
                                            >
                                                <td className="px-3 py-2 align-middle text-xs">
                                                    {criticalIssue.id}
                                                </td>
                                                <td className="px-3 py-2 align-middle font-mono text-xs">
                                                    {criticalIssue.uuid}
                                                </td>
                                                <td className="px-3 py-2">
                                                    <div className="flex items-center gap-2">
                                                        <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                                                        <span className="font-medium">
                                                            {criticalIssue.name}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-3 py-2 text-right align-middle text-xs">
                                                    <ActionsDropdown
                                                        viewHref={
                                                            criticalIssues.show(
                                                                {
                                                                    criticalIssue:
                                                                        criticalIssue.uuid,
                                                                },
                                                            ).url
                                                        }
                                                        editHref={
                                                            criticalIssues.edit(
                                                                {
                                                                    criticalIssue:
                                                                        criticalIssue.uuid,
                                                                },
                                                            ).url
                                                        }
                                                        onDelete={() =>
                                                            handleDeleteClick(
                                                                criticalIssue,
                                                            )
                                                        }
                                                    />
                                                </td>
                                            </tr>
                                        ),
                                    )
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {criticalIssuesPaginated.last_page > 1 && (
                    <div className="flex items-center justify-between gap-2 rounded-xl border border-sidebar-border/70 bg-card p-4 dark:border-sidebar-border">
                        <div className="text-xs text-muted-foreground">
                            {t('critical_issues.index.pagination_label', {
                                current: criticalIssuesPaginated.current_page,
                                last: criticalIssuesPaginated.last_page,
                            })}
                        </div>
                        <div className="flex items-center gap-2">
                            {prevLink && (
                                <Link
                                    href={prevLink.url || '#'}
                                    className={`inline-flex items-center rounded-md px-3 py-1.5 text-xs font-medium ${
                                        prevLink.url
                                            ? 'bg-background text-foreground hover:bg-muted'
                                            : 'cursor-not-allowed bg-muted text-muted-foreground'
                                    }`}
                                >
                                    <ChevronLeft className="mr-1 h-3 w-3" />
                                    {t('common.previous')}
                                </Link>
                            )}
                            {pageLinks.map((link, index) => (
                                <Link
                                    key={index}
                                    href={link.url || '#'}
                                    className={`inline-flex items-center rounded-md px-3 py-1.5 text-xs font-medium ${
                                        link.active
                                            ? 'bg-primary text-primary-foreground'
                                            : link.url
                                              ? 'bg-background text-foreground hover:bg-muted'
                                              : 'cursor-not-allowed bg-muted text-muted-foreground'
                                    }`}
                                    dangerouslySetInnerHTML={{
                                        __html: link.label,
                                    }}
                                />
                            ))}
                            {nextLink && (
                                <Link
                                    href={nextLink.url || '#'}
                                    className={`inline-flex items-center rounded-md px-3 py-1.5 text-xs font-medium ${
                                        nextLink.url
                                            ? 'bg-background text-foreground hover:bg-muted'
                                            : 'cursor-not-allowed bg-muted text-muted-foreground'
                                    }`}
                                >
                                    {t('common.next')}
                                    <ChevronRight className="ml-1 h-3 w-3" />
                                </Link>
                            )}
                        </div>
                    </div>
                )}

                <ConfirmDeleteDialog
                    open={deleteDialog.open}
                    onOpenChange={(open) =>
                        setDeleteDialog({ open, criticalIssue: null })
                    }
                    onConfirm={handleDeleteConfirm}
                    title={t('critical_issues.delete.title')}
                    description={t('critical_issues.delete.description', {
                        name: deleteDialog.criticalIssue?.name ?? '',
                    })}
                    isLoading={isDeleting}
                />
            </div>
        </AppLayout>
    );
}
