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
import offerSectors from '@/routes/offer-sectors/index';
import { type BreadcrumbItem } from '@/types';
import { Form, Head, router } from '@inertiajs/react';

type OfferSector = {
    id: number;
    uuid: string;
    name: string;
};

type OfferSectorsEditProps = {
    sector: OfferSector;
    errors?: Record<string, string>;
};

export default function OfferSectorsEdit({
    sector,
    errors: serverErrors,
}: OfferSectorsEditProps) {
    const { t } = useTranslations();
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
            title: sector.name,
            href: offerSectors.show({ offerSector: sector.uuid }).url,
        },
        {
            title: t('offer_sectors.edit.breadcrumb'),
            href: offerSectors.edit({ offerSector: sector.uuid }).url,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head
                title={t('offer_sectors.edit.page_title', {
                    name: sector.name,
                })}
            />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex w-full justify-center">
                    <div className="w-full max-w-4xl space-y-5">
                        <Card>
                            <CardHeader>
                                <CardTitle>
                                    {t('offer_sectors.edit.card_title')}
                                </CardTitle>
                                <CardDescription>
                                    {t('offer_sectors.edit.card_description')}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Form
                                    action={
                                        offerSectors.update({
                                            offerSector: sector.uuid,
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
                                                            sector.uuid
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
                                                            'offer_sectors.form.name_label',
                                                        )}
                                                    </FormLabel>
                                                    <Input
                                                        id="name"
                                                        name="name"
                                                        defaultValue={
                                                            sector.name
                                                        }
                                                        required
                                                        placeholder={t(
                                                            'offer_sectors.form.name_placeholder',
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
                                                                  'offer_sectors.edit.submitting',
                                                              )
                                                            : t(
                                                                  'offer_sectors.edit.submit',
                                                              )}
                                                    </Button>
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        onClick={() =>
                                                            router.visit(
                                                                offerSectors.show(
                                                                    {
                                                                        offerSector:
                                                                            sector.uuid,
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
