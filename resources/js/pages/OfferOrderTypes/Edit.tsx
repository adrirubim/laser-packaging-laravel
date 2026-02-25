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
import { Label } from '@/components/ui/label';
import { useTranslations } from '@/hooks/use-translations';
import AppLayout from '@/layouts/app-layout';
import offerOrderTypes from '@/routes/offer-order-types/index';
import { type BreadcrumbItem } from '@/types';
import { Form, Head, router } from '@inertiajs/react';

type OfferOrderType = {
    id: number;
    uuid: string;
    code: string;
    name: string;
};

type OfferOrderTypesEditProps = {
    orderType: OfferOrderType;
    errors?: Record<string, string>;
};

export default function OfferOrderTypesEdit({
    orderType,
    errors: serverErrors,
}: OfferOrderTypesEditProps) {
    const { t } = useTranslations();
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: t('nav.offers'),
            href: '/offers',
        },
        {
            title: t('offer_order_types.page_title'),
            href: offerOrderTypes.index().url,
        },
        {
            title: orderType.name,
            href: offerOrderTypes.show({ offerOrderType: orderType.uuid }).url,
        },
        {
            title: t('offer_order_types.edit.breadcrumb'),
            href: offerOrderTypes.edit({ offerOrderType: orderType.uuid }).url,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head
                title={t('offer_order_types.edit.page_title', {
                    name: orderType.name,
                })}
            />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex w-full justify-center">
                    <div className="w-full max-w-4xl space-y-5">
                        <Card>
                            <CardHeader>
                                <CardTitle>
                                    {t('offer_order_types.form.card_title')}
                                </CardTitle>
                                <CardDescription>
                                    {t(
                                        'offer_order_types.edit.card_description',
                                    )}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Form
                                    action={
                                        offerOrderTypes.update({
                                            offerOrderType: orderType.uuid,
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
                                                    <Label htmlFor="uuid">
                                                        UUID
                                                    </Label>
                                                    <Input
                                                        id="uuid"
                                                        name="uuid"
                                                        defaultValue={
                                                            orderType.uuid
                                                        }
                                                        readOnly
                                                        className="bg-muted"
                                                    />
                                                </div>

                                                <div className="grid gap-2">
                                                    <Label htmlFor="code">
                                                        {t(
                                                            'offer_order_types.form.code_label',
                                                        )}{' '}
                                                        *
                                                    </Label>
                                                    <Input
                                                        id="code"
                                                        name="code"
                                                        defaultValue={
                                                            orderType.code
                                                        }
                                                        required
                                                        placeholder={t(
                                                            'offer_order_types.form.code_placeholder',
                                                        )}
                                                    />
                                                    <InputError
                                                        message={allErrors.code}
                                                    />
                                                </div>

                                                <div className="grid gap-2">
                                                    <Label htmlFor="name">
                                                        {t(
                                                            'offer_order_types.form.name_label',
                                                        )}{' '}
                                                        *
                                                    </Label>
                                                    <Input
                                                        id="name"
                                                        name="name"
                                                        defaultValue={
                                                            orderType.name
                                                        }
                                                        required
                                                        placeholder={t(
                                                            'offer_order_types.form.name_placeholder',
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
                                                                  'offer_order_types.edit.submitting',
                                                              )
                                                            : t(
                                                                  'offer_order_types.edit.submit',
                                                              )}
                                                    </Button>
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        onClick={() =>
                                                            router.visit(
                                                                offerOrderTypes.show(
                                                                    {
                                                                        offerOrderType:
                                                                            orderType.uuid,
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
