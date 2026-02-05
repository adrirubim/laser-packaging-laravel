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
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { generateUUID } from '@/lib/utils/uuid';
import lsResources from '@/routes/ls-resources/index';
import { type BreadcrumbItem } from '@/types';
import { Form, Head, router } from '@inertiajs/react';
import { useState } from 'react';

type LsResourcesCreateProps = {
    errors?: Record<string, string>;
};

export default function LsResourcesCreate({
    errors: serverErrors,
}: LsResourcesCreateProps) {
    const [uuid, setUuid] = useState<string>(generateUUID());

    const regenerateUuid = () => {
        setUuid(generateUUID());
    };
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Offerte',
            href: '/offers',
        },
        {
            title: 'L&S Risorse',
            href: lsResources.index().url,
        },
        {
            title: 'Crea',
            href: lsResources.create().url,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Crea Risorsa L&S" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <Card>
                    <CardHeader>
                        <CardTitle>Gestione Risorsa L&S</CardTitle>
                        <CardDescription>Inserimento</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Form
                            action={lsResources.store().url}
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
                                                <Label htmlFor="uuid">
                                                    UUID *
                                                </Label>
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
                                            <Label htmlFor="code">
                                                Codice *
                                            </Label>
                                            <Input
                                                id="code"
                                                name="code"
                                                required
                                                placeholder="Codice Risorsa"
                                                maxLength={255}
                                                aria-describedby="code-help"
                                            />
                                            <p
                                                id="code-help"
                                                className="text-xs text-muted-foreground"
                                            >
                                                Inserisci il codice univoco
                                                della risorsa (massimo 255
                                                caratteri).
                                            </p>
                                            <InputError
                                                message={allErrors.code}
                                            />
                                        </div>

                                        <div className="grid gap-2">
                                            <Label htmlFor="name">
                                                Descrizione
                                            </Label>
                                            <Input
                                                id="name"
                                                name="name"
                                                placeholder="Descrizione Risorsa"
                                                maxLength={255}
                                                aria-describedby="name-help"
                                            />
                                            <p
                                                id="name-help"
                                                className="text-xs text-muted-foreground"
                                            >
                                                Inserisci una descrizione
                                                opzionale della risorsa (massimo
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
                                                    ? 'Creando...'
                                                    : 'Crea Risorsa'}
                                            </Button>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() =>
                                                    router.visit(
                                                        lsResources.index().url,
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
