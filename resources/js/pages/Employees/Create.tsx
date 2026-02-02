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
import employees from '@/routes/employees';
import { type BreadcrumbItem } from '@/types';
import { Form, Head, router } from '@inertiajs/react';
import { useState } from 'react';

type EmployeesCreateProps = {
    errors?: Record<string, string>;
};

export default function EmployeesCreate({
    errors: serverErrors,
}: EmployeesCreateProps) {
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [matriculationNumber, setMatriculationNumber] = useState('');
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
        validationRules.required('La password è obbligatoria'),
        validationRules.minLength(
            6,
            'La password deve contenere almeno 6 caratteri',
        ),
    ]);

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Personale',
            href: employees.index().url,
        },
        {
            title: 'Crea',
            href: employees.create().url,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Crea Dipendente" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <Card>
                    <CardHeader>
                        <CardTitle>Gestione Dipendente</CardTitle>
                        <CardDescription>
                            Inserimento nuovo dipendente
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Form
                            action={employees.store().url}
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
                                                        setName(e.target.value)
                                                    }
                                                    onBlur={
                                                        nameValidation.onBlur
                                                    }
                                                    required
                                                    placeholder="Nome"
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
                                                        {nameValidation.error}
                                                    </p>
                                                )}
                                                <InputError
                                                    message={allErrors.name}
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
                                                            e.target.value,
                                                        )
                                                    }
                                                    onBlur={
                                                        surnameValidation.onBlur
                                                    }
                                                    required
                                                    placeholder="Cognome"
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
                                                    message={allErrors.surname}
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
                                                value={matriculationNumber}
                                                onChange={(e) =>
                                                    setMatriculationNumber(
                                                        e.target.value,
                                                    )
                                                }
                                                onBlur={
                                                    matriculationNumberValidation.onBlur
                                                }
                                                required
                                                placeholder="Numero di matricola"
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
                                            <FormLabel
                                                htmlFor="password"
                                                required
                                            >
                                                Password
                                            </FormLabel>
                                            <Input
                                                id="password"
                                                name="password"
                                                type="password"
                                                value={password}
                                                onChange={(e) =>
                                                    setPassword(e.target.value)
                                                }
                                                onBlur={
                                                    passwordValidation.onBlur
                                                }
                                                required
                                                minLength={6}
                                                placeholder="Almeno 6 caratteri"
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
                                                    {passwordValidation.error}
                                                </p>
                                            )}
                                            <InputError
                                                message={allErrors.password}
                                            />
                                        </div>

                                        <div className="flex items-center space-x-2">
                                            <Checkbox
                                                id="portal_enabled"
                                                name="portal_enabled"
                                                value="1"
                                            />
                                            <FormLabel
                                                htmlFor="portal_enabled"
                                                className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                            >
                                                Abilita accesso portale
                                            </FormLabel>
                                        </div>
                                        <InputError
                                            message={allErrors.portal_enabled}
                                        />

                                        <div className="flex items-center gap-4">
                                            <Button
                                                type="submit"
                                                disabled={processing}
                                            >
                                                {processing
                                                    ? 'Salvando...'
                                                    : 'Crea Dipendente'}
                                            </Button>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() =>
                                                    router.visit(
                                                        employees.index().url,
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
