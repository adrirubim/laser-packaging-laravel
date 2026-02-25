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
import orderStates from '@/routes/order-states/index';
import { type BreadcrumbItem } from '@/types';
import { Form, Head, router } from '@inertiajs/react';

type OrderStatesCreateProps = {
    errors?: Record<string, string>;
};

export default function OrderStatesCreate({
    errors: serverErrors,
}: OrderStatesCreateProps) {
    const { t } = useTranslations();
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: t('order_states.page_title'),
            href: orderStates.index().url,
        },
        {
            title: t('common.create'),
            href: orderStates.create().url,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('order_states.create.page_title')} />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex w-full justify-center">
                    <div className="w-full max-w-4xl space-y-5">
                        <Card>
                            <CardHeader>
                                <CardTitle>
                                    {t('order_states.create.card_title')}
                                </CardTitle>
                                <CardDescription>
                                    {t('order_states.create.card_description')}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Form
                                    action={orderStates.store().url}
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
                                                    <Label htmlFor="name">
                                                        {t('order_states.name')}{' '}
                                                        *
                                                    </Label>
                                                    <Input
                                                        id="name"
                                                        name="name"
                                                        required
                                                        placeholder={t(
                                                            'order_states.create.name_placeholder',
                                                        )}
                                                    />
                                                    <InputError
                                                        message={allErrors.name}
                                                    />
                                                </div>

                                                <div className="grid gap-2">
                                                    <Label htmlFor="sorting">
                                                        {t(
                                                            'order_states.sorting',
                                                        )}
                                                    </Label>
                                                    <Input
                                                        id="sorting"
                                                        name="sorting"
                                                        type="number"
                                                        min="0"
                                                        placeholder={t(
                                                            'order_states.create.sorting_placeholder',
                                                        )}
                                                    />
                                                    <InputError
                                                        message={
                                                            allErrors.sorting
                                                        }
                                                    />
                                                </div>

                                                <div className="flex items-center space-x-2">
                                                    <input
                                                        type="checkbox"
                                                        id="initial"
                                                        name="initial"
                                                        value="1"
                                                        className="h-4 w-4 rounded border-gray-300"
                                                    />
                                                    <Label
                                                        htmlFor="initial"
                                                        className="cursor-pointer text-sm font-normal"
                                                    >
                                                        {t(
                                                            'order_states.initial_state_label',
                                                        )}
                                                    </Label>
                                                </div>

                                                <div className="flex items-center space-x-2">
                                                    <input
                                                        type="checkbox"
                                                        id="production"
                                                        name="production"
                                                        value="1"
                                                        className="h-4 w-4 rounded border-gray-300"
                                                    />
                                                    <Label
                                                        htmlFor="production"
                                                        className="cursor-pointer text-sm font-normal"
                                                    >
                                                        {t(
                                                            'order_states.production_state_label',
                                                        )}
                                                    </Label>
                                                </div>

                                                <div className="flex items-center gap-4">
                                                    <Button
                                                        type="submit"
                                                        disabled={processing}
                                                    >
                                                        {processing
                                                            ? t(
                                                                  'order_states.create.creating',
                                                              )
                                                            : t(
                                                                  'order_states.create.submit',
                                                              )}
                                                    </Button>
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        onClick={() =>
                                                            router.visit(
                                                                orderStates.index()
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
