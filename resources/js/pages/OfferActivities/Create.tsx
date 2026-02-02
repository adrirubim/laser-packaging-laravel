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
import { useFieldValidation } from '@/hooks/useFieldValidation';
import AppLayout from '@/layouts/app-layout';
import { generateUUID } from '@/lib/utils/uuid';
import { validationRules } from '@/lib/validation/rules';
import offerActivities from '@/routes/offer-activities';
import { type BreadcrumbItem } from '@/types';
import { Form, Head, router } from '@inertiajs/react';
import { useState } from 'react';

type OfferActivitiesCreateProps = {
    errors?: Record<string, string>;
};

export default function OfferActivitiesCreate({
    errors: serverErrors,
}: OfferActivitiesCreateProps) {
    const [uuid, setUuid] = useState<string>(generateUUID());
    const [nameValue, setNameValue] = useState<string>('');

    const regenerateUuid = () => {
        setUuid(generateUUID());
    };

    // Validazione in tempo reale per name
    const nameValidation = useFieldValidation(nameValue, [
        validationRules.required('Il nome è obbligatorio'),
        validationRules.maxLength(
            255,
            'Il nome non può superare 255 caratteri',
        ),
    ]);
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Offerte',
            href: '/offers',
        },
        {
            title: 'Attività',
            href: offerActivities.index().url,
        },
        {
            title: 'Crea',
            href: offerActivities.create().url,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Crea Attività" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <Card>
                    <CardHeader>
                        <CardTitle>Gestione Attività</CardTitle>
                        <CardDescription>Inserimento</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Form
                            action={offerActivities.store().url}
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
                                            <FormLabel htmlFor="name" required>
                                                Nome
                                            </FormLabel>
                                            <Input
                                                id="name"
                                                name="name"
                                                value={nameValue}
                                                onChange={(e) =>
                                                    setNameValue(e.target.value)
                                                }
                                                onBlur={nameValidation.onBlur}
                                                onFocus={nameValidation.onFocus}
                                                required
                                                placeholder="Nome Attività"
                                                maxLength={255}
                                                aria-describedby="name-help"
                                                className={
                                                    nameValidation.error
                                                        ? 'border-destructive'
                                                        : ''
                                                }
                                            />
                                            {nameValidation.error && (
                                                <InputError
                                                    message={
                                                        nameValidation.error
                                                    }
                                                />
                                            )}
                                            <p
                                                id="name-help"
                                                className="text-xs text-muted-foreground"
                                            >
                                                Inserisci il nome dell'attività
                                                (massimo 255 caratteri).
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
                                                    : 'Crea Attività'}
                                            </Button>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() =>
                                                    router.visit(
                                                        offerActivities.index()
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
