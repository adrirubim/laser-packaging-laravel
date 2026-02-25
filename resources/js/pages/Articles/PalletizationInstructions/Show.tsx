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
import articles from '@/routes/articles/index';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft, Download, Edit, Trash2 } from 'lucide-react';
import { useState } from 'react';

type Article = {
    uuid: string;
    cod_article_las: string;
};

type PalletizationInstruction = {
    uuid: string;
    code: string;
    number?: string | null;
    length_cm?: number | null;
    depth_cm?: number | null;
    height_cm?: number | null;
    volume_dmc?: number | null;
    plan_packaging?: number | null;
    pallet_plans?: number | null;
    qty_pallet?: number | null;
    units_per_neck?: number | null;
    units_pallet?: number | null;
    interlayer_every_floors?: number | null;
    filename?: string | null;
    articles?: Article[];
};

type PalletizationInstructionsShowProps = {
    instruction: PalletizationInstruction;
};

export default function PalletizationInstructionsShow({
    instruction,
}: PalletizationInstructionsShowProps) {
    const { t } = useTranslations();
    const [isDeleting, setIsDeleting] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const instructionCode = instruction.code + (instruction.number || '');

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: t('nav.articles'),
            href: articles.index().url,
        },
        {
            title: t('articles.palletization_instructions.index.title'),
            href: articles.palletizationInstructions.index().url,
        },
        {
            title: instructionCode,
            href: articles.palletizationInstructions.show({
                palletizationInstruction: instruction.uuid,
            }).url,
        },
    ];

    const handleDelete = () => {
        setIsDeleting(true);
        router.delete(
            articles.palletizationInstructions.destroy({
                palletizationInstruction: instruction.uuid,
            }).url,
            {
                preserveScroll: true,
                onSuccess: () => {
                    router.visit(
                        articles.palletizationInstructions.index().url,
                    );
                },
                onError: () => {
                    setIsDeleting(false);
                },
            },
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head
                title={t(
                    'articles.palletization_instructions.show.page_title',
                    {
                        code: instructionCode,
                    },
                )}
            />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">
                            {instruction.code}
                            {instruction.number || ''}
                        </h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            {t(
                                'articles.palletization_instructions.show.subtitle',
                            )}
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Link
                            href={
                                articles.palletizationInstructions.edit({
                                    palletizationInstruction: instruction.uuid,
                                }).url
                            }
                        >
                            <Button variant="outline" size="sm">
                                <Edit className="mr-2 h-4 w-4" />
                                {t('common.edit')}
                            </Button>
                        </Link>
                        <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => setShowDeleteDialog(true)}
                            disabled={isDeleting}
                        >
                            <Trash2 className="mr-2 h-4 w-4" />
                            {isDeleting
                                ? t('common.deleting')
                                : t('common.delete')}
                        </Button>
                        <Link
                            href={
                                articles.palletizationInstructions.index().url
                            }
                        >
                            <Button variant="ghost" size="sm">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                {t(
                                    'articles.palletization_instructions.show.back',
                                )}
                            </Button>
                        </Link>
                    </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>
                                {t(
                                    'articles.palletization_instructions.show.general_info',
                                )}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label className="text-sm font-medium text-muted-foreground">
                                    {t(
                                        'articles.palletization_instructions.show.fields.code',
                                    )}
                                </Label>
                                <p className="mt-1 text-sm font-medium">
                                    {instruction.code}
                                </p>
                            </div>
                            {instruction.number && (
                                <div>
                                    <Label className="text-sm font-medium text-muted-foreground">
                                        {t(
                                            'articles.palletization_instructions.show.fields.number',
                                        )}
                                    </Label>
                                    <p className="mt-1 text-sm font-medium">
                                        {instruction.number}
                                    </p>
                                </div>
                            )}
                            {instruction.filename && (
                                <div>
                                    <Label className="text-sm font-medium text-muted-foreground">
                                        {t(
                                            'articles.palletization_instructions.show.fields.filename',
                                        )}
                                    </Label>
                                    <div className="mt-1 flex items-center gap-2">
                                        <p className="text-sm font-medium">
                                            {instruction.filename}
                                        </p>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => {
                                                window.location.href =
                                                    articles.palletizationInstructions.download(
                                                        {
                                                            palletizationInstruction:
                                                                instruction.uuid,
                                                        },
                                                    ).url;
                                            }}
                                        >
                                            <Download className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>
                                {t(
                                    'articles.palletization_instructions.show.dimensions_title',
                                )}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {instruction.length_cm && (
                                <div>
                                    <Label className="text-sm font-medium text-muted-foreground">
                                        {t(
                                            'articles.palletization_instructions.show.fields.length',
                                        )}
                                    </Label>
                                    <p className="mt-1 text-sm font-medium">
                                        {instruction.length_cm} cm
                                    </p>
                                </div>
                            )}
                            {instruction.depth_cm && (
                                <div>
                                    <Label className="text-sm font-medium text-muted-foreground">
                                        {t(
                                            'articles.palletization_instructions.show.fields.depth',
                                        )}
                                    </Label>
                                    <p className="mt-1 text-sm font-medium">
                                        {instruction.depth_cm} cm
                                    </p>
                                </div>
                            )}
                            {instruction.height_cm && (
                                <div>
                                    <Label className="text-sm font-medium text-muted-foreground">
                                        {t(
                                            'articles.palletization_instructions.show.fields.height',
                                        )}
                                    </Label>
                                    <p className="mt-1 text-sm font-medium">
                                        {instruction.height_cm} cm
                                    </p>
                                </div>
                            )}
                            {instruction.volume_dmc && (
                                <div>
                                    <Label className="text-sm font-medium text-muted-foreground">
                                        {t(
                                            'articles.palletization_instructions.show.fields.volume',
                                        )}
                                    </Label>
                                    <p className="mt-1 text-sm font-medium">
                                        {instruction.volume_dmc} dm³
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>
                                {t(
                                    'articles.palletization_instructions.show.config_title',
                                )}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {instruction.plan_packaging && (
                                <div>
                                    <Label className="text-sm font-medium text-muted-foreground">
                                        {t(
                                            'articles.palletization_instructions.show.fields.plan_packaging',
                                        )}
                                    </Label>
                                    <p className="mt-1 text-sm font-medium">
                                        {instruction.plan_packaging}
                                    </p>
                                </div>
                            )}
                            {instruction.pallet_plans && (
                                <div>
                                    <Label className="text-sm font-medium text-muted-foreground">
                                        {t(
                                            'articles.palletization_instructions.show.fields.pallet_plans',
                                        )}
                                    </Label>
                                    <p className="mt-1 text-sm font-medium">
                                        {instruction.pallet_plans}
                                    </p>
                                </div>
                            )}
                            {instruction.qty_pallet && (
                                <div>
                                    <Label className="text-sm font-medium text-muted-foreground">
                                        {t(
                                            'articles.palletization_instructions.show.fields.qty_pallet',
                                        )}
                                    </Label>
                                    <p className="mt-1 text-sm font-medium">
                                        {instruction.qty_pallet}
                                    </p>
                                </div>
                            )}
                            {instruction.units_per_neck && (
                                <div>
                                    <Label className="text-sm font-medium text-muted-foreground">
                                        {t(
                                            'articles.palletization_instructions.show.fields.units_per_neck',
                                        )}
                                    </Label>
                                    <p className="mt-1 text-sm font-medium">
                                        {instruction.units_per_neck}
                                    </p>
                                </div>
                            )}
                            {instruction.units_pallet && (
                                <div>
                                    <Label className="text-sm font-medium text-muted-foreground">
                                        {t(
                                            'articles.palletization_instructions.show.fields.units_pallet',
                                        )}
                                    </Label>
                                    <p className="mt-1 text-sm font-medium">
                                        {instruction.units_pallet}
                                    </p>
                                </div>
                            )}
                            {instruction.interlayer_every_floors !== null &&
                                instruction.interlayer_every_floors !==
                                    undefined && (
                                    <div>
                                        <Label className="text-sm font-medium text-muted-foreground">
                                            {t(
                                                'articles.palletization_instructions.show.fields.interlayer_every',
                                            )}
                                        </Label>
                                        <p className="mt-1 text-sm font-medium">
                                            {
                                                instruction.interlayer_every_floors
                                            }{' '}
                                            {t(
                                                'articles.palletization_instructions.show.fields.floors_suffix',
                                            )}
                                        </p>
                                    </div>
                                )}
                        </CardContent>
                    </Card>

                    {instruction.articles &&
                        instruction.articles.length > 0 && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>
                                        {t(
                                            'articles.palletization_instructions.show.articles_title',
                                        )}
                                    </CardTitle>
                                    <CardDescription>
                                        {t(
                                            'articles.palletization_instructions.show.articles_subtitle',
                                        )}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-2">
                                        {instruction.articles.map((article) => (
                                            <Link
                                                key={article.uuid}
                                                href={
                                                    articles.show({
                                                        article: article.uuid,
                                                    }).url
                                                }
                                                className="block rounded-lg border p-2 transition-colors hover:bg-muted/50"
                                            >
                                                <p className="text-sm font-medium">
                                                    {article.cod_article_las}
                                                </p>
                                            </Link>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                </div>

                <ConfirmDeleteDialog
                    open={showDeleteDialog}
                    onOpenChange={setShowDeleteDialog}
                    onConfirm={handleDelete}
                    isDeleting={isDeleting}
                    title={t(
                        'articles.palletization_instructions.delete.title',
                    )}
                    description={t(
                        'articles.palletization_instructions.delete.description',
                    )}
                    itemName={instructionCode}
                />
            </div>
        </AppLayout>
    );
}
