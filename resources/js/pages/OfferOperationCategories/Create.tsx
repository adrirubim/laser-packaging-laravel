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
import { generateUUID } from '@/lib/utils/uuid';
import offerOperationCategories from '@/routes/offer-operation-categories/index';
import { type BreadcrumbItem } from '@/types';
import { Form, Head, router } from '@inertiajs/react';
import { useState } from 'react';

type OfferOperationCategoriesCreateProps = {
    errors?: Record<string, string>;
};

export default function OfferOperationCategoriesCreate({
    errors: serverErrors,
}: OfferOperationCategoriesCreateProps) {
    const [uuid, setUuid] = useState<string>(generateUUID());

    const regenerateUuid = () => {
        setUuid(generateUUID());
    };
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Offerte',
            href: '/offers',
        },
        {
            title: 'Categorie Operazioni',
            href: offerOperationCategories.index().url,
        },
        {
            title: 'Nuova Categoria Operazione',
            href: offerOperationCategories.create().url,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Nuova Categoria Operazione" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <Card>
                    <CardHeader>
                        <CardTitle>Nuova Categoria Operazione</CardTitle>
                        <CardDescription>
                            Compila i campi per creare una categoria operazione.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Form
                            action={offerOperationCategories.store().url}
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
                                                    UUID
                                                </FormLabel>
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={regenerateUuid}
                                                    className="h-7 text-xs"
                                                >
                                                    Rigenera
                                                </Button>
                                            </div>
                                            <Input
                                                id="uuid"
                                                name="uuid"
                                                value={uuid}
                                                onChange={(e) =>
                                                    setUuid(e.target.value)
                                                }
                                                required
                                                placeholder="UUID (es. 550e8400-e29b-41d4-a716-446655440000)"
                                                maxLength={36}
                                                aria-describedby="uuid-help"
                                            />
                                            <p
                                                id="uuid-help"
                                                className="text-xs text-muted-foreground"
                                            >
                                                UUID generato automaticamente.
                                                Puoi modificarlo manualmente se
                                                necessario.
                                            </p>
                                            <InputError
                                                message={allErrors.uuid}
                                            />
                                        </div>

                                        <div className="grid gap-2">
                                            <FormLabel htmlFor="code" required>
                                                Codice
                                            </FormLabel>
                                            <Input
                                                id="code"
                                                name="code"
                                                required
                                                placeholder="Codice Categoria"
                                                maxLength={255}
                                                aria-describedby="code-help"
                                            />
                                            <p
                                                id="code-help"
                                                className="text-xs text-muted-foreground"
                                            >
                                                Inserisci il codice univoco
                                                della categoria (massimo 255
                                                caratteri).
                                            </p>
                                            <InputError
                                                message={allErrors.code}
                                            />
                                        </div>

                                        <div className="grid gap-2">
                                            <FormLabel htmlFor="name" required>
                                                Nome
                                            </FormLabel>
                                            <Input
                                                id="name"
                                                name="name"
                                                required
                                                placeholder="Nome Categoria"
                                                maxLength={255}
                                                aria-describedby="name-help"
                                            />
                                            <p
                                                id="name-help"
                                                className="text-xs text-muted-foreground"
                                            >
                                                Inserisci il nome della
                                                categoria (massimo 255
                                                caratteri).
                                            </p>
                                            <InputError
                                                message={allErrors.name}
                                            />
                                        </div>

                                        <div className="flex items-center gap-4">
                                            <Button
                                                type="submit"
                                                disabled={processing}
                                            >
                                                {processing
                                                    ? 'Creando...'
                                                    : 'Crea Categoria'}
                                            </Button>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() =>
                                                    router.visit(
                                                        offerOperationCategories.index()
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
        </AppLayout>
    );
}
