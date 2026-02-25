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
import AppLayout from '@/layouts/app-layout';
import { generateUUID } from '@/lib/utils/uuid';
import offerSeasonalities from '@/routes/offer-seasonalities/index';
import { type BreadcrumbItem } from '@/types';
import { Form, Head, router } from '@inertiajs/react';
import { useState } from 'react';

type OfferSeasonalitiesCreateProps = {
    errors?: Record<string, string>;
};

export default function OfferSeasonalitiesCreate({
    errors: serverErrors,
}: OfferSeasonalitiesCreateProps) {
    const { t } = useTranslations();
    const [uuid, setUuid] = useState<string>(generateUUID());

    const regenerateUuid = () => {
        setUuid(generateUUID());
    };
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: t('nav.offers'),
            href: '/offers',
        },
        {
            title: t('offer_seasonalities.page_title'),
            href: offerSeasonalities.index().url,
        },
        {
            title: t('offer_seasonalities.create.breadcrumb'),
            href: offerSeasonalities.create().url,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('offer_seasonalities.create.page_title')} />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex w-full justify-center">
                    <div className="w-full max-w-4xl space-y-5">
                        <Card>
                            <CardHeader>
                                <CardTitle>
                                    {t('offer_seasonalities.create.card_title')}
                                </CardTitle>
                                <CardDescription>
                                    {t(
                                        'offer_seasonalities.create.card_description',
                                    )}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Form
                                    action={offerSeasonalities.store().url}
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
                                                            {t('common.uuid')}
                                                        </FormLabel>
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={
                                                                regenerateUuid
                                                            }
                                                            className="h-7 text-xs"
                                                        >
                                                            {t(
                                                                'offer_seasonalities.uuid.regenerate',
                                                            )}
                                                        </Button>
                                                    </div>
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
                                                        maxLength={36}
                                                        aria-describedby="uuid-help"
                                                    />
                                                    <p
                                                        id="uuid-help"
                                                        className="text-xs text-muted-foreground"
                                                    >
                                                        {t(
                                                            'offer_seasonalities.uuid.help',
                                                        )}
                                                    </p>
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
                                                            'offer_seasonalities.form.name_label',
                                                        )}
                                                    </FormLabel>
                                                    <Input
                                                        id="name"
                                                        name="name"
                                                        required
                                                        placeholder={t(
                                                            'offer_seasonalities.form.name_placeholder',
                                                        )}
                                                        maxLength={255}
                                                        aria-describedby="name-help"
                                                    />
                                                    <p
                                                        id="name-help"
                                                        className="text-xs text-muted-foreground"
                                                    >
                                                        {t(
                                                            'offer_seasonalities.form.name_help',
                                                        )}
                                                    </p>
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
                                                                  'offer_seasonalities.create.submitting',
                                                              )
                                                            : t(
                                                                  'offer_seasonalities.create.submit',
                                                              )}
                                                    </Button>
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        onClick={() =>
                                                            router.visit(
                                                                offerSeasonalities.index()
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
