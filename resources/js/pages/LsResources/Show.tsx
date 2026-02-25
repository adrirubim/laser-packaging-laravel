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
import lsResources from '@/routes/ls-resources/index';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Edit, Trash2 } from 'lucide-react';
import { useState } from 'react';

type LsResource = {
    id: number;
    uuid: string;
    code: string;
    name: string;
};

type LsResourcesShowProps = {
    resource: LsResource;
};

export default function LsResourcesShow({ resource }: LsResourcesShowProps) {
    const { t } = useTranslations();
    const [isDeleting, setIsDeleting] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: t('nav.offers'),
            href: '/offers',
        },
        {
            title: t('offer_ls_resources.page_title'),
            href: lsResources.index().url,
        },
        {
            title: resource.name,
            href: lsResources.show({ lsResource: resource.uuid }).url,
        },
    ];

    const handleDeleteConfirm = () => {
        if (isDeleting) return;

        setIsDeleting(true);
        router.delete(lsResources.destroy({ lsResource: resource.uuid }).url, {
            onSuccess: () => {
                setDeleteDialogOpen(false);
                router.visit(lsResources.index().url);
            },
            onFinish: () => {
                setIsDeleting(false);
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head
                title={t('offer_ls_resources.show.page_title', {
                    name: resource.name,
                })}
            />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <div className="flex-1">
                        <h1 className="text-2xl font-bold">{resource.name}</h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            {t('common.code')}:{' '}
                            <span className="font-mono">{resource.code}</span> |
                            UUID:{' '}
                            <span className="font-mono">{resource.uuid}</span>
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Button asChild variant="outline">
                            <Link
                                href={
                                    lsResources.edit({
                                        lsResource: resource.uuid,
                                    }).url
                                }
                            >
                                <Edit className="mr-2 h-4 w-4" />
                                {t('common.edit')}
                            </Link>
                        </Button>
                        <Button
                            variant="destructive"
                            disabled={isDeleting}
                            onClick={() => setDeleteDialogOpen(true)}
                        >
                            <Trash2 className="mr-2 h-4 w-4" />
                            {t('common.delete')}
                        </Button>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>
                            {t('offer_ls_resources.show.details_title')}
                        </CardTitle>
                        <CardDescription>
                            {t('offer_ls_resources.show.details_subtitle')}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <Label className="text-sm font-medium text-muted-foreground">
                                {t('common.code')}
                            </Label>
                            <p className="font-mono text-lg font-semibold">
                                {resource.code}
                            </p>
                        </div>

                        <div>
                            <Label className="text-sm font-medium text-muted-foreground">
                                {t('offer_ls_resources.form.name_label')}
                            </Label>
                            <p className="text-lg font-semibold">
                                {resource.name}
                            </p>
                        </div>

                        <div>
                            <Label className="text-sm font-medium text-muted-foreground">
                                UUID
                            </Label>
                            <p className="font-mono text-sm">{resource.uuid}</p>
                        </div>

                        <div>
                            <Label className="text-sm font-medium text-muted-foreground">
                                ID
                            </Label>
                            <p className="text-sm">{resource.id}</p>
                        </div>
                    </CardContent>
                </Card>

                <ConfirmDeleteDialog
                    open={deleteDialogOpen}
                    onOpenChange={setDeleteDialogOpen}
                    onConfirm={handleDeleteConfirm}
                    isDeleting={isDeleting}
                    title={t('offer_ls_resources.delete.title')}
                    description={t('offer_ls_resources.delete.description', {
                        name: resource.name,
                        code: resource.code,
                    })}
                    itemName={`${resource.name} (${t('common.code')}: ${resource.code})`}
                />
            </div>
        </AppLayout>
    );
}
