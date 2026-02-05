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
import { generateUUID } from '@/lib/utils/uuid';
import { validationRules } from '@/lib/validation/rules';
import customerDivisions from '@/routes/customer-divisions/index';
import { type BreadcrumbItem } from '@/types';
import { Form, Head, router } from '@inertiajs/react';
import { useState } from 'react';

type Customer = {
    uuid: string;
    company_name: string;
};

type CustomerDivisionsCreateProps = {
    customers: Customer[];
    customer_uuid?: string;
    errors?: Record<string, string>;
};

export default function CustomerDivisionsCreate({
    customers,
    customer_uuid: initialCustomerUuid,
    errors: serverErrors,
}: CustomerDivisionsCreateProps) {
    const [uuid, setUuid] = useState<string>(generateUUID());
    const [selectedCustomer, setSelectedCustomer] = useState<string>(
        initialCustomerUuid ?? '',
    );
    const [email, setEmail] = useState('');

    const emailValidation = useFieldValidation(email, [
        validationRules.email(),
    ]);

    const regenerateUuid = () => {
        setUuid(generateUUID());
    };

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Divisioni Clienti',
            href: customerDivisions.index().url,
        },
        {
            title: 'Crea',
            href: customerDivisions.create().url,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Crea Divisione Cliente" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <Card>
                    <CardHeader>
                        <CardTitle>Inserimento</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Form
                            action={customerDivisions.store().url}
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
                                            <div className="flex items-center justify-between">
                                                <FormLabel
                                                    htmlFor="uuid"
                                                    required
                                                >
                                                    UUID
                                                </FormLabel>
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={regenerateUuid}
                                                    className="h-7 text-xs"
                                                >
                                                    Rigenera
                                                </Button>
                                            </div>
                                            <Input
                                                id="uuid"
                                                name="uuid"
                                                value={uuid}
                                                onChange={(e) =>
                                                    setUuid(e.target.value)
                                                }
                                                required
                                                placeholder="UUID (es. 550e8400-e29b-41d4-a716-446655440000)"
                                                maxLength={36}
                                                aria-describedby="uuid-help"
                                            />
                                            <p
                                                id="uuid-help"
                                                className="text-xs text-muted-foreground"
                                            >
                                                UUID generato automaticamente.
                                                Puoi modificarlo manualmente se
                                                necessario.
                                            </p>
                                            <InputError
                                                message={allErrors.uuid}
                                            />
                                        </div>

                                        <div className="grid gap-2">
                                            <FormLabel
                                                htmlFor="customer_uuid"
                                                required
                                            >
                                                Cliente
                                            </FormLabel>
                                            <input
                                                type="hidden"
                                                name="customer_uuid"
                                                value={selectedCustomer}
                                            />
                                            <Select
                                                value={
                                                    selectedCustomer ||
                                                    undefined
                                                }
                                                onValueChange={
                                                    setSelectedCustomer
                                                }
                                                required
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Seleziona il cliente..." />
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
                                            <FormLabel htmlFor="name" required>
                                                Nome
                                            </FormLabel>
                                            <Input
                                                id="name"
                                                name="name"
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
                                                placeholder="Codice"
                                                maxLength={255}
                                                aria-describedby="code-help"
                                            />
                                            <p
                                                id="code-help"
                                                className="text-xs text-muted-foreground"
                                            >
                                                Inserisci un codice opzionale
                                                per la divisione (massimo 255
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
                                                    setEmail(e.target.value)
                                                }
                                                onBlur={emailValidation.onBlur}
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
                                                    {emailValidation.error}
                                                </p>
                                            )}
                                            <p
                                                id="email-help"
                                                className="text-xs text-muted-foreground"
                                            >
                                                Inserisci l'indirizzo email
                                                della divisione (massimo 255
                                                caratteri).
                                            </p>
                                            <InputError
                                                message={allErrors.email}
                                            />
                                        </div>

                                        <div className="grid gap-2">
                                            <FormLabel htmlFor="contacts">
                                                Contatti
                                            </FormLabel>
                                            <Input
                                                id="contacts"
                                                name="contacts"
                                                placeholder="Contatti"
                                                maxLength={255}
                                                aria-describedby="contacts-help"
                                            />
                                            <p
                                                id="contacts-help"
                                                className="text-xs text-muted-foreground"
                                            >
                                                Inserisci informazioni di
                                                contatto opzionali (massimo 255
                                                caratteri).
                                            </p>
                                            <InputError
                                                message={allErrors.contacts}
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
                                                        customerDivisions.index()
                                                            .url,
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
        </AppLayout>
    );
}
