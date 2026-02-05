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
import { Form, Head, router, usePage } from '@inertiajs/react';
import { HelpCircle } from 'lucide-react';
import { useState } from 'react';

type OperationalInstruction = {
    uuid: string;
    code: string;
    number?: string | null;
    filename?: string | null;
};

type OperationalInstructionsEditProps = {
    instruction: OperationalInstruction;
    errors?: Record<string, string>;
};

export default function OperationalInstructionsEdit({
    errors: serverErrors,
}: OperationalInstructionsEditProps) {
    const { props } = usePage<OperationalInstructionsEditProps>();
    const { instruction } = props;
    const [selectedFileName, setSelectedFileName] = useState<string | null>(
        null,
    );

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
            title: instruction.code + (instruction.number || ''),
            href: `/articles/operational-instructions/${instruction.uuid}`,
        },
        {
            title: 'Modifica',
            href: `/articles/operational-instructions/${instruction.uuid}/edit`,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head
                title={`Modifica Istruzione ${instruction.code}${instruction.number || ''}`}
            />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex w-full justify-center">
                    <div className="w-full max-w-4xl space-y-5">
                        <Card>
                            <CardHeader>
                                <CardTitle>
                                    Modifica Istruzione Operativa
                                </CardTitle>
                                <CardDescription>
                                    Modifica i dettagli dell'istruzione
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Form
                                    action={
                                        articles.operationalInstructions.update(
                                            {
                                                operationalInstruction:
                                                    instruction.uuid,
                                            },
                                        ).url
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
                                                    <div className="flex items-center gap-2">
                                                        <FormLabel
                                                            htmlFor="code"
                                                            required
                                                        >
                                                            Codice
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
                                                                    deve essere
                                                                    univoco
                                                                </p>
                                                            </TooltipContent>
                                                        </Tooltip>
                                                    </div>
                                                    <Input
                                                        id="code"
                                                        name="code"
                                                        required
                                                        defaultValue={
                                                            instruction.code
                                                        }
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
                                                    </div>
                                                    <Input
                                                        id="number"
                                                        name="number"
                                                        defaultValue={
                                                            instruction.number ??
                                                            ''
                                                        }
                                                        maxLength={255}
                                                    />
                                                    <InputError
                                                        message={
                                                            allErrors.number
                                                        }
                                                    />
                                                </div>

                                                <div className="grid gap-2">
                                                    <FormLabel htmlFor="filename">
                                                        Allegato
                                                    </FormLabel>
                                                    {instruction.filename && (
                                                        <div className="mb-2 rounded-md bg-muted p-2">
                                                            <p className="mb-1 text-xs text-muted-foreground">
                                                                Allegato
                                                                attuale:
                                                            </p>
                                                            <p className="font-mono text-sm">
                                                                {
                                                                    instruction.filename
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
                                                        {instruction.filename
                                                            ? 'Carica un nuovo allegato PDF per sostituire quello esistente (opzionale).'
                                                            : "Seleziona un allegato PDF da associare all'istruzione (opzionale)."}
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
                                                            : 'Aggiorna Istruzione'}
                                                    </Button>
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        onClick={() =>
                                                            router.visit(
                                                                articles.operationalInstructions.show(
                                                                    {
                                                                        operationalInstruction:
                                                                            instruction.uuid,
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
