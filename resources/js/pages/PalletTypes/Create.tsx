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
import palletTypes from '@/routes/pallet-types/index';
import { type BreadcrumbItem } from '@/types';
import { Form, Head, router } from '@inertiajs/react';

type PalletTypesCreateProps = {
    errors?: Record<string, string>;
};

export default function PalletTypesCreate({
    errors: serverErrors,
}: PalletTypesCreateProps) {
    const { t } = useTranslations();
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: t('pallet_types.title'),
            href: palletTypes.index().url,
        },
        {
            title: t('pallet_types.create.breadcrumb'),
            href: palletTypes.create().url,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('pallet_types.create.page_title')} />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex w-full justify-center">
                    <div className="w-full max-w-4xl space-y-5">
                        <Card>
                            <CardHeader>
                                <CardTitle>
                                    {t('pallet_types.create.card_title')}
                                </CardTitle>
                                <CardDescription>
                                    {t('pallet_types.create.card_description')}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Form
                                    action={palletTypes.store().url}
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
                                                        htmlFor="cod"
                                                        required
                                                    >
                                                        {t(
                                                            'pallet_types.form.cod_label',
                                                        )}
                                                    </FormLabel>
                                                    <Input
                                                        id="cod"
                                                        name="cod"
                                                        required
                                                        placeholder={t(
                                                            'pallet_types.form.cod_placeholder',
                                                        )}
                                                    />
                                                    <InputError
                                                        message={allErrors.cod}
                                                    />
                                                </div>

                                                <div className="grid gap-2">
                                                    <FormLabel
                                                        htmlFor="description"
                                                        required
                                                    >
                                                        {t(
                                                            'pallet_types.form.description_label',
                                                        )}
                                                    </FormLabel>
                                                    <Input
                                                        id="description"
                                                        name="description"
                                                        required
                                                        placeholder={t(
                                                            'pallet_types.form.description_placeholder',
                                                        )}
                                                    />
                                                    <InputError
                                                        message={
                                                            allErrors.description
                                                        }
                                                    />
                                                </div>

                                                <div className="flex items-center gap-4">
                                                    <Button
                                                        type="submit"
                                                        disabled={processing}
                                                    >
                                                        {processing
                                                            ? t(
                                                                  'pallet_types.create.submitting',
                                                              )
                                                            : t(
                                                                  'pallet_types.create.submit',
                                                              )}
                                                    </Button>
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        onClick={() =>
                                                            router.visit(
                                                                palletTypes.index()
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
