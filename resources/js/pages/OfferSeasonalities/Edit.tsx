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
import offerSeasonalities from '@/routes/offer-seasonalities/index';
import { type BreadcrumbItem } from '@/types';
import { Form, Head, router } from '@inertiajs/react';

type OfferSeasonality = {
    id: number;
    uuid: string;
    name: string;
};

type OfferSeasonalitiesEditProps = {
    seasonality: OfferSeasonality;
    errors?: Record<string, string>;
};

export default function OfferSeasonalitiesEdit({
    seasonality,
    errors: serverErrors,
}: OfferSeasonalitiesEditProps) {
    const { t } = useTranslations();
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
            title: seasonality.name,
            href: offerSeasonalities.show({
                offerSeasonality: seasonality.uuid,
            }).url,
        },
        {
            title: t('offer_seasonalities.edit.breadcrumb'),
            href: offerSeasonalities.edit({
                offerSeasonality: seasonality.uuid,
            }).url,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head
                title={t('offer_seasonalities.edit.page_title', {
                    name: seasonality.name,
                })}
            />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex w-full justify-center">
                    <div className="w-full max-w-4xl space-y-5">
                        <Card>
                            <CardHeader>
                                <CardTitle>
                                    {t('offer_seasonalities.edit.card_title')}
                                </CardTitle>
                                <CardDescription>
                                    {t(
                                        'offer_seasonalities.edit.card_description',
                                    )}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Form
                                    action={
                                        offerSeasonalities.update({
                                            offerSeasonality: seasonality.uuid,
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
                                                            seasonality.uuid
                                                        }
                                                        readOnly
                                                        className="bg-muted"
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
                                                        defaultValue={
                                                            seasonality.name
                                                        }
                                                        required
                                                        placeholder={t(
                                                            'offer_seasonalities.form.name_placeholder',
                                                        )}
                                                    />
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
                                                                  'offer_seasonalities.edit.submitting',
                                                              )
                                                            : t(
                                                                  'offer_seasonalities.edit.submit',
                                                              )}
                                                    </Button>
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        onClick={() =>
                                                            router.visit(
                                                                offerSeasonalities.show(
                                                                    {
                                                                        offerSeasonality:
                                                                            seasonality.uuid,
                                                                    },
                                                                ).url,
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
