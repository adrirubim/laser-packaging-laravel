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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import offerOperationLists from '@/routes/offer-operation-lists';
import { type BreadcrumbItem } from '@/types';
import { Form, Head, router, usePage } from '@inertiajs/react';

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
    offer_uuid: string;
    offeroperation_uuid: string;
    num_op: number;
};

type OfferOperationListsEditProps = {
    operationList: OperationList;
    offers: Offer[];
    operations: Operation[];
    errors?: Record<string, string>;
};

export default function OfferOperationListsEdit() {
    const { props } = usePage<OfferOperationListsEditProps>();
    const { operationList, offers, operations, errors: serverErrors } = props;

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Liste Operazioni Offerta',
            href: '/offers/operation-lists',
        },
        {
            title: 'Modifica',
            href: `/offers/operation-lists/${operationList.uuid}/edit`,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Modifica lista operazioni offerta" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex w-full justify-center">
                    <div className="w-full max-w-4xl space-y-5">
                        <Card>
                            <CardHeader>
                                <CardTitle>
                                    Modifica assegnazione operazione
                                </CardTitle>
                                <CardDescription>
                                    Aggiorna assegnazione operazione all'offerta
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Form
                                    action={
                                        offerOperationLists.update({
                                            offerOperationList:
                                                operationList.uuid,
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
                                                            operationList.uuid
                                                        }
                                                        readOnly
                                                        className="bg-muted"
                                                    />
                                                </div>

                                                <div className="grid gap-2">
                                                    <Label htmlFor="offer_uuid">
                                                        Offerta *
                                                    </Label>
                                                    <Select
                                                        name="offer_uuid"
                                                        required
                                                        defaultValue={
                                                            operationList.offer_uuid
                                                        }
                                                    >
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Seleziona un'offerta" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {offers.map(
                                                                (offer) => (
                                                                    <SelectItem
                                                                        key={
                                                                            offer.uuid
                                                                        }
                                                                        value={
                                                                            offer.uuid
                                                                        }
                                                                    >
                                                                        {
                                                                            offer.offer_number
                                                                        }{' '}
                                                                        -{' '}
                                                                        {offer.provisional_description ||
                                                                            'Nessuna descrizione'}
                                                                    </SelectItem>
                                                                ),
                                                            )}
                                                        </SelectContent>
                                                    </Select>
                                                    <InputError
                                                        message={
                                                            allErrors.offer_uuid
                                                        }
                                                    />
                                                </div>

                                                <div className="grid gap-2">
                                                    <Label htmlFor="offeroperation_uuid">
                                                        Operazione *
                                                    </Label>
                                                    <Select
                                                        name="offeroperation_uuid"
                                                        required
                                                        defaultValue={
                                                            operationList.offeroperation_uuid
                                                        }
                                                    >
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Seleziona un'operazione" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {operations.map(
                                                                (operation) => (
                                                                    <SelectItem
                                                                        key={
                                                                            operation.uuid
                                                                        }
                                                                        value={
                                                                            operation.uuid
                                                                        }
                                                                    >
                                                                        {
                                                                            operation.code
                                                                        }{' '}
                                                                        -{' '}
                                                                        {operation.description ||
                                                                            'Nessuna descrizione'}
                                                                    </SelectItem>
                                                                ),
                                                            )}
                                                        </SelectContent>
                                                    </Select>
                                                    <InputError
                                                        message={
                                                            allErrors.offeroperation_uuid
                                                        }
                                                    />
                                                </div>

                                                <div className="grid gap-2">
                                                    <Label htmlFor="num_op">
                                                        Numero Operazione *
                                                    </Label>
                                                    <Input
                                                        id="num_op"
                                                        name="num_op"
                                                        type="number"
                                                        step="0.01"
                                                        defaultValue={
                                                            operationList.num_op
                                                        }
                                                        required
                                                        min="0"
                                                        placeholder="0"
                                                    />
                                                    <InputError
                                                        message={
                                                            allErrors.num_op
                                                        }
                                                    />
                                                </div>

                                                <div className="flex items-center gap-4">
                                                    <Button
                                                        type="submit"
                                                        disabled={processing}
                                                    >
                                                        {processing
                                                            ? 'Aggiornando...'
                                                            : 'Aggiorna Assegnazione'}
                                                    </Button>
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        onClick={() =>
                                                            router.visit(
                                                                offerOperationLists.show(
                                                                    {
                                                                        offerOperationList:
                                                                            operationList.uuid,
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
