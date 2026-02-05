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
            title: 'Ordini',
            href: orders.index().url,
        },
        {
            title: order.order_production_number,
            href: orders.show({ order: order.uuid }).url,
        },
        {
            title: 'Gestisci dipendenti',
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
                title={`Gestisci dipendenti - Ordine ${order.order_production_number}`}
            />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">
                            Gestisci dipendenti
                        </h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Ordine: {order.order_production_number}
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
                            aria-label="Salva assegnazioni dipendenti"
                        >
                            {processing ? (
                                <>
                                    <Loader2
                                        className="h-4 w-4 animate-spin"
                                        aria-hidden="true"
                                    />
                                    <span>Salvando...</span>
                                </>
                            ) : (
                                'Salva assegnazioni'
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
                            aria-label="Annulla e torna ai dettagli ordine"
                        >
                            Annulla
                        </Button>
                    </div>
                    {hasChanges && (
                        <div className="flex items-center gap-1 text-xs text-orange-600 dark:text-orange-400">
                            <AlertCircle className="h-3 w-3" />
                            Hai modifiche non salvate
                        </div>
                    )}
                </div>

                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle>Seleziona dipendenti</CardTitle>
                                <CardDescription>
                                    Scegli i dipendenti da assegnare a questo
                                    ordine
                                    {selectedEmployees.length > 0 && (
                                        <span className="ml-2 font-semibold text-primary">
                                            ({selectedEmployees.length}{' '}
                                            selezionati)
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
                                            ? 'Deseleziona tutti i dipendenti filtrati'
                                            : 'Seleziona tutti i dipendenti filtrati'
                                    }
                                >
                                    {allFilteredSelected ? (
                                        <>
                                            <Square
                                                className="h-4 w-4"
                                                aria-hidden="true"
                                            />
                                            Deseleziona tutti
                                        </>
                                    ) : (
                                        <>
                                            <CheckSquare
                                                className="h-4 w-4"
                                                aria-hidden="true"
                                            />
                                            Seleziona tutti
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
                                    placeholder="Cerca per nome, cognome o matricola..."
                                    value={searchQuery}
                                    onChange={(e) =>
                                        setSearchQuery(e.target.value)
                                    }
                                    className="pl-10"
                                    aria-label="Cerca dipendenti"
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
                                    Visualizzati {filteredEmployees.length} di{' '}
                                    {allEmployees.length} dipendenti
                                </p>
                            )}
                        </div>

                        {/* Elenco dipendenti */}
                        <div className="max-h-[500px] space-y-2 overflow-y-auto">
                            {filteredEmployees.length === 0 ? (
                                <div className="py-8 text-center text-muted-foreground">
                                    <AlertCircle className="mx-auto mb-4 h-12 w-12 opacity-50" />
                                    <p>Nessun dipendente trovato</p>
                                    {searchQuery && (
                                        <p className="mt-2 text-xs">
                                            Prova un altro termine di ricerca
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
                                            aria-label={`Seleziona ${employee.name} ${employee.surname}, matricola ${employee.matriculation_number}`}
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
                            Nessun dipendente selezionato
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            Non hai selezionato alcun dipendente per questo
                            ordine. Vuoi comunque salvare le assegnazioni (tutti
                            i dipendenti verranno rimossi)?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={processing}>
                            Annulla
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleConfirmNoEmployees}
                            disabled={processing}
                        >
                            Sì, continua
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
                            Modifiche non salvate
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            Hai modifiche non salvate alle assegnazioni dei
                            dipendenti. Vuoi davvero annullare e tornare ai
                            dettagli ordine senza salvare?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={processing}>
                            Continua a modificare
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
                            Sì, annulla le modifiche
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AppLayout>
    );
}
