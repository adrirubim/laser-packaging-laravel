import { FormLabel } from '@/components/FormLabel';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useFieldValidation } from '@/hooks/useFieldValidation';
import AppLayout from '@/layouts/app-layout';
import { validationRules } from '@/lib/validation/rules';
import * as employeesContractsRoutes from '@/routes/employees/contracts/index';
import employeesRoutes from '@/routes/employees/index';
import { type BreadcrumbItem } from '@/types';
import { Form, Head, router, usePage } from '@inertiajs/react';
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
    uuid: string;
    employee?: Employee | null;
    supplier?: Supplier | null;
    pay_level: number;
    start_date: string;
    end_date?: string | null;
};

type ContractsEditProps = {
    contract: EmployeeContract;
    employees: Employee[];
    suppliers: Supplier[];
    errors?: Record<string, string>;
};

export default function ContractsEdit({
    errors: serverErrors,
}: ContractsEditProps) {
    const { props } = usePage<ContractsEditProps>();
    const { contract, employees, suppliers } = props;

    const [employeeUuid, setEmployeeUuid] = useState(
        contract.employee?.uuid || '',
    );
    const [supplierUuid, setSupplierUuid] = useState(
        contract.supplier?.uuid || '',
    );
    const [startDate, setStartDate] = useState(
        contract.start_date ? contract.start_date.split('T')[0] : '',
    );
    const [endDate, setEndDate] = useState(
        contract.end_date ? contract.end_date.split('T')[0] : '',
    );
    const [payLevel, setPayLevel] = useState(
        contract.pay_level?.toString() || '0',
    );

    useEffect(() => {
        if (contract) {
            queueMicrotask(() => {
                setEmployeeUuid(contract.employee?.uuid || '');
                setSupplierUuid(contract.supplier?.uuid || '');
                setStartDate(
                    contract.start_date
                        ? contract.start_date.split('T')[0]
                        : '',
                );
                setEndDate(
                    contract.end_date ? contract.end_date.split('T')[0] : '',
                );
                setPayLevel(contract.pay_level?.toString() || '0');
            });
        }
    }, [contract]);

    const employeeValidation = useFieldValidation(employeeUuid, [
        validationRules.required('Il dipendente è obbligatorio'),
    ]);

    const supplierValidation = useFieldValidation(supplierUuid, [
        validationRules.required('Il datore di lavoro è obbligatorio'),
    ]);

    const startDateValidation = useFieldValidation(startDate, [
        validationRules.required('La data di inizio è obbligatoria'),
    ]);

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Personale',
            href: employeesRoutes.index().url,
        },
        {
            title: 'Contratti',
            href: employeesContractsRoutes.index().url,
        },
        {
            title: 'Modifica Contratto',
            href: `/employees/contracts/${contract.uuid}/edit`,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Modifica Contratto" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <Card>
                    <CardHeader>
                        <CardTitle>Modifica Contratto</CardTitle>
                        <CardDescription>
                            Modifica le informazioni del contratto
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Form
                            action={
                                employeesContractsRoutes.update({
                                    contract: contract.uuid,
                                }).url
                            }
                            method="put"
                            className="space-y-6"
                        >
                            {({ processing, errors }) => {
                                const allErrors = {
                                    ...errors,
                                    ...serverErrors,
                                };

                                return (
                                    <>
                                        <div className="grid gap-2">
                                            <FormLabel
                                                htmlFor="employee_uuid"
                                                required
                                            >
                                                Dipendente
                                            </FormLabel>
                                            <Select
                                                value={employeeUuid}
                                                onValueChange={(value) => {
                                                    setEmployeeUuid(value);
                                                    employeeValidation.onBlur();
                                                }}
                                                required
                                            >
                                                <SelectTrigger
                                                    className={
                                                        employeeValidation.error
                                                            ? 'border-destructive'
                                                            : ''
                                                    }
                                                    aria-invalid={
                                                        employeeValidation.error
                                                            ? 'true'
                                                            : 'false'
                                                    }
                                                >
                                                    <SelectValue placeholder="Seleziona un dipendente" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {employees
                                                        .filter(
                                                            (emp) => emp.uuid,
                                                        )
                                                        .map((emp) => (
                                                            <SelectItem
                                                                key={emp.uuid}
                                                                value={emp.uuid}
                                                            >
                                                                {emp.surname}{' '}
                                                                {emp.name} (
                                                                {
                                                                    emp.matriculation_number
                                                                }
                                                                )
                                                            </SelectItem>
                                                        ))}
                                                </SelectContent>
                                            </Select>
                                            {employeeValidation.error && (
                                                <p className="text-xs text-destructive">
                                                    {employeeValidation.error}
                                                </p>
                                            )}
                                            <InputError
                                                message={
                                                    allErrors.employee_uuid
                                                }
                                            />
                                        </div>

                                        <div className="grid gap-2">
                                            <FormLabel
                                                htmlFor="supplier_uuid"
                                                required
                                            >
                                                Datore di Lavoro
                                            </FormLabel>
                                            <Select
                                                value={supplierUuid}
                                                onValueChange={(value) => {
                                                    setSupplierUuid(value);
                                                    supplierValidation.onBlur();
                                                }}
                                                required
                                            >
                                                <SelectTrigger
                                                    className={
                                                        supplierValidation.error
                                                            ? 'border-destructive'
                                                            : ''
                                                    }
                                                    aria-invalid={
                                                        supplierValidation.error
                                                            ? 'true'
                                                            : 'false'
                                                    }
                                                >
                                                    <SelectValue placeholder="Seleziona un datore di lavoro" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {suppliers
                                                        .filter(
                                                            (sup) => sup.uuid,
                                                        )
                                                        .map((sup) => (
                                                            <SelectItem
                                                                key={sup.uuid}
                                                                value={sup.uuid}
                                                            >
                                                                {
                                                                    sup.company_name
                                                                }{' '}
                                                                ({sup.code})
                                                            </SelectItem>
                                                        ))}
                                                </SelectContent>
                                            </Select>
                                            {supplierValidation.error && (
                                                <p className="text-xs text-destructive">
                                                    {supplierValidation.error}
                                                </p>
                                            )}
                                            <InputError
                                                message={
                                                    allErrors.supplier_uuid
                                                }
                                            />
                                        </div>

                                        <div className="grid gap-2 md:grid-cols-2">
                                            <div>
                                                <FormLabel
                                                    htmlFor="start_date"
                                                    required
                                                >
                                                    Data Inizio
                                                </FormLabel>
                                                <Input
                                                    id="start_date"
                                                    name="start_date"
                                                    type="date"
                                                    value={startDate}
                                                    onChange={(e) => {
                                                        setStartDate(
                                                            e.target.value,
                                                        );
                                                        startDateValidation.onBlur();
                                                    }}
                                                    onBlur={
                                                        startDateValidation.onBlur
                                                    }
                                                    required
                                                    aria-invalid={
                                                        startDateValidation.error
                                                            ? 'true'
                                                            : 'false'
                                                    }
                                                    className={
                                                        startDateValidation.error
                                                            ? 'border-destructive'
                                                            : ''
                                                    }
                                                />
                                                {startDateValidation.error && (
                                                    <p className="text-xs text-destructive">
                                                        {
                                                            startDateValidation.error
                                                        }
                                                    </p>
                                                )}
                                                <InputError
                                                    message={
                                                        allErrors.start_date
                                                    }
                                                />
                                            </div>
                                            <div>
                                                <FormLabel htmlFor="end_date">
                                                    Data Fine
                                                </FormLabel>
                                                <Input
                                                    id="end_date"
                                                    name="end_date"
                                                    type="date"
                                                    value={endDate}
                                                    onChange={(e) =>
                                                        setEndDate(
                                                            e.target.value,
                                                        )
                                                    }
                                                    min={startDate || undefined}
                                                />
                                                <InputError
                                                    message={allErrors.end_date}
                                                />
                                            </div>
                                        </div>

                                        <div className="grid gap-2">
                                            <FormLabel htmlFor="pay_level">
                                                Livello Retributivo
                                            </FormLabel>
                                            <Select
                                                value={payLevel}
                                                onValueChange={setPayLevel}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="0">
                                                        C3 (ex 5a)
                                                    </SelectItem>
                                                    <SelectItem value="1">
                                                        B1 (ex 5a Super)
                                                    </SelectItem>
                                                    <SelectItem value="2">
                                                        B2 (ex 6a)
                                                    </SelectItem>
                                                    <SelectItem value="3">
                                                        B3 (ex 7a)
                                                    </SelectItem>
                                                    <SelectItem value="4">
                                                        A1 (ex 8a Quadri)
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <InputError
                                                message={allErrors.pay_level}
                                            />
                                        </div>

                                        <input
                                            type="hidden"
                                            name="employee_uuid"
                                            value={employeeUuid}
                                        />
                                        <input
                                            type="hidden"
                                            name="supplier_uuid"
                                            value={supplierUuid}
                                        />
                                        <input
                                            type="hidden"
                                            name="pay_level"
                                            value={payLevel}
                                        />

                                        <div className="flex items-center gap-4">
                                            <Button
                                                type="submit"
                                                disabled={processing}
                                            >
                                                {processing
                                                    ? 'Aggiornando...'
                                                    : 'Aggiorna Contratto'}
                                            </Button>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() =>
                                                    router.visit(
                                                        employeesContractsRoutes.index()
                                                            .url,
                                                    )
                                                }
                                            >
                                                Annulla
                                            </Button>
                                        </div>
                                    </>
                                );
                            }}
                        </Form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
