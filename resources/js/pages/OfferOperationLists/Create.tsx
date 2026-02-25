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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useTranslations } from '@/hooks/use-translations';
import AppLayout from '@/layouts/app-layout';
import offerOperationLists from '@/routes/offer-operation-lists/index';
import { type BreadcrumbItem } from '@/types';
import { Form, Head, router } from '@inertiajs/react';
import { useState } from 'react';

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

type OfferOperationListsCreateProps = {
    offers: Offer[];
    operations: Operation[];
    offerUuid?: string;
    errors?: Record<string, string>;
};

export default function OfferOperationListsCreate({
    offers,
    operations,
    offerUuid,
    errors: serverErrors,
}: OfferOperationListsCreateProps) {
    const [selectedOffer, setSelectedOffer] = useState<string>(offerUuid ?? '');

    const { t } = useTranslations();
    const breadcrumbs: BreadcrumbItem[] = [
        { title: t('nav.offers'), href: '/offers' },
        {
            title: t('offer_operation_lists.page_title'),
            href: offerOperationLists.index().url,
        },
        {
            title: t('offer_operation_lists.create'),
            href: offerOperationLists.create().url,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('offer_operation_lists.create.page_title')} />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex w-full justify-center">
                    <div className="w-full max-w-4xl space-y-5">
                        <Card>
                            <CardHeader>
                                <CardTitle>
                                    {t(
                                        'offer_operation_lists.create.card_title',
                                    )}
                                </CardTitle>
                                <CardDescription>
                                    {t(
                                        'offer_operation_lists.create.card_description',
                                    )}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Form
                                    action={offerOperationLists.store().url}
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
                                                    <FormLabel
                                                        htmlFor="offer_uuid"
                                                        required
                                                    >
                                                        {t(
                                                            'offer_operation_lists.table.offer',
                                                        )}
                                                    </FormLabel>
                                                    <input
                                                        type="hidden"
                                                        name="offer_uuid"
                                                        value={selectedOffer}
                                                    />
                                                    <Select
                                                        value={
                                                            selectedOffer ||
                                                            undefined
                                                        }
                                                        onValueChange={
                                                            setSelectedOffer
                                                        }
                                                        required
                                                    >
                                                        <SelectTrigger>
                                                            <SelectValue
                                                                placeholder={t(
                                                                    'offer_operation_lists.create.select_offer',
                                                                )}
                                                            />
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
                                                                            t(
                                                                                'offer_operation_lists.create.no_description',
                                                                            )}
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
                                                    <FormLabel
                                                        htmlFor="offeroperation_uuid"
                                                        required
                                                    >
                                                        {t(
                                                            'offer_operation_lists.table.operation',
                                                        )}
                                                    </FormLabel>
                                                    <Select
                                                        name="offeroperation_uuid"
                                                        required
                                                    >
                                                        <SelectTrigger>
                                                            <SelectValue
                                                                placeholder={t(
                                                                    'offer_operation_lists.edit.select_operation',
                                                                )}
                                                            />
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
                                                                            t(
                                                                                'common.no_description',
                                                                            )}
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
                                                    <FormLabel
                                                        htmlFor="num_op"
                                                        required
                                                    >
                                                        {t(
                                                            'offer_operation_lists.show.num_op_label',
                                                        )}
                                                    </FormLabel>
                                                    <Input
                                                        id="num_op"
                                                        name="num_op"
                                                        type="number"
                                                        step="0.01"
                                                        required
                                                        min="0"
                                                        placeholder="0.00"
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
                                                            ? t('common.saving')
                                                            : t(
                                                                  'offers.form.add_operation',
                                                              )}
                                                    </Button>
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        onClick={() =>
                                                            router.visit(
                                                                offerOperationLists.index()
                                                                    .url,
                                                            )
                                                        }
                                                    >
                                                        {t('common.cancel')}
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
