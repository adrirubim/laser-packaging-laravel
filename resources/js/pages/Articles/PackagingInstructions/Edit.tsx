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
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { useTranslations } from '@/hooks/use-translations';
import AppLayout from '@/layouts/app-layout';
import articles from '@/routes/articles/index';
import { type BreadcrumbItem } from '@/types';
import { Form, Head, router, usePage } from '@inertiajs/react';
import { HelpCircle } from 'lucide-react';
import { useState } from 'react';

type PackagingInstruction = {
    uuid: string;
    code: string;
    number?: string | null;
    filename?: string | null;
};

type PackagingInstructionsEditProps = {
    instruction: PackagingInstruction;
    errors?: Record<string, string>;
};

export default function PackagingInstructionsEdit({
    errors: serverErrors,
}: PackagingInstructionsEditProps) {
    const { t } = useTranslations();
    const { props } = usePage<PackagingInstructionsEditProps>();
    const { instruction } = props;
    const [selectedFileName, setSelectedFileName] = useState<string | null>(
        null,
    );
    const [showCloseConfirm, setShowCloseConfirm] = useState(false);
    const instructionCode = instruction.code + (instruction.number || '');

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
            title: instructionCode,
            href: articles.packagingInstructions.show({
                packagingInstruction: instruction.uuid,
            }).url,
        },
        {
            title: t('articles.packaging_instructions.edit.breadcrumb'),
            href: articles.packagingInstructions.edit({
                packagingInstruction: instruction.uuid,
            }).url,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head
                title={t('articles.packaging_instructions.edit.page_title', {
                    code: instructionCode,
                })}
            />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex w-full justify-center">
                    <div className="w-full max-w-4xl space-y-5">
                        <Card>
                            <CardHeader>
                                <CardTitle>
                                    {t(
                                        'articles.packaging_instructions.edit.card_title',
                                    )}
                                </CardTitle>
                                <CardDescription>
                                    {t(
                                        'articles.packaging_instructions.edit.card_description',
                                    )}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Form
                                    action={
                                        articles.packagingInstructions.update({
                                            packagingInstruction:
                                                instruction.uuid,
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
                                                        defaultValue={
                                                            instruction.code
                                                        }
                                                        maxLength={255}
                                                    />
                                                    <InputError
                                                        message={allErrors.code}
                                                    />
                                                </div>

                                                <div className="grid gap-2">
                                                    <div className="flex items-center gap-2">
                                                        <FormLabel htmlFor="number">
                                                            {t(
                                                                'articles.packaging_instructions.form.number_label',
                                                            )}
                                                        </FormLabel>
                                                    </div>
                                                    <Input
                                                        id="number"
                                                        name="number"
                                                        defaultValue={
                                                            instruction.number ??
                                                            ''
                                                        }
                                                        maxLength={255}
                                                    />
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
                                                    {instruction.filename && (
                                                        <div className="mb-2 rounded-md bg-muted p-2">
                                                            <p className="mb-1 text-xs text-muted-foreground">
                                                                {t(
                                                                    'articles.packaging_instructions.edit.current_attachment',
                                                                )}
                                                            </p>
                                                            <p className="font-mono text-sm">
                                                                {
                                                                    instruction.filename
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
                                                        {instruction.filename
                                                            ? t(
                                                                  'articles.packaging_instructions.edit.attachment_replace_help',
                                                              )
                                                            : t(
                                                                  'articles.packaging_instructions.edit.attachment_help',
                                                              )}
                                                    </p>
                                                    {selectedFileName && (
                                                        <p className="text-xs text-muted-foreground">
                                                            {t(
                                                                'articles.packaging_instructions.edit.new_attachment_selected',
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
                                                                  'articles.packaging_instructions.edit.submitting',
                                                              )
                                                            : t(
                                                                  'articles.packaging_instructions.edit.submit',
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
                        articles.packagingInstructions.show({
                            packagingInstruction: instruction.uuid,
                        }).url,
                    );
                }}
            />
        </AppLayout>
    );
}
