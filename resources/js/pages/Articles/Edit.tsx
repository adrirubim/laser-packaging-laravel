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
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useFieldValidation } from '@/hooks/useFieldValidation';
import AppLayout from '@/layouts/app-layout';
import { validationRules } from '@/lib/validation/rules';
import articles from '@/routes/articles';
import { type BreadcrumbItem } from '@/types';
import { Form, Head, router, usePage } from '@inertiajs/react';
import { Download } from 'lucide-react';
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

type ListOption = {
    key: number;
    value: string;
};

type CQModel = {
    uuid: string;
    cod_model: string;
    description_model?: string | null;
};

type PalletSheet = {
    uuid: string;
    code: string;
    description?: string | null;
};

type MediaValues = {
    media_prevista_cfz_h_pz: number;
    media_prevista_pz_h_ps: number;
};

type Article = {
    uuid: string;
    offer_uuid: string;
    cod_article_las: string;
    cod_article_client?: string | null;
    article_descr?: string | null;
    additional_descr?: string | null;
    article_category?: string | null;
    pallet_uuid?: string | null;
    plan_packaging?: number | null;
    pallet_plans?: number | null;
    line_layout?: string | null;
    visibility_cod?: boolean;
    stock_managed?: boolean;
    um?: string | null;
    lot_attribution?: number;
    expiration_attribution?: number;
    ean?: string | null;
    db?: number;
    labels_external?: number;
    labels_pvp?: number;
    value_pvp?: number;
    labels_ingredient?: number;
    labels_data_variable?: number;
    label_of_jumpers?: number;
    weight_kg?: number;
    nominal_weight_control?: number;
    weight_unit_of_measur?: string | null;
    weight_value?: number;
    object_control_weight?: number;
    allergens?: boolean;
    pallet_sheet?: string | null;
    model_uuid?: string | null;
    customer_samples_list?: number;
    media_reale_cfz_h_pz?: number;
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
    machinery?: Machinery[];
    materials?: Material[];
    critical_issues?: CriticalIssue[];
    packaging_instructions?: PackagingInstruction[];
    operating_instructions?: OperatingInstruction[];
    palletizing_instructions?: PalletizingInstruction[];
    check_materials?: Array<{
        material_uuid: string;
        um?: string | null;
        quantity_expected?: number | null;
        quantity_effective?: number | null;
    }>;
};

type Machinery = {
    uuid: string;
    cod: string;
    description?: string | null;
    parameter?: string | null;
    valuetype?: string | null;
};

type Material = {
    uuid: string;
    cod: string;
    description?: string | null;
};

type CriticalIssue = {
    uuid: string;
    name: string;
};

type PackagingInstruction = {
    uuid: string;
    code: string;
    number?: string | null;
};

type OperatingInstruction = {
    uuid: string;
    code: string;
    number?: string | null;
};

type PalletizingInstruction = {
    uuid: string;
    code: string;
    number?: string | null;
};

type MachineryRow = {
    id: string;
    machineryUuid: string;
    value: string;
    valueType?: string | null;
};

type MaterialRow = {
    id: string;
    materialUuid: string;
};

type CriticalIssueRow = {
    id: string;
    criticalIssueUuid: string;
};

type InstructionRow = {
    id: string;
    instructionUuid: string;
};

type CheckMaterialRow = {
    id: string;
    materialUuid: string;
    um: string;
    quantityExpected: string;
    quantityEffective: string;
};

type ArticlesEditProps = {
    article: Article;
    offers: Offer[];
    categories: Category[];
    palletTypes: PalletType[];
    machinery?: Machinery[];
    materials?: Material[];
    criticalIssues?: CriticalIssue[];
    packagingInstructions?: PackagingInstruction[];
    operatingInstructions?: OperatingInstruction[];
    palletizingInstructions?: PalletizingInstruction[];
    cqModels?: CQModel[];
    palletSheets?: PalletSheet[];
    lotAttributionList?: ListOption[];
    expirationAttributionList?: ListOption[];
    dbList?: ListOption[];
    labelsExternalList?: ListOption[];
    labelsPvpList?: ListOption[];
    labelsIngredientList?: ListOption[];
    labelsDataVariableList?: ListOption[];
    labelOfJumpersList?: ListOption[];
    nominalWeightControlList?: ListOption[];
    objectControlWeightList?: ListOption[];
    customerSamplesList?: ListOption[];
    um?: string | null;
    piecesPerPackage?: number | null;
    mediaValues?: MediaValues | null;
    mediaRealePzHPs?: number;
    errors?: Record<string, string>;
};

