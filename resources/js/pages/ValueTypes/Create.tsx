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
import { generateUUID } from '@/lib/utils/uuid';
import valueTypes from '@/routes/value-types/index';
import { type BreadcrumbItem } from '@/types';
import { Form, Head, router } from '@inertiajs/react';
import { useEffect, useState } from 'react';

type ValueTypesCreateProps = {
    errors?: Record<string, string>;
};

export default function ValueTypesCreate({
    errors: serverErrors,
}: ValueTypesCreateProps) {
    const [uuid, setUuid] = useState<string>(generateUUID());
    const [regenerateUuid, setRegenerateUuid] = useState(false);

    useEffect(() => {
        if (regenerateUuid) {
            queueMicrotask(() => {
                setUuid(generateUUID());
                setRegenerateUuid(false);
            });
        }
    }, [regenerateUuid]);

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Configurazione',
            href: '#',
        },
        {
            title: 'Tipi di Valore',
            href: valueTypes.index().url,
        },
        {
            title: 'Nuovo Tipo di Valore',
            href: valueTypes.create().url,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Nuovo Tipo di Valore" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex w-full justify-center">
                    <div className="w-full max-w-4xl space-y-5">
                        <Card>
                            <CardHeader>
                                <CardTitle>Nuovo Tipo di Valore</CardTitle>
                                <CardDescription>
                                    Compila i campi per creare un tipo di
                                    valore.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Form
                                    action={valueTypes.store().url}
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
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() =>
                                                                setRegenerateUuid(
                                                                    true,
                                                                )
                                                            }
                                                            className="text-xs"
                                                        >
                                                            Rigenera UUID
                                                        </Button>
                                                    </div>
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
                                                        placeholder="UUID (es. 550e8400-e29b-41d4-a716-446655440000)"
                                                        maxLength={36}
                                                        aria-describedby="uuid-help"
                                                    />
                                                    <p
                                                        id="uuid-help"
                                                        className="text-xs text-muted-foreground"
                                                    >
                                                        Inserisci un UUID valido
                                                        (formato UUID v4).
                                                    </p>
                                                    <InputError
                                                        message={allErrors.uuid}
                                                    />
                                                </div>

                                                <div className="flex items-center gap-4">
                                                    <Button
                                                        type="submit"
                                                        disabled={processing}
                                                    >
                                                        {processing
                                                            ? 'Creando...'
                                                            : 'Crea Tipo di Valore'}
                                                    </Button>
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        onClick={() =>
                                                            router.visit(
                                                                valueTypes.index()
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
