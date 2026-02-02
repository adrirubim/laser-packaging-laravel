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
import lasFamilies from '@/routes/las-families';
import { type BreadcrumbItem } from '@/types';
import { Form, Head, router } from '@inertiajs/react';

type LasFamily = {
    id: number;
    uuid: string;
    code: string;
    name: string;
};

type LasFamiliesEditProps = {
    family: LasFamily;
    errors?: Record<string, string>;
};

export default function LasFamiliesEdit({
    family,
    errors: serverErrors,
}: LasFamiliesEditProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Offerte',
            href: '/offers',
        },
        {
            title: 'Famiglia LAS',
            href: lasFamilies.index().url,
        },
        {
            title: family.name,
            href: lasFamilies.show({ lasFamily: family.uuid }).url,
        },
        {
            title: 'Modifica',
            href: lasFamilies.edit({ lasFamily: family.uuid }).url,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Modifica Famiglia LAS ${family.name}`} />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex w-full justify-center">
                    <div className="w-full max-w-4xl space-y-5">
                        <Card>
                            <CardHeader>
                                <CardTitle>Gestione Famiglia LAS</CardTitle>
                                <CardDescription>Modifica</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Form
                                    action={
                                        lasFamilies.update({
                                            lasFamily: family.uuid,
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
                                                            family.uuid
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
                                                            family.code
                                                        }
                                                        required
                                                        placeholder="Codice Famiglia LAS"
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
                                                            family.name
                                                        }
                                                        required
                                                        placeholder="Nome Famiglia LAS"
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
                                                            : 'Aggiorna Famiglia LAS'}
                                                    </Button>
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        onClick={() =>
                                                            router.visit(
                                                                lasFamilies.show(
                                                                    {
                                                                        lasFamily:
                                                                            family.uuid,
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
