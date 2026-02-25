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

type ArticleCategory = {
    id: number;
    uuid: string;
    name: string;
};

type ArticleCategoriesEditProps = {
    category: ArticleCategory;
    errors?: Record<string, string>;
};

export default function ArticleCategoriesEdit({
    category,
    errors: serverErrors,
}: ArticleCategoriesEditProps) {
    const { t } = useTranslations();

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: t('article_categories.breadcrumb'),
            href: articleCategories.index().url,
        },
        {
            title: category.name,
            href: articleCategories.show({ articleCategory: category.uuid })
                .url,
        },
        {
            title: t('article_categories.edit.breadcrumb'),
            href: articleCategories.edit({ articleCategory: category.uuid })
                .url,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head
                title={t('article_categories.edit.page_title', {
                    name: category.name,
                })}
            />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex w-full justify-center">
                    <div className="w-full max-w-4xl space-y-5">
                        <Card>
                            <CardHeader>
                                <CardTitle>
                                    {t('article_categories.edit.card_title')}
                                </CardTitle>
                                <CardDescription>
                                    {t(
                                        'article_categories.edit.card_description',
                                    )}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Form
                                    action={
                                        articleCategories.update({
                                            articleCategory: category.uuid,
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
                                                    <FormLabel htmlFor="uuid">
                                                        UUID
                                                    </FormLabel>
                                                    <Input
                                                        id="uuid"
                                                        name="uuid"
                                                        defaultValue={
                                                            category.uuid
                                                        }
                                                        readOnly
                                                        className="bg-muted"
                                                    />
                                                </div>

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
                                                        defaultValue={
                                                            category.name
                                                        }
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
                                                                articleCategories.show(
                                                                    {
                                                                        articleCategory:
                                                                            category.uuid,
                                                                    },
                                                                ).url,
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
                                                                  'article_categories.edit.submitting',
                                                              )
                                                            : t(
                                                                  'article_categories.edit.submit',
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
