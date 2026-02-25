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
import { Label } from '@/components/ui/label';
import { useTranslations } from '@/hooks/use-translations';
import AppLayout from '@/layouts/app-layout';
import lasWorkLines from '@/routes/las-work-lines/index';
import { type BreadcrumbItem } from '@/types';
import { Form, Head, router } from '@inertiajs/react';

type LasWorkLine = {
    id: number;
    uuid: string;
    code: string;
    name: string;
};

type LasWorkLinesEditProps = {
    workLine: LasWorkLine;
    errors?: Record<string, string>;
};

export default function LasWorkLinesEdit({
    workLine,
    errors: serverErrors,
}: LasWorkLinesEditProps) {
    const { t } = useTranslations();
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: t('nav.offers'),
            href: '/offers',
        },
        {
            title: t('offer_las_work_lines.page_title'),
            href: lasWorkLines.index().url,
        },
        {
            title: workLine.name,
            href: lasWorkLines.show({ lasWorkLine: workLine.uuid }).url,
        },
        {
            title: t('offer_las_work_lines.edit.breadcrumb'),
            href: lasWorkLines.edit({ lasWorkLine: workLine.uuid }).url,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head
                title={t('offer_las_work_lines.edit.page_title', {
                    name: workLine.name,
                })}
            />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex w-full justify-center">
                    <div className="w-full max-w-4xl space-y-5">
                        <Card>
                            <CardHeader>
                                <CardTitle>
                                    {t('offer_las_work_lines.form.card_title')}
                                </CardTitle>
                                <CardDescription>
                                    {t(
                                        'offer_las_work_lines.edit.card_description',
                                    )}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Form
                                    action={
                                        lasWorkLines.update({
                                            lasWorkLine: workLine.uuid,
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
                                                    <Label htmlFor="uuid">
                                                        UUID
                                                    </Label>
                                                    <Input
                                                        id="uuid"
                                                        name="uuid"
                                                        defaultValue={
                                                            workLine.uuid
                                                        }
                                                        readOnly
                                                        className="bg-muted"
                                                    />
                                                </div>

                                                <div className="grid gap-2">
                                                    <Label htmlFor="code">
                                                        {t('common.code')} *
                                                    </Label>
                                                    <Input
                                                        id="code"
                                                        name="code"
                                                        defaultValue={
                                                            workLine.code
                                                        }
                                                        required
                                                        placeholder={t(
                                                            'offer_las_work_lines.form.code_placeholder',
                                                        )}
                                                    />
                                                    <InputError
                                                        message={allErrors.code}
                                                    />
                                                </div>

                                                <div className="grid gap-2">
                                                    <Label htmlFor="name">
                                                        {t(
                                                            'offer_las_work_lines.form.name_label',
                                                        )}{' '}
                                                        *
                                                    </Label>
                                                    <Input
                                                        id="name"
                                                        name="name"
                                                        defaultValue={
                                                            workLine.name
                                                        }
                                                        required
                                                        placeholder={t(
                                                            'offer_las_work_lines.form.name_placeholder',
                                                        )}
                                                    />
                                                    <InputError
                                                        message={allErrors.name}
                                                    />
                                                </div>

                                                <div className="flex items-center gap-4">
                                                    <Button
                                                        type="submit"
                                                        disabled={processing}
                                                    >
                                                        {processing
                                                            ? t(
                                                                  'offer_las_work_lines.edit.submitting',
                                                              )
                                                            : t(
                                                                  'offer_las_work_lines.edit.submit',
                                                              )}
                                                    </Button>
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        onClick={() =>
                                                            router.visit(
                                                                lasWorkLines.show(
                                                                    {
                                                                        lasWorkLine:
                                                                            workLine.uuid,
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
