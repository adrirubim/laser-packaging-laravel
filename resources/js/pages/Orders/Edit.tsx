import { ConfirmCloseDialog } from '@/components/confirm-close-dialog';
import { FormValidationNotification } from '@/components/form-validation-notification';
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
import { LOT_TYPE_OPTION_KEYS } from '@/constants/lotTypes';
import { LABEL_OPTION_KEYS } from '@/constants/orderLabels';
import { useTranslations } from '@/hooks/use-translations';
import { useFieldValidation } from '@/hooks/useFieldValidation';
import AppLayout from '@/layouts/app-layout';
import { validationRules } from '@/lib/validation/rules';
import articlesRoutes from '@/routes/articles/index';
import orders from '@/routes/orders/index';
import { type BreadcrumbItem } from '@/types';
import { Form, Head, router } from '@inertiajs/react';
import { Download } from 'lucide-react';
import { useState } from 'react';

type PalletSheet = {
    uuid: string;
    code: string;
    description?: string | null;
};

type Material = {
    uuid: string;
    cod: string;
    description?: string | null;
};

type Article = {
    uuid: string;
    cod_article_las: string;
    article_descr?: string | null;
    um?: string | null;
    palletSheet?: PalletSheet | null;
    materials?: Material[];
};

type ShippingAddress = {
    uuid: string;
    street?: string | null;
    city?: string | null;
    postal_code?: string | null;
};

type Order = {
    uuid: string;
    order_production_number: string;
    article_uuid: string;
    customershippingaddress_uuid?: string | null;
    quantity?: number | null;
    worked_quantity?: number | null;
    number_customer_reference_order?: string | null;
    delivery_requested_date?: string | null;
    line?: number | null;
    expected_production_start_date?: string | null;
    type_lot?: number | null;
    lot?: string | null;
    expiration_date?: string | null;
    external_labels?: number | null;
    pvp_labels?: number | null;
    ingredients_labels?: number | null;
    variable_data_labels?: number | null;
    label_of_jumpers?: number | null;
    indications_for_shop?: string | null;
    indications_for_production?: string | null;
    indications_for_delivery?: string | null;
};

type OrdersEditProps = {
    order: Order;
    articles: Article[];
    shippingAddresses: ShippingAddress[];
    article?: Article | null;
    errors?: Record<string, string>;
};

