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

type CQModelsCreateProps = {
    errors?: Record<string, string>;
};

export default function CQModelsCreate({
    errors: serverErrors,
}: CQModelsCreateProps) {
    const { t } = useTranslations();
    const [cquCode, setCquCode] = useState<string>('');
    const [isLoadingCode, setIsLoadingCode] = useState(false);

    useEffect(() => {
        queueMicrotask(() => setIsLoadingCode(true));
        fetch(articles.cqModels.generateCquNumber().url)
            .then((res) => res.json())
            .then((data) => {
                if (data.cod_model) {
                    setCquCode(data.cod_model);
                }
                setIsLoadingCode(false);
            })
            .catch(() => setIsLoadingCode(false));
    }, []);

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: t('nav.articles'),
            href: articles.index().url,
        },
        {
            title: t('articles.cq_models.title'),
            href: articles.cqModels.index().url,
        },
        {
            title: t('articles.cq_models.create.breadcrumb'),
            href: articles.cqModels.create().url,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('articles.cq_models.create.page_title')} />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex w-full justify-center">
                    <div className="w-full max-w-4xl space-y-5">
                        <Card>
                            <CardHeader>
                                <CardTitle>
                                    {t('articles.cq_models.create.card_title')}
                                </CardTitle>
                                <CardDescription>
                                    {t(
                                        'articles.cq_models.create.card_description',
                                    )}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Form
                                    action={articles.cqModels.store().url}
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
                                                            htmlFor="cod_model"
                                                            required
                                                        >
                                                            {t(
                                                                'articles.cq_models.form.cod_model_label',
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
                                                                        'articles.cq_models.form.cod_model_tooltip',
                                                                    )}
                                                                </p>
                                                            </TooltipContent>
                                                        </Tooltip>
                                                    </div>
                                                    <Input
                                                        id="cod_model"
                                                        name="cod_model"
                                                        required
                                                        placeholder="CQU001"
                                                        value={cquCode}
                                                        onChange={(e) =>
                                                            setCquCode(
                                                                e.target.value,
                                                            )
                                                        }
                                                        maxLength={255}
                                                        disabled={isLoadingCode}
                                                    />
                                                    {isLoadingCode && (
                                                        <p className="text-xs text-muted-foreground">
                                                            {t(
                                                                'articles.cq_models.form.generating_code',
                                                            )}
                                                        </p>
                                                    )}
                                                    <p className="text-xs text-muted-foreground">
                                                        {t(
                                                            'articles.cq_models.form.cod_model_tooltip',
                                                        )}
                                                    </p>
                                                    <InputError
                                                        message={
                                                            allErrors.cod_model
                                                        }
                                                    />
                                                </div>

                                                <div className="grid gap-2">
                                                    <FormLabel
                                                        htmlFor="description_model"
                                                        required
                                                    >
                                                        {t(
                                                            'articles.cq_models.form.description_model_label',
                                                        )}
                                                    </FormLabel>
                                                    <Input
                                                        id="description_model"
                                                        name="description_model"
                                                        required
                                                        placeholder={t(
                                                            'articles.cq_models.form.description_model_placeholder',
                                                        )}
                                                        maxLength={255}
                                                    />
                                                    <InputError
                                                        message={
                                                            allErrors.description_model
                                                        }
                                                    />
                                                </div>

                                                <div className="grid gap-2">
                                                    <FormLabel htmlFor="filename">
                                                        {t(
                                                            'articles.cq_models.form.attachment_label',
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
                                                            'articles.cq_models.form.attachment_help',
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
                                                                  'articles.cq_models.create.submitting',
                                                              )
                                                            : t(
                                                                  'articles.cq_models.create.submit',
                                                              )}
                                                    </Button>
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        onClick={() =>
                                                            router.visit(
                                                                articles.cqModels.index()
                                                                    .url,
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
