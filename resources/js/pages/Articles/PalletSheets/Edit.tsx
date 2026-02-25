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
import { useTranslations } from '@/hooks/use-translations';
import AppLayout from '@/layouts/app-layout';
import articles from '@/routes/articles/index';
import { type BreadcrumbItem } from '@/types';
import { Form, Head, router } from '@inertiajs/react';
import { useState } from 'react';

type PalletSheet = {
    uuid: string;
    code: string;
    description?: string | null;
    filename?: string | null;
};

type PalletSheetsEditProps = {
    sheet: PalletSheet;
    errors?: Record<string, string>;
};

export default function PalletSheetsEdit({
    sheet: palletSheet,
    errors: serverErrors,
}: PalletSheetsEditProps) {
    const { t } = useTranslations();
    const [selectedFileName, setSelectedFileName] = useState<string | null>(
        null,
    );
    const [showCloseConfirm, setShowCloseConfirm] = useState(false);
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: t('nav.articles'),
            href: articles.index().url,
        },
        {
            title: t('articles.pallet_sheets.title'),
            href: articles.palletSheets.index().url,
        },
        {
            title: palletSheet.code,
            href: articles.palletSheets.show({ palletSheet: palletSheet.uuid })
                .url,
        },
        {
            title: t('articles.pallet_sheets.edit.breadcrumb'),
            href: articles.palletSheets.edit({ palletSheet: palletSheet.uuid })
                .url,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head
                title={t('articles.pallet_sheets.edit.page_title', {
                    code: palletSheet.code,
                })}
            />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex w-full justify-center">
                    <div className="w-full max-w-4xl space-y-5">
                        <Card>
                            <CardHeader>
                                <CardTitle>
                                    {t(
                                        'articles.pallet_sheets.edit.card_title',
                                    )}
                                </CardTitle>
                                <CardDescription>
                                    {t(
                                        'articles.pallet_sheets.edit.card_description',
                                    )}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Form
                                    action={
                                        articles.palletSheets.update({
                                            palletSheet: palletSheet.uuid,
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
                                        const hasAttemptedSubmit =
                                            Object.keys(allErrors).length > 0;

                                        return (
                                            <>
                                                <FormValidationNotification
                                                    errors={allErrors}
                                                    hasAttemptedSubmit={
                                                        hasAttemptedSubmit
                                                    }
                                                />
                                                <div className="grid gap-2">
                                                    <FormLabel
                                                        htmlFor="code"
                                                        required
                                                    >
                                                        {t(
                                                            'articles.pallet_sheets.form.code_label',
                                                        )}
                                                    </FormLabel>
                                                    <Input
                                                        id="code"
                                                        name="code"
                                                        required
                                                        defaultValue={
                                                            palletSheet.code
                                                        }
                                                        maxLength={255}
                                                    />
                                                    <InputError
                                                        message={allErrors.code}
                                                    />
                                                </div>

                                                <div className="grid gap-2">
                                                    <FormLabel
                                                        htmlFor="description"
                                                        required
                                                    >
                                                        {t(
                                                            'articles.pallet_sheets.form.description_label',
                                                        )}
                                                    </FormLabel>
                                                    <Input
                                                        id="description"
                                                        name="description"
                                                        required
                                                        defaultValue={
                                                            palletSheet.description ??
                                                            ''
                                                        }
                                                        maxLength={255}
                                                    />
                                                    <InputError
                                                        message={
                                                            allErrors.description
                                                        }
                                                    />
                                                </div>

                                                <div className="grid gap-2">
                                                    <FormLabel htmlFor="filename">
                                                        {t(
                                                            'articles.pallet_sheets.form.attachment_label',
                                                        )}
                                                    </FormLabel>
                                                    {palletSheet.filename && (
                                                        <div className="mb-2 rounded-md bg-muted p-2">
                                                            <p className="mb-1 text-xs text-muted-foreground">
                                                                {t(
                                                                    'articles.pallet_sheets.edit.current_attachment',
                                                                )}
                                                            </p>
                                                            <p className="font-mono text-sm">
                                                                {
                                                                    palletSheet.filename
                                                                }
                                                            </p>
                                                        </div>
                                                    )}
                                                    <Input
                                                        id="filename"
                                                        name="filename"
                                                        type="file"
                                                        accept="application/pdf"
                                                        className="cursor-pointer"
                                                        aria-describedby="filename-help"
                                                        onChange={(event) => {
                                                            const file =
                                                                event.target
                                                                    .files?.[0];
                                                            setSelectedFileName(
                                                                file
                                                                    ? file.name
                                                                    : null,
                                                            );
                                                        }}
                                                    />
                                                    <p
                                                        id="filename-help"
                                                        className="text-xs text-muted-foreground"
                                                    >
                                                        {palletSheet.filename
                                                            ? t(
                                                                  'articles.pallet_sheets.edit.attachment_replace_help',
                                                              )
                                                            : t(
                                                                  'articles.pallet_sheets.edit.attachment_help',
                                                              )}
                                                    </p>
                                                    {selectedFileName && (
                                                        <p className="text-xs text-muted-foreground">
                                                            {t(
                                                                'articles.pallet_sheets.edit.new_attachment_selected',
                                                            )}{' '}
                                                            <span className="font-mono">
                                                                {
                                                                    selectedFileName
                                                                }
                                                            </span>
                                                        </p>
                                                    )}
                                                    <InputError
                                                        message={
                                                            allErrors.filename
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
                                                                  'articles.pallet_sheets.edit.submitting',
                                                              )
                                                            : t(
                                                                  'articles.pallet_sheets.edit.submit',
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
                        articles.palletSheets.show({
                            palletSheet: palletSheet.uuid,
                        }).url,
                    );
                }}
            />
        </AppLayout>
    );
}
