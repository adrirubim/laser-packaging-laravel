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

type OrdersCreateProps = {
    articles: Article[];
    shippingAddresses: ShippingAddress[];
    article?: Article | null;
    productionNumber: string;
    /** Precompilazione quando c'è un solo indirizzo (Crea Ordine da Articoli) */
    initialShippingAddressUuid?: string | null;
    errors?: Record<string, string>;
};

export default function OrdersCreate({
    articles,
    shippingAddresses: initialAddresses,
    article: initialArticle,
    productionNumber,
    initialShippingAddressUuid,
    errors: serverErrors,
}: OrdersCreateProps) {
    const { t } = useTranslations();
    const [shippingAddresses, setShippingAddresses] =
        useState<ShippingAddress[]>(initialAddresses);
    const [selectedArticle, setSelectedArticle] = useState<string>(
        initialArticle?.uuid || '',
    );
    const [currentArticle, setCurrentArticle] = useState<Article | null>(
        initialArticle || null,
    );
    const [selectedShippingAddress, setSelectedShippingAddress] =
        useState<string>(initialShippingAddressUuid ?? '');
    const [quantity, setQuantity] = useState('');
    const [deliveryDate, setDeliveryDate] = useState('');
    const [line, setLine] = useState('');
    const [expectedProductionStartDate, setExpectedProductionStartDate] =
        useState('');
    const [typeLot, setTypeLot] = useState<string>('');
    const [lot, setLot] = useState('');
    const [expirationDate, setExpirationDate] = useState('');
    const [externalLabels, setExternalLabels] = useState<string>('');
    const [pvpLabels, setPvpLabels] = useState<string>('');
    const [ingredientsLabels, setIngredientsLabels] = useState<string>('');
    const [variableDataLabels, setVariableDataLabels] = useState<string>('');
    const [labelOfJumpers, setLabelOfJumpers] = useState<string>('');
    const [indicationsForShop, setIndicationsForShop] = useState('');
    const [indicationsForProduction, setIndicationsForProduction] =
        useState('');
    const [indicationsForDelivery, setIndicationsForDelivery] = useState('');
    const [showCloseConfirm, setShowCloseConfirm] = useState(false);

    // Calculate remain_quantity
    const workedQuantity = 0;
    const remainQuantity = quantity
        ? (parseFloat(quantity) - workedQuantity).toFixed(5)
        : '0';

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

    const deliveryDateValidation = useFieldValidation(deliveryDate, [
        (value) => {
            if (!value) return null;
            const date = new Date(value);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            if (date < today) {
                return t('orders.validation.date_not_past');
            }
            return null;
        },
    ]);

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: t('nav.orders'),
            href: orders.index().url,
        },
        {
            title: t('common.new'),
            href: orders.create().url,
        },
    ];

    const handleArticleChange = (articleUuid: string) => {
        setSelectedArticle(articleUuid);
        if (articleUuid) {
            router.get(
                orders.create().url,
                { article_uuid: articleUuid },
                {
                    preserveState: true,
                    preserveScroll: true,
                    only: [
                        'shippingAddresses',
                        'article',
                        'initialShippingAddressUuid',
                    ],
                    onSuccess: (page) => {
                        const props = page.props as {
                            shippingAddresses?: ShippingAddress[];
                            article?: Article | null;
                            initialShippingAddressUuid?: string | null;
                        };
                        const addresses = props.shippingAddresses || [];
                        setShippingAddresses(addresses);
                        setCurrentArticle(props.article || null);
                        setSelectedShippingAddress(
                            props.initialShippingAddressUuid ??
                                (addresses.length === 1
                                    ? addresses[0].uuid
                                    : ''),
                        );
                    },
                },
            );
        } else {
            setShippingAddresses([]);
            setCurrentArticle(null);
            setSelectedShippingAddress('');
        }
    };

    // Lotto: readonly se type_lot == -1, modificabile altrimenti
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
            <Head title={t('orders.create.page_title')} />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex w-full justify-center">
                    <div className="w-full max-w-4xl space-y-5">
                        <Card>
                            <CardHeader>
                                <CardTitle>
                                    {t('orders.create.card_title')}
                                </CardTitle>
                                <CardDescription>
                                    {t('orders.create.card_description')}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Form
                                    action={orders.store().url}
                                    method="post"
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
                                                    <FormLabel htmlFor="order_production_number">
                                                        {t(
                                                            'orders.labels.production_number',
                                                        )}
                                                    </FormLabel>
                                                    <Input
                                                        id="order_production_number"
                                                        name="order_production_number"
                                                        defaultValue={
                                                            productionNumber
                                                        }
                                                        placeholder={t(
                                                            'orders.create.production_number_placeholder',
                                                        )}
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
                                                        value={
                                                            selectedArticle ||
                                                            undefined
                                                        }
                                                        onValueChange={
                                                            handleArticleChange
                                                        }
                                                        required
                                                    >
                                                        <SelectTrigger>
                                                            <SelectValue
                                                                placeholder={t(
                                                                    'orders.select_article',
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
                                                        placeholder={t(
                                                            'orders.create.client_ref_placeholder',
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
                                                            'orders.create.line_placeholder',
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
                                                    <input
                                                        type="hidden"
                                                        name="customershippingaddress_uuid"
                                                        value={
                                                            selectedShippingAddress
                                                        }
                                                    />
                                                    <Select
                                                        value={
                                                            selectedShippingAddress ||
                                                            undefined
                                                        }
                                                        onValueChange={
                                                            setSelectedShippingAddress
                                                        }
                                                        disabled={
                                                            !selectedArticle ||
                                                            shippingAddresses.length ===
                                                                0
                                                        }
                                                    >
                                                        <SelectTrigger>
                                                            <SelectValue
                                                                placeholder={
                                                                    !selectedArticle
                                                                        ? t(
                                                                              'orders.create.select_article_first',
                                                                          )
                                                                        : shippingAddresses.length ===
                                                                            0
                                                                          ? t(
                                                                                'orders.create.no_address_available',
                                                                            )
                                                                          : t(
                                                                                'orders.create.select_delivery_place',
                                                                            )
                                                                }
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
                                                                    'orders.create.select_lot_type',
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
                                                                      'orders.create.lot_auto_generated',
                                                                  )
                                                                : t(
                                                                      'orders.create.lot_placeholder',
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
                                                                        'orders.create.select_labels_external',
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
                                                                        'orders.create.select_labels_pvp',
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
                                                                        'orders.create.select_labels_ingredients',
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
                                                                        'orders.create.select_labels_variable',
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
                                                                        'orders.create.select_labels_jumpers',
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
                                                                    'orders.create.download_pallet_sheet',
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
                                                                'orders.create.indicazioni_magazzino',
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
                                                                'orders.create.indicazioni_produzione',
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
                                                                'orders.create.indicazioni_consegna',
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
                                                            <FormLabel htmlFor="article-materials-list">
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
                                                                  'orders.create.submitting',
                                                              )
                                                            : t(
                                                                  'orders.create.submit_button',
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
                    router.visit(orders.index().url);
                }}
            />
        </AppLayout>
    );
}
