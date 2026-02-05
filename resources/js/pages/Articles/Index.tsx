import ConfirmDeleteDialog from '@/components/confirm-delete-dialog';
import { FlashNotifications } from '@/components/flash-notifications';
import { IndexHeader } from '@/components/IndexHeader';
import { Pagination } from '@/components/Pagination';
import { SearchInput } from '@/components/SearchInput';
import { SortableTableHeader } from '@/components/SortableTableHeader';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
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
import articles from '@/routes/articles/index';
import offers from '@/routes/offers/index';
import orders from '@/routes/orders/index';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    AlertCircle,
    Box,
    CheckCircle2,
    Copy,
    Edit,
    Eye,
    FileCheck,
    FilePlus,
    FileText,
    Layers,
    MoreHorizontal,
    Package,
    ShoppingCart,
    Trash2,
} from 'lucide-react';
import { useEffect, useState } from 'react';

type Offer = {
    uuid: string;
    offer_number: string;
    description?: string | null;
};

type Category = {
    uuid: string;
    name: string;
};

type Article = {
    id: number;
    uuid: string;
    cod_article_las: string;
    article_descr?: string | null;
    cod_article_client?: string | null;
    additional_descr?: string | null;
    check_approval?: number | string | null;
    offer?: Offer | null;
    category?: Category | null;
};

type ArticlesIndexProps = {
    articles: {
        data: Article[];
        current_page: number;
        last_page: number;
        links: { url: string | null; label: string; active: boolean }[];
    };
    offers: Offer[];
    categories: Category[];
    filters: {
        search?: string;
        offer_uuid?: string;
        article_category?: string;
        sort_by?: string;
        sort_order?: 'asc' | 'desc';
    };
    flash?: {
        success?: string;
        error?: string;
    };
};

