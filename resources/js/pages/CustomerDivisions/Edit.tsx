import { FormLabel } from '@/components/FormLabel';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useTranslations } from '@/hooks/use-translations';
import { useFieldValidation } from '@/hooks/useFieldValidation';
import AppLayout from '@/layouts/app-layout';
import { validationRules } from '@/lib/validation/rules';
import customerDivisions from '@/routes/customer-divisions/index';
import { type BreadcrumbItem } from '@/types';
import { Form, Head, router } from '@inertiajs/react';
import { useState } from 'react';

type Customer = {
    uuid: string;
    company_name: string;
};

type CustomerDivision = {
    id: number;
    uuid: string;
    name: string;
    code?: string | null;
    email?: string | null;
    contacts?: string | null;
    customer_uuid: string;
};

type CustomerDivisionsEditProps = {
    division: CustomerDivision;
    customers: Customer[];
    errors?: Record<string, string>;
};

export default function CustomerDivisionsEdit({
    division,
    customers,
    errors: serverErrors,
}: CustomerDivisionsEditProps) {
    const { t } = useTranslations();
    const [email, setEmail] = useState(division.email || '');

    const emailValidation = useFieldValidation(email, [
        validationRules.email(),
    ]);

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: t('customer_divisions.index.title'),
            href: customerDivisions.index().url,
        },
        {
            title: division.name,
            href: customerDivisions.show({ customerDivision: division.uuid })
                .url,
        },
        {
            title: t('customers.edit.breadcrumb'),
            href: customerDivisions.edit({ customerDivision: division.uuid })
                .url,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head
                title={t('customer_divisions.show.page_title', {
                    name: division.name,
                })}
            />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex w-full justify-center">
                    <div className="w-full max-w-4xl space-y-5">
                        <Card>
                            <CardHeader>
                                <CardTitle>
                                    {t('customers.edit.breadcrumb')}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Form
                                    action={
                                        customerDivisions.update({
                                            customerDivision: division.uuid,
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
                                                            division.uuid
                                                        }
                                                        readOnly
                                                        className="bg-muted"
                                                    />
                                                </div>

                                                <div className="grid gap-2">
                                                    <FormLabel
                                                        htmlFor="customer_uuid"
                                                        required
                                                    >
                                                        {t(
                                                            'customer_divisions.form.customer_label',
                                                        )}
                                                    </FormLabel>
                                                    <Select
                                                        name="customer_uuid"
                                                        defaultValue={
                                                            division.customer_uuid
                                                        }
                                                        required
                                                    >
                                                        <SelectTrigger>
                                                            <SelectValue
                                                                placeholder={t(
                                                                    'customer_divisions.form.customer_placeholder',
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
                                                        htmlFor="name"
                                                        required
                                                    >
                                                        {t(
                                                            'customer_divisions.form.name_label',
                                                        )}
                                                    </FormLabel>
                                                    <Input
                                                        id="name"
                                                        name="name"
                                                        defaultValue={
                                                            division.name
                                                        }
                                                        required
                                                        placeholder={t(
                                                            'customer_divisions.form.name_placeholder',
                                                        )}
                                                        maxLength={255}
                                                        aria-describedby="name-help"
                                                    />
                                                    <p
                                                        id="name-help"
                                                        className="text-xs text-muted-foreground"
                                                    >
                                                        {t(
                                                            'customer_divisions.form.name_help',
                                                        )}
                                                    </p>
                                                    <InputError
                                                        message={allErrors.name}
                                                    />
                                                </div>

                                                <div className="grid gap-2">
                                                    <FormLabel htmlFor="code">
                                                        {t(
                                                            'customer_divisions.form.code_label',
                                                        )}
                                                    </FormLabel>
                                                    <Input
                                                        id="code"
                                                        name="code"
                                                        defaultValue={
                                                            division.code ?? ''
                                                        }
                                                        placeholder={t(
                                                            'customer_divisions.form.code_placeholder',
                                                        )}
                                                        maxLength={255}
                                                        aria-describedby="code-help"
                                                    />
                                                    <p
                                                        id="code-help"
                                                        className="text-xs text-muted-foreground"
                                                    >
                                                        {t(
                                                            'customer_divisions.form.code_help',
                                                        )}
                                                    </p>
                                                    <InputError
                                                        message={allErrors.code}
                                                    />
                                                </div>

                                                <div className="grid gap-2">
                                                    <FormLabel htmlFor="email">
                                                        {t(
                                                            'customer_divisions.form.email_label',
                                                        )}
                                                    </FormLabel>
                                                    <Input
                                                        id="email"
                                                        name="email"
                                                        type="email"
                                                        value={email}
                                                        onChange={(e) =>
                                                            setEmail(
                                                                e.target.value,
                                                            )
                                                        }
                                                        onBlur={
                                                            emailValidation.onBlur
                                                        }
                                                        placeholder={t(
                                                            'customer_divisions.form.email_placeholder',
                                                        )}
                                                        maxLength={255}
                                                        aria-describedby="email-help"
                                                        aria-invalid={
                                                            emailValidation.error
                                                                ? 'true'
                                                                : 'false'
                                                        }
                                                    />
                                                    {emailValidation.error && (
                                                        <p className="text-xs text-destructive">
                                                            {
                                                                emailValidation.error
                                                            }
                                                        </p>
                                                    )}
                                                    <p
                                                        id="email-help"
                                                        className="text-xs text-muted-foreground"
                                                    >
                                                        {t(
                                                            'customer_divisions.form.email_help',
                                                        )}
                                                    </p>
                                                    <InputError
                                                        message={
                                                            allErrors.email
                                                        }
                                                    />
                                                </div>

                                                <div className="grid gap-2">
                                                    <FormLabel htmlFor="contacts">
                                                        {t(
                                                            'customer_divisions.form.contacts_label',
                                                        )}
                                                    </FormLabel>
                                                    <Input
                                                        id="contacts"
                                                        name="contacts"
                                                        defaultValue={
                                                            division.contacts ??
                                                            ''
                                                        }
                                                        placeholder={t(
                                                            'customer_divisions.form.contacts_placeholder',
                                                        )}
                                                        maxLength={255}
                                                        aria-describedby="contacts-help"
                                                    />
                                                    <p
                                                        id="contacts-help"
                                                        className="text-xs text-muted-foreground"
                                                    >
                                                        {t(
                                                            'customer_divisions.form.contacts_help',
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
                                                                customerDivisions.show(
                                                                    {
                                                                        customerDivision:
                                                                            division.uuid,
                                                                    },
                                                                ).url,
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
