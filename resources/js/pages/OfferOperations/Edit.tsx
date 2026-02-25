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
import { Textarea } from '@/components/ui/textarea';
import { useTranslations } from '@/hooks/use-translations';
import AppLayout from '@/layouts/app-layout';
import offerOperations from '@/routes/offer-operations/index';
import { type BreadcrumbItem } from '@/types';
import { Form, Head, router, usePage } from '@inertiajs/react';
import { useState } from 'react';

type OfferOperationCategory = {
    uuid: string;
    name: string;
};

type OfferOperation = {
    id: number;
    uuid: string;
    category_uuid?: string;
    codice?: string;
    codice_univoco?: string;
    descrizione?: string;
    secondi_operazione?: number;
    filename?: string;
};

type OfferOperationsEditProps = {
    operation: OfferOperation;
    categories: OfferOperationCategory[];
    errors?: Record<string, string>;
};

export default function OfferOperationsEdit({
    errors: serverErrors,
}: OfferOperationsEditProps) {
    const { props } = usePage<OfferOperationsEditProps>();
    const { operation, categories } = props;
    const [selectedCategory, setSelectedCategory] = useState<string>(
        operation.category_uuid ?? '',
    );
    const [selectedFileName, setSelectedFileName] = useState<string | null>(
        null,
    );

    const { t } = useTranslations();
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: t('nav.offers'),
            href: '/offers',
        },
        {
            title: t('offer_operations.page_title'),
            href: offerOperations.index().url,
        },
        {
            title:
                operation.codice ??
                operation.descrizione ??
                t('offer_operations.fallback_name'),
            href: offerOperations.show({ offerOperation: operation.uuid }).url,
        },
        {
            title: t('common.edit'),
            href: offerOperations.edit({ offerOperation: operation.uuid }).url,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head
                title={t('offer_operations.edit.page_title', {
                    code: operation.codice ?? operation.descrizione ?? '',
                })}
            />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <Card>
                    <CardHeader>
                        <CardTitle>
                            {t('offer_operations.edit.card_title')}
                        </CardTitle>
                        <CardDescription>
                            {t('offer_operations.edit.card_description')}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Form
                            action={
                                offerOperations.update({
                                    offerOperation: operation.uuid,
                                }).url
                            }
                            method="put"
                            encType="multipart/form-data"
                            className="space-y-5"
                        >
                            {({ processing, errors }) => {
                                const allErrors = {
                                    ...errors,
                                    ...serverErrors,
                                };

                                return (
                                    <>
                                        <div className="flex justify-center">
                                            <div className="w-full max-w-4xl space-y-5">
                                                <div className="grid gap-2">
                                                    <FormLabel htmlFor="uuid">
                                                        UUID
                                                    </FormLabel>
                                                    <Input
                                                        id="uuid"
                                                        name="uuid"
                                                        defaultValue={
                                                            operation.uuid
                                                        }
                                                        readOnly
                                                        className="bg-muted"
                                                    />
                                                </div>

                                                <div className="grid gap-2">
                                                    <FormLabel
                                                        htmlFor="category_uuid"
                                                        required
                                                    >
                                                        {t(
                                                            'offer_operations.table.category',
                                                        )}
                                                    </FormLabel>
                                                    <input
                                                        type="hidden"
                                                        name="category_uuid"
                                                        value={
                                                            selectedCategory ||
                                                            ''
                                                        }
                                                    />
                                                    <Select
                                                        value={
                                                            selectedCategory ||
                                                            undefined
                                                        }
                                                        onValueChange={(
                                                            value,
                                                        ) =>
                                                            setSelectedCategory(
                                                                value,
                                                            )
                                                        }
                                                    >
                                                        <SelectTrigger>
                                                            <SelectValue
                                                                placeholder={t(
                                                                    'offer_operations.table.category',
                                                                )}
                                                            />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {categories.map(
                                                                (category) => (
                                                                    <SelectItem
                                                                        key={
                                                                            category.uuid
                                                                        }
                                                                        value={
                                                                            category.uuid
                                                                        }
                                                                    >
                                                                        {
                                                                            category.name
                                                                        }
                                                                    </SelectItem>
                                                                ),
                                                            )}
                                                        </SelectContent>
                                                    </Select>
                                                    <InputError
                                                        message={
                                                            allErrors.category_uuid
                                                        }
                                                    />
                                                </div>

                                                <div className="grid gap-2">
                                                    <FormLabel htmlFor="codice">
                                                        {t(
                                                            'offer_operations.show.code_label',
                                                        )}
                                                    </FormLabel>
                                                    <Input
                                                        id="codice"
                                                        name="codice"
                                                        defaultValue={
                                                            operation.codice ??
                                                            ''
                                                        }
                                                        readOnly
                                                        className="bg-muted"
                                                        placeholder={t(
                                                            'offer_operations.create.code_placeholder',
                                                        )}
                                                        maxLength={255}
                                                        aria-describedby="codice-help"
                                                    />
                                                    <p
                                                        id="codice-help"
                                                        className="text-xs text-muted-foreground"
                                                    >
                                                        Operation code (read
                                                        only).
                                                    </p>
                                                    <InputError
                                                        message={
                                                            allErrors.codice
                                                        }
                                                    />
                                                </div>

                                                <div className="grid gap-2">
                                                    <FormLabel
                                                        htmlFor="descrizione"
                                                        required
                                                    >
                                                        {t(
                                                            'common.description',
                                                        )}
                                                    </FormLabel>
                                                    <Textarea
                                                        id="descrizione"
                                                        name="descrizione"
                                                        defaultValue={
                                                            operation.descrizione ??
                                                            ''
                                                        }
                                                        required
                                                        placeholder={t(
                                                            'offer_operations.create.description_placeholder',
                                                        )}
                                                        rows={3}
                                                        aria-describedby="descrizione-help"
                                                    />
                                                    <p
                                                        id="descrizione-help"
                                                        className="text-xs text-muted-foreground"
                                                    >
                                                        {t(
                                                            'offer_operations.create.help_description',
                                                        )}
                                                    </p>
                                                    <InputError
                                                        message={
                                                            allErrors.descrizione
                                                        }
                                                    />
                                                </div>

                                                <div className="grid gap-2">
                                                    <FormLabel htmlFor="secondi_operazione">
                                                        {t(
                                                            'offer_operations.create.seconds_label',
                                                        )}
                                                    </FormLabel>
                                                    <Input
                                                        id="secondi_operazione"
                                                        name="secondi_operazione"
                                                        type="number"
                                                        min="0"
                                                        step="0.01"
                                                        defaultValue={
                                                            operation.secondi_operazione ??
                                                            ''
                                                        }
                                                        placeholder="0"
                                                        aria-describedby="secondi-help"
                                                    />
                                                    <p
                                                        id="secondi-help"
                                                        className="text-xs text-muted-foreground"
                                                    >
                                                        {t(
                                                            'offer_operations.create.help_seconds',
                                                        )}
                                                    </p>
                                                    <InputError
                                                        message={
                                                            allErrors.secondi_operazione
                                                        }
                                                    />
                                                </div>

                                                <div className="grid gap-2">
                                                    <FormLabel htmlFor="filename">
                                                        {t(
                                                            'offer_operations.create.attachment_label',
                                                        )}
                                                    </FormLabel>
                                                    {operation.filename && (
                                                        <div className="mb-2 rounded-md bg-muted p-2">
                                                            <p className="mb-1 text-xs text-muted-foreground">
                                                                {t(
                                                                    'offer_operations.attachment_current',
                                                                )}
                                                            </p>
                                                            <p className="font-mono text-sm break-all">
                                                                {
                                                                    operation.filename
                                                                }
                                                            </p>
                                                        </div>
                                                    )}
                                                    <Input
                                                        id="filename"
                                                        name="filename"
                                                        type="file"
                                                        accept="*/*"
                                                        className="cursor-pointer"
                                                        aria-describedby="filename-help"
                                                        onChange={(event) => {
                                                            const file =
                                                                event.target
                                                                    .files?.[0];
                                                            setSelectedFileName(
                                                                file
                                                                    ? file.name
                                                                    : null,
                                                            );
                                                        }}
                                                    />
                                                    <p
                                                        id="filename-help"
                                                        className="text-xs text-muted-foreground"
                                                    >
                                                        {operation.filename
                                                            ? t(
                                                                  'offer_operations.attachment_replace',
                                                              )
                                                            : t(
                                                                  'offer_operations.attachment_select',
                                                              )}
                                                    </p>
                                                    {selectedFileName && (
                                                        <p className="text-xs text-muted-foreground">
                                                            {t(
                                                                'offer_operations.attachment_new',
                                                            )}
                                                            :{' '}
                                                            <span className="font-mono">
                                                                {
                                                                    selectedFileName
                                                                }
                                                            </span>
                                                        </p>
                                                    )}
                                                    <InputError
                                                        message={
                                                            allErrors.filename
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
                                                                  'offer_operations.edit.submit',
                                                              )}
                                                    </Button>
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        onClick={() =>
                                                            router.visit(
                                                                offerOperations.show(
                                                                    {
                                                                        offerOperation:
                                                                            operation.uuid,
                                                                    },
                                                                ).url,
                                                            )
                                                        }
                                                    >
                                                        {t('common.cancel')}
                                                    </Button>
                                                </div>
                                            </div>
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
