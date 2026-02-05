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
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Tipi di Pallet',
            href: palletTypes.index().url,
        },
        {
            title: 'Nuovo Tipo di Pallet',
            href: palletTypes.create().url,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Nuovo Tipo di Pallet" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <Card>
                    <CardHeader>
                        <CardTitle>Nuovo Tipo di Pallet</CardTitle>
                        <CardDescription>
                            Compila i campi per creare un nuovo tipo di pallet.
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
                                            <FormLabel htmlFor="cod" required>
                                                Codice
                                            </FormLabel>
                                            <Input
                                                id="cod"
                                                name="cod"
                                                required
                                                placeholder="Codice tipo pallet"
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
                                                Descrizione
                                            </FormLabel>
                                            <Input
                                                id="description"
                                                name="description"
                                                required
                                                placeholder="Descrizione tipo pallet"
                                            />
                                            <InputError
                                                message={allErrors.description}
                                            />
                                        </div>

                                        <div className="flex items-center gap-4">
                                            <Button
                                                type="submit"
                                                disabled={processing}
                                            >
                                                {processing
                                                    ? 'Creando...'
                                                    : 'Crea tipo pallet'}
                                            </Button>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() =>
                                                    router.visit(
                                                        palletTypes.index().url,
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
