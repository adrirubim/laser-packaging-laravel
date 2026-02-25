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
import offerActivities from '@/routes/offer-activities/index';
import { type BreadcrumbItem } from '@/types';
import { Form, Head, router } from '@inertiajs/react';
import { useState } from 'react';

type OfferActivity = {
    id: number;
    uuid: string;
    name: string;
};

type OfferActivitiesEditProps = {
    activity: OfferActivity;
    errors?: Record<string, string>;
};

export default function OfferActivitiesEdit({
    activity,
    errors: serverErrors,
}: OfferActivitiesEditProps) {
    const { t } = useTranslations();
    const [nameValue, setNameValue] = useState<string>(activity.name);

    // Validazione in tempo reale per name
    const nameValidation = useFieldValidation(nameValue, [
        validationRules.required(t('validation.name_required')),
        validationRules.maxLength(255, t('validation.max_length_name')),
    ]);

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: t('nav.offers'),
            href: '/offers',
        },
        {
            title: t('offer_activities.page_title'),
            href: offerActivities.index().url,
        },
        {
            title: activity.name,
            href: offerActivities.show({ offerActivity: activity.uuid }).url,
        },
        {
            title: t('offer_activities.edit.breadcrumb'),
            href: offerActivities.edit({ offerActivity: activity.uuid }).url,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head
                title={t('offer_activities.edit.page_title', {
                    name: activity.name,
                })}
            />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex w-full justify-center">
                    <div className="w-full max-w-4xl space-y-5">
                        <Card>
                            <CardHeader>
                                <CardTitle>
                                    {t('offer_activities.edit.card_title')}
                                </CardTitle>
                                <CardDescription>
                                    {t(
                                        'offer_activities.edit.card_description',
                                    )}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Form
                                    action={
                                        offerActivities.update({
                                            offerActivity: activity.uuid,
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
                                                            activity.uuid
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
                                                            'offer_activities.form.name_label',
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
                                                            'offer_activities.form.name_placeholder',
                                                        )}
                                                        maxLength={255}
                                                        aria-describedby="name-help"
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
                                                    <p
                                                        id="name-help"
                                                        className="text-xs text-muted-foreground"
                                                    >
                                                        {t(
                                                            'offer_activities.form.name_help',
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
                                                                  'offer_activities.edit.submitting',
                                                              )
                                                            : t(
                                                                  'offer_activities.edit.submit',
                                                              )}
                                                    </Button>
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        onClick={() =>
                                                            router.visit(
                                                                offerActivities.show(
                                                                    {
                                                                        offerActivity:
                                                                            activity.uuid,
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
