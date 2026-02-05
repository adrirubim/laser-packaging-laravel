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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { generateUUID } from '@/lib/utils/uuid';
import offerOperations from '@/routes/offer-operations/index';
import { type BreadcrumbItem } from '@/types';
import { Form, Head, router, usePage } from '@inertiajs/react';
import { useState } from 'react';

type OfferOperationCategory = {
    uuid: string;
    name: string;
};

type OfferOperationsCreateProps = {
    categories: OfferOperationCategory[];
    category_uuid?: string;
    errors?: Record<string, string>;
};

export default function OfferOperationsCreate({
    errors: serverErrors,
}: OfferOperationsCreateProps) {
    const { props } = usePage<OfferOperationsCreateProps>();
    const { categories, category_uuid } = props;
    const [uuid, setUuid] = useState<string>(generateUUID());
    const [selectedCategory, setSelectedCategory] = useState<string>(
        category_uuid ?? '',
    );

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Offerte',
            href: '/offers',
        },
        {
            title: 'Operazioni',
            href: offerOperations.index().url,
        },
        {
            title: 'Nuova Operazione',
            href: offerOperations.create().url,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Nuova Operazione" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <Card>
                    <CardHeader>
                        <CardTitle>Nuova Operazione</CardTitle>
                        <CardDescription>
                            Compila i campi per creare un'operazione.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Form
                            action={offerOperations.store().url}
                            method="post"
                            encType="multipart/form-data"
                            className="space-y-5"
                        >
                            {({ processing, errors }) => {
                                const allErrors = {
                                    ...errors,
                                    ...serverErrors,
                                };

                                return (
                                    <>
                                        <div className="flex justify-center">
                                            <div className="w-full max-w-4xl space-y-5">
                                                <div className="grid gap-2">
                                                    <FormLabel
                                                        htmlFor="uuid"
                                                        required
                                                    >
                                                        UUID
                                                    </FormLabel>
                                                    <Input
                                                        id="uuid"
                                                        name="uuid"
                                                        value={uuid}
                                                        onChange={(e) =>
                                                            setUuid(
                                                                e.target.value,
                                                            )
                                                        }
                                                        required
                                                        placeholder="UUID (es. ab7c1687-f611-8372-cef8-47ae6bdf1f65)"
                                                    />
                                                    <InputError
                                                        message={allErrors.uuid}
                                                    />
                                                </div>

                                                <div className="grid gap-2">
                                                    <FormLabel htmlFor="category_uuid">
                                                        Categoria
                                                    </FormLabel>
                                                    <input
                                                        type="hidden"
                                                        name="category_uuid"
                                                        value={
                                                            selectedCategory ||
                                                            ''
                                                        }
                                                    />
                                                    <Select
                                                        value={
                                                            selectedCategory ||
                                                            undefined
                                                        }
                                                        onValueChange={(
                                                            value,
                                                        ) =>
                                                            setSelectedCategory(
                                                                value,
                                                            )
                                                        }
                                                    >
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Seleziona la categoria..." />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {categories.map(
                                                                (category) => (
                                                                    <SelectItem
                                                                        key={
                                                                            category.uuid
                                                                        }
                                                                        value={
                                                                            category.uuid
                                                                        }
                                                                    >
                                                                        {
                                                                            category.name
                                                                        }
                                                                    </SelectItem>
                                                                ),
                                                            )}
                                                        </SelectContent>
                                                    </Select>
                                                    <InputError
                                                        message={
                                                            allErrors.category_uuid
                                                        }
                                                    />
                                                </div>

                                                <div className="grid gap-2">
                                                    <FormLabel htmlFor="codice">
                                                        Codice
                                                    </FormLabel>
                                                    <Input
                                                        id="codice"
                                                        name="codice"
                                                        disabled={
                                                            !selectedCategory
                                                        }
                                                        className={
                                                            !selectedCategory
                                                                ? 'cursor-not-allowed bg-muted'
                                                                : ''
                                                        }
                                                        placeholder={
                                                            selectedCategory
                                                                ? 'Codice Operazione'
                                                                : 'Seleziona prima una categoria'
                                                        }
                                                        maxLength={255}
                                                        aria-describedby="codice-help"
                                                    />
                                                    <p
                                                        id="codice-help"
                                                        className="text-xs text-muted-foreground"
                                                    >
                                                        {!selectedCategory
                                                            ? 'Seleziona una categoria per abilitare questo campo (massimo 255 caratteri).'
                                                            : "Inserisci il codice dell'operazione (massimo 255 caratteri)."}
                                                    </p>
                                                    <InputError
                                                        message={
                                                            allErrors.codice
                                                        }
                                                    />
                                                </div>

                                                <div className="grid gap-2">
                                                    <FormLabel htmlFor="descrizione">
                                                        Descrizione
                                                    </FormLabel>
                                                    <Textarea
                                                        id="descrizione"
                                                        name="descrizione"
                                                        placeholder="Descrizione Operazione"
                                                        rows={3}
                                                        aria-describedby="descrizione-help"
                                                    />
                                                    <p
                                                        id="descrizione-help"
                                                        className="text-xs text-muted-foreground"
                                                    >
                                                        Inserisci una
                                                        descrizione dettagliata
                                                        dell'operazione.
                                                    </p>
                                                    <InputError
                                                        message={
                                                            allErrors.descrizione
                                                        }
                                                    />
                                                </div>

                                                <div className="grid gap-2">
                                                    <FormLabel htmlFor="secondi_operazione">
                                                        Secondi operazione
                                                    </FormLabel>
                                                    <Input
                                                        id="secondi_operazione"
                                                        name="secondi_operazione"
                                                        type="number"
                                                        min="0"
                                                        step="0.01"
                                                        placeholder="0"
                                                        aria-describedby="secondi-help"
                                                    />
                                                    <p
                                                        id="secondi-help"
                                                        className="text-xs text-muted-foreground"
                                                    >
                                                        Inserisci la durata
                                                        dell'operazione in
                                                        secondi (può includere
                                                        decimali, es. 12.5).
                                                    </p>
                                                    <InputError
                                                        message={
                                                            allErrors.secondi_operazione
                                                        }
                                                    />
                                                </div>

                                                <div className="grid gap-2">
                                                    <FormLabel htmlFor="filename">
                                                        Allegato
                                                    </FormLabel>
                                                    <Input
                                                        id="filename"
                                                        name="filename"
                                                        type="file"
                                                        accept="*/*"
                                                        className="cursor-pointer"
                                                    />
                                                    <p className="text-xs text-muted-foreground">
                                                        Seleziona un allegato da
                                                        caricare per questa
                                                        operazione
                                                    </p>
                                                    <InputError
                                                        message={
                                                            allErrors.filename
                                                        }
                                                    />
                                                </div>

                                                <div className="flex items-center gap-4">
                                                    <Button
                                                        type="submit"
                                                        disabled={processing}
                                                    >
                                                        {processing
                                                            ? 'Creando...'
                                                            : 'Crea Operazione'}
                                                    </Button>
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        onClick={() =>
                                                            router.visit(
                                                                offerOperations.index()
                                                                    .url,
                                                            )
                                                        }
                                                    >
                                                        Annulla
                                                    </Button>
                                                </div>
                                            </div>
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
