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
import offerSeasonalities from '@/routes/offer-seasonalities/index';
import { type BreadcrumbItem } from '@/types';
import { Form, Head, router } from '@inertiajs/react';

type OfferSeasonality = {
    id: number;
    uuid: string;
    name: string;
};

type OfferSeasonalitiesEditProps = {
    seasonality: OfferSeasonality;
    errors?: Record<string, string>;
};

export default function OfferSeasonalitiesEdit({
    seasonality,
    errors: serverErrors,
}: OfferSeasonalitiesEditProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Offerte',
            href: '/offers',
        },
        {
            title: 'Stagionalità',
            href: offerSeasonalities.index().url,
        },
        {
            title: seasonality.name,
            href: offerSeasonalities.show({
                offerSeasonality: seasonality.uuid,
            }).url,
        },
        {
            title: 'Modifica',
            href: offerSeasonalities.edit({
                offerSeasonality: seasonality.uuid,
            }).url,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Modifica Stagionalità ${seasonality.name}`} />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex w-full justify-center">
                    <div className="w-full max-w-4xl space-y-5">
                        <Card>
                            <CardHeader>
                                <CardTitle>Modifica Stagionalità</CardTitle>
                                <CardDescription>
                                    Aggiorna le informazioni della stagionalità.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Form
                                    action={
                                        offerSeasonalities.update({
                                            offerSeasonality: seasonality.uuid,
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
                                                    <FormLabel htmlFor="uuid">
                                                        UUID
                                                    </FormLabel>
                                                    <Input
                                                        id="uuid"
                                                        name="uuid"
                                                        defaultValue={
                                                            seasonality.uuid
                                                        }
                                                        readOnly
                                                        className="bg-muted"
                                                    />
                                                </div>

                                                <div className="grid gap-2">
                                                    <FormLabel
                                                        htmlFor="name"
                                                        required
                                                    >
                                                        Nome
                                                    </FormLabel>
                                                    <Input
                                                        id="name"
                                                        name="name"
                                                        defaultValue={
                                                            seasonality.name
                                                        }
                                                        required
                                                        placeholder="Nome Stagionalità"
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
                                                            : 'Aggiorna Stagionalità'}
                                                    </Button>
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        onClick={() =>
                                                            router.visit(
                                                                offerSeasonalities.show(
                                                                    {
                                                                        offerSeasonality:
                                                                            seasonality.uuid,
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
