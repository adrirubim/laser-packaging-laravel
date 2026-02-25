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
import articleCategories from '@/routes/article-categories/index';
import { type BreadcrumbItem } from '@/types';
import { Form, Head, router } from '@inertiajs/react';

type ArticleCategoriesCreateProps = {
    errors?: Record<string, string>;
};

export default function ArticleCategoriesCreate({
    errors: serverErrors,
}: ArticleCategoriesCreateProps) {
    const { t } = useTranslations();

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: t('article_categories.breadcrumb'),
            href: articleCategories.index().url,
        },
        {
            title: t('article_categories.create.breadcrumb'),
            href: articleCategories.create().url,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('article_categories.create.page_title')} />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex w-full justify-center">
                    <div className="w-full max-w-4xl space-y-5">
                        <Card>
                            <CardHeader>
                                <CardTitle>
                                    {t('article_categories.create.card_title')}
                                </CardTitle>
                                <CardDescription>
                                    {t(
                                        'article_categories.create.card_description',
                                    )}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Form
                                    action={articleCategories.store().url}
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
                                                    <FormLabel
                                                        htmlFor="name"
                                                        required
                                                    >
                                                        {t(
                                                            'article_categories.form.name_label',
                                                        )}
                                                    </FormLabel>
                                                    <Input
                                                        id="name"
                                                        name="name"
                                                        required
                                                        placeholder={t(
                                                            'article_categories.form.name_placeholder',
                                                        )}
                                                        maxLength={255}
                                                        aria-describedby="name-help"
                                                    />
                                                    <p
                                                        id="name-help"
                                                        className="text-xs text-muted-foreground"
                                                    >
                                                        {t(
                                                            'article_categories.form.name_help',
                                                        )}
                                                    </p>
                                                    <InputError
                                                        message={allErrors.name}
                                                    />
                                                </div>

                                                <div className="flex items-center justify-end gap-3 pt-4">
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        onClick={() =>
                                                            router.visit(
                                                                articleCategories.index()
                                                                    .url,
                                                            )
                                                        }
                                                        disabled={processing}
                                                    >
                                                        {t('common.cancel')}
                                                    </Button>
                                                    <Button
                                                        type="submit"
                                                        disabled={processing}
                                                    >
                                                        {processing
                                                            ? t(
                                                                  'article_categories.create.submitting',
                                                              )
                                                            : t(
                                                                  'article_categories.create.submit',
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
