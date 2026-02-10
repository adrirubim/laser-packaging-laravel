import { ConfirmCloseDialog } from '@/components/confirm-close-dialog';
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
import materials from '@/routes/materials/index';
import { type BreadcrumbItem } from '@/types';
import { Form, Head, router } from '@inertiajs/react';
import { useState } from 'react';

type Material = {
    id: number;
    uuid: string;
    cod: string;
    description: string;
};

type MaterialsEditProps = {
    material: Material;
    errors?: Record<string, string>;
};

export default function MaterialsEdit({
    material,
    errors: serverErrors,
}: MaterialsEditProps) {
    const [showCloseConfirm, setShowCloseConfirm] = useState(false);
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Materiali',
            href: materials.index().url,
        },
        {
            title: material.cod,
            href: materials.show({ material: material.uuid }).url,
        },
        {
            title: 'Modifica',
            href: materials.edit({ material: material.uuid }).url,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Modifica materiale ${material.cod}`} />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex w-full justify-center">
                    <div className="w-full max-w-4xl space-y-5">
                        <Card>
                            <CardHeader>
                                <CardTitle>Modifica Materiale</CardTitle>
                                <CardDescription>
                                    Aggiorna le informazioni del materiale.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Form
                                    action={
                                        materials.update({
                                            material: material.uuid,
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
                                                    <Label htmlFor="cod">
                                                        Codice *
                                                    </Label>
                                                    <Input
                                                        id="cod"
                                                        name="cod"
                                                        defaultValue={
                                                            material.cod
                                                        }
                                                        required
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
                                                            material.description
                                                        }
                                                        required
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
                                                            ? 'Aggiornando...'
                                                            : 'Aggiorna Materiale'}
                                                    </Button>
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        onClick={() =>
                                                            setShowCloseConfirm(
                                                                true,
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
            <ConfirmCloseDialog
                open={showCloseConfirm}
                onOpenChange={setShowCloseConfirm}
                onConfirm={() => {
                    setShowCloseConfirm(false);
                    router.visit(
                        materials.show({ material: material.uuid }).url,
                    );
                }}
            />
        </AppLayout>
    );
}
