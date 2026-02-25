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
import { Textarea } from '@/components/ui/textarea';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { useTranslations } from '@/hooks/use-translations';
import { useFieldValidation } from '@/hooks/useFieldValidation';
import AppLayout from '@/layouts/app-layout';
import { validationRules } from '@/lib/validation/rules';
import suppliers from '@/routes/suppliers/index';
import { type BreadcrumbItem } from '@/types';
import { Form, Head, router } from '@inertiajs/react';
import { HelpCircle } from 'lucide-react';
import { useState } from 'react';

type SuppliersCreateProps = {
    errors?: Record<string, string>;
};

export default function SuppliersCreate({
    errors: serverErrors,
}: SuppliersCreateProps) {
    const { t } = useTranslations();
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
            title: t('nav.suppliers'),
            href: suppliers.index().url,
        },
        {
            title: t('common.new'),
            href: suppliers.create().url,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('suppliers.create.page_title')} />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex w-full justify-center">
                    <div className="w-full max-w-4xl space-y-5">
                        <Card>
                            <CardHeader>
                                <CardTitle>
                                    {t('suppliers.create.card_title')}
                                </CardTitle>
                                <CardDescription>
                                    {t('suppliers.create.card_description')}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Form
                                    action={suppliers.store().url}
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
                                                        htmlFor="code"
                                                        required
                                                    >
                                                        {t(
                                                            'suppliers.form.code',
                                                        )}
                                                    </FormLabel>
                                                    <Input
                                                        id="code"
                                                        name="code"
                                                        required
                                                        placeholder={t(
                                                            'suppliers.form.code',
                                                        )}
                                                        maxLength={255}
                                                    />
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
                                                            'suppliers.form.company_name',
                                                        )}
                                                    </FormLabel>
                                                    <Input
                                                        id="company_name"
                                                        name="company_name"
                                                        required
                                                        placeholder={t(
                                                            'suppliers.form.company_name',
                                                        )}
                                                        maxLength={255}
                                                    />
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
                                                                'suppliers.form.vat_label',
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
                                                                        'suppliers.form.vat_tooltip',
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
                                                        placeholder={t(
                                                            'suppliers.form.vat',
                                                        )}
                                                        pattern="[0-9]{11}"
                                                        maxLength={11}
                                                        inputMode="numeric"
                                                        aria-label={t(
                                                            'suppliers.form.vat_aria',
                                                        )}
                                                        aria-invalid={
                                                            vatNumberValidation.error
                                                                ? 'true'
                                                                : 'false'
                                                        }
                                                        className={
                                                            vatNumberValidation.error
                                                                ? 'border-destructive'
                                                                : ''
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
                                                            'suppliers.form.c_o',
                                                        )}
                                                    </FormLabel>
                                                    <Input
                                                        id="co"
                                                        name="co"
                                                        placeholder={t(
                                                            'suppliers.form.c_o',
                                                        )}
                                                        maxLength={255}
                                                    />
                                                    <InputError
                                                        message={allErrors.co}
                                                    />
                                                </div>

                                                <div className="grid gap-2">
                                                    <FormLabel htmlFor="street">
                                                        {t(
                                                            'suppliers.form.street',
                                                        )}
                                                    </FormLabel>
                                                    <Input
                                                        id="street"
                                                        name="street"
                                                        placeholder={t(
                                                            'suppliers.form.street',
                                                        )}
                                                        maxLength={255}
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
                                                                'suppliers.form.cap_label',
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
                                                                    Codice di
                                                                    Avviamento
                                                                    Postale (5
                                                                    cifre)
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
                                                        placeholder={t(
                                                            'suppliers.form.postal_code',
                                                        )}
                                                        pattern="[0-9]{5}"
                                                        maxLength={5}
                                                        inputMode="numeric"
                                                        aria-label={t(
                                                            'suppliers.form.postal_code_aria',
                                                        )}
                                                        aria-invalid={
                                                            postalCodeValidation.error
                                                                ? 'true'
                                                                : 'false'
                                                        }
                                                        className={
                                                            postalCodeValidation.error
                                                                ? 'border-destructive'
                                                                : ''
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
                                                    <FormLabel htmlFor="city">
                                                        {t(
                                                            'suppliers.form.city',
                                                        )}
                                                    </FormLabel>
                                                    <Input
                                                        id="city"
                                                        name="city"
                                                        placeholder={t(
                                                            'suppliers.form.city',
                                                        )}
                                                        maxLength={255}
                                                    />
                                                    <InputError
                                                        message={allErrors.city}
                                                    />
                                                </div>

                                                <div className="grid gap-2">
                                                    <div className="flex items-center gap-2">
                                                        <FormLabel htmlFor="province">
                                                            {t(
                                                                'suppliers.form.province_label',
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
                                                                        'suppliers.form.province_tooltip',
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
                                                        placeholder={t(
                                                            'suppliers.form.province',
                                                        )}
                                                        pattern="[A-Z]{2}"
                                                        maxLength={2}
                                                        style={{
                                                            textTransform:
                                                                'uppercase',
                                                        }}
                                                        aria-invalid={
                                                            provinceValidation.error
                                                                ? 'true'
                                                                : 'false'
                                                        }
                                                        className={
                                                            provinceValidation.error
                                                                ? 'border-destructive'
                                                                : ''
                                                        }
                                                    />
                                                    {provinceValidation.error && (
                                                        <p className="text-xs text-destructive">
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

                                                <div className="grid gap-2">
                                                    <FormLabel htmlFor="country">
                                                        {t(
                                                            'suppliers.form.country',
                                                        )}
                                                    </FormLabel>
                                                    <Input
                                                        id="country"
                                                        name="country"
                                                        placeholder={t(
                                                            'suppliers.form.country',
                                                        )}
                                                        maxLength={255}
                                                    />
                                                    <InputError
                                                        message={
                                                            allErrors.country
                                                        }
                                                    />
                                                </div>

                                                <div className="grid gap-2">
                                                    <FormLabel htmlFor="contacts">
                                                        {t(
                                                            'suppliers.form.contacts',
                                                        )}
                                                    </FormLabel>
                                                    <Textarea
                                                        id="contacts"
                                                        name="contacts"
                                                        placeholder={t(
                                                            'suppliers.form.contacts',
                                                        )}
                                                        rows={3}
                                                    />
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
                                                            ? t(
                                                                  'suppliers.create.submit_creating',
                                                              )
                                                            : t(
                                                                  'suppliers.create.submit',
                                                              )}
                                                    </Button>
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        onClick={() =>
                                                            router.visit(
                                                                suppliers.index()
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
