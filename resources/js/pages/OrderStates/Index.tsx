import { ActionsDropdown } from '@/components/ActionsDropdown';
import {
    FlashNotifications,
    useFlashNotifications,
} from '@/components/flash-notifications';
import { IndexHeader } from '@/components/IndexHeader';
import { Pagination } from '@/components/Pagination';
import { useTranslations } from '@/hooks/use-translations';
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
    const { t } = useTranslations();

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: t('order_states.page_title'),
            href: orderStates.index().url,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('order_states.page_title')} />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <IndexHeader
                    title={t('order_states.page_title')}
                    subtitle={t('order_states.subtitle')}
                    createHref={orderStates.create().url}
                    createLabel={t('order_states.create_label')}
                />

                <FlashNotifications flash={flash} />

                <div className="relative min-h-[300px] flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 bg-card dark:border-sidebar-border">
                    <div className="relative h-full w-full overflow-auto">
                        <table className="min-w-full border-separate border-spacing-0 text-left text-sm">
                            <thead className="sticky top-0 z-10 bg-muted/80 backdrop-blur">
                                <tr className="text-xs tracking-wide text-muted-foreground uppercase">
                                    <th className="border-b px-3 py-2 font-medium">
                                        {t('common.id')}
                                    </th>
                                    <th className="border-b px-3 py-2 font-medium">
                                        {t('order_states.uuid_column')}
                                    </th>
                                    <th className="border-b px-3 py-2 font-medium">
                                        {t('order_states.name')}
                                    </th>
                                    <th className="border-b px-3 py-2 font-medium">
                                        {t('order_states.sorting')}
                                    </th>
                                    <th className="border-b px-3 py-2 font-medium">
                                        {t('order_states.initial')}
                                    </th>
                                    <th className="border-b px-3 py-2 font-medium">
                                        {t('order_states.production')}
                                    </th>
                                    <th className="border-b px-3 py-2 text-right font-medium">
                                        {t('common.actions')}
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
                                            {t('order_states.empty_state')}
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
                                                    {t('common.yes')}
                                                </span>
                                            ) : (
                                                <span className="text-muted-foreground">
                                                    {t('common.no')}
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-3 py-2 align-middle text-xs">
                                            {state.production ? (
                                                <span className="inline-flex items-center rounded-full bg-blue-500/10 px-2 py-1 text-xs font-medium text-blue-700 dark:text-blue-300">
                                                    {t('common.yes')}
                                                </span>
                                            ) : (
                                                <span className="text-muted-foreground">
                                                    {t('common.no')}
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
