import { ConfirmCloseDialog } from '@/components/confirm-close-dialog';
import { FormValidationNotification } from '@/components/form-validation-notification';
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
import { Form, Head, router } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import { useState } from 'react';

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

type ProrogaContract = {
    employee_uuid: string;
    supplier_uuid: string;
    pay_level: number;
    start_date: string;
    employee_name?: string;
    supplier_name?: string;
};

type ContractsCreateProps = {
    employees: Employee[];
    suppliers: Supplier[];
    prorogaContract?: ProrogaContract | null;
    errors?: Record<string, string>;
};

const PAY_LEVEL_OPTIONS: { value: string; label: string }[] = [
    { value: '0', label: 'D1 (ex 2a)' },
    { value: '1', label: 'D2 (ex 3a)' },
    { value: '2', label: 'C1 (ex 3a Super)' },
    { value: '3', label: 'C2 (ex 4a)' },
    { value: '4', label: 'C3 (ex 5a)' },
    { value: '5', label: 'B1 (ex 5a Super)' },
    { value: '6', label: 'B2 (ex 6a)' },
    { value: '7', label: 'B3 (ex 7a)' },
    { value: '8', label: 'A1 (ex 8a Quadri)' },
];

export default function ContractsCreate({
    employees,
    suppliers,
    prorogaContract,
    errors: serverErrors = {},
}: ContractsCreateProps) {
    const [employeeUuid, setEmployeeUuid] = useState(
        prorogaContract?.employee_uuid ?? '',
    );
    const [supplierUuid, setSupplierUuid] = useState(
        prorogaContract?.supplier_uuid ?? '',
    );
    const [startDate, setStartDate] = useState(
        prorogaContract?.start_date ?? '',
    );
    const [endDate, setEndDate] = useState('');
    const [payLevel, setPayLevel] = useState(
        String(prorogaContract?.pay_level ?? 0),
    );
    const [showCloseConfirm, setShowCloseConfirm] = useState(false);

    const validationErrors = Object.fromEntries(
        Object.entries(serverErrors).filter(
            (entry): entry is [string, string] =>
                typeof entry[1] === 'string' && entry[1].length > 0,
        ),
    ) as Record<string, string>;

    const isDirty =
        employeeUuid !== '' ||
        supplierUuid !== '' ||
        startDate !== '' ||
        endDate !== '' ||
        payLevel !== '0';

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
            title: 'Nuovo Contratto',
            href: employeesContractsRoutes.create().url,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Nuovo Contratto" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex w-full justify-center">
                    <div className="w-full max-w-4xl space-y-5">
                        <div className="flex items-center justify-between">
                            <Button
                                variant="outline"
                                onClick={() => setShowCloseConfirm(true)}
                                aria-label="Torna indietro"
                            >
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Indietro
                            </Button>
                        </div>

                        <FormValidationNotification
                            errors={validationErrors}
                            message="Correggi gli errori nel modulo prima di salvare."
                            showOnSubmit={false}
                        />

                        <Card>
                            <CardHeader>
                                <CardTitle>Nuovo Contratto</CardTitle>
                                <CardDescription>
                                    {prorogaContract ? (
                                        <>
                                            Nuovo contratto in proroga di{' '}
                                            {prorogaContract.employee_name ??
                                                'dipendente'}
                                            {prorogaContract.supplier_name &&
                                                ` – ${prorogaContract.supplier_name}`}
                                            . Data inizio suggerita:{' '}
                                            {prorogaContract.start_date}.
                                        </>
                                    ) : (
                                        'Crea un nuovo contratto per un dipendente'
                                    )}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Form
                                    action={
                                        employeesContractsRoutes.store().url
                                    }
                                    method="post"
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
                                                        onValueChange={(
                                                            value,
                                                        ) => {
                                                            setEmployeeUuid(
                                                                value,
                                                            );
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
                                                                    (emp) =>
                                                                        emp.uuid,
                                                                )
                                                                .map((emp) => (
                                                                    <SelectItem
                                                                        key={
                                                                            emp.uuid
                                                                        }
                                                                        value={
                                                                            emp.uuid
                                                                        }
                                                                    >
                                                                        {
                                                                            emp.surname
                                                                        }{' '}
                                                                        {
                                                                            emp.name
                                                                        }{' '}
                                                                        (
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
                                                            {
                                                                employeeValidation.error
                                                            }
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
                                                        onValueChange={(
                                                            value,
                                                        ) => {
                                                            setSupplierUuid(
                                                                value,
                                                            );
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
                                                                    (sup) =>
                                                                        sup.uuid,
                                                                )
                                                                .map((sup) => (
                                                                    <SelectItem
                                                                        key={
                                                                            sup.uuid
                                                                        }
                                                                        value={
                                                                            sup.uuid
                                                                        }
                                                                    >
                                                                        {
                                                                            sup.company_name
                                                                        }{' '}
                                                                        (
                                                                        {
                                                                            sup.code
                                                                        }
                                                                        )
                                                                    </SelectItem>
                                                                ))}
                                                        </SelectContent>
                                                    </Select>
                                                    {supplierValidation.error && (
                                                        <p className="text-xs text-destructive">
                                                            {
                                                                supplierValidation.error
                                                            }
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
                                                                    e.target
                                                                        .value,
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
                                                                    e.target
                                                                        .value,
                                                                )
                                                            }
                                                            min={
                                                                startDate ||
                                                                undefined
                                                            }
                                                            aria-describedby="end_date_help"
                                                        />
                                                        <p
                                                            id="end_date_help"
                                                            className="text-xs text-muted-foreground"
                                                        >
                                                            Opzionale. Se non
                                                            indicata, il
                                                            contratto è a tempo
                                                            indeterminato.
                                                        </p>
                                                        <InputError
                                                            message={
                                                                allErrors.end_date
                                                            }
                                                        />
                                                    </div>
                                                </div>

                                                <div className="grid gap-2">
                                                    <FormLabel htmlFor="pay_level">
                                                        Livello Retributivo
                                                    </FormLabel>
                                                    <Select
                                                        value={payLevel}
                                                        onValueChange={
                                                            setPayLevel
                                                        }
                                                    >
                                                        <SelectTrigger
                                                            id="pay_level"
                                                            aria-label="Livello retributivo"
                                                        >
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {PAY_LEVEL_OPTIONS.map(
                                                                (opt) => (
                                                                    <SelectItem
                                                                        key={
                                                                            opt.value
                                                                        }
                                                                        value={
                                                                            opt.value
                                                                        }
                                                                    >
                                                                        {
                                                                            opt.label
                                                                        }
                                                                    </SelectItem>
                                                                ),
                                                            )}
                                                        </SelectContent>
                                                    </Select>
                                                    <InputError
                                                        message={
                                                            allErrors.pay_level
                                                        }
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
                                                            ? 'Creando...'
                                                            : 'Crea Contratto'}
                                                    </Button>
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        onClick={() =>
                                                            isDirty
                                                                ? setShowCloseConfirm(
                                                                      true,
                                                                  )
                                                                : router.visit(
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
                </div>
            </div>

            <ConfirmCloseDialog
                open={showCloseConfirm}
                onOpenChange={setShowCloseConfirm}
                onConfirm={() => {
                    setShowCloseConfirm(false);
                    router.visit(employeesContractsRoutes.index().url);
                }}
                title="Conferma chiusura"
                description="Sei sicuro di voler uscire? I dati non salvati andranno persi."
            />
        </AppLayout>
    );
}
