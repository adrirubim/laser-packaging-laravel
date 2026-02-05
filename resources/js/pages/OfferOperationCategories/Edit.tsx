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
import offerOperationCategories from '@/routes/offer-operation-categories/index';
import { type BreadcrumbItem } from '@/types';
import { Form, Head, router } from '@inertiajs/react';

type OfferOperationCategory = {
    id: number;
    uuid: string;
    code: string;
    name: string;
};

type OfferOperationCategoriesEditProps = {
    category: OfferOperationCategory;
    errors?: Record<string, string>;
};

export default function OfferOperationCategoriesEdit({
    category,
    errors: serverErrors,
}: OfferOperationCategoriesEditProps) {
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
            title: category.name,
            href: offerOperationCategories.show({
                offerOperationCategory: category.uuid,
            }).url,
        },
        {
            title: 'Modifica',
            href: offerOperationCategories.edit({
                offerOperationCategory: category.uuid,
            }).url,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Modifica Categoria Operazione ${category.name}`} />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex w-full justify-center">
                    <div className="w-full max-w-4xl space-y-5">
                        <Card>
                            <CardHeader>
                                <CardTitle>
                                    Modifica Categoria Operazione
                                </CardTitle>
                                <CardDescription>
                                    Aggiorna le informazioni della categoria
                                    operazione.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Form
                                    action={
                                        offerOperationCategories.update({
                                            offerOperationCategory:
                                                category.uuid,
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
                                                    <FormLabel htmlFor="uuid">
                                                        UUID
                                                    </FormLabel>
                                                    <Input
                                                        id="uuid"
                                                        name="uuid"
                                                        defaultValue={
                                                            category.uuid
                                                        }
                                                        readOnly
                                                        className="bg-muted"
                                                    />
                                                </div>

                                                <div className="grid gap-2">
                                                    <FormLabel
                                                        htmlFor="code"
                                                        required
                                                    >
                                                        Codice
                                                    </FormLabel>
                                                    <Input
                                                        id="code"
                                                        name="code"
                                                        defaultValue={
                                                            category.code
                                                        }
                                                        required
                                                        placeholder="Codice Categoria"
                                                        maxLength={255}
                                                        aria-describedby="code-help"
                                                    />
                                                    <p
                                                        id="code-help"
                                                        className="text-xs text-muted-foreground"
                                                    >
                                                        Inserisci il codice
                                                        univoco della categoria
                                                        (massimo 255 caratteri).
                                                    </p>
                                                    <InputError
                                                        message={allErrors.code}
                                                    />
                                                </div>

                                                <div className="grid gap-2">
                                                    <FormLabel
                                                        htmlFor="name"
                                                        required
                                                    >
                                                        Nome
                                                    </FormLabel>
                                                    <Input
                                                        id="name"
                                                        name="name"
                                                        defaultValue={
                                                            category.name
                                                        }
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
                                                            ? 'Aggiornando...'
                                                            : 'Aggiorna Categoria'}
                                                    </Button>
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        onClick={() =>
                                                            router.visit(
                                                                offerOperationCategories.show(
                                                                    {
                                                                        offerOperationCategory:
                                                                            category.uuid,
                                                                    },
                                                                ).url,
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
