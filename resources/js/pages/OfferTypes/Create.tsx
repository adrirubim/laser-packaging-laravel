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
import { useFieldValidation } from '@/hooks/useFieldValidation';
import AppLayout from '@/layouts/app-layout';
import { validationRules } from '@/lib/validation/rules';
import offerTypes from '@/routes/offer-types/index';
import { type BreadcrumbItem } from '@/types';
import { Form, Head, router } from '@inertiajs/react';
import { useEffect, useState } from 'react';

type OfferTypesCreateProps = {
    errors?: Record<string, string>;
};

// Funzione per generare UUID v4
function generateUUID(): string {
    // Usa crypto.randomUUID se disponibile (moderno, sicuro)
    if (
        typeof crypto !== 'undefined' &&
        typeof crypto.randomUUID === 'function'
    ) {
        return crypto.randomUUID();
    }

    // Fallback sicuro basato su crypto.getRandomValues
    if (
        typeof crypto !== 'undefined' &&
        typeof crypto.getRandomValues === 'function'
    ) {
        const bytes = new Uint8Array(16);
        crypto.getRandomValues(bytes);

        // Imposta le version/variant bits secondo UUID v4
        bytes[6] = (bytes[6] & 0x0f) | 0x40; // versione 4
        bytes[8] = (bytes[8] & 0x3f) | 0x80; // variante RFC 4122

        const byteToHex: string[] = [];
        for (let i = 0; i < 256; ++i) {
            byteToHex.push((i + 0x100).toString(16).substring(1));
        }

        return (
            byteToHex[bytes[0]] +
            byteToHex[bytes[1]] +
            byteToHex[bytes[2]] +
            byteToHex[bytes[3]] +
            '-' +
            byteToHex[bytes[4]] +
            byteToHex[bytes[5]] +
            '-' +
            byteToHex[bytes[6]] +
            byteToHex[bytes[7]] +
            '-' +
            byteToHex[bytes[8]] +
            byteToHex[bytes[9]] +
            '-' +
            byteToHex[bytes[10]] +
            byteToHex[bytes[11]] +
            byteToHex[bytes[12]] +
            byteToHex[bytes[13]] +
            byteToHex[bytes[14]] +
            byteToHex[bytes[15]]
        );
    }

    // Come ultima risorsa, ritorna una stringa vuota (evita uso di Math.random)
    return '';
}

export default function OfferTypesCreate({
    errors: serverErrors,
}: OfferTypesCreateProps) {
    const [uuid, setUuid] = useState<string>(generateUUID());
    const [nameValue, setNameValue] = useState<string>('');

    useEffect(() => {
        if (!uuid) {
            queueMicrotask(() => setUuid(generateUUID()));
        }
    }, [uuid]);

    // Validazione in tempo reale per name
    const nameValidation = useFieldValidation(nameValue, [
        validationRules.required('Il nome è obbligatorio'),
        validationRules.maxLength(
            255,
            'Il nome non può superare 255 caratteri',
        ),
    ]);
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Offerte',
            href: '/offers',
        },
        {
            title: 'Tipi',
            href: offerTypes.index().url,
        },
        {
            title: 'Nuovo Tipo di Offerta',
            href: offerTypes.create().url,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Nuovo Tipo di Offerta" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <Card>
                    <CardHeader>
                        <CardTitle>Nuovo Tipo di Offerta</CardTitle>
                        <CardDescription>
                            Compila i campi per creare un tipo di offerta.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Form
                            action={offerTypes.store().url}
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
                                            <FormLabel htmlFor="uuid" required>
                                                UUID
                                            </FormLabel>
                                            <Input
                                                id="uuid"
                                                name="uuid"
                                                value={uuid}
                                                onChange={(e) =>
                                                    setUuid(e.target.value)
                                                }
                                                required
                                                placeholder="UUID (es. 550e8400-e29b-41d4-a716-446655440000)"
                                            />
                                            <InputError
                                                message={allErrors.uuid}
                                            />
                                        </div>

                                        <div className="grid gap-2">
                                            <FormLabel htmlFor="name" required>
                                                Nome
                                            </FormLabel>
                                            <Input
                                                id="name"
                                                name="name"
                                                value={nameValue}
                                                onChange={(e) =>
                                                    setNameValue(e.target.value)
                                                }
                                                onBlur={nameValidation.onBlur}
                                                onFocus={nameValidation.onFocus}
                                                required
                                                placeholder="Nome Tipo di Offerta"
                                                className={
                                                    nameValidation.error
                                                        ? 'border-destructive'
                                                        : ''
                                                }
                                            />
                                            {nameValidation.error && (
                                                <InputError
                                                    message={
                                                        nameValidation.error
                                                    }
                                                />
                                            )}
                                            <InputError
                                                message={allErrors.name}
                                            />
                                        </div>

                                        <div className="flex items-center gap-4">
                                            <Button
                                                type="submit"
                                                disabled={processing}
                                            >
                                                {processing
                                                    ? 'Creando...'
                                                    : 'Crea Tipo di Offerta'}
                                            </Button>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() =>
                                                    router.visit(
                                                        offerTypes.index().url,
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
