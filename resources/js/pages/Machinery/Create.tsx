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
import articles from '@/routes/articles/index';
import machineryRoutes from '@/routes/machinery/index';
import { type BreadcrumbItem } from '@/types';
import { Head, router, useForm, usePage } from '@inertiajs/react';

type ValueType = {
    uuid: string;
    id: number;
};

type MachineryCreateProps = {
    valueTypes: ValueType[];
    errors?: Record<string, string>;
};

export default function MachineryCreate() {
    const { t } = useTranslations();
    const { props } = usePage<MachineryCreateProps>();
    const { valueTypes = [], errors: serverErrors } = props;
    const form = useForm<{
        cod: string;
        description: string;
        parameter: string;
        value_type_uuid: string | null;
    }>({
        cod: '',
        description: '',
        parameter: '',
        value_type_uuid: null,
    });

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: t('nav.articles'),
            href: articles.index().url,
        },
        {
            title: t('nav.macchinari'),
            href: machineryRoutes.index().url,
        },
        {
            title: t('common.new'),
            href: machineryRoutes.create().url,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Nuovo Macchinario" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex w-full justify-center">
                    <div className="w-full max-w-4xl space-y-5">
                        <Card>
                            <CardHeader>
                                <CardTitle>Nuovo Macchinario</CardTitle>
                                <CardDescription>
                                    Compila i dettagli per creare un nuovo
                                    macchinario
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form
                                    className="space-y-6"
                                    onSubmit={(e) => {
                                        e.preventDefault();
                                        form.post(machineryRoutes.store().url);
                                    }}
                                >
                                    {(() => {
                                        const allErrors = {
                                            ...form.errors,
                                            ...serverErrors,
                                        };
                                        const formData = form.data;

                                        return (
                                            <>
                                                <div className="grid gap-2">
                                                    <FormLabel
                                                        htmlFor="cod"
                                                        required
                                                    >
                                                        Codice
                                                    </FormLabel>
                                                    <Input
                                                        id="cod"
                                                        name="cod"
                                                        value={formData.cod}
                                                        onChange={(e) =>
                                                            form.setData(
                                                                'cod',
                                                                e.target.value,
                                                            )
                                                        }
                                                        required
                                                        placeholder="Codice macchinario"
                                                    />
                                                    <InputError
                                                        message={allErrors.cod}
                                                    />
                                                </div>

                                                <div className="grid gap-2">
                                                    <FormLabel
                                                        htmlFor="description"
                                                        required
                                                    >
                                                        Descrizione
                                                    </FormLabel>
                                                    <Input
                                                        id="description"
                                                        name="description"
                                                        value={
                                                            formData.description
                                                        }
                                                        onChange={(e) =>
                                                            form.setData(
                                                                'description',
                                                                e.target.value,
                                                            )
                                                        }
                                                        required
                                                        placeholder="Descrizione macchinario"
                                                    />
                                                    <InputError
                                                        message={
                                                            allErrors.description
                                                        }
                                                    />
                                                </div>

                                                <div className="grid gap-2">
                                                    <FormLabel htmlFor="parameter">
                                                        Parametro
                                                    </FormLabel>
                                                    <Input
                                                        id="parameter"
                                                        name="parameter"
                                                        value={
                                                            formData.parameter
                                                        }
                                                        onChange={(e) =>
                                                            form.setData(
                                                                'parameter',
                                                                e.target.value,
                                                            )
                                                        }
                                                        placeholder="Parametro"
                                                    />
                                                    <InputError
                                                        message={
                                                            allErrors.parameter
                                                        }
                                                    />
                                                </div>

                                                <div className="grid gap-2">
                                                    <FormLabel htmlFor="value_type_uuid">
                                                        Tipo Valore
                                                    </FormLabel>
                                                    <Select
                                                        name="value_type_uuid"
                                                        value={
                                                            formData.value_type_uuid ??
                                                            'none'
                                                        }
                                                        onValueChange={(
                                                            value,
                                                        ) =>
                                                            form.setData(
                                                                'value_type_uuid',
                                                                value === 'none'
                                                                    ? null
                                                                    : value,
                                                            )
                                                        }
                                                    >
                                                        <SelectTrigger>
                                                            <SelectValue
                                                                placeholder={t(
                                                                    'machinery.select_value_type',
                                                                )}
                                                            />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="none">
                                                                Nessuno
                                                            </SelectItem>
                                                            {valueTypes?.map(
                                                                (vt) => (
                                                                    <SelectItem
                                                                        key={
                                                                            vt.uuid
                                                                        }
                                                                        value={
                                                                            vt.uuid
                                                                        }
                                                                    >
                                                                        ID:{' '}
                                                                        {vt.id}
                                                                    </SelectItem>
                                                                ),
                                                            )}
                                                        </SelectContent>
                                                    </Select>
                                                    <InputError
                                                        message={
                                                            allErrors.value_type_uuid
                                                        }
                                                    />
                                                </div>

                                                <div className="flex items-center gap-4">
                                                    <Button
                                                        type="submit"
                                                        disabled={
                                                            form.processing
                                                        }
                                                    >
                                                        {form.processing
                                                            ? 'Creando...'
                                                            : 'Crea Macchinario'}
                                                    </Button>
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        onClick={() =>
                                                            router.visit(
                                                                machineryRoutes.index()
                                                                    .url,
                                                            )
                                                        }
                                                    >
                                                        Annulla
                                                    </Button>
                                                </div>
                                            </>
                                        );
                                    })()}
                                </form>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
