import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useTranslations } from '@/hooks/use-translations';
import AppLayout from '@/layouts/app-layout';
import orderStates from '@/routes/order-states/index';
import { type BreadcrumbItem } from '@/types';
import { Form, Head, router } from '@inertiajs/react';

type OrderState = {
    id: number;
    uuid: string;
    name: string;
    sorting: number;
    initial: boolean;
    production: boolean;
};

type OrderStatesEditProps = {
    orderState: OrderState;
    errors?: Record<string, string>;
};

export default function OrderStatesEdit({
    orderState,
    errors: serverErrors,
}: OrderStatesEditProps) {
    const { t } = useTranslations();
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: t('order_states.page_title'),
            href: orderStates.index().url,
        },
        {
            title: orderState.name,
            href: orderStates.show({ orderState: orderState.uuid }).url,
        },
        {
            title: t('common.edit'),
            href: orderStates.edit({ orderState: orderState.uuid }).url,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head
                title={t('order_states.edit.page_title', {
                    name: orderState.name,
                })}
            />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <Card>
                    <CardHeader>
                        <CardTitle>
                            {t('order_states.edit.card_title')}
                        </CardTitle>
                        <CardDescription>
                            {t('order_states.edit.card_description')}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Form
                            action={
                                orderStates.update({
                                    orderState: orderState.uuid,
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
                                                {t('order_states.uuid_column')}
                                            </Label>
                                            <Input
                                                id="uuid"
                                                name="uuid"
                                                defaultValue={orderState.uuid}
                                                readOnly
                                                className="bg-muted"
                                            />
                                        </div>

                                        <div className="grid gap-2">
                                            <Label htmlFor="name">
                                                {t('order_states.name')} *
                                            </Label>
                                            <Input
                                                id="name"
                                                name="name"
                                                defaultValue={orderState.name}
                                                required
                                                placeholder={t(
                                                    'order_states.edit.name_placeholder',
                                                )}
                                            />
                                            <InputError
                                                message={allErrors.name}
                                            />
                                        </div>

                                        <div className="grid gap-2">
                                            <Label htmlFor="sorting">
                                                {t('order_states.sorting')}
                                            </Label>
                                            <Input
                                                id="sorting"
                                                name="sorting"
                                                type="number"
                                                defaultValue={
                                                    orderState.sorting
                                                }
                                                min="0"
                                                placeholder={t(
                                                    'order_states.edit.sorting_placeholder',
                                                )}
                                            />
                                            <InputError
                                                message={allErrors.sorting}
                                            />
                                        </div>

                                        <div className="flex items-center space-x-2">
                                            <Checkbox
                                                id="initial"
                                                name="initial"
                                                defaultChecked={
                                                    orderState.initial
                                                }
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
                                            <Checkbox
                                                id="production"
                                                name="production"
                                                defaultChecked={
                                                    orderState.production
                                                }
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
                                                          'order_states.edit.updating',
                                                      )
                                                    : t(
                                                          'order_states.edit.submit',
                                                      )}
                                            </Button>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() =>
                                                    router.visit(
                                                        orderStates.show({
                                                            orderState:
                                                                orderState.uuid,
                                                        }).url,
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
        </AppLayout>
    );
}
