import ConfirmDeleteDialog from '@/components/confirm-delete-dialog';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useTranslations } from '@/hooks/use-translations';
import AppLayout from '@/layouts/app-layout';
import articleCategories from '@/routes/article-categories/index';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Edit, Package, Tag, Trash2 } from 'lucide-react';
import { useState } from 'react';

type Article = {
    id: number;
    uuid: string;
    cod_article_las: string;
    article_descr?: string | null;
};

type ArticleCategory = {
    id: number;
    uuid: string;
    name: string;
    articles?: Article[];
};

type ArticleCategoriesShowProps = {
    category: ArticleCategory;
};

export default function ArticleCategoriesShow({
    category,
}: ArticleCategoriesShowProps) {
    const { t } = useTranslations();

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

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
    ];

    const handleDelete = () => {
        setIsDeleting(true);
        router.delete(
            articleCategories.destroy({ articleCategory: category.uuid }).url,
            {
                onSuccess: () => {
                    setDeleteDialogOpen(false);
                    router.visit(articleCategories.index().url);
                },
                onFinish: () => {
                    setIsDeleting(false);
                },
            },
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head
                title={t('article_categories.show.page_title', {
                    name: category.name,
                })}
            />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between gap-3">
                    <div>
                        <h1 className="flex items-center gap-2 text-2xl font-semibold tracking-tight">
                            <Tag className="h-6 w-6" />
                            {category.name}
                        </h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            {t('article_categories.show.subtitle')}
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button asChild variant="outline">
                            <Link
                                href={
                                    articleCategories.edit({
                                        articleCategory: category.uuid,
                                    }).url
                                }
                            >
                                <Edit className="mr-2 h-4 w-4" />
                                {t('common.edit')}
                            </Link>
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={() => setDeleteDialogOpen(true)}
                            disabled={isDeleting}
                        >
                            <Trash2 className="mr-2 h-4 w-4" />
                            {t('common.delete')}
                        </Button>
                    </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>
                                {t('article_categories.show.details_title')}
                            </CardTitle>
                            <CardDescription>
                                {t('article_categories.show.details_subtitle')}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-2">
                                <Label className="text-xs text-muted-foreground">
                                    {t('article_categories.show.fields.id')}
                                </Label>
                                <div className="font-mono text-sm">
                                    {category.id}
                                </div>
                            </div>
                            <div className="grid gap-2">
                                <Label className="text-xs text-muted-foreground">
                                    {t('article_categories.show.fields.uuid')}
                                </Label>
                                <div className="font-mono text-sm break-all">
                                    {category.uuid}
                                </div>
                            </div>
                            <div className="grid gap-2">
                                <Label className="text-xs text-muted-foreground">
                                    {t('article_categories.show.fields.name')}
                                </Label>
                                <div className="text-sm font-medium">
                                    {category.name}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {category.articles && category.articles.length > 0 && (
                        <Card>
                            <CardHeader>
                                <CardTitle>
                                    {t(
                                        'article_categories.show.articles_title',
                                    )}
                                </CardTitle>
                                <CardDescription>
                                    {t(
                                        'article_categories.show.articles_count',
                                        { count: category.articles.length },
                                    )}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="max-h-[300px] space-y-2 overflow-y-auto">
                                    {category.articles.map((article) => (
                                        <div
                                            key={article.id}
                                            className="flex items-center justify-between rounded-md border border-sidebar-border/70 p-2 transition-colors hover:bg-muted/40"
                                        >
                                            <div className="flex min-w-0 flex-1 items-center gap-2">
                                                <Package className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
                                                <div className="min-w-0 flex-1">
                                                    <div className="truncate text-sm font-medium">
                                                        {
                                                            article.cod_article_las
                                                        }
                                                    </div>
                                                    {article.article_descr && (
                                                        <div className="truncate text-xs text-muted-foreground">
                                                            {
                                                                article.article_descr
                                                            }
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>

                <ConfirmDeleteDialog
                    open={deleteDialogOpen}
                    onOpenChange={setDeleteDialogOpen}
                    onConfirm={handleDelete}
                    title={t('article_categories.delete.title')}
                    description={t('article_categories.delete.description')}
                    itemName={category.name}
                    isLoading={isDeleting}
                />
            </div>
        </AppLayout>
    );
}
