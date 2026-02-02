import { FormLabel } from '@/components/FormLabel';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import customerDivisions from '@/routes/customer-divisions';
import { type BreadcrumbItem } from '@/types';
import { Form, Head, router } from '@inertiajs/react';
import { useState } from 'react';

type Customer = {
    uuid: string;
    company_name: string;
};

type CustomerDivision = {
    id: number;
    uuid: string;
    name: string;
    code?: string | null;
    email?: string | null;
    contacts?: string | null;
    customer_uuid: string;
};

type CustomerDivisionsEditProps = {
    division: CustomerDivision;
    customers: Customer[];
    errors?: Record<string, string>;
};

export default function CustomerDivisionsEdit({
    division,
    customers,
    errors: serverErrors,
}: CustomerDivisionsEditProps) {
    const [email, setEmail] = useState(division.email || '');

    const emailValidation = useFieldValidation(email, [
        validationRules.email(),
    ]);

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Divisioni Clienti',
            href: customerDivisions.index().url,
        },
        {
            title: division.name,
            href: customerDivisions.show({ customerDivision: division.uuid })
                .url,
        },
        {
            title: 'Modifica',
            href: customerDivisions.edit({ customerDivision: division.uuid })
                .url,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Modifica Divisione Cliente ${division.name}`} />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex w-full justify-center">
                    <div className="w-full max-w-4xl space-y-5">
                        <Card>
                            <CardHeader>
                                <CardTitle>Modifica</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Form
                                    action={
                                        customerDivisions.update({
                                            customerDivision: division.uuid,
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
                                                    <FormLabel htmlFor="uuid">
                                                        UUID
                                                    </FormLabel>
                                                    <Input
                                                        id="uuid"
                                                        name="uuid"
                                                        defaultValue={
                                                            division.uuid
                                                        }
                                                        readOnly
                                                        className="bg-muted"
                                                    />
                                                </div>

                                                <div className="grid gap-2">
                                                    <FormLabel
                                                        htmlFor="customer_uuid"
                                                        required
                                                    >
                                                        Cliente
                                                    </FormLabel>
                                                    <Select
                                                        name="customer_uuid"
                                                        defaultValue={
                                                            division.customer_uuid
                                                        }
                                                        required
                                                    >
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Seleziona il cliente.." />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {customers.map(
                                                                (customer) => (
                                                                    <SelectItem
                                                                        key={
                                                                            customer.uuid
                                                                        }
                                                                        value={
                                                                            customer.uuid
                                                                        }
                                                                    >
                                                                        {
                                                                            customer.company_name
                                                                        }
                                                                    </SelectItem>
                                                                ),
                                                            )}
                                                        </SelectContent>
                                                    </Select>
                                                    <InputError
                                                        message={
                                                            allErrors.customer_uuid
                                                        }
                                                    />
                                                </div>

                                                <div className="grid gap-2">
                                                    <FormLabel
                                                        htmlFor="name"
                                                        required
                                                    >
                                                        Nome
                                                    </FormLabel>
                                                    <Input
                                                        id="name"
                                                        name="name"
                                                        defaultValue={
                                                            division.name
                                                        }
                                                        required
                                                        placeholder="Nome"
                                                        maxLength={255}
                                                        aria-describedby="name-help"
                                                    />
                                                    <p
                                                        id="name-help"
                                                        className="text-xs text-muted-foreground"
                                                    >
                                                        Inserisci il nome della
                                                        divisione (massimo 255
                                                        caratteri).
                                                    </p>
                                                    <InputError
                                                        message={allErrors.name}
                                                    />
                                                </div>

                                                <div className="grid gap-2">
                                                    <FormLabel htmlFor="code">
                                                        Codice
                                                    </FormLabel>
                                                    <Input
                                                        id="code"
                                                        name="code"
                                                        defaultValue={
                                                            division.code ?? ''
                                                        }
                                                        placeholder="Codice"
                                                        maxLength={255}
                                                        aria-describedby="code-help"
                                                    />
                                                    <p
                                                        id="code-help"
                                                        className="text-xs text-muted-foreground"
                                                    >
                                                        Inserisci un codice
                                                        opzionale per la
                                                        divisione (massimo 255
                                                        caratteri).
                                                    </p>
                                                    <InputError
                                                        message={allErrors.code}
                                                    />
                                                </div>

                                                <div className="grid gap-2">
                                                    <FormLabel htmlFor="email">
                                                        Email
                                                    </FormLabel>
                                                    <Input
                                                        id="email"
                                                        name="email"
                                                        type="email"
                                                        value={email}
                                                        onChange={(e) =>
                                                            setEmail(
                                                                e.target.value,
                                                            )
                                                        }
                                                        onBlur={
                                                            emailValidation.onBlur
                                                        }
                                                        placeholder="Email"
                                                        maxLength={255}
                                                        aria-describedby="email-help"
                                                        aria-invalid={
                                                            emailValidation.error
                                                                ? 'true'
                                                                : 'false'
                                                        }
                                                    />
                                                    {emailValidation.error && (
                                                        <p className="text-xs text-destructive">
                                                            {
                                                                emailValidation.error
                                                            }
                                                        </p>
                                                    )}
                                                    <p
                                                        id="email-help"
                                                        className="text-xs text-muted-foreground"
                                                    >
                                                        Inserisci l'indirizzo
                                                        email della divisione
                                                        (massimo 255 caratteri).
                                                    </p>
                                                    <InputError
                                                        message={
                                                            allErrors.email
                                                        }
                                                    />
                                                </div>

                                                <div className="grid gap-2">
                                                    <FormLabel htmlFor="contacts">
                                                        Contatti
                                                    </FormLabel>
                                                    <Input
                                                        id="contacts"
                                                        name="contacts"
                                                        defaultValue={
                                                            division.contacts ??
                                                            ''
                                                        }
                                                        placeholder="Contatti"
                                                        maxLength={255}
                                                        aria-describedby="contacts-help"
                                                    />
                                                    <p
                                                        id="contacts-help"
                                                        className="text-xs text-muted-foreground"
                                                    >
                                                        Inserisci informazioni
                                                        di contatto opzionali
                                                        (massimo 255 caratteri).
                                                    </p>
                                                    <InputError
                                                        message={
                                                            allErrors.contacts
                                                        }
                                                    />
                                                </div>

                                                <div className="flex items-center gap-4">
                                                    <Button
                                                        type="submit"
                                                        disabled={processing}
                                                    >
                                                        {processing
                                                            ? 'Salvando...'
                                                            : 'Salva'}
                                                    </Button>
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        onClick={() =>
                                                            router.visit(
                                                                customerDivisions.show(
                                                                    {
                                                                        customerDivision:
                                                                            division.uuid,
                                                                    },
                                                                ).url,
                                                            )
                                                        }
                                                    >
                                                        Chiudi
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
