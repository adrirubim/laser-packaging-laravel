import { FormLabel } from '#app/components/FormLabel';
import InputError from '#app/components/input-error';
import { Button } from '#app/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '#app/components/ui/card';
import { Input } from '#app/components/ui/input';
import { useTranslations } from '#app/hooks/use-translations';
import AppLayout from '#app/layouts/app-layout';
import { generateUUID } from '#app/lib/utils/uuid';
import offerOperationCategories from '#app/routes/offer-operation-categories/index';
import { type BreadcrumbItem } from '#app/types';
import { Form, Head, router } from '@inertiajs/react';
import { useState } from 'react';

type OfferOperationCategoriesCreateProps = {
    errors?: Record<string, string>;
};

export default function OfferOperationCategoriesCreate({
    errors: serverErrors,
}: OfferOperationCategoriesCreateProps) {
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
            title: t('offer_operations.categories.breadcrumb'),
            href: offerOperationCategories.index().url,
        },
        {
            title: t('offer_operations.categories.create.breadcrumb'),
            href: offerOperationCategories.create().url,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('offer_operations.categories.create.page_title')} />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex w-full justify-center">
                    <div className="w-full max-w-4xl space-y-5">
                        <Card>
                            <CardHeader>
                                <CardTitle>
                                    {t(
                                        'offer_operations.categories.create.card_title',
                                    )}
                                </CardTitle>
                                <CardDescription>
                                    {t(
                                        'offer_operations.categories.create.card_description',
                                    )}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Form
                                    action={
                                        offerOperationCategories.store().url
                                    }
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
                                                                'offer_operations.categories.uuid.regenerate',
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
                                                            'offer_operations.categories.uuid.help',
                                                        )}
                                                    </p>
                                                    <InputError
                                                        message={allErrors.uuid}
                                                    />
                                                </div>

                                                <div className="grid gap-2">
                                                    <FormLabel
                                                        htmlFor="code"
                                                        required
                                                    >
                                                        {t('common.code')}
                                                    </FormLabel>
                                                    <Input
                                                        id="code"
                                                        name="code"
                                                        required
                                                        placeholder={t(
                                                            'offer_operations.categories.code_placeholder',
                                                        )}
                                                        maxLength={255}
                                                        aria-describedby="code-help"
                                                    />
                                                    <p
                                                        id="code-help"
                                                        className="text-xs text-muted-foreground"
                                                    >
                                                        {t(
                                                            'offer_operations.categories.code_help',
                                                        )}
                                                    </p>
                                                    <InputError
                                                        message={allErrors.code}
                                                    />
                                                </div>

                                                <div className="grid gap-2">
                                                    <FormLabel
                                                        htmlFor="name"
                                                        required
                                                    >
                                                        {t(
                                                            'offer_operations.categories.name_label',
                                                        )}
                                                    </FormLabel>
                                                    <Input
                                                        id="name"
                                                        name="name"
                                                        required
                                                        placeholder={t(
                                                            'offer_operations.categories.name_placeholder',
                                                        )}
                                                        maxLength={255}
                                                        aria-describedby="name-help"
                                                    />
                                                    <p
                                                        id="name-help"
                                                        className="text-xs text-muted-foreground"
                                                    >
                                                        {t(
                                                            'offer_operations.categories.name_help',
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
                                                                  'offer_operations.categories.create.submitting',
                                                              )
                                                            : t(
                                                                  'offer_operations.categories.create.submit',
                                                              )}
                                                    </Button>
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        onClick={() =>
                                                            router.visit(
                                                                offerOperationCategories.index()
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
