import { ActionsDropdown } from '@/components/ActionsDropdown';
import {
    FlashNotifications,
    useFlashNotifications,
} from '@/components/flash-notifications';
import { IndexHeader } from '@/components/IndexHeader';
import { Pagination } from '@/components/Pagination';
import AppLayout from '@/layouts/app-layout';
import orderStates from '@/routes/order-states/index';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';

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
    const { orderStates: orderStatesPaginated } = props;
    const { flash } = useFlashNotifications();

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
                <IndexHeader
                    title="Stati Ordine"
                    subtitle="Elenco degli stati ordine."
                    createHref={orderStates.create().url}
                    createLabel="Nuovo Stato"
                />

                <FlashNotifications flash={flash} />

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
                                            <ActionsDropdown
                                                viewHref={
                                                    orderStates.show({
                                                        orderState: state.uuid,
                                                    }).url
                                                }
                                                editHref={
                                                    orderStates.edit({
                                                        orderState: state.uuid,
                                                    }).url
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
                    links={orderStatesPaginated.links}
                    currentPage={orderStatesPaginated.current_page}
                    lastPage={orderStatesPaginated.last_page}
                />
            </div>
        </AppLayout>
    );
}
