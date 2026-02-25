import { ConfirmCloseDialog } from '@/components/confirm-close-dialog';
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
import criticalIssues from '@/routes/critical-issues/index';
import { type BreadcrumbItem } from '@/types';
import { Form, Head, router } from '@inertiajs/react';
import { useState } from 'react';

type CriticalIssue = {
    id: number;
    uuid: string;
    name: string;
};

type CriticalIssuesEditProps = {
    criticalIssue: CriticalIssue;
    errors?: Record<string, string>;
};

export default function CriticalIssuesEdit({
    criticalIssue,
    errors: serverErrors,
}: CriticalIssuesEditProps) {
    const { t } = useTranslations();
    const [showCloseConfirm, setShowCloseConfirm] = useState(false);
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: t('critical_issues.breadcrumb'),
            href: criticalIssues.index().url,
        },
        {
            title: criticalIssue.name,
            href: criticalIssues.show({ criticalIssue: criticalIssue.uuid })
                .url,
        },
        {
            title: t('critical_issues.edit.breadcrumb'),
            href: criticalIssues.edit({ criticalIssue: criticalIssue.uuid })
                .url,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head
                title={t('critical_issues.edit.page_title', {
                    name: criticalIssue.name,
                })}
            />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex w-full justify-center">
                    <div className="w-full max-w-4xl space-y-5">
                        <Card>
                            <CardHeader>
                                <CardTitle>
                                    {t('critical_issues.edit.card_title')}
                                </CardTitle>
                                <CardDescription>
                                    {t('critical_issues.edit.card_description')}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Form
                                    action={
                                        criticalIssues.update({
                                            criticalIssue: criticalIssue.uuid,
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
                                                        {t(
                                                            'critical_issues.show.fields.uuid',
                                                        )}
                                                    </Label>
                                                    <Input
                                                        id="uuid"
                                                        name="uuid"
                                                        defaultValue={
                                                            criticalIssue.uuid
                                                        }
                                                        readOnly
                                                        className="bg-muted"
                                                    />
                                                </div>

                                                <div className="grid gap-2">
                                                    <Label htmlFor="name">
                                                        {t(
                                                            'critical_issues.form.name_label',
                                                        )}
                                                    </Label>
                                                    <Input
                                                        id="name"
                                                        name="name"
                                                        required
                                                        defaultValue={
                                                            criticalIssue.name
                                                        }
                                                        placeholder={t(
                                                            'critical_issues.form.name_placeholder',
                                                        )}
                                                        maxLength={255}
                                                        aria-describedby="name-help"
                                                    />
                                                    <p
                                                        id="name-help"
                                                        className="text-xs text-muted-foreground"
                                                    >
                                                        {t(
                                                            'critical_issues.form.name_help',
                                                        )}
                                                    </p>
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
                                                                  'critical_issues.edit.submitting',
                                                              )
                                                            : t(
                                                                  'critical_issues.edit.submit',
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
                    router.visit(
                        criticalIssues.show({
                            criticalIssue: criticalIssue.uuid,
                        }).url,
                    );
                }}
            />
        </AppLayout>
    );
}
