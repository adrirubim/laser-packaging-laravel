import AppLayout from '@/layouts/app-layout';
import orderStates from '@/routes/order-states';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { Edit, Eye, Plus } from 'lucide-react';

type OrderState = {
    id: number;
    uuid: string;
    name: string;
    sorting: number;
    initial: boolean;
    production: boolean;
};

type OrderStatesIndexProps = {
    orderStates: {
        data: OrderState[];
        current_page: number;
        last_page: number;
        links: { url: string | null; label: string; active: boolean }[];
    };
    filters: Record<string, never>;
    flash?: {
        success?: string;
        error?: string;
    };
};

export default function OrderStatesIndex() {
    const { props } = usePage<OrderStatesIndexProps>();
    const { orderStates: orderStatesPaginated, flash } = props;

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Stati Ordine',
            href: orderStates.index().url,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Stati Ordine" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between gap-3">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">
                            Stati Ordine
                        </h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Elenco degli stati ordine.
                        </p>
                    </div>
                    <Link
                        href={orderStates.create().url}
                        className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm hover:bg-primary/90"
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        Nuovo Stato
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

                <div className="relative min-h-[300px] flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 bg-card dark:border-sidebar-border">
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
                                        Nome
                                    </th>
                                    <th className="border-b px-3 py-2 font-medium">
                                        Ordinamento
                                    </th>
                                    <th className="border-b px-3 py-2 font-medium">
                                        Iniziale
                                    </th>
                                    <th className="border-b px-3 py-2 font-medium">
                                        Produzione
                                    </th>
                                    <th className="border-b px-3 py-2 text-right font-medium">
                                        Azioni
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {orderStatesPaginated.data.length === 0 && (
                                    <tr>
                                        <td
                                            colSpan={7}
                                            className="px-3 py-6 text-center text-sm text-muted-foreground"
                                        >
                                            Nessuno stato ordine trovato.
                                        </td>
                                    </tr>
                                )}
                                {orderStatesPaginated.data.map((state) => (
                                    <tr
                                        key={state.uuid}
                                        className="border-b last:border-b-0 hover:bg-muted/40"
                                    >
                                        <td className="px-3 py-2 align-middle text-xs">
                                            {state.id}
                                        </td>
                                        <td className="px-3 py-2 align-middle font-mono text-xs">
                                            {state.uuid}
                                        </td>
                                        <td className="px-3 py-2 align-middle font-medium">
                                            {state.name}
                                        </td>
                                        <td className="px-3 py-2 align-middle text-xs">
                                            {state.sorting}
                                        </td>
                                        <td className="px-3 py-2 align-middle text-xs">
                                            {state.initial ? (
                                                <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-2 py-1 text-xs font-medium text-emerald-700 dark:text-emerald-300">
                                                    Sì
                                                </span>
                                            ) : (
                                                <span className="text-muted-foreground">
                                                    No
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-3 py-2 align-middle text-xs">
                                            {state.production ? (
                                                <span className="inline-flex items-center rounded-full bg-blue-500/10 px-2 py-1 text-xs font-medium text-blue-700 dark:text-blue-300">
                                                    Sì
                                                </span>
                                            ) : (
                                                <span className="text-muted-foreground">
                                                    No
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-3 py-2 text-right align-middle text-xs">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link
                                                    href={
                                                        orderStates.show({
                                                            orderState:
                                                                state.uuid,
                                                        }).url
                                                    }
                                                    className="inline-flex items-center text-primary hover:underline"
                                                    title="Visualizza"
                                                >
                                                    <Eye className="h-4 w-4" />
                                                </Link>
                                                <Link
                                                    href={
                                                        orderStates.edit({
                                                            orderState:
                                                                state.uuid,
                                                        }).url
                                                    }
                                                    className="inline-flex items-center text-primary hover:underline"
                                                    title="Modifica"
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </Link>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {orderStatesPaginated.links.length > 1 && (
                    <div className="flex items-center justify-between gap-3 text-xs text-muted-foreground">
                        <div>
                            Pagina{' '}
                            <strong>{orderStatesPaginated.current_page}</strong>{' '}
                            di <strong>{orderStatesPaginated.last_page}</strong>
                        </div>
                        <div className="flex flex-wrap items-center gap-1">
                            {orderStatesPaginated.links.map((link, index) => {
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
                            })}
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
