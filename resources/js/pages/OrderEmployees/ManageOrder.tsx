import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useTranslations } from '@/hooks/use-translations';
import AppLayout from '@/layouts/app-layout';
import orderEmployees from '@/routes/order-employees/index';
import orders from '@/routes/orders/index';
import { type BreadcrumbItem } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import {
    AlertCircle,
    CheckSquare,
    Loader2,
    Search,
    Square,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

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

type OrderEmployeesManageOrderProps = {
    order: Order;
    assignedEmployees: Employee[];
    allEmployees: Employee[];
};

export default function OrderEmployeesManageOrder() {
    const { props } = usePage<OrderEmployeesManageOrderProps>();
    const { order, assignedEmployees, allEmployees } = props;
    const { t } = useTranslations();

    const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);
    const [processing, setProcessing] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [hasChanges, setHasChanges] = useState(false);
    const [confirmNoEmployeesOpen, setConfirmNoEmployeesOpen] = useState(false);
    const [confirmDiscardOpen, setConfirmDiscardOpen] = useState(false);

    // Initialize selected employees from assigned employees
    useEffect(() => {
        const initialSelected = assignedEmployees.map((emp) => emp.uuid);
        queueMicrotask(() => {
            setSelectedEmployees(initialSelected);
            setHasChanges(false);
        });
    }, [assignedEmployees]);

    // Filtrare dipendenti in base alla ricerca
    const filteredEmployees = useMemo(() => {
        if (!searchQuery.trim()) {
            return allEmployees;
        }
        const query = searchQuery.toLowerCase();
        return allEmployees.filter(
            (emp) =>
                emp.name.toLowerCase().includes(query) ||
                emp.surname.toLowerCase().includes(query) ||
                emp.matriculation_number.toLowerCase().includes(query) ||
                `${emp.name} ${emp.surname}`.toLowerCase().includes(query),
        );
    }, [allEmployees, searchQuery]);

    // Track changes
    useEffect(() => {
        const initialSelected = assignedEmployees.map((emp) => emp.uuid);
        const hasChanged =
            selectedEmployees.length !== initialSelected.length ||
            selectedEmployees.some((uuid) => !initialSelected.includes(uuid)) ||
            initialSelected.some((uuid) => !selectedEmployees.includes(uuid));
        queueMicrotask(() => setHasChanges(hasChanged));
    }, [selectedEmployees, assignedEmployees]);

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: t('nav.orders'),
            href: orders.index().url,
        },
        {
            title: order.order_production_number,
            href: orders.show({ order: order.uuid }).url,
        },
        {
            title: t('order_employees.manage_title'),
            href: `/orders/${order.uuid}/manage-employees`,
        },
    ];

    const handleToggleEmployee = (employeeUuid: string) => {
        setSelectedEmployees((prev) =>
            prev.includes(employeeUuid)
                ? prev.filter((uuid) => uuid !== employeeUuid)
                : [...prev, employeeUuid],
        );
    };

    const handleSelectAll = () => {
        if (selectedEmployees.length === filteredEmployees.length) {
            // Deseleziona tutti
            setSelectedEmployees([]);
        } else {
            // Seleziona tutti i dipendenti filtrati
            setSelectedEmployees(filteredEmployees.map((emp) => emp.uuid));
        }
    };

    const performSave = () => {
        setProcessing(true);
        router.post(
            orderEmployees.saveAssignments().url,
            {
                order_uuid: order.uuid,
                employee_list: selectedEmployees,
            },
            {
                onFinish: () => setProcessing(false),
                onSuccess: () => {
                    router.visit(orders.show({ order: order.uuid }).url);
                },
                onError: (errors) => {
                    console.error('Errore salvataggio assegnazioni:', errors);
                    // Gestione errori tramite Inertia
                },
            },
        );
    };

    const handleSave = () => {
        // Validazione: nessun dipendente selezionato
        if (selectedEmployees.length === 0) {
            // Apri dialogo di conferma ma consenti comunque il salvataggio
            setConfirmNoEmployeesOpen(true);
            return;
        }

        performSave();
    };

    const handleConfirmNoEmployees = () => {
        setConfirmNoEmployeesOpen(false);
        performSave();
    };

    const allFilteredSelected =
        filteredEmployees.length > 0 &&
        filteredEmployees.every((emp) => selectedEmployees.includes(emp.uuid));

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head
                title={t('order_employees.manage_page_title', {
                    order_number: order.order_production_number,
                })}
            />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">
                            {t('order_employees.manage_title')}
                        </h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            {t('common.order')}: {order.order_production_number}
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Button
                            onClick={handleSave}
                            disabled={
                                processing ||
                                (!hasChanges &&
                                    selectedEmployees.length ===
                                        assignedEmployees.length)
                            }
                            className="gap-2"
                            aria-label={t(
                                'order_employees.save_assignments_aria',
                            )}
                        >
                            {processing ? (
                                <>
                                    <Loader2
                                        className="h-4 w-4 animate-spin"
                                        aria-hidden="true"
                                    />
                                    <span>{t('common.saving')}</span>
                                </>
                            ) : (
                                t('order_employees.save_assignments')
                            )}
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => {
                                if (hasChanges) {
                                    setConfirmDiscardOpen(true);
                                    return;
                                }
                                router.visit(
                                    orders.show({ order: order.uuid }).url,
                                );
                            }}
                            disabled={processing}
                            aria-label={t('order_employees.cancel_aria')}
                        >
                            {t('common.cancel')}
                        </Button>
                    </div>
                    {hasChanges && (
                        <div className="flex items-center gap-1 text-xs text-orange-600 dark:text-orange-400">
                            <AlertCircle className="h-3 w-3" />
                            {t('order_employees.unsaved_changes')}
                        </div>
                    )}
                </div>

                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle>
                                    {t(
                                        'order_employees.select_employees_title',
                                    )}
                                </CardTitle>
                                <CardDescription>
                                    {t(
                                        'order_employees.select_employees_description',
                                    )}
                                    {selectedEmployees.length > 0 && (
                                        <span className="ml-2 font-semibold text-primary">
                                            (
                                            {t(
                                                'order_employees.selected_count',
                                                {
                                                    count: selectedEmployees.length,
                                                },
                                            )}
                                            )
                                        </span>
                                    )}
                                </CardDescription>
                            </div>
                            {filteredEmployees.length > 0 && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleSelectAll}
                                    className="gap-2"
                                    aria-label={
                                        allFilteredSelected
                                            ? t(
                                                  'order_employees.deselect_all_aria',
                                              )
                                            : t(
                                                  'order_employees.select_all_aria',
                                              )
                                    }
                                >
                                    {allFilteredSelected ? (
                                        <>
                                            <Square
                                                className="h-4 w-4"
                                                aria-hidden="true"
                                            />
                                            {t('order_employees.deselect_all')}
                                        </>
                                    ) : (
                                        <>
                                            <CheckSquare
                                                className="h-4 w-4"
                                                aria-hidden="true"
                                            />
                                            {t('order_employees.select_all')}
                                        </>
                                    )}
                                </Button>
                            )}
                        </div>
                    </CardHeader>
                    <CardContent>
                        {/* Cerca dipendenti */}
                        <div className="mb-4">
                            <div className="relative">
                                <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-muted-foreground" />
                                <Input
                                    type="text"
                                    placeholder={t(
                                        'order_employees.search_placeholder',
                                    )}
                                    value={searchQuery}
                                    onChange={(e) =>
                                        setSearchQuery(e.target.value)
                                    }
                                    className="pl-10"
                                    aria-label={t(
                                        'order_employees.search_aria',
                                    )}
                                    aria-describedby="search-help"
                                />
                            </div>
                            {searchQuery && (
                                <p
                                    id="search-help"
                                    className="mt-2 text-xs text-muted-foreground"
                                    role="status"
                                    aria-live="polite"
                                >
                                    {t('order_employees.search_results', {
                                        shown: filteredEmployees.length,
                                        total: allEmployees.length,
                                    })}
                                </p>
                            )}
                        </div>

                        {/* Elenco dipendenti */}
                        <div className="max-h-[500px] space-y-2 overflow-y-auto">
                            {filteredEmployees.length === 0 ? (
                                <div className="py-8 text-center text-muted-foreground">
                                    <AlertCircle className="mx-auto mb-4 h-12 w-12 opacity-50" />
                                    <p>
                                        {t(
                                            'order_employees.no_employees_found',
                                        )}
                                    </p>
                                    {searchQuery && (
                                        <p className="mt-2 text-xs">
                                            {t(
                                                'order_employees.try_another_search',
                                            )}
                                        </p>
                                    )}
                                </div>
                            ) : (
                                filteredEmployees.map((employee) => (
                                    <div
                                        key={employee.uuid}
                                        className={`flex items-center space-x-2 rounded-lg border p-3 transition-colors ${
                                            selectedEmployees.includes(
                                                employee.uuid,
                                            )
                                                ? 'border-primary/30 bg-primary/5'
                                                : 'hover:bg-muted/40'
                                        }`}
                                    >
                                        <input
                                            type="checkbox"
                                            id={`employee-${employee.uuid}`}
                                            checked={selectedEmployees.includes(
                                                employee.uuid,
                                            )}
                                            onChange={() =>
                                                handleToggleEmployee(
                                                    employee.uuid,
                                                )
                                            }
                                            className="h-4 w-4 cursor-pointer rounded border-gray-300 focus:ring-2 focus:ring-primary focus:ring-offset-2"
                                            aria-label={t(
                                                'order_employees.select_employee_aria',
                                                {
                                                    name: employee.name,
                                                    surname: employee.surname,
                                                    matriculation:
                                                        employee.matriculation_number,
                                                },
                                            )}
                                            aria-describedby={`employee-info-${employee.uuid}`}
                                        />
                                        <label
                                            htmlFor={`employee-${employee.uuid}`}
                                            className="flex-1 cursor-pointer"
                                            id={`employee-info-${employee.uuid}`}
                                        >
                                            <div className="font-medium">
                                                {employee.name}{' '}
                                                {employee.surname}
                                            </div>
                                            <div className="font-mono text-sm text-muted-foreground">
                                                {employee.matriculation_number}
                                            </div>
                                        </label>
                                    </div>
                                ))
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
            <AlertDialog
                open={confirmNoEmployeesOpen}
                onOpenChange={setConfirmNoEmployeesOpen}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            {t('order_employees.no_employee_selected_title')}
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            {t(
                                'order_employees.no_employee_selected_description',
                            )}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={processing}>
                            {t('common.cancel')}
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleConfirmNoEmployees}
                            disabled={processing}
                        >
                            {t('order_employees.yes_continue')}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <AlertDialog
                open={confirmDiscardOpen}
                onOpenChange={setConfirmDiscardOpen}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            {t('order_employees.unsaved_changes_title')}
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            {t('order_employees.unsaved_changes_description')}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={processing}>
                            {t('order_employees.continue_editing')}
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => {
                                setConfirmDiscardOpen(false);
                                router.visit(
                                    orders.show({ order: order.uuid }).url,
                                );
                            }}
                            disabled={processing}
                        >
                            {t('order_employees.discard_confirm')}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AppLayout>
    );
}
