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
import machineryRoutes from '@/routes/machinery/index';
import { type BreadcrumbItem } from '@/types';
import { Head, router, useForm, usePage } from '@inertiajs/react';

type ValueType = {
    uuid: string;
    id: number;
};

type Machinery = {
    id: number;
    uuid: string;
    cod: string;
    description: string;
    parameter?: string | null;
    value_type_uuid?: string | null;
    value_type?: ValueType | null;
};

type MachineryEditProps = {
    machinery: Machinery;
    valueTypes: ValueType[];
    errors?: Record<string, string>;
};

export default function MachineryEdit() {
    const { t } = useTranslations();
    const { props } = usePage<MachineryEditProps>();
    const { machinery, valueTypes = [], errors: serverErrors } = props;
    const form = useForm<{
        cod: string;
        description: string;
        parameter: string;
        value_type_uuid: string | null;
    }>({
        cod: machinery.cod,
        description: machinery.description,
        parameter: machinery.parameter ?? '',
        value_type_uuid: machinery.value_type_uuid ?? null,
    });

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: t('nav.macchinari'),
            href: machineryRoutes.index().url,
        },
        {
            title: machinery.cod,
            href: machineryRoutes.show({ machinery: machinery.uuid }).url,
        },
        {
            title: t('machinery.edit.breadcrumb'),
            href: machineryRoutes.edit({ machinery: machinery.uuid }).url,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head
                key="head"
                title={t('machinery.edit.page_title', {
                    code: machinery.cod,
                })}
            />

            <div
                key="main"
                className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4"
            >
                <div className="flex w-full justify-center">
                    <div className="w-full max-w-4xl space-y-5">
                        <Card>
                            <CardHeader>
                                <CardTitle>
                                    {t('machinery.edit.card_title')}
                                </CardTitle>
                                <CardDescription>
                                    {t('machinery.edit.card_description')}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form
                                    className="space-y-6"
                                    onSubmit={(e) => {
                                        e.preventDefault();
                                        form.put(
                                            machineryRoutes.update({
                                                machinery: machinery.uuid,
                                            }).url,
                                        );
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
                                                <div
                                                    key="cod"
                                                    className="grid gap-2"
                                                >
                                                    <FormLabel
                                                        htmlFor="cod"
                                                        required
                                                    >
                                                        {t('common.code')}
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
                                                    />
                                                    <InputError
                                                        message={allErrors.cod}
                                                    />
                                                </div>

                                                <div
                                                    key="description"
                                                    className="grid gap-2"
                                                >
                                                    <FormLabel
                                                        htmlFor="description"
                                                        required
                                                    >
                                                        {t(
                                                            'common.description',
                                                        )}
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
                                                    />
                                                    <InputError
                                                        message={
                                                            allErrors.description
                                                        }
                                                    />
                                                </div>

                                                <div
                                                    key="parameter"
                                                    className="grid gap-2"
                                                >
                                                    <FormLabel htmlFor="parameter">
                                                        {t(
                                                            'machinery.form.parameter_placeholder',
                                                        )}
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
                                                        placeholder={t(
                                                            'machinery.form.parameter_placeholder',
                                                        )}
                                                    />
                                                    <InputError
                                                        message={
                                                            allErrors.parameter
                                                        }
                                                    />
                                                </div>

                                                <div
                                                    key="value_type_uuid"
                                                    className="grid gap-2"
                                                >
                                                    <FormLabel htmlFor="value_type_uuid">
                                                        {t(
                                                            'machinery.form.value_type_label',
                                                        )}
                                                    </FormLabel>
                                                    <Select
                                                        name="value_type_uuid"
                                                        value={
                                                            formData.value_type_uuid ??
                                                            '__none'
                                                        }
                                                        onValueChange={(
                                                            value,
                                                        ) =>
                                                            form.setData(
                                                                'value_type_uuid',
                                                                value ===
                                                                    '__none'
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
                                                            {[
                                                                <SelectItem
                                                                    key="__none"
                                                                    value="__none"
                                                                >
                                                                    {t(
                                                                        'machinery.form.none',
                                                                    )}
                                                                </SelectItem>,
                                                                ...(
                                                                    valueTypes ??
                                                                    []
                                                                ).map((vt) => (
                                                                    <SelectItem
                                                                        key={
                                                                            vt.uuid
                                                                        }
                                                                        value={
                                                                            vt.uuid
                                                                        }
                                                                    >
                                                                        {`ID: ${vt.id}`}
                                                                    </SelectItem>
                                                                )),
                                                            ]}
                                                        </SelectContent>
                                                    </Select>
                                                    <InputError
                                                        message={
                                                            allErrors.value_type_uuid
                                                        }
                                                    />
                                                </div>

                                                <div
                                                    key="actions"
                                                    className="flex items-center gap-4"
                                                >
                                                    <Button
                                                        type="submit"
                                                        disabled={
                                                            form.processing
                                                        }
                                                    >
                                                        {form.processing
                                                            ? t(
                                                                  'machinery.edit.submitting',
                                                              )
                                                            : t(
                                                                  'machinery.edit.submit',
                                                              )}
                                                    </Button>
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        onClick={() =>
                                                            router.visit(
                                                                machineryRoutes.show(
                                                                    {
                                                                        machinery:
                                                                            machinery.uuid,
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
