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
import { Form, Head, router } from '@inertiajs/react';
import { HelpCircle } from 'lucide-react';
import { useEffect, useState } from 'react';

type OperationalInstructionsCreateProps = {
    errors?: Record<string, string>;
};

export default function OperationalInstructionsCreate({
    errors: serverErrors,
}: OperationalInstructionsCreateProps) {
    const { t } = useTranslations();
    const [ioNumber, setIoNumber] = useState<string>('');
    const [isLoadingNumber, setIsLoadingNumber] = useState(false);

    useEffect(() => {
        queueMicrotask(() => setIsLoadingNumber(true));
        fetch('/articles/operational-instructions/generate-io-number')
            .then((res) => res.json())
            .then((data) => {
                if (data.number) {
                    setIoNumber(data.number);
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
            title: t('nav.istruzioni_operative'),
            href: articles.operationalInstructions.index().url,
        },
        {
            title: t('operational_instructions.create.breadcrumb'),
            href: articles.operationalInstructions.create().url,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('operational_instructions.create.head_title')} />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex w-full justify-center">
                    <div className="w-full max-w-4xl space-y-5">
                        <Card>
                            <CardHeader>
                                <CardTitle>
                                    {t('operational_instructions.create.title')}
                                </CardTitle>
                                <CardDescription>
                                    {t(
                                        'operational_instructions.create.description',
                                    )}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Form
                                    action={
                                        articles.operationalInstructions.store()
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

                                        return (
                                            <>
                                                <div className="grid gap-2">
                                                    <div className="flex items-center gap-2">
                                                        <FormLabel
                                                            htmlFor="code"
                                                            required
                                                        >
                                                            {t(
                                                                'operational_instructions.form.code',
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
                                                                        'operational_instructions.form.code_tooltip',
                                                                    )}
                                                                </p>
                                                            </TooltipContent>
                                                        </Tooltip>
                                                    </div>
                                                    <Input
                                                        id="code"
                                                        name="code"
                                                        required
                                                        placeholder="IO"
                                                        defaultValue="IO"
                                                        maxLength={255}
                                                        aria-label={t(
                                                            'operational_instructions.form.code',
                                                        )}
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
                                                                'operational_instructions.form.number',
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
                                                                        'operational_instructions.form.number_tooltip',
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
                                                        value={ioNumber}
                                                        onChange={(e) =>
                                                            setIoNumber(
                                                                e.target.value,
                                                            )
                                                        }
                                                        maxLength={255}
                                                        disabled={
                                                            isLoadingNumber
                                                        }
                                                        aria-label={t(
                                                            'operational_instructions.form.number',
                                                        )}
                                                    />
                                                    {isLoadingNumber && (
                                                        <p className="text-xs text-muted-foreground">
                                                            {t(
                                                                'operational_instructions.form.generating_number',
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
                                                            'operational_instructions.form.attachment',
                                                        )}
                                                    </FormLabel>
                                                    <Input
                                                        id="filename"
                                                        name="filename"
                                                        type="file"
                                                        accept="application/pdf"
                                                        className="cursor-pointer"
                                                        aria-describedby="filename-help"
                                                        aria-label={t(
                                                            'operational_instructions.form.attachment',
                                                        )}
                                                    />
                                                    <p
                                                        id="filename-help"
                                                        className="text-xs text-muted-foreground"
                                                    >
                                                        {t(
                                                            'operational_instructions.form.attachment_help',
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
                                                                  'operational_instructions.create.submitting',
                                                              )
                                                            : t(
                                                                  'operational_instructions.create.submit',
                                                              )}
                                                    </Button>
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        onClick={() =>
                                                            router.visit(
                                                                articles.operationalInstructions.index()
                                                                    .url,
                                                            )
                                                        }
                                                    >
                                                        {t(
                                                            'operational_instructions.cancel',
                                                        )}
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
