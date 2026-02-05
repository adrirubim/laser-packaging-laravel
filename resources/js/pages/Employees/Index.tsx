import { ActionsDropdown } from '@/components/ActionsDropdown';
import { FlashNotifications } from '@/components/flash-notifications';
import { IndexHeader } from '@/components/IndexHeader';
import { Pagination } from '@/components/Pagination';
import { SearchInput } from '@/components/SearchInput';
import { SortableTableHeader } from '@/components/SortableTableHeader';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import employees from '@/routes/employees/index';
import { type BreadcrumbItem } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';

type Employee = {
    id: number;
    uuid: string;
    name: string;
    surname: string;
    matriculation_number: string;
    portal_enabled: boolean;
};

type EmployeesIndexProps = {
    employees: {
        data: Employee[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        from: number;
        to: number;
        links: { url: string | null; label: string; active: boolean }[];
    };
    filters: {
        search?: string;
        portal_enabled?: string;
        per_page?: string;
        sort_by?: string;
        sort_order?: 'asc' | 'desc';
    };
    flash?: {
        success?: string;
        error?: string;
    };
};

export default function EmployeesIndex() {
    const { props } = usePage<EmployeesIndexProps>();
    const { employees: employeesPaginated, filters, flash } = props;

    const handleSearchChange = (value: string) => {
        router.get(
            employees.index().url,
            {
                search: value || undefined,
                portal_enabled: filters.portal_enabled || undefined,
                per_page: filters.per_page || undefined,
                sort_by: filters.sort_by || undefined,
                sort_order: filters.sort_order || undefined,
            },
            {
                preserveState: true,
                preserveScroll: true,
            },
        );
    };

    const clearSearch = () => {
        router.get(
            employees.index().url,
            {
                portal_enabled: filters.portal_enabled || undefined,
                per_page: filters.per_page || undefined,
                sort_by: filters.sort_by || undefined,
                sort_order: filters.sort_order || undefined,
            },
            { preserveState: true, preserveScroll: true },
        );
    };

    const handlePortalFilterChange = (value: string) => {
        router.get(
            employees.index().url,
            {
                search: filters.search || undefined,
                portal_enabled: value || undefined,
                per_page: filters.per_page || undefined,
                sort_by: filters.sort_by || undefined,
                sort_order: filters.sort_order || undefined,
            },
            {
                preserveState: true,
                preserveScroll: true,
            },
        );
    };

    const handleSort = (column: string) => {
        const newDirection =
            filters.sort_by === column && filters.sort_order === 'asc'
                ? 'desc'
                : 'asc';
        router.get(
            employees.index().url,
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

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Personale',
            href: employees.index().url,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Personale" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <IndexHeader
                    title="Personale"
                    subtitle="Elenco dipendenti attivi con Cerca e filtri."
                    createHref={employees.create().url}
                    createLabel="Nuovo Dipendente"
                />

                <FlashNotifications flash={flash} />

                <div className="flex flex-col gap-3 rounded-xl border border-sidebar-border/70 bg-card p-4 dark:border-sidebar-border">
                    <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                            <label className="text-xs font-medium text-muted-foreground">
                                Mostra
                            </label>
                            <Select
                                value={String(
                                    employeesPaginated.per_page || 10,
                                )}
                                onValueChange={(value) => {
                                    router.get(
                                        employees.index().url,
                                        {
                                            ...filters,
                                            per_page: value,
                                        },
                                        {
                                            preserveState: true,
                                            preserveScroll: true,
                                        },
                                    );
                                }}
                            >
                                <SelectTrigger
                                    className="h-8 w-[92px]"
                                    aria-label="Elementi per pagina"
                                >
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="10">10</SelectItem>
                                    <SelectItem value="25">25</SelectItem>
                                    <SelectItem value="50">50</SelectItem>
                                    <SelectItem value="100">100</SelectItem>
                                </SelectContent>
                            </Select>
                            <label className="text-xs font-medium text-muted-foreground">
                                elementi
                            </label>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                            <SearchInput
                                value={filters.search || ''}
                                onChange={handleSearchChange}
                                onClear={clearSearch}
                                placeholder="Cerca per nome, cognome o matricola..."
                                className="w-48"
                            />
                            <label className="text-xs font-medium text-muted-foreground">
                                Accesso al Portale Abilitato
                            </label>
                            <Select
                                value={filters.portal_enabled || '' || 'all'}
                                onValueChange={(value) =>
                                    handlePortalFilterChange(
                                        value === 'all' ? '' : value,
                                    )
                                }
                            >
                                <SelectTrigger
                                    className="h-8 w-[160px]"
                                    aria-label="Accesso al portale"
                                >
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Tutti</SelectItem>
                                    <SelectItem value="1">Abilitato</SelectItem>
                                    <SelectItem value="0">
                                        Disabilitato
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>

                {/* Vista Desktop - Tabella */}
                <div className="relative hidden min-h-[300px] flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 bg-card md:block dark:border-sidebar-border">
                    <div className="relative h-full w-full overflow-auto">
                        <table className="min-w-full border-separate border-spacing-0 text-left text-sm">
                            <thead className="sticky top-0 z-10 bg-muted/80 backdrop-blur">
                                <tr className="text-xs tracking-wide text-muted-foreground uppercase">
                                    <SortableTableHeader
                                        column="id"
                                        currentSort={filters.sort_by}
                                        currentDirection={filters.sort_order}
                                        onSort={handleSort}
                                    >
                                        ID
                                    </SortableTableHeader>
                                    <th className="border-b px-3 py-2 font-medium">
                                        UUID
                                    </th>
                                    <SortableTableHeader
                                        column="name"
                                        currentSort={filters.sort_by}
                                        currentDirection={filters.sort_order}
                                        onSort={handleSort}
                                    >
                                        Nome
                                    </SortableTableHeader>
                                    <SortableTableHeader
                                        column="surname"
                                        currentSort={filters.sort_by}
                                        currentDirection={filters.sort_order}
                                        onSort={handleSort}
                                    >
                                        Cognome
                                    </SortableTableHeader>
                                    <SortableTableHeader
                                        column="matriculation_number"
                                        currentSort={filters.sort_by}
                                        currentDirection={filters.sort_order}
                                        onSort={handleSort}
                                    >
                                        Numero di Matricola
                                    </SortableTableHeader>
                                    <th className="border-b px-3 py-2 font-medium">
                                        Accesso al Portale Abilitato
                                    </th>
                                    <th className="border-b px-3 py-2 text-right font-medium">
                                        Azioni
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {employeesPaginated.data.length === 0 && (
                                    <tr>
                                        <td
                                            colSpan={7}
                                            className="px-3 py-8 text-center text-sm text-muted-foreground"
                                        >
                                            Nessun dipendente trovato
                                        </td>
                                    </tr>
                                )}
                                {employeesPaginated.data.map((employee) => (
                                    <tr
                                        key={employee.uuid}
                                        className="border-b last:border-b-0 hover:bg-muted/40"
                                    >
                                        <td className="px-3 py-2 align-middle text-xs">
                                            {employee.id}
                                        </td>
                                        <td className="px-3 py-2 align-middle font-mono text-xs">
                                            {employee.uuid}
                                        </td>
                                        <td className="px-3 py-2 align-middle font-medium">
                                            {employee.name}
                                        </td>
                                        <td className="px-3 py-2 align-middle">
                                            {employee.surname}
                                        </td>
                                        <td className="px-3 py-2 align-middle font-mono text-xs">
                                            {employee.matriculation_number}
                                        </td>
                                        <td className="px-3 py-2 align-middle">
                                            {employee.portal_enabled ? (
                                                <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-2 py-1 text-xs font-medium text-emerald-700 dark:text-emerald-300">
                                                    Abilitato
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center rounded-full bg-muted px-2 py-1 text-xs font-medium text-muted-foreground">
                                                    Disabilitato
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-3 py-2 text-right align-middle text-xs">
                                            <ActionsDropdown
                                                viewHref={
                                                    employees.show({
                                                        employee: employee.uuid,
                                                    }).url
                                                }
                                                editHref={
                                                    employees.edit({
                                                        employee: employee.uuid,
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

                {/* Vista Mobile - Card */}
                <div className="space-y-3 md:hidden">
                    {employeesPaginated.data.length === 0 ? (
                        <div className="py-8 text-center text-sm text-muted-foreground">
                            Nessun dipendente trovato
                        </div>
                    ) : (
                        employeesPaginated.data.map((employee) => (
                            <div
                                key={employee.uuid}
                                className="space-y-3 rounded-lg border border-sidebar-border/70 bg-card p-4"
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="text-base font-semibold">
                                            {employee.surname} {employee.name}
                                        </div>
                                        <div className="mt-1 font-mono text-xs text-muted-foreground">
                                            Matricola:{' '}
                                            {employee.matriculation_number}
                                        </div>
                                        <div className="mt-1 font-mono text-xs text-muted-foreground">
                                            ID: {employee.id}
                                        </div>
                                    </div>
                                    <ActionsDropdown
                                        viewHref={
                                            employees.show({
                                                employee: employee.uuid,
                                            }).url
                                        }
                                        editHref={
                                            employees.edit({
                                                employee: employee.uuid,
                                            }).url
                                        }
                                    />
                                </div>
                                <div className="flex items-center justify-between border-t pt-2">
                                    <span className="text-xs text-muted-foreground">
                                        Accesso Portale:
                                    </span>
                                    {employee.portal_enabled ? (
                                        <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-2 py-1 text-xs font-medium text-emerald-700 dark:text-emerald-300">
                                            Abilitato
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center rounded-full bg-muted px-2 py-1 text-xs font-medium text-muted-foreground">
                                            Disabilitato
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <Pagination
                    links={employeesPaginated.links}
                    currentPage={employeesPaginated.current_page}
                    lastPage={employeesPaginated.last_page}
                    totalItems={employeesPaginated.total}
                />
            </div>
        </AppLayout>
    );
}
