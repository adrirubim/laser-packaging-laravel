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
import valueTypes from '@/routes/value-types/index';
import { type BreadcrumbItem } from '@/types';
import { Form, Head, router } from '@inertiajs/react';
import { useEffect, useState } from 'react';

type ValueTypesCreateProps = {
    errors?: Record<string, string>;
};

export default function ValueTypesCreate({
    errors: serverErrors,
}: ValueTypesCreateProps) {
    const { t } = useTranslations();
    const [uuid, setUuid] = useState<string>(generateUUID());
    const [regenerateUuid, setRegenerateUuid] = useState(false);

    useEffect(() => {
        if (regenerateUuid) {
            queueMicrotask(() => {
                setUuid(generateUUID());
                setRegenerateUuid(false);
            });
        }
    }, [regenerateUuid]);

    const breadcrumbs: BreadcrumbItem[] = [
        { title: t('nav.configuration'), href: '#' },
        { title: t('value_types.page_title'), href: valueTypes.index().url },
        {
            title: t('value_types.create.breadcrumb'),
            href: valueTypes.create().url,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('value_types.create.page_title')} />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex w-full justify-center">
                    <div className="w-full max-w-4xl space-y-5">
                        <Card>
                            <CardHeader>
                                <CardTitle>
                                    {t('value_types.create.card_title')}
                                </CardTitle>
                                <CardDescription>
                                    {t('value_types.create.card_description')}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Form
                                    action={valueTypes.store().url}
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
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() =>
                                                                setRegenerateUuid(
                                                                    true,
                                                                )
                                                            }
                                                            className="text-xs"
                                                        >
                                                            {t(
                                                                'value_types.uuid.regenerate',
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
                                                            'value_types.uuid.help',
                                                        )}
                                                    </p>
                                                    <InputError
                                                        message={allErrors.uuid}
                                                    />
                                                </div>

                                                <div className="flex items-center gap-4">
                                                    <Button
                                                        type="submit"
                                                        disabled={processing}
                                                    >
                                                        {processing
                                                            ? t(
                                                                  'value_types.create.submitting',
                                                              )
                                                            : t(
                                                                  'value_types.create.submit',
                                                              )}
                                                    </Button>
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        onClick={() =>
                                                            router.visit(
                                                                valueTypes.index()
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
