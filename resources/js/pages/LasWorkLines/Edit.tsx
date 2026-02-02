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
import lasWorkLines from '@/routes/las-work-lines';
import { type BreadcrumbItem } from '@/types';
import { Form, Head, router } from '@inertiajs/react';

type LasWorkLine = {
    id: number;
    uuid: string;
    code: string;
    name: string;
};

type LasWorkLinesEditProps = {
    workLine: LasWorkLine;
    errors?: Record<string, string>;
};

export default function LasWorkLinesEdit({
    workLine,
    errors: serverErrors,
}: LasWorkLinesEditProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Offerte',
            href: '/offers',
        },
        {
            title: 'LAS Linee di Lavoro',
            href: lasWorkLines.index().url,
        },
        {
            title: workLine.name,
            href: lasWorkLines.show({ lasWorkLine: workLine.uuid }).url,
        },
        {
            title: 'Modifica',
            href: lasWorkLines.edit({ lasWorkLine: workLine.uuid }).url,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Modifica Linea di Lavoro LAS ${workLine.name}`} />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex w-full justify-center">
                    <div className="w-full max-w-4xl space-y-5">
                        <Card>
                            <CardHeader>
                                <CardTitle>
                                    Gestione Linea di Lavoro LAS
                                </CardTitle>
                                <CardDescription>Modifica</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Form
                                    action={
                                        lasWorkLines.update({
                                            lasWorkLine: workLine.uuid,
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
                                                            workLine.uuid
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
                                                            workLine.code
                                                        }
                                                        required
                                                        placeholder="Codice Linea di Lavoro"
                                                    />
                                                    <InputError
                                                        message={allErrors.code}
                                                    />
                                                </div>

                                                <div className="grid gap-2">
                                                    <Label htmlFor="name">
                                                        Nome *
                                                    </Label>
                                                    <Input
                                                        id="name"
                                                        name="name"
                                                        defaultValue={
                                                            workLine.name
                                                        }
                                                        required
                                                        placeholder="Nome Linea di Lavoro"
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
                                                            : 'Aggiorna Linea di Lavoro'}
                                                    </Button>
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        onClick={() =>
                                                            router.visit(
                                                                lasWorkLines.show(
                                                                    {
                                                                        lasWorkLine:
                                                                            workLine.uuid,
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
