import ConfirmDeleteDialog from '@/components/confirm-delete-dialog';
import {
    FlashNotifications,
    useFlashNotifications,
} from '@/components/flash-notifications';
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    getOrderStatusColor,
    getOrderStatusLabelKey,
} from '@/constants/orderStatus';
import { useTranslations } from '@/hooks/use-translations';
import AppLayout from '@/layouts/app-layout';
import orders from '@/routes/orders/index';
import { type BreadcrumbItem } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { Edit, Eye, MoreHorizontal, Trash2 } from 'lucide-react';
import { useState } from 'react';

type Article = {
    uuid: string;
    cod_article_las: string;
    article_descr?: string | null;
};

type Order = {
    uuid: string;
    order_production_number: string;
    number_customer_reference_order?: string | null;
    quantity?: number | string | null;
    worked_quantity?: number | string | null;
    status: number;
    article?: Article | null;
};

type ProductionAdvancementsProps = {
    orders: {
        data: Order[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        from: number;
        to: number;
        links: { url: string | null; label: string; active: boolean }[];
    };
    articles: Article[];
    filters: {
        search?: string;
        article_uuid?: string;
        per_page?: string;
        sort_by?: string;
        sort_order?: 'asc' | 'desc';
    };
    flash?: {
        success?: string;
        error?: string;
    };
};

export default function ProductionAdvancements() {
    const { props } = usePage<ProductionAdvancementsProps>();
    const { orders: ordersPaginated, articles, filters } = props;
    const { flash } = useFlashNotifications();
    const { t } = useTranslations();

    const [searchValue, setSearchValue] = useState(filters.search ?? '');
    const [articleFilter, setArticleFilter] = useState(
        filters.article_uuid ?? '',
    );
    const [isSearching, setIsSearching] = useState(false);
    const [deleteDialog, setDeleteDialog] = useState<{
        open: boolean;
        order: Order | null;
    }>({
        open: false,
        order: null,
    });
    const [isDeleting, setIsDeleting] = useState(false);

    const emptyVal = t('common.empty_value');
    const formatQuantity = (
        value: number | string | null | undefined,
    ): string => {
        if (value === null || value === undefined) {
            return emptyVal;
        }
        const num = typeof value === 'string' ? parseFloat(value) : value;
        if (Number.isNaN(num)) {
            return emptyVal;
        }
        return num.toFixed(2);
    };

    const formatWorkedOverTotal = (
        worked: number | string | null | undefined,
        total: number | string | null | undefined,
    ): string => {
        const workedStr = formatQuantity(
            worked === null || worked === undefined ? 0 : worked,
        );
        const totalStr = formatQuantity(total);
        if (totalStr === emptyVal) {
            return emptyVal;
        }
        return `${workedStr} / ${totalStr}`;
    };

    const handleSort = (column: string) => {
        const currentSort = filters.sort_by;
        const currentDirection = filters.sort_order || 'desc';

        let newDirection: 'asc' | 'desc' = 'asc';
        if (currentSort === column && currentDirection === 'asc') {
            newDirection = 'desc';
        }

        router.get(
            orders.productionAdvancements().url,
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
            orders.productionAdvancements().url,
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
            orders.productionAdvancements().url,
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

    const handleArticleChange = (value: string) => {
        setArticleFilter(value);
        router.get(
            orders.productionAdvancements().url,
            {
                ...filters,
                article_uuid: value || undefined,
            },
            {
                preserveState: true,
                preserveScroll: true,
            },
        );
    };

    const handleDeleteClick = (order: Order) => {
        setDeleteDialog({ open: true, order });
    };

    const handleDeleteConfirm = () => {
        if (!deleteDialog.order) return;

        setIsDeleting(true);
        router.delete(orders.destroy({ order: deleteDialog.order.uuid }).url, {
            preserveScroll: true,
            onSuccess: () => {
                setDeleteDialog({ open: false, order: null });
                setIsDeleting(false);
            },
            onError: () => {
                setIsDeleting(false);
            },
        });
    };

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: t('nav.orders'),
            href: orders.index().url,
        },
        {
            title: t('nav.in_produzione'),
            href: orders.productionAdvancements().url,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('nav.in_produzione')} />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between gap-3">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">
                            {t('nav.in_produzione')}
                        </h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            {t('orders.production_advancements.subtitle')}
                        </p>
                    </div>
                </div>

                <FlashNotifications flash={flash} />

                <div className="flex flex-col gap-3 rounded-xl border border-sidebar-border/70 bg-card p-4 dark:border-sidebar-border">
                    <div className="grid gap-3 md:grid-cols-2">
                        <div className="space-y-1">
                            <label className="text-xs font-medium text-muted-foreground">
                                {t(
                                    'orders.production_advancements.search_label',
                                )}
                            </label>
                            <SearchInput
                                value={searchValue}
                                onChange={handleSearchChange}
                                placeholder={t('orders.search_placeholder')}
                                isLoading={isSearching}
                                onClear={clearSearch}
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-medium text-muted-foreground">
                                {t('common.article')}
                            </label>
                            <Select
                                value={articleFilter || 'all'}
                                onValueChange={(value) =>
                                    handleArticleChange(
                                        value === 'all' ? '' : value,
                                    )
                                }
                            >
                                <SelectTrigger
                                    className="w-full"
                                    aria-label={t(
                                        'orders.production_advancements.aria_article',
                                    )}
                                >
                                    <SelectValue
                                        placeholder={t('filter.all_articles')}
                                    />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">
                                        {t('filter.all_articles')}
                                    </SelectItem>
                                    {articles.map((article) => (
                                        <SelectItem
                                            key={article.uuid}
                                            value={article.uuid}
                                        >
                                            {article.cod_article_las} -{' '}
                                            {article.article_descr ||
                                                t('common.no_description')}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>

                <div className="relative min-h-[300px] flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 bg-card dark:border-sidebar-border">
                    <div className="relative h-full w-full overflow-auto">
                        <div className="block space-y-3 p-4 md:hidden">
                            {ordersPaginated.data.length === 0 ? (
                                <div className="py-8 text-center text-sm text-muted-foreground">
                                    {t('orders.production_advancements.empty')}
                                </div>
                            ) : (
                                ordersPaginated.data.map((order) => (
                                    <div
                                        key={order.uuid}
                                        className="space-y-2 rounded-lg border p-4 transition-colors hover:bg-muted/40"
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <h3 className="font-medium">
                                                    {
                                                        order.order_production_number
                                                    }
                                                </h3>
                                                {order.article && (
                                                    <div className="mt-1 text-sm text-muted-foreground">
                                                        <div className="font-medium">
                                                            {
                                                                order.article
                                                                    .cod_article_las
                                                            }
                                                        </div>
                                                        {order.article
                                                            .article_descr && (
                                                            <div className="text-xs">
                                                                {
                                                                    order
                                                                        .article
                                                                        .article_descr
                                                                }
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                            <span
                                                className={`inline-flex items-center rounded-full border px-2 py-1 text-xs font-medium ${getOrderStatusColor(order.status)}`}
                                            >
                                                {t(
                                                    getOrderStatusLabelKey(
                                                        order.status,
                                                    ),
                                                    {
                                                        status: String(
                                                            order.status,
                                                        ),
                                                    },
                                                )}
                                            </span>
                                        </div>
                                        <div className="grid grid-cols-2 gap-2 text-xs">
                                            <div>
                                                <span className="text-muted-foreground">
                                                    {t('orders.show.quantity')}
                                                    :{' '}
                                                </span>
                                                <span>
                                                    {formatWorkedOverTotal(
                                                        order.worked_quantity,
                                                        order.quantity,
                                                    )}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-end gap-2 border-t pt-2">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8"
                                                        aria-label={t(
                                                            'orders.production_advancements.aria_open_actions',
                                                        )}
                                                    >
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem
                                                        onSelect={(e) => {
                                                            e.preventDefault();
                                                            router.visit(
                                                                orders.show({
                                                                    order: order.uuid,
                                                                }).url,
                                                            );
                                                        }}
                                                    >
                                                        <Eye className="mr-2 h-4 w-4" />
                                                        {t('common.view')}
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        onSelect={(e) => {
                                                            e.preventDefault();
                                                            router.visit(
                                                                orders.edit({
                                                                    order: order.uuid,
                                                                }).url,
                                                            );
                                                        }}
                                                    >
                                                        <Edit className="mr-2 h-4 w-4" />
                                                        {t('common.edit')}
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        variant="destructive"
                                                        onSelect={(e) => {
                                                            e.preventDefault();
                                                            handleDeleteClick(
                                                                order,
                                                            );
                                                        }}
                                                    >
                                                        <Trash2 className="mr-2 h-4 w-4" />
                                                        {t('common.delete')}
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                        <table className="hidden min-w-full border-separate border-spacing-0 text-left text-sm md:table">
                            <thead className="sticky top-0 z-10 bg-muted/80 backdrop-blur">
                                <tr className="text-xs tracking-wide text-muted-foreground uppercase">
                                    <SortableTableHeader
                                        column="order_production_number"
                                        currentSort={filters.sort_by}
                                        currentDirection={filters.sort_order}
                                        onSort={handleSort}
                                    >
                                        {t(
                                            'orders.production_advancements.production_number',
                                        )}
                                    </SortableTableHeader>
                                    <th className="border-b px-3 py-2 font-medium">
                                        {t('common.article')}
                                    </th>
                                    <SortableTableHeader
                                        column="quantity"
                                        currentSort={filters.sort_by}
                                        currentDirection={filters.sort_order}
                                        onSort={handleSort}
                                    >
                                        {t('orders.show.quantity')}
                                    </SortableTableHeader>
                                    <SortableTableHeader
                                        column="status"
                                        currentSort={filters.sort_by}
                                        currentDirection={filters.sort_order}
                                        onSort={handleSort}
                                    >
                                        {t('common.status')}
                                    </SortableTableHeader>
                                    <th className="border-b px-3 py-2 text-right font-medium">
                                        {t(
                                            'orders.production_advancements.actions',
                                        )}
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {ordersPaginated.data.length === 0 && (
                                    <tr>
                                        <td
                                            colSpan={5}
                                            className="px-3 py-8 text-center text-sm text-muted-foreground"
                                        >
                                            {t(
                                                'orders.production_advancements.no_orders',
                                            )}
                                        </td>
                                    </tr>
                                )}
                                {ordersPaginated.data.map((order) => (
                                    <tr
                                        key={order.uuid}
                                        className="border-b border-sidebar-border/70 last:border-b-0 hover:bg-muted/50 dark:border-sidebar-border"
                                    >
                                        <td className="px-3 py-2 align-middle font-medium">
                                            {order.order_production_number}
                                        </td>
                                        <td className="px-3 py-2 align-middle">
                                            {order.article ? (
                                                <div>
                                                    <div className="font-medium">
                                                        {
                                                            order.article
                                                                .cod_article_las
                                                        }
                                                    </div>
                                                    {order.article
                                                        .article_descr && (
                                                        <div className="text-xs text-muted-foreground">
                                                            {
                                                                order.article
                                                                    .article_descr
                                                            }
                                                        </div>
                                                    )}
                                                </div>
                                            ) : (
                                                <span className="text-muted-foreground">
                                                    {emptyVal}
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-3 py-2 align-middle">
                                            {formatWorkedOverTotal(
                                                order.worked_quantity,
                                                order.quantity,
                                            ) === emptyVal ? (
                                                <span className="text-muted-foreground">
                                                    {emptyVal}
                                                </span>
                                            ) : (
                                                formatWorkedOverTotal(
                                                    order.worked_quantity,
                                                    order.quantity,
                                                )
                                            )}
                                        </td>
                                        <td className="px-3 py-2 align-middle">
                                            <span
                                                className={`inline-flex items-center rounded-full border px-2 py-1 text-xs font-medium ${getOrderStatusColor(order.status)}`}
                                            >
                                                {t(
                                                    getOrderStatusLabelKey(
                                                        order.status,
                                                    ),
                                                    {
                                                        status: String(
                                                            order.status,
                                                        ),
                                                    },
                                                )}
                                            </span>
                                        </td>
                                        <td className="px-3 py-2 text-right align-middle">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8"
                                                        aria-label={t(
                                                            'orders.production_advancements.aria_open_actions',
                                                        )}
                                                    >
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem
                                                        onSelect={(e) => {
                                                            e.preventDefault();
                                                            router.visit(
                                                                orders.show({
                                                                    order: order.uuid,
                                                                }).url,
                                                            );
                                                        }}
                                                    >
                                                        <Eye className="mr-2 h-4 w-4" />
                                                        {t('common.view')}
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        onSelect={(e) => {
                                                            e.preventDefault();
                                                            router.visit(
                                                                orders.edit({
                                                                    order: order.uuid,
                                                                }).url,
                                                            );
                                                        }}
                                                    >
                                                        <Edit className="mr-2 h-4 w-4" />
                                                        {t('common.edit')}
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        variant="destructive"
                                                        onSelect={(e) => {
                                                            e.preventDefault();
                                                            handleDeleteClick(
                                                                order,
                                                            );
                                                        }}
                                                    >
                                                        <Trash2 className="mr-2 h-4 w-4" />
                                                        {t('common.delete')}
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

                <Pagination
                    links={ordersPaginated.links}
                    currentPage={ordersPaginated.current_page}
                    lastPage={ordersPaginated.last_page}
                    totalItems={ordersPaginated.total}
                />

                <ConfirmDeleteDialog
                    open={deleteDialog.open}
                    onOpenChange={(open) =>
                        setDeleteDialog({ open, order: deleteDialog.order })
                    }
                    onConfirm={handleDeleteConfirm}
                    isLoading={isDeleting}
                    title={t(
                        'orders.production_advancements.dialog_confirm_delete',
                    )}
                    description={t(
                        'orders.production_advancements.dialog_confirm_description',
                    )}
                    itemName={deleteDialog.order?.order_production_number}
                />
            </div>
        </AppLayout>
    );
}
