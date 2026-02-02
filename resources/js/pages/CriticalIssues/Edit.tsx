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
import criticalIssues from '@/routes/critical-issues';
import { type BreadcrumbItem } from '@/types';
import { Form, Head } from '@inertiajs/react';

type CriticalIssue = {
    id: number;
    uuid: string;
    name: string;
};

type CriticalIssuesEditProps = {
    criticalIssue: CriticalIssue;
    errors?: Record<string, string>;
};

export default function CriticalIssuesEdit({
    criticalIssue,
    errors: serverErrors,
}: CriticalIssuesEditProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Criticità',
            href: criticalIssues.index().url,
        },
        {
            title: criticalIssue.name,
            href: criticalIssues.show({ criticalIssue: criticalIssue.uuid })
                .url,
        },
        {
            title: 'Modifica',
            href: criticalIssues.edit({ criticalIssue: criticalIssue.uuid })
                .url,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Modifica Criticità ${criticalIssue.name}`} />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <Card>
                    <CardHeader>
                        <CardTitle>Gestione Criticità</CardTitle>
                        <CardDescription>Modifica</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Form
                            action={
                                criticalIssues.update({
                                    criticalIssue: criticalIssue.uuid,
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
                                            <Label htmlFor="uuid">UUID</Label>
                                            <Input
                                                id="uuid"
                                                name="uuid"
                                                defaultValue={
                                                    criticalIssue.uuid
                                                }
                                                readOnly
                                                className="bg-muted"
                                            />
                                        </div>

                                        <div className="grid gap-2">
                                            <Label htmlFor="name">
                                                Nome Criticità *
                                            </Label>
                                            <Input
                                                id="name"
                                                name="name"
                                                required
                                                defaultValue={
                                                    criticalIssue.name
                                                }
                                                placeholder="Nome Criticità"
                                                maxLength={255}
                                                aria-describedby="name-help"
                                            />
                                            <p
                                                id="name-help"
                                                className="text-xs text-muted-foreground"
                                            >
                                                Inserisci il nome della
                                                criticità (massimo 255
                                                caratteri).
                                            </p>
                                            <InputError
                                                message={allErrors.name}
                                            />
                                        </div>

                                        <div className="flex items-center justify-end gap-3 pt-4">
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() =>
                                                    window.history.back()
                                                }
                                                disabled={processing}
                                            >
                                                Annulla
                                            </Button>
                                            <Button
                                                type="submit"
                                                disabled={processing}
                                            >
                                                {processing
                                                    ? 'Salvando...'
                                                    : 'Salva'}
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
