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
import offerOperationLists from '@/routes/offer-operation-lists';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Edit, Trash2 } from 'lucide-react';

type Offer = {
    uuid: string;
    offer_number: string;
    provisional_description?: string | null;
};

type Operation = {
    uuid: string;
    code: string;
    description?: string | null;
};

type OperationList = {
    id: number;
    uuid: string;
    num_op: number;
    offer?: Offer | null;
    operation?: Operation | null;
};

type OfferOperationListsShowProps = {
    operationList: OperationList;
};

export default function OfferOperationListsShow({
    operationList,
}: OfferOperationListsShowProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Liste Operazioni Offerta',
            href: offerOperationLists.index().url,
        },
        {
            title: 'Dettagli',
            href: `/offers/operation-lists/${operationList.uuid}`,
        },
    ];

    const handleDelete = () => {
        if (
            confirm(
                "Sei sicuro di voler rimuovere questa operazione dall'offerta? Questa azione non può essere annullata.",
            )
        ) {
            router.delete(
                offerOperationLists.destroy({
                    offerOperationList: operationList.uuid,
                }).url,
                {
                    onSuccess: () => {
                        router.visit(offerOperationLists.index().url);
                    },
                },
            );
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dettagli Lista Operazioni Offerta" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">
                            Assegnazione Operazione
                        </h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Operazione: {operationList.operation?.code || 'N/D'}{' '}
                            | UUID:{' '}
                            <span className="font-mono">
                                {operationList.uuid}
                            </span>
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Button asChild variant="outline">
                            <Link
                                href={
                                    offerOperationLists.edit({
                                        offerOperationList: operationList.uuid,
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
                            <CardTitle>Dettagli Assegnazione</CardTitle>
                            <CardDescription>
                                Informazioni su questa assegnazione operazione
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label className="text-sm font-medium text-muted-foreground">
                                    ID
                                </Label>
                                <p className="text-sm">{operationList.id}</p>
                            </div>

                            <div>
                                <Label className="text-sm font-medium text-muted-foreground">
                                    UUID
                                </Label>
                                <p className="font-mono text-sm">
                                    {operationList.uuid}
                                </p>
                            </div>

                            <div>
                                <Label className="text-sm font-medium text-muted-foreground">
                                    Offerta
                                </Label>
                                <p className="font-mono text-lg font-semibold">
                                    {operationList.offer?.offer_number || 'N/D'}
                                </p>
                                {operationList.offer
                                    ?.provisional_description && (
                                    <p className="text-sm text-muted-foreground">
                                        {
                                            operationList.offer
                                                .provisional_description
                                        }
                                    </p>
                                )}
                            </div>

                            <div>
                                <Label className="text-sm font-medium text-muted-foreground">
                                    Operazione
                                </Label>
                                <p className="font-mono text-lg font-semibold">
                                    {operationList.operation?.code || 'N/D'}
                                </p>
                                {operationList.operation?.description && (
                                    <p className="text-sm text-muted-foreground">
                                        {operationList.operation.description}
                                    </p>
                                )}
                            </div>

                            <div>
                                <Label className="text-sm font-medium text-muted-foreground">
                                    Numero Operazione
                                </Label>
                                <p className="text-lg font-semibold">
                                    {operationList.num_op}
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
