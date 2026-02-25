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
import lsResources from '@/routes/ls-resources/index';
import { type BreadcrumbItem } from '@/types';
import { Form, Head, router } from '@inertiajs/react';

type LsResource = {
    id: number;
    uuid: string;
    code: string;
    name: string;
};

type LsResourcesEditProps = {
    resource: LsResource;
    errors?: Record<string, string>;
};

export default function LsResourcesEdit({
    resource,
    errors: serverErrors,
}: LsResourcesEditProps) {
    const { t } = useTranslations();
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: t('nav.offers'),
            href: '/offers',
        },
        {
            title: t('offer_ls_resources.page_title'),
            href: lsResources.index().url,
        },
        {
            title: resource.name,
            href: lsResources.show({ lsResource: resource.uuid }).url,
        },
        {
            title: t('offer_ls_resources.edit.breadcrumb'),
            href: lsResources.edit({ lsResource: resource.uuid }).url,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head
                title={t('offer_ls_resources.edit.page_title', {
                    name: resource.name,
                })}
            />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex w-full justify-center">
                    <div className="w-full max-w-4xl space-y-5">
                        <Card>
                            <CardHeader>
                                <CardTitle>
                                    {t('offer_ls_resources.form.card_title')}
                                </CardTitle>
                                <CardDescription>
                                    {t(
                                        'offer_ls_resources.edit.card_description',
                                    )}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Form
                                    action={
                                        lsResources.update({
                                            lsResource: resource.uuid,
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
                                                            resource.uuid
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
                                                            resource.code
                                                        }
                                                        required
                                                        placeholder={t(
                                                            'offer_ls_resources.form.code_placeholder',
                                                        )}
                                                    />
                                                    <InputError
                                                        message={allErrors.code}
                                                    />
                                                </div>

                                                <div className="grid gap-2">
                                                    <Label htmlFor="name">
                                                        {t(
                                                            'offer_ls_resources.form.name_label',
                                                        )}
                                                    </Label>
                                                    <Input
                                                        id="name"
                                                        name="name"
                                                        defaultValue={
                                                            resource.name
                                                        }
                                                        placeholder={t(
                                                            'offer_ls_resources.form.name_placeholder',
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
                                                                  'offer_ls_resources.edit.submitting',
                                                              )
                                                            : t(
                                                                  'offer_ls_resources.edit.submit',
                                                              )}
                                                    </Button>
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        onClick={() =>
                                                            router.visit(
                                                                lsResources.show(
                                                                    {
                                                                        lsResource:
                                                                            resource.uuid,
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
