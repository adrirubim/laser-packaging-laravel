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
import { generateUUID } from '@/lib/utils/uuid';
import { validationRules } from '@/lib/validation/rules';
import offerSectors from '@/routes/offer-sectors/index';
import { type BreadcrumbItem } from '@/types';
import { Form, Head, router } from '@inertiajs/react';
import { useEffect, useState } from 'react';

type OfferSectorsCreateProps = {
    errors?: Record<string, string>;
};

export default function OfferSectorsCreate({
    errors: serverErrors,
}: OfferSectorsCreateProps) {
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
        {
            title: t('nav.offers'),
            href: '/offers',
        },
        {
            title: t('offer_sectors.page_title'),
            href: offerSectors.index().url,
        },
        {
            title: t('offer_sectors.create.breadcrumb'),
            href: offerSectors.create().url,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('offer_sectors.create.page_title')} />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <Card>
                    <CardHeader>
                        <CardTitle>
                            {t('offer_sectors.create.card_title')}
                        </CardTitle>
                        <CardDescription>
                            {t('offer_sectors.create.card_description')}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Form
                            action={offerSectors.store().url}
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
                                                {t('common.uuid')}
                                            </FormLabel>
                                            <Input
                                                id="uuid"
                                                name="uuid"
                                                value={uuid}
                                                onChange={(e) =>
                                                    setUuid(e.target.value)
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
                                            <FormLabel htmlFor="name" required>
                                                {t(
                                                    'offer_sectors.form.name_label',
                                                )}
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
                                                placeholder={t(
                                                    'offer_sectors.form.name_placeholder',
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
                                                          'offer_sectors.create.submitting',
                                                      )
                                                    : t(
                                                          'offer_sectors.create.submit',
                                                      )}
                                            </Button>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() =>
                                                    router.visit(
                                                        offerSectors.index()
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
        </AppLayout>
    );
}
