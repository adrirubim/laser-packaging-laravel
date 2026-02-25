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
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { useTranslations } from '@/hooks/use-translations';
import { useFieldValidation } from '@/hooks/useFieldValidation';
import AppLayout from '@/layouts/app-layout';
import { validationRules } from '@/lib/validation/rules';
import customerShippingAddresses from '@/routes/customer-shipping-addresses/index';
import { type BreadcrumbItem } from '@/types';
import { Form, Head, router } from '@inertiajs/react';
import { HelpCircle, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';

type Customer = {
    uuid: string;
    code: string;
    company_name: string;
};

type CustomerDivision = {
    uuid: string;
    name: string;
};

type CustomerShippingAddressesCreateProps = {
    customers: Customer[];
    divisions: CustomerDivision[];
    customer_uuid?: string;
    customerdivision_uuid?: string;
    errors?: Record<string, string>;
};

export default function CustomerShippingAddressesCreate({
    customers,
    divisions: initialDivisions,
    customer_uuid: initialCustomerUuid,
    customerdivision_uuid,
    errors: serverErrors,
}: CustomerShippingAddressesCreateProps) {
    const { t } = useTranslations();
    const [showCloseConfirm, setShowCloseConfirm] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState<string>(
        initialCustomerUuid ?? '',
    );
    const [selectedDivision, setSelectedDivision] = useState<string>(
        customerdivision_uuid ?? '',
    );
    const [divisions, setDivisions] =
        useState<CustomerDivision[]>(initialDivisions);
    const [loadingDivisions, setLoadingDivisions] = useState(false);
    const [postalCode, setPostalCode] = useState('');
    const [province, setProvince] = useState('');

    const postalCodeValidation = useFieldValidation(postalCode, [
        validationRules.postalCode(),
    ]);

    const provinceValidation = useFieldValidation(province, [
        validationRules.province(),
    ]);

    const handleCustomerChange = (customerUuid: string) => {
        setSelectedCustomer(customerUuid);
        setSelectedDivision(''); // Reimposta divisione al cambio cliente
        setDivisions([]);

        if (customerUuid) {
            setLoadingDivisions(true);
            // Use fetch for simple AJAX request
            fetch(
                `/customer-shipping-addresses/load-divisions?customer_uuid=${customerUuid}`,
                {
                    headers: {
                        'X-Requested-With': 'XMLHttpRequest',
                        Accept: 'application/json',
                    },
                },
            )
                .then((response) => response.json())
                .then((data) => {
                    setDivisions(data.customer_divisions || []);
                    setLoadingDivisions(false);
                })
                .catch((error) => {
                    console.error('Errore caricamento divisioni:', error);
                    setLoadingDivisions(false);
                });
        } else {
            setDivisions([]);
        }
    };

    // Load divisions if there's an initial customer but no divisions loaded
    useEffect(() => {
        if (initialCustomerUuid && initialDivisions.length === 0) {
            queueMicrotask(() => handleCustomerChange(initialCustomerUuid));
        }
    }, [initialCustomerUuid, initialDivisions.length]);

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: t('customer_shipping_addresses.index.title'),
            href: customerShippingAddresses.index().url,
        },
        {
            title: t('common.new'),
            href: customerShippingAddresses.create().url,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head
                title={t(
                    'customer_shipping_addresses.create.page_title',
                    // fallback handled by hook
                )}
            />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex w-full justify-center">
                    <div className="w-full max-w-4xl space-y-5">
                        <Card>
                            <CardHeader>
                                <CardTitle>
                                    {t(
                                        'customer_shipping_addresses.create.card_title',
                                    )}
                                </CardTitle>
                                <CardDescription>
                                    {t(
                                        'customer_shipping_addresses.create.card_description',
                                    )}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Form
                                    action={
                                        customerShippingAddresses.store().url
                                    }
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
                                                    errors={allErrors}
                                                    hasAttemptedSubmit={
                                                        hasAttemptedSubmit
                                                    }
                                                />
                                                <div className="grid gap-2">
                                                    <FormLabel
                                                        htmlFor="customer_uuid"
                                                        required
                                                    >
                                                        {t(
                                                            'customer_shipping_addresses.form.customer_label',
                                                        )}
                                                    </FormLabel>
                                                    <input
                                                        type="hidden"
                                                        name="customer_uuid"
                                                        value={selectedCustomer}
                                                    />
                                                    <Select
                                                        value={
                                                            selectedCustomer ||
                                                            undefined
                                                        }
                                                        onValueChange={
                                                            handleCustomerChange
                                                        }
                                                        required
                                                    >
                                                        <SelectTrigger>
                                                            <SelectValue
                                                                placeholder={t(
                                                                    'customer_shipping_addresses.form.customer_placeholder',
                                                                )}
                                                            />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {customers.map(
                                                                (customer) => (
                                                                    <SelectItem
                                                                        key={
                                                                            customer.uuid
                                                                        }
                                                                        value={
                                                                            customer.uuid
                                                                        }
                                                                    >
                                                                        {
                                                                            customer.code
                                                                        }{' '}
                                                                        -{' '}
                                                                        {
                                                                            customer.company_name
                                                                        }
                                                                    </SelectItem>
                                                                ),
                                                            )}
                                                        </SelectContent>
                                                    </Select>
                                                    <InputError
                                                        message={
                                                            allErrors.customer_uuid
                                                        }
                                                    />
                                                </div>

                                                <div className="grid gap-2">
                                                    <FormLabel
                                                        htmlFor="customerdivision_uuid"
                                                        required
                                                    >
                                                        {t(
                                                            'customer_shipping_addresses.form.division_label',
                                                        )}
                                                    </FormLabel>
                                                    <Select
                                                        value={
                                                            selectedDivision ||
                                                            undefined
                                                        }
                                                        onValueChange={
                                                            setSelectedDivision
                                                        }
                                                        required
                                                        disabled={
                                                            !selectedCustomer ||
                                                            loadingDivisions
                                                        }
                                                    >
                                                        <SelectTrigger>
                                                            <SelectValue
                                                                placeholder={
                                                                    !selectedCustomer
                                                                        ? t(
                                                                              'customer_shipping_addresses.form.division_placeholder_select_customer',
                                                                          )
                                                                        : loadingDivisions
                                                                          ? t(
                                                                                'customer_shipping_addresses.form.division_loading',
                                                                            )
                                                                          : divisions.length ===
                                                                              0
                                                                            ? t(
                                                                                  'customer_shipping_addresses.form.division_none',
                                                                              )
                                                                            : t(
                                                                                  'customer_shipping_addresses.form.division_placeholder',
                                                                              )
                                                                }
                                                            />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {loadingDivisions ? (
                                                                <div className="flex items-center justify-center p-4">
                                                                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                                                                    <span className="ml-2 text-sm text-muted-foreground">
                                                                        {t(
                                                                            'common.loading',
                                                                        )}
                                                                    </span>
                                                                </div>
                                                            ) : divisions.length ===
                                                                  0 &&
                                                              selectedCustomer ? (
                                                                <div className="p-4 text-center text-sm text-muted-foreground">
                                                                    {t(
                                                                        'customer_shipping_addresses.form.division_none_for_customer',
                                                                    )}
                                                                </div>
                                                            ) : (
                                                                divisions.map(
                                                                    (
                                                                        division,
                                                                    ) => (
                                                                        <SelectItem
                                                                            key={
                                                                                division.uuid
                                                                            }
                                                                            value={
                                                                                division.uuid
                                                                            }
                                                                        >
                                                                            {
                                                                                division.name
                                                                            }
                                                                        </SelectItem>
                                                                    ),
                                                                )
                                                            )}
                                                        </SelectContent>
                                                    </Select>
                                                    {loadingDivisions && (
                                                        <p className="flex items-center gap-1 text-xs text-muted-foreground">
                                                            <Loader2 className="h-3 w-3 animate-spin" />
                                                            {t(
                                                                'customer_shipping_addresses.form.division_loading',
                                                            )}
                                                        </p>
                                                    )}
                                                    <input
                                                        type="hidden"
                                                        name="customerdivision_uuid"
                                                        value={selectedDivision}
                                                    />
                                                    <InputError
                                                        message={
                                                            allErrors.customerdivision_uuid
                                                        }
                                                    />
                                                </div>

                                                <div className="grid gap-2">
                                                    <FormLabel htmlFor="co">
                                                        {t(
                                                            'customer_shipping_addresses.form.co_label',
                                                        )}
                                                    </FormLabel>
                                                    <Input
                                                        id="co"
                                                        name="co"
                                                        placeholder={t(
                                                            'customer_shipping_addresses.form.co_placeholder',
                                                        )}
                                                        maxLength={255}
                                                        aria-describedby="co-help"
                                                    />
                                                    <p
                                                        id="co-help"
                                                        className="text-xs text-muted-foreground"
                                                    >
                                                        {t(
                                                            'customer_shipping_addresses.form.co_help',
                                                        )}
                                                    </p>
                                                    <InputError
                                                        message={allErrors.co}
                                                    />
                                                </div>

                                                <div className="grid gap-2">
                                                    <FormLabel
                                                        htmlFor="street"
                                                        required
                                                    >
                                                        {t(
                                                            'customer_shipping_addresses.form.street_label',
                                                        )}
                                                    </FormLabel>
                                                    <Input
                                                        id="street"
                                                        name="street"
                                                        required
                                                        placeholder={t(
                                                            'customer_shipping_addresses.form.street_placeholder',
                                                        )}
                                                        maxLength={255}
                                                        aria-describedby="street-help"
                                                    />
                                                    <p
                                                        id="street-help"
                                                        className="text-xs text-muted-foreground"
                                                    >
                                                        {t(
                                                            'customer_shipping_addresses.form.street_help',
                                                        )}
                                                    </p>
                                                    <InputError
                                                        message={
                                                            allErrors.street
                                                        }
                                                    />
                                                </div>

                                                <div className="grid gap-2 md:grid-cols-2">
                                                    <div>
                                                        <div className="flex items-center gap-2">
                                                            <FormLabel htmlFor="postal_code">
                                                                {t(
                                                                    'customer_shipping_addresses.form.postal_code_label',
                                                                )}
                                                            </FormLabel>
                                                            <Tooltip>
                                                                <TooltipTrigger
                                                                    asChild
                                                                >
                                                                    <HelpCircle className="h-4 w-4 cursor-help text-muted-foreground" />
                                                                </TooltipTrigger>
                                                                <TooltipContent>
                                                                    <p>
                                                                        {t(
                                                                            'customer_shipping_addresses.form.postal_code_tooltip',
                                                                        )}
                                                                    </p>
                                                                </TooltipContent>
                                                            </Tooltip>
                                                        </div>
                                                        <Input
                                                            id="postal_code"
                                                            name="postal_code"
                                                            value={postalCode}
                                                            onChange={(e) =>
                                                                setPostalCode(
                                                                    e.target
                                                                        .value,
                                                                )
                                                            }
                                                            onBlur={
                                                                postalCodeValidation.onBlur
                                                            }
                                                            placeholder="00100"
                                                            pattern="[0-9]{5}"
                                                            maxLength={5}
                                                            inputMode="numeric"
                                                            aria-label={t(
                                                                'customer_shipping_addresses.form.postal_code_aria',
                                                            )}
                                                            aria-invalid={
                                                                postalCodeValidation.error
                                                                    ? 'true'
                                                                    : 'false'
                                                            }
                                                        />
                                                        {postalCodeValidation.error && (
                                                            <p className="mt-1 text-xs text-destructive">
                                                                {
                                                                    postalCodeValidation.error
                                                                }
                                                            </p>
                                                        )}
                                                        <InputError
                                                            message={
                                                                allErrors.postal_code
                                                            }
                                                        />
                                                    </div>
                                                    <div>
                                                        <div className="flex items-center gap-2">
                                                            <FormLabel htmlFor="city">
                                                                {t(
                                                                    'customer_shipping_addresses.form.city_label',
                                                                )}
                                                            </FormLabel>
                                                        </div>
                                                        <Input
                                                            id="city"
                                                            name="city"
                                                            placeholder={t(
                                                                'customer_shipping_addresses.form.city_placeholder',
                                                            )}
                                                            maxLength={255}
                                                            aria-describedby="city-help"
                                                        />
                                                        <p
                                                            id="city-help"
                                                            className="text-xs text-muted-foreground"
                                                        >
                                                            {t(
                                                                'customer_shipping_addresses.form.city_help',
                                                            )}
                                                        </p>
                                                        <InputError
                                                            message={
                                                                allErrors.city
                                                            }
                                                        />
                                                    </div>
                                                </div>

                                                <div className="grid gap-2 md:grid-cols-2">
                                                    <div>
                                                        <div className="flex items-center gap-2">
                                                            <FormLabel htmlFor="province">
                                                                {t(
                                                                    'customer_shipping_addresses.form.province_label',
                                                                )}
                                                            </FormLabel>
                                                            <Tooltip>
                                                                <TooltipTrigger
                                                                    asChild
                                                                >
                                                                    <HelpCircle className="h-4 w-4 cursor-help text-muted-foreground" />
                                                                </TooltipTrigger>
                                                                <TooltipContent>
                                                                    <p>
                                                                        {t(
                                                                            'customer_shipping_addresses.form.province_tooltip',
                                                                        )}
                                                                    </p>
                                                                </TooltipContent>
                                                            </Tooltip>
                                                        </div>
                                                        <Input
                                                            id="province"
                                                            name="province"
                                                            value={province}
                                                            onChange={(e) =>
                                                                setProvince(
                                                                    e.target.value.toUpperCase(),
                                                                )
                                                            }
                                                            onBlur={
                                                                provinceValidation.onBlur
                                                            }
                                                            placeholder="RM"
                                                            pattern="[A-Z]{2}"
                                                            maxLength={2}
                                                            style={{
                                                                textTransform:
                                                                    'uppercase',
                                                            }}
                                                            aria-label={t(
                                                                'customer_shipping_addresses.form.province_aria',
                                                            )}
                                                            aria-invalid={
                                                                provinceValidation.error
                                                                    ? 'true'
                                                                    : 'false'
                                                            }
                                                        />
                                                        {provinceValidation.error && (
                                                            <p className="mt-1 text-xs text-destructive">
                                                                {
                                                                    provinceValidation.error
                                                                }
                                                            </p>
                                                        )}
                                                        <InputError
                                                            message={
                                                                allErrors.province
                                                            }
                                                        />
                                                    </div>
                                                    <div>
                                                        <div className="flex items-center gap-2">
                                                            <FormLabel htmlFor="country">
                                                                {t(
                                                                    'customer_shipping_addresses.form.country_label',
                                                                )}
                                                            </FormLabel>
                                                        </div>
                                                        <Input
                                                            id="country"
                                                            name="country"
                                                            placeholder={t(
                                                                'customer_shipping_addresses.form.country_placeholder',
                                                            )}
                                                            maxLength={255}
                                                            aria-describedby="country-help"
                                                        />
                                                        <p
                                                            id="country-help"
                                                            className="text-xs text-muted-foreground"
                                                        >
                                                            {t(
                                                                'customer_shipping_addresses.form.country_help',
                                                            )}
                                                        </p>
                                                        <InputError
                                                            message={
                                                                allErrors.country
                                                            }
                                                        />
                                                    </div>
                                                </div>

                                                <div className="grid gap-2">
                                                    <FormLabel htmlFor="contacts">
                                                        {t(
                                                            'customer_shipping_addresses.form.contacts_label',
                                                        )}
                                                    </FormLabel>
                                                    <Input
                                                        id="contacts"
                                                        name="contacts"
                                                        placeholder={t(
                                                            'customer_shipping_addresses.form.contacts_placeholder',
                                                        )}
                                                        maxLength={255}
                                                        aria-describedby="contacts-help"
                                                    />
                                                    <p
                                                        id="contacts-help"
                                                        className="text-xs text-muted-foreground"
                                                    >
                                                        {t(
                                                            'customer_shipping_addresses.form.contacts_help',
                                                        )}
                                                    </p>
                                                    <InputError
                                                        message={
                                                            allErrors.contacts
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
                                                            : t('common.save')}
                                                    </Button>
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        onClick={() =>
                                                            router.visit(
                                                                customerShippingAddresses.index()
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
            <ConfirmCloseDialog
                open={showCloseConfirm}
                onOpenChange={setShowCloseConfirm}
                onConfirm={() => {
                    setShowCloseConfirm(false);
                    router.visit(customerShippingAddresses.index().url);
                }}
            />
        </AppLayout>
    );
}
