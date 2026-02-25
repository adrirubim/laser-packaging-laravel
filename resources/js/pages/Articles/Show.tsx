import ConfirmDeleteDialog from '@/components/confirm-delete-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Label } from '@/components/ui/label';
import { useTranslations } from '@/hooks/use-translations';
import AppLayout from '@/layouts/app-layout';
import articles from '@/routes/articles/index';
import offers from '@/routes/offers/index';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import {
    Box,
    CheckCircle2,
    Copy,
    Download,
    Edit,
    Eye,
    FileText,
    MoreHorizontal,
    Package,
    Trash2,
    XCircle,
} from 'lucide-react';
import { useState } from 'react';

type Offer = {
    uuid: string;
    offer_number: string;
    description?: string | null;
};

type Category = {
    uuid: string;
    name: string;
};

type PalletType = {
    uuid: string;
    cod: string;
    description?: string | null;
};

type Material = {
    uuid: string;
    /** Backend sends `cod`; also accept `code` */
    code?: string | null;
    cod?: string | null;
    description?: string | null;
};

type Machinery = {
    uuid: string;
    code: string;
    description?: string | null;
    parameter?: string | null;
    value?: string | null;
    valueType?: string | null;
};

type CriticalIssue = {
    uuid: string;
    code?: string | null;
    description?: string | null;
    /** Backend usa `name`; code/description possono non esistere in DB */
    name?: string | null;
};

type PackagingInstruction = {
    uuid: string;
    code: string;
    number?: string | null;
    filename?: string | null;
};

type OperatingInstruction = {
    uuid: string;
    code: string;
    number?: string | null;
    filename?: string | null;
};

type PalletizingInstruction = {
    uuid: string;
    code: string;
    number?: string | null;
    filename?: string | null;
    length_cm?: number | null;
    depth_cm?: number | null;
    height_cm?: number | null;
    plan_packaging?: number | null;
    pallet_plans?: number | null;
    units_per_neck?: number | null;
    interlayer_every_floors?: number | null;
};

type CheckMaterial = {
    uuid: string;
    material_uuid: string;
    material?: Material | null;
    um?: string | null;
    quantity_expected?: number | null;
    quantity_effective?: number | null;
};

type PalletSheet = {
    uuid: string;
    code: string;
    description?: string | null;
};

type CQModel = {
    uuid: string;
    cod_model: string;
    description_model?: string | null;
};

type Order = {
    uuid: string;
    order_production_number: string;
    quantity?: number | null;
    worked_quantity?: number | null;
    status: number;
};

type Article = {
    uuid: string;
    cod_article_las: string;
    cod_article_client?: string | null;
    article_descr?: string | null;
    additional_descr?: string | null;
    plan_packaging?: number | null;
    pallet_plans?: number | null;
    weight_kg?: number | null;
    length_cm?: number | null;
    depth_cm?: number | null;
    height_cm?: number | null;
    line_layout?: string | null;
    visibility_cod?: boolean;
    stock_managed?: boolean;
    um?: string | null;
    lot_attribution?: number | null;
    expiration_attribution?: number | null;
    ean?: string | null;
    db?: number | null;
    labels_external?: number | null;
    labels_pvp?: number | null;
    value_pvp?: number | null;
    labels_ingredient?: number | null;
    labels_data_variable?: number | null;
    label_of_jumpers?: number | null;
    allergens?: boolean;
    nominal_weight_control?: number | null;
    weight_unit_of_measur?: string | null;
    weight_value?: number | null;
    object_control_weight?: number | null;
    customer_samples_list?: number | null;
    media_prevista_cfz_h_pz?: number | null;
    media_reale_cfz_h_pz?: number | null;
    media_prevista_pz_h_ps?: number | null;
    media_reale_pz_h_ps?: number | null;
    production_approval_checkbox?: boolean;
    production_approval_employee?: string | null;
    production_approval_date?: string | null;
    production_approval_notes?: string | null;
    approv_quality_checkbox?: boolean;
    approv_quality_employee?: string | null;
    approv_quality_date?: string | null;
    approv_quality_notes?: string | null;
    commercial_approval_checkbox?: boolean;
    commercial_approval_employee?: string | null;
    commercial_approval_date?: string | null;
    commercial_approval_notes?: string | null;
    client_approval_checkbox?: boolean;
    client_approval_employee?: string | null;
    client_approval_date?: string | null;
    client_approval_notes?: string | null;
    check_approval?: boolean;
    offer?: Offer | null;
    category?: Category | null;
    pallet_type?: PalletType | null;
    pallet_sheet?: PalletSheet | null;
    model?: CQModel | null;
    materials?: Material[];
    machinery?: Machinery[];
    critical_issues?: CriticalIssue[];
    packaging_instructions?: PackagingInstruction[];
    operating_instructions?: OperatingInstruction[];
    palletizing_instructions?: PalletizingInstruction[];
    check_materials?: CheckMaterial[];
    orders?: Order[];
};

type ArticlesShowProps = {
    article: Article;
};

const getStatusLabels = (
    t: (key: string) => string,
): Record<number, string> => ({
    0: t('articles.show.planning_status.planned'),
    1: t('articles.show.planning_status.setup'),
    2: t('articles.show.planning_status.launched'),
    3: t('articles.show.planning_status.in_progress'),
    4: t('articles.show.planning_status.suspended'),
    5: t('articles.show.planning_status.completed'),
});

const formatNumber = (value: unknown, decimals: number = 2): string => {
    if (value === null || value === undefined) return '';

    const n =
        typeof value === 'number'
            ? value
            : typeof value === 'string'
              ? Number(value.replace(',', '.'))
              : Number.NaN;

    if (!Number.isFinite(n)) return String(value);

    return n.toFixed(decimals).replace('.', ',');
};