export default function OrdersEdit({
    order,
    articles,
    shippingAddresses,
    article: initialArticle,
    errors: serverErrors,
}: OrdersEditProps) {
    const { t } = useTranslations();
    // Convertire data ISO in yyyy-MM-dd per input date
    const formatDateForInput = (
        dateString: string | null | undefined,
    ): string => {
        if (!dateString) return '';
        try {
            // If it's already in yyyy-MM-dd format, return as is
            if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
                return dateString;
            }
            // If it's in ISO format, extract just the date part
            const date = new Date(dateString);
            if (isNaN(date.getTime())) return '';
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        } catch {
            return '';
        }
    };

    const [quantity, setQuantity] = useState<string>(
        order.quantity?.toString() || '',
    );
    const [deliveryDate, setDeliveryDate] = useState<string>(
        formatDateForInput(order.delivery_requested_date),
    );
    const [line, setLine] = useState<string>(order.line?.toString() || '');
    const [expectedProductionStartDate, setExpectedProductionStartDate] =
        useState<string>(
            formatDateForInput(order.expected_production_start_date),
        );
    const [typeLot, setTypeLot] = useState<string>(
        order.type_lot !== null && order.type_lot !== undefined
            ? String(order.type_lot)
            : '',
    );
    const [lot, setLot] = useState<string>(order.lot || '');
    const [expirationDate, setExpirationDate] = useState<string>(
        formatDateForInput(order.expiration_date),
    );
    const [externalLabels, setExternalLabels] = useState<string>(
        order.external_labels !== null && order.external_labels !== undefined
            ? String(order.external_labels)
            : '',
    );
    const [pvpLabels, setPvpLabels] = useState<string>(
        order.pvp_labels !== null && order.pvp_labels !== undefined
            ? String(order.pvp_labels)
            : '',
    );
    const [ingredientsLabels, setIngredientsLabels] = useState<string>(
        order.ingredients_labels !== null &&
            order.ingredients_labels !== undefined
            ? String(order.ingredients_labels)
            : '',
    );
    const [variableDataLabels, setVariableDataLabels] = useState<string>(
        order.variable_data_labels !== null &&
            order.variable_data_labels !== undefined
            ? String(order.variable_data_labels)
            : '',
    );
    const [labelOfJumpers, setLabelOfJumpers] = useState<string>(
        order.label_of_jumpers !== null && order.label_of_jumpers !== undefined
            ? String(order.label_of_jumpers)
            : '',
    );
    const [indicationsForShop, setIndicationsForShop] = useState<string>(
        order.indications_for_shop || '',
    );
    const [indicationsForProduction, setIndicationsForProduction] =
        useState<string>(order.indications_for_production || '');
    const [indicationsForDelivery, setIndicationsForDelivery] =
        useState<string>(order.indications_for_delivery || '');
    const [showCloseConfirm, setShowCloseConfirm] = useState(false);

    const currentArticle = initialArticle;

    // Calculate remain_quantity
    const workedQuantity =
        order.worked_quantity != null
            ? parseFloat(String(order.worked_quantity)) || 0
            : 0;
    const remainQuantity = quantity
        ? (parseFloat(quantity) - workedQuantity).toFixed(5)
        : workedQuantity.toFixed(5);

    const quantityValidation = useFieldValidation(quantity, [
        validationRules.required(t('orders.validation.quantity_required')),
        validationRules.pattern(
            /^\d+([.,]\d+)?$/,
            t('orders.validation.quantity_valid_number'),
        ),
        (val: string) => {
            if (!val || val.trim() === '') return null;
            const n = Number(val.replace(',', '.'));
            if (!Number.isFinite(n))
                return t('orders.validation.quantity_valid_number');
            if (n < 0) return t('orders.validation.quantity_min_zero');
            return null;
        },
    ]);

    const deliveryDateValidation = useFieldValidation(deliveryDate, []);

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: t('nav.orders'),
            href: orders.index().url,
        },
        {
            title: order.order_production_number,
            href: orders.show({ order: order.uuid }).url,
        },
        {
            title: t('common.edit'),
            href: orders.edit({ order: order.uuid }).url,
        },
    ];

    // Logica per lot: readonly se type_lot == -1, modificabile negli altri casi
    const isLotReadonly = typeLot === '-1' || typeLot === '';

    const handleDownloadPalletSheet = () => {
        if (currentArticle?.palletSheet?.uuid) {
            window.open(
                articlesRoutes.palletSheets.downloadFile({
                    palletSheet: currentArticle.palletSheet.uuid,
                }).url,
                '_blank',
            );
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head
                title={t('orders.edit.page_title', {
                    number: order.order_production_number,
                })}
            />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex w-full justify-center">
                    <div className="w-full max-w-4xl space-y-5">
                        <Card>
                            <CardHeader>
                                <CardTitle>
                                    {t('orders.edit.card_title')}
                                </CardTitle>
                                <CardDescription>
                                    {t('orders.edit.card_description')}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Form
                                    action={
                                        orders.update({ order: order.uuid }).url
                                    }
                                    method="put"
                                    className="space-y-6"
                                >
                                    {({ processing, errors }) => {
                                        const allErrors = {
                                            ...errors,
                                            ...serverErrors,
                                        };
                                        const hasAttemptedSubmit =
                                            Object.keys(allErrors).length > 0;

                                        return (
                                            <>
                                                <FormValidationNotification
                                                    hasAttemptedSubmit={
                                                        hasAttemptedSubmit
                                                    }
                                                    errors={allErrors}
                                                />

                                                {/* Informazioni articolo (sola lettura) */}
                                                {currentArticle && (
                                                    <>
                                                        <div className="grid gap-2">
                                                            <FormLabel htmlFor="cod_article_las">
                                                                {t(
                                                                    'orders.labels.article_code_las',
                                                                )}
                                                            </FormLabel>
                                                            <Input
                                                                id="cod_article_las"
                                                                name="cod_article_las"
                                                                value={
                                                                    currentArticle.cod_article_las
                                                                }
                                                                readOnly
                                                                className="bg-muted"
                                                            />
                                                        </div>

                                                        {currentArticle.um && (
                                                            <div className="grid gap-2">
                                                                <FormLabel htmlFor="um">
                                                                    {t(
                                                                        'orders.labels.um',
                                                                    )}
                                                                </FormLabel>
                                                                <Input
                                                                    id="um"
                                                                    name="um"
                                                                    value={
                                                                        currentArticle.um
                                                                    }
                                                                    readOnly
                                                                    className="bg-muted"
                                                                />
                                                            </div>
                                                        )}
                                                    </>
                                                )}

                                                <div className="grid gap-2">
                                                    <FormLabel
                                                        htmlFor="order_production_number"
                                                        required
                                                    >
                                                        {t(
                                                            'orders.labels.production_number',
                                                        )}
                                                    </FormLabel>
                                                    <Input
                                                        id="order_production_number"
                                                        name="order_production_number"
                                                        defaultValue={
                                                            order.order_production_number
                                                        }
                                                        required
                                                    />
                                                    <InputError
                                                        message={
                                                            allErrors.order_production_number
                                                        }
                                                    />
                                                </div>

                                                <div className="grid gap-2">
                                                    <FormLabel
                                                        htmlFor="article_uuid"
                                                        required
                                                    >
                                                        {t(
                                                            'orders.labels.article',
                                                        )}
                                                    </FormLabel>
                                                    <Select
                                                        name="article_uuid"
                                                        defaultValue={
                                                            order.article_uuid
                                                        }
                                                        required
                                                    >
                                                        <SelectTrigger>
                                                            <SelectValue
                                                                placeholder={t(
                                                                    'orders.edit.select_article',
                                                                )}
                                                            />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {articles.map(
                                                                (article) => (
                                                                    <SelectItem
                                                                        key={
                                                                            article.uuid
                                                                        }
                                                                        value={
                                                                            article.uuid
                                                                        }
                                                                    >
                                                                        {
                                                                            article.cod_article_las
                                                                        }{' '}
                                                                        -{' '}
                                                                        {article.article_descr ||
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
                                                            allErrors.article_uuid
                                                        }
                                                    />
                                                </div>

                                                <div className="grid gap-2">
                                                    <FormLabel htmlFor="number_customer_reference_order">
                                                        {t(
                                                            'orders.labels.client_ref_order',
                                                        )}
                                                    </FormLabel>
                                                    <Input
                                                        id="number_customer_reference_order"
                                                        name="number_customer_reference_order"
                                                        defaultValue={
                                                            order.number_customer_reference_order ||
                                                            ''
                                                        }
                                                        placeholder={t(
                                                            'orders.edit.client_ref_placeholder',
                                                        )}
                                                        maxLength={255}
                                                    />
                                                    <InputError
                                                        message={
                                                            allErrors.number_customer_reference_order
                                                        }
                                                    />
                                                </div>

                                                <div className="grid gap-2">
                                                    <FormLabel htmlFor="line">
                                                        {t(
                                                            'orders.labels.line',
                                                        )}
                                                    </FormLabel>
                                                    <Input
                                                        id="line"
                                                        name="line"
                                                        type="number"
                                                        value={line}
                                                        onChange={(e) =>
                                                            setLine(
                                                                e.target.value,
                                                            )
                                                        }
                                                        placeholder={t(
                                                            'orders.edit.line_placeholder',
                                                        )}
                                                    />
                                                    <InputError
                                                        message={allErrors.line}
                                                    />
                                                </div>

                                                <div className="grid gap-2">
                                                    <FormLabel
                                                        htmlFor="quantity"
                                                        required
                                                    >
                                                        {t(
                                                            'orders.labels.quantity_order',
                                                        )}
                                                    </FormLabel>
                                                    <Input
                                                        id="quantity"
                                                        name="quantity"
                                                        type="number"
                                                        min="0"
                                                        step="0.01"
                                                        value={quantity}
                                                        onChange={(e) =>
                                                            setQuantity(
                                                                e.target.value,
                                                            )
                                                        }
                                                        onBlur={
                                                            quantityValidation.onBlur
                                                        }
                                                        required
                                                        aria-invalid={
                                                            quantityValidation.error
                                                                ? 'true'
                                                                : 'false'
                                                        }
                                                        className={
                                                            quantityValidation.error
                                                                ? 'border-destructive'
                                                                : ''
                                                        }
                                                    />
                                                    {quantityValidation.error && (
                                                        <p className="text-xs text-destructive">
                                                            {
                                                                quantityValidation.error
                                                            }
                                                        </p>
                                                    )}
                                                    <InputError
                                                        message={
                                                            allErrors.quantity
                                                        }
                                                    />
                                                </div>

                                                <div className="grid gap-2">
                                                    <FormLabel htmlFor="worked_quantity">
                                                        {t(
                                                            'orders.labels.quantity_worked',
                                                        )}
                                                    </FormLabel>
                                                    <Input
                                                        id="worked_quantity"
                                                        name="worked_quantity"
                                                        value={workedQuantity.toFixed(
                                                            5,
                                                        )}
                                                        readOnly
                                                        className="bg-muted"
                                                    />
                                                </div>

                                                <div className="grid gap-2">
                                                    <FormLabel htmlFor="remain_quantity">
                                                        {t(
                                                            'orders.labels.quantity_remain',
                                                        )}
                                                    </FormLabel>
                                                    <Input
                                                        id="remain_quantity"
                                                        name="remain_quantity"
                                                        value={remainQuantity}
                                                        readOnly
                                                        className="bg-muted"
                                                    />
                                                </div>

                                                <div className="grid gap-2">
                                                    <FormLabel htmlFor="delivery_requested_date">
                                                        {t(
                                                            'orders.labels.delivery_date_requested',
                                                        )}
                                                    </FormLabel>
                                                    <Input
                                                        id="delivery_requested_date"
                                                        name="delivery_requested_date"
                                                        type="date"
                                                        min="2005-01-01"
                                                        max="2099-12-31"
                                                        value={deliveryDate}
                                                        onChange={(e) =>
                                                            setDeliveryDate(
                                                                e.target.value,
                                                            )
                                                        }
                                                        onBlur={
                                                            deliveryDateValidation.onBlur
                                                        }
                                                        aria-invalid={
                                                            deliveryDateValidation.error
                                                                ? 'true'
                                                                : 'false'
                                                        }
                                                        className={
                                                            deliveryDateValidation.error
                                                                ? 'border-destructive'
                                                                : ''
                                                        }
                                                    />
                                                    {deliveryDateValidation.error && (
                                                        <p className="text-xs text-destructive">
                                                            {
                                                                deliveryDateValidation.error
                                                            }
                                                        </p>
                                                    )}
                                                    <InputError
                                                        message={
                                                            allErrors.delivery_requested_date
                                                        }
                                                    />
                                                </div>

                                                <div className="grid gap-2">
                                                    <FormLabel htmlFor="customershippingaddress_uuid">
                                                        {t(
                                                            'orders.labels.delivery_place',
                                                        )}
                                                    </FormLabel>
                                                    <Select
                                                        name="customershippingaddress_uuid"
                                                        defaultValue={
                                                            order.customershippingaddress_uuid ||
                                                            undefined
                                                        }
                                                    >
                                                        <SelectTrigger>
                                                            <SelectValue
                                                                placeholder={t(
                                                                    'orders.edit.select_delivery_place',
                                                                )}
                                                            />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {shippingAddresses.map(
                                                                (address) => (
                                                                    <SelectItem
                                                                        key={
                                                                            address.uuid
                                                                        }
                                                                        value={
                                                                            address.uuid
                                                                        }
                                                                    >
                                                                        {[
                                                                            address.street,
                                                                            address.city,
                                                                            address.postal_code,
                                                                        ]
                                                                            .filter(
                                                                                Boolean,
                                                                            )
                                                                            .join(
                                                                                ' - ',
                                                                            )}
                                                                    </SelectItem>
                                                                ),
                                                            )}
                                                        </SelectContent>
                                                    </Select>
                                                    <InputError
                                                        message={
                                                            allErrors.customershippingaddress_uuid
                                                        }
                                                    />
                                                </div>

                                                <div className="grid gap-2">
                                                    <FormLabel htmlFor="expected_production_start_date">
                                                        {t(
                                                            'orders.labels.expected_production_start',
                                                        )}
                                                    </FormLabel>
                                                    <Input
                                                        id="expected_production_start_date"
                                                        name="expected_production_start_date"
                                                        type="date"
                                                        min="2005-01-01"
                                                        max="2099-12-31"
                                                        value={
                                                            expectedProductionStartDate
                                                        }
                                                        onChange={(e) =>
                                                            setExpectedProductionStartDate(
                                                                e.target.value,
                                                            )
                                                        }
                                                    />
                                                    <InputError
                                                        message={
                                                            allErrors.expected_production_start_date
                                                        }
                                                    />
                                                </div>

                                                <div className="grid gap-2">
                                                    <FormLabel htmlFor="type_lot">
                                                        {t(
                                                            'orders.labels.lot_type',
                                                        )}
                                                    </FormLabel>
                                                    <Select
                                                        name="type_lot"
                                                        value={typeLot}
                                                        onValueChange={(
                                                            value,
                                                        ) => {
                                                            setTypeLot(value);
                                                            if (
                                                                value === '-1'
                                                            ) {
                                                                setLot('');
                                                            }
                                                        }}
                                                    >
                                                        <SelectTrigger>
                                                            <SelectValue
                                                                placeholder={t(
                                                                    'orders.edit.select_lot_type',
                                                                )}
                                                            />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {LOT_TYPE_OPTION_KEYS.map(
                                                                (option) => (
                                                                    <SelectItem
                                                                        key={
                                                                            option.value
                                                                        }
                                                                        value={String(
                                                                            option.value,
                                                                        )}
                                                                    >
                                                                        {t(
                                                                            option.labelKey,
                                                                        )}
                                                                    </SelectItem>
                                                                ),
                                                            )}
                                                        </SelectContent>
                                                    </Select>
                                                    <InputError
                                                        message={
                                                            allErrors.type_lot
                                                        }
                                                    />
                                                </div>

                                                <div className="grid gap-2">
                                                    <FormLabel htmlFor="lot">
                                                        {t('orders.labels.lot')}
                                                    </FormLabel>
                                                    <Input
                                                        id="lot"
                                                        name="lot"
                                                        value={lot}
                                                        onChange={(e) =>
                                                            setLot(
                                                                e.target.value,
                                                            )
                                                        }
                                                        readOnly={isLotReadonly}
                                                        className={
                                                            isLotReadonly
                                                                ? 'bg-muted'
                                                                : ''
                                                        }
                                                        placeholder={
                                                            isLotReadonly
                                                                ? t(
                                                                      'orders.edit.lot_auto_generated',
                                                                  )
                                                                : t(
                                                                      'orders.edit.lot_placeholder',
                                                                  )
                                                        }
                                                    />
                                                    <InputError
                                                        message={allErrors.lot}
                                                    />
                                                </div>

                                                <div className="grid gap-2">
                                                    <FormLabel htmlFor="expiration_date">
                                                        {t(
                                                            'orders.labels.expiration',
                                                        )}
                                                    </FormLabel>
                                                    <Input
                                                        id="expiration_date"
                                                        name="expiration_date"
                                                        type="date"
                                                        min="2005-01-01"
                                                        max="2099-12-31"
                                                        value={expirationDate}
                                                        onChange={(e) =>
                                                            setExpirationDate(
                                                                e.target.value,
                                                            )
                                                        }
                                                    />
                                                    <InputError
                                                        message={
                                                            allErrors.expiration_date
                                                        }
                                                    />
                                                </div>

                                                {/* Campos de Etichette */}
                                                <div className="space-y-4">
                                                    <h3 className="text-lg font-semibold">
                                                        {t(
                                                            'orders.labels.labels_section',
                                                        )}
                                                    </h3>

                                                    <div className="grid gap-2">
                                                        <FormLabel htmlFor="external_labels">
                                                            {t(
                                                                'orders.labels.labels_external',
                                                            )}
                                                        </FormLabel>
                                                        <Select
                                                            name="external_labels"
                                                            value={
                                                                externalLabels
                                                            }
                                                            onValueChange={
                                                                setExternalLabels
                                                            }
                                                        >
                                                            <SelectTrigger>
                                                                <SelectValue
                                                                    placeholder={t(
                                                                        'orders.edit.select_labels_external',
                                                                    )}
                                                                />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {LABEL_OPTION_KEYS.map(
                                                                    (
                                                                        option,
                                                                    ) => (
                                                                        <SelectItem
                                                                            key={
                                                                                option.value
                                                                            }
                                                                            value={String(
                                                                                option.value,
                                                                            )}
                                                                        >
                                                                            {t(
                                                                                option.labelKey,
                                                                            )}
                                                                        </SelectItem>
                                                                    ),
                                                                )}
                                                            </SelectContent>
                                                        </Select>
                                                        <InputError
                                                            message={
                                                                allErrors.external_labels
                                                            }
                                                        />
                                                    </div>

                                                    <div className="grid gap-2">
                                                        <FormLabel htmlFor="pvp_labels">
                                                            {t(
                                                                'orders.labels.labels_pvp',
                                                            )}
                                                        </FormLabel>
                                                        <Select
                                                            name="pvp_labels"
                                                            value={pvpLabels}
                                                            onValueChange={
                                                                setPvpLabels
                                                            }
                                                        >
                                                            <SelectTrigger>
                                                                <SelectValue
                                                                    placeholder={t(
                                                                        'orders.edit.select_labels_pvp',
                                                                    )}
                                                                />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {LABEL_OPTION_KEYS.map(
                                                                    (
                                                                        option,
                                                                    ) => (
                                                                        <SelectItem
                                                                            key={
                                                                                option.value
                                                                            }
                                                                            value={String(
                                                                                option.value,
                                                                            )}
                                                                        >
                                                                            {t(
                                                                                option.labelKey,
                                                                            )}
                                                                        </SelectItem>
                                                                    ),
                                                                )}
                                                            </SelectContent>
                                                        </Select>
                                                        <InputError
                                                            message={
                                                                allErrors.pvp_labels
                                                            }
                                                        />
                                                    </div>

                                                    <div className="grid gap-2">
                                                        <FormLabel htmlFor="ingredients_labels">
                                                            {t(
                                                                'orders.labels.labels_ingredients',
                                                            )}
                                                        </FormLabel>
                                                        <Select
                                                            name="ingredients_labels"
                                                            value={
                                                                ingredientsLabels
                                                            }
                                                            onValueChange={
                                                                setIngredientsLabels
                                                            }
                                                        >
                                                            <SelectTrigger>
                                                                <SelectValue
                                                                    placeholder={t(
                                                                        'orders.edit.select_labels_ingredients',
                                                                    )}
                                                                />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {LABEL_OPTION_KEYS.map(
                                                                    (
                                                                        option,
                                                                    ) => (
                                                                        <SelectItem
                                                                            key={
                                                                                option.value
                                                                            }
                                                                            value={String(
                                                                                option.value,
                                                                            )}
                                                                        >
                                                                            {t(
                                                                                option.labelKey,
                                                                            )}
                                                                        </SelectItem>
                                                                    ),
                                                                )}
                                                            </SelectContent>
                                                        </Select>
                                                        <InputError
                                                            message={
                                                                allErrors.ingredients_labels
                                                            }
                                                        />
                                                    </div>

                                                    <div className="grid gap-2">
                                                        <FormLabel htmlFor="variable_data_labels">
                                                            {t(
                                                                'orders.labels.labels_variable',
                                                            )}
                                                        </FormLabel>
                                                        <Select
                                                            name="variable_data_labels"
                                                            value={
                                                                variableDataLabels
                                                            }
                                                            onValueChange={
                                                                setVariableDataLabels
                                                            }
                                                        >
                                                            <SelectTrigger>
                                                                <SelectValue
                                                                    placeholder={t(
                                                                        'orders.edit.select_labels_variable',
                                                                    )}
                                                                />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {LABEL_OPTION_KEYS.map(
                                                                    (
                                                                        option,
                                                                    ) => (
                                                                        <SelectItem
                                                                            key={
                                                                                option.value
                                                                            }
                                                                            value={String(
                                                                                option.value,
                                                                            )}
                                                                        >
                                                                            {t(
                                                                                option.labelKey,
                                                                            )}
                                                                        </SelectItem>
                                                                    ),
                                                                )}
                                                            </SelectContent>
                                                        </Select>
                                                        <InputError
                                                            message={
                                                                allErrors.variable_data_labels
                                                            }
                                                        />
                                                    </div>

                                                    <div className="grid gap-2">
                                                        <FormLabel htmlFor="label_of_jumpers">
                                                            {t(
                                                                'orders.labels.labels_jumper',
                                                            )}
                                                        </FormLabel>
                                                        <Select
                                                            name="label_of_jumpers"
                                                            value={
                                                                labelOfJumpers
                                                            }
                                                            onValueChange={
                                                                setLabelOfJumpers
                                                            }
                                                        >
                                                            <SelectTrigger>
                                                                <SelectValue
                                                                    placeholder={t(
                                                                        'orders.edit.select_labels_jumpers',
                                                                    )}
                                                                />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {LABEL_OPTION_KEYS.map(
                                                                    (
                                                                        option,
                                                                    ) => (
                                                                        <SelectItem
                                                                            key={
                                                                                option.value
                                                                            }
                                                                            value={String(
                                                                                option.value,
                                                                            )}
                                                                        >
                                                                            {t(
                                                                                option.labelKey,
                                                                            )}
                                                                        </SelectItem>
                                                                    ),
                                                                )}
                                                            </SelectContent>
                                                        </Select>
                                                        <InputError
                                                            message={
                                                                allErrors.label_of_jumpers
                                                            }
                                                        />
                                                    </div>
                                                </div>

                                                {/* Foglio Pallet Aggiuntivo */}
                                                {currentArticle?.palletSheet && (
                                                    <div className="grid gap-2">
                                                        <FormLabel htmlFor="pallet_sheet">
                                                            {t(
                                                                'orders.show.pallet_sheet',
                                                            )}
                                                        </FormLabel>
                                                        <div className="flex gap-2">
                                                            <Input
                                                                id="pallet_sheet"
                                                                name="pallet_sheet"
                                                                value={`${currentArticle.palletSheet.code} - ${currentArticle.palletSheet.description || ''}`}
                                                                readOnly
                                                                className="flex-1 bg-muted"
                                                            />
                                                            <Button
                                                                type="button"
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={
                                                                    handleDownloadPalletSheet
                                                                }
                                                            >
                                                                <Download className="mr-2 h-4 w-4" />
                                                                {t(
                                                                    'orders.edit.download_pallet_sheet',
                                                                )}
                                                            </Button>
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Indicaciones */}
                                                <div className="space-y-4">
                                                    <h3 className="text-lg font-semibold">
                                                        {t(
                                                            'orders.labels.indications',
                                                        )}
                                                    </h3>

                                                    <div className="grid gap-2">
                                                        <FormLabel htmlFor="indications_for_shop">
                                                            {t(
                                                                'orders.labels.indications_shop',
                                                            )}
                                                        </FormLabel>
                                                        <Textarea
                                                            id="indications_for_shop"
                                                            name="indications_for_shop"
                                                            value={
                                                                indicationsForShop
                                                            }
                                                            onChange={(e) =>
                                                                setIndicationsForShop(
                                                                    e.target
                                                                        .value,
                                                                )
                                                            }
                                                            rows={3}
                                                            placeholder={t(
                                                                'orders.edit.indicazioni_magazzino',
                                                            )}
                                                        />
                                                        <InputError
                                                            message={
                                                                allErrors.indications_for_shop
                                                            }
                                                        />
                                                    </div>

                                                    <div className="grid gap-2">
                                                        <FormLabel htmlFor="indications_for_production">
                                                            {t(
                                                                'orders.labels.indications_production',
                                                            )}
                                                        </FormLabel>
                                                        <Textarea
                                                            id="indications_for_production"
                                                            name="indications_for_production"
                                                            value={
                                                                indicationsForProduction
                                                            }
                                                            onChange={(e) =>
                                                                setIndicationsForProduction(
                                                                    e.target
                                                                        .value,
                                                                )
                                                            }
                                                            rows={3}
                                                            placeholder={t(
                                                                'orders.edit.indicazioni_produzione',
                                                            )}
                                                        />
                                                        <InputError
                                                            message={
                                                                allErrors.indications_for_production
                                                            }
                                                        />
                                                    </div>

                                                    <div className="grid gap-2">
                                                        <FormLabel htmlFor="indications_for_delivery">
                                                            {t(
                                                                'orders.labels.indications_delivery',
                                                            )}
                                                        </FormLabel>
                                                        <Textarea
                                                            id="indications_for_delivery"
                                                            name="indications_for_delivery"
                                                            value={
                                                                indicationsForDelivery
                                                            }
                                                            onChange={(e) =>
                                                                setIndicationsForDelivery(
                                                                    e.target
                                                                        .value,
                                                                )
                                                            }
                                                            rows={3}
                                                            placeholder={t(
                                                                'orders.edit.indicazioni_consegna',
                                                            )}
                                                        />
                                                        <InputError
                                                            message={
                                                                allErrors.indications_for_delivery
                                                            }
                                                        />
                                                    </div>
                                                </div>

                                                {/* Elenco componenti (Materiales) */}
                                                {currentArticle?.materials &&
                                                    currentArticle.materials
                                                        .length > 0 && (
                                                        <div className="grid gap-2">
                                                            <FormLabel>
                                                                {t(
                                                                    'orders.show.components_list',
                                                                )}
                                                            </FormLabel>
                                                            <div className="space-y-2">
                                                                {currentArticle.materials.map(
                                                                    (
                                                                        material,
                                                                    ) => (
                                                                        <Input
                                                                            key={
                                                                                material.uuid
                                                                            }
                                                                            value={`${material.cod} - ${material.description || ''}`}
                                                                            readOnly
                                                                            className="bg-muted"
                                                                        />
                                                                    ),
                                                                )}
                                                            </div>
                                                        </div>
                                                    )}

                                                <div className="flex items-center gap-4 pt-4">
                                                    <Button
                                                        type="submit"
                                                        disabled={processing}
                                                    >
                                                        {processing
                                                            ? t(
                                                                  'orders.edit.submitting',
                                                              )
                                                            : t(
                                                                  'orders.edit.submit_button',
                                                              )}
                                                    </Button>
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        onClick={() =>
                                                            setShowCloseConfirm(
                                                                true,
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
            <ConfirmCloseDialog
                open={showCloseConfirm}
                onOpenChange={setShowCloseConfirm}
                onConfirm={() => {
                    setShowCloseConfirm(false);
                    router.visit(
                        orders.show({
                            order: order.uuid,
                        }).url,
                    );
                }}
            />
        </AppLayout>
    );
}
