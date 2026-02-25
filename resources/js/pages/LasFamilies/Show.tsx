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
import lasFamilies from '@/routes/las-families/index';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Edit, Trash2 } from 'lucide-react';
import { useState } from 'react';

type LasFamily = {
    id: number;
    uuid: string;
    code: string;
    name: string;
};

type LasFamiliesShowProps = {
    family: LasFamily;
};

export default function LasFamiliesShow({ family }: LasFamiliesShowProps) {
    const { t } = useTranslations();
    const [isDeleting, setIsDeleting] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: t('nav.offers'),
            href: '/offers',
        },
        {
            title: t('offer_las_families.page_title'),
            href: lasFamilies.index().url,
        },
        {
            title: family.name,
            href: lasFamilies.show({ lasFamily: family.uuid }).url,
        },
    ];

    const handleDeleteConfirm = () => {
        if (isDeleting) return;

        setIsDeleting(true);
        router.delete(lasFamilies.destroy({ lasFamily: family.uuid }).url, {
            onSuccess: () => {
                setDeleteDialogOpen(false);
                router.visit(lasFamilies.index().url);
            },
            onFinish: () => {
                setIsDeleting(false);
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head
                title={t('offer_las_families.show.page_title', {
                    name: family.name,
                })}
            />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <div className="flex-1">
                        <h1 className="text-2xl font-bold">{family.name}</h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            {t('common.code')}:{' '}
                            <span className="font-mono">{family.code}</span> |
                            UUID:{' '}
                            <span className="font-mono">{family.uuid}</span>
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Button asChild variant="outline">
                            <Link
                                href={
                                    lasFamilies.edit({ lasFamily: family.uuid })
                                        .url
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
                            {t('offer_las_families.show.details_title')}
                        </CardTitle>
                        <CardDescription>
                            {t('offer_las_families.show.details_subtitle')}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <Label className="text-sm font-medium text-muted-foreground">
                                {t('common.code')}
                            </Label>
                            <p className="font-mono text-lg font-semibold">
                                {family.code}
                            </p>
                        </div>

                        <div>
                            <Label className="text-sm font-medium text-muted-foreground">
                                {t('offer_las_families.form.name_label')}
                            </Label>
                            <p className="text-lg font-semibold">
                                {family.name}
                            </p>
                        </div>

                        <div>
                            <Label className="text-sm font-medium text-muted-foreground">
                                UUID
                            </Label>
                            <p className="font-mono text-sm">{family.uuid}</p>
                        </div>

                        <div>
                            <Label className="text-sm font-medium text-muted-foreground">
                                ID
                            </Label>
                            <p className="text-sm">{family.id}</p>
                        </div>
                    </CardContent>
                </Card>

                <ConfirmDeleteDialog
                    open={deleteDialogOpen}
                    onOpenChange={setDeleteDialogOpen}
                    onConfirm={handleDeleteConfirm}
                    isDeleting={isDeleting}
                    title={t('offer_las_families.delete.title')}
                    description={t('offer_las_families.delete.description', {
                        name: family.name,
                        code: family.code,
                    })}
                    itemName={`${family.name} (${t('common.code')}: ${family.code})`}
                />
            </div>
        </AppLayout>
    );
}
