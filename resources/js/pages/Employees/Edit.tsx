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
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { PasswordInput } from '@/components/ui/password-input';
import { useTranslations } from '@/hooks/use-translations';
import { useFieldValidation } from '@/hooks/useFieldValidation';
import AppLayout from '@/layouts/app-layout';
import { validationRules } from '@/lib/validation/rules';
import employees from '@/routes/employees/index';
import { type BreadcrumbItem } from '@/types';
import { Form, Head, router } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import { useState } from 'react';

type Employee = {
    id: number;
    uuid: string;
    name: string;
    surname: string;
    matriculation_number: string;
    portal_enabled: boolean;
};

type EmployeesEditProps = {
    employee: Employee;
    errors?: Record<string, string>;
};

export default function EmployeesEdit({
    employee,
    errors: serverErrors = {},
}: EmployeesEditProps) {
    const { t } = useTranslations();
    const [name, setName] = useState(employee.name);
    const [surname, setSurname] = useState(employee.surname);
    const [matriculationNumber, setMatriculationNumber] = useState(
        employee.matriculation_number,
    );
    const [password, setPassword] = useState('');
    const [showCloseConfirm, setShowCloseConfirm] = useState(false);

    const validationErrors = Object.fromEntries(
        Object.entries(serverErrors).filter(
            (entry): entry is [string, string] =>
                typeof entry[1] === 'string' && entry[1].length > 0,
        ),
    ) as Record<string, string>;

    const isDirty =
        name !== employee.name ||
        surname !== employee.surname ||
        matriculationNumber !== employee.matriculation_number ||
        password !== '';

    const nameValidation = useFieldValidation(name, [
        validationRules.required(t('validation.name_required')),
        validationRules.maxLength(255, t('validation.max_length_name')),
    ]);

    const surnameValidation = useFieldValidation(surname, [
        validationRules.required(t('validation.surname_required')),
        validationRules.maxLength(255, t('validation.max_length_surname')),
    ]);

    const matriculationNumberValidation = useFieldValidation(
        matriculationNumber,
        [
            validationRules.required(t('validation.matriculation_required')),
            validationRules.maxLength(
                255,
                t('validation.max_length_matriculation'),
            ),
        ],
    );

    const passwordValidation = useFieldValidation(password, [
        (value) => {
            if (!value) return null; // Opzionale in Modifica
            if (value.length < 6) {
                return t('validation.password_min_length', { min: 6 });
            }
            return null;
        },
    ]);

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: t('nav.personale'),
            href: employees.index().url,
        },
        {
            title: employee.matriculation_number,
            href: employees.show({ employee: employee.uuid }).url,
        },
        {
            title: t('common.edit'),
            href: employees.edit({ employee: employee.uuid }).url,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head
                title={t('employees.edit.page_title', {
                    matriculation: employee.matriculation_number,
                })}
            />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex justify-between">
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
                    message={t('employees.create.validation_message')}
                    showOnSubmit={false}
                />

                <div className="flex w-full justify-center">
                    <div className="w-full max-w-4xl space-y-5">
                        <Card>
                            <CardHeader>
                                <CardTitle>
                                    {t('employees.edit.card_title')}
                                </CardTitle>
                                <CardDescription>
                                    {t('employees.edit.card_description')}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Form
                                    action={
                                        employees.update({
                                            employee: employee.uuid,
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
                                                <div className="grid gap-2 md:grid-cols-2">
                                                    <div>
                                                        <FormLabel
                                                            htmlFor="name"
                                                            required
                                                        >
                                                            {t(
                                                                'employees.create.name_label',
                                                            )}
                                                        </FormLabel>
                                                        <Input
                                                            id="name"
                                                            name="name"
                                                            value={name}
                                                            onChange={(e) =>
                                                                setName(
                                                                    e.target
                                                                        .value,
                                                                )
                                                            }
                                                            onBlur={
                                                                nameValidation.onBlur
                                                            }
                                                            required
                                                            maxLength={255}
                                                            aria-invalid={
                                                                nameValidation.error
                                                                    ? 'true'
                                                                    : 'false'
                                                            }
                                                            className={
                                                                nameValidation.error
                                                                    ? 'border-destructive'
                                                                    : ''
                                                            }
                                                        />
                                                        {nameValidation.error && (
                                                            <p className="text-xs text-destructive">
                                                                {
                                                                    nameValidation.error
                                                                }
                                                            </p>
                                                        )}
                                                        <InputError
                                                            message={
                                                                allErrors.name
                                                            }
                                                        />
                                                    </div>
                                                    <div>
                                                        <FormLabel
                                                            htmlFor="surname"
                                                            required
                                                        >
                                                            {t(
                                                                'employees.create.surname_label',
                                                            )}
                                                        </FormLabel>
                                                        <Input
                                                            id="surname"
                                                            name="surname"
                                                            value={surname}
                                                            onChange={(e) =>
                                                                setSurname(
                                                                    e.target
                                                                        .value,
                                                                )
                                                            }
                                                            onBlur={
                                                                surnameValidation.onBlur
                                                            }
                                                            required
                                                            maxLength={255}
                                                            aria-invalid={
                                                                surnameValidation.error
                                                                    ? 'true'
                                                                    : 'false'
                                                            }
                                                            className={
                                                                surnameValidation.error
                                                                    ? 'border-destructive'
                                                                    : ''
                                                            }
                                                        />
                                                        {surnameValidation.error && (
                                                            <p className="text-xs text-destructive">
                                                                {
                                                                    surnameValidation.error
                                                                }
                                                            </p>
                                                        )}
                                                        <InputError
                                                            message={
                                                                allErrors.surname
                                                            }
                                                        />
                                                    </div>
                                                </div>

                                                <div className="grid gap-2">
                                                    <FormLabel
                                                        htmlFor="matriculation_number"
                                                        required
                                                    >
                                                        {t(
                                                            'employees.create.matriculation_label',
                                                        )}
                                                    </FormLabel>
                                                    <Input
                                                        id="matriculation_number"
                                                        name="matriculation_number"
                                                        value={
                                                            matriculationNumber
                                                        }
                                                        onChange={(e) =>
                                                            setMatriculationNumber(
                                                                e.target.value,
                                                            )
                                                        }
                                                        onBlur={
                                                            matriculationNumberValidation.onBlur
                                                        }
                                                        required
                                                        maxLength={255}
                                                        aria-invalid={
                                                            matriculationNumberValidation.error
                                                                ? 'true'
                                                                : 'false'
                                                        }
                                                        className={
                                                            matriculationNumberValidation.error
                                                                ? 'border-destructive'
                                                                : ''
                                                        }
                                                    />
                                                    {matriculationNumberValidation.error && (
                                                        <p className="text-xs text-destructive">
                                                            {
                                                                matriculationNumberValidation.error
                                                            }
                                                        </p>
                                                    )}
                                                    <InputError
                                                        message={
                                                            allErrors.matriculation_number
                                                        }
                                                    />
                                                </div>

                                                <div className="grid gap-2">
                                                    <FormLabel htmlFor="password">
                                                        {t(
                                                            'employees.edit.password_optional_label',
                                                        )}
                                                    </FormLabel>
                                                    <PasswordInput
                                                        id="password"
                                                        name="password"
                                                        value={password}
                                                        onChange={(e) =>
                                                            setPassword(
                                                                e.target.value,
                                                            )
                                                        }
                                                        onBlur={
                                                            passwordValidation.onBlur
                                                        }
                                                        minLength={6}
                                                        placeholder={t(
                                                            'employees.edit.password_placeholder',
                                                        )}
                                                        aria-invalid={
                                                            passwordValidation.error
                                                                ? 'true'
                                                                : 'false'
                                                        }
                                                        className={
                                                            passwordValidation.error
                                                                ? 'border-destructive'
                                                                : ''
                                                        }
                                                    />
                                                    {passwordValidation.error && (
                                                        <p className="text-xs text-destructive">
                                                            {
                                                                passwordValidation.error
                                                            }
                                                        </p>
                                                    )}
                                                    <InputError
                                                        message={
                                                            allErrors.password
                                                        }
                                                    />
                                                </div>

                                                <div className="flex items-center space-x-2">
                                                    <Checkbox
                                                        id="portal_enabled"
                                                        name="portal_enabled"
                                                        value="1"
                                                        defaultChecked={
                                                            employee.portal_enabled
                                                        }
                                                    />
                                                    <FormLabel
                                                        htmlFor="portal_enabled"
                                                        className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                                    >
                                                        {t(
                                                            'employees.create.portal_enable_label',
                                                        )}
                                                    </FormLabel>
                                                </div>
                                                <InputError
                                                    message={
                                                        allErrors.portal_enabled
                                                    }
                                                />

                                                <div className="flex items-center gap-4">
                                                    <Button
                                                        type="submit"
                                                        disabled={processing}
                                                    >
                                                        {processing
                                                            ? t(
                                                                  'employees.edit.saving',
                                                              )
                                                            : t(
                                                                  'employees.edit.submit_label',
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
                                                                      employees.show(
                                                                          {
                                                                              employee:
                                                                                  employee.uuid,
                                                                          },
                                                                      ).url,
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
                    router.visit(
                        employees.show({ employee: employee.uuid }).url,
                    );
                }}
                title={t('common.confirm_close.title')}
                description={t('common.confirm_close.description')}
            />
        </AppLayout>
    );
}
