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
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useTranslations } from '@/hooks/use-translations';
import AppLayout from '@/layouts/app-layout';
import * as contractsRoutes from '@/routes/employees/contracts/index';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import {
    CalendarPlus,
    Edit,
    Eye,
    MoreHorizontal,
    Plus,
    Trash2,
} from 'lucide-react';
import { useEffect, useState } from 'react';

type Employee = {
    uuid: string;
    matriculation_number: string;
    name: string;
    surname: string;
};

type Supplier = {
    uuid: string;
    code: string;
    company_name: string;
};

type EmployeeContract = {
    id: number;
    uuid: string;
    employee?: Employee | null;
    supplier?: Supplier | null;
    pay_level: number;
    start_date: string;
    end_date?: string | null;
    pay_level_label?: string;
};

type ContractsIndexProps = {
    contracts: {
        data: EmployeeContract[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        from: number;
        to: number;
        links: { url: string | null; label: string; active: boolean }[];
    };
    employees: Employee[];
    suppliers: Supplier[];
    filters: {
        search?: string;
        employee_uuid?: string;
        supplier_uuid?: string;
        per_page?: string;
        sort_by?: string;
        sort_order?: 'asc' | 'desc';
    };
    flash?: {
        success?: string;
        error?: string;
    };
};

const PAY_LEVEL_KEYS: Record<number, string> = {
    0: 'employees.contracts.pay_level_0',
    1: 'employees.contracts.pay_level_1',
    2: 'employees.contracts.pay_level_2',
    3: 'employees.contracts.pay_level_3',
    4: 'employees.contracts.pay_level_4',
    5: 'employees.contracts.pay_level_5',
    6: 'employees.contracts.pay_level_6',
    7: 'employees.contracts.pay_level_7',
    8: 'employees.contracts.pay_level_8',
};

export default function ContractsIndex() {
    const { props } = usePage<ContractsIndexProps>();
    const {
        contracts: contractsPaginated,
        employees,
        suppliers,
        filters,
    } = props;
    const { flash } = useFlashNotifications();
    const { t } = useTranslations();
    const [viewDialog, setViewDialog] = useState<{
        open: boolean;
        contract: EmployeeContract | null;
    }>({
        open: false,
        contract: null,
    });
    const [editDialog, setEditDialog] = useState<{
        open: boolean;
        contract: EmployeeContract | null;
    }>({
        open: false,
        contract: null,
    });
    const [deleteDialog, setDeleteDialog] = useState<{
        open: boolean;
        contract: EmployeeContract | null;
    }>({
        open: false,
        contract: null,
    });
    const [isDeleting, setIsDeleting] = useState(false);

    const handleSearchChange = (value: string) => {
        router.get(
            contractsRoutes.index().url,
            {
                search: value || undefined,
                employee_uuid: filters.employee_uuid || undefined,
                supplier_uuid: filters.supplier_uuid || undefined,
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
            contractsRoutes.index().url,
            {
                employee_uuid: filters.employee_uuid || undefined,
                supplier_uuid: filters.supplier_uuid || undefined,
                per_page: filters.per_page || undefined,
                sort_by: filters.sort_by || undefined,
                sort_order: filters.sort_order || undefined,
            },
            { preserveState: true, preserveScroll: true },
        );
    };

    const handleEmployeeChange = (value: string) => {
        router.get(
            contractsRoutes.index().url,
            {
                search: filters.search || undefined,
                employee_uuid: value === 'all' ? undefined : value || undefined,
                supplier_uuid: filters.supplier_uuid || undefined,
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

    const handleSupplierChange = (value: string) => {
        router.get(
            contractsRoutes.index().url,
            {
                search: filters.search || undefined,
                employee_uuid: filters.employee_uuid || undefined,
                supplier_uuid: value === 'all' ? undefined : value || undefined,
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
            contractsRoutes.index().url,
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

    const formatDate = (
        dateString: string | null | undefined,
        emptyLabel: string = '-',
    ): string => {
        if (!dateString) return emptyLabel;
        const date = new Date(dateString);
        return date.toLocaleDateString('it-IT', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
        });
    };

    const handleViewClick = (contract: EmployeeContract) => {
        setViewDialog({ open: true, contract });
    };

    const handleEditClick = (contract: EmployeeContract) => {
        setEditDialog({ open: true, contract });
    };

    const handleDeleteClick = (contract: EmployeeContract) => {
        setDeleteDialog({ open: true, contract });
    };

    const handleDeleteConfirm = () => {
        if (!deleteDialog.contract) return;

        setIsDeleting(true);
        router.delete(
            contractsRoutes.destroy({ contract: deleteDialog.contract.uuid })
                .url,
            {
                preserveScroll: true,
                onSuccess: () => {
                    setDeleteDialog({ open: false, contract: null });
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
            title: t('nav.personale'),
            href: '/employees',
        },
        {
            title: t('employees.contracts.breadcrumb_contracts'),
            href: contractsRoutes.index().url,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('employees.contracts.page_title')} />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <FlashNotifications flash={flash} />

                {contractsPaginated.total === 0 && (
                    <div className="flex flex-col items-center justify-center gap-4 rounded-xl border border-sidebar-border/70 bg-card p-8 text-center dark:border-sidebar-border">
                        <p className="text-muted-foreground">
                            {t('employees.contracts.empty_state')}
                        </p>
                        <Link
                            href={contractsRoutes.create().url}
                            className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm hover:bg-primary/90"
                        >
                            <Plus className="mr-2 h-4 w-4" />
                            {t('employees.contracts.create_first')}
                        </Link>
                    </div>
                )}

                <div className="flex items-center justify-between gap-3">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">
                            {t('employees.contracts.page_title')}
                        </h1>
                    </div>
                    <Link
                        href={contractsRoutes.create().url}
                        className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm hover:bg-primary/90"
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        {t('employees.contracts.add_contract')}
                    </Link>
                </div>

                <div className="flex flex-col gap-3 rounded-xl border border-sidebar-border/70 bg-card p-4 dark:border-sidebar-border">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                            <label className="text-xs font-medium text-muted-foreground">
                                {t('employees.contracts.show_label')}
                            </label>
                            <Select
                                value={String(
                                    contractsPaginated.per_page || 10,
                                )}
                                onValueChange={(value) => {
                                    router.get(
                                        contractsRoutes.index().url,
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
                                    aria-label={t(
                                        'employees.contracts.aria_items_per_page',
                                    )}
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
                                {t('employees.contracts.items_label')}
                            </label>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                            <SearchInput
                                value={filters.search || ''}
                                onChange={handleSearchChange}
                                onClear={clearSearch}
                                placeholder={t(
                                    'employees.contracts.search_placeholder',
                                )}
                                className="w-48"
                            />
                            <label className="text-xs font-medium text-muted-foreground">
                                {t('employees.contracts.employee_filter_label')}
                                :
                            </label>
                            <Select
                                value={filters.employee_uuid || 'all'}
                                onValueChange={handleEmployeeChange}
                            >
                                <SelectTrigger className="h-8 w-48 text-xs">
                                    <SelectValue
                                        placeholder={t('filter.all_employees')}
                                    />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">
                                        {t('filter.all_employees')}
                                    </SelectItem>
                                    {employees
                                        .filter((emp) => emp.uuid)
                                        .map((emp) => (
                                            <SelectItem
                                                key={emp.uuid}
                                                value={emp.uuid}
                                            >
                                                {emp.surname} {emp.name} (
                                                {emp.matriculation_number})
                                            </SelectItem>
                                        ))}
                                </SelectContent>
                            </Select>
                            <label className="text-xs font-medium text-muted-foreground">
                                {t('employees.contracts.supplier_filter_label')}
                                :
                            </label>
                            <Select
                                value={filters.supplier_uuid || 'all'}
                                onValueChange={handleSupplierChange}
                            >
                                <SelectTrigger className="h-8 w-48 text-xs">
                                    <SelectValue
                                        placeholder={t('filter.all_employers')}
                                    />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">
                                        {t('filter.all_employers')}
                                    </SelectItem>
                                    {suppliers
                                        .filter((sup) => sup.uuid)
                                        .map((sup) => (
                                            <SelectItem
                                                key={sup.uuid}
                                                value={sup.uuid}
                                            >
                                                {sup.company_name} ({sup.code})
                                            </SelectItem>
                                        ))}
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
                                    <th className="border-b px-3 py-2 font-medium">
                                        ID
                                    </th>
                                    <th className="border-b px-3 py-2 font-medium">
                                        UUID
                                    </th>
                                    <SortableTableHeader
                                        column="employee"
                                        currentSort={filters.sort_by}
                                        currentDirection={filters.sort_order}
                                        onSort={handleSort}
                                    >
                                        {t(
                                            'employees.contracts.columns.employee',
                                        )}
                                    </SortableTableHeader>
                                    <SortableTableHeader
                                        column="supplier"
                                        currentSort={filters.sort_by}
                                        currentDirection={filters.sort_order}
                                        onSort={handleSort}
                                    >
                                        {t(
                                            'employees.contracts.columns.supplier',
                                        )}
                                    </SortableTableHeader>
                                    <SortableTableHeader
                                        column="pay_level"
                                        currentSort={filters.sort_by}
                                        currentDirection={filters.sort_order}
                                        onSort={handleSort}
                                    >
                                        {t(
                                            'employees.contracts.columns.pay_level',
                                        )}
                                    </SortableTableHeader>
                                    <SortableTableHeader
                                        column="start_date"
                                        currentSort={filters.sort_by}
                                        currentDirection={filters.sort_order}
                                        onSort={handleSort}
                                    >
                                        {t(
                                            'employees.contracts.columns.start_date',
                                        )}
                                    </SortableTableHeader>
                                    <SortableTableHeader
                                        column="end_date"
                                        currentSort={filters.sort_by}
                                        currentDirection={filters.sort_order}
                                        onSort={handleSort}
                                    >
                                        {t(
                                            'employees.contracts.columns.end_date',
                                        )}
                                    </SortableTableHeader>
                                    <th className="border-b px-3 py-2 text-right font-medium">
                                        {t(
                                            'employees.contracts.columns.actions',
                                        )}
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {contractsPaginated.data.length === 0 && (
                                    <tr>
                                        <td
                                            colSpan={8}
                                            className="px-3 py-8 text-center text-sm text-muted-foreground"
                                        >
                                            {t(
                                                'employees.contracts.empty_table',
                                            )}
                                        </td>
                                    </tr>
                                )}
                                {contractsPaginated.data.map((contract) => (
                                    <tr
                                        key={contract.uuid}
                                        className="border-b border-sidebar-border/70 hover:bg-muted/50 dark:border-sidebar-border"
                                    >
                                        <td className="px-3 py-2 align-middle text-xs">
                                            {contract.id}
                                        </td>
                                        <td className="px-3 py-2 align-middle font-mono text-xs">
                                            {contract.uuid}
                                        </td>
                                        <td className="px-3 py-2">
                                            {contract.employee ? (
                                                <div>
                                                    <div className="font-medium">
                                                        {
                                                            contract.employee
                                                                .surname
                                                        }{' '}
                                                        {contract.employee.name}
                                                    </div>
                                                    <div className="font-mono text-xs text-muted-foreground">
                                                        {
                                                            contract.employee
                                                                .matriculation_number
                                                        }
                                                    </div>
                                                </div>
                                            ) : (
                                                <span className="text-muted-foreground">
                                                    -
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-3 py-2">
                                            {contract.supplier ? (
                                                <div>
                                                    <div className="font-medium">
                                                        {
                                                            contract.supplier
                                                                .company_name
                                                        }
                                                    </div>
                                                    <div className="text-xs text-muted-foreground">
                                                        {contract.supplier.code}
                                                    </div>
                                                </div>
                                            ) : (
                                                <span className="text-muted-foreground">
                                                    -
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-3 py-2">
                                            <span className="inline-flex items-center rounded-full bg-muted px-2 py-1 text-xs font-medium">
                                                {contract.pay_level_label ||
                                                    t(
                                                        PAY_LEVEL_KEYS[
                                                            contract.pay_level
                                                        ] ??
                                                            'common.not_available',
                                                    )}
                                            </span>
                                        </td>
                                        <td className="px-3 py-2 text-xs">
                                            {formatDate(contract.start_date)}
                                        </td>
                                        <td className="px-3 py-2 text-xs">
                                            {formatDate(
                                                contract.end_date,
                                                t(
                                                    'employees.contracts.indeterminate',
                                                ),
                                            )}
                                        </td>
                                        <td className="px-3 py-2 text-right text-xs">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8"
                                                        aria-label={t(
                                                            'employees.contracts.aria_open_menu',
                                                        )}
                                                    >
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem
                                                        onSelect={(e) => {
                                                            e.preventDefault();
                                                            handleViewClick(
                                                                contract,
                                                            );
                                                        }}
                                                    >
                                                        <Eye className="mr-2 h-4 w-4" />
                                                        {t(
                                                            'employees.contracts.view',
                                                        )}
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        onSelect={(e) => {
                                                            e.preventDefault();
                                                            handleEditClick(
                                                                contract,
                                                            );
                                                        }}
                                                    >
                                                        <Edit className="mr-2 h-4 w-4" />
                                                        {t(
                                                            'employees.contracts.edit',
                                                        )}
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem asChild>
                                                        <Link
                                                            href={
                                                                contractsRoutes.create()
                                                                    .url +
                                                                `?proroga=${contract.uuid}`
                                                            }
                                                        >
                                                            <CalendarPlus className="mr-2 h-4 w-4" />
                                                            {t(
                                                                'employees.contracts.extend',
                                                            )}
                                                        </Link>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        variant="destructive"
                                                        onSelect={(e) => {
                                                            e.preventDefault();
                                                            handleDeleteClick(
                                                                contract,
                                                            );
                                                        }}
                                                    >
                                                        <Trash2 className="mr-2 h-4 w-4" />
                                                        {t(
                                                            'employees.contracts.delete',
                                                        )}
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

                {/* Vista Mobile - Card */}
                <div className="space-y-3 md:hidden">
                    {contractsPaginated.data.length === 0 ? (
                        <div className="py-8 text-center text-sm text-muted-foreground">
                            {t('employees.contracts.empty_table')}
                        </div>
                    ) : (
                        contractsPaginated.data.map((contract) => (
                            <div
                                key={contract.uuid}
                                className="space-y-3 rounded-lg border border-sidebar-border/70 bg-card p-4"
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="text-base font-semibold">
                                            {contract.employee ? (
                                                <>
                                                    {contract.employee.surname}{' '}
                                                    {contract.employee.name}
                                                </>
                                            ) : (
                                                <span className="text-muted-foreground">
                                                    -
                                                </span>
                                            )}
                                        </div>
                                        {contract.employee && (
                                            <div className="mt-1 font-mono text-xs text-muted-foreground">
                                                {t(
                                                    'employees.contracts.matriculation_mobile',
                                                )}
                                                :{' '}
                                                {
                                                    contract.employee
                                                        .matriculation_number
                                                }
                                            </div>
                                        )}
                                        <div className="mt-2 text-sm">
                                            <span className="text-muted-foreground">
                                                {t(
                                                    'employees.contracts.supplier_mobile',
                                                )}
                                                :{' '}
                                            </span>
                                            {contract.supplier ? (
                                                <span className="font-medium">
                                                    {
                                                        contract.supplier
                                                            .company_name
                                                    }
                                                </span>
                                            ) : (
                                                <span className="text-muted-foreground">
                                                    -
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8"
                                                aria-label={t(
                                                    'employees.contracts.aria_open_menu',
                                                )}
                                            >
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem
                                                onSelect={(e) => {
                                                    e.preventDefault();
                                                    handleViewClick(contract);
                                                }}
                                            >
                                                <Eye className="mr-2 h-4 w-4" />
                                                {t('employees.contracts.view')}
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                onSelect={(e) => {
                                                    e.preventDefault();
                                                    handleEditClick(contract);
                                                }}
                                            >
                                                <Edit className="mr-2 h-4 w-4" />
                                                {t('employees.contracts.edit')}
                                            </DropdownMenuItem>
                                            <DropdownMenuItem asChild>
                                                <Link
                                                    href={
                                                        contractsRoutes.create()
                                                            .url +
                                                        `?proroga=${contract.uuid}`
                                                    }
                                                >
                                                    <CalendarPlus className="mr-2 h-4 w-4" />
                                                    {t(
                                                        'employees.contracts.extend',
                                                    )}
                                                </Link>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                variant="destructive"
                                                onSelect={(e) => {
                                                    e.preventDefault();
                                                    handleDeleteClick(contract);
                                                }}
                                            >
                                                <Trash2 className="mr-2 h-4 w-4" />
                                                {t(
                                                    'employees.contracts.delete',
                                                )}
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                                <div className="grid grid-cols-2 gap-2 border-t pt-2 text-xs">
                                    <div>
                                        <span className="text-muted-foreground">
                                            {t(
                                                'employees.contracts.level_mobile',
                                            )}
                                            :{' '}
                                        </span>
                                        <span className="inline-flex items-center rounded-full bg-muted px-2 py-1 text-xs font-medium">
                                            {contract.pay_level_label ||
                                                t(
                                                    PAY_LEVEL_KEYS[
                                                        contract.pay_level
                                                    ] ?? 'common.not_available',
                                                )}
                                        </span>
                                    </div>
                                    <div>
                                        <span className="text-muted-foreground">
                                            {t(
                                                'employees.contracts.start_mobile',
                                            )}
                                            :{' '}
                                        </span>
                                        <span>
                                            {formatDate(contract.start_date)}
                                        </span>
                                    </div>
                                    {contract.end_date && (
                                        <div className="col-span-2">
                                            <span className="text-muted-foreground">
                                                {t(
                                                    'employees.contracts.end_mobile',
                                                )}
                                                :{' '}
                                            </span>
                                            <span>
                                                {formatDate(contract.end_date)}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <Pagination
                    links={contractsPaginated.links}
                    currentPage={contractsPaginated.current_page}
                    lastPage={contractsPaginated.last_page}
                    totalItems={contractsPaginated.total}
                />
            </div>

            {/* Dialog di visualizzazione */}
            <Dialog
                open={viewDialog.open}
                onOpenChange={(open) => setViewDialog({ open, contract: null })}
            >
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>
                            {t('employees.contracts.view_dialog_title')}
                        </DialogTitle>
                        <DialogDescription asChild>
                            <span>
                                {t(
                                    'employees.contracts.view_dialog_description',
                                )}
                            </span>
                        </DialogDescription>
                    </DialogHeader>
                    {viewDialog.contract && (
                        <div className="space-y-4 py-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label className="text-xs text-muted-foreground">
                                        {t(
                                            'employees.contracts.view_label_employee',
                                        )}
                                    </Label>
                                    <p className="text-sm font-medium">
                                        {viewDialog.contract.employee
                                            ? `${viewDialog.contract.employee.surname} ${viewDialog.contract.employee.name}`
                                            : '-'}
                                    </p>
                                    {viewDialog.contract.employee && (
                                        <p className="mt-1 font-mono text-xs text-muted-foreground">
                                            {t(
                                                'employees.contracts.matriculation_mobile',
                                            )}
                                            :{' '}
                                            {
                                                viewDialog.contract.employee
                                                    .matriculation_number
                                            }
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <Label className="text-xs text-muted-foreground">
                                        {t(
                                            'employees.contracts.view_label_employer',
                                        )}
                                    </Label>
                                    <p className="text-sm font-medium">
                                        {viewDialog.contract.supplier
                                            ?.company_name || '-'}
                                    </p>
                                    {viewDialog.contract.supplier && (
                                        <p className="mt-1 font-mono text-xs text-muted-foreground">
                                            {t(
                                                'employees.contracts.view_label_code',
                                            )}
                                            :{' '}
                                            {viewDialog.contract.supplier.code}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <Label className="text-xs text-muted-foreground">
                                        {t(
                                            'employees.contracts.view_label_pay_level',
                                        )}
                                    </Label>
                                    <p className="text-sm">
                                        <span className="inline-flex items-center rounded-full bg-muted px-2 py-1 text-xs font-medium">
                                            {viewDialog.contract
                                                .pay_level_label ||
                                                t(
                                                    PAY_LEVEL_KEYS[
                                                        viewDialog.contract
                                                            .pay_level
                                                    ] ?? 'common.not_available',
                                                )}
                                        </span>
                                    </p>
                                </div>
                                <div>
                                    <Label className="text-xs text-muted-foreground">
                                        {t(
                                            'employees.contracts.view_label_start_date',
                                        )}
                                    </Label>
                                    <p className="text-sm">
                                        {formatDate(
                                            viewDialog.contract.start_date,
                                        )}
                                    </p>
                                </div>
                                <div>
                                    <Label className="text-xs text-muted-foreground">
                                        {t(
                                            'employees.contracts.view_label_end_date',
                                        )}
                                    </Label>
                                    <p className="text-sm">
                                        {formatDate(
                                            viewDialog.contract.end_date ??
                                                null,
                                            t(
                                                'employees.contracts.indeterminate',
                                            ),
                                        )}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {/* Dialog di modifica */}
            <EditContractDialog
                open={editDialog.open}
                contract={editDialog.contract}
                employees={employees}
                suppliers={suppliers}
                onClose={() => setEditDialog({ open: false, contract: null })}
            />

            {/* Dialog di eliminazione */}
            <ConfirmDeleteDialog
                open={deleteDialog.open}
                onOpenChange={(open) =>
                    setDeleteDialog({ open, contract: null })
                }
                onConfirm={handleDeleteConfirm}
                isLoading={isDeleting}
                title={t('employees.contracts.delete_title')}
                description={t('employees.contracts.delete_description')}
                itemName={
                    deleteDialog.contract?.employee
                        ? `${deleteDialog.contract.employee.surname} ${deleteDialog.contract.employee.name}`
                        : undefined
                }
            />
        </AppLayout>
    );
}

// Componente per il dialogo di modifica
function EditContractDialog({
    open,
    contract,
    employees,
    suppliers,
    onClose,
}: {
    open: boolean;
    contract: EmployeeContract | null;
    employees: Employee[];
    suppliers: Supplier[];
    onClose: () => void;
}) {
    const { t } = useTranslations();
    const { data, setData, put, processing, errors } = useForm<{
        employee_uuid: string;
        supplier_uuid: string;
        start_date: string;
        end_date: string;
        pay_level: string;
    }>({
        employee_uuid: contract?.employee?.uuid || '',
        supplier_uuid: contract?.supplier?.uuid || '',
        start_date: contract?.start_date
            ? contract.start_date.split('T')[0]
            : '',
        end_date: contract?.end_date ? contract.end_date.split('T')[0] : '',
        pay_level: contract?.pay_level?.toString() || '0',
    });

    useEffect(() => {
        if (contract) {
            setData('employee_uuid', contract.employee?.uuid || '');
            setData('supplier_uuid', contract.supplier?.uuid || '');
            setData('start_date', contract.start_date.split('T')[0]);
            setData(
                'end_date',
                contract.end_date ? contract.end_date.split('T')[0] : '',
            );
            setData('pay_level', contract.pay_level?.toString() || '0');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps -- setData from useForm is stable
    }, [contract]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!contract) return;

        put(`/employees/contracts/${contract.uuid}`, {
            preserveScroll: true,
            onSuccess: () => {
                onClose();
            },
        });
    };

    return (
        <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>
                        {t('employees.contracts.edit_dialog_title')}
                    </DialogTitle>
                    <DialogDescription asChild>
                        <span>
                            {t('employees.contracts.edit_dialog_description')}
                        </span>
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="employee_uuid">
                            {t('employees.contracts.edit_employee_label')}
                        </Label>
                        <Select
                            value={data.employee_uuid}
                            onValueChange={(value) =>
                                setData('employee_uuid', value)
                            }
                            required
                        >
                            <SelectTrigger
                                className={
                                    errors.employee_uuid
                                        ? 'border-destructive'
                                        : ''
                                }
                            >
                                <SelectValue
                                    placeholder={t(
                                        'employees.contracts.edit_employee_placeholder',
                                    )}
                                />
                            </SelectTrigger>
                            <SelectContent>
                                {employees
                                    .filter((emp) => emp.uuid)
                                    .map((emp) => (
                                        <SelectItem
                                            key={emp.uuid}
                                            value={emp.uuid}
                                        >
                                            {emp.surname} {emp.name} (
                                            {emp.matriculation_number})
                                        </SelectItem>
                                    ))}
                            </SelectContent>
                        </Select>
                        {errors.employee_uuid && (
                            <p className="text-xs text-destructive">
                                {errors.employee_uuid}
                            </p>
                        )}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="supplier_uuid">
                            {t('employees.contracts.edit_employer_label')}
                        </Label>
                        <Select
                            value={data.supplier_uuid}
                            onValueChange={(value) =>
                                setData('supplier_uuid', value)
                            }
                            required
                        >
                            <SelectTrigger
                                className={
                                    errors.supplier_uuid
                                        ? 'border-destructive'
                                        : ''
                                }
                            >
                                <SelectValue
                                    placeholder={t(
                                        'employees.contracts.edit_employer_placeholder',
                                    )}
                                />
                            </SelectTrigger>
                            <SelectContent>
                                {suppliers
                                    .filter((sup) => sup.uuid)
                                    .map((sup) => (
                                        <SelectItem
                                            key={sup.uuid}
                                            value={sup.uuid}
                                        >
                                            {sup.company_name} ({sup.code})
                                        </SelectItem>
                                    ))}
                            </SelectContent>
                        </Select>
                        {errors.supplier_uuid && (
                            <p className="text-xs text-destructive">
                                {errors.supplier_uuid}
                            </p>
                        )}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="start_date">
                            {t('employees.contracts.edit_start_date_label')}
                        </Label>
                        <Input
                            id="start_date"
                            type="date"
                            value={data.start_date}
                            onChange={(e) =>
                                setData('start_date', e.target.value)
                            }
                            required
                            className={
                                errors.start_date ? 'border-destructive' : ''
                            }
                        />
                        {errors.start_date && (
                            <p className="text-xs text-destructive">
                                {errors.start_date}
                            </p>
                        )}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="end_date">
                            {t('employees.contracts.edit_end_date_label')}
                        </Label>
                        <Input
                            id="end_date"
                            type="date"
                            value={data.end_date}
                            onChange={(e) =>
                                setData('end_date', e.target.value)
                            }
                            className={
                                errors.end_date ? 'border-destructive' : ''
                            }
                        />
                        {errors.end_date && (
                            <p className="text-xs text-destructive">
                                {errors.end_date}
                            </p>
                        )}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="pay_level">
                            {t('employees.contracts.edit_pay_level_label')}
                        </Label>
                        <Select
                            value={data.pay_level}
                            onValueChange={(value) =>
                                setData('pay_level', value)
                            }
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="0">
                                    {t('employees.contracts.pay_level_4')}
                                </SelectItem>
                                <SelectItem value="1">
                                    {t('employees.contracts.pay_level_5')}
                                </SelectItem>
                                <SelectItem value="2">
                                    {t('employees.contracts.pay_level_6')}
                                </SelectItem>
                                <SelectItem value="3">
                                    {t('employees.contracts.pay_level_7')}
                                </SelectItem>
                                <SelectItem value="4">
                                    {t('employees.contracts.pay_level_8')}
                                </SelectItem>
                            </SelectContent>
                        </Select>
                        {errors.pay_level && (
                            <p className="text-xs text-destructive">
                                {errors.pay_level}
                            </p>
                        )}
                    </div>
                    <div className="flex justify-end gap-2 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            disabled={processing}
                        >
                            {t('common.cancel')}
                        </Button>
                        <Button type="submit" disabled={processing}>
                            {processing
                                ? t('employees.create.saving')
                                : t('common.save')}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
