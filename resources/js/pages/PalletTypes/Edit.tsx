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
import palletTypes from '@/routes/pallet-types';
import { type BreadcrumbItem } from '@/types';
import { Form, Head, router } from '@inertiajs/react';

type PalletType = {
    id: number;
    uuid: string;
    cod: string;
    description: string;
};

type PalletTypesEditProps = {
    palletType: PalletType;
    errors?: Record<string, string>;
};

export default function PalletTypesEdit({
    palletType,
    errors: serverErrors,
}: PalletTypesEditProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Tipi di Pallet',
            href: palletTypes.index().url,
        },
        {
            title: palletType.cod,
            href: palletTypes.show({ palletType: palletType.uuid }).url,
        },
        {
            title: 'Modifica',
            href: palletTypes.edit({ palletType: palletType.uuid }).url,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Modifica Tipo di Pallet ${palletType.cod}`} />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <Card>
                    <CardHeader>
                        <CardTitle>Gestione Tipo di Pallet</CardTitle>
                        <CardDescription>Modifica</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Form
                            action={
                                palletTypes.update({
                                    palletType: palletType.uuid,
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
                                                defaultValue={palletType.uuid}
                                                readOnly
                                                className="bg-muted"
                                            />
                                        </div>

                                        <div className="grid gap-2">
                                            <Label htmlFor="cod">
                                                Codice *
                                            </Label>
                                            <Input
                                                id="cod"
                                                name="cod"
                                                defaultValue={palletType.cod}
                                                required
                                                placeholder="Codice Tipo di Pallet"
                                            />
                                            <InputError
                                                message={allErrors.cod}
                                            />
                                        </div>

                                        <div className="grid gap-2">
                                            <Label htmlFor="description">
                                                Descrizione *
                                            </Label>
                                            <Input
                                                id="description"
                                                name="description"
                                                defaultValue={
                                                    palletType.description
                                                }
                                                required
                                                placeholder="Descrizione Tipo di Pallet"
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
                                                    ? 'Aggiornando...'
                                                    : 'Aggiorna Tipo di Pallet'}
                                            </Button>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() =>
                                                    router.visit(
                                                        palletTypes.show({
                                                            palletType:
                                                                palletType.uuid,
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
