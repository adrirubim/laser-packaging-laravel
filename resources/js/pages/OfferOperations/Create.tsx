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
import { generateUUID } from '@/lib/utils/uuid';
import offerOperations from '@/routes/offer-operations/index';
import { type BreadcrumbItem } from '@/types';
import { Form, Head, router, usePage } from '@inertiajs/react';
import { useState } from 'react';

type OfferOperationCategory = {
    uuid: string;
    name: string;
};

type OfferOperationsCreateProps = {
    categories: OfferOperationCategory[];
    category_uuid?: string;
    errors?: Record<string, string>;
};

export default function OfferOperationsCreate({
    errors: serverErrors,
}: OfferOperationsCreateProps) {
    const { props } = usePage<OfferOperationsCreateProps>();
    const { categories, category_uuid } = props;
    const [uuid, setUuid] = useState<string>(generateUUID());
    const [selectedCategory, setSelectedCategory] = useState<string>(
        category_uuid ?? '',
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
            title: t('offer_operations.create'),
            href: offerOperations.create().url,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('offer_operations.create.page_title')} />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex w-full justify-center">
                    <div className="w-full max-w-4xl space-y-5">
                        <Card>
                            <CardHeader>
                                <CardTitle>
                                    {t('offer_operations.create.card_title')}
                                </CardTitle>
                                <CardDescription>
                                    {t(
                                        'offer_operations.create.card_description',
                                    )}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Form
                                    action={offerOperations.store().url}
                                    method="post"
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
                                                <div className="grid gap-2">
                                                    <FormLabel
                                                        htmlFor="uuid"
                                                        required
                                                    >
                                                        {t('common.uuid')}
                                                    </FormLabel>
                                                    <Input
                                                        id="uuid"
                                                        name="uuid"
                                                        value={uuid}
                                                        onChange={(e) =>
                                                            setUuid(
                                                                e.target.value,
                                                            )
                                                        }
                                                        required
                                                        placeholder={t(
                                                            'common.uuid_placeholder',
                                                        )}
                                                    />
                                                    <InputError
                                                        message={allErrors.uuid}
                                                    />
                                                </div>

                                                <div className="mt-4 grid gap-2">
                                                    <FormLabel htmlFor="category_uuid">
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
                                                                    'filter.all_categories',
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

                                                <div className="mt-4 grid gap-2">
                                                    <FormLabel htmlFor="codice">
                                                        {t('common.code')}
                                                    </FormLabel>
                                                    <Input
                                                        id="codice"
                                                        name="codice"
                                                        disabled={
                                                            !selectedCategory
                                                        }
                                                        className={
                                                            !selectedCategory
                                                                ? 'cursor-not-allowed bg-muted'
                                                                : ''
                                                        }
                                                        placeholder={
                                                            selectedCategory
                                                                ? t(
                                                                      'offer_operations.create.code_placeholder',
                                                                  )
                                                                : t(
                                                                      'filter.all_categories',
                                                                  )
                                                        }
                                                        maxLength={255}
                                                        aria-describedby="codice-help"
                                                    />
                                                    <p
                                                        id="codice-help"
                                                        className="text-xs text-muted-foreground"
                                                    >
                                                        {!selectedCategory
                                                            ? t(
                                                                  'offer_operations.create.help_code',
                                                              )
                                                            : t(
                                                                  'offer_operations.create.help_code_selected',
                                                              )}
                                                    </p>
                                                    <InputError
                                                        message={
                                                            allErrors.codice
                                                        }
                                                    />
                                                </div>

                                                <div className="mt-4 grid gap-2">
                                                    <FormLabel htmlFor="descrizione">
                                                        {t(
                                                            'common.description',
                                                        )}
                                                    </FormLabel>
                                                    <Textarea
                                                        id="descrizione"
                                                        name="descrizione"
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

                                                <div className="mt-4 grid gap-2">
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
                                                    <Input
                                                        id="filename"
                                                        name="filename"
                                                        type="file"
                                                        accept="*/*"
                                                        className="cursor-pointer"
                                                    />
                                                    <p className="text-xs text-muted-foreground">
                                                        {t(
                                                            'offer_operations.create.help_attachment',
                                                        )}
                                                    </p>
                                                    <InputError
                                                        message={
                                                            allErrors.filename
                                                        }
                                                    />
                                                </div>

                                                <div className="mt-4 flex items-center gap-4">
                                                    <Button
                                                        type="submit"
                                                        disabled={processing}
                                                    >
                                                        {processing
                                                            ? t('common.saving')
                                                            : t(
                                                                  'offer_operations.create.submit',
                                                              )}
                                                    </Button>
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        onClick={() =>
                                                            router.visit(
                                                                offerOperations.index()
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
