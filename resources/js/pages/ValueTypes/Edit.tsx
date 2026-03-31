import { FormLabel } from '#app/components/FormLabel';
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
import valueTypes from '#app/routes/value-types/index';
import { type BreadcrumbItem } from '#app/types';
import { Form, Head, router } from '@inertiajs/react';

type ValueType = {
    id: number;
    uuid: string;
};

type ValueTypesEditProps = {
    valueType: ValueType;
    errors?: Record<string, string>;
};

export default function ValueTypesEdit({ valueType }: ValueTypesEditProps) {
    const { t } = useTranslations();
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: t('nav.configuration'),
            href: '#',
        },
        {
            title: t('nav.value_types'),
            href: valueTypes.index().url,
        },
        {
            title: valueType.uuid.substring(0, 8) + '...',
            href: valueTypes.show({ valueType: valueType.uuid }).url,
        },
        {
            title: t('value_types.edit.breadcrumb'),
            href: valueTypes.edit({ valueType: valueType.uuid }).url,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head
                title={`${t('value_types.edit.page_title')} ${valueType.uuid.substring(0, 8)}...`}
            />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <Card>
                    <CardHeader>
                        <CardTitle>
                            {t('value_types.edit.card_title')}
                        </CardTitle>
                        <CardDescription>
                            {t('value_types.edit.card_description')}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Form
                            action={
                                valueTypes.update({ valueType: valueType.uuid })
                                    .url
                            }
                            method="put"
                            className="space-y-6"
                        >
                            {({ processing }) => (
                                <>
                                    <div className="grid gap-2">
                                        <FormLabel htmlFor="uuid">
                                            {t('common.uuid')}
                                        </FormLabel>
                                        <Input
                                            id="uuid"
                                            name="uuid"
                                            defaultValue={valueType.uuid}
                                            readOnly
                                            className="bg-muted"
                                        />
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <Button
                                            type="submit"
                                            disabled={processing}
                                        >
                                            {processing
                                                ? t(
                                                      'value_types.edit.submitting',
                                                  )
                                                : t('value_types.edit.submit')}
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() =>
                                                router.visit(
                                                    valueTypes.show({
                                                        valueType:
                                                            valueType.uuid,
                                                    }).url,
                                                )
                                            }
                                        >
                                            {t('common.cancel')}
                                        </Button>
                                    </div>
                                </>
                            )}
                        </Form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
