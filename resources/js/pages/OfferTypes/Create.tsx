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
import { useTranslations } from '@/hooks/use-translations';
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

    // As last resort, return empty string (avoids Math.random usage)
    return '';
}

export default function OfferTypesCreate({
    errors: serverErrors,
}: OfferTypesCreateProps) {
    const { t } = useTranslations();
    const [uuid, setUuid] = useState<string>(generateUUID());
    const [nameValue, setNameValue] = useState<string>('');

    useEffect(() => {
        if (!uuid) {
            queueMicrotask(() => setUuid(generateUUID()));
        }
    }, [uuid]);

    // Validazione in tempo reale per name
    const nameValidation = useFieldValidation(nameValue, [
        validationRules.required(t('validation.required_name')),
        validationRules.maxLength(255, t('validation.max_length_name')),
    ]);
    const breadcrumbs: BreadcrumbItem[] = [
        { title: t('nav.offers'), href: '/offers' },
        { title: t('nav.offer_types'), href: offerTypes.index().url },
        {
            title: t('offer_types.create.breadcrumb'),
            href: offerTypes.create().url,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('offer_types.create.page_title')} />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex w-full justify-center">
                    <div className="w-full max-w-4xl space-y-5">
                        <Card>
                            <CardHeader>
                                <CardTitle>
                                    {t('offer_types.create.card_title')}
                                </CardTitle>
                                <CardDescription>
                                    {t('offer_types.create.card_description')}
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
                                                    <FormLabel
                                                        htmlFor="uuid"
                                                        required
                                                    >
                                                        {t('common.uuid')}
                                                    </FormLabel>
                                                    <Input
                                                        id="uuid"
                                                        name="uuid"
                                                        value={uuid}
                                                        onChange={(e) =>
                                                            setUuid(
                                                                e.target.value,
                                                            )
                                                        }
                                                        required
                                                        placeholder={t(
                                                            'common.uuid_placeholder',
                                                        )}
                                                    />
                                                    <InputError
                                                        message={allErrors.uuid}
                                                    />
                                                </div>

                                                <div className="grid gap-2">
                                                    <FormLabel
                                                        htmlFor="name"
                                                        required
                                                    >
                                                        {t(
                                                            'offer_types.form.name_label',
                                                        )}
                                                    </FormLabel>
                                                    <Input
                                                        id="name"
                                                        name="name"
                                                        value={nameValue}
                                                        onChange={(e) =>
                                                            setNameValue(
                                                                e.target.value,
                                                            )
                                                        }
                                                        onBlur={
                                                            nameValidation.onBlur
                                                        }
                                                        onFocus={
                                                            nameValidation.onFocus
                                                        }
                                                        required
                                                        placeholder={t(
                                                            'offer_types.form.name_placeholder',
                                                        )}
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
                                                            ? t(
                                                                  'offer_types.create.submitting',
                                                              )
                                                            : t(
                                                                  'offer_types.create.submit',
                                                              )}
                                                    </Button>
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        onClick={() =>
                                                            router.visit(
                                                                offerTypes.index()
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
        </AppLayout>
    );
}
