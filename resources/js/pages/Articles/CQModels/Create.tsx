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
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import AppLayout from '@/layouts/app-layout';
import articles from '@/routes/articles/index';
import { type BreadcrumbItem } from '@/types';
import { Form, Head, router } from '@inertiajs/react';
import { HelpCircle } from 'lucide-react';
import { useEffect, useState } from 'react';

type CQModelsCreateProps = {
    errors?: Record<string, string>;
};

export default function CQModelsCreate({
    errors: serverErrors,
}: CQModelsCreateProps) {
    const [cquCode, setCquCode] = useState<string>('');
    const [isLoadingCode, setIsLoadingCode] = useState(false);

    useEffect(() => {
        queueMicrotask(() => setIsLoadingCode(true));
        fetch('/articles/cq-models/generate-cqu-number')
            .then((res) => res.json())
            .then((data) => {
                if (data.cod_model) {
                    setCquCode(data.cod_model);
                }
                setIsLoadingCode(false);
            })
            .catch(() => setIsLoadingCode(false));
    }, []);

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Articoli',
            href: articles.index().url,
        },
        {
            title: 'Modelli CQ',
            href: '/articles/cq-models',
        },
        {
            title: 'Crea',
            href: '/articles/cq-models/create',
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Crea Modello CQ" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex w-full justify-center">
                    <div className="w-full max-w-4xl space-y-5">
                        <Card>
                            <CardHeader>
                                <CardTitle>Nuovo Modello CQ</CardTitle>
                                <CardDescription>
                                    Inserisci i dettagli per creare un nuovo
                                    modello
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Form
                                    action={articles.cqModels.store().url}
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
                                                    <div className="flex items-center gap-2">
                                                        <FormLabel
                                                            htmlFor="cod_model"
                                                            required
                                                        >
                                                            Codice Modello
                                                        </FormLabel>
                                                        <Tooltip>
                                                            <TooltipTrigger
                                                                asChild
                                                            >
                                                                <HelpCircle className="h-4 w-4 cursor-help text-muted-foreground" />
                                                            </TooltipTrigger>
                                                            <TooltipContent>
                                                                <p>
                                                                    Il codice
                                                                    modello è
                                                                    proposto
                                                                    automaticamente
                                                                    ma può
                                                                    essere
                                                                    modificato
                                                                </p>
                                                            </TooltipContent>
                                                        </Tooltip>
                                                    </div>
                                                    <Input
                                                        id="cod_model"
                                                        name="cod_model"
                                                        required
                                                        placeholder="CQU001"
                                                        value={cquCode}
                                                        onChange={(e) =>
                                                            setCquCode(
                                                                e.target.value,
                                                            )
                                                        }
                                                        maxLength={255}
                                                        disabled={isLoadingCode}
                                                    />
                                                    {isLoadingCode && (
                                                        <p className="text-xs text-muted-foreground">
                                                            Generazione
                                                            codice...
                                                        </p>
                                                    )}
                                                    <p className="text-xs text-muted-foreground">
                                                        Il codice modello è
                                                        proposto automaticamente
                                                        ma può essere
                                                        modificato.
                                                    </p>
                                                    <InputError
                                                        message={
                                                            allErrors.cod_model
                                                        }
                                                    />
                                                </div>

                                                <div className="grid gap-2">
                                                    <FormLabel
                                                        htmlFor="description_model"
                                                        required
                                                    >
                                                        Descrizione Modello
                                                    </FormLabel>
                                                    <Input
                                                        id="description_model"
                                                        name="description_model"
                                                        required
                                                        placeholder="Descrizione del modello"
                                                        maxLength={255}
                                                    />
                                                    <InputError
                                                        message={
                                                            allErrors.description_model
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
                                                        accept="application/pdf"
                                                        className="cursor-pointer"
                                                        aria-describedby="filename-help"
                                                    />
                                                    <p
                                                        id="filename-help"
                                                        className="text-xs text-muted-foreground"
                                                    >
                                                        Seleziona un allegato
                                                        PDF da associare al
                                                        modello (opzionale).
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
                                                            : 'Crea Modello'}
                                                    </Button>
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        onClick={() =>
                                                            router.visit(
                                                                articles.cqModels.index()
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
