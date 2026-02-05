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
import { Textarea } from '@/components/ui/textarea';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { useFieldValidation } from '@/hooks/useFieldValidation';
import AppLayout from '@/layouts/app-layout';
import { validationRules } from '@/lib/validation/rules';
import suppliers from '@/routes/suppliers/index';
import { type BreadcrumbItem } from '@/types';
import { Form, Head, router } from '@inertiajs/react';
import { HelpCircle } from 'lucide-react';
import { useState } from 'react';

type SuppliersCreateProps = {
    errors?: Record<string, string>;
};

export default function SuppliersCreate({
    errors: serverErrors,
}: SuppliersCreateProps) {
    const [vatNumber, setVatNumber] = useState('');
    const [postalCode, setPostalCode] = useState('');
    const [province, setProvince] = useState('');

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
            title: 'Fornitori',
            href: suppliers.index().url,
        },
        {
            title: 'Crea',
            href: suppliers.create().url,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Crea Fornitore" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <Card>
                    <CardHeader>
                        <CardTitle>Gestione Fornitore</CardTitle>
                        <CardDescription>Crea</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Form
                            action={suppliers.store().url}
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
                                            <FormLabel htmlFor="code" required>
                                                Codice Fornitore
                                            </FormLabel>
                                            <Input
                                                id="code"
                                                name="code"
                                                required
                                                placeholder="Codice Fornitore"
                                                maxLength={255}
                                            />
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
                                                required
                                                placeholder="Ragione Sociale"
                                                maxLength={255}
                                            />
                                            <InputError
                                                message={allErrors.company_name}
                                            />
                                        </div>

                                        <div className="grid gap-2">
                                            <div className="flex items-center gap-2">
                                                <FormLabel htmlFor="vat_number">
                                                    Partita IVA
                                                </FormLabel>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <HelpCircle className="h-4 w-4 cursor-help text-muted-foreground" />
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <p>
                                                            Inserire 11 cifre
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
                                                    setVatNumber(e.target.value)
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
                                                className={
                                                    vatNumberValidation.error
                                                        ? 'border-destructive'
                                                        : ''
                                                }
                                            />
                                            {vatNumberValidation.error && (
                                                <p className="text-xs text-destructive">
                                                    {vatNumberValidation.error}
                                                </p>
                                            )}
                                            <InputError
                                                message={allErrors.vat_number}
                                            />
                                        </div>

                                        <div className="grid gap-2">
                                            <FormLabel htmlFor="co">
                                                C/O
                                            </FormLabel>
                                            <Input
                                                id="co"
                                                name="co"
                                                placeholder="C/O"
                                                maxLength={255}
                                            />
                                            <InputError
                                                message={allErrors.co}
                                            />
                                        </div>

                                        <div className="grid gap-2">
                                            <FormLabel htmlFor="street">
                                                Via
                                            </FormLabel>
                                            <Input
                                                id="street"
                                                name="street"
                                                placeholder="Via"
                                                maxLength={255}
                                            />
                                            <InputError
                                                message={allErrors.street}
                                            />
                                        </div>

                                        <div className="grid gap-2">
                                            <div className="flex items-center gap-2">
                                                <FormLabel htmlFor="postal_code">
                                                    CAP
                                                </FormLabel>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <HelpCircle className="h-4 w-4 cursor-help text-muted-foreground" />
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <p>
                                                            Codice di Avviamento
                                                            Postale (5 cifre)
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
                                                className={
                                                    postalCodeValidation.error
                                                        ? 'border-destructive'
                                                        : ''
                                                }
                                            />
                                            {postalCodeValidation.error && (
                                                <p className="text-xs text-destructive">
                                                    {postalCodeValidation.error}
                                                </p>
                                            )}
                                            <InputError
                                                message={allErrors.postal_code}
                                            />
                                        </div>

                                        <div className="grid gap-2">
                                            <FormLabel htmlFor="city">
                                                Città
                                            </FormLabel>
                                            <Input
                                                id="city"
                                                name="city"
                                                placeholder="Città"
                                                maxLength={255}
                                            />
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
                                                    <TooltipTrigger asChild>
                                                        <HelpCircle className="h-4 w-4 cursor-help text-muted-foreground" />
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <p>
                                                            Codice provincia di
                                                            2 lettere (es: RM,
                                                            MI, TO)
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
                                                    textTransform: 'uppercase',
                                                }}
                                                aria-invalid={
                                                    provinceValidation.error
                                                        ? 'true'
                                                        : 'false'
                                                }
                                                className={
                                                    provinceValidation.error
                                                        ? 'border-destructive'
                                                        : ''
                                                }
                                            />
                                            {provinceValidation.error && (
                                                <p className="text-xs text-destructive">
                                                    {provinceValidation.error}
                                                </p>
                                            )}
                                            <InputError
                                                message={allErrors.province}
                                            />
                                        </div>

                                        <div className="grid gap-2">
                                            <FormLabel htmlFor="country">
                                                Nazione
                                            </FormLabel>
                                            <Input
                                                id="country"
                                                name="country"
                                                placeholder="Nazione"
                                                maxLength={255}
                                            />
                                            <InputError
                                                message={allErrors.country}
                                            />
                                        </div>

                                        <div className="grid gap-2">
                                            <FormLabel htmlFor="contacts">
                                                Contatti
                                            </FormLabel>
                                            <Textarea
                                                id="contacts"
                                                name="contacts"
                                                placeholder="Contatti"
                                                rows={3}
                                            />
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
                                                    ? 'Creando...'
                                                    : 'Crea Fornitore'}
                                            </Button>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() =>
                                                    router.visit(
                                                        suppliers.index().url,
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
