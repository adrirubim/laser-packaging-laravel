import { ConfirmCloseDialog } from '#app/components/confirm-close-dialog';
import { FormValidationNotification } from '#app/components/form-validation-notification';
import { FormLabel } from '#app/components/FormLabel';
import InputError from '#app/components/input-error';
import { Button } from '#app/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '#app/components/ui/card';
import { Input } from '#app/components/ui/input';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '#app/components/ui/tooltip';
import { useTranslations } from '#app/hooks/use-translations';
import AppLayout from '#app/layouts/app-layout';
import articles from '#app/routes/articles/index';
import { type BreadcrumbItem } from '#app/types';
import type { ApiResponse } from '#app/types/DomainModels';
import { Form, Head, router } from '@inertiajs/react';
import { HelpCircle } from 'lucide-react';
import { useEffect, useState } from 'react';

type PackagingInstructionsCreateProps = {
    errors?: Record<string, string>;
};

export default function PackagingInstructionsCreate({
    errors: serverErrors,
}: PackagingInstructionsCreateProps) {
    const { t } = useTranslations();
    const [icNumber, setIcNumber] = useState<string>('');
    const [isLoadingNumber, setIsLoadingNumber] = useState(false);
    const [showCloseConfirm, setShowCloseConfirm] = useState(false);

    useEffect(() => {
        queueMicrotask(() => setIsLoadingNumber(true));
        fetch(articles.packagingInstructions.generateIcNumber().url)
            .then(
                (res) => res.json() as Promise<ApiResponse<{ number: string }>>,
            )
            .then((data) => {
                if (
                    data.success === true &&
                    data.data != null &&
                    typeof data.data.number === 'string' &&
                    data.data.number !== ''
                ) {
                    setIcNumber(data.data.number);
                }
                setIsLoadingNumber(false);
            })
            .catch(() => setIsLoadingNumber(false));
    }, []);

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: t('nav.articles'),
            href: articles.index().url,
        },
        {
            title: t('articles.packaging_instructions.index.title'),
            href: articles.packagingInstructions.index().url,
        },
        {
            title: t('articles.packaging_instructions.create.breadcrumb'),
            href: articles.packagingInstructions.create().url,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head
                title={t('articles.packaging_instructions.create.page_title')}
            />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex w-full justify-center">
                    <div className="w-full max-w-4xl space-y-5">
                        <Card>
                            <CardHeader>
                                <CardTitle>
                                    {t(
                                        'articles.packaging_instructions.create.card_title',
                                    )}
                                </CardTitle>
                                <CardDescription>
                                    {t(
                                        'articles.packaging_instructions.create.card_description',
                                    )}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Form
                                    action={
                                        articles.packagingInstructions.store()
                                            .url
                                    }
                                    method="post"
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
                                                    <div className="flex items-center gap-2">
                                                        <FormLabel
                                                            htmlFor="code"
                                                            required
                                                        >
                                                            {t(
                                                                'articles.packaging_instructions.form.code_label',
                                                            )}
                                                        </FormLabel>
                                                        <Tooltip>
                                                            <TooltipTrigger
                                                                asChild
                                                            >
                                                                <HelpCircle className="h-4 w-4 cursor-help text-muted-foreground" />
                                                            </TooltipTrigger>
                                                            <TooltipContent>
                                                                <p>
                                                                    {t(
                                                                        'articles.packaging_instructions.form.code_tooltip',
                                                                    )}
                                                                </p>
                                                            </TooltipContent>
                                                        </Tooltip>
                                                    </div>
                                                    <Input
                                                        id="code"
                                                        name="code"
                                                        required
                                                        placeholder="IC"
                                                        defaultValue="IC"
                                                        maxLength={255}
                                                    />
                                                    <InputError
                                                        message={allErrors.code}
                                                    />
                                                </div>

                                                <div className="grid gap-2">
                                                    <div className="flex items-center gap-2">
                                                        <FormLabel
                                                            htmlFor="number"
                                                            required
                                                        >
                                                            {t(
                                                                'articles.packaging_instructions.form.number_label',
                                                            )}
                                                        </FormLabel>
                                                        <Tooltip>
                                                            <TooltipTrigger
                                                                asChild
                                                            >
                                                                <HelpCircle className="h-4 w-4 cursor-help text-muted-foreground" />
                                                            </TooltipTrigger>
                                                            <TooltipContent>
                                                                <p>
                                                                    {t(
                                                                        'articles.packaging_instructions.form.number_tooltip',
                                                                    )}
                                                                </p>
                                                            </TooltipContent>
                                                        </Tooltip>
                                                    </div>
                                                    <Input
                                                        id="number"
                                                        name="number"
                                                        required
                                                        placeholder="0001"
                                                        value={icNumber}
                                                        onChange={(e) =>
                                                            setIcNumber(
                                                                e.target.value,
                                                            )
                                                        }
                                                        maxLength={255}
                                                        disabled={
                                                            isLoadingNumber
                                                        }
                                                    />
                                                    {isLoadingNumber && (
                                                        <p className="text-xs text-muted-foreground">
                                                            {t(
                                                                'articles.packaging_instructions.form.generating_number',
                                                            )}
                                                        </p>
                                                    )}
                                                    <InputError
                                                        message={
                                                            allErrors.number
                                                        }
                                                    />
                                                </div>

                                                <div className="grid gap-2">
                                                    <FormLabel htmlFor="filename">
                                                        {t(
                                                            'articles.packaging_instructions.form.attachment_label',
                                                        )}
                                                    </FormLabel>
                                                    <Input
                                                        id="filename"
                                                        name="filename"
                                                        type="file"
                                                        accept="application/pdf"
                                                        className="cursor-pointer"
                                                        aria-describedby="filename-help"
                                                    />
                                                    <p
                                                        id="filename-help"
                                                        className="text-xs text-muted-foreground"
                                                    >
                                                        {t(
                                                            'articles.packaging_instructions.form.attachment_help',
                                                        )}
                                                    </p>
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
                                                                  'articles.packaging_instructions.create.submitting',
                                                              )
                                                            : t(
                                                                  'articles.packaging_instructions.create.submit',
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
                    router.visit(articles.packagingInstructions.index().url);
                }}
            />
        </AppLayout>
    );
}
