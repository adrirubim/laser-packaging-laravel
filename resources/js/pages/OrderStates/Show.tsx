import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import orderStates from '@/routes/order-states';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Edit, Trash2 } from 'lucide-react';

type OrderState = {
    id: number;
    uuid: string;
    name: string;
    sorting: number;
    initial: boolean;
    production: boolean;
};

type OrderStatesShowProps = {
    orderState: OrderState;
};

export default function OrderStatesShow({ orderState }: OrderStatesShowProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Stati Ordine',
            href: orderStates.index().url,
        },
        {
            title: orderState.name,
            href: orderStates.show({ orderState: orderState.uuid }).url,
        },
    ];

    const handleDelete = () => {
        if (
            confirm(
                'Sei sicuro di voler eliminare questo stato ordine? Questa azione non può essere annullata.',
            )
        ) {
            router.delete(
                orderStates.destroy({ orderState: orderState.uuid }).url,
                {
                    onSuccess: () => {
                        router.visit(orderStates.index().url);
                    },
                },
            );
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Stato Ordine ${orderState.name}`} />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">
                            {orderState.name}
                        </h1>
                    </div>
                    <div className="flex gap-2">
                        <Button asChild variant="outline">
                            <Link
                                href={
                                    orderStates.edit({
                                        orderState: orderState.uuid,
                                    }).url
                                }
                            >
                                <Edit className="mr-2 h-4 w-4" />
                                Modifica
                            </Link>
                        </Button>
                        <Button variant="destructive" onClick={handleDelete}>
                            <Trash2 className="mr-2 h-4 w-4" />
                            Elimina
                        </Button>
                    </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Dettagli Stato Ordine</CardTitle>
                            <CardDescription>
                                Informazioni su questo stato ordine
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label className="text-sm font-medium text-muted-foreground">
                                    Nome
                                </Label>
                                <p className="text-lg font-semibold">
                                    {orderState.name}
                                </p>
                            </div>

                            <div>
                                <Label className="text-sm font-medium text-muted-foreground">
                                    Ordinamento
                                </Label>
                                <p className="text-lg font-semibold">
                                    {orderState.sorting}
                                </p>
                            </div>

                            <div>
                                <Label className="text-sm font-medium text-muted-foreground">
                                    Stato Iniziale
                                </Label>
                                <p>
                                    {orderState.initial ? (
                                        <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-2 py-1 text-xs font-medium text-emerald-700 dark:text-emerald-300">
                                            Sì
                                        </span>
                                    ) : (
                                        <span className="text-muted-foreground">
                                            No
                                        </span>
                                    )}
                                </p>
                            </div>

                            <div>
                                <Label className="text-sm font-medium text-muted-foreground">
                                    Stato Produzione
                                </Label>
                                <p>
                                    {orderState.production ? (
                                        <span className="inline-flex items-center rounded-full bg-blue-500/10 px-2 py-1 text-xs font-medium text-blue-700 dark:text-blue-300">
                                            Sì
                                        </span>
                                    ) : (
                                        <span className="text-muted-foreground">
                                            No
                                        </span>
                                    )}
                                </p>
                            </div>

                            <div>
                                <Label className="text-sm font-medium text-muted-foreground">
                                    UUID
                                </Label>
                                <p className="font-mono text-sm">
                                    {orderState.uuid}
                                </p>
                            </div>

                            <div>
                                <Label className="text-sm font-medium text-muted-foreground">
                                    ID
                                </Label>
                                <p className="text-sm">{orderState.id}</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
