import { ConfirmCloseDialog } from '@/components/confirm-close-dialog';
import { FormValidationNotification } from '@/components/form-validation-notification';
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

type CQModel = {
    uuid: string;
    cod_model: string;
    description_model?: string | null;
    filename?: string | null;
};

type CQModelsEditProps = {
    model: CQModel;
    errors?: Record<string, string>;
};

export default function CQModelsEdit({
    errors: serverErrors,
}: CQModelsEditProps) {
    const { props } = usePage<CQModelsEditProps>();
    const cqModel = props.model;
    const [selectedFileName, setSelectedFileName] = useState<string | null>(
        null,
    );
    const [showCloseConfirm, setShowCloseConfirm] = useState(false);

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
            title: cqModel.cod_model,
            href: `/articles/cq-models/${cqModel.uuid}`,
        },
        {
            title: 'Modifica',
            href: `/articles/cq-models/${cqModel.uuid}/edit`,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Modifica Modello ${cqModel.cod_model}`} />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex w-full justify-center">
                    <div className="w-full max-w-4xl space-y-5">
                        <Card>
                            <CardHeader>
                                <CardTitle>Modifica Modello CQ</CardTitle>
                                <CardDescription>
                                    Modifica i dettagli del modello
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Form
                                    action={
                                        articles.cqModels.update({
                                            cqModel: cqModel.uuid,
                                        }).url
                                    }
                                    method="post"
                                    className="space-y-6"
                                >
                                    {({ processing, errors }) => {
                                        const allErrors = {
                                            ...errors,
                                            ...serverErrors,
                                        };
                                        const hasAttemptedSubmit =
                                            Object.keys(allErrors).length > 0;

                                        return (
                                            <>
                                                <FormValidationNotification
                                                    errors={allErrors}
                                                    hasAttemptedSubmit={
                                                        hasAttemptedSubmit
                                                    }
                                                />
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
                                                        defaultValue={
                                                            cqModel.cod_model
                                                        }
                                                        maxLength={255}
                                                    />
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
                                                        defaultValue={
                                                            cqModel.description_model ??
                                                            ''
                                                        }
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
                                                    {cqModel.filename && (
                                                        <div className="mb-2 rounded-md bg-muted p-2">
                                                            <p className="mb-1 text-xs text-muted-foreground">
                                                                Allegato
                                                                attuale:
                                                            </p>
                                                            <p className="font-mono text-sm">
                                                                {
                                                                    cqModel.filename
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
                                                        {cqModel.filename
                                                            ? 'Carica un nuovo allegato PDF per sostituire quello esistente (opzionale).'
                                                            : 'Seleziona un allegato PDF da associare al modello (opzionale).'}
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
                                                            : 'Aggiorna Modello'}
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
                        articles.cqModels.show({
                            cqModel: cqModel.uuid,
                        }).url,
                    );
                }}
            />
        </AppLayout>
    );
}
