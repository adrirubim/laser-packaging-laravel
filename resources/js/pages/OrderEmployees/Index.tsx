import { FlashNotifications } from '@/components/flash-notifications';
import { Pagination } from '@/components/Pagination';
import { useTranslations } from '@/hooks/use-translations';
import AppLayout from '@/layouts/app-layout';
import orderEmployees from '@/routes/order-employees/index';
import orders from '@/routes/orders/index';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';

type Employee = {
    uuid: string;
    name: string;
    surname: string;
    matriculation_number: string;
};

type Order = {
    uuid: string;
    order_production_number: string;
};

type Assignment = {
    id: number;
    uuid: string;
    order?: Order | null;
    employee?: Employee | null;
};

type OrderEmployeesIndexProps = {
    assignments: {
        data: Assignment[];
        current_page: number;
        last_page: number;
        links: { url: string | null; label: string; active: boolean }[];
    };
    filters: {
        order_uuid?: string;
        employee_uuid?: string;
    };
    flash?: {
        success?: string;
        error?: string;
    };
};

export default function OrderEmployeesIndex() {
    const { props } = usePage<OrderEmployeesIndexProps>();
    const { assignments: assignmentsPaginated, flash } = props;
    const { t } = useTranslations();

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: t('order_employees.page_title'),
            href: orderEmployees.index().url,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('order_employees.page_title')} />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between gap-3">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">
                            {t('order_employees.page_title')}
                        </h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            {t('order_employees.subtitle')}
                        </p>
                    </div>
                </div>

                <FlashNotifications flash={flash} />

                <div className="relative min-h-[300px] flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 bg-card dark:border-sidebar-border">
                    <div className="relative h-full w-full overflow-auto">
                        <table className="min-w-full border-separate border-spacing-0 text-left text-sm">
                            <thead className="sticky top-0 z-10 bg-muted/80 backdrop-blur">
                                <tr className="text-xs tracking-wide text-muted-foreground uppercase">
                                    <th className="border-b px-3 py-2 font-medium">
                                        {t('common.order')}
                                    </th>
                                    <th className="border-b px-3 py-2 font-medium">
                                        {t('order_employees.employee')}
                                    </th>
                                    <th className="border-b px-3 py-2 font-medium">
                                        {t('order_employees.matriculation')}
                                    </th>
                                    <th className="border-b px-3 py-2 text-right font-medium">
                                        {t('common.actions')}
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {assignmentsPaginated.data.length === 0 && (
                                    <tr>
                                        <td
                                            colSpan={4}
                                            className="px-3 py-6 text-center text-sm text-muted-foreground"
                                        >
                                            {t('order_employees.empty_state')}
                                        </td>
                                    </tr>
                                )}
                                {assignmentsPaginated.data.map((assignment) => (
                                    <tr
                                        key={assignment.id}
                                        className="border-b last:border-b-0 hover:bg-muted/40"
                                    >
                                        <td className="px-3 py-2 align-middle font-mono text-xs">
                                            {assignment.order
                                                ?.order_production_number ||
                                                t(
                                                    'order_employees.not_available',
                                                )}
                                        </td>
                                        <td className="px-3 py-2 align-middle font-medium">
                                            {assignment.employee
                                                ? `${assignment.employee.name} ${assignment.employee.surname}`
                                                : t(
                                                      'order_employees.not_available',
                                                  )}
                                        </td>
                                        <td className="px-3 py-2 align-middle font-mono text-xs">
                                            {assignment.employee
                                                ?.matriculation_number ||
                                                t(
                                                    'order_employees.not_available',
                                                )}
                                        </td>
                                        <td className="px-3 py-2 text-right align-middle text-xs">
                                            {assignment.order && (
                                                <Link
                                                    href={
                                                        orders.show({
                                                            order: assignment
                                                                .order.uuid,
                                                        }).url
                                                    }
                                                    className="text-primary hover:underline"
                                                >
                                                    {t(
                                                        'order_employees.view_order',
                                                    )}
                                                </Link>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <Pagination
                    links={assignmentsPaginated.links}
                    currentPage={assignmentsPaginated.current_page}
                    lastPage={assignmentsPaginated.last_page}
                />
            </div>
        </AppLayout>
    );
}
