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
import materials from '@/routes/materials';
import { type BreadcrumbItem } from '@/types';
import { Form, Head, router } from '@inertiajs/react';

type MaterialsCreateProps = {
    errors?: Record<string, string>;
};

export default function MaterialsCreate({
    errors: serverErrors,
}: MaterialsCreateProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Materiali',
            href: materials.index().url,
        },
        {
            title: 'Crea',
            href: materials.create().url,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Crea materiale" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <Card>
                    <CardHeader>
                        <CardTitle>Crea nuovo materiale</CardTitle>
                        <CardDescription>
                            Compila i campi per creare un nuovo materiale
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
                                                Codice *
                                            </Label>
                                            <Input
                                                id="cod"
                                                name="cod"
                                                required
                                                placeholder="Codice materiale"
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
                                                required
                                                placeholder="Descrizione materiale"
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
                                                    : 'Crea materiale'}
                                            </Button>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() =>
                                                    router.visit(
                                                        materials.index().url,
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
