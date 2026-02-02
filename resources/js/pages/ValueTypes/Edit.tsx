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
import valueTypes from '@/routes/value-types';
import { type BreadcrumbItem } from '@/types';
import { Form, Head, router } from '@inertiajs/react';

type ValueType = {
    id: number;
    uuid: string;
};

type ValueTypesEditProps = {
    valueType: ValueType;
    errors?: Record<string, string>;
};

export default function ValueTypesEdit({ valueType }: ValueTypesEditProps) {
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
            title: valueType.uuid.substring(0, 8) + '...',
            href: valueTypes.show({ valueType: valueType.uuid }).url,
        },
        {
            title: 'Modifica',
            href: valueTypes.edit({ valueType: valueType.uuid }).url,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head
                title={`Modifica Tipo di Valore ${valueType.uuid.substring(0, 8)}...`}
            />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <Card>
                    <CardHeader>
                        <CardTitle>Gestione Tipo di Valore</CardTitle>
                        <CardDescription>Modifica</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Form
                            action={
                                valueTypes.update({ valueType: valueType.uuid })
                                    .url
                            }
                            method="put"
                            className="space-y-6"
                        >
                            {({ processing }) => (
                                <>
                                    <div className="grid gap-2">
                                        <Label htmlFor="uuid">UUID</Label>
                                        <Input
                                            id="uuid"
                                            name="uuid"
                                            defaultValue={valueType.uuid}
                                            readOnly
                                            className="bg-muted"
                                        />
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <Button
                                            type="submit"
                                            disabled={processing}
                                        >
                                            {processing
                                                ? 'Aggiornando...'
                                                : 'Aggiorna Tipo di Valore'}
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() =>
                                                router.visit(
                                                    valueTypes.show({
                                                        valueType:
                                                            valueType.uuid,
                                                    }).url,
                                                )
                                            }
                                        >
                                            Annulla
                                        </Button>
                                    </div>
                                </>
                            )}
                        </Form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
