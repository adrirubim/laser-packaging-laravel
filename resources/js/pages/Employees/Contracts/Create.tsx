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

const PAY_LEVEL_VALUES = ['0', '1', '2', '3', '4', '5', '6', '7', '8'];

export default function ContractsCreate({
    employees,
    suppliers,
    prorogaContract,
    errors: serverErrors = {},
}: ContractsCreateProps) {
    const { t } = useTranslations();
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
            title: t('common.personnel'),
            href: employeesRoutes.index().url,
        },
        {
            title: t('employees.contracts.breadcrumb_contracts'),
            href: employeesContractsRoutes.index().url,
        },
        {
            title: t('employees.contracts.create_page_title'),
            href: employeesContractsRoutes.create().url,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('employees.contracts.create_page_title')} />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex w-full justify-center">
                    <div className="w-full max-w-4xl space-y-5">
                        <div className="flex items-center justify-between">
                            <Button
                                variant="outline"
                                onClick={() => setShowCloseConfirm(true)}
                                aria-label={t('employees.create.back_aria')}
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
                                    {t('employees.contracts.create_page_title')}
                                </CardTitle>
                                <CardDescription>
                                    {prorogaContract ? (
                                        <>
                                            {t(
                                                'employees.contracts.create_proroga_prefix',
                                            )}{' '}
                                            {prorogaContract.employee_name ??
                                                t(
                                                    'employees.contracts.employee_fallback',
                                                )}
                                            {prorogaContract.supplier_name &&
                                                ` – ${prorogaContract.supplier_name}`}
                                            .{' '}
                                            {t(
                                                'employees.contracts.create_proroga_suggested_start',
                                            )}{' '}
                                            {prorogaContract.start_date}.
                                        </>
                                    ) : (
                                        t(
                                            'employees.contracts.create_card_description',
                                        )
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
                                                        {t(
                                                            'employees.contracts.employee_label',
                                                        )}
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
                                                            <SelectValue
                                                                placeholder={t(
                                                                    'employees.contracts.edit_employee_placeholder',
                                                                )}
                                                            />
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
                                                        {t(
                                                            'employees.contracts.edit_employer_label',
                                                        )}
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
                                                            <SelectValue
                                                                placeholder={t(
                                                                    'employees.contracts.edit_employer_placeholder',
                                                                )}
                                                            />
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
                                                            {t(
                                                                'employees.contracts.end_date_optional_help',
                                                            )}
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
                                                        {t(
                                                            'employees.contracts.edit_pay_level_label',
                                                        )}
                                                    </FormLabel>
                                                    <Select
                                                        value={payLevel}
                                                        onValueChange={
                                                            setPayLevel
                                                        }
                                                    >
                                                        <SelectTrigger
                                                            id="pay_level"
                                                            aria-label={t(
                                                                'employees.show.pay_level_label',
                                                            )}
                                                        >
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {PAY_LEVEL_VALUES.map(
                                                                (val) => (
                                                                    <SelectItem
                                                                        key={
                                                                            val
                                                                        }
                                                                        value={
                                                                            val
                                                                        }
                                                                    >
                                                                        {t(
                                                                            `employees.contracts.pay_level_${val}`,
                                                                        )}
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
                                                            ? t(
                                                                  'employees.contracts.create_saving',
                                                              )
                                                            : t(
                                                                  'employees.contracts.create_submit',
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
                </div>
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
