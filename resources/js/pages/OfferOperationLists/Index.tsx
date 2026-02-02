import { SearchInput } from '@/components/SearchInput';
import AppLayout from '@/layouts/app-layout';
import offerOperationLists from '@/routes/offer-operation-lists';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';

type Offer = {
    uuid: string;
    offer_number: string;
    provisional_description?: string | null;
};

type Operation = {
    uuid: string;
    code: string;
    description?: string | null;
};

type OperationList = {
    id: number;
    uuid: string;
    num_op: number;
    offer?: Offer | null;
    operation?: Operation | null;
};

type OfferOperationListsIndexProps = {
    operationLists: {
        data: OperationList[];
        current_page: number;
        last_page: number;
        links: { url: string | null; label: string; active: boolean }[];
    };
    filters: {
        search?: string;
        offer_uuid?: string;
    };
    flash?: {
        success?: string;
        error?: string;
    };
};

export default function OfferOperationListsIndex() {
    const { props } = usePage<OfferOperationListsIndexProps>();
    const { operationLists: operationListsPaginated, filters, flash } = props;

    const handleSearchChange = (value: string) => {
        router.get(
            offerOperationLists.index().url,
            {
                search: value || undefined,
                offer_uuid: filters.offer_uuid || undefined,
            },
            {
                preserveState: true,
                preserveScroll: true,
            },
        );
    };

    const clearSearch = () => {
        router.get(
            offerOperationLists.index().url,
            {
                offer_uuid: filters.offer_uuid || undefined,
            },
            {
                preserveState: true,
                preserveScroll: true,
            },
        );
    };

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Liste operazioni offerta',
            href: '/offers/operation-lists',
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Liste operazioni offerta" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between gap-3">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">
                            Liste operazioni offerta
                        </h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Elenco delle operazioni assegnate alle offerte.
                        </p>
                    </div>
                    <Link
                        href={
                            filters.offer_uuid
                                ? `/offers/operation-lists/create?offer_uuid=${filters.offer_uuid}`
                                : '/offers/operation-lists/create'
                        }
                        className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm hover:bg-primary/90"
                    >
                        Nuova lista operazioni
                    </Link>
                </div>

                {flash?.success && (
                    <div className="rounded-md border border-emerald-500/40 bg-emerald-500/5 px-3 py-2 text-sm text-emerald-700 dark:text-emerald-300">
                        {flash.success}
                    </div>
                )}
                {flash?.error && (
                    <div className="rounded-md border border-rose-500/40 bg-rose-500/5 px-3 py-2 text-sm text-rose-700 dark:text-rose-300">
                        {flash.error}
                    </div>
                )}

                <div className="flex flex-col gap-3 rounded-xl border border-sidebar-border/70 bg-card p-4 dark:border-sidebar-border">
                    <div className="space-y-1">
                        <label className="text-xs font-medium text-muted-foreground">
                            Cerca
                        </label>
                        <SearchInput
                            value={filters.search || ''}
                            onChange={handleSearchChange}
                            onClear={clearSearch}
                            placeholder="Cerca per numero offerta o codice operazione..."
                        />
                    </div>
                </div>

                <div className="relative min-h-[300px] flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 bg-card dark:border-sidebar-border">
                    <div className="relative h-full w-full overflow-auto">
                        <table className="min-w-full border-separate border-spacing-0 text-left text-sm">
                            <thead className="sticky top-0 z-10 bg-muted/80 backdrop-blur">
                                <tr className="text-xs tracking-wide text-muted-foreground uppercase">
                                    <th className="border-b px-3 py-2 font-medium">
                                        Offerta
                                    </th>
                                    <th className="border-b px-3 py-2 font-medium">
                                        Operazione
                                    </th>
                                    <th className="border-b px-3 py-2 font-medium">
                                        Numero
                                    </th>
                                    <th className="border-b px-3 py-2 text-right font-medium">
                                        Azioni
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {operationListsPaginated.data.length === 0 && (
                                    <tr>
                                        <td
                                            colSpan={4}
                                            className="px-3 py-6 text-center text-sm text-muted-foreground"
                                        >
                                            Nessuna lista operazioni trovata per
                                            i filtri attuali.
                                        </td>
                                    </tr>
                                )}
                                {operationListsPaginated.data.map((list) => (
                                    <tr
                                        key={list.id}
                                        className="border-b last:border-b-0 hover:bg-muted/40"
                                    >
                                        <td className="px-3 py-2 align-middle font-mono text-xs">
                                            {list.offer?.offer_number || 'N/D'}
                                        </td>
                                        <td className="px-3 py-2 align-middle">
                                            <div className="font-mono text-xs">
                                                {list.operation?.code || 'N/D'}
                                            </div>
                                            {list.operation?.description && (
                                                <div className="text-xs text-muted-foreground">
                                                    {list.operation.description}
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-3 py-2 align-middle font-mono text-xs">
                                            {list.num_op}
                                        </td>
                                        <td className="px-3 py-2 text-right align-middle text-xs">
                                            <Link
                                                href={
                                                    offerOperationLists.show({
                                                        offerOperationList:
                                                            list.uuid,
                                                    }).url
                                                }
                                                className="text-primary hover:underline"
                                            >
                                                Visualizza
                                            </Link>
                                            <span className="mx-1 text-muted-foreground">
                                                ·
                                            </span>
                                            <Link
                                                href={
                                                    offerOperationLists.edit({
                                                        offerOperationList:
                                                            list.uuid,
                                                    }).url
                                                }
                                                className="text-primary hover:underline"
                                            >
                                                Modifica
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {operationListsPaginated.links.length > 1 && (
                    <div className="flex items-center justify-between gap-3 text-xs text-muted-foreground">
                        <div>
                            Pagina{' '}
                            <strong>
                                {operationListsPaginated.current_page}
                            </strong>{' '}
                            di{' '}
                            <strong>{operationListsPaginated.last_page}</strong>
                        </div>
                        <div className="flex flex-wrap items-center gap-1">
                            {operationListsPaginated.links.map(
                                (link, index) => {
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
                                            className={`rounded-md px-2 py-1 ${
                                                link.active
                                                    ? 'bg-primary text-primary-foreground'
                                                    : 'hover:bg-muted'
                                            }`}
                                        >
                                            <span
                                                dangerouslySetInnerHTML={{
                                                    __html: link.label,
                                                }}
                                            />
                                        </Link>
                                    );
                                },
                            )}
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
