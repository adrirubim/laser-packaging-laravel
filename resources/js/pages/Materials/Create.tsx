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
import materials from '@/routes/materials/index';
import { type BreadcrumbItem } from '@/types';
import { Form, Head, router } from '@inertiajs/react';

type MaterialsCreateProps = {
    errors?: Record<string, string>;
};

export default function MaterialsCreate({
    errors: serverErrors,
}: MaterialsCreateProps) {
    const { t } = useTranslations();
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: t('materials.title'),
            href: materials.index().url,
        },
        {
            title: t('materials.create.breadcrumb'),
            href: materials.create().url,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('materials.create.page_title')} />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex w-full justify-center">
                    <div className="w-full max-w-4xl space-y-5">
                        <Card>
                            <CardHeader>
                                <CardTitle>
                                    {t('materials.create.card_title')}
                                </CardTitle>
                                <CardDescription>
                                    {t('materials.create.card_description')}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Form
                                    action={materials.store().url}
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
                                                    <Label htmlFor="cod">
                                                        {t(
                                                            'materials.form.cod_label',
                                                        )}
                                                    </Label>
                                                    <Input
                                                        id="cod"
                                                        name="cod"
                                                        required
                                                        placeholder={t(
                                                            'materials.form.cod_placeholder',
                                                        )}
                                                    />
                                                    <InputError
                                                        message={allErrors.cod}
                                                    />
                                                </div>

                                                <div className="grid gap-2">
                                                    <Label htmlFor="description">
                                                        {t(
                                                            'materials.form.description_label',
                                                        )}
                                                    </Label>
                                                    <Input
                                                        id="description"
                                                        name="description"
                                                        required
                                                        placeholder={t(
                                                            'materials.form.description_placeholder',
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
                                                                  'materials.create.submitting',
                                                              )
                                                            : t(
                                                                  'materials.create.submit',
                                                              )}
                                                    </Button>
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        onClick={() =>
                                                            router.visit(
                                                                materials.index()
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
