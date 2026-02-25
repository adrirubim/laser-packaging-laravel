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
import { useTranslations } from '@/hooks/use-translations';
import { useFieldValidation } from '@/hooks/useFieldValidation';
import AppLayout from '@/layouts/app-layout';
import { validationRules } from '@/lib/validation/rules';
import * as employeesContractsRoutes from '@/routes/employees/contracts/index';
import employeesRoutes from '@/routes/employees/index';
import { type BreadcrumbItem } from '@/types';
import { Form, Head, router, usePage } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import { useEffect, useState } from 'react';

const PAY_LEVEL_KEYS = [
    'employees.contracts.pay_level_0',
    'employees.contracts.pay_level_1',
    'employees.contracts.pay_level_2',
    'employees.contracts.pay_level_3',
    'employees.contracts.pay_level_4',
    'employees.contracts.pay_level_5',
    'employees.contracts.pay_level_6',
    'employees.contracts.pay_level_7',
    'employees.contracts.pay_level_8',
];

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
    const { t } = useTranslations();
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
    const [showCloseConfirm, setShowCloseConfirm] = useState(false);

    const validationErrors = Object.fromEntries(
        Object.entries(serverErrors || {}).filter(
            (entry): entry is [string, string] =>
                typeof entry[1] === 'string' && entry[1].length > 0,
        ),
    ) as Record<string, string>;

    const isDirty =
        employeeUuid !== (contract.employee?.uuid || '') ||
        supplierUuid !== (contract.supplier?.uuid || '') ||
        startDate !==
            (contract.start_date ? contract.start_date.split('T')[0] : '') ||
        endDate !==
            (contract.end_date ? contract.end_date.split('T')[0] : '') ||
        payLevel !== (contract.pay_level?.toString() || '0');

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
        validationRules.required(t('validation.employee_required')),
    ]);

    const supplierValidation = useFieldValidation(supplierUuid, [
        validationRules.required(t('validation.employer_required')),
    ]);

    const startDateValidation = useFieldValidation(startDate, [
        validationRules.required(t('validation.start_date_required')),
    ]);

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: t('nav.personale'),
            href: employeesRoutes.index().url,
        },
        {
            title: t('nav.contratti'),
            href: employeesContractsRoutes.index().url,
        },
        {
            title: t('employees.contracts.edit_dialog_title'),
            href: `/employees/contracts/${contract.uuid}/edit`,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('employees.contracts.edit_dialog_title')} />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <Button
                        variant="outline"
                        onClick={() => setShowCloseConfirm(true)}
                        aria-label={t('employees.edit.back_aria')}
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        {t('common.back')}
                    </Button>
                </div>

                <FormValidationNotification
                    errors={validationErrors}
                    message={t('common.validation_fix_errors')}
                    showOnSubmit={false}
                />

                <Card>
                    <CardHeader>
                        <CardTitle>
                            {t('employees.contracts.edit_dialog_title')}
                        </CardTitle>
                        <CardDescription>
                            {t('employees.contracts.edit_dialog_description')}
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
                                                {t(
                                                    'employees.contracts.edit_employee_label',
                                                )}
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
                                                    <SelectValue
                                                        placeholder={t(
                                                            'employees.contracts.edit_employee_placeholder',
                                                        )}
                                                    />
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
                                                {t(
                                                    'employees.contracts.edit_employer_label',
                                                )}
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
                                                    <SelectValue
                                                        placeholder={t(
                                                            'employees.contracts.edit_employer_placeholder',
                                                        )}
                                                    />
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
                                                    {t(
                                                        'employees.contracts.edit_start_date_label',
                                                    )}
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
                                                    {t(
                                                        'employees.contracts.edit_end_date_label',
                                                    )}
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
                                                {t(
                                                    'employees.contracts.edit_pay_level_label',
                                                )}
                                            </FormLabel>
                                            <Select
                                                value={payLevel}
                                                onValueChange={setPayLevel}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {PAY_LEVEL_KEYS.map(
                                                        (key, idx) => (
                                                            <SelectItem
                                                                key={idx}
                                                                value={String(
                                                                    idx,
                                                                )}
                                                            >
                                                                {t(key)}
                                                            </SelectItem>
                                                        ),
                                                    )}
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
                                                    ? t(
                                                          'employees.contracts.updating',
                                                      )
                                                    : t(
                                                          'employees.contracts.update_contract',
                                                      )}
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
                                                {t('common.cancel')}
                                            </Button>
                                        </div>
                                    </>
                                );
                            }}
                        </Form>
                    </CardContent>
                </Card>
            </div>

            <ConfirmCloseDialog
                open={showCloseConfirm}
                onOpenChange={setShowCloseConfirm}
                onConfirm={() => {
                    setShowCloseConfirm(false);
                    router.visit(employeesContractsRoutes.index().url);
                }}
                title={t('common.confirm_close.title')}
                description={t('common.confirm_close.description')}
            />
        </AppLayout>
    );
}
