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
import { generateUUID } from '@/lib/utils/uuid';
import { validationRules } from '@/lib/validation/rules';
import customerDivisions from '@/routes/customer-divisions/index';
import customersRoutes from '@/routes/customers/index';
import { type BreadcrumbItem } from '@/types';
import { Form, Head, router } from '@inertiajs/react';
import { useState } from 'react';

type Customer = {
    uuid: string;
    company_name: string;
};

type CustomerDivisionsCreateProps = {
    customers: Customer[];
    customer_uuid?: string;
    errors?: Record<string, string>;
};

export default function CustomerDivisionsCreate({
    customers,
    customer_uuid: initialCustomerUuid,
    errors: serverErrors,
}: CustomerDivisionsCreateProps) {
    const { t } = useTranslations();
    const [uuid, setUuid] = useState<string>(generateUUID());
    const [selectedCustomer, setSelectedCustomer] = useState<string>(
        initialCustomerUuid ?? '',
    );
    const [email, setEmail] = useState('');

    const emailValidation = useFieldValidation(email, [
        validationRules.email(),
    ]);

    const regenerateUuid = () => {
        setUuid(generateUUID());
    };

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: t('nav.customers'),
            href: customersRoutes.index().url,
        },
        {
            title: t('nav.divisioni'),
            href: customerDivisions.index().url,
        },
        {
            title: t('common.new'),
            href: customerDivisions.create().url,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('customer_divisions.create.page_title')} />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex w-full justify-center">
                    <div className="w-full max-w-4xl space-y-5">
                        <Card>
                            <CardHeader>
                                <CardTitle>
                                    {t('customer_divisions.create.card_title')}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Form
                                    action={customerDivisions.store().url}
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
                                                    <div className="flex items-center justify-between">
                                                        <FormLabel
                                                            htmlFor="uuid"
                                                            required
                                                        >
                                                            {t(
                                                                'customer_divisions.form.uuid_label',
                                                            )}
                                                        </FormLabel>
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={
                                                                regenerateUuid
                                                            }
                                                            className="h-7 text-xs"
                                                        >
                                                            {t(
                                                                'customer_divisions.form.uuid_regenerate',
                                                            )}
                                                        </Button>
                                                    </div>
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
                                                            'customer_divisions.form.uuid_placeholder',
                                                        )}
                                                        maxLength={36}
                                                        aria-describedby="uuid-help"
                                                    />
                                                    <p
                                                        id="uuid-help"
                                                        className="text-xs text-muted-foreground"
                                                    >
                                                        {t(
                                                            'customer_divisions.form.uuid_help',
                                                        )}
                                                    </p>
                                                    <InputError
                                                        message={allErrors.uuid}
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
                                                            setSelectedCustomer
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
                                                                customerDivisions.index()
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
