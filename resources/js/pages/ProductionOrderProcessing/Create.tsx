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
import { useTranslations } from '@/hooks/use-translations';
import AppLayout from '@/layouts/app-layout';
import productionOrderProcessing from '@/routes/production-order-processing/index';
import { type BreadcrumbItem } from '@/types';
import { Form, Head, router } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import { useEffect, useState } from 'react';

type Employee = {
    uuid: string;
    name: string;
    surname: string;
    matriculation_number: string;
};

type Order = {
    uuid: string;
    order_production_number: string;
    article_descr?: string | null;
};

type ProductionOrderProcessingCreateProps = {
    employees: Employee[];
    orders: Order[];
    errors?: {
        employee_uuid?: string;
        order_uuid?: string;
        quantity?: string;
        processed_datetime?: string;
    };
};

export default function ProductionOrderProcessingCreate({
    employees,
    orders,
    errors: serverErrors = {},
}: ProductionOrderProcessingCreateProps) {
    const { t } = useTranslations();
    const [selectedEmployee, setSelectedEmployee] = useState<string>('');
    const [selectedOrder, setSelectedOrder] = useState<string>('');
    const [quantity, setQuantity] = useState<string>('');
    const [processedDatetime, setProcessedDatetime] = useState<string>('');
    const [showCloseConfirm, setShowCloseConfirm] = useState(false);

    // Format current date/time for datetime-local input
    useEffect(() => {
        const now = new Date();
        // Allineare al fuso orario locale
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        queueMicrotask(() =>
            setProcessedDatetime(`${year}-${month}-${day}T${hours}:${minutes}`),
        );
    }, []);

    const allErrors = {
        employee_uuid: serverErrors.employee_uuid,
        order_uuid: serverErrors.order_uuid,
        quantity: serverErrors.quantity,
        processed_datetime: serverErrors.processed_datetime,
    };

    const validationErrors = Object.fromEntries(
        Object.entries(allErrors).filter(
            (entry): entry is [string, string] =>
                typeof entry[1] === 'string' && entry[1].length > 0,
        ),
    ) as Record<string, string>;

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: t('nav.avanzamenti_produzione'),
            href: productionOrderProcessing.index().url,
        },
        {
            title: t('common.create'),
            href: '#',
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('production_order_processing.create.page_title')} />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex w-full justify-center">
                    <div className="w-full max-w-4xl space-y-5">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-2xl font-bold">
                                    {t(
                                        'production_order_processing.create.page_title',
                                    )}
                                </h1>
                                <p className="text-muted-foreground">
                                    {t(
                                        'production_order_processing.create.subtitle',
                                    )}
                                </p>
                            </div>
                            <Button
                                variant="outline"
                                onClick={() => setShowCloseConfirm(true)}
                            >
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                {t('common.back')}
                            </Button>
                        </div>

                        <FormValidationNotification
                            errors={validationErrors}
                            message={t(
                                'production_order_processing.create.validation_message',
                            )}
                        />

                        <Card>
                            <CardHeader>
                                <CardTitle>
                                    {t(
                                        'production_order_processing.create.card_title',
                                    )}
                                </CardTitle>
                                <CardDescription>
                                    {t(
                                        'production_order_processing.create.card_description',
                                    )}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Form
                                    action={
                                        productionOrderProcessing.store().url
                                    }
                                    method="post"
                                    className="space-y-6"
                                >
                                    {/* Dipendente */}
                                    <div className="grid gap-2">
                                        <FormLabel
                                            htmlFor="employee_uuid"
                                            required
                                        >
                                            {t('common.personnel')}
                                        </FormLabel>
                                        <Select
                                            name="employee_uuid"
                                            value={selectedEmployee || ''}
                                            onValueChange={setSelectedEmployee}
                                            required
                                        >
                                            <SelectTrigger>
                                                <SelectValue
                                                    placeholder={t(
                                                        'production_order_processing.create.select_employee',
                                                    )}
                                                />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {employees.map((employee) => (
                                                    <SelectItem
                                                        key={employee.uuid}
                                                        value={employee.uuid}
                                                    >
                                                        {employee.surname}{' '}
                                                        {employee.name} (
                                                        {
                                                            employee.matriculation_number
                                                        }
                                                        )
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <InputError
                                            message={allErrors.employee_uuid}
                                        />
                                    </div>

                                    {/* Ordine */}
                                    <div className="grid gap-2">
                                        <FormLabel
                                            htmlFor="order_uuid"
                                            required
                                        >
                                            {t('common.order')}
                                        </FormLabel>
                                        <Select
                                            name="order_uuid"
                                            value={selectedOrder || ''}
                                            onValueChange={setSelectedOrder}
                                            required
                                        >
                                            <SelectTrigger>
                                                <SelectValue
                                                    placeholder={t(
                                                        'production_order_processing.create.select_order',
                                                    )}
                                                />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {orders.map((order) => (
                                                    <SelectItem
                                                        key={order.uuid}
                                                        value={order.uuid}
                                                    >
                                                        {
                                                            order.order_production_number
                                                        }
                                                        {order.article_descr &&
                                                            ` - ${order.article_descr}`}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <InputError
                                            message={allErrors.order_uuid}
                                        />
                                    </div>

                                    {/* Quantity */}
                                    <div className="grid gap-2">
                                        <FormLabel htmlFor="quantity" required>
                                            {t(
                                                'production_order_processing.quantity_header',
                                            )}
                                        </FormLabel>
                                        <Input
                                            id="quantity"
                                            name="quantity"
                                            type="number"
                                            step="0.01"
                                            min="0.01"
                                            value={quantity}
                                            onChange={(e) =>
                                                setQuantity(e.target.value)
                                            }
                                            placeholder={t(
                                                'production_order_processing.create.quantity_placeholder',
                                            )}
                                            required
                                        />
                                        <InputError
                                            message={allErrors.quantity}
                                        />
                                    </div>

                                    {/* Processing Date and Time */}
                                    <div className="grid gap-2">
                                        <FormLabel
                                            htmlFor="processed_datetime"
                                            required
                                        >
                                            {t(
                                                'production_order_processing.date_time_header',
                                            )}
                                        </FormLabel>
                                        <Input
                                            id="processed_datetime"
                                            name="processed_datetime"
                                            type="datetime-local"
                                            value={processedDatetime}
                                            onChange={(e) =>
                                                setProcessedDatetime(
                                                    e.target.value,
                                                )
                                            }
                                            required
                                        />
                                        <InputError
                                            message={
                                                allErrors.processed_datetime
                                            }
                                        />
                                    </div>

                                    {/* Pulsanti */}
                                    <div className="flex justify-end gap-3 pt-4">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() =>
                                                setShowCloseConfirm(true)
                                            }
                                        >
                                            {t('common.cancel')}
                                        </Button>
                                        <Button type="submit">
                                            {t('common.save')}
                                        </Button>
                                    </div>
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
                    router.visit(productionOrderProcessing.index().url);
                }}
                title={t(
                    'production_order_processing.create.close_confirm_title',
                )}
                description={t(
                    'production_order_processing.create.close_confirm_description',
                )}
            />
        </AppLayout>
    );
}
