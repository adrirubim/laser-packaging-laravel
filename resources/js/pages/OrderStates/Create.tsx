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
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Stati ordine',
            href: orderStates.index().url,
        },
        {
            title: 'Crea',
            href: orderStates.create().url,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Crea stato ordine" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex w-full justify-center">
                    <div className="w-full max-w-4xl space-y-5">
                        <Card>
                            <CardHeader>
                                <CardTitle>Crea nuovo stato ordine</CardTitle>
                                <CardDescription>
                                    Compila i campi per creare un nuovo stato
                                    ordine
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
                                                        Name *
                                                    </Label>
                                                    <Input
                                                        id="name"
                                                        name="name"
                                                        required
                                                        placeholder="Nome stato ordine"
                                                    />
                                                    <InputError
                                                        message={allErrors.name}
                                                    />
                                                </div>

                                                <div className="grid gap-2">
                                                    <Label htmlFor="sorting">
                                                        Sorting
                                                    </Label>
                                                    <Input
                                                        id="sorting"
                                                        name="sorting"
                                                        type="number"
                                                        min="0"
                                                        placeholder="Ordine di ordinamento"
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
                                                        Initial state
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
                                                        Production state
                                                    </Label>
                                                </div>

                                                <div className="flex items-center gap-4">
                                                    <Button
                                                        type="submit"
                                                        disabled={processing}
                                                    >
                                                        {processing
                                                            ? 'Creando...'
                                                            : 'Crea stato ordine'}
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
                </div>
            </div>
        </AppLayout>
    );
}
