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
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { useFieldValidation } from '@/hooks/useFieldValidation';
import AppLayout from '@/layouts/app-layout';
import { validationRules } from '@/lib/validation/rules';
import customers from '@/routes/customers/index';
import { type BreadcrumbItem } from '@/types';
import { Form, Head, router } from '@inertiajs/react';
import { HelpCircle } from 'lucide-react';
import { useState } from 'react';

type Customer = {
    id: number;
    uuid: string;
    code: string;
    company_name: string;
    vat_number?: string | null;
    co?: string | null;
    street?: string | null;
    postal_code?: string | null;
    city?: string | null;
    province?: string | null;
    country?: string | null;
};

type CustomersEditProps = {
    customer: Customer;
    errors?: Record<string, string>;
};

export default function CustomersEdit({
    customer,
    errors: serverErrors,
}: CustomersEditProps) {
    const [showCloseConfirm, setShowCloseConfirm] = useState(false);
    const [vatNumber, setVatNumber] = useState(customer.vat_number || '');
    const [postalCode, setPostalCode] = useState(customer.postal_code || '');
    const [province, setProvince] = useState(customer.province || '');

    const vatNumberValidation = useFieldValidation(vatNumber, [
        validationRules.vatNumber(),
    ]);

    const postalCodeValidation = useFieldValidation(postalCode, [
        validationRules.postalCode(),
    ]);

    const provinceValidation = useFieldValidation(province, [
        validationRules.province(),
    ]);

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Clienti',
            href: customers.index().url,
        },
        {
            title: customer.code,
            href: customers.show({ customer: customer.uuid }).url,
        },
        {
            title: 'Modifica',
            href: customers.edit({ customer: customer.uuid }).url,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Modifica Cliente ${customer.code}`} />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex w-full justify-center">
                    <div className="w-full max-w-4xl space-y-5">
                        <Card>
                            <CardHeader>
                                <CardTitle>Gestione Cliente</CardTitle>
                                <CardDescription>Modifica</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Form
                                    action={
                                        customers.update({
                                            customer: customer.uuid,
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
                                        const hasAttemptedSubmit =
                                            Object.keys(allErrors).length > 0;

                                        return (
                                            <>
                                                <FormValidationNotification
                                                    errors={allErrors}
                                                    hasAttemptedSubmit={
                                                        hasAttemptedSubmit
                                                    }
                                                />
                                                <div className="grid gap-2">
                                                    <FormLabel htmlFor="uuid">
                                                        UUID
                                                    </FormLabel>
                                                    <Input
                                                        id="uuid"
                                                        name="uuid"
                                                        defaultValue={
                                                            customer.uuid
                                                        }
                                                        readOnly
                                                        className="bg-muted"
                                                    />
                                                </div>

                                                <div className="grid gap-2">
                                                    <FormLabel
                                                        htmlFor="code"
                                                        required
                                                    >
                                                        Codice Cliente
                                                    </FormLabel>
                                                    <Input
                                                        id="code"
                                                        name="code"
                                                        defaultValue={
                                                            customer.code
                                                        }
                                                        required
                                                        placeholder="Codice Cliente"
                                                        maxLength={255}
                                                        aria-describedby="code-help"
                                                    />
                                                    <p
                                                        id="code-help"
                                                        className="text-xs text-muted-foreground"
                                                    >
                                                        Inserisci il codice
                                                        univoco del cliente
                                                        (massimo 255 caratteri).
                                                    </p>
                                                    <InputError
                                                        message={allErrors.code}
                                                    />
                                                </div>

                                                <div className="grid gap-2">
                                                    <FormLabel
                                                        htmlFor="company_name"
                                                        required
                                                    >
                                                        Ragione Sociale
                                                    </FormLabel>
                                                    <Input
                                                        id="company_name"
                                                        name="company_name"
                                                        defaultValue={
                                                            customer.company_name
                                                        }
                                                        required
                                                        placeholder="Ragione Sociale"
                                                        maxLength={255}
                                                        aria-describedby="company-name-help"
                                                    />
                                                    <p
                                                        id="company-name-help"
                                                        className="text-xs text-muted-foreground"
                                                    >
                                                        Inserisci la ragione
                                                        sociale del cliente
                                                        (massimo 255 caratteri).
                                                    </p>
                                                    <InputError
                                                        message={
                                                            allErrors.company_name
                                                        }
                                                    />
                                                </div>

                                                <div className="grid gap-2">
                                                    <div className="flex items-center gap-2">
                                                        <FormLabel htmlFor="vat_number">
                                                            Partita IVA
                                                        </FormLabel>
                                                        <Tooltip>
                                                            <TooltipTrigger
                                                                asChild
                                                            >
                                                                <HelpCircle className="h-4 w-4 cursor-help text-muted-foreground" />
                                                            </TooltipTrigger>
                                                            <TooltipContent>
                                                                <p>
                                                                    Inserire 11
                                                                    cifre
                                                                    numeriche
                                                                </p>
                                                            </TooltipContent>
                                                        </Tooltip>
                                                    </div>
                                                    <Input
                                                        id="vat_number"
                                                        name="vat_number"
                                                        value={vatNumber}
                                                        onChange={(e) =>
                                                            setVatNumber(
                                                                e.target.value,
                                                            )
                                                        }
                                                        onBlur={
                                                            vatNumberValidation.onBlur
                                                        }
                                                        placeholder="12345678901"
                                                        pattern="[0-9]{11}"
                                                        maxLength={11}
                                                        inputMode="numeric"
                                                        aria-label="Partita IVA (11 cifre)"
                                                        aria-invalid={
                                                            vatNumberValidation.error
                                                                ? 'true'
                                                                : 'false'
                                                        }
                                                    />
                                                    {vatNumberValidation.error && (
                                                        <p className="text-xs text-destructive">
                                                            {
                                                                vatNumberValidation.error
                                                            }
                                                        </p>
                                                    )}
                                                    <InputError
                                                        message={
                                                            allErrors.vat_number
                                                        }
                                                    />
                                                </div>

                                                <div className="grid gap-2">
                                                    <FormLabel htmlFor="co">
                                                        C/O
                                                    </FormLabel>
                                                    <Input
                                                        id="co"
                                                        name="co"
                                                        defaultValue={
                                                            customer.co ?? ''
                                                        }
                                                        placeholder="C/O"
                                                    />
                                                    <InputError
                                                        message={allErrors.co}
                                                    />
                                                </div>

                                                <div className="grid gap-2">
                                                    <FormLabel
                                                        htmlFor="street"
                                                        required
                                                    >
                                                        Via
                                                    </FormLabel>
                                                    <Input
                                                        id="street"
                                                        name="street"
                                                        defaultValue={
                                                            customer.street ??
                                                            ''
                                                        }
                                                        required
                                                        placeholder="Via"
                                                    />
                                                    <InputError
                                                        message={
                                                            allErrors.street
                                                        }
                                                    />
                                                </div>

                                                <div className="grid gap-2">
                                                    <div className="flex items-center gap-2">
                                                        <FormLabel htmlFor="postal_code">
                                                            CAP
                                                        </FormLabel>
                                                        <Tooltip>
                                                            <TooltipTrigger
                                                                asChild
                                                            >
                                                                <HelpCircle className="h-4 w-4 cursor-help text-muted-foreground" />
                                                            </TooltipTrigger>
                                                            <TooltipContent>
                                                                <p>
                                                                    Codice di
                                                                    Avviamento
                                                                    Postale (5
                                                                    cifre)
                                                                </p>
                                                            </TooltipContent>
                                                        </Tooltip>
                                                    </div>
                                                    <Input
                                                        id="postal_code"
                                                        name="postal_code"
                                                        value={postalCode}
                                                        onChange={(e) =>
                                                            setPostalCode(
                                                                e.target.value,
                                                            )
                                                        }
                                                        onBlur={
                                                            postalCodeValidation.onBlur
                                                        }
                                                        placeholder="00100"
                                                        pattern="[0-9]{5}"
                                                        maxLength={5}
                                                        inputMode="numeric"
                                                        aria-label="CAP (Codice di Avviamento Postale - 5 cifre)"
                                                        aria-invalid={
                                                            postalCodeValidation.error
                                                                ? 'true'
                                                                : 'false'
                                                        }
                                                    />
                                                    {postalCodeValidation.error && (
                                                        <p className="text-xs text-destructive">
                                                            {
                                                                postalCodeValidation.error
                                                            }
                                                        </p>
                                                    )}
                                                    <InputError
                                                        message={
                                                            allErrors.postal_code
                                                        }
                                                    />
                                                </div>

                                                <div className="grid gap-2">
                                                    <div className="flex items-center gap-2">
                                                        <FormLabel htmlFor="city">
                                                            Città
                                                        </FormLabel>
                                                    </div>
                                                    <Input
                                                        id="city"
                                                        name="city"
                                                        defaultValue={
                                                            customer.city ?? ''
                                                        }
                                                        placeholder="Città"
                                                        maxLength={255}
                                                        aria-describedby="city-help"
                                                    />
                                                    <p
                                                        id="city-help"
                                                        className="text-xs text-muted-foreground"
                                                    >
                                                        Inserisci la città
                                                        (massimo 255 caratteri).
                                                    </p>
                                                    <InputError
                                                        message={allErrors.city}
                                                    />
                                                </div>

                                                <div className="grid gap-2">
                                                    <div className="flex items-center gap-2">
                                                        <FormLabel htmlFor="province">
                                                            Provincia
                                                        </FormLabel>
                                                        <Tooltip>
                                                            <TooltipTrigger
                                                                asChild
                                                            >
                                                                <HelpCircle className="h-4 w-4 cursor-help text-muted-foreground" />
                                                            </TooltipTrigger>
                                                            <TooltipContent>
                                                                <p>
                                                                    Codice
                                                                    provincia di
                                                                    2 lettere
                                                                    (es: RM, MI,
                                                                    TO)
                                                                </p>
                                                            </TooltipContent>
                                                        </Tooltip>
                                                    </div>
                                                    <Input
                                                        id="province"
                                                        name="province"
                                                        value={province}
                                                        onChange={(e) =>
                                                            setProvince(
                                                                e.target.value.toUpperCase(),
                                                            )
                                                        }
                                                        onBlur={
                                                            provinceValidation.onBlur
                                                        }
                                                        placeholder="RM"
                                                        pattern="[A-Z]{2}"
                                                        maxLength={2}
                                                        style={{
                                                            textTransform:
                                                                'uppercase',
                                                        }}
                                                        aria-describedby="province-help"
                                                        aria-invalid={
                                                            provinceValidation.error
                                                                ? 'true'
                                                                : 'false'
                                                        }
                                                    />
                                                    {provinceValidation.error && (
                                                        <p className="text-xs text-destructive">
                                                            {
                                                                provinceValidation.error
                                                            }
                                                        </p>
                                                    )}
                                                    <p
                                                        id="province-help"
                                                        className="text-xs text-muted-foreground"
                                                    >
                                                        Inserisci il codice
                                                        provincia di 2 lettere
                                                        maiuscole (es: RM, MI,
                                                        TO).
                                                    </p>
                                                    <InputError
                                                        message={
                                                            allErrors.province
                                                        }
                                                    />
                                                </div>

                                                <div className="grid gap-2">
                                                    <div className="flex items-center gap-2">
                                                        <FormLabel htmlFor="country">
                                                            Nazione
                                                        </FormLabel>
                                                    </div>
                                                    <Input
                                                        id="country"
                                                        name="country"
                                                        defaultValue={
                                                            customer.country ??
                                                            ''
                                                        }
                                                        placeholder="Nazione"
                                                        maxLength={255}
                                                        aria-describedby="country-help"
                                                    />
                                                    <p
                                                        id="country-help"
                                                        className="text-xs text-muted-foreground"
                                                    >
                                                        Inserisci la nazione
                                                        (massimo 255 caratteri).
                                                    </p>
                                                    <InputError
                                                        message={
                                                            allErrors.country
                                                        }
                                                    />
                                                </div>

                                                <div className="flex items-center gap-4">
                                                    <Button
                                                        type="submit"
                                                        disabled={processing}
                                                    >
                                                        {processing
                                                            ? 'Aggiornando...'
                                                            : 'Aggiorna Cliente'}
                                                    </Button>
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        onClick={() =>
                                                            setShowCloseConfirm(
                                                                true,
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
                    router.visit(
                        customers.show({ customer: customer.uuid }).url,
                    );
                }}
            />
        </AppLayout>
    );
}
