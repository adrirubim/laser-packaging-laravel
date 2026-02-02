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
import articles from '@/routes/articles';
import { type BreadcrumbItem } from '@/types';
import { Form, Head, router } from '@inertiajs/react';
import { useState } from 'react';

type PalletSheet = {
    uuid: string;
    code: string;
    description?: string | null;
    filename?: string | null;
};

type PalletSheetsEditProps = {
    sheet: PalletSheet;
    errors?: Record<string, string>;
};

export default function PalletSheetsEdit({
    sheet: palletSheet,
    errors: serverErrors,
}: PalletSheetsEditProps) {
    const [selectedFileName, setSelectedFileName] = useState<string | null>(
        null,
    );
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Articoli',
            href: articles.index().url,
        },
        {
            title: 'Fogli Pallet',
            href: '/articles/pallet-sheets',
        },
        {
            title: palletSheet.code,
            href: `/articles/pallet-sheets/${palletSheet.uuid}`,
        },
        {
            title: 'Modifica',
            href: `/articles/pallet-sheets/${palletSheet.uuid}/edit`,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Modifica Foglio Pallet ${palletSheet.code}`} />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex w-full justify-center">
                    <div className="w-full max-w-4xl space-y-5">
                        <Card>
                            <CardHeader>
                                <CardTitle>Modifica Foglio Pallet</CardTitle>
                                <CardDescription>
                                    Modifica i dettagli del foglio pallet
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Form
                                    action={
                                        articles.palletSheets.update({
                                            palletSheet: palletSheet.uuid,
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
                                                    <FormLabel
                                                        htmlFor="code"
                                                        required
                                                    >
                                                        Codice
                                                    </FormLabel>
                                                    <Input
                                                        id="code"
                                                        name="code"
                                                        required
                                                        defaultValue={
                                                            palletSheet.code
                                                        }
                                                        maxLength={255}
                                                    />
                                                    <InputError
                                                        message={allErrors.code}
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
                                                        defaultValue={
                                                            palletSheet.description ??
                                                            ''
                                                        }
                                                        maxLength={255}
                                                    />
                                                    <InputError
                                                        message={
                                                            allErrors.description
                                                        }
                                                    />
                                                </div>

                                                <div className="grid gap-2">
                                                    <FormLabel htmlFor="filename">
                                                        Allegato
                                                    </FormLabel>
                                                    {palletSheet.filename && (
                                                        <div className="mb-2 rounded-md bg-muted p-2">
                                                            <p className="mb-1 text-xs text-muted-foreground">
                                                                Allegato
                                                                attuale:
                                                            </p>
                                                            <p className="font-mono text-sm">
                                                                {
                                                                    palletSheet.filename
                                                                }
                                                            </p>
                                                        </div>
                                                    )}
                                                    <Input
                                                        id="filename"
                                                        name="filename"
                                                        type="file"
                                                        accept="application/pdf"
                                                        className="cursor-pointer"
                                                        aria-describedby="filename-help"
                                                        onChange={(event) => {
                                                            const file =
                                                                event.target
                                                                    .files?.[0];
                                                            setSelectedFileName(
                                                                file
                                                                    ? file.name
                                                                    : null,
                                                            );
                                                        }}
                                                    />
                                                    <p
                                                        id="filename-help"
                                                        className="text-xs text-muted-foreground"
                                                    >
                                                        {palletSheet.filename
                                                            ? 'Carica un nuovo allegato PDF per sostituire quello esistente (opzionale).'
                                                            : 'Seleziona un allegato PDF da associare al foglio pallet (opzionale).'}
                                                    </p>
                                                    {selectedFileName && (
                                                        <p className="text-xs text-muted-foreground">
                                                            Nuovo allegato
                                                            selezionato:{' '}
                                                            <span className="font-mono">
                                                                {
                                                                    selectedFileName
                                                                }
                                                            </span>
                                                        </p>
                                                    )}
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
                                                            ? 'Aggiornando...'
                                                            : 'Aggiorna Foglio Pallet'}
                                                    </Button>
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        onClick={() =>
                                                            router.visit(
                                                                articles.palletSheets.show(
                                                                    {
                                                                        palletSheet:
                                                                            palletSheet.uuid,
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
