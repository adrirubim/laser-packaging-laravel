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
import lsResources from '@/routes/ls-resources/index';
import { type BreadcrumbItem } from '@/types';
import { Form, Head, router } from '@inertiajs/react';

type LsResource = {
    id: number;
    uuid: string;
    code: string;
    name: string;
};

type LsResourcesEditProps = {
    resource: LsResource;
    errors?: Record<string, string>;
};

export default function LsResourcesEdit({
    resource,
    errors: serverErrors,
}: LsResourcesEditProps) {
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
            title: resource.name,
            href: lsResources.show({ lsResource: resource.uuid }).url,
        },
        {
            title: 'Modifica',
            href: lsResources.edit({ lsResource: resource.uuid }).url,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Modifica Risorsa L&S ${resource.name}`} />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex w-full justify-center">
                    <div className="w-full max-w-4xl space-y-5">
                        <Card>
                            <CardHeader>
                                <CardTitle>Gestione Risorsa L&S</CardTitle>
                                <CardDescription>Modifica</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Form
                                    action={
                                        lsResources.update({
                                            lsResource: resource.uuid,
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
                                                    <Label htmlFor="uuid">
                                                        UUID
                                                    </Label>
                                                    <Input
                                                        id="uuid"
                                                        name="uuid"
                                                        defaultValue={
                                                            resource.uuid
                                                        }
                                                        readOnly
                                                        className="bg-muted"
                                                    />
                                                </div>

                                                <div className="grid gap-2">
                                                    <Label htmlFor="code">
                                                        Codice *
                                                    </Label>
                                                    <Input
                                                        id="code"
                                                        name="code"
                                                        defaultValue={
                                                            resource.code
                                                        }
                                                        required
                                                        placeholder="Codice Risorsa"
                                                    />
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
                                                        defaultValue={
                                                            resource.name
                                                        }
                                                        placeholder="Descrizione Risorsa"
                                                    />
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
                                                            : 'Aggiorna Risorsa'}
                                                    </Button>
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        onClick={() =>
                                                            router.visit(
                                                                lsResources.show(
                                                                    {
                                                                        lsResource:
                                                                            resource.uuid,
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
