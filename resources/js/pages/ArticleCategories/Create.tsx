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
import articleCategories from '@/routes/article-categories/index';
import { type BreadcrumbItem } from '@/types';
import { Form, Head, router } from '@inertiajs/react';

type ArticleCategoriesCreateProps = {
    errors?: Record<string, string>;
};

export default function ArticleCategoriesCreate({
    errors: serverErrors,
}: ArticleCategoriesCreateProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Categoria Articoli',
            href: articleCategories.index().url,
        },
        {
            title: 'Nuova Categoria',
            href: articleCategories.create().url,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Nuova Categoria Articolo" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <Card>
                    <CardHeader>
                        <CardTitle>Nuova Categoria Articolo</CardTitle>
                        <CardDescription>
                            Compila i campi per creare una categoria di
                            articolo.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Form
                            action={articleCategories.store().url}
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
                                            <FormLabel htmlFor="name" required>
                                                Nome Categoria
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
                                                categoria di articolo (massimo
                                                255 caratteri).
                                            </p>
                                            <InputError
                                                message={allErrors.name}
                                            />
                                        </div>

                                        <div className="flex items-center justify-end gap-3 pt-4">
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() =>
                                                    router.visit(
                                                        articleCategories.index()
                                                            .url,
                                                    )
                                                }
                                                disabled={processing}
                                            >
                                                Annulla
                                            </Button>
                                            <Button
                                                type="submit"
                                                disabled={processing}
                                            >
                                                {processing
                                                    ? 'Creando...'
                                                    : 'Crea Categoria'}
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