export default function ArticlesEdit({
    article,
    offers,
    categories,
    palletTypes,
    cqModels = [],
    palletSheets = [],
    lotAttributionList = [],
    expirationAttributionList = [],
    dbList = [],
    labelsExternalList = [],
    labelsPvpList = [],
    labelsIngredientList = [],
    labelsDataVariableList = [],
    labelOfJumpersList = [],
    nominalWeightControlList = [],
    objectControlWeightList = [],
    customerSamplesList = [],
    um,
    piecesPerPackage,
    mediaValues,
    mediaRealePzHPs = 0,
    errors: serverErrors,
}: ArticlesEditProps) {
    const { props } = usePage<ArticlesEditProps>();
    const actualUm = um || props.um;
    const actualPiecesPerPackage = piecesPerPackage || props.piecesPerPackage;
    const actualMediaValues = mediaValues || props.mediaValues;
    const actualMediaRealePzHPs = mediaRealePzHPs || props.mediaRealePzHPs || 0;
    const actualCqModels =
        cqModels.length > 0 ? cqModels : props.cqModels || [];
    const actualPalletSheets =
        palletSheets.length > 0 ? palletSheets : props.palletSheets || [];
    const actualLotAttributionList =
        lotAttributionList.length > 0
            ? lotAttributionList
            : props.lotAttributionList || [];
    const actualExpirationAttributionList =
        expirationAttributionList.length > 0
            ? expirationAttributionList
            : props.expirationAttributionList || [];
    const actualDbList = dbList.length > 0 ? dbList : props.dbList || [];
    const actualLabelsExternalList =
        labelsExternalList.length > 0
            ? labelsExternalList
            : props.labelsExternalList || [];
    const actualLabelsPvpList =
        labelsPvpList.length > 0 ? labelsPvpList : props.labelsPvpList || [];
    const actualLabelsIngredientList =
        labelsIngredientList.length > 0
            ? labelsIngredientList
            : props.labelsIngredientList || [];
    const actualLabelsDataVariableList =
        labelsDataVariableList.length > 0
            ? labelsDataVariableList
            : props.labelsDataVariableList || [];
    const actualLabelOfJumpersList =
        labelOfJumpersList.length > 0
            ? labelOfJumpersList
            : props.labelOfJumpersList || [];
    const actualNominalWeightControlList =
        nominalWeightControlList.length > 0
            ? nominalWeightControlList
            : props.nominalWeightControlList || [];
    const actualObjectControlWeightList =
        objectControlWeightList.length > 0
            ? objectControlWeightList
            : props.objectControlWeightList || [];
    const actualCustomerSamplesList =
        customerSamplesList.length > 0
            ? customerSamplesList
            : props.customerSamplesList || [];

    const [selectedOffer, setSelectedOffer] = useState<string>(
        article.offer_uuid,
    );
    const [codArticleLas, setCodArticleLas] = useState(article.cod_article_las);
    const [articleDescr, setArticleDescr] = useState(
        article.article_descr || '',
    );
    const [planPackaging, setPlanPackaging] = useState(
        article.plan_packaging?.toString() || '',
    );
    const [palletPlans, setPalletPlans] = useState(
        article.pallet_plans?.toString() || '',
    );
    const [visibilityCod, setVisibilityCod] = useState(
        article.visibility_cod || false,
    );
    const [stockManaged, setStockManaged] = useState(
        article.stock_managed || false,
    );
    const [lotAttribution, setLotAttribution] = useState<string>(
        article.lot_attribution?.toString() || '',
    );
    const [expirationAttribution, setExpirationAttribution] = useState<string>(
        article.expiration_attribution?.toString() || '',
    );
    const [ean, setEan] = useState(article.ean || '');
    const [db, setDb] = useState<string>(article.db?.toString() || '');
    const [labelsExternal, setLabelsExternal] = useState<string>(
        article.labels_external?.toString() || '',
    );
    const [labelsPvp, setLabelsPvp] = useState<string>(
        article.labels_pvp?.toString() || '',
    );
    const [valuePvp, setValuePvp] = useState(
        article.value_pvp?.toString() || '',
    );
    const [labelsIngredient, setLabelsIngredient] = useState<string>(
        article.labels_ingredient?.toString() || '',
    );
    const [labelsDataVariable, setLabelsDataVariable] = useState<string>(
        article.labels_data_variable?.toString() || '',
    );
    const [labelOfJumpers, setLabelOfJumpers] = useState<string>(
        article.label_of_jumpers?.toString() || '',
    );
    const [weightKg, setWeightKg] = useState(
        article.weight_kg?.toString() || '',
    );
    const [nominalWeightControl, setNominalWeightControl] = useState<string>(
        article.nominal_weight_control?.toString() || '',
    );
    const [weightUnitOfMeasur, setWeightUnitOfMeasur] = useState(
        article.weight_unit_of_measur || '',
    );
    const [weightValue, setWeightValue] = useState(
        article.weight_value?.toString() || '',
    );
    const [objectControlWeight, setObjectControlWeight] = useState<string>(
        article.object_control_weight?.toString() || '',
    );
    const [allergens, setAllergens] = useState(article.allergens || false);
    const [palletSheet, setPalletSheet] = useState<string>(
        article.pallet_sheet || '',
    );
    const [modelUuid, setModelUuid] = useState<string>(
        article.model_uuid || '',
    );
    const [customerSamplesListValue, setCustomerSamplesListValue] =
        useState<string>(article.customer_samples_list?.toString() || '');
    const [mediaRealeCfzHPz, setMediaRealeCfzHPz] = useState(
        article.media_reale_cfz_h_pz?.toString() || '',
    );
    const [productionApprovalCheckbox, setProductionApprovalCheckbox] =
        useState(article.production_approval_checkbox || false);
    const [productionApprovalEmployee, setProductionApprovalEmployee] =
        useState(article.production_approval_employee || '');
    const [productionApprovalDate, setProductionApprovalDate] = useState(
        article.production_approval_date?.split('T')[0] || '',
    );
    const [productionApprovalNotes, setProductionApprovalNotes] = useState(
        article.production_approval_notes || '',
    );
    const [approvQualityCheckbox, setApprovQualityCheckbox] = useState(
        article.approv_quality_checkbox || false,
    );
    const [approvQualityEmployee, setApprovQualityEmployee] = useState(
        article.approv_quality_employee || '',
    );
    const [approvQualityDate, setApprovQualityDate] = useState(
        article.approv_quality_date?.split('T')[0] || '',
    );
    const [approvQualityNotes, setApprovQualityNotes] = useState(
        article.approv_quality_notes || '',
    );
    const [commercialApprovalCheckbox, setCommercialApprovalCheckbox] =
        useState(article.commercial_approval_checkbox || false);
    const [commercialApprovalEmployee, setCommercialApprovalEmployee] =
        useState(article.commercial_approval_employee || '');
    const [commercialApprovalDate, setCommercialApprovalDate] = useState(
        article.commercial_approval_date?.split('T')[0] || '',
    );
    const [commercialApprovalNotes, setCommercialApprovalNotes] = useState(
        article.commercial_approval_notes || '',
    );
    const [lineLayoutFileName, setLineLayoutFileName] = useState<string | null>(
        null,
    );
    const [clientApprovalCheckbox, setClientApprovalCheckbox] = useState(
        article.client_approval_checkbox || false,
    );
    const [clientApprovalEmployee, setClientApprovalEmployee] = useState(
        article.client_approval_employee || '',
    );
    const [clientApprovalDate, setClientApprovalDate] = useState(
        article.client_approval_date?.split('T')[0] || '',
    );
    const [clientApprovalNotes, setClientApprovalNotes] = useState(
        article.client_approval_notes || '',
    );

    // Stato per righe dinamiche
    const [machineryRows] = useState<MachineryRow[]>(() => {
        if (article.machinery && article.machinery.length > 0) {
            return article.machinery.map(
                (
                    m: Machinery & { pivot?: { value?: string } },
                    idx: number,
                ) => ({
                    id: `machinery-${idx}`,
                    machineryUuid: m.uuid,
                    value: m.pivot?.value || '',
                    valueType: m.valuetype || null,
                }),
            );
        }
        return [];
    });

    const [materialRows] = useState<MaterialRow[]>(() => {
        if (article.materials && article.materials.length > 0) {
            return article.materials.map((m: Material, idx: number) => ({
                id: `material-${idx}`,
                materialUuid: m.uuid,
            }));
        }
        return [];
    });

    const [criticalIssueRows] = useState<CriticalIssueRow[]>(() => {
        const list = article.critical_issues;
        if (list && list.length > 0) {
            return list.map((c: CriticalIssue, idx: number) => ({
                id: `critical-${idx}`,
                criticalIssueUuid: c.uuid,
            }));
        }
        return [];
    });

    const [packagingInstructionRows] = useState<InstructionRow[]>(() => {
        const list = article.packaging_instructions;
        if (list && list.length > 0) {
            return list.map((p: PackagingInstruction, idx: number) => ({
                id: `packaging-${idx}`,
                instructionUuid: p.uuid,
            }));
        }
        return [];
    });

    const [operatingInstructionRows] = useState<InstructionRow[]>(() => {
        const list = article.operating_instructions;
        if (list && list.length > 0) {
            return list.map((o: OperatingInstruction, idx: number) => ({
                id: `operating-${idx}`,
                instructionUuid: o.uuid,
            }));
        }
        return [];
    });

    const [palletizingInstructionRows] = useState<InstructionRow[]>(() => {
        const list = article.palletizing_instructions;
        if (list && list.length > 0) {
            return list.map((p: PalletizingInstruction, idx: number) => ({
                id: `palletizing-${idx}`,
                instructionUuid: p.uuid,
            }));
        }
        return [];
    });

    const [checkMaterialRows] = useState<CheckMaterialRow[]>(() => {
        const list = article.check_materials;
        if (list && list.length > 0) {
            return list.map(
                (
                    cm: {
                        material_uuid: string;
                        um?: string | null;
                        quantity_expected?: number | null;
                        quantity_effective?: number | null;
                    },
                    idx: number,
                ) => ({
                    id: `check-material-${idx}`,
                    materialUuid: cm.material_uuid,
                    um: cm.um || '',
                    quantityExpected: cm.quantity_expected?.toString() || '',
                    quantityEffective: cm.quantity_effective?.toString() || '',
                }),
            );
        }
        return [];
    });

    const codArticleLasValidation = useFieldValidation(codArticleLas, [
        (value) => {
            if (!value) return null; // Opzionale
            if (value.length > 255) {
                return 'Il codice LAS non può superare i 255 caratteri';
            }
            return null;
        },
    ]);

    const articleDescrValidation = useFieldValidation(articleDescr, [
        validationRules.required('La descrizione è obbligatoria'),
        validationRules.maxLength(
            255,
            'La descrizione non può superare i 255 caratteri',
        ),
    ]);

    const planPackagingValidation = useFieldValidation(planPackaging, [
        (value) => {
            if (!value) return null; // Opzionale
            const num = parseFloat(value);
            if (isNaN(num)) {
                return 'Il valore deve essere un numero';
            }
            if (num < 0) {
                return 'Il valore deve essere positivo o zero';
            }
            return null;
        },
    ]);

    const palletPlansValidation = useFieldValidation(palletPlans, [
        (value) => {
            if (!value) return null; // Opzionale
            const num = parseFloat(value);
            if (isNaN(num)) {
                return 'Il valore deve essere un numero';
            }
            if (num < 0) {
                return 'Il valore deve essere positivo o zero';
            }
            return null;
        },
    ]);

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Articoli',
            href: articles.index().url,
        },
        {
            title: article.cod_article_las,
            href: articles.show({ article: article.uuid }).url,
        },
        {
            title: 'Modifica',
            href: articles.edit({ article: article.uuid }).url,
        },
    ];

    const handleOfferChange = (offerUuid: string) => {
        setSelectedOffer(offerUuid);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Modifica Articolo ${article.cod_article_las}`} />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex w-full justify-center">
                    <div className="w-full max-w-4xl space-y-5">
                        <Card>
                            <CardHeader>
                                <CardTitle>Modifica Articolo</CardTitle>
                                <CardDescription>
                                    Modifica i dettagli dell'articolo
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Form
                                    action={
                                        articles.update({
                                            article: article.uuid,
                                        }).url
                                    }
                                    method="put"
                                    encType="multipart/form-data"
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
                                                        htmlFor="offer_uuid"
                                                        required
                                                    >
                                                        Offerta
                                                    </FormLabel>
                                                    <Select
                                                        name="offer_uuid"
                                                        value={selectedOffer}
                                                        onValueChange={
                                                            handleOfferChange
                                                        }
                                                        required
                                                    >
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Seleziona un'offerta" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {offers.map(
                                                                (offer) => (
                                                                    <SelectItem
                                                                        key={
                                                                            offer.uuid
                                                                        }
                                                                        value={
                                                                            offer.uuid
                                                                        }
                                                                    >
                                                                        {
                                                                            offer.offer_number
                                                                        }{' '}
                                                                        -{' '}
                                                                        {offer.description ||
                                                                            'Senza descrizione'}
                                                                    </SelectItem>
                                                                ),
                                                            )}
                                                        </SelectContent>
                                                    </Select>
                                                    <InputError
                                                        message={
                                                            allErrors.offer_uuid
                                                        }
                                                    />
                                                </div>

                                                <div className="grid gap-2">
                                                    <FormLabel htmlFor="cod_article_las">
                                                        Codice LAS
                                                    </FormLabel>
                                                    <Input
                                                        id="cod_article_las"
                                                        name="cod_article_las"
                                                        value={codArticleLas}
                                                        onChange={(e) =>
                                                            setCodArticleLas(
                                                                e.target.value,
                                                            )
                                                        }
                                                        onBlur={
                                                            codArticleLasValidation.onBlur
                                                        }
                                                        placeholder="Codice LAS"
                                                        maxLength={255}
                                                        aria-invalid={
                                                            codArticleLasValidation.error
                                                                ? 'true'
                                                                : 'false'
                                                        }
                                                        className={
                                                            codArticleLasValidation.error
                                                                ? 'border-destructive'
                                                                : ''
                                                        }
                                                    />
                                                    {codArticleLasValidation.error && (
                                                        <p className="text-xs text-destructive">
                                                            {
                                                                codArticleLasValidation.error
                                                            }
                                                        </p>
                                                    )}
                                                    <p className="text-xs text-muted-foreground">
                                                        Codice LAS dell'articolo
                                                        (massimo 255 caratteri).
                                                    </p>
                                                    <InputError
                                                        message={
                                                            allErrors.cod_article_las
                                                        }
                                                    />
                                                </div>

                                                <div className="grid gap-2">
                                                    <FormLabel
                                                        htmlFor="article_descr"
                                                        required
                                                    >
                                                        Descrizione
                                                    </FormLabel>
                                                    <Input
                                                        id="article_descr"
                                                        name="article_descr"
                                                        value={articleDescr}
                                                        onChange={(e) =>
                                                            setArticleDescr(
                                                                e.target.value,
                                                            )
                                                        }
                                                        onBlur={
                                                            articleDescrValidation.onBlur
                                                        }
                                                        required
                                                        placeholder="Descrizione articolo"
                                                        maxLength={255}
                                                        aria-invalid={
                                                            articleDescrValidation.error
                                                                ? 'true'
                                                                : 'false'
                                                        }
                                                        className={
                                                            articleDescrValidation.error
                                                                ? 'border-destructive'
                                                                : ''
                                                        }
                                                    />
                                                    {articleDescrValidation.error && (
                                                        <p className="text-xs text-destructive">
                                                            {
                                                                articleDescrValidation.error
                                                            }
                                                        </p>
                                                    )}
                                                    <p className="text-xs text-muted-foreground">
                                                        Descrizione principale
                                                        dell'articolo (massimo
                                                        255 caratteri).
                                                    </p>
                                                    <InputError
                                                        message={
                                                            allErrors.article_descr
                                                        }
                                                    />
                                                </div>

                                                <div className="grid gap-2">
                                                    <FormLabel htmlFor="cod_article_client">
                                                        Codice Cliente
                                                    </FormLabel>
                                                    <Input
                                                        id="cod_article_client"
                                                        name="cod_article_client"
                                                        defaultValue={
                                                            article.cod_article_client ||
                                                            ''
                                                        }
                                                        placeholder="Codice cliente"
                                                        maxLength={255}
                                                        aria-describedby="cod_article_client-help"
                                                    />
                                                    <p
                                                        id="cod_article_client-help"
                                                        className="text-xs text-muted-foreground"
                                                    >
                                                        Codice articolo del
                                                        cliente (massimo 255
                                                        caratteri).
                                                    </p>
                                                    <InputError
                                                        message={
                                                            allErrors.cod_article_client
                                                        }
                                                    />
                                                </div>

                                                <div className="grid gap-2">
                                                    <FormLabel htmlFor="additional_descr">
                                                        Descrizione Aggiuntiva
                                                    </FormLabel>
                                                    <Textarea
                                                        id="additional_descr"
                                                        name="additional_descr"
                                                        defaultValue={
                                                            article.additional_descr ||
                                                            ''
                                                        }
                                                        placeholder="Descrizione aggiuntiva dell'articolo"
                                                        rows={3}
                                                        aria-describedby="additional_descr-help"
                                                    />
                                                    <p
                                                        id="additional_descr-help"
                                                        className="text-xs text-muted-foreground"
                                                    >
                                                        Descrizione aggiuntiva
                                                        opzionale dell'articolo.
                                                    </p>
                                                    <InputError
                                                        message={
                                                            allErrors.additional_descr
                                                        }
                                                    />
                                                </div>

                                                <div className="flex items-center space-x-2">
                                                    <Checkbox
                                                        id="visibility_cod"
                                                        name="visibility_cod"
                                                        checked={visibilityCod}
                                                        onCheckedChange={(
                                                            checked,
                                                        ) =>
                                                            setVisibilityCod(
                                                                checked ===
                                                                    true,
                                                            )
                                                        }
                                                    />
                                                    <label
                                                        htmlFor="visibility_cod"
                                                        className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                                    >
                                                        Visibilità codice LAS su
                                                        ordine
                                                    </label>
                                                </div>

                                                <div className="flex items-center space-x-2">
                                                    <Checkbox
                                                        id="stock_managed"
                                                        name="stock_managed"
                                                        checked={stockManaged}
                                                        onCheckedChange={(
                                                            checked,
                                                        ) =>
                                                            setStockManaged(
                                                                checked ===
                                                                    true,
                                                            )
                                                        }
                                                    />
                                                    <label
                                                        htmlFor="stock_managed"
                                                        className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                                    >
                                                        Articolo gestito a
                                                        magazzino
                                                    </label>
                                                </div>

                                                {actualUm && (
                                                    <div className="grid gap-2">
                                                        <FormLabel htmlFor="um">
                                                            U.m.
                                                        </FormLabel>
                                                        <Input
                                                            id="um"
                                                            name="um"
                                                            value={actualUm}
                                                            readOnly
                                                            className="bg-muted"
                                                        />
                                                    </div>
                                                )}

                                                <div className="grid gap-2">
                                                    <FormLabel
                                                        htmlFor="lot_attribution"
                                                        required
                                                    >
                                                        Attribuzione lotto
                                                    </FormLabel>
                                                    <Select
                                                        name="lot_attribution"
                                                        value={lotAttribution}
                                                        onValueChange={
                                                            setLotAttribution
                                                        }
                                                        required
                                                    >
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Seleziona attribuzione lotto" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {actualLotAttributionList.map(
                                                                (option) => (
                                                                    <SelectItem
                                                                        key={
                                                                            option.key
                                                                        }
                                                                        value={option.key.toString()}
                                                                    >
                                                                        {
                                                                            option.value
                                                                        }
                                                                    </SelectItem>
                                                                ),
                                                            )}
                                                        </SelectContent>
                                                    </Select>
                                                    <InputError
                                                        message={
                                                            allErrors.lot_attribution
                                                        }
                                                    />
                                                </div>

                                                <div className="grid gap-2">
                                                    <FormLabel htmlFor="expiration_attribution">
                                                        Attribuzione scadenza
                                                    </FormLabel>
                                                    <Select
                                                        name="expiration_attribution"
                                                        value={
                                                            expirationAttribution
                                                        }
                                                        onValueChange={
                                                            setExpirationAttribution
                                                        }
                                                    >
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Seleziona attribuzione scadenza" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {actualExpirationAttributionList.map(
                                                                (option) => (
                                                                    <SelectItem
                                                                        key={
                                                                            option.key
                                                                        }
                                                                        value={option.key.toString()}
                                                                    >
                                                                        {
                                                                            option.value
                                                                        }
                                                                    </SelectItem>
                                                                ),
                                                            )}
                                                        </SelectContent>
                                                    </Select>
                                                    <InputError
                                                        message={
                                                            allErrors.expiration_attribution
                                                        }
                                                    />
                                                </div>

                                                <div className="grid gap-2">
                                                    <FormLabel htmlFor="ean">
                                                        EAN
                                                    </FormLabel>
                                                    <Input
                                                        id="ean"
                                                        name="ean"
                                                        value={ean}
                                                        onChange={(e) =>
                                                            setEan(
                                                                e.target.value,
                                                            )
                                                        }
                                                        placeholder="EAN"
                                                    />
                                                    <InputError
                                                        message={allErrors.ean}
                                                    />
                                                </div>

                                                <div className="grid gap-2">
                                                    <FormLabel htmlFor="db">
                                                        DB
                                                    </FormLabel>
                                                    <Select
                                                        name="db"
                                                        value={db}
                                                        onValueChange={setDb}
                                                    >
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Seleziona DB" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {actualDbList.map(
                                                                (option) => (
                                                                    <SelectItem
                                                                        key={
                                                                            option.key
                                                                        }
                                                                        value={option.key.toString()}
                                                                    >
                                                                        {
                                                                            option.value
                                                                        }
                                                                    </SelectItem>
                                                                ),
                                                            )}
                                                        </SelectContent>
                                                    </Select>
                                                    <InputError
                                                        message={allErrors.db}
                                                    />
                                                </div>

                                                <div className="grid gap-2">
                                                    <FormLabel htmlFor="article_category">
                                                        Categoria
                                                    </FormLabel>
                                                    <Select
                                                        name="article_category"
                                                        defaultValue={
                                                            article.article_category ||
                                                            undefined
                                                        }
                                                    >
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Seleziona una categoria" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {categories.map(
                                                                (category) => (
                                                                    <SelectItem
                                                                        key={
                                                                            category.uuid
                                                                        }
                                                                        value={
                                                                            category.uuid
                                                                        }
                                                                    >
                                                                        {
                                                                            category.name
                                                                        }
                                                                    </SelectItem>
                                                                ),
                                                            )}
                                                        </SelectContent>
                                                    </Select>
                                                    <InputError
                                                        message={
                                                            allErrors.article_category
                                                        }
                                                    />
                                                </div>

                                                <div className="grid gap-2">
                                                    <FormLabel htmlFor="pallet_uuid">
                                                        Tipo di Pallet
                                                    </FormLabel>
                                                    <Select
                                                        name="pallet_uuid"
                                                        defaultValue={
                                                            article.pallet_uuid ||
                                                            undefined
                                                        }
                                                    >
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Seleziona un tipo di pallet" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {palletTypes.map(
                                                                (pallet) => (
                                                                    <SelectItem
                                                                        key={
                                                                            pallet.uuid
                                                                        }
                                                                        value={
                                                                            pallet.uuid
                                                                        }
                                                                    >
                                                                        {
                                                                            pallet.cod
                                                                        }{' '}
                                                                        -{' '}
                                                                        {pallet.description ||
                                                                            'Senza descrizione'}
                                                                    </SelectItem>
                                                                ),
                                                            )}
                                                        </SelectContent>
                                                    </Select>
                                                    <InputError
                                                        message={
                                                            allErrors.pallet_uuid
                                                        }
                                                    />
                                                </div>

                                                <div className="grid gap-2">
                                                    <FormLabel htmlFor="plan_packaging">
                                                        Piano Imballaggio
                                                    </FormLabel>
                                                    <Input
                                                        id="plan_packaging"
                                                        name="plan_packaging"
                                                        type="number"
                                                        min="0"
                                                        step="1"
                                                        value={planPackaging}
                                                        onChange={(e) =>
                                                            setPlanPackaging(
                                                                e.target.value,
                                                            )
                                                        }
                                                        onBlur={
                                                            planPackagingValidation.onBlur
                                                        }
                                                        placeholder="0"
                                                        aria-invalid={
                                                            planPackagingValidation.error
                                                                ? 'true'
                                                                : 'false'
                                                        }
                                                        className={
                                                            planPackagingValidation.error
                                                                ? 'border-destructive'
                                                                : ''
                                                        }
                                                    />
                                                    {planPackagingValidation.error && (
                                                        <p className="text-xs text-destructive">
                                                            {
                                                                planPackagingValidation.error
                                                            }
                                                        </p>
                                                    )}
                                                    <p className="text-xs text-muted-foreground">
                                                        Numero di pezzi per
                                                        confezione.
                                                    </p>
                                                    <InputError
                                                        message={
                                                            allErrors.plan_packaging
                                                        }
                                                    />
                                                </div>

                                                <div className="grid gap-2">
                                                    <FormLabel htmlFor="pallet_plans">
                                                        Piani Pallet
                                                    </FormLabel>
                                                    <Input
                                                        id="pallet_plans"
                                                        name="pallet_plans"
                                                        type="number"
                                                        min="0"
                                                        step="1"
                                                        value={palletPlans}
                                                        onChange={(e) =>
                                                            setPalletPlans(
                                                                e.target.value,
                                                            )
                                                        }
                                                        onBlur={
                                                            palletPlansValidation.onBlur
                                                        }
                                                        placeholder="0"
                                                        aria-invalid={
                                                            palletPlansValidation.error
                                                                ? 'true'
                                                                : 'false'
                                                        }
                                                        className={
                                                            palletPlansValidation.error
                                                                ? 'border-destructive'
                                                                : ''
                                                        }
                                                    />
                                                    {palletPlansValidation.error && (
                                                        <p className="text-xs text-destructive">
                                                            {
                                                                palletPlansValidation.error
                                                            }
                                                        </p>
                                                    )}
                                                    <p className="text-xs text-muted-foreground">
                                                        Numero di piani per
                                                        pallet.
                                                    </p>
                                                    <InputError
                                                        message={
                                                            allErrors.pallet_plans
                                                        }
                                                    />
                                                </div>

                                                <div className="grid gap-2">
                                                    <FormLabel htmlFor="line_layout_file">
                                                        Allegato Layout Linea
                                                    </FormLabel>
                                                    <Input
                                                        id="line_layout_file"
                                                        name="line_layout_file"
                                                        type="file"
                                                        accept="*/*"
                                                        onChange={(event) => {
                                                            const file =
                                                                event.target
                                                                    .files?.[0];
                                                            setLineLayoutFileName(
                                                                file
                                                                    ? file.name
                                                                    : null,
                                                            );
                                                        }}
                                                    />
                                                    {article.line_layout && (
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-xs text-muted-foreground">
                                                                Allegato
                                                                attuale:{' '}
                                                                {
                                                                    article.line_layout
                                                                }
                                                            </span>
                                                            <Button
                                                                type="button"
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => {
                                                                    window.location.href =
                                                                        articles.downloadLineLayout(
                                                                            {
                                                                                article:
                                                                                    article.uuid,
                                                                            },
                                                                        ).url;
                                                                }}
                                                            >
                                                                <Download className="mr-1 h-3 w-3" />
                                                                Scarica
                                                            </Button>
                                                        </div>
                                                    )}
                                                    {lineLayoutFileName && (
                                                        <span className="text-xs text-muted-foreground">
                                                            Nuovo allegato
                                                            selezionato:{' '}
                                                            <span className="font-mono">
                                                                {
                                                                    lineLayoutFileName
                                                                }
                                                            </span>
                                                        </span>
                                                    )}
                                                    <InputError
                                                        message={
                                                            allErrors.line_layout_file
                                                        }
                                                    />
                                                </div>

                                                {/* Input nascosti per checkbox */}
                                                <input
                                                    type="hidden"
                                                    name="visibility_cod"
                                                    value={
                                                        visibilityCod ? 1 : 0
                                                    }
                                                />
                                                <input
                                                    type="hidden"
                                                    name="stock_managed"
                                                    value={stockManaged ? 1 : 0}
                                                />
                                                <input
                                                    type="hidden"
                                                    name="allergens"
                                                    value={allergens ? 1 : 0}
                                                />
                                                <input
                                                    type="hidden"
                                                    name="production_approval_checkbox"
                                                    value={
                                                        productionApprovalCheckbox
                                                            ? 1
                                                            : 0
                                                    }
                                                />
                                                <input
                                                    type="hidden"
                                                    name="approv_quality_checkbox"
                                                    value={
                                                        approvQualityCheckbox
                                                            ? 1
                                                            : 0
                                                    }
                                                />
                                                <input
                                                    type="hidden"
                                                    name="commercial_approval_checkbox"
                                                    value={
                                                        commercialApprovalCheckbox
                                                            ? 1
                                                            : 0
                                                    }
                                                />
                                                <input
                                                    type="hidden"
                                                    name="client_approval_checkbox"
                                                    value={
                                                        clientApprovalCheckbox
                                                            ? 1
                                                            : 0
                                                    }
                                                />

                                                {/* Input nascosti per relazioni many-to-many */}
                                                {machineryRows
                                                    .filter(
                                                        (row) =>
                                                            row.machineryUuid &&
                                                            row.value,
                                                    )
                                                    .map((row, idx) => (
                                                        <input
                                                            key={`machinery-${idx}`}
                                                            type="hidden"
                                                            name={`machinery[${idx}][machinery_uuid]`}
                                                            value={
                                                                row.machineryUuid
                                                            }
                                                        />
                                                    ))}
                                                {machineryRows
                                                    .filter(
                                                        (row) =>
                                                            row.machineryUuid &&
                                                            row.value,
                                                    )
                                                    .map((row, idx) => (
                                                        <input
                                                            key={`machinery-value-${idx}`}
                                                            type="hidden"
                                                            name={`machinery[${idx}][value]`}
                                                            value={row.value}
                                                        />
                                                    ))}
                                                {materialRows
                                                    .filter(
                                                        (row) =>
                                                            row.materialUuid,
                                                    )
                                                    .map((row, idx) => (
                                                        <input
                                                            key={`material-${idx}`}
                                                            type="hidden"
                                                            name={`materials[${idx}]`}
                                                            value={
                                                                row.materialUuid
                                                            }
                                                        />
                                                    ))}
                                                {criticalIssueRows
                                                    .filter(
                                                        (row) =>
                                                            row.criticalIssueUuid,
                                                    )
                                                    .map((row, idx) => (
                                                        <input
                                                            key={`critical-${idx}`}
                                                            type="hidden"
                                                            name={`critical_issues[${idx}]`}
                                                            value={
                                                                row.criticalIssueUuid
                                                            }
                                                        />
                                                    ))}
                                                {packagingInstructionRows
                                                    .filter(
                                                        (row) =>
                                                            row.instructionUuid,
                                                    )
                                                    .map((row, idx) => (
                                                        <input
                                                            key={`packaging-${idx}`}
                                                            type="hidden"
                                                            name={`packaging_instructions[${idx}]`}
                                                            value={
                                                                row.instructionUuid
                                                            }
                                                        />
                                                    ))}
                                                {operatingInstructionRows
                                                    .filter(
                                                        (row) =>
                                                            row.instructionUuid,
                                                    )
                                                    .map((row, idx) => (
                                                        <input
                                                            key={`operating-${idx}`}
                                                            type="hidden"
                                                            name={`operating_instructions[${idx}]`}
                                                            value={
                                                                row.instructionUuid
                                                            }
                                                        />
                                                    ))}
                                                {palletizingInstructionRows
                                                    .filter(
                                                        (row) =>
                                                            row.instructionUuid,
                                                    )
                                                    .map((row, idx) => (
                                                        <input
                                                            key={`palletizing-${idx}`}
                                                            type="hidden"
                                                            name={`palletizing_instructions[${idx}]`}
                                                            value={
                                                                row.instructionUuid
                                                            }
                                                        />
                                                    ))}
                                                {checkMaterialRows
                                                    .filter(
                                                        (row) =>
                                                            row.materialUuid &&
                                                            row.um &&
                                                            row.quantityExpected &&
                                                            row.quantityEffective,
                                                    )
                                                    .map((row, idx) => (
                                                        <>
                                                            <input
                                                                key={`check-material-${idx}-uuid`}
                                                                type="hidden"
                                                                name={`check_materials[${idx}][material_uuid]`}
                                                                value={
                                                                    row.materialUuid
                                                                }
                                                            />
                                                            <input
                                                                key={`check-material-${idx}-um`}
                                                                type="hidden"
                                                                name={`check_materials[${idx}][um]`}
                                                                value={row.um}
                                                            />
                                                            <input
                                                                key={`check-material-${idx}-expected`}
                                                                type="hidden"
                                                                name={`check_materials[${idx}][quantity_expected]`}
                                                                value={
                                                                    row.quantityExpected
                                                                }
                                                            />
                                                            <input
                                                                key={`check-material-${idx}-effective`}
                                                                type="hidden"
                                                                name={`check_materials[${idx}][quantity_effective]`}
                                                                value={
                                                                    row.quantityEffective
                                                                }
                                                            />
                                                        </>
                                                    ))}

                                                {/* Sezione Etichette */}
                                                <Card>
                                                    <CardHeader>
                                                        <CardTitle className="text-lg">
                                                            Etichette
                                                        </CardTitle>
                                                    </CardHeader>
                                                    <CardContent className="space-y-4">
                                                        <div className="grid gap-2">
                                                            <FormLabel htmlFor="labels_external">
                                                                Etichette
                                                                esterne
                                                            </FormLabel>
                                                            <Select
                                                                name="labels_external"
                                                                value={
                                                                    labelsExternal
                                                                }
                                                                onValueChange={
                                                                    setLabelsExternal
                                                                }
                                                            >
                                                                <SelectTrigger>
                                                                    <SelectValue placeholder="Seleziona etichette esterne" />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    {actualLabelsExternalList.map(
                                                                        (
                                                                            option,
                                                                        ) => (
                                                                            <SelectItem
                                                                                key={
                                                                                    option.key
                                                                                }
                                                                                value={option.key.toString()}
                                                                            >
                                                                                {
                                                                                    option.value
                                                                                }
                                                                            </SelectItem>
                                                                        ),
                                                                    )}
                                                                </SelectContent>
                                                            </Select>
                                                        </div>

                                                        <div className="grid gap-2">
                                                            <FormLabel htmlFor="labels_pvp">
                                                                Etichette pvp
                                                            </FormLabel>
                                                            <Select
                                                                name="labels_pvp"
                                                                value={
                                                                    labelsPvp
                                                                }
                                                                onValueChange={
                                                                    setLabelsPvp
                                                                }
                                                            >
                                                                <SelectTrigger>
                                                                    <SelectValue placeholder="Seleziona etichetta pvp" />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    {actualLabelsPvpList.map(
                                                                        (
                                                                            option,
                                                                        ) => (
                                                                            <SelectItem
                                                                                key={
                                                                                    option.key
                                                                                }
                                                                                value={option.key.toString()}
                                                                            >
                                                                                {
                                                                                    option.value
                                                                                }
                                                                            </SelectItem>
                                                                        ),
                                                                    )}
                                                                </SelectContent>
                                                            </Select>
                                                        </div>

                                                        <div className="grid gap-2">
                                                            <FormLabel htmlFor="value_pvp">
                                                                Valore pvp
                                                            </FormLabel>
                                                            <div className="flex items-center gap-2">
                                                                <Input
                                                                    id="value_pvp"
                                                                    name="value_pvp"
                                                                    type="number"
                                                                    step="0.01"
                                                                    value={
                                                                        valuePvp
                                                                    }
                                                                    onChange={(
                                                                        e,
                                                                    ) =>
                                                                        setValuePvp(
                                                                            e
                                                                                .target
                                                                                .value,
                                                                        )
                                                                    }
                                                                    placeholder="0.00"
                                                                    className="text-right"
                                                                />
                                                                <span className="text-sm text-muted-foreground">
                                                                    pvp
                                                                </span>
                                                            </div>
                                                        </div>

                                                        <div className="grid gap-2">
                                                            <FormLabel htmlFor="labels_ingredient">
                                                                Etichette
                                                                ingredienti
                                                            </FormLabel>
                                                            <Select
                                                                name="labels_ingredient"
                                                                value={
                                                                    labelsIngredient
                                                                }
                                                                onValueChange={
                                                                    setLabelsIngredient
                                                                }
                                                            >
                                                                <SelectTrigger>
                                                                    <SelectValue placeholder="Seleziona etichetta ingrediente" />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    {actualLabelsIngredientList.map(
                                                                        (
                                                                            option,
                                                                        ) => (
                                                                            <SelectItem
                                                                                key={
                                                                                    option.key
                                                                                }
                                                                                value={option.key.toString()}
                                                                            >
                                                                                {
                                                                                    option.value
                                                                                }
                                                                            </SelectItem>
                                                                        ),
                                                                    )}
                                                                </SelectContent>
                                                            </Select>
                                                        </div>

                                                        <div className="grid gap-2">
                                                            <FormLabel htmlFor="labels_data_variable">
                                                                Etichette dati
                                                                variabili
                                                            </FormLabel>
                                                            <Select
                                                                name="labels_data_variable"
                                                                value={
                                                                    labelsDataVariable
                                                                }
                                                                onValueChange={
                                                                    setLabelsDataVariable
                                                                }
                                                            >
                                                                <SelectTrigger>
                                                                    <SelectValue placeholder="Seleziona etichetta dati variabili" />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    {actualLabelsDataVariableList.map(
                                                                        (
                                                                            option,
                                                                        ) => (
                                                                            <SelectItem
                                                                                key={
                                                                                    option.key
                                                                                }
                                                                                value={option.key.toString()}
                                                                            >
                                                                                {
                                                                                    option.value
                                                                                }
                                                                            </SelectItem>
                                                                        ),
                                                                    )}
                                                                </SelectContent>
                                                            </Select>
                                                        </div>

                                                        <div className="grid gap-2">
                                                            <FormLabel htmlFor="label_of_jumpers">
                                                                Etichetta
                                                                cavallotti
                                                            </FormLabel>
                                                            <Select
                                                                name="label_of_jumpers"
                                                                value={
                                                                    labelOfJumpers
                                                                }
                                                                onValueChange={
                                                                    setLabelOfJumpers
                                                                }
                                                            >
                                                                <SelectTrigger>
                                                                    <SelectValue placeholder="Seleziona etichetta cavallotto" />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    {actualLabelOfJumpersList.map(
                                                                        (
                                                                            option,
                                                                        ) => (
                                                                            <SelectItem
                                                                                key={
                                                                                    option.key
                                                                                }
                                                                                value={option.key.toString()}
                                                                            >
                                                                                {
                                                                                    option.value
                                                                                }
                                                                            </SelectItem>
                                                                        ),
                                                                    )}
                                                                </SelectContent>
                                                            </Select>
                                                        </div>
                                                    </CardContent>
                                                </Card>

                                                {/* Sezione Peso e Controllo */}
                                                <Card>
                                                    <CardHeader>
                                                        <CardTitle className="text-lg">
                                                            Peso e Controllo
                                                        </CardTitle>
                                                    </CardHeader>
                                                    <CardContent className="space-y-4">
                                                        <div className="grid gap-2">
                                                            <FormLabel htmlFor="weight_kg">
                                                                Peso collo
                                                            </FormLabel>
                                                            <div className="flex items-center gap-2">
                                                                <Input
                                                                    id="weight_kg"
                                                                    name="weight_kg"
                                                                    type="number"
                                                                    step="0.001"
                                                                    value={
                                                                        weightKg
                                                                    }
                                                                    onChange={(
                                                                        e,
                                                                    ) =>
                                                                        setWeightKg(
                                                                            e
                                                                                .target
                                                                                .value,
                                                                        )
                                                                    }
                                                                    placeholder="0.000"
                                                                    className="text-right"
                                                                />
                                                                <span className="text-sm text-muted-foreground">
                                                                    kg
                                                                </span>
                                                            </div>
                                                        </div>

                                                        <div className="grid gap-2">
                                                            <FormLabel htmlFor="nominal_weight_control">
                                                                Controllo peso
                                                            </FormLabel>
                                                            <Select
                                                                name="nominal_weight_control"
                                                                value={
                                                                    nominalWeightControl
                                                                }
                                                                onValueChange={
                                                                    setNominalWeightControl
                                                                }
                                                            >
                                                                <SelectTrigger>
                                                                    <SelectValue placeholder="Seleziona controllo peso" />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    {actualNominalWeightControlList.map(
                                                                        (
                                                                            option,
                                                                        ) => (
                                                                            <SelectItem
                                                                                key={
                                                                                    option.key
                                                                                }
                                                                                value={option.key.toString()}
                                                                            >
                                                                                {
                                                                                    option.value
                                                                                }
                                                                            </SelectItem>
                                                                        ),
                                                                    )}
                                                                </SelectContent>
                                                            </Select>
                                                        </div>

                                                        <div className="grid gap-2">
                                                            <FormLabel htmlFor="weight_unit_of_measur">
                                                                Unità di misura
                                                            </FormLabel>
                                                            <Input
                                                                id="weight_unit_of_measur"
                                                                name="weight_unit_of_measur"
                                                                value={
                                                                    weightUnitOfMeasur
                                                                }
                                                                onChange={(e) =>
                                                                    setWeightUnitOfMeasur(
                                                                        e.target
                                                                            .value,
                                                                    )
                                                                }
                                                                placeholder="Unità di misura"
                                                            />
                                                        </div>

                                                        <div className="grid gap-2">
                                                            <FormLabel htmlFor="weight_value">
                                                                Valore
                                                            </FormLabel>
                                                            <Input
                                                                id="weight_value"
                                                                name="weight_value"
                                                                type="number"
                                                                step="0.001"
                                                                value={
                                                                    weightValue
                                                                }
                                                                onChange={(e) =>
                                                                    setWeightValue(
                                                                        e.target
                                                                            .value,
                                                                    )
                                                                }
                                                                placeholder="0.000"
                                                                className="text-right"
                                                            />
                                                        </div>

                                                        <div className="grid gap-2">
                                                            <FormLabel htmlFor="object_control_weight">
                                                                Oggetto del
                                                                controllo
                                                            </FormLabel>
                                                            <Select
                                                                name="object_control_weight"
                                                                value={
                                                                    objectControlWeight
                                                                }
                                                                onValueChange={
                                                                    setObjectControlWeight
                                                                }
                                                            >
                                                                <SelectTrigger>
                                                                    <SelectValue placeholder="Seleziona oggetto del controllo" />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    {actualObjectControlWeightList.map(
                                                                        (
                                                                            option,
                                                                        ) => (
                                                                            <SelectItem
                                                                                key={
                                                                                    option.key
                                                                                }
                                                                                value={option.key.toString()}
                                                                            >
                                                                                {
                                                                                    option.value
                                                                                }
                                                                            </SelectItem>
                                                                        ),
                                                                    )}
                                                                </SelectContent>
                                                            </Select>
                                                        </div>
                                                    </CardContent>
                                                </Card>

                                                {/* Sezione Campi Aggiuntivi */}
                                                <Card>
                                                    <CardHeader>
                                                        <CardTitle className="text-lg">
                                                            Altri Campi
                                                        </CardTitle>
                                                    </CardHeader>
                                                    <CardContent className="space-y-4">
                                                        <div className="flex items-center space-x-2">
                                                            <Checkbox
                                                                id="allergens"
                                                                name="allergens"
                                                                checked={
                                                                    allergens
                                                                }
                                                                onCheckedChange={(
                                                                    checked,
                                                                ) =>
                                                                    setAllergens(
                                                                        checked ===
                                                                            true,
                                                                    )
                                                                }
                                                            />
                                                            <label
                                                                htmlFor="allergens"
                                                                className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                                            >
                                                                Allergeni
                                                            </label>
                                                        </div>

                                                        <div className="grid gap-2">
                                                            <FormLabel htmlFor="pallet_sheet">
                                                                Foglio pallet
                                                                richiesto da
                                                                cliente
                                                            </FormLabel>
                                                            <Select
                                                                name="pallet_sheet"
                                                                value={
                                                                    palletSheet
                                                                }
                                                                onValueChange={
                                                                    setPalletSheet
                                                                }
                                                            >
                                                                <SelectTrigger>
                                                                    <SelectValue placeholder="Seleziona foglio pallet" />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    {actualPalletSheets.map(
                                                                        (
                                                                            sheet,
                                                                        ) => (
                                                                            <SelectItem
                                                                                key={
                                                                                    sheet.uuid
                                                                                }
                                                                                value={
                                                                                    sheet.uuid
                                                                                }
                                                                            >
                                                                                {
                                                                                    sheet.code
                                                                                }{' '}
                                                                                -{' '}
                                                                                {sheet.description ||
                                                                                    'Senza descrizione'}
                                                                            </SelectItem>
                                                                        ),
                                                                    )}
                                                                </SelectContent>
                                                            </Select>
                                                        </div>

                                                        <div className="grid gap-2">
                                                            <FormLabel
                                                                htmlFor="model_uuid"
                                                                required
                                                            >
                                                                Modello CQ
                                                            </FormLabel>
                                                            <Select
                                                                name="model_uuid"
                                                                value={
                                                                    modelUuid
                                                                }
                                                                onValueChange={
                                                                    setModelUuid
                                                                }
                                                                required
                                                            >
                                                                <SelectTrigger>
                                                                    <SelectValue placeholder="Seleziona modello CQ" />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    {actualCqModels.map(
                                                                        (
                                                                            model,
                                                                        ) => (
                                                                            <SelectItem
                                                                                key={
                                                                                    model.uuid
                                                                                }
                                                                                value={
                                                                                    model.uuid
                                                                                }
                                                                            >
                                                                                {
                                                                                    model.cod_model
                                                                                }{' '}
                                                                                -{' '}
                                                                                {model.description_model ||
                                                                                    'Senza descrizione'}
                                                                            </SelectItem>
                                                                        ),
                                                                    )}
                                                                </SelectContent>
                                                            </Select>
                                                            <InputError
                                                                message={
                                                                    allErrors.model_uuid
                                                                }
                                                            />
                                                        </div>

                                                        <div className="grid gap-2">
                                                            <FormLabel htmlFor="customer_samples_list">
                                                                Campioni cliente
                                                            </FormLabel>
                                                            <Select
                                                                name="customer_samples_list"
                                                                value={
                                                                    customerSamplesListValue
                                                                }
                                                                onValueChange={
                                                                    setCustomerSamplesListValue
                                                                }
                                                            >
                                                                <SelectTrigger>
                                                                    <SelectValue placeholder="Seleziona campione cliente" />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    {actualCustomerSamplesList.map(
                                                                        (
                                                                            option,
                                                                        ) => (
                                                                            <SelectItem
                                                                                key={
                                                                                    option.key
                                                                                }
                                                                                value={option.key.toString()}
                                                                            >
                                                                                {
                                                                                    option.value
                                                                                }
                                                                            </SelectItem>
                                                                        ),
                                                                    )}
                                                                </SelectContent>
                                                            </Select>
                                                        </div>
                                                    </CardContent>
                                                </Card>

                                                {/* Sezione Media Produttività */}
                                                {actualMediaValues && (
                                                    <Card>
                                                        <CardHeader>
                                                            <CardTitle className="text-lg">
                                                                Media
                                                                Produttività
                                                            </CardTitle>
                                                        </CardHeader>
                                                        <CardContent className="space-y-4">
                                                            <div className="grid grid-cols-2 gap-4">
                                                                <div className="grid gap-2">
                                                                    <FormLabel htmlFor="media_prevista_cfz_h_pz">
                                                                        Media
                                                                        prevista
                                                                        cfz/h/pz
                                                                    </FormLabel>
                                                                    <div className="flex items-center gap-2">
                                                                        <Input
                                                                            id="media_prevista_cfz_h_pz"
                                                                            name="media_prevista_cfz_h_pz"
                                                                            value={actualMediaValues.media_prevista_cfz_h_pz.toFixed(
                                                                                5,
                                                                            )}
                                                                            readOnly
                                                                            className="bg-muted text-right"
                                                                        />
                                                                        <span className="text-sm text-muted-foreground">
                                                                            cfz/h/pz
                                                                        </span>
                                                                    </div>
                                                                </div>

                                                                <div className="grid gap-2">
                                                                    <FormLabel htmlFor="media_reale_cfz_h_pz">
                                                                        Media
                                                                        reale
                                                                        cfz/h/pz
                                                                    </FormLabel>
                                                                    <div className="flex items-center gap-2">
                                                                        <Input
                                                                            id="media_reale_cfz_h_pz"
                                                                            name="media_reale_cfz_h_pz"
                                                                            type="number"
                                                                            step="0.00001"
                                                                            value={
                                                                                mediaRealeCfzHPz
                                                                            }
                                                                            onChange={(
                                                                                e,
                                                                            ) =>
                                                                                setMediaRealeCfzHPz(
                                                                                    e
                                                                                        .target
                                                                                        .value,
                                                                                )
                                                                            }
                                                                            placeholder="0.00000"
                                                                            className="text-right"
                                                                        />
                                                                        <span className="text-sm text-muted-foreground">
                                                                            cfz/h/pz
                                                                        </span>
                                                                    </div>
                                                                </div>

                                                                <div className="grid gap-2">
                                                                    <FormLabel htmlFor="media_prevista_pz_h_ps">
                                                                        Media
                                                                        prevista
                                                                        pz/h/ps
                                                                    </FormLabel>
                                                                    <div className="flex items-center gap-2">
                                                                        <Input
                                                                            id="media_prevista_pz_h_ps"
                                                                            name="media_prevista_pz_h_ps"
                                                                            value={actualMediaValues.media_prevista_pz_h_ps.toFixed(
                                                                                5,
                                                                            )}
                                                                            readOnly
                                                                            className="bg-muted text-right"
                                                                        />
                                                                        <span className="text-sm text-muted-foreground">
                                                                            pz/h/ps
                                                                        </span>
                                                                    </div>
                                                                </div>

                                                                <div className="grid gap-2">
                                                                    <FormLabel htmlFor="media_reale_pz_h_ps">
                                                                        Media
                                                                        reale
                                                                        pz/h/ps
                                                                    </FormLabel>
                                                                    <div className="flex items-center gap-2">
                                                                        <Input
                                                                            id="media_reale_pz_h_ps"
                                                                            name="media_reale_pz_h_ps"
                                                                            value={
                                                                                mediaRealeCfzHPz &&
                                                                                actualPiecesPerPackage
                                                                                    ? (
                                                                                          parseFloat(
                                                                                              mediaRealeCfzHPz,
                                                                                          ) *
                                                                                          actualPiecesPerPackage
                                                                                      ).toFixed(
                                                                                          5,
                                                                                      )
                                                                                    : actualMediaRealePzHPs.toFixed(
                                                                                          5,
                                                                                      )
                                                                            }
                                                                            readOnly
                                                                            className="bg-muted text-right"
                                                                        />
                                                                        <span className="text-sm text-muted-foreground">
                                                                            pz/h/ps
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </CardContent>
                                                    </Card>
                                                )}

                                                {/* Sezione Approvazioni */}
                                                <Card>
                                                    <CardHeader>
                                                        <CardTitle className="text-lg">
                                                            Approvazioni
                                                        </CardTitle>
                                                    </CardHeader>
                                                    <CardContent className="space-y-6">
                                                        {/* Approvazione Produzione */}
                                                        <div className="space-y-3 border-b pb-4">
                                                            <FormLabel htmlFor="production_approval_checkbox">
                                                                Approvazione
                                                                Produzione
                                                            </FormLabel>
                                                            <div className="flex items-center space-x-2">
                                                                <Checkbox
                                                                    id="production_approval_checkbox"
                                                                    name="production_approval_checkbox"
                                                                    checked={
                                                                        productionApprovalCheckbox
                                                                    }
                                                                    onCheckedChange={(
                                                                        checked,
                                                                    ) =>
                                                                        setProductionApprovalCheckbox(
                                                                            checked ===
                                                                                true,
                                                                        )
                                                                    }
                                                                />
                                                                <label
                                                                    htmlFor="production_approval_checkbox"
                                                                    className="text-sm font-medium"
                                                                >
                                                                    Approvato
                                                                </label>
                                                            </div>
                                                            <div className="grid gap-2">
                                                                <FormLabel htmlFor="production_approval_employee">
                                                                    Addetto
                                                                </FormLabel>
                                                                <Input
                                                                    id="production_approval_employee"
                                                                    name="production_approval_employee"
                                                                    value={
                                                                        productionApprovalEmployee
                                                                    }
                                                                    onChange={(
                                                                        e,
                                                                    ) =>
                                                                        setProductionApprovalEmployee(
                                                                            e
                                                                                .target
                                                                                .value,
                                                                        )
                                                                    }
                                                                    placeholder="Addetto"
                                                                />
                                                            </div>
                                                            <div className="grid gap-2">
                                                                <FormLabel htmlFor="production_approval_date">
                                                                    Data
                                                                </FormLabel>
                                                                <Input
                                                                    id="production_approval_date"
                                                                    name="production_approval_date"
                                                                    type="date"
                                                                    value={
                                                                        productionApprovalDate
                                                                    }
                                                                    onChange={(
                                                                        e,
                                                                    ) =>
                                                                        setProductionApprovalDate(
                                                                            e
                                                                                .target
                                                                                .value,
                                                                        )
                                                                    }
                                                                    min="2005-01-01"
                                                                    max="2099-12-31"
                                                                />
                                                            </div>
                                                            <div className="grid gap-2">
                                                                <FormLabel htmlFor="production_approval_notes">
                                                                    Note
                                                                </FormLabel>
                                                                <Textarea
                                                                    id="production_approval_notes"
                                                                    name="production_approval_notes"
                                                                    value={
                                                                        productionApprovalNotes
                                                                    }
                                                                    onChange={(
                                                                        e,
                                                                    ) =>
                                                                        setProductionApprovalNotes(
                                                                            e
                                                                                .target
                                                                                .value,
                                                                        )
                                                                    }
                                                                    rows={2}
                                                                />
                                                            </div>
                                                        </div>

                                                        {/* Approvazione Qualità */}
                                                        <div className="space-y-3 border-b pb-4">
                                                            <FormLabel htmlFor="approv_quality_checkbox">
                                                                Approvazione
                                                                Qualità
                                                            </FormLabel>
                                                            <div className="flex items-center space-x-2">
                                                                <Checkbox
                                                                    id="approv_quality_checkbox"
                                                                    name="approv_quality_checkbox"
                                                                    checked={
                                                                        approvQualityCheckbox
                                                                    }
                                                                    onCheckedChange={(
                                                                        checked,
                                                                    ) =>
                                                                        setApprovQualityCheckbox(
                                                                            checked ===
                                                                                true,
                                                                        )
                                                                    }
                                                                />
                                                                <label
                                                                    htmlFor="approv_quality_checkbox"
                                                                    className="text-sm font-medium"
                                                                >
                                                                    Approvato
                                                                </label>
                                                            </div>
                                                            <div className="grid gap-2">
                                                                <FormLabel htmlFor="approv_quality_employee">
                                                                    Addetto
                                                                </FormLabel>
                                                                <Input
                                                                    id="approv_quality_employee"
                                                                    name="approv_quality_employee"
                                                                    value={
                                                                        approvQualityEmployee
                                                                    }
                                                                    onChange={(
                                                                        e,
                                                                    ) =>
                                                                        setApprovQualityEmployee(
                                                                            e
                                                                                .target
                                                                                .value,
                                                                        )
                                                                    }
                                                                    placeholder="Addetto"
                                                                />
                                                            </div>
                                                            <div className="grid gap-2">
                                                                <FormLabel htmlFor="approv_quality_date">
                                                                    Data
                                                                </FormLabel>
                                                                <Input
                                                                    id="approv_quality_date"
                                                                    name="approv_quality_date"
                                                                    type="date"
                                                                    value={
                                                                        approvQualityDate
                                                                    }
                                                                    onChange={(
                                                                        e,
                                                                    ) =>
                                                                        setApprovQualityDate(
                                                                            e
                                                                                .target
                                                                                .value,
                                                                        )
                                                                    }
                                                                    min="2005-01-01"
                                                                    max="2099-12-31"
                                                                />
                                                            </div>
                                                            <div className="grid gap-2">
                                                                <FormLabel htmlFor="approv_quality_notes">
                                                                    Note
                                                                </FormLabel>
                                                                <Textarea
                                                                    id="approv_quality_notes"
                                                                    name="approv_quality_notes"
                                                                    value={
                                                                        approvQualityNotes
                                                                    }
                                                                    onChange={(
                                                                        e,
                                                                    ) =>
                                                                        setApprovQualityNotes(
                                                                            e
                                                                                .target
                                                                                .value,
                                                                        )
                                                                    }
                                                                    rows={2}
                                                                />
                                                            </div>
                                                        </div>

                                                        {/* Approvazione Commerciale */}
                                                        <div className="space-y-3 border-b pb-4">
                                                            <FormLabel htmlFor="commercial_approval_checkbox">
                                                                Approvazione
                                                                Commerciale
                                                            </FormLabel>
                                                            <div className="flex items-center space-x-2">
                                                                <Checkbox
                                                                    id="commercial_approval_checkbox"
                                                                    name="commercial_approval_checkbox"
                                                                    checked={
                                                                        commercialApprovalCheckbox
                                                                    }
                                                                    onCheckedChange={(
                                                                        checked,
                                                                    ) =>
                                                                        setCommercialApprovalCheckbox(
                                                                            checked ===
                                                                                true,
                                                                        )
                                                                    }
                                                                />
                                                                <label
                                                                    htmlFor="commercial_approval_checkbox"
                                                                    className="text-sm font-medium"
                                                                >
                                                                    Approvato
                                                                </label>
                                                            </div>
                                                            <div className="grid gap-2">
                                                                <FormLabel htmlFor="commercial_approval_employee">
                                                                    Addetto
                                                                </FormLabel>
                                                                <Input
                                                                    id="commercial_approval_employee"
                                                                    name="commercial_approval_employee"
                                                                    value={
                                                                        commercialApprovalEmployee
                                                                    }
                                                                    onChange={(
                                                                        e,
                                                                    ) =>
                                                                        setCommercialApprovalEmployee(
                                                                            e
                                                                                .target
                                                                                .value,
                                                                        )
                                                                    }
                                                                    placeholder="Addetto"
                                                                />
                                                            </div>
                                                            <div className="grid gap-2">
                                                                <FormLabel htmlFor="commercial_approval_date">
                                                                    Data
                                                                </FormLabel>
                                                                <Input
                                                                    id="commercial_approval_date"
                                                                    name="commercial_approval_date"
                                                                    type="date"
                                                                    value={
                                                                        commercialApprovalDate
                                                                    }
                                                                    onChange={(
                                                                        e,
                                                                    ) =>
                                                                        setCommercialApprovalDate(
                                                                            e
                                                                                .target
                                                                                .value,
                                                                        )
                                                                    }
                                                                    min="2005-01-01"
                                                                    max="2099-12-31"
                                                                />
                                                            </div>
                                                            <div className="grid gap-2">
                                                                <FormLabel htmlFor="commercial_approval_notes">
                                                                    Note
                                                                </FormLabel>
                                                                <Textarea
                                                                    id="commercial_approval_notes"
                                                                    name="commercial_approval_notes"
                                                                    value={
                                                                        commercialApprovalNotes
                                                                    }
                                                                    onChange={(
                                                                        e,
                                                                    ) =>
                                                                        setCommercialApprovalNotes(
                                                                            e
                                                                                .target
                                                                                .value,
                                                                        )
                                                                    }
                                                                    rows={2}
                                                                />
                                                            </div>
                                                        </div>

                                                        {/* Approvazione Cliente */}
                                                        <div className="space-y-3">
                                                            <FormLabel htmlFor="client_approval_checkbox">
                                                                Approvazione
                                                                Cliente
                                                            </FormLabel>
                                                            <div className="flex items-center space-x-2">
                                                                <Checkbox
                                                                    id="client_approval_checkbox"
                                                                    name="client_approval_checkbox"
                                                                    checked={
                                                                        clientApprovalCheckbox
                                                                    }
                                                                    onCheckedChange={(
                                                                        checked,
                                                                    ) => {
                                                                        setClientApprovalCheckbox(
                                                                            checked ===
                                                                                true,
                                                                        );
                                                                        // Sincronizzare check_approval (anche in backend)
                                                                    }}
                                                                />
                                                                <label
                                                                    htmlFor="client_approval_checkbox"
                                                                    className="text-sm font-medium"
                                                                >
                                                                    Approvato
                                                                </label>
                                                            </div>
                                                            <div className="grid gap-2">
                                                                <FormLabel htmlFor="client_approval_employee">
                                                                    Addetto
                                                                </FormLabel>
                                                                <Input
                                                                    id="client_approval_employee"
                                                                    name="client_approval_employee"
                                                                    value={
                                                                        clientApprovalEmployee
                                                                    }
                                                                    onChange={(
                                                                        e,
                                                                    ) =>
                                                                        setClientApprovalEmployee(
                                                                            e
                                                                                .target
                                                                                .value,
                                                                        )
                                                                    }
                                                                    placeholder="Addetto"
                                                                />
                                                            </div>
                                                            <div className="grid gap-2">
                                                                <FormLabel htmlFor="client_approval_date">
                                                                    Data
                                                                </FormLabel>
                                                                <Input
                                                                    id="client_approval_date"
                                                                    name="client_approval_date"
                                                                    type="date"
                                                                    value={
                                                                        clientApprovalDate
                                                                    }
                                                                    onChange={(
                                                                        e,
                                                                    ) =>
                                                                        setClientApprovalDate(
                                                                            e
                                                                                .target
                                                                                .value,
                                                                        )
                                                                    }
                                                                    min="2005-01-01"
                                                                    max="2099-12-31"
                                                                />
                                                            </div>
                                                            <div className="grid gap-2">
                                                                <FormLabel htmlFor="client_approval_notes">
                                                                    Note
                                                                </FormLabel>
                                                                <Textarea
                                                                    id="client_approval_notes"
                                                                    name="client_approval_notes"
                                                                    value={
                                                                        clientApprovalNotes
                                                                    }
                                                                    onChange={(
                                                                        e,
                                                                    ) =>
                                                                        setClientApprovalNotes(
                                                                            e
                                                                                .target
                                                                                .value,
                                                                        )
                                                                    }
                                                                    rows={2}
                                                                />
                                                            </div>
                                                        </div>
                                                    </CardContent>
                                                </Card>

                                                <div className="flex items-center gap-4">
                                                    <Button
                                                        type="submit"
                                                        disabled={processing}
                                                    >
                                                        {processing
                                                            ? 'Salvando...'
                                                            : 'Salva Modifiche'}
                                                    </Button>
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        onClick={() =>
                                                            router.visit(
                                                                articles.show({
                                                                    article:
                                                                        article.uuid,
                                                                }).url,
                                                            )
                                                        }
                                                    >
                                                        Annulla
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
