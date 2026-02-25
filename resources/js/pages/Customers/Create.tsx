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
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { useTranslations } from '@/hooks/use-translations';
import { useFieldValidation } from '@/hooks/useFieldValidation';
import AppLayout from '@/layouts/app-layout';
import { validationRules } from '@/lib/validation/rules';
import customers from '@/routes/customers/index';
import { type BreadcrumbItem } from '@/types';
import { Form, Head, router } from '@inertiajs/react';
import { HelpCircle } from 'lucide-react';
import { useState } from 'react';

type CustomersCreateProps = {
    errors?: Record<string, string>;
};

export default function CustomersCreate({
    errors: serverErrors,
}: CustomersCreateProps) {
    const { t } = useTranslations();
    const [showCloseConfirm, setShowCloseConfirm] = useState(false);
    const [vatNumber, setVatNumber] = useState('');
    const [postalCode, setPostalCode] = useState('');
    const [province, setProvince] = useState('');

    const vatNumberValidation = useFieldValidation(vatNumber, [
        validationRules.vatNumber(),
    ]);

    const postalCodeValidation = useFieldValidation(postalCode, [
        validationRules.postalCode(),
    ]);

    const provinceValidation = useFieldValidation(province, [
        validationRules.province(),
    ]);

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: t('nav.customers'),
            href: customers.index().url,
        },
        {
            title: t('customers.create.breadcrumb'),
            href: customers.create().url,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('customers.create.page_title')} />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex w-full justify-center">
                    <div className="w-full max-w-4xl space-y-5">
                        <Card>
                            <CardHeader>
                                <CardTitle>
                                    {t('customers.form.card_title')}
                                </CardTitle>
                                <CardDescription>
                                    {t('customers.create.card_description')}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Form
                                    action={customers.store().url}
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

                                                <div className="grid gap-2">
                                                    <FormLabel
                                                        htmlFor="code"
                                                        required
                                                    >
                                                        {t(
                                                            'customers.form.code_label',
                                                        )}
                                                    </FormLabel>
                                                    <Input
                                                        id="code"
                                                        name="code"
                                                        required
                                                        placeholder={t(
                                                            'customers.form.code_placeholder',
                                                        )}
                                                        maxLength={255}
                                                        aria-describedby="code-help"
                                                    />
                                                    <p
                                                        id="code-help"
                                                        className="text-xs text-muted-foreground"
                                                    >
                                                        {t(
                                                            'customers.form.code_help',
                                                        )}
                                                    </p>
                                                    <InputError
                                                        message={allErrors.code}
                                                    />
                                                </div>

                                                <div className="grid gap-2">
                                                    <FormLabel
                                                        htmlFor="company_name"
                                                        required
                                                    >
                                                        {t(
                                                            'customers.form.company_name_label',
                                                        )}
                                                    </FormLabel>
                                                    <Input
                                                        id="company_name"
                                                        name="company_name"
                                                        required
                                                        placeholder={t(
                                                            'customers.form.company_name_placeholder',
                                                        )}
                                                        maxLength={255}
                                                        aria-describedby="company-name-help"
                                                    />
                                                    <p
                                                        id="company-name-help"
                                                        className="text-xs text-muted-foreground"
                                                    >
                                                        {t(
                                                            'customers.form.company_name_help',
                                                        )}
                                                    </p>
                                                    <InputError
                                                        message={
                                                            allErrors.company_name
                                                        }
                                                    />
                                                </div>

                                                <div className="grid gap-2">
                                                    <div className="flex items-center gap-2">
                                                        <FormLabel htmlFor="vat_number">
                                                            {t(
                                                                'customers.form.vat_label',
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
                                                                        'customers.form.vat_tooltip',
                                                                    )}
                                                                </p>
                                                            </TooltipContent>
                                                        </Tooltip>
                                                    </div>
                                                    <Input
                                                        id="vat_number"
                                                        name="vat_number"
                                                        value={vatNumber}
                                                        onChange={(e) =>
                                                            setVatNumber(
                                                                e.target.value,
                                                            )
                                                        }
                                                        onBlur={
                                                            vatNumberValidation.onBlur
                                                        }
                                                        placeholder="12345678901"
                                                        pattern="[0-9]{11}"
                                                        maxLength={11}
                                                        inputMode="numeric"
                                                        aria-label={t(
                                                            'customers.form.vat_aria',
                                                        )}
                                                        aria-invalid={
                                                            vatNumberValidation.error
                                                                ? 'true'
                                                                : 'false'
                                                        }
                                                    />
                                                    {vatNumberValidation.error && (
                                                        <p className="text-xs text-destructive">
                                                            {
                                                                vatNumberValidation.error
                                                            }
                                                        </p>
                                                    )}
                                                    <InputError
                                                        message={
                                                            allErrors.vat_number
                                                        }
                                                    />
                                                </div>

                                                <div className="grid gap-2">
                                                    <FormLabel htmlFor="co">
                                                        {t(
                                                            'customers.form.co_label',
                                                        )}
                                                    </FormLabel>
                                                    <Input
                                                        id="co"
                                                        name="co"
                                                        placeholder={t(
                                                            'customers.form.co_placeholder',
                                                        )}
                                                    />
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
                                                            'customers.form.street_label',
                                                        )}
                                                    </FormLabel>
                                                    <Input
                                                        id="street"
                                                        name="street"
                                                        required
                                                        placeholder={t(
                                                            'customers.form.street_placeholder',
                                                        )}
                                                    />
                                                    <InputError
                                                        message={
                                                            allErrors.street
                                                        }
                                                    />
                                                </div>

                                                <div className="grid gap-2">
                                                    <div className="flex items-center gap-2">
                                                        <FormLabel htmlFor="postal_code">
                                                            {t(
                                                                'customers.form.postal_code_label',
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
                                                                        'customers.form.postal_code_tooltip',
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
                                                                e.target.value,
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
                                                            'customers.form.postal_code_aria',
                                                        )}
                                                        aria-invalid={
                                                            postalCodeValidation.error
                                                                ? 'true'
                                                                : 'false'
                                                        }
                                                    />
                                                    {postalCodeValidation.error && (
                                                        <p className="text-xs text-destructive">
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

                                                <div className="grid gap-2">
                                                    <div className="flex items-center gap-2">
                                                        <FormLabel htmlFor="city">
                                                            {t(
                                                                'customers.form.city_label',
                                                            )}
                                                        </FormLabel>
                                                    </div>
                                                    <Input
                                                        id="city"
                                                        name="city"
                                                        placeholder={t(
                                                            'customers.form.city_placeholder',
                                                        )}
                                                        maxLength={255}
                                                        aria-describedby="city-help"
                                                    />
                                                    <p
                                                        id="city-help"
                                                        className="text-xs text-muted-foreground"
                                                    >
                                                        {t(
                                                            'customers.form.city_help',
                                                        )}
                                                    </p>
                                                    <InputError
                                                        message={allErrors.city}
                                                    />
                                                </div>

                                                <div className="grid gap-2">
                                                    <div className="flex items-center gap-2">
                                                        <FormLabel htmlFor="province">
                                                            {t(
                                                                'customers.form.province_label',
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
                                                                        'customers.form.province_tooltip',
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
                                                        aria-describedby="province-help"
                                                        aria-invalid={
                                                            provinceValidation.error
                                                                ? 'true'
                                                                : 'false'
                                                        }
                                                    />
                                                    {provinceValidation.error && (
                                                        <p className="text-xs text-destructive">
                                                            {
                                                                provinceValidation.error
                                                            }
                                                        </p>
                                                    )}
                                                    <p
                                                        id="province-help"
                                                        className="text-xs text-muted-foreground"
                                                    >
                                                        {t(
                                                            'customers.form.province_help',
                                                        )}
                                                    </p>
                                                    <InputError
                                                        message={
                                                            allErrors.province
                                                        }
                                                    />
                                                </div>

                                                <div className="grid gap-2">
                                                    <div className="flex items-center gap-2">
                                                        <FormLabel htmlFor="country">
                                                            {t(
                                                                'customers.form.country_label',
                                                            )}
                                                        </FormLabel>
                                                    </div>
                                                    <Input
                                                        id="country"
                                                        name="country"
                                                        placeholder={t(
                                                            'customers.form.country_placeholder',
                                                        )}
                                                        maxLength={255}
                                                        aria-describedby="country-help"
                                                    />
                                                    <p
                                                        id="country-help"
                                                        className="text-xs text-muted-foreground"
                                                    >
                                                        {t(
                                                            'customers.form.country_help',
                                                        )}
                                                    </p>
                                                    <InputError
                                                        message={
                                                            allErrors.country
                                                        }
                                                    />
                                                </div>

                                                <div className="flex items-center gap-4">
                                                    <Button
                                                        type="submit"
                                                        disabled={processing}
                                                    >
                                                        {processing
                                                            ? t(
                                                                  'customers.create.saving',
                                                              )
                                                            : t(
                                                                  'customers.create.submit',
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
                    router.visit(customers.index().url);
                }}
            />
        </AppLayout>
    );
}
