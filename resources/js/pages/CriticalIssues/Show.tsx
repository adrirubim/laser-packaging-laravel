import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
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
import criticalIssues from '@/routes/critical-issues/index';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { AlertTriangle, Edit, Package, Trash2 } from 'lucide-react';
import { useState } from 'react';

type Article = {
    id: number;
    uuid: string;
    cod_article_las: string;
    article_descr?: string | null;
};

type CriticalIssue = {
    id: number;
    uuid: string;
    name: string;
    articles?: Article[];
};

type CriticalIssuesShowProps = {
    criticalIssue: CriticalIssue;
};

export default function CriticalIssuesShow({
    criticalIssue,
}: CriticalIssuesShowProps) {
    const { t } = useTranslations();
    const [isDeleting, setIsDeleting] = useState(false);

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
    ];

    const handleDelete = () => {
        setIsDeleting(true);
        router.delete(
            criticalIssues.destroy({ criticalIssue: criticalIssue.uuid }).url,
            {
                onSuccess: () => {
                    router.visit(criticalIssues.index().url);
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
                title={t('critical_issues.show.page_title', {
                    name: criticalIssue.name,
                })}
            />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between gap-3">
                    <div>
                        <h1 className="flex items-center gap-2 text-2xl font-semibold tracking-tight">
                            <AlertTriangle className="h-6 w-6" />
                            {criticalIssue.name}
                        </h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            {t('critical_issues.show.subtitle')}
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Link
                            href={
                                criticalIssues.edit({
                                    criticalIssue: criticalIssue.uuid,
                                }).url
                            }
                        >
                            <Button variant="outline" size="sm">
                                <Edit className="mr-2 h-4 w-4" />
                                {t('common.edit')}
                            </Button>
                        </Link>
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button
                                    variant="destructive"
                                    size="sm"
                                    disabled={isDeleting}
                                >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    {isDeleting
                                        ? t('common.deleting')
                                        : t('common.delete')}
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>
                                        {t('critical_issues.show.delete_title')}
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                        {t(
                                            'critical_issues.show.delete_description',
                                            { name: criticalIssue.name },
                                        )}
                                        {criticalIssue.articles &&
                                            criticalIssue.articles.length >
                                                0 && (
                                                <span className="mt-2 block text-amber-600 dark:text-amber-400">
                                                    {t(
                                                        'critical_issues.show.delete_warning_articles',
                                                        {
                                                            count: criticalIssue
                                                                .articles
                                                                .length,
                                                        },
                                                    )}
                                                </span>
                                            )}
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>
                                        {t('common.cancel')}
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                        onClick={handleDelete}
                                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                        disabled={isDeleting}
                                    >
                                        {isDeleting
                                            ? t('common.deleting')
                                            : t('common.delete')}
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>
                                {t('critical_issues.show.details_title')}
                            </CardTitle>
                            <CardDescription>
                                {t('critical_issues.show.details_subtitle')}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-2">
                                <Label className="text-xs text-muted-foreground">
                                    {t('critical_issues.show.fields.id')}
                                </Label>
                                <div className="font-mono text-sm">
                                    {criticalIssue.id}
                                </div>
                            </div>
                            <div className="grid gap-2">
                                <Label className="text-xs text-muted-foreground">
                                    {t('critical_issues.show.fields.uuid')}
                                </Label>
                                <div className="font-mono text-sm break-all">
                                    {criticalIssue.uuid}
                                </div>
                            </div>
                            <div className="grid gap-2">
                                <Label className="text-xs text-muted-foreground">
                                    {t('critical_issues.show.fields.name')}
                                </Label>
                                <div className="text-sm font-medium">
                                    {criticalIssue.name}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {criticalIssue.articles &&
                        criticalIssue.articles.length > 0 && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>
                                        {t(
                                            'critical_issues.show.articles_title',
                                        )}
                                    </CardTitle>
                                    <CardDescription>
                                        {t(
                                            'critical_issues.show.articles_count',
                                            {
                                                count: criticalIssue.articles
                                                    .length,
                                            },
                                        )}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="max-h-[300px] space-y-2 overflow-y-auto">
                                        {criticalIssue.articles.map(
                                            (article) => (
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
                                            ),
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                </div>
            </div>
        </AppLayout>
    );
}
