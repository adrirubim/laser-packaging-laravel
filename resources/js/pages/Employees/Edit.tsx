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
import { useFieldValidation } from '@/hooks/useFieldValidation';
import AppLayout from '@/layouts/app-layout';
import { validationRules } from '@/lib/validation/rules';
import employees from '@/routes/employees/index';
import { type BreadcrumbItem } from '@/types';
import { Form, Head, router } from '@inertiajs/react';
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
    errors: serverErrors,
}: EmployeesEditProps) {
    const [name, setName] = useState(employee.name);
    const [surname, setSurname] = useState(employee.surname);
    const [matriculationNumber, setMatriculationNumber] = useState(
        employee.matriculation_number,
    );
    const [password, setPassword] = useState('');

    const nameValidation = useFieldValidation(name, [
        validationRules.required('Il nome è obbligatorio'),
        validationRules.maxLength(
            255,
            'Il nome non può superare i 255 caratteri',
        ),
    ]);

    const surnameValidation = useFieldValidation(surname, [
        validationRules.required('Il cognome è obbligatorio'),
        validationRules.maxLength(
            255,
            'Il cognome non può superare i 255 caratteri',
        ),
    ]);

    const matriculationNumberValidation = useFieldValidation(
        matriculationNumber,
        [
            validationRules.required('Il numero di matricola è obbligatorio'),
            validationRules.maxLength(
                255,
                'Il numero di matricola non può superare i 255 caratteri',
            ),
        ],
    );

    const passwordValidation = useFieldValidation(password, [
        (value) => {
            if (!value) return null; // Opzionale in Modifica
            if (value.length < 6) {
                return 'La password deve contenere almeno 6 caratteri';
            }
            return null;
        },
    ]);

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Personale',
            href: employees.index().url,
        },
        {
            title: employee.matriculation_number,
            href: employees.show({ employee: employee.uuid }).url,
        },
        {
            title: 'Modifica',
            href: employees.edit({ employee: employee.uuid }).url,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head
                title={`Modifica Dipendente ${employee.matriculation_number}`}
            />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex w-full justify-center">
                    <div className="w-full max-w-4xl space-y-5">
                        <Card>
                            <CardHeader>
                                <CardTitle>Gestione Dipendente</CardTitle>
                                <CardDescription>Modifica</CardDescription>
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
                                                            Nome
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
                                                            Cognome
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
                                                        Numero di matricola
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
                                                        Nuova password (lascia
                                                        vuoto per mantenere
                                                        l'attuale)
                                                    </FormLabel>
                                                    <Input
                                                        id="password"
                                                        name="password"
                                                        type="password"
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
                                                        placeholder="Minimo 6 caratteri"
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
                                                        Abilita accesso portale
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
                                                            ? 'Salvando...'
                                                            : 'Aggiorna Dipendente'}
                                                    </Button>
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        onClick={() =>
                                                            router.visit(
                                                                employees.show({
                                                                    employee:
                                                                        employee.uuid,
                                                                }).url,
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
        </AppLayout>
    );
}
