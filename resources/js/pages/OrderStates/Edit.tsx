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
import AppLayout from '@/layouts/app-layout';
import orderStates from '@/routes/order-states';
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
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Stati Ordine',
            href: orderStates.index().url,
        },
        {
            title: orderState.name,
            href: orderStates.show({ orderState: orderState.uuid }).url,
        },
        {
            title: 'Modifica',
            href: orderStates.edit({ orderState: orderState.uuid }).url,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Modifica Stato Ordine ${orderState.name}`} />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <Card>
                    <CardHeader>
                        <CardTitle>Gestione Stato Ordine</CardTitle>
                        <CardDescription>Modifica</CardDescription>
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
                                            <Label htmlFor="uuid">UUID</Label>
                                            <Input
                                                id="uuid"
                                                name="uuid"
                                                defaultValue={orderState.uuid}
                                                readOnly
                                                className="bg-muted"
                                            />
                                        </div>

                                        <div className="grid gap-2">
                                            <Label htmlFor="name">Nome *</Label>
                                            <Input
                                                id="name"
                                                name="name"
                                                defaultValue={orderState.name}
                                                required
                                                placeholder="Nome Stato Ordine"
                                            />
                                            <InputError
                                                message={allErrors.name}
                                            />
                                        </div>

                                        <div className="grid gap-2">
                                            <Label htmlFor="sorting">
                                                Ordinamento
                                            </Label>
                                            <Input
                                                id="sorting"
                                                name="sorting"
                                                type="number"
                                                defaultValue={
                                                    orderState.sorting
                                                }
                                                min="0"
                                                placeholder="0"
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
                                                Stato iniziale
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
                                                Stato produzione
                                            </Label>
                                        </div>

                                        <div className="flex items-center gap-4">
                                            <Button
                                                type="submit"
                                                disabled={processing}
                                            >
                                                {processing
                                                    ? 'Aggiornando...'
                                                    : 'Aggiorna Stato Ordine'}
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
                                                Annulla
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