export default function ArticlesShow({ article }: ArticlesShowProps) {
    const { t } = useTranslations();
    const STATUS_LABELS = getStatusLabels(t);
    const [isDeleting, setIsDeleting] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: t('nav.articles'),
            href: articles.index().url,
        },
        {
            title: article.cod_article_las,
            href: articles.show({ article: article.uuid }).url,
        },
    ];

    const handleDelete = () => {
        setIsDeleting(true);
        router.delete(articles.destroy({ article: article.uuid }).url, {
            onSuccess: () => {
                router.visit(articles.index().url);
            },
            onFinish: () => {
                setIsDeleting(false);
                setShowDeleteDialog(false);
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head
                title={t('articles.show.title', {
                    code: article.cod_article_las,
                })}
            />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <div className="flex-1">
                        <div className="mb-2 flex items-center gap-3">
                            <h1 className="text-2xl font-bold">
                                {article.cod_article_las}
                            </h1>
                            {article.category && (
                                <Badge variant="secondary">
                                    {article.category.name}
                                </Badge>
                            )}
                        </div>
                        {article.article_descr && (
                            <p className="text-sm text-muted-foreground">
                                {article.article_descr}
                            </p>
                        )}
                    </div>
                    <div className="flex items-center gap-2">
                        {article.offer && (
                            <Button asChild variant="outline" size="sm">
                                <Link
                                    href={
                                        offers.show({
                                            offer: article.offer.uuid,
                                        }).url
                                    }
                                    aria-label={t('articles.show.view_offer')}
                                >
                                    <Eye className="mr-2 h-4 w-4" />
                                    {t('common.view_offer')}
                                </Link>
                            </Button>
                        )}
                        <Button asChild variant="outline" size="sm">
                            <Link
                                href={
                                    articles.edit({ article: article.uuid }).url
                                }
                                aria-label={t('articles.show.edit_article')}
                            >
                                <Edit className="mr-2 h-4 w-4" />
                                {t('common.edit')}
                            </Link>
                        </Button>
                        <Button asChild variant="outline" size="sm">
                            <Link
                                href={
                                    articles.create({
                                        query: {
                                            source_article_uuid: article.uuid,
                                        },
                                    }).url
                                }
                                aria-label={t(
                                    'articles.show.duplicate_article',
                                )}
                            >
                                <Copy className="mr-2 h-4 w-4" />
                                {t('common.duplicate')}
                            </Link>
                        </Button>
                        {article.line_layout && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                    window.location.href =
                                        articles.downloadLineLayout({
                                            article: article.uuid,
                                        }).url;
                                }}
                                aria-label={t(
                                    'articles.show.download_line_layout',
                                )}
                            >
                                <Download className="mr-2 h-4 w-4" />
                                {t('articles.show.download_layout')}
                            </Button>
                        )}
                        <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => setShowDeleteDialog(true)}
                            disabled={isDeleting}
                            aria-label={t('articles.show.delete_article')}
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
                                {t('articles.show.basic_info.title')}
                            </CardTitle>
                            <CardDescription>
                                {t('articles.show.basic_info.description')}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label className="text-sm font-medium text-muted-foreground">
                                    {t('common.code_las')}
                                </Label>
                                <p className="font-mono text-lg font-semibold">
                                    {article.cod_article_las}
                                </p>
                            </div>

                            {article.cod_article_client && (
                                <div>
                                    <Label className="text-sm font-medium text-muted-foreground">
                                        {t('common.code_customer')}
                                    </Label>
                                    <p className="font-mono">
                                        {article.cod_article_client}
                                    </p>
                                </div>
                            )}

                            {article.article_descr && (
                                <div>
                                    <Label className="text-sm font-medium text-muted-foreground">
                                        {t('common.description')}
                                    </Label>
                                    <p>{article.article_descr}</p>
                                </div>
                            )}

                            {article.additional_descr && (
                                <div>
                                    <Label className="text-sm font-medium text-muted-foreground">
                                        {t(
                                            'articles.show.basic_info.additional_description',
                                        )}
                                    </Label>
                                    <p>{article.additional_descr}</p>
                                </div>
                            )}

                            {article.category && (
                                <div>
                                    <Label className="text-sm font-medium text-muted-foreground">
                                        {t('common.category')}
                                    </Label>
                                    <p>{article.category.name}</p>
                                </div>
                            )}

                            <div className="flex items-center space-x-2 pt-2">
                                <Checkbox
                                    checked={article.visibility_cod || false}
                                    disabled
                                />
                                <Label className="text-sm font-medium">
                                    {t('articles.show.basic_info.visibility')}
                                </Label>
                            </div>

                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    checked={article.stock_managed || false}
                                    disabled
                                />
                                <Label className="text-sm font-medium">
                                    {t('articles.show.basic_info.stock')}
                                </Label>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>
                                {t('articles.show.offer_and_unit.title')}
                            </CardTitle>
                            <CardDescription>
                                {t('articles.show.offer_and_unit.description')}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {article.offer && (
                                <div>
                                    <Label className="text-sm font-medium text-muted-foreground">
                                        {t('common.offer')}
                                    </Label>
                                    <p className="font-mono">
                                        {article.offer.offer_number}
                                    </p>
                                    {article.offer.description && (
                                        <p className="mt-1 text-sm text-muted-foreground">
                                            {article.offer.description}
                                        </p>
                                    )}
                                </div>
                            )}

                            {article.um && (
                                <div>
                                    <Label className="text-sm font-medium text-muted-foreground">
                                        {t('articles.show.unit')}
                                    </Label>
                                    <p className="font-mono">{article.um}</p>
                                </div>
                            )}

                            {article.lot_attribution !== null &&
                                article.lot_attribution !== undefined && (
                                    <div>
                                        <Label className="text-sm font-medium text-muted-foreground">
                                            {t('articles.show.lot_attribution')}
                                        </Label>
                                        <p>{article.lot_attribution}</p>
                                    </div>
                                )}

                            {article.expiration_attribution !== null &&
                                article.expiration_attribution !==
                                    undefined && (
                                    <div>
                                        <Label className="text-sm font-medium text-muted-foreground">
                                            {t(
                                                'articles.show.expiration_attribution',
                                            )}
                                        </Label>
                                        <p>{article.expiration_attribution}</p>
                                    </div>
                                )}

                            {article.ean && (
                                <div>
                                    <Label className="text-sm font-medium text-muted-foreground">
                                        {t('articles.show.ean')}
                                    </Label>
                                    <p className="font-mono">{article.ean}</p>
                                </div>
                            )}

                            {article.db !== null &&
                                article.db !== undefined && (
                                    <div>
                                        <Label className="text-sm font-medium text-muted-foreground">
                                            {t('articles.show.db')}
                                        </Label>
                                        <p>{article.db}</p>
                                    </div>
                                )}

                            {article.line_layout && (
                                <div>
                                    <Label className="text-sm font-medium text-muted-foreground">
                                        {t('articles.show.line_layout')}
                                    </Label>
                                    <div className="flex items-center gap-2">
                                        <p className="font-mono text-sm">
                                            {article.line_layout}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {article.machinery && article.machinery.length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Box className="h-5 w-5" />
                                {t('articles.show.machinery_and_params')}
                            </CardTitle>
                            <CardDescription>
                                {t('articles.show.machinery_description')}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                {article.machinery.map((machine) => (
                                    <div
                                        key={machine.uuid}
                                        className="flex items-center justify-between rounded border p-2"
                                    >
                                        <div className="flex-1">
                                            <p className="font-mono font-medium">
                                                {machine.code}
                                            </p>
                                            {machine.description && (
                                                <p className="text-sm text-muted-foreground">
                                                    {machine.description}
                                                </p>
                                            )}
                                            {machine.parameter && (
                                                <p className="mt-1 text-xs text-muted-foreground">
                                                    {t(
                                                        'articles.show.parameter',
                                                    )}
                                                    : {machine.parameter}
                                                </p>
                                            )}
                                        </div>
                                        {machine.value && (
                                            <div className="ml-4">
                                                <Label className="text-xs text-muted-foreground">
                                                    {t(
                                                        'articles.show.weight_control.value',
                                                    )}
                                                </Label>
                                                <p className="font-mono text-sm">
                                                    {machine.value}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {article.packaging_instructions &&
                    article.packaging_instructions.length > 0 && (
                        <Card>
                            <CardHeader>
                                <CardTitle>
                                    {t(
                                        'articles.show.packaging_instructions.title',
                                    )}
                                </CardTitle>
                                <CardDescription>
                                    {t(
                                        'articles.show.packaging_instructions.description',
                                    )}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    {article.packaging_instructions.map(
                                        (instruction) => (
                                            <div
                                                key={instruction.uuid}
                                                className="flex items-center justify-between gap-2 rounded border p-2"
                                            >
                                                <div className="flex min-w-0 items-center gap-2">
                                                    <p className="truncate font-mono font-medium">
                                                        {instruction.code}
                                                        {instruction.number ||
                                                            ''}
                                                    </p>
                                                    {instruction.filename && (
                                                        <span className="shrink-0 text-xs text-muted-foreground">
                                                            (
                                                            {
                                                                instruction.filename
                                                            }
                                                            )
                                                        </span>
                                                    )}
                                                </div>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger
                                                        asChild
                                                    >
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8 shrink-0"
                                                            aria-label={t(
                                                                'common.open_actions_menu',
                                                            )}
                                                        >
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem
                                                            onSelect={(e) => {
                                                                e.preventDefault();
                                                                router.visit(
                                                                    articles.packagingInstructions.show(
                                                                        {
                                                                            packagingInstruction:
                                                                                instruction.uuid,
                                                                        },
                                                                    ).url,
                                                                );
                                                            }}
                                                        >
                                                            <Eye className="mr-2 h-4 w-4" />
                                                            {t('common.view')}
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            onSelect={(e) => {
                                                                e.preventDefault();
                                                                router.visit(
                                                                    articles.packagingInstructions.edit(
                                                                        {
                                                                            packagingInstruction:
                                                                                instruction.uuid,
                                                                        },
                                                                    ).url,
                                                                );
                                                            }}
                                                        >
                                                            <Edit className="mr-2 h-4 w-4" />
                                                            {t('common.edit')}
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            disabled={
                                                                !instruction.filename
                                                            }
                                                            onSelect={(e) => {
                                                                e.preventDefault();
                                                                if (
                                                                    !instruction.filename
                                                                )
                                                                    return;
                                                                window.location.href =
                                                                    articles.packagingInstructions.download(
                                                                        {
                                                                            packagingInstruction:
                                                                                instruction.uuid,
                                                                        },
                                                                    ).url;
                                                            }}
                                                        >
                                                            <Download className="mr-2 h-4 w-4" />
                                                            {t(
                                                                'articles.show.download_attachment',
                                                            )}
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>
                                        ),
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                {article.palletizing_instructions &&
                    article.palletizing_instructions.length > 0 && (
                        <Card>
                            <CardHeader>
                                <CardTitle>
                                    {t(
                                        'articles.show.palletization_instructions.title',
                                    )}
                                </CardTitle>
                                <CardDescription>
                                    {t(
                                        'articles.show.palletization_instructions.description',
                                    )}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {article.palletizing_instructions.map(
                                    (instruction) => {
                                        const volume =
                                            instruction.length_cm &&
                                            instruction.depth_cm &&
                                            instruction.height_cm
                                                ? (instruction.length_cm *
                                                      instruction.depth_cm *
                                                      instruction.height_cm) /
                                                  1000
                                                : null;
                                        const colliPerPallet =
                                            instruction.plan_packaging &&
                                            instruction.pallet_plans
                                                ? instruction.plan_packaging *
                                                  instruction.pallet_plans
                                                : null;
                                        const unitaPerPallet =
                                            instruction.units_per_neck &&
                                            instruction.plan_packaging &&
                                            instruction.pallet_plans
                                                ? instruction.units_per_neck *
                                                  instruction.plan_packaging *
                                                  instruction.pallet_plans
                                                : null;

                                        return (
                                            <div
                                                key={instruction.uuid}
                                                className="space-y-4 rounded-lg border p-4"
                                            >
                                                <div className="flex items-center justify-between gap-2">
                                                    <div className="flex min-w-0 items-center gap-2">
                                                        <div>
                                                            <Label className="text-sm font-medium text-muted-foreground">
                                                                {t(
                                                                    'articles.show.instruction',
                                                                )}
                                                            </Label>
                                                            <p className="truncate font-mono font-medium">
                                                                {
                                                                    instruction.code
                                                                }
                                                                {instruction.number ||
                                                                    ''}
                                                            </p>
                                                        </div>
                                                        {instruction.filename && (
                                                            <span className="shrink-0 text-xs text-muted-foreground">
                                                                (
                                                                {
                                                                    instruction.filename
                                                                }
                                                                )
                                                            </span>
                                                        )}
                                                    </div>
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger
                                                            asChild
                                                        >
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-8 w-8 shrink-0"
                                                                aria-label={t(
                                                                    'common.open_actions_menu',
                                                                )}
                                                            >
                                                                <MoreHorizontal className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuItem
                                                                onSelect={(
                                                                    e,
                                                                ) => {
                                                                    e.preventDefault();
                                                                    router.visit(
                                                                        articles.palletizationInstructions.show(
                                                                            {
                                                                                palletizationInstruction:
                                                                                    instruction.uuid,
                                                                            },
                                                                        ).url,
                                                                    );
                                                                }}
                                                            >
                                                                <Eye className="mr-2 h-4 w-4" />
                                                                {t(
                                                                    'common.view',
                                                                )}
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem
                                                                onSelect={(
                                                                    e,
                                                                ) => {
                                                                    e.preventDefault();
                                                                    router.visit(
                                                                        articles.palletizationInstructions.edit(
                                                                            {
                                                                                palletizationInstruction:
                                                                                    instruction.uuid,
                                                                            },
                                                                        ).url,
                                                                    );
                                                                }}
                                                            >
                                                                <Edit className="mr-2 h-4 w-4" />
                                                                {t(
                                                                    'common.edit',
                                                                )}
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem
                                                                disabled={
                                                                    !instruction.filename
                                                                }
                                                                onSelect={(
                                                                    e,
                                                                ) => {
                                                                    e.preventDefault();
                                                                    if (
                                                                        !instruction.filename
                                                                    )
                                                                        return;
                                                                    window.location.href =
                                                                        articles.palletizationInstructions.download(
                                                                            {
                                                                                palletizationInstruction:
                                                                                    instruction.uuid,
                                                                            },
                                                                        ).url;
                                                                }}
                                                            >
                                                                <Download className="mr-2 h-4 w-4" />
                                                                {t(
                                                                    'articles.show.download_attachment',
                                                                )}
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </div>

                                                <div className="grid gap-4 md:grid-cols-2">
                                                    {instruction.units_per_neck !==
                                                        null &&
                                                        instruction.units_per_neck !==
                                                            undefined && (
                                                            <div>
                                                                <Label className="text-sm font-medium text-muted-foreground">
                                                                    Unità per
                                                                    collo
                                                                </Label>
                                                                <div className="flex items-center gap-2">
                                                                    <p className="text-right font-mono">
                                                                        {formatNumber(
                                                                            instruction.units_per_neck,
                                                                            5,
                                                                        )}
                                                                    </p>
                                                                    <span className="text-sm text-muted-foreground">
                                                                        unità
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        )}

                                                    {instruction.length_cm !==
                                                        null &&
                                                        instruction.length_cm !==
                                                            undefined && (
                                                            <div>
                                                                <Label className="text-sm font-medium text-muted-foreground">
                                                                    Larghezza
                                                                    collo
                                                                </Label>
                                                                <div className="flex items-center gap-2">
                                                                    <p className="text-right font-mono">
                                                                        {formatNumber(
                                                                            instruction.length_cm,
                                                                            5,
                                                                        )}
                                                                    </p>
                                                                    <span className="text-sm text-muted-foreground">
                                                                        cm
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        )}

                                                    {instruction.depth_cm !==
                                                        null &&
                                                        instruction.depth_cm !==
                                                            undefined && (
                                                            <div>
                                                                <Label className="text-sm font-medium text-muted-foreground">
                                                                    Profondità
                                                                    collo
                                                                </Label>
                                                                <div className="flex items-center gap-2">
                                                                    <p className="text-right font-mono">
                                                                        {formatNumber(
                                                                            instruction.depth_cm,
                                                                            5,
                                                                        )}
                                                                    </p>
                                                                    <span className="text-sm text-muted-foreground">
                                                                        cm
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        )}

                                                    {instruction.height_cm !==
                                                        null &&
                                                        instruction.height_cm !==
                                                            undefined && (
                                                            <div>
                                                                <Label className="text-sm font-medium text-muted-foreground">
                                                                    Altezza
                                                                    collo
                                                                </Label>
                                                                <div className="flex items-center gap-2">
                                                                    <p className="text-right font-mono">
                                                                        {formatNumber(
                                                                            instruction.height_cm,
                                                                            5,
                                                                        )}
                                                                    </p>
                                                                    <span className="text-sm text-muted-foreground">
                                                                        cm
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        )}

                                                    {volume !== null && (
                                                        <div>
                                                            <Label className="text-sm font-medium text-muted-foreground">
                                                                Volume collo
                                                            </Label>
                                                            <div className="flex items-center gap-2">
                                                                <p className="text-right font-mono">
                                                                    {formatNumber(
                                                                        volume,
                                                                        5,
                                                                    )}
                                                                </p>
                                                                <span className="text-sm text-muted-foreground">
                                                                    dmc
                                                                </span>
                                                            </div>
                                                        </div>
                                                    )}

                                                    {instruction.plan_packaging !==
                                                        null &&
                                                        instruction.plan_packaging !==
                                                            undefined && (
                                                            <div>
                                                                <Label className="text-sm font-medium text-muted-foreground">
                                                                    Colli per
                                                                    piano
                                                                </Label>
                                                                <div className="flex items-center gap-2">
                                                                    <p className="text-right font-mono">
                                                                        {formatNumber(
                                                                            instruction.plan_packaging,
                                                                            5,
                                                                        )}
                                                                    </p>
                                                                    <span className="text-sm text-muted-foreground">
                                                                        colli
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        )}

                                                    {instruction.pallet_plans !==
                                                        null &&
                                                        instruction.pallet_plans !==
                                                            undefined && (
                                                            <div>
                                                                <Label className="text-sm font-medium text-muted-foreground">
                                                                    Piani per
                                                                    pallet
                                                                </Label>
                                                                <div className="flex items-center gap-2">
                                                                    <p className="text-right font-mono">
                                                                        {formatNumber(
                                                                            instruction.pallet_plans,
                                                                            5,
                                                                        )}
                                                                    </p>
                                                                    <span className="text-sm text-muted-foreground">
                                                                        piani
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        )}

                                                    {colliPerPallet !==
                                                        null && (
                                                        <div>
                                                            <Label className="text-sm font-medium text-muted-foreground">
                                                                Colli per pallet
                                                            </Label>
                                                            <div className="flex items-center gap-2">
                                                                <p className="font-mono">
                                                                    {formatNumber(
                                                                        colliPerPallet,
                                                                        5,
                                                                    )}
                                                                </p>
                                                                <span className="text-sm text-muted-foreground">
                                                                    colli
                                                                </span>
                                                            </div>
                                                        </div>
                                                    )}

                                                    {unitaPerPallet !==
                                                        null && (
                                                        <div>
                                                            <Label className="text-sm font-medium text-muted-foreground">
                                                                Unità per Pallet
                                                            </Label>
                                                            <div className="flex items-center gap-2">
                                                                <p className="font-mono">
                                                                    {formatNumber(
                                                                        unitaPerPallet,
                                                                        5,
                                                                    )}
                                                                </p>
                                                                <span className="text-sm text-muted-foreground">
                                                                    unità
                                                                </span>
                                                            </div>
                                                        </div>
                                                    )}

                                                    {instruction.interlayer_every_floors !==
                                                        null &&
                                                        instruction.interlayer_every_floors !==
                                                            undefined && (
                                                            <div>
                                                                <Label className="text-sm font-medium text-muted-foreground">
                                                                    Interfalda
                                                                    ogni
                                                                </Label>
                                                                <div className="flex items-center gap-2">
                                                                    <p className="text-right font-mono">
                                                                        {formatNumber(
                                                                            instruction.interlayer_every_floors,
                                                                            0,
                                                                        )}
                                                                    </p>
                                                                    <span className="text-sm text-muted-foreground">
                                                                        piani
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        )}
                                                </div>
                                            </div>
                                        );
                                    },
                                )}
                            </CardContent>
                        </Card>
                    )}

                {article.operating_instructions &&
                    article.operating_instructions.length > 0 && (
                        <Card>
                            <CardHeader>
                                <CardTitle>
                                    {t(
                                        'articles.show.operational_instructions.title',
                                    )}
                                </CardTitle>
                                <CardDescription>
                                    {t(
                                        'articles.show.operational_instructions.description',
                                    )}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    {article.operating_instructions.map(
                                        (instruction) => (
                                            <div
                                                key={instruction.uuid}
                                                className="flex items-center justify-between gap-2 rounded border p-2"
                                            >
                                                <div className="flex min-w-0 items-center gap-2">
                                                    <p className="truncate font-mono font-medium">
                                                        {instruction.code}
                                                        {instruction.number ||
                                                            ''}
                                                    </p>
                                                    {instruction.filename && (
                                                        <span className="shrink-0 text-xs text-muted-foreground">
                                                            (
                                                            {
                                                                instruction.filename
                                                            }
                                                            )
                                                        </span>
                                                    )}
                                                </div>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger
                                                        asChild
                                                    >
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8 shrink-0"
                                                            aria-label={t(
                                                                'common.open_actions_menu',
                                                            )}
                                                        >
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem
                                                            onSelect={(e) => {
                                                                e.preventDefault();
                                                                router.visit(
                                                                    articles.operationalInstructions.show(
                                                                        {
                                                                            operationalInstruction:
                                                                                instruction.uuid,
                                                                        },
                                                                    ).url,
                                                                );
                                                            }}
                                                        >
                                                            <Eye className="mr-2 h-4 w-4" />
                                                            {t('common.view')}
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            onSelect={(e) => {
                                                                e.preventDefault();
                                                                router.visit(
                                                                    articles.operationalInstructions.edit(
                                                                        {
                                                                            operationalInstruction:
                                                                                instruction.uuid,
                                                                        },
                                                                    ).url,
                                                                );
                                                            }}
                                                        >
                                                            <Edit className="mr-2 h-4 w-4" />
                                                            {t('common.edit')}
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            disabled={
                                                                !instruction.filename
                                                            }
                                                            onSelect={(e) => {
                                                                e.preventDefault();
                                                                if (
                                                                    !instruction.filename
                                                                )
                                                                    return;
                                                                window.location.href =
                                                                    articles.operationalInstructions.download(
                                                                        {
                                                                            operationalInstruction:
                                                                                instruction.uuid,
                                                                        },
                                                                    ).url;
                                                            }}
                                                        >
                                                            <Download className="mr-2 h-4 w-4" />
                                                            {t(
                                                                'articles.show.download_attachment',
                                                            )}
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>
                                        ),
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                <div className="grid gap-4 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>
                                {t('articles.show.labels.title')}
                            </CardTitle>
                            <CardDescription>
                                {t('articles.show.labels.description')}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {article.labels_external !== null &&
                                article.labels_external !== undefined && (
                                    <div>
                                        <Label className="text-sm font-medium text-muted-foreground">
                                            {t('articles.show.labels.external')}
                                        </Label>
                                        <p>{article.labels_external}</p>
                                    </div>
                                )}

                            {article.labels_pvp !== null &&
                                article.labels_pvp !== undefined && (
                                    <div>
                                        <Label className="text-sm font-medium text-muted-foreground">
                                            {t('articles.show.labels.pvp')}
                                        </Label>
                                        <p>{article.labels_pvp}</p>
                                    </div>
                                )}

                            {article.value_pvp !== null &&
                                article.value_pvp !== undefined && (
                                    <div>
                                        <Label className="text-sm font-medium text-muted-foreground">
                                            {t(
                                                'articles.show.labels.value_pvp',
                                            )}
                                        </Label>
                                        <div className="flex items-center gap-2">
                                            <p className="text-right font-mono">
                                                {formatNumber(
                                                    article.value_pvp,
                                                    5,
                                                )}
                                            </p>
                                            <span className="text-sm text-muted-foreground">
                                                pvp
                                            </span>
                                        </div>
                                    </div>
                                )}

                            {article.labels_ingredient !== null &&
                                article.labels_ingredient !== undefined && (
                                    <div>
                                        <Label className="text-sm font-medium text-muted-foreground">
                                            {t(
                                                'articles.show.labels.ingredient',
                                            )}
                                        </Label>
                                        <p>{article.labels_ingredient}</p>
                                    </div>
                                )}

                            {article.labels_data_variable !== null &&
                                article.labels_data_variable !== undefined && (
                                    <div>
                                        <Label className="text-sm font-medium text-muted-foreground">
                                            {t(
                                                'articles.show.labels.data_variable',
                                            )}
                                        </Label>
                                        <p>{article.labels_data_variable}</p>
                                    </div>
                                )}

                            {article.label_of_jumpers !== null &&
                                article.label_of_jumpers !== undefined && (
                                    <div>
                                        <Label className="text-sm font-medium text-muted-foreground">
                                            {t('articles.show.labels.jumpers')}
                                        </Label>
                                        <p>{article.label_of_jumpers}</p>
                                    </div>
                                )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>
                                {t('articles.show.weight_allergens.title')}
                            </CardTitle>
                            <CardDescription>
                                {t(
                                    'articles.show.weight_allergens.description',
                                )}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {article.weight_kg !== null &&
                                article.weight_kg !== undefined && (
                                    <div>
                                        <Label className="text-sm font-medium text-muted-foreground">
                                            {t('articles.show.weight_collo')}
                                        </Label>
                                        <div className="flex items-center gap-2">
                                            <p className="text-right font-mono">
                                                {formatNumber(
                                                    article.weight_kg,
                                                    5,
                                                )}
                                            </p>
                                            <span className="text-sm text-muted-foreground">
                                                kg
                                            </span>
                                        </div>
                                    </div>
                                )}

                            <div className="flex items-center space-x-2 pt-2">
                                <Checkbox
                                    checked={article.allergens || false}
                                    disabled
                                />
                                <Label className="text-sm font-medium">
                                    {t('articles.show.allergens')}
                                </Label>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {article.critical_issues &&
                    article.critical_issues.length > 0 && (
                        <Card>
                            <CardHeader>
                                <CardTitle>
                                    {t('articles.show.critical_issues.title')}
                                </CardTitle>
                                <CardDescription>
                                    {t(
                                        'articles.show.critical_issues.description',
                                    )}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    {article.critical_issues.map((issue) => (
                                        <div
                                            key={issue.uuid}
                                            className="flex items-center justify-between gap-2 rounded-lg border border-border bg-muted/30 p-3"
                                        >
                                            <div className="min-w-0 flex-1">
                                                <p className="font-mono font-medium">
                                                    {issue.code ||
                                                        issue.name ||
                                                        '—'}
                                                </p>
                                                <p className="text-sm text-muted-foreground">
                                                    {issue.description ||
                                                        issue.name ||
                                                        t(
                                                            'common.no_description',
                                                        )}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                <Card>
                    <CardHeader>
                        <CardTitle>
                            {t('articles.show.weight_control.title')}
                        </CardTitle>
                        <CardDescription>
                            {t('articles.show.weight_control.description')}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {article.nominal_weight_control !== null &&
                            article.nominal_weight_control !== undefined && (
                                <div>
                                    <Label className="text-sm font-medium text-muted-foreground">
                                        {t(
                                            'articles.show.weight_control.control',
                                        )}
                                    </Label>
                                    <p>{article.nominal_weight_control}</p>
                                </div>
                            )}

                        {article.weight_unit_of_measur && (
                            <div>
                                <Label className="text-sm font-medium text-muted-foreground">
                                    {t('articles.show.unit')}
                                </Label>
                                <p>{article.weight_unit_of_measur}</p>
                            </div>
                        )}

                        {article.weight_value !== null &&
                            article.weight_value !== undefined && (
                                <div>
                                    <Label className="text-sm font-medium text-muted-foreground">
                                        {t(
                                            'articles.show.weight_control.value',
                                        )}
                                    </Label>
                                    <p className="font-mono">
                                        {formatNumber(article.weight_value, 5)}
                                    </p>
                                </div>
                            )}

                        {article.object_control_weight !== null &&
                            article.object_control_weight !== undefined && (
                                <div>
                                    <Label className="text-sm font-medium text-muted-foreground">
                                        {t(
                                            'articles.show.weight_control.object',
                                        )}
                                    </Label>
                                    <p>{article.object_control_weight}</p>
                                </div>
                            )}
                    </CardContent>
                </Card>

                {(() => {
                    const materials =
                        article.materials ??
                        (article as { materials?: Material[] }).materials ??
                        [];
                    return materials.length > 0 ? (
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Package className="h-5 w-5" />
                                    {t('articles.show.materials.title')}
                                </CardTitle>
                                <CardDescription>
                                    {t('articles.show.materials.description')}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    {materials.map((material) => (
                                        <div
                                            key={material.uuid}
                                            className="flex items-center justify-between gap-2 rounded-lg border border-border bg-muted/30 p-3"
                                        >
                                            <div className="min-w-0 flex-1">
                                                <p className="font-mono font-medium">
                                                    {material.cod ??
                                                        material.code ??
                                                        '—'}
                                                </p>
                                                <p className="text-sm text-muted-foreground">
                                                    {material.description ??
                                                        t(
                                                            'common.no_description',
                                                        )}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    ) : null;
                })()}

                <div className="grid gap-4 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>
                                {t('articles.show.pallet_models.title')}
                            </CardTitle>
                            <CardDescription>
                                {t('articles.show.pallet_models.description')}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {article.pallet_type && (
                                <div>
                                    <Label className="text-sm font-medium text-muted-foreground">
                                        {t('articles.show.pallet_type_label')}
                                    </Label>
                                    <p className="font-mono">
                                        {article.pallet_type.cod}
                                    </p>
                                    {article.pallet_type.description && (
                                        <p className="mt-1 text-sm text-muted-foreground">
                                            {article.pallet_type.description}
                                        </p>
                                    )}
                                </div>
                            )}

                            {article.plan_packaging !== null &&
                                article.plan_packaging !== undefined && (
                                    <div>
                                        <Label className="text-sm font-medium text-muted-foreground">
                                            {t('articles.show.plan_packaging')}
                                        </Label>
                                        <p>{article.plan_packaging}</p>
                                    </div>
                                )}

                            {article.pallet_plans !== null &&
                                article.pallet_plans !== undefined && (
                                    <div>
                                        <Label className="text-sm font-medium text-muted-foreground">
                                            {t('articles.show.pallet_plans')}
                                        </Label>
                                        <p>{article.pallet_plans}</p>
                                    </div>
                                )}

                            {article.pallet_sheet && (
                                <div>
                                    <Label className="text-sm font-medium text-muted-foreground">
                                        {t('articles.show.pallet_sheet')}
                                    </Label>
                                    <div className="flex items-center gap-2">
                                        <p className="font-mono">
                                            {article.pallet_sheet.code}
                                        </p>
                                        {article.pallet_sheet.description && (
                                            <span className="text-sm text-muted-foreground">
                                                -{' '}
                                                {
                                                    article.pallet_sheet
                                                        .description
                                                }
                                            </span>
                                        )}
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => {
                                                window.location.href =
                                                    articles.palletSheets.downloadFile(
                                                        {
                                                            palletSheet:
                                                                article
                                                                    .pallet_sheet
                                                                    ?.uuid ||
                                                                '',
                                                        },
                                                    ).url;
                                            }}
                                        >
                                            <Download className="mr-1 h-3 w-3" />
                                            {t('articles.edit.download')}
                                        </Button>
                                    </div>
                                </div>
                            )}

                            {article.model && (
                                <div>
                                    <Label className="text-sm font-medium text-muted-foreground">
                                        {t('articles.show.model_cq')}
                                    </Label>
                                    <div className="flex items-center gap-2">
                                        <p className="font-mono">
                                            {article.model.cod_model}
                                        </p>
                                        {article.model.description_model && (
                                            <span className="text-sm text-muted-foreground">
                                                -{' '}
                                                {
                                                    article.model
                                                        .description_model
                                                }
                                            </span>
                                        )}
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => {
                                                window.location.href =
                                                    articles.cqModels.downloadFile(
                                                        {
                                                            cqModel:
                                                                article.model
                                                                    ?.uuid ||
                                                                '',
                                                        },
                                                    ).url;
                                            }}
                                        >
                                            <Download className="mr-1 h-3 w-3" />
                                            {t('articles.edit.download')}
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>
                                {t('articles.show.customer_samples.title')}
                            </CardTitle>
                            <CardDescription>
                                {t(
                                    'articles.show.customer_samples.description',
                                )}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {article.customer_samples_list !== null &&
                                article.customer_samples_list !== undefined && (
                                    <div>
                                        <Label className="text-sm font-medium text-muted-foreground">
                                            {t(
                                                'articles.show.customer_samples.list',
                                            )}
                                        </Label>
                                        <p>{article.customer_samples_list}</p>
                                    </div>
                                )}
                        </CardContent>
                    </Card>
                </div>

                {article.check_materials &&
                    article.check_materials.length > 0 && (
                        <Card>
                            <CardHeader>
                                <CardTitle>
                                    {t('articles.show.check_materials.title')}
                                </CardTitle>
                                <CardDescription>
                                    {t(
                                        'articles.show.check_materials.description',
                                    )}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="overflow-x-auto">
                                    <table className="w-full border-collapse">
                                        <thead>
                                            <tr className="border-b">
                                                <th className="p-2 text-left text-sm font-medium">
                                                    {t(
                                                        'articles.show.check_materials.material',
                                                    )}
                                                </th>
                                                <th className="p-2 text-left text-sm font-medium">
                                                    {t(
                                                        'articles.show.check_materials.um',
                                                    )}
                                                </th>
                                                <th className="p-2 text-left text-sm font-medium">
                                                    {t(
                                                        'articles.show.check_materials.qty_prev',
                                                    )}
                                                </th>
                                                <th className="p-2 text-left text-sm font-medium">
                                                    {t(
                                                        'articles.show.check_materials.qty_effett',
                                                    )}
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {article.check_materials.map(
                                                (checkMaterial) => (
                                                    <tr
                                                        key={checkMaterial.uuid}
                                                        className="border-b"
                                                    >
                                                        <td className="p-2">
                                                            {checkMaterial.material ? (
                                                                <div>
                                                                    <p className="font-mono font-medium">
                                                                        {
                                                                            checkMaterial
                                                                                .material
                                                                                .code
                                                                        }
                                                                    </p>
                                                                    {checkMaterial
                                                                        .material
                                                                        .description && (
                                                                        <p className="text-xs text-muted-foreground">
                                                                            {
                                                                                checkMaterial
                                                                                    .material
                                                                                    .description
                                                                            }
                                                                        </p>
                                                                    )}
                                                                </div>
                                                            ) : (
                                                                <p className="text-muted-foreground">
                                                                    -
                                                                </p>
                                                            )}
                                                        </td>
                                                        <td className="p-2">
                                                            <p className="font-mono">
                                                                {checkMaterial.um ||
                                                                    '-'}
                                                            </p>
                                                        </td>
                                                        <td className="p-2">
                                                            <p className="font-mono">
                                                                {checkMaterial.quantity_expected !==
                                                                    null &&
                                                                checkMaterial.quantity_expected !==
                                                                    undefined
                                                                    ? formatNumber(
                                                                          checkMaterial.quantity_expected,
                                                                          5,
                                                                      )
                                                                    : '-'}
                                                            </p>
                                                        </td>
                                                        <td className="p-2">
                                                            <p className="font-mono">
                                                                {checkMaterial.quantity_effective !==
                                                                    null &&
                                                                checkMaterial.quantity_effective !==
                                                                    undefined
                                                                    ? formatNumber(
                                                                          checkMaterial.quantity_effective,
                                                                          5,
                                                                      )
                                                                    : '-'}
                                                            </p>
                                                        </td>
                                                    </tr>
                                                ),
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                {(article.media_prevista_cfz_h_pz !== null ||
                    article.media_reale_cfz_h_pz !== null ||
                    article.media_prevista_pz_h_ps !== null ||
                    article.media_reale_pz_h_ps !== null) && (
                    <Card>
                        <CardHeader>
                            <CardTitle>
                                {t('articles.show.productivity.title')}
                            </CardTitle>
                            <CardDescription>
                                {t(
                                    'articles.show.media_productivity.description',
                                )}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-4 md:grid-cols-2">
                                {article.media_prevista_cfz_h_pz !== null &&
                                    article.media_prevista_cfz_h_pz !==
                                        undefined && (
                                        <div>
                                            <Label className="text-sm font-medium text-muted-foreground">
                                                {t(
                                                    'articles.show.media_prevista_cfz',
                                                )}
                                            </Label>
                                            <p className="font-mono">
                                                {formatNumber(
                                                    article.media_prevista_cfz_h_pz,
                                                    5,
                                                )}
                                            </p>
                                        </div>
                                    )}

                                {article.media_reale_cfz_h_pz !== null &&
                                    article.media_reale_cfz_h_pz !==
                                        undefined && (
                                        <div>
                                            <Label className="text-sm font-medium text-muted-foreground">
                                                {t(
                                                    'articles.show.media_reale_cfz',
                                                )}
                                            </Label>
                                            <p className="font-mono">
                                                {formatNumber(
                                                    article.media_reale_cfz_h_pz,
                                                    5,
                                                )}
                                            </p>
                                        </div>
                                    )}

                                {article.media_prevista_pz_h_ps !== null &&
                                    article.media_prevista_pz_h_ps !==
                                        undefined && (
                                        <div>
                                            <Label className="text-sm font-medium text-muted-foreground">
                                                {t(
                                                    'articles.show.media_prevista_pz',
                                                )}
                                            </Label>
                                            <p className="font-mono">
                                                {formatNumber(
                                                    article.media_prevista_pz_h_ps,
                                                    5,
                                                )}
                                            </p>
                                        </div>
                                    )}

                                {article.media_reale_pz_h_ps !== null &&
                                    article.media_reale_pz_h_ps !==
                                        undefined && (
                                        <div>
                                            <Label className="text-sm font-medium text-muted-foreground">
                                                {t(
                                                    'articles.show.media_reale_pz',
                                                )}
                                            </Label>
                                            <p className="font-mono">
                                                {formatNumber(
                                                    article.media_reale_pz_h_ps,
                                                    5,
                                                )}
                                            </p>
                                        </div>
                                    )}
                            </div>
                        </CardContent>
                    </Card>
                )}

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <CheckCircle2 className="h-5 w-5" />
                            {t('articles.show.approvals.title')}
                        </CardTitle>
                        <CardDescription>
                            {t('articles.show.approvals.description')}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* Production Approval */}
                        <div className="space-y-3 border-b pb-4">
                            <Label className="text-base font-semibold">
                                {t('articles.show.approval_production')}
                            </Label>
                            <div className="flex items-center space-x-2">
                                {article.production_approval_checkbox ? (
                                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                                ) : (
                                    <XCircle className="h-5 w-5 text-gray-400" />
                                )}
                                <Label className="text-sm font-medium">
                                    {article.production_approval_checkbox
                                        ? t('common.approved')
                                        : t('common.not_approved')}
                                </Label>
                            </div>
                            {article.production_approval_employee && (
                                <div>
                                    <Label className="text-sm font-medium text-muted-foreground">
                                        {t('articles.show.attendant')}
                                    </Label>
                                    <p>
                                        {article.production_approval_employee}
                                    </p>
                                </div>
                            )}
                            {article.production_approval_date && (
                                <div>
                                    <Label className="text-sm font-medium text-muted-foreground">
                                        {t('articles.show.date')}
                                    </Label>
                                    <p>
                                        {new Date(
                                            article.production_approval_date,
                                        ).toLocaleDateString('it-IT')}
                                    </p>
                                </div>
                            )}
                            {article.production_approval_notes && (
                                <div>
                                    <Label className="text-sm font-medium text-muted-foreground">
                                        {t('articles.show.notes')}
                                    </Label>
                                    <p className="text-sm whitespace-pre-wrap">
                                        {article.production_approval_notes}
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Quality Approval */}
                        <div className="space-y-3 border-b pb-4">
                            <Label className="text-base font-semibold">
                                {t('articles.show.approval_quality')}
                            </Label>
                            <div className="flex items-center space-x-2">
                                {article.approv_quality_checkbox ? (
                                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                                ) : (
                                    <XCircle className="h-5 w-5 text-gray-400" />
                                )}
                                <Label className="text-sm font-medium">
                                    {article.approv_quality_checkbox
                                        ? t('common.approved')
                                        : t('common.not_approved')}
                                </Label>
                            </div>
                            {article.approv_quality_employee && (
                                <div>
                                    <Label className="text-sm font-medium text-muted-foreground">
                                        {t('articles.show.attendant')}
                                    </Label>
                                    <p>{article.approv_quality_employee}</p>
                                </div>
                            )}
                            {article.approv_quality_date && (
                                <div>
                                    <Label className="text-sm font-medium text-muted-foreground">
                                        {t('articles.show.date')}
                                    </Label>
                                    <p>
                                        {new Date(
                                            article.approv_quality_date,
                                        ).toLocaleDateString('it-IT')}
                                    </p>
                                </div>
                            )}
                            {article.approv_quality_notes && (
                                <div>
                                    <Label className="text-sm font-medium text-muted-foreground">
                                        {t('articles.show.notes')}
                                    </Label>
                                    <p className="text-sm whitespace-pre-wrap">
                                        {article.approv_quality_notes}
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Approvazione Commerciale */}
                        <div className="space-y-3 border-b pb-4">
                            <Label className="text-base font-semibold">
                                {t('articles.show.approval_commercial')}
                            </Label>
                            <div className="flex items-center space-x-2">
                                {article.commercial_approval_checkbox ? (
                                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                                ) : (
                                    <XCircle className="h-5 w-5 text-gray-400" />
                                )}
                                <Label className="text-sm font-medium">
                                    {article.commercial_approval_checkbox
                                        ? t('common.approved')
                                        : t('common.not_approved')}
                                </Label>
                            </div>
                            {article.commercial_approval_employee && (
                                <div>
                                    <Label className="text-sm font-medium text-muted-foreground">
                                        {t('articles.show.attendant')}
                                    </Label>
                                    <p>
                                        {article.commercial_approval_employee}
                                    </p>
                                </div>
                            )}
                            {article.commercial_approval_date && (
                                <div>
                                    <Label className="text-sm font-medium text-muted-foreground">
                                        {t('articles.show.date')}
                                    </Label>
                                    <p>
                                        {new Date(
                                            article.commercial_approval_date,
                                        ).toLocaleDateString('it-IT')}
                                    </p>
                                </div>
                            )}
                            {article.commercial_approval_notes && (
                                <div>
                                    <Label className="text-sm font-medium text-muted-foreground">
                                        {t('articles.show.notes')}
                                    </Label>
                                    <p className="text-sm whitespace-pre-wrap">
                                        {article.commercial_approval_notes}
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Customer Approval */}
                        <div className="space-y-3 border-b pb-4">
                            <Label className="text-base font-semibold">
                                {t('articles.show.approval_client')}
                            </Label>
                            <div className="flex items-center space-x-2">
                                {article.client_approval_checkbox ? (
                                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                                ) : (
                                    <XCircle className="h-5 w-5 text-gray-400" />
                                )}
                                <Label className="text-sm font-medium">
                                    {article.client_approval_checkbox
                                        ? t('common.approved')
                                        : t('common.not_approved')}
                                </Label>
                            </div>
                            {article.client_approval_employee && (
                                <div>
                                    <Label className="text-sm font-medium text-muted-foreground">
                                        {t('articles.show.attendant')}
                                    </Label>
                                    <p>{article.client_approval_employee}</p>
                                </div>
                            )}
                            {article.client_approval_date && (
                                <div>
                                    <Label className="text-sm font-medium text-muted-foreground">
                                        {t('articles.show.date')}
                                    </Label>
                                    <p>
                                        {new Date(
                                            article.client_approval_date,
                                        ).toLocaleDateString('it-IT')}
                                    </p>
                                </div>
                            )}
                            {article.client_approval_notes && (
                                <div>
                                    <Label className="text-sm font-medium text-muted-foreground">
                                        {t('articles.show.notes')}
                                    </Label>
                                    <p className="text-sm whitespace-pre-wrap">
                                        {article.client_approval_notes}
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Spunta Approvazione */}
                        <div className="flex items-center space-x-2 pt-2">
                            <Checkbox
                                checked={article.check_approval || false}
                                disabled
                            />
                            <Label className="text-sm font-medium">
                                {t('articles.show.check_approval')}
                            </Label>
                        </div>
                    </CardContent>
                </Card>

                {(article.weight_kg ||
                    article.length_cm ||
                    article.depth_cm ||
                    article.height_cm) && (
                    <Card>
                        <CardHeader>
                            <CardTitle>
                                {t('articles.show.dimensions_weight.title')}
                            </CardTitle>
                            <CardDescription>
                                {t(
                                    'articles.show.dimensions_weight.description',
                                )}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-4 md:grid-cols-4">
                                {article.weight_kg !== null &&
                                    article.weight_kg !== undefined && (
                                        <div>
                                            <Label className="text-sm font-medium text-muted-foreground">
                                                Peso (kg)
                                            </Label>
                                            <p>
                                                {formatNumber(
                                                    article.weight_kg,
                                                    5,
                                                )}
                                            </p>
                                        </div>
                                    )}
                                {article.length_cm !== null &&
                                    article.length_cm !== undefined && (
                                        <div>
                                            <Label className="text-sm font-medium text-muted-foreground">
                                                Lunghezza (cm)
                                            </Label>
                                            <p>
                                                {formatNumber(
                                                    article.length_cm,
                                                    2,
                                                )}
                                            </p>
                                        </div>
                                    )}
                                {article.depth_cm !== null &&
                                    article.depth_cm !== undefined && (
                                        <div>
                                            <Label className="text-sm font-medium text-muted-foreground">
                                                Profondità (cm)
                                            </Label>
                                            <p>
                                                {formatNumber(
                                                    article.depth_cm,
                                                    2,
                                                )}
                                            </p>
                                        </div>
                                    )}
                                {article.height_cm !== null &&
                                    article.height_cm !== undefined && (
                                        <div>
                                            <Label className="text-sm font-medium text-muted-foreground">
                                                Altezza (cm)
                                            </Label>
                                            <p>
                                                {formatNumber(
                                                    article.height_cm,
                                                    2,
                                                )}
                                            </p>
                                        </div>
                                    )}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {article.orders && article.orders.length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <FileText className="h-5 w-5" />
                                Ordini
                            </CardTitle>
                            <CardDescription>
                                Ordini associati a questo articolo
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                {article.orders.map((order) => (
                                    <div
                                        key={order.uuid}
                                        className="flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-muted/50"
                                    >
                                        <div>
                                            <p className="font-mono font-medium">
                                                {order.order_production_number}
                                            </p>
                                            <div className="mt-1 flex items-center gap-4 text-sm text-muted-foreground">
                                                {order.quantity !== null &&
                                                    order.quantity !==
                                                        undefined && (
                                                        <span>
                                                            Quantità:{' '}
                                                            {order.quantity}
                                                        </span>
                                                    )}
                                                {order.worked_quantity !==
                                                    null &&
                                                    order.worked_quantity !==
                                                        undefined && (
                                                        <span>
                                                            Lavorato:{' '}
                                                            {
                                                                order.worked_quantity
                                                            }
                                                        </span>
                                                    )}
                                                <Badge variant="outline">
                                                    {STATUS_LABELS[
                                                        order.status
                                                    ] ||
                                                        `Stato ${order.status}`}
                                                </Badge>
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
                open={showDeleteDialog}
                onOpenChange={setShowDeleteDialog}
                onConfirm={handleDelete}
                isLoading={isDeleting}
                title={t('common.confirm_delete')}
                description={t('articles.show.delete_confirm.description', {
                    code: article.cod_article_las,
                })}
            />
        </AppLayout>
    );
}
