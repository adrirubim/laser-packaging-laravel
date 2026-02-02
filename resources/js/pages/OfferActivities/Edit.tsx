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
import { validationRules } from '@/lib/validation/rules';
import offerActivities from '@/routes/offer-activities';
import { type BreadcrumbItem } from '@/types';
import { Form, Head, router } from '@inertiajs/react';
import { useState } from 'react';

type OfferActivity = {
    id: number;
    uuid: string;
    name: string;
};

type OfferActivitiesEditProps = {
    activity: OfferActivity;
    errors?: Record<string, string>;
};

export default function OfferActivitiesEdit({
    activity,
    errors: serverErrors,
}: OfferActivitiesEditProps) {
    const [nameValue, setNameValue] = useState<string>(activity.name);

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
            title: activity.name,
            href: offerActivities.show({ offerActivity: activity.uuid }).url,
        },
        {
            title: 'Modifica',
            href: offerActivities.edit({ offerActivity: activity.uuid }).url,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Modifica Attività ${activity.name}`} />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex w-full justify-center">
                    <div className="w-full max-w-4xl space-y-5">
                        <Card>
                            <CardHeader>
                                <CardTitle>Gestione Attività</CardTitle>
                                <CardDescription>Modifica</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Form
                                    action={
                                        offerActivities.update({
                                            offerActivity: activity.uuid,
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
                                                            activity.uuid
                                                        }
                                                        readOnly
                                                        className="bg-muted"
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
                                                        value={nameValue}
                                                        onChange={(e) =>
                                                            setNameValue(
                                                                e.target.value,
                                                            )
                                                        }
                                                        onBlur={
                                                            nameValidation.onBlur
                                                        }
                                                        onFocus={
                                                            nameValidation.onFocus
                                                        }
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
                                                        Inserisci il nome
                                                        dell'attività (massimo
                                                        255 caratteri).
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
                                                            : 'Aggiorna Attività'}
                                                    </Button>
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        onClick={() =>
                                                            router.visit(
                                                                offerActivities.show(
                                                                    {
                                                                        offerActivity:
                                                                            activity.uuid,
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
