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

type OperationalInstructionsCreateProps = {
    errors?: Record<string, string>;
};

export default function OperationalInstructionsCreate({
    errors: serverErrors,
}: OperationalInstructionsCreateProps) {
    const [ioNumber, setIoNumber] = useState<string>('');
    const [isLoadingNumber, setIsLoadingNumber] = useState(false);

    useEffect(() => {
        queueMicrotask(() => setIsLoadingNumber(true));
        fetch('/articles/operational-instructions/generate-io-number')
            .then((res) => res.json())
            .then((data) => {
                if (data.number) {
                    setIoNumber(data.number);
                }
                setIsLoadingNumber(false);
            })
            .catch(() => setIsLoadingNumber(false));
    }, []);

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Articoli',
            href: articles.index().url,
        },
        {
            title: 'Istruzioni Operative',
            href: '/articles/operational-instructions',
        },
        {
            title: 'Crea',
            href: '/articles/operational-instructions/create',
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Crea Istruzione Operativa" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <Card>
                    <CardHeader>
                        <CardTitle>Nuova Istruzione Operativa</CardTitle>
                        <CardDescription>
                            Inserisci i dettagli per creare una nuova istruzione
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Form
                            action={
                                articles.operationalInstructions.store().url
                            }
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
                                                    htmlFor="code"
                                                    required
                                                >
                                                    Codice
                                                </FormLabel>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <HelpCircle className="h-4 w-4 cursor-help text-muted-foreground" />
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <p>
                                                            Il codice deve
                                                            essere univoco
                                                        </p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </div>
                                            <Input
                                                id="code"
                                                name="code"
                                                required
                                                placeholder="IO"
                                                defaultValue="IO"
                                                maxLength={255}
                                            />
                                            <InputError
                                                message={allErrors.code}
                                            />
                                        </div>

                                        <div className="grid gap-2">
                                            <div className="flex items-center gap-2">
                                                <FormLabel
                                                    htmlFor="number"
                                                    required
                                                >
                                                    Numero
                                                </FormLabel>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <HelpCircle className="h-4 w-4 cursor-help text-muted-foreground" />
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <p>
                                                            Numero progressivo
                                                            generato
                                                            automaticamente
                                                        </p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </div>
                                            <Input
                                                id="number"
                                                name="number"
                                                required
                                                placeholder="0001"
                                                value={ioNumber}
                                                onChange={(e) =>
                                                    setIoNumber(e.target.value)
                                                }
                                                maxLength={255}
                                                disabled={isLoadingNumber}
                                            />
                                            {isLoadingNumber && (
                                                <p className="text-xs text-muted-foreground">
                                                    Generazione numero...
                                                </p>
                                            )}
                                            <InputError
                                                message={allErrors.number}
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
                                                Seleziona un allegato PDF da
                                                associare all'istruzione
                                                (opzionale).
                                            </p>
                                            <InputError
                                                message={allErrors.filename}
                                            />
                                        </div>

                                        <div className="flex items-center gap-4">
                                            <Button
                                                type="submit"
                                                disabled={processing}
                                            >
                                                {processing
                                                    ? 'Creando...'
                                                    : 'Crea Istruzione'}
                                            </Button>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() =>
                                                    router.visit(
                                                        articles.operationalInstructions.index()
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