export default function ArticlesIndex() {
    const { props } = usePage<ArticlesIndexProps>();
    const {
        articles: articlesPaginated,
        offers: offersList,
        categories,
        filters,
        flash,
    } = props;

    const [searchValue, setSearchValue] = useState(filters.search ?? '');
    const [offerFilter, setOfferFilter] = useState(filters.offer_uuid ?? '');
    const [categoryFilter, setCategoryFilter] = useState(
        filters.article_category ?? '',
    );
    const [isSearching, setIsSearching] = useState(false);
    const [deleteDialog, setDeleteDialog] = useState<{
        open: boolean;
        article: Article | null;
    }>({
        open: false,
        article: null,
    });
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        queueMicrotask(() => {
            setOfferFilter(filters.offer_uuid ?? '');
            setCategoryFilter(filters.article_category ?? '');
        });
    }, [filters.offer_uuid, filters.article_category]);

    const handleSort = (column: string) => {
        const currentSort = filters.sort_by;
        const currentDirection = filters.sort_order || 'desc';

        let newDirection: 'asc' | 'desc' = 'asc';
        if (currentSort === column && currentDirection === 'asc') {
            newDirection = 'desc';
        }

        router.get(
            articles.index().url,
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
            articles.index().url,
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
            articles.index().url,
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

    const handleOfferChange = (value: string) => {
        const next = value === 'all' ? '' : value;
        setOfferFilter(next);
        router.get(
            articles.index().url,
            {
                ...filters,
                offer_uuid: next || undefined,
            },
            { preserveState: true, preserveScroll: true },
        );
    };

    const handleCategoryChange = (value: string) => {
        const next = value === 'all' ? '' : value;
        setCategoryFilter(next);
        router.get(
            articles.index().url,
            {
                ...filters,
                article_category: next || undefined,
            },
            { preserveState: true, preserveScroll: true },
        );
    };

    const handleDeleteClick = (article: Article) => {
        setDeleteDialog({ open: true, article });
    };

    const handleDeleteConfirm = () => {
        if (!deleteDialog.article) return;

        setIsDeleting(true);
        router.delete(
            articles.destroy({ article: deleteDialog.article.uuid }).url,
            {
                preserveScroll: true,
                onSuccess: () => {
                    setDeleteDialog({ open: false, article: null });
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
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Articoli" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <IndexHeader
                    title="Articoli"
                    subtitle="Elenco degli articoli attivi con Cerca e filtri."
                    createHref={articles.create().url}
                    createLabel="Nuovo Articolo"
                />

                <FlashNotifications flash={flash} />

                {/* Quick Access Cards to Sub-sections */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
                    <Link
                        href={articles.packagingInstructions.index().url}
                        className="group block"
                    >
                        <Card className="h-full cursor-pointer border-l-4 border-l-blue-500 transition-all hover:scale-[1.02] hover:border-primary/50 hover:shadow-lg">
                            <CardHeader className="pb-3">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10 transition-colors group-hover:bg-blue-500/20">
                                        <Package className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <CardTitle className="text-sm font-semibold">
                                        Istruzioni di Confezionamento
                                    </CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <CardDescription className="text-xs">
                                    Gestisci le istruzioni di confezionamento
                                    (IC)
                                </CardDescription>
                            </CardContent>
                        </Card>
                    </Link>

                    <Link
                        href={articles.operationalInstructions.index().url}
                        className="group block"
                    >
                        <Card className="h-full cursor-pointer border-l-4 border-l-purple-500 transition-all hover:scale-[1.02] hover:border-primary/50 hover:shadow-lg">
                            <CardHeader className="pb-3">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/10 transition-colors group-hover:bg-purple-500/20">
                                        <FileText className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                                    </div>
                                    <CardTitle className="text-sm font-semibold">
                                        Istruzioni Operative
                                    </CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <CardDescription className="text-xs">
                                    Gestisci le istruzioni operative (IO)
                                </CardDescription>
                            </CardContent>
                        </Card>
                    </Link>

                    <Link
                        href={articles.palletizationInstructions.index().url}
                        className="group block"
                    >
                        <Card className="h-full cursor-pointer border-l-4 border-l-orange-500 transition-all hover:scale-[1.02] hover:border-primary/50 hover:shadow-lg">
                            <CardHeader className="pb-3">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500/10 transition-colors group-hover:bg-orange-500/20">
                                        <Box className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                                    </div>
                                    <CardTitle className="text-sm font-semibold">
                                        Istruzioni di Pallettizzazione
                                    </CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <CardDescription className="text-xs">
                                    Gestisci le istruzioni di pallettizzazione
                                    (IP)
                                </CardDescription>
                            </CardContent>
                        </Card>
                    </Link>

                    <Link
                        href={articles.cqModels.index().url}
                        className="group block"
                    >
                        <Card className="h-full cursor-pointer border-l-4 border-l-emerald-500 transition-all hover:scale-[1.02] hover:border-primary/50 hover:shadow-lg">
                            <CardHeader className="pb-3">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10 transition-colors group-hover:bg-emerald-500/20">
                                        <FileCheck className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                                    </div>
                                    <CardTitle className="text-sm font-semibold">
                                        Modelli CQ
                                    </CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <CardDescription className="text-xs">
                                    Gestisci i modelli di controllo qualità
                                    (CQU)
                                </CardDescription>
                            </CardContent>
                        </Card>
                    </Link>

                    <Link
                        href={articles.palletSheets.index().url}
                        className="group block"
                    >
                        <Card className="h-full cursor-pointer border-l-4 border-l-slate-500 transition-all hover:scale-[1.02] hover:border-primary/50 hover:shadow-lg">
                            <CardHeader className="pb-3">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-500/10 transition-colors group-hover:bg-slate-500/20">
                                        <Layers className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                                    </div>
                                    <CardTitle className="text-sm font-semibold">
                                        Fogli Pallet
                                    </CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <CardDescription className="text-xs">
                                    Gestisci i fogli pallet
                                </CardDescription>
                            </CardContent>
                        </Card>
                    </Link>
                </div>

                <div className="flex flex-col gap-3 rounded-xl border border-sidebar-border/70 bg-card p-4 dark:border-sidebar-border">
                    <div className="grid gap-3 md:grid-cols-3">
                        <div className="space-y-1">
                            <label className="text-xs font-medium text-muted-foreground">
                                Cerca
                            </label>
                            <SearchInput
                                value={searchValue}
                                onChange={handleSearchChange}
                                placeholder="Codice LAS, descrizione o codice cliente..."
                                isLoading={isSearching}
                                onClear={clearSearch}
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-medium text-muted-foreground">
                                Offerta
                            </label>
                            <Select
                                value={offerFilter || 'all'}
                                onValueChange={handleOfferChange}
                            >
                                <SelectTrigger
                                    className="w-full"
                                    aria-label="Offerta"
                                >
                                    <SelectValue placeholder="Tutte le offerte" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">
                                        Tutte le offerte
                                    </SelectItem>
                                    {offersList.map((offer) => (
                                        <SelectItem
                                            key={offer.uuid}
                                            value={offer.uuid}
                                        >
                                            {offer.offer_number} -{' '}
                                            {offer.description ||
                                                'Senza descrizione'}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-medium text-muted-foreground">
                                Categoria
                            </label>
                            <Select
                                value={categoryFilter || 'all'}
                                onValueChange={handleCategoryChange}
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
                    </div>
                </div>

                <div className="relative min-h-[300px] flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 bg-card dark:border-sidebar-border">
                    <div className="relative h-full w-full overflow-auto">
                        <div className="block space-y-3 p-4 md:hidden">
                            {articlesPaginated.data.length === 0 ? (
                                <div className="py-8 text-center text-sm text-muted-foreground">
                                    Nessun articolo trovato per i filtri
                                    attuali.
                                </div>
                            ) : (
                                articlesPaginated.data.map((article) => (
                                    <div
                                        key={article.uuid}
                                        className="space-y-2 rounded-lg border p-4 transition-colors hover:bg-muted/40"
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <h3 className="font-medium">
                                                    {article.article_descr ||
                                                        article.cod_article_las}
                                                </h3>
                                                <p className="mt-1 font-mono text-xs text-muted-foreground">
                                                    Codice LAS:{' '}
                                                    {article.cod_article_las}
                                                </p>
                                                {article.offer && (
                                                    <p className="mt-1 text-xs text-muted-foreground">
                                                        Offerta:{' '}
                                                        {
                                                            article.offer
                                                                .offer_number
                                                        }
                                                    </p>
                                                )}
                                            </div>
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
                                                                articles.show({
                                                                    article:
                                                                        article.uuid,
                                                                }).url,
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
                                                                articles.edit({
                                                                    article:
                                                                        article.uuid,
                                                                }).url,
                                                            );
                                                        }}
                                                    >
                                                        <Edit className="mr-2 h-4 w-4" />
                                                        Modifica
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        onSelect={(e) => {
                                                            e.preventDefault();
                                                            router.visit(
                                                                articles.create(
                                                                    {
                                                                        query: {
                                                                            source_article_uuid:
                                                                                article.uuid,
                                                                        },
                                                                    },
                                                                ).url,
                                                            );
                                                        }}
                                                    >
                                                        <Copy className="mr-2 h-4 w-4" />
                                                        Duplica
                                                    </DropdownMenuItem>
                                                    {article.offer && (
                                                        <DropdownMenuItem
                                                            onSelect={(e) => {
                                                                e.preventDefault();
                                                                router.visit(
                                                                    offers.create(
                                                                        {
                                                                            query: {
                                                                                duplicate_from:
                                                                                    article
                                                                                        .offer!
                                                                                        .uuid,
                                                                            },
                                                                        },
                                                                    ).url,
                                                                );
                                                            }}
                                                        >
                                                            <FilePlus className="mr-2 h-4 w-4" />
                                                            Nuova Offerta
                                                        </DropdownMenuItem>
                                                    )}
                                                    <DropdownMenuItem
                                                        onSelect={(e) => {
                                                            e.preventDefault();
                                                            router.visit(
                                                                orders.create({
                                                                    query: {
                                                                        article_uuid:
                                                                            article.uuid,
                                                                    },
                                                                }).url,
                                                            );
                                                        }}
                                                    >
                                                        <ShoppingCart className="mr-2 h-4 w-4" />
                                                        Crea Ordine
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        variant="destructive"
                                                        onSelect={(e) => {
                                                            e.preventDefault();
                                                            handleDeleteClick(
                                                                article,
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
                                            {article.cod_article_client && (
                                                <div>
                                                    <span className="text-muted-foreground">
                                                        Cod. Cliente:{' '}
                                                    </span>
                                                    <span>
                                                        {
                                                            article.cod_article_client
                                                        }
                                                    </span>
                                                </div>
                                            )}
                                            {article.category && (
                                                <div>
                                                    <span className="text-muted-foreground">
                                                        Categoria:{' '}
                                                    </span>
                                                    <span>
                                                        {article.category.name}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))
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
                                    <th className="border-b px-3 py-2 font-medium">
                                        Numero offerta
                                    </th>
                                    <SortableTableHeader
                                        column="cod_article_las"
                                        currentSort={filters.sort_by}
                                        currentDirection={filters.sort_order}
                                        onSort={handleSort}
                                    >
                                        Codice articolo LAS
                                    </SortableTableHeader>
                                    <SortableTableHeader
                                        column="cod_article_client"
                                        currentSort={filters.sort_by}
                                        currentDirection={filters.sort_order}
                                        onSort={handleSort}
                                    >
                                        Codice articolo cliente
                                    </SortableTableHeader>
                                    <SortableTableHeader
                                        column="article_descr"
                                        currentSort={filters.sort_by}
                                        currentDirection={filters.sort_order}
                                        onSort={handleSort}
                                    >
                                        Descrizione articolo
                                    </SortableTableHeader>
                                    <th className="border-b px-3 py-2 font-medium">
                                        Descrizione aggiuntiva
                                    </th>
                                    <th className="border-b px-3 py-2 font-medium">
                                        Approvazione
                                    </th>
                                    <th className="border-b px-3 py-2 text-right font-medium">
                                        Azioni
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {articlesPaginated.data.length === 0 && (
                                    <tr>
                                        <td
                                            colSpan={9}
                                            className="px-3 py-8 text-center text-sm text-muted-foreground"
                                        >
                                            Nessun articolo trovato per i filtri
                                            attuali.
                                        </td>
                                    </tr>
                                )}
                                {articlesPaginated.data.map((article) => (
                                    <tr
                                        key={article.uuid}
                                        className="border-b border-sidebar-border/70 last:border-b-0 hover:bg-muted/50 dark:border-sidebar-border"
                                    >
                                        <td className="px-3 py-2 align-middle text-xs">
                                            {article.id}
                                        </td>
                                        <td className="px-3 py-2 align-middle font-mono text-xs">
                                            {article.uuid}
                                        </td>
                                        <td className="px-3 py-2 align-middle text-xs">
                                            {article.offer?.offer_number ?? (
                                                <span className="text-muted-foreground">
                                                    —
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-3 py-2 align-middle font-mono text-xs">
                                            {article.cod_article_las}
                                        </td>
                                        <td className="px-3 py-2 align-middle text-xs">
                                            {article.cod_article_client || (
                                                <span className="text-muted-foreground">
                                                    —
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-3 py-2 align-middle">
                                            {article.article_descr || (
                                                <span className="text-muted-foreground">
                                                    —
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-3 py-2 align-middle">
                                            {article.additional_descr || (
                                                <span className="text-muted-foreground">
                                                    —
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-3 py-2 align-middle text-xs">
                                            {article.check_approval == 1 ||
                                            article.check_approval === '1' ? (
                                                <div
                                                    className="flex items-center gap-1"
                                                    title="Approvato"
                                                >
                                                    <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                                                    <span className="sr-only">
                                                        1
                                                    </span>
                                                </div>
                                            ) : article.check_approval == 0 ||
                                              article.check_approval === '0' ? (
                                                <div
                                                    className="flex items-center gap-1"
                                                    title="Non approvato"
                                                >
                                                    <AlertCircle className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                                                    <span className="sr-only">
                                                        0
                                                    </span>
                                                </div>
                                            ) : (
                                                <span className="text-muted-foreground">
                                                    —
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-3 py-2 text-right align-middle">
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
                                                                articles.show({
                                                                    article:
                                                                        article.uuid,
                                                                }).url,
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
                                                                articles.edit({
                                                                    article:
                                                                        article.uuid,
                                                                }).url,
                                                            );
                                                        }}
                                                    >
                                                        <Edit className="mr-2 h-4 w-4" />
                                                        Modifica
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        onSelect={(e) => {
                                                            e.preventDefault();
                                                            router.visit(
                                                                articles.create(
                                                                    {
                                                                        query: {
                                                                            source_article_uuid:
                                                                                article.uuid,
                                                                        },
                                                                    },
                                                                ).url,
                                                            );
                                                        }}
                                                    >
                                                        <Copy className="mr-2 h-4 w-4" />
                                                        Duplica
                                                    </DropdownMenuItem>
                                                    {article.offer && (
                                                        <DropdownMenuItem
                                                            onSelect={(e) => {
                                                                e.preventDefault();
                                                                router.visit(
                                                                    offers.create(
                                                                        {
                                                                            query: {
                                                                                duplicate_from:
                                                                                    article
                                                                                        .offer!
                                                                                        .uuid,
                                                                            },
                                                                        },
                                                                    ).url,
                                                                );
                                                            }}
                                                        >
                                                            <FilePlus className="mr-2 h-4 w-4" />
                                                            Nuova Offerta
                                                        </DropdownMenuItem>
                                                    )}
                                                    <DropdownMenuItem
                                                        onSelect={(e) => {
                                                            e.preventDefault();
                                                            router.visit(
                                                                orders.create({
                                                                    query: {
                                                                        article_uuid:
                                                                            article.uuid,
                                                                    },
                                                                }).url,
                                                            );
                                                        }}
                                                    >
                                                        <ShoppingCart className="mr-2 h-4 w-4" />
                                                        Crea Ordine
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        variant="destructive"
                                                        onSelect={(e) => {
                                                            e.preventDefault();
                                                            handleDeleteClick(
                                                                article,
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

                <Pagination
                    links={articlesPaginated.links}
                    currentPage={articlesPaginated.current_page}
                    lastPage={articlesPaginated.last_page}
                    totalItems={articlesPaginated.data.length}
                />

                <ConfirmDeleteDialog
                    open={deleteDialog.open}
                    onOpenChange={(open) =>
                        setDeleteDialog({ open, article: deleteDialog.article })
                    }
                    onConfirm={handleDeleteConfirm}
                    isLoading={isDeleting}
                    title="Conferma eliminazione"
                    description={`Sei sicuro di voler eliminare l'articolo? Questa azione non può essere annullata. L'articolo verrà eliminato definitivamente.`}
                    itemName={deleteDialog.article?.cod_article_las}
                />
            </div>
        </AppLayout>
    );
}
