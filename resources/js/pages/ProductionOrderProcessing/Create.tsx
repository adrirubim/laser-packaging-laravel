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
    const [selectedEmployee, setSelectedEmployee] = useState<string>('');
    const [selectedOrder, setSelectedOrder] = useState<string>('');
    const [quantity, setQuantity] = useState<string>('');
    const [processedDatetime, setProcessedDatetime] = useState<string>('');

    // Formattare data/ora attuale per input datetime-local
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

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Avanzamenti Di Produzione',
            href: productionOrderProcessing.index().url,
        },
        {
            title: 'Crea',
            href: '#',
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Crea Lavorazione Ordine" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">
                            Crea Lavorazione Ordine
                        </h1>
                        <p className="text-muted-foreground">
                            Registra una nuova lavorazione di ordine
                        </p>
                    </div>
                    <Button
                        variant="outline"
                        onClick={() =>
                            router.visit(productionOrderProcessing.index().url)
                        }
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Indietro
                    </Button>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Dettagli Lavorazione</CardTitle>
                        <CardDescription>
                            Compila i campi per registrare una nuova lavorazione
                            di ordine
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Form
                            action={productionOrderProcessing.store().url}
                            method="post"
                            className="space-y-6"
                        >
                            {/* Dipendente */}
                            <div className="grid gap-2">
                                <FormLabel htmlFor="employee_uuid" required>
                                    Dipendente
                                </FormLabel>
                                <Select
                                    name="employee_uuid"
                                    value={selectedEmployee || ''}
                                    onValueChange={setSelectedEmployee}
                                    required
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Seleziona il dipendente..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {employees.map((employee) => (
                                            <SelectItem
                                                key={employee.uuid}
                                                value={employee.uuid}
                                            >
                                                {employee.surname}{' '}
                                                {employee.name} (
                                                {employee.matriculation_number})
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <InputError message={allErrors.employee_uuid} />
                            </div>

                            {/* Ordine */}
                            <div className="grid gap-2">
                                <FormLabel htmlFor="order_uuid" required>
                                    Ordine
                                </FormLabel>
                                <Select
                                    name="order_uuid"
                                    value={selectedOrder || ''}
                                    onValueChange={setSelectedOrder}
                                    required
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Seleziona l'ordine..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {orders.map((order) => (
                                            <SelectItem
                                                key={order.uuid}
                                                value={order.uuid}
                                            >
                                                {order.order_production_number}
                                                {order.article_descr &&
                                                    ` - ${order.article_descr}`}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <InputError message={allErrors.order_uuid} />
                            </div>

                            {/* Quantità */}
                            <div className="grid gap-2">
                                <FormLabel htmlFor="quantity" required>
                                    Quantità
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
                                    placeholder="Inserisci la quantità lavorata"
                                    required
                                />
                                <InputError message={allErrors.quantity} />
                            </div>

                            {/* Data e Ora Lavorazione */}
                            <div className="grid gap-2">
                                <FormLabel
                                    htmlFor="processed_datetime"
                                    required
                                >
                                    Data e Ora Lavorazione
                                </FormLabel>
                                <Input
                                    id="processed_datetime"
                                    name="processed_datetime"
                                    type="datetime-local"
                                    value={processedDatetime}
                                    onChange={(e) =>
                                        setProcessedDatetime(e.target.value)
                                    }
                                    required
                                />
                                <InputError
                                    message={allErrors.processed_datetime}
                                />
                            </div>

                            {/* Pulsanti */}
                            <div className="flex justify-end gap-3 pt-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() =>
                                        router.visit(
                                            productionOrderProcessing.index()
                                                .url,
                                        )
                                    }
                                >
                                    Annulla
                                </Button>
                                <Button type="submit">Salva</Button>
                            </div>
                        </Form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
