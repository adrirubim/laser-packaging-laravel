import { ConfirmCloseDialog } from '@/components/confirm-close-dialog';
import { FormValidationNotification } from '@/components/form-validation-notification';
import { FormLabel } from '@/components/FormLabel';
import InputError from '@/components/input-error';
import { Alert, AlertDescription } from '@/components/ui/alert';
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
import { useTranslations } from '@/hooks/use-translations';
import { useFieldValidation } from '@/hooks/useFieldValidation';
import AppLayout from '@/layouts/app-layout';
import { validationRules } from '@/lib/validation/rules';
import articles from '@/routes/articles/index';
import { type BreadcrumbItem } from '@/types';
import { Form, Head, router, usePage } from '@inertiajs/react';
import { Info, Plus, X } from 'lucide-react';
import { useEffect, useState } from 'react';

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

type Machinery = {
    uuid: string;
    cod: string;
    description?: string | null;
    parameter?: string | null;
    valuetype?: string | null; // "text", "number", or comma-separated list
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

type SourceArticle = {
    uuid: string;
    cod_article_las: string;
    cod_article_client?: string | null;
    article_descr?: string | null;
    additional_descr?: string | null;
    article_category?: string | null;
    pallet_uuid?: string | null;
    plan_packaging?: number | null;
    pallet_plans?: number | null;
    offer_uuid: string;
    visibility_cod?: boolean;
    stock_managed?: boolean;
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
    materials?: Array<{ uuid: string }>;
    machinery?: Array<{ uuid: string }>;
    critical_issues?: Array<{ uuid: string }>;
    packaging_instructions?: Array<{ uuid: string }>;
    operating_instructions?: Array<{ uuid: string }>;
    palletizing_instructions?: Array<{ uuid: string }>;
    check_materials?: Array<{
        material_uuid: string;
        um?: string;
        quantity_expected?: number | string;
        quantity_effective?: number | string;
    }>;
    line_layout?: string | null;
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

type ArticlesCreateProps = {
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
    lasCode?: string | null;
    selectedOfferUuid?: string | null;
    sourceArticle?: SourceArticle | null;
    /** Convert to Article: offer data for prefill (without sourceArticle) */
    articleDescrFromOffer?: string | null;
    codArticleClientFromOffer?: string | null;
    additionalDescrFromOffer?: string | null;
    errors?: Record<string, string>;
};

export default function ArticlesCreate({
    offers,
    categories,
    palletTypes,
    machinery = [],
    materials = [],
    criticalIssues = [],
    packagingInstructions = [],
    operatingInstructions = [],
    palletizingInstructions = [],
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
    lasCode,
    selectedOfferUuid,
    sourceArticle,
    articleDescrFromOffer,
    codArticleClientFromOffer,
    additionalDescrFromOffer,
    errors: serverErrors,
}: ArticlesCreateProps) {
    const { props } = usePage<ArticlesCreateProps>();
    const { t } = useTranslations();
    const [showCloseConfirm, setShowCloseConfirm] = useState(false);
    const actualSourceArticle = sourceArticle || props.sourceArticle;
    const actualSelectedOfferUuid =
        selectedOfferUuid ||
        props.selectedOfferUuid ||
        actualSourceArticle?.offer_uuid ||
        '';
    const actualUm = um || props.um;
    const actualPiecesPerPackage = piecesPerPackage || props.piecesPerPackage;
    const actualMediaValues = mediaValues || props.mediaValues;
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
        actualSelectedOfferUuid,
    );
    const [codArticleLas, setCodArticleLas] = useState(
        lasCode || props.lasCode || '',
    );
    const [articleDescr, setArticleDescr] = useState(
        actualSourceArticle?.article_descr ||
            articleDescrFromOffer ||
            props.articleDescrFromOffer ||
            '',
    );
    // Piano Imballaggio: da articolo duplicato o da offerta (Pz) in Converti in Articolo
    const [planPackaging, setPlanPackaging] = useState(
        actualSourceArticle?.plan_packaging?.toString() ||
            (actualPiecesPerPackage != null
                ? String(actualPiecesPerPackage)
                : ''),
    );
    const [palletPlans, setPalletPlans] = useState(
        actualSourceArticle?.pallet_plans?.toString() || '',
    );
    const [visibilityCod, setVisibilityCod] = useState(
        actualSourceArticle?.visibility_cod || false,
    );
    const [stockManaged, setStockManaged] = useState(
        actualSourceArticle?.stock_managed || false,
    );
    const [lotAttribution, setLotAttribution] = useState<string>(
        actualSourceArticle?.lot_attribution?.toString() || '',
    );
    const [expirationAttribution, setExpirationAttribution] = useState<string>(
        actualSourceArticle?.expiration_attribution?.toString() || '',
    );
    const [ean, setEan] = useState(actualSourceArticle?.ean || '');
    const [db, setDb] = useState<string>(
        actualSourceArticle?.db?.toString() || '',
    );
    const [labelsExternal, setLabelsExternal] = useState<string>(
        actualSourceArticle?.labels_external?.toString() || '',
    );
    const [labelsPvp, setLabelsPvp] = useState<string>(
        actualSourceArticle?.labels_pvp?.toString() || '',
    );
    const [valuePvp, setValuePvp] = useState(
        actualSourceArticle?.value_pvp?.toString() || '',
    );
    const [labelsIngredient, setLabelsIngredient] = useState<string>(
        actualSourceArticle?.labels_ingredient?.toString() || '',
    );
    const [labelsDataVariable, setLabelsDataVariable] = useState<string>(
        actualSourceArticle?.labels_data_variable?.toString() || '',
    );
    const [labelOfJumpers, setLabelOfJumpers] = useState<string>(
        actualSourceArticle?.label_of_jumpers?.toString() || '',
    );
    const [weightKg, setWeightKg] = useState(
        actualSourceArticle?.weight_kg?.toString() || '',
    );
    const [nominalWeightControl, setNominalWeightControl] = useState<string>(
        actualSourceArticle?.nominal_weight_control?.toString() || '',
    );
    const [weightUnitOfMeasur, setWeightUnitOfMeasur] = useState(
        actualSourceArticle?.weight_unit_of_measur || '',
    );
    const [weightValue, setWeightValue] = useState(
        actualSourceArticle?.weight_value?.toString() || '',
    );
    const [objectControlWeight, setObjectControlWeight] = useState<string>(
        actualSourceArticle?.object_control_weight?.toString() || '',
    );
    const [allergens, setAllergens] = useState(
        actualSourceArticle?.allergens || false,
    );
    const [palletSheet, setPalletSheet] = useState<string>(
        actualSourceArticle?.pallet_sheet || '',
    );
    const [modelUuid, setModelUuid] = useState<string>(
        actualSourceArticle?.model_uuid || '',
    );
    const [customerSamples, setCustomerSamples] = useState<string>(
        actualSourceArticle?.customer_samples_list?.toString() || '',
    );
    const [lineLayoutFileName, setLineLayoutFileName] = useState<string | null>(
        null,
    );
    const [mediaRealeCfzHPz, setMediaRealeCfzHPz] = useState(
        actualSourceArticle?.media_reale_cfz_h_pz?.toString() || '',
    );

    // Convert ISO date to yyyy-MM-dd for date input
    const formatDateForInput = (
        dateString: string | null | undefined,
    ): string => {
        if (!dateString) return '';
        try {
            // If already in yyyy-MM-dd format, return as is
            if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
                return dateString;
            }
            // If in ISO format, extract only the date part
            const date = new Date(dateString);
            if (isNaN(date.getTime())) return '';
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        } catch {
            return '';
        }
    };

    const [productionApprovalCheckbox, setProductionApprovalCheckbox] =
        useState(actualSourceArticle?.production_approval_checkbox || false);
    const [productionApprovalEmployee, setProductionApprovalEmployee] =
        useState(actualSourceArticle?.production_approval_employee || '');
    const [productionApprovalDate, setProductionApprovalDate] = useState(
        formatDateForInput(actualSourceArticle?.production_approval_date),
    );
    const [productionApprovalNotes, setProductionApprovalNotes] = useState(
        actualSourceArticle?.production_approval_notes || '',
    );
    const [approvQualityCheckbox, setApprovQualityCheckbox] = useState(
        actualSourceArticle?.approv_quality_checkbox || false,
    );
    const [approvQualityEmployee, setApprovQualityEmployee] = useState(
        actualSourceArticle?.approv_quality_employee || '',
    );
    const [approvQualityDate, setApprovQualityDate] = useState(
        formatDateForInput(actualSourceArticle?.approv_quality_date),
    );
    const [approvQualityNotes, setApprovQualityNotes] = useState(
        actualSourceArticle?.approv_quality_notes || '',
    );
    const [commercialApprovalCheckbox, setCommercialApprovalCheckbox] =
        useState(actualSourceArticle?.commercial_approval_checkbox || false);
    const [commercialApprovalEmployee, setCommercialApprovalEmployee] =
        useState(actualSourceArticle?.commercial_approval_employee || '');
    const [commercialApprovalDate, setCommercialApprovalDate] = useState(
        formatDateForInput(actualSourceArticle?.commercial_approval_date),
    );
    const [commercialApprovalNotes, setCommercialApprovalNotes] = useState(
        actualSourceArticle?.commercial_approval_notes || '',
    );
    const [clientApprovalCheckbox, setClientApprovalCheckbox] = useState(
        actualSourceArticle?.client_approval_checkbox || false,
    );
    const [clientApprovalEmployee, setClientApprovalEmployee] = useState(
        actualSourceArticle?.client_approval_employee || '',
    );
    const [clientApprovalDate, setClientApprovalDate] = useState(
        formatDateForInput(actualSourceArticle?.client_approval_date),
    );
    const [clientApprovalNotes, setClientApprovalNotes] = useState(
        actualSourceArticle?.client_approval_notes || '',
    );

    // State for many-to-many relations
    const actualMachinery =
        machinery && machinery.length > 0 ? machinery : props.machinery || [];
    const actualMaterials =
        materials && materials.length > 0 ? materials : props.materials || [];
    const actualCriticalIssues =
        criticalIssues && criticalIssues.length > 0
            ? criticalIssues
            : props.criticalIssues || [];
    const actualPackagingInstructions =
        packagingInstructions && packagingInstructions.length > 0
            ? packagingInstructions
            : props.packagingInstructions || [];
    const actualOperatingInstructions =
        operatingInstructions && operatingInstructions.length > 0
            ? operatingInstructions
            : props.operatingInstructions || [];
    const actualPalletizingInstructions =
        palletizingInstructions && palletizingInstructions.length > 0
            ? palletizingInstructions
            : props.palletizingInstructions || [];

    const [machineryRows, setMachineryRows] = useState<MachineryRow[]>(() => {
        if (
            actualSourceArticle?.machinery &&
            actualSourceArticle.machinery.length > 0
        ) {
            return actualSourceArticle.machinery.map((m, idx) => ({
                id: `machinery-${idx}`,
                machineryUuid: m.uuid,
                value: (m as { pivot?: { value?: string } }).pivot?.value || '',
                valueType: null,
            }));
        }
        return [];
    });

    const [materialRows, setMaterialRows] = useState<MaterialRow[]>(() => {
        if (
            actualSourceArticle?.materials &&
            actualSourceArticle.materials.length > 0
        ) {
            return actualSourceArticle.materials.map((m, idx) => ({
                id: `material-${idx}`,
                materialUuid: m.uuid,
            }));
        }
        return [];
    });

    const [criticalIssueRows, setCriticalIssueRows] = useState<
        CriticalIssueRow[]
    >(() => {
        const list =
            actualSourceArticle?.critical_issues ??
            (actualSourceArticle as { criticalIssues?: { uuid: string }[] })
                ?.criticalIssues;
        if (list && list.length > 0) {
            return list.map((c, idx) => ({
                id: `critical-${idx}`,
                criticalIssueUuid: c.uuid,
            }));
        }
        return [];
    });

    const [packagingInstructionRows, setPackagingInstructionRows] = useState<
        InstructionRow[]
    >(() => {
        const list =
            actualSourceArticle?.packaging_instructions ??
            (
                actualSourceArticle as {
                    packagingInstructions?: { uuid: string }[];
                }
            )?.packagingInstructions;
        if (list && list.length > 0) {
            return list.map((p, idx) => ({
                id: `packaging-${idx}`,
                instructionUuid: p.uuid,
            }));
        }
        return [];
    });

    const [operatingInstructionRows, setOperatingInstructionRows] = useState<
        InstructionRow[]
    >(() => {
        const list =
            actualSourceArticle?.operating_instructions ??
            (
                actualSourceArticle as {
                    operatingInstructions?: { uuid: string }[];
                }
            )?.operatingInstructions;
        if (list && list.length > 0) {
            return list.map((o, idx) => ({
                id: `operating-${idx}`,
                instructionUuid: o.uuid,
            }));
        }
        return [];
    });

    const [palletizingInstructionRows, setPalletizingInstructionRows] =
        useState<InstructionRow[]>(() => {
            const list =
                actualSourceArticle?.palletizing_instructions ??
                (
                    actualSourceArticle as {
                        palletizingInstructions?: { uuid: string }[];
                    }
                )?.palletizingInstructions;
            if (list && list.length > 0) {
                return list.map((p, idx) => ({
                    id: `palletizing-${idx}`,
                    instructionUuid: p.uuid,
                }));
            }
            return [];
        });

    const [checkMaterialRows, setCheckMaterialRows] = useState<
        CheckMaterialRow[]
    >(() => {
        const list =
            actualSourceArticle?.check_materials ??
            (
                actualSourceArticle as {
                    checkMaterials?: Array<{
                        material_uuid: string;
                        um?: string;
                        quantity_expected?: number | string;
                        quantity_effective?: number | string;
                    }>;
                }
            )?.checkMaterials;
        if (list && list.length > 0) {
            return list.map((row, idx) => ({
                id: `check-material-${idx}`,
                materialUuid: row.material_uuid ?? '',
                um: row.um != null ? String(row.um) : '',
                quantityExpected:
                    row.quantity_expected != null
                        ? String(row.quantity_expected)
                        : '',
                quantityEffective:
                    row.quantity_effective != null
                        ? String(row.quantity_effective)
                        : '',
            }));
        }
        return [];
    });

    const codArticleLasValidation = useFieldValidation(codArticleLas, [
        (value) => {
            if (!value) return null;
            if (value.length > 255) {
                return t('articles.edit.validation_cod_las_max');
            }
            return null;
        },
    ]);

    const articleDescrValidation = useFieldValidation(articleDescr, [
        validationRules.required(
            t('articles.edit.validation_description_required'),
        ),
        validationRules.maxLength(
            255,
            t('articles.edit.validation_description_max'),
        ),
    ]);

    const planPackagingValidation = useFieldValidation(planPackaging, [
        (value) => {
            if (!value) return null;
            const num = parseFloat(value);
            if (isNaN(num)) {
                return t('articles.edit.validation_must_be_number');
            }
            if (num < 0) {
                return t('articles.edit.validation_positive_or_zero');
            }
            return null;
        },
    ]);

    const palletPlansValidation = useFieldValidation(palletPlans, [
        (value) => {
            if (!value) return null;
            const num = parseFloat(value);
            if (isNaN(num)) {
                return t('articles.edit.validation_must_be_number');
            }
            if (num < 0) {
                return t('articles.edit.validation_positive_or_zero');
            }
            return null;
        },
    ]);

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: t('nav.articles'),
            href: articles.index().url,
        },
        {
            title: t('articles.create.breadcrumb'),
            href: articles.create().url,
        },
    ];

    // Update values when offer changes from props
    useEffect(() => {
        if (
            props.selectedOfferUuid &&
            props.selectedOfferUuid !== selectedOffer
        ) {
            const uuid = props.selectedOfferUuid;
            queueMicrotask(() => setSelectedOffer(uuid));
        }
        if (props.um && props.um !== actualUm) {
            // um updates automatically from props
        }
        if (props.mediaValues && props.mediaValues !== actualMediaValues) {
            // mediaValues updates automatically from props
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps -- sync from props only, avoid loops
    }, [props.selectedOfferUuid, props.um, props.mediaValues]);

    const handleOfferChange = (offerUuid: string) => {
        setSelectedOffer(offerUuid);
        if (offerUuid) {
            router.get(
                articles.create().url,
                { offer_uuid: offerUuid },
                {
                    preserveState: true,
                    preserveScroll: true,
                    only: [
                        'lasCode',
                        'selectedOfferUuid',
                        'um',
                        'piecesPerPackage',
                        'mediaValues',
                    ],
                },
            );
        }
    };

    // Add/remove dynamic rows
    const addMachineryRow = () => {
        const newRow: MachineryRow = {
            id: `machinery-${Date.now()}`,
            machineryUuid: '',
            value: '',
            valueType: null,
        };
        setMachineryRows([...machineryRows, newRow]);
    };

    const removeMachineryRow = (id: string) => {
        setMachineryRows(machineryRows.filter((row) => row.id !== id));
    };

    const updateMachineryRow = (
        id: string,
        field: keyof MachineryRow,
        value: string,
    ) => {
        setMachineryRows(
            machineryRows.map((row) => {
                if (row.id === id) {
                    return { ...row, [field]: value };
                }
                return row;
            }),
        );
    };

    const handleMachineryChange = (id: string, machineryUuid: string) => {
        const machinery = actualMachinery.find((m) => m.uuid === machineryUuid);
        const valueType = machinery?.valuetype || null;
        updateMachineryRow(id, 'machineryUuid', machineryUuid);
        updateMachineryRow(id, 'valueType', valueType || '');
        // Resettare il valore quando cambia il macchinario
        updateMachineryRow(id, 'value', '');
    };

    const addMaterialRow = () => {
        const newRow: MaterialRow = {
            id: `material-${Date.now()}`,
            materialUuid: '',
        };
        setMaterialRows([...materialRows, newRow]);
    };

    const removeMaterialRow = (id: string) => {
        setMaterialRows(materialRows.filter((row) => row.id !== id));
    };

    const updateMaterialRow = (id: string, materialUuid: string) => {
        setMaterialRows(
            materialRows.map((row) => {
                if (row.id === id) {
                    return { ...row, materialUuid };
                }
                return row;
            }),
        );
    };

    const addCriticalIssueRow = () => {
        const newRow: CriticalIssueRow = {
            id: `critical-${Date.now()}`,
            criticalIssueUuid: '',
        };
        setCriticalIssueRows([...criticalIssueRows, newRow]);
    };

    const removeCriticalIssueRow = (id: string) => {
        setCriticalIssueRows(criticalIssueRows.filter((row) => row.id !== id));
    };

    const updateCriticalIssueRow = (id: string, criticalIssueUuid: string) => {
        setCriticalIssueRows(
            criticalIssueRows.map((row) => {
                if (row.id === id) {
                    return { ...row, criticalIssueUuid };
                }
                return row;
            }),
        );
    };

    const addPackagingInstructionRow = () => {
        const newRow: InstructionRow = {
            id: `packaging-${Date.now()}`,
            instructionUuid: '',
        };
        setPackagingInstructionRows([...packagingInstructionRows, newRow]);
    };

    const removePackagingInstructionRow = (id: string) => {
        setPackagingInstructionRows(
            packagingInstructionRows.filter((row) => row.id !== id),
        );
    };

    const updatePackagingInstructionRow = (
        id: string,
        instructionUuid: string,
    ) => {
        setPackagingInstructionRows(
            packagingInstructionRows.map((row) => {
                if (row.id === id) {
                    return { ...row, instructionUuid };
                }
                return row;
            }),
        );
    };

    const addOperatingInstructionRow = () => {
        const newRow: InstructionRow = {
            id: `operating-${Date.now()}`,
            instructionUuid: '',
        };
        setOperatingInstructionRows([...operatingInstructionRows, newRow]);
    };

    const removeOperatingInstructionRow = (id: string) => {
        setOperatingInstructionRows(
            operatingInstructionRows.filter((row) => row.id !== id),
        );
    };

    const updateOperatingInstructionRow = (
        id: string,
        instructionUuid: string,
    ) => {
        setOperatingInstructionRows(
            operatingInstructionRows.map((row) => {
                if (row.id === id) {
                    return { ...row, instructionUuid };
                }
                return row;
            }),
        );
    };

    const addPalletizingInstructionRow = () => {
        const newRow: InstructionRow = {
            id: `palletizing-${Date.now()}`,
            instructionUuid: '',
        };
        setPalletizingInstructionRows([...palletizingInstructionRows, newRow]);
    };

    const removePalletizingInstructionRow = (id: string) => {
        setPalletizingInstructionRows(
            palletizingInstructionRows.filter((row) => row.id !== id),
        );
    };

    const updatePalletizingInstructionRow = (
        id: string,
        instructionUuid: string,
    ) => {
        setPalletizingInstructionRows(
            palletizingInstructionRows.map((row) => {
                if (row.id === id) {
                    return { ...row, instructionUuid };
                }
                return row;
            }),
        );
    };

    const addCheckMaterialRow = () => {
        const newRow: CheckMaterialRow = {
            id: `check-material-${Date.now()}`,
            materialUuid: '',
            um: '',
            quantityExpected: '',
            quantityEffective: '',
        };
        setCheckMaterialRows([...checkMaterialRows, newRow]);
    };

    const removeCheckMaterialRow = (id: string) => {
        setCheckMaterialRows(checkMaterialRows.filter((row) => row.id !== id));
    };

    const updateCheckMaterialRow = (
        id: string,
        field: keyof CheckMaterialRow,
        value: string,
    ) => {
        setCheckMaterialRows(
            checkMaterialRows.map((row) => {
                if (row.id === id) {
                    return { ...row, [field]: value };
                }
                return row;
            }),
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('articles.create.title')} />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex w-full justify-center">
                    <div className="w-full max-w-4xl space-y-5">
                        {actualSourceArticle && (
                            <Alert>
                                <Info className="h-4 w-4" />
                                <AlertDescription>
                                    {t('articles.create.duplicate_alert', {
                                        code: actualSourceArticle.cod_article_las,
                                        description:
                                            actualSourceArticle.article_descr ??
                                            '',
                                    })}
                                </AlertDescription>
                            </Alert>
                        )}
                        <Card>
                            <CardHeader>
                                <CardTitle>
                                    {actualSourceArticle
                                        ? t('articles.create.duplicate_title')
                                        : t('articles.create.new_title')}
                                </CardTitle>
                                <CardDescription>
                                    {actualSourceArticle
                                        ? t(
                                              'articles.create.duplicate_description',
                                          )
                                        : t('articles.create.new_description')}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Form
                                    action={articles.store().url}
                                    method="post"
                                    encType="multipart/form-data"
                                    className="space-y-6"
                                >
                                    {({ processing, errors }) => {
                                        const allErrors = {
                                            ...errors,
                                            ...serverErrors,
                                        };
                                        const hasAttemptedSubmit =
                                            Object.keys(allErrors).length > 0;

                                        return (
                                            <>
                                                <FormValidationNotification
                                                    errors={allErrors}
                                                    hasAttemptedSubmit={
                                                        hasAttemptedSubmit
                                                    }
                                                />
                                                {actualSourceArticle && (
                                                    <input
                                                        type="hidden"
                                                        name="source_article_uuid"
                                                        value={
                                                            actualSourceArticle.uuid
                                                        }
                                                    />
                                                )}
                                                {/* Hidden inputs for checkboxes (to send 0 if not selected) */}
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

                                                {/* Hidden inputs for many-to-many relationships */}
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
                                                <div className="grid gap-2">
                                                    <FormLabel
                                                        htmlFor="offer_uuid"
                                                        required
                                                    >
                                                        {t(
                                                            'articles.edit.offer',
                                                        )}
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
                                                            <SelectValue
                                                                placeholder={t(
                                                                    'articles.edit.placeholder_offer',
                                                                )}
                                                            />
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
                                                                            t(
                                                                                'common.no_description',
                                                                            )}
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
                                                        {t(
                                                            'articles.edit.cod_las',
                                                        )}
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
                                                        placeholder={t(
                                                            'articles.create.placeholder_cod_las_optional',
                                                        )}
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
                                                        {t(
                                                            'articles.edit.description',
                                                        )}
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
                                                        placeholder={t(
                                                            'articles.edit.placeholder_description',
                                                        )}
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
                                                    <InputError
                                                        message={
                                                            allErrors.article_descr
                                                        }
                                                    />
                                                </div>

                                                <div className="grid gap-2">
                                                    <FormLabel htmlFor="cod_article_client">
                                                        {t(
                                                            'articles.edit.cod_client',
                                                        )}
                                                    </FormLabel>
                                                    <Input
                                                        id="cod_article_client"
                                                        name="cod_article_client"
                                                        defaultValue={
                                                            actualSourceArticle?.cod_article_client ||
                                                            codArticleClientFromOffer ||
                                                            props.codArticleClientFromOffer ||
                                                            ''
                                                        }
                                                        placeholder={t(
                                                            'articles.edit.placeholder_cod_client',
                                                        )}
                                                    />
                                                    <InputError
                                                        message={
                                                            allErrors.cod_article_client
                                                        }
                                                    />
                                                </div>

                                                <div className="grid gap-2">
                                                    <FormLabel htmlFor="additional_descr">
                                                        {t(
                                                            'articles.edit.additional_descr',
                                                        )}
                                                    </FormLabel>
                                                    <Textarea
                                                        id="additional_descr"
                                                        name="additional_descr"
                                                        defaultValue={
                                                            actualSourceArticle?.additional_descr ||
                                                            additionalDescrFromOffer ||
                                                            props.additionalDescrFromOffer ||
                                                            ''
                                                        }
                                                        placeholder={t(
                                                            'articles.edit.placeholder_additional',
                                                        )}
                                                        rows={3}
                                                    />
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
                                                        {t(
                                                            'articles.edit.visibility_cod',
                                                        )}
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
                                                        {t(
                                                            'articles.edit.stock_managed',
                                                        )}
                                                    </label>
                                                </div>

                                                {actualUm && (
                                                    <div className="grid gap-2">
                                                        <FormLabel htmlFor="um">
                                                            {t(
                                                                'articles.edit.um',
                                                            )}
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
                                                        {t(
                                                            'articles.edit.lot_attribution',
                                                        )}
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
                                                            <SelectValue
                                                                placeholder={t(
                                                                    'articles.edit.placeholder_lot',
                                                                )}
                                                            />
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
                                                        {t(
                                                            'articles.edit.expiration_attribution',
                                                        )}
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
                                                            <SelectValue
                                                                placeholder={t(
                                                                    'articles.edit.placeholder_expiration',
                                                                )}
                                                            />
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
                                                        {t('articles.edit.ean')}
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
                                                        placeholder={t(
                                                            'articles.edit.placeholder_ean',
                                                        )}
                                                    />
                                                    <InputError
                                                        message={allErrors.ean}
                                                    />
                                                </div>

                                                <div className="grid gap-2">
                                                    <FormLabel htmlFor="db">
                                                        {t('articles.edit.db')}
                                                    </FormLabel>
                                                    <Select
                                                        name="db"
                                                        value={db}
                                                        onValueChange={setDb}
                                                    >
                                                        <SelectTrigger>
                                                            <SelectValue
                                                                placeholder={t(
                                                                    'articles.edit.placeholder_db',
                                                                )}
                                                            />
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
                                                        {t(
                                                            'articles.edit.category',
                                                        )}
                                                    </FormLabel>
                                                    <Select
                                                        name="article_category"
                                                        defaultValue={
                                                            actualSourceArticle?.article_category ||
                                                            undefined
                                                        }
                                                    >
                                                        <SelectTrigger>
                                                            <SelectValue
                                                                placeholder={t(
                                                                    'articles.edit.placeholder_category',
                                                                )}
                                                            />
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
                                                        {t(
                                                            'articles.edit.pallet_type',
                                                        )}
                                                    </FormLabel>
                                                    <Select
                                                        name="pallet_uuid"
                                                        defaultValue={
                                                            actualSourceArticle?.pallet_uuid ||
                                                            undefined
                                                        }
                                                    >
                                                        <SelectTrigger>
                                                            <SelectValue
                                                                placeholder={t(
                                                                    'articles.edit.placeholder_pallet_type',
                                                                )}
                                                            />
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
                                                                            t(
                                                                                'common.no_description',
                                                                            )}
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
                                                        {t(
                                                            'articles.edit.plan_packaging',
                                                        )}
                                                    </FormLabel>
                                                    <Input
                                                        id="plan_packaging"
                                                        name="plan_packaging"
                                                        type="number"
                                                        min="0"
                                                        step="0.01"
                                                        value={planPackaging}
                                                        onChange={(e) =>
                                                            setPlanPackaging(
                                                                e.target.value,
                                                            )
                                                        }
                                                        onBlur={
                                                            planPackagingValidation.onBlur
                                                        }
                                                        placeholder={t(
                                                            'articles.edit.placeholder_plan',
                                                        )}
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
                                                        {t(
                                                            'articles.edit.plan_help',
                                                        )}
                                                    </p>
                                                    <InputError
                                                        message={
                                                            allErrors.plan_packaging
                                                        }
                                                    />
                                                </div>

                                                <div className="grid gap-2">
                                                    <FormLabel htmlFor="pallet_plans">
                                                        {t(
                                                            'articles.edit.pallet_plans',
                                                        )}
                                                    </FormLabel>
                                                    <Input
                                                        id="pallet_plans"
                                                        name="pallet_plans"
                                                        type="number"
                                                        min="0"
                                                        step="0.01"
                                                        value={palletPlans}
                                                        onChange={(e) =>
                                                            setPalletPlans(
                                                                e.target.value,
                                                            )
                                                        }
                                                        onBlur={
                                                            palletPlansValidation.onBlur
                                                        }
                                                        placeholder={t(
                                                            'articles.edit.placeholder_plan',
                                                        )}
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
                                                        {t(
                                                            'articles.edit.pallet_plans_help',
                                                        )}
                                                    </p>
                                                    <InputError
                                                        message={
                                                            allErrors.pallet_plans
                                                        }
                                                    />
                                                </div>

                                                <div className="grid gap-2">
                                                    <FormLabel htmlFor="line_layout_file">
                                                        {t(
                                                            'articles.edit.line_layout',
                                                        )}
                                                    </FormLabel>
                                                    <Input
                                                        id="line_layout_file"
                                                        name="line_layout_file"
                                                        type="file"
                                                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif"
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
                                                    {actualSourceArticle?.line_layout && (
                                                        <p className="text-xs text-muted-foreground">
                                                            {t(
                                                                'articles.edit.current_attachment',
                                                            )}
                                                            :{' '}
                                                            {
                                                                actualSourceArticle.line_layout
                                                            }{' '}
                                                            (
                                                            {t(
                                                                'articles.edit.current_attachment_copied_if_no_new',
                                                            )}
                                                            )
                                                        </p>
                                                    )}
                                                    {lineLayoutFileName && (
                                                        <p className="text-xs text-muted-foreground">
                                                            {t(
                                                                'articles.edit.new_attachment_selected',
                                                            )}
                                                            :{' '}
                                                            <span className="font-mono">
                                                                {
                                                                    lineLayoutFileName
                                                                }
                                                            </span>
                                                        </p>
                                                    )}
                                                    <InputError
                                                        message={
                                                            allErrors.line_layout_file
                                                        }
                                                    />
                                                </div>

                                                {/* Elenco macchinari e parametri */}
                                                <Card>
                                                    <CardHeader>
                                                        <CardTitle className="text-lg">
                                                            {t(
                                                                'articles.create.section_machinery_list',
                                                            )}
                                                        </CardTitle>
                                                    </CardHeader>
                                                    <CardContent className="space-y-4">
                                                        <div className="space-y-3">
                                                            {machineryRows.map(
                                                                (row) => {
                                                                    const selectedMachinery =
                                                                        actualMachinery.find(
                                                                            (
                                                                                m,
                                                                            ) =>
                                                                                m.uuid ===
                                                                                row.machineryUuid,
                                                                        );
                                                                    const valueType =
                                                                        selectedMachinery?.valuetype ||
                                                                        row.valueType ||
                                                                        '';
                                                                    const isListType =
                                                                        valueType &&
                                                                        valueType.includes(
                                                                            ',',
                                                                        ) &&
                                                                        valueType !==
                                                                            'testo' &&
                                                                        valueType !==
                                                                            'numero';
                                                                    const listOptions =
                                                                        isListType
                                                                            ? valueType
                                                                                  .split(
                                                                                      ',',
                                                                                  )
                                                                                  .map(
                                                                                      (
                                                                                          v,
                                                                                          i,
                                                                                      ) => ({
                                                                                          key: i,
                                                                                          value: v.trim(),
                                                                                      }),
                                                                                  )
                                                                            : [];

                                                                    return (
                                                                        <div
                                                                            key={
                                                                                row.id
                                                                            }
                                                                            className="grid grid-cols-12 items-end gap-2"
                                                                        >
                                                                            <div className="col-span-7">
                                                                                <Select
                                                                                    value={
                                                                                        row.machineryUuid
                                                                                    }
                                                                                    onValueChange={(
                                                                                        value,
                                                                                    ) =>
                                                                                        handleMachineryChange(
                                                                                            row.id,
                                                                                            value,
                                                                                        )
                                                                                    }
                                                                                >
                                                                                    <SelectTrigger>
                                                                                        <SelectValue
                                                                                            placeholder={t(
                                                                                                'articles.create.placeholder_machinery',
                                                                                            )}
                                                                                        />
                                                                                    </SelectTrigger>
                                                                                    <SelectContent>
                                                                                        {actualMachinery.map(
                                                                                            (
                                                                                                machinery,
                                                                                            ) => (
                                                                                                <SelectItem
                                                                                                    key={
                                                                                                        machinery.uuid
                                                                                                    }
                                                                                                    value={
                                                                                                        machinery.uuid
                                                                                                    }
                                                                                                >
                                                                                                    {
                                                                                                        machinery.cod
                                                                                                    }{' '}
                                                                                                    -{' '}
                                                                                                    {machinery.description ||
                                                                                                        ''}{' '}
                                                                                                    {machinery.parameter
                                                                                                        ? `- ${machinery.parameter}`
                                                                                                        : ''}
                                                                                                </SelectItem>
                                                                                            ),
                                                                                        )}
                                                                                    </SelectContent>
                                                                                </Select>
                                                                            </div>
                                                                            <div className="col-span-4">
                                                                                {!row.machineryUuid ? (
                                                                                    <Input
                                                                                        readOnly
                                                                                        placeholder={t(
                                                                                            'articles.edit.value_label',
                                                                                        )}
                                                                                        className="bg-muted"
                                                                                    />
                                                                                ) : valueType ===
                                                                                  'testo' ? (
                                                                                    <Input
                                                                                        value={
                                                                                            row.value
                                                                                        }
                                                                                        onChange={(
                                                                                            e,
                                                                                        ) =>
                                                                                            updateMachineryRow(
                                                                                                row.id,
                                                                                                'value',
                                                                                                e
                                                                                                    .target
                                                                                                    .value,
                                                                                            )
                                                                                        }
                                                                                        placeholder={t(
                                                                                            'articles.edit.value_label',
                                                                                        )}
                                                                                    />
                                                                                ) : valueType ===
                                                                                  'numero' ? (
                                                                                    <Input
                                                                                        type="number"
                                                                                        step="0.01"
                                                                                        value={
                                                                                            row.value
                                                                                        }
                                                                                        onChange={(
                                                                                            e,
                                                                                        ) =>
                                                                                            updateMachineryRow(
                                                                                                row.id,
                                                                                                'value',
                                                                                                e
                                                                                                    .target
                                                                                                    .value,
                                                                                            )
                                                                                        }
                                                                                        placeholder={t(
                                                                                            'articles.edit.value_label',
                                                                                        )}
                                                                                    />
                                                                                ) : isListType ? (
                                                                                    <Select
                                                                                        value={
                                                                                            row.value
                                                                                        }
                                                                                        onValueChange={(
                                                                                            value,
                                                                                        ) =>
                                                                                            updateMachineryRow(
                                                                                                row.id,
                                                                                                'value',
                                                                                                value,
                                                                                            )
                                                                                        }
                                                                                    >
                                                                                        <SelectTrigger>
                                                                                            <SelectValue
                                                                                                placeholder={t(
                                                                                                    'articles.edit.placeholder_select_value',
                                                                                                )}
                                                                                            />
                                                                                        </SelectTrigger>
                                                                                        <SelectContent>
                                                                                            {listOptions.map(
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
                                                                                ) : (
                                                                                    <Input
                                                                                        readOnly
                                                                                        placeholder={t(
                                                                                            'articles.edit.value_label',
                                                                                        )}
                                                                                        className="bg-muted"
                                                                                    />
                                                                                )}
                                                                            </div>
                                                                            <div className="col-span-1">
                                                                                <Button
                                                                                    type="button"
                                                                                    variant="destructive"
                                                                                    size="sm"
                                                                                    onClick={() =>
                                                                                        removeMachineryRow(
                                                                                            row.id,
                                                                                        )
                                                                                    }
                                                                                >
                                                                                    <X className="h-4 w-4" />
                                                                                </Button>
                                                                            </div>
                                                                        </div>
                                                                    );
                                                                },
                                                            )}
                                                        </div>
                                                        <Button
                                                            type="button"
                                                            variant="outline"
                                                            onClick={
                                                                addMachineryRow
                                                            }
                                                        >
                                                            <Plus className="mr-2 h-4 w-4" />
                                                            {t(
                                                                'articles.create.add_machinery',
                                                            )}
                                                        </Button>
                                                    </CardContent>
                                                </Card>

                                                {/* Istruzioni di confezionamento */}
                                                <Card>
                                                    <CardHeader>
                                                        <CardTitle className="text-lg">
                                                            {t(
                                                                'articles.create.section_packaging_instructions',
                                                            )}
                                                        </CardTitle>
                                                    </CardHeader>
                                                    <CardContent className="space-y-4">
                                                        <div className="space-y-3">
                                                            {packagingInstructionRows.map(
                                                                (row) => (
                                                                    <div
                                                                        key={
                                                                            row.id
                                                                        }
                                                                        className="grid grid-cols-12 items-end gap-2"
                                                                    >
                                                                        <div className="col-span-11">
                                                                            <Select
                                                                                value={
                                                                                    row.instructionUuid
                                                                                }
                                                                                onValueChange={(
                                                                                    value,
                                                                                ) =>
                                                                                    updatePackagingInstructionRow(
                                                                                        row.id,
                                                                                        value,
                                                                                    )
                                                                                }
                                                                            >
                                                                                <SelectTrigger>
                                                                                    <SelectValue
                                                                                        placeholder={t(
                                                                                            'articles.create.placeholder_packaging_instructions',
                                                                                        )}
                                                                                    />
                                                                                </SelectTrigger>
                                                                                <SelectContent>
                                                                                    {actualPackagingInstructions.map(
                                                                                        (
                                                                                            instruction,
                                                                                        ) => (
                                                                                            <SelectItem
                                                                                                key={
                                                                                                    instruction.uuid
                                                                                                }
                                                                                                value={
                                                                                                    instruction.uuid
                                                                                                }
                                                                                            >
                                                                                                {
                                                                                                    instruction.code
                                                                                                }{' '}
                                                                                                {instruction.number
                                                                                                    ? `- ${instruction.number}`
                                                                                                    : ''}
                                                                                            </SelectItem>
                                                                                        ),
                                                                                    )}
                                                                                </SelectContent>
                                                                            </Select>
                                                                        </div>
                                                                        <div className="col-span-1">
                                                                            <Button
                                                                                type="button"
                                                                                variant="destructive"
                                                                                size="sm"
                                                                                onClick={() =>
                                                                                    removePackagingInstructionRow(
                                                                                        row.id,
                                                                                    )
                                                                                }
                                                                            >
                                                                                <X className="h-4 w-4" />
                                                                            </Button>
                                                                        </div>
                                                                    </div>
                                                                ),
                                                            )}
                                                        </div>
                                                        <Button
                                                            type="button"
                                                            variant="outline"
                                                            onClick={
                                                                addPackagingInstructionRow
                                                            }
                                                        >
                                                            <Plus className="mr-2 h-4 w-4" />
                                                            {t(
                                                                'articles.create.add_packaging_instructions',
                                                            )}
                                                        </Button>
                                                    </CardContent>
                                                </Card>

                                                {/* Istruzioni di pallettizzazione */}
                                                <Card>
                                                    <CardHeader>
                                                        <CardTitle className="text-lg">
                                                            {t(
                                                                'articles.create.section_palletization_instructions',
                                                            )}
                                                        </CardTitle>
                                                    </CardHeader>
                                                    <CardContent className="space-y-4">
                                                        <div className="space-y-3">
                                                            {palletizingInstructionRows.map(
                                                                (row) => (
                                                                    <div
                                                                        key={
                                                                            row.id
                                                                        }
                                                                        className="grid grid-cols-12 items-end gap-2"
                                                                    >
                                                                        <div className="col-span-11">
                                                                            <Select
                                                                                value={
                                                                                    row.instructionUuid
                                                                                }
                                                                                onValueChange={(
                                                                                    value,
                                                                                ) =>
                                                                                    updatePalletizingInstructionRow(
                                                                                        row.id,
                                                                                        value,
                                                                                    )
                                                                                }
                                                                            >
                                                                                <SelectTrigger>
                                                                                    <SelectValue
                                                                                        placeholder={t(
                                                                                            'articles.create.placeholder_palletization_instructions',
                                                                                        )}
                                                                                    />
                                                                                </SelectTrigger>
                                                                                <SelectContent>
                                                                                    {actualPalletizingInstructions.map(
                                                                                        (
                                                                                            instruction,
                                                                                        ) => (
                                                                                            <SelectItem
                                                                                                key={
                                                                                                    instruction.uuid
                                                                                                }
                                                                                                value={
                                                                                                    instruction.uuid
                                                                                                }
                                                                                            >
                                                                                                {
                                                                                                    instruction.code
                                                                                                }{' '}
                                                                                                {instruction.number
                                                                                                    ? `- ${instruction.number}`
                                                                                                    : ''}
                                                                                            </SelectItem>
                                                                                        ),
                                                                                    )}
                                                                                </SelectContent>
                                                                            </Select>
                                                                        </div>
                                                                        <div className="col-span-1">
                                                                            <Button
                                                                                type="button"
                                                                                variant="destructive"
                                                                                size="sm"
                                                                                onClick={() =>
                                                                                    removePalletizingInstructionRow(
                                                                                        row.id,
                                                                                    )
                                                                                }
                                                                            >
                                                                                <X className="h-4 w-4" />
                                                                            </Button>
                                                                        </div>
                                                                    </div>
                                                                ),
                                                            )}
                                                        </div>
                                                        <Button
                                                            type="button"
                                                            variant="outline"
                                                            onClick={
                                                                addPalletizingInstructionRow
                                                            }
                                                        >
                                                            <Plus className="mr-2 h-4 w-4" />
                                                            {t(
                                                                'articles.create.add_palletization_instructions',
                                                            )}
                                                        </Button>
                                                    </CardContent>
                                                </Card>

                                                {/* Istruzioni operative */}
                                                <Card>
                                                    <CardHeader>
                                                        <CardTitle className="text-lg">
                                                            {t(
                                                                'articles.create.section_operational_instructions',
                                                            )}
                                                        </CardTitle>
                                                    </CardHeader>
                                                    <CardContent className="space-y-4">
                                                        <div className="space-y-3">
                                                            {operatingInstructionRows.map(
                                                                (row) => (
                                                                    <div
                                                                        key={
                                                                            row.id
                                                                        }
                                                                        className="grid grid-cols-12 items-end gap-2"
                                                                    >
                                                                        <div className="col-span-11">
                                                                            <Select
                                                                                value={
                                                                                    row.instructionUuid
                                                                                }
                                                                                onValueChange={(
                                                                                    value,
                                                                                ) =>
                                                                                    updateOperatingInstructionRow(
                                                                                        row.id,
                                                                                        value,
                                                                                    )
                                                                                }
                                                                            >
                                                                                <SelectTrigger>
                                                                                    <SelectValue
                                                                                        placeholder={t(
                                                                                            'articles.create.placeholder_operational_instructions',
                                                                                        )}
                                                                                    />
                                                                                </SelectTrigger>
                                                                                <SelectContent>
                                                                                    {actualOperatingInstructions.map(
                                                                                        (
                                                                                            instruction,
                                                                                        ) => (
                                                                                            <SelectItem
                                                                                                key={
                                                                                                    instruction.uuid
                                                                                                }
                                                                                                value={
                                                                                                    instruction.uuid
                                                                                                }
                                                                                            >
                                                                                                {
                                                                                                    instruction.code
                                                                                                }{' '}
                                                                                                {instruction.number
                                                                                                    ? `- ${instruction.number}`
                                                                                                    : ''}
                                                                                            </SelectItem>
                                                                                        ),
                                                                                    )}
                                                                                </SelectContent>
                                                                            </Select>
                                                                        </div>
                                                                        <div className="col-span-1">
                                                                            <Button
                                                                                type="button"
                                                                                variant="destructive"
                                                                                size="sm"
                                                                                onClick={() =>
                                                                                    removeOperatingInstructionRow(
                                                                                        row.id,
                                                                                    )
                                                                                }
                                                                            >
                                                                                <X className="h-4 w-4" />
                                                                            </Button>
                                                                        </div>
                                                                    </div>
                                                                ),
                                                            )}
                                                        </div>
                                                        <Button
                                                            type="button"
                                                            variant="outline"
                                                            onClick={
                                                                addOperatingInstructionRow
                                                            }
                                                        >
                                                            <Plus className="mr-2 h-4 w-4" />
                                                            {t(
                                                                'articles.create.add_operational_instructions',
                                                            )}
                                                        </Button>
                                                    </CardContent>
                                                </Card>

                                                {/* Materiali di consumo non a DB */}
                                                <Card>
                                                    <CardHeader>
                                                        <CardTitle className="text-lg">
                                                            {t(
                                                                'articles.create.section_materials',
                                                            )}
                                                        </CardTitle>
                                                    </CardHeader>
                                                    <CardContent className="space-y-4">
                                                        <div className="space-y-3">
                                                            {materialRows.map(
                                                                (row) => (
                                                                    <div
                                                                        key={
                                                                            row.id
                                                                        }
                                                                        className="grid grid-cols-12 items-end gap-2"
                                                                    >
                                                                        <div className="col-span-11">
                                                                            <Select
                                                                                value={
                                                                                    row.materialUuid
                                                                                }
                                                                                onValueChange={(
                                                                                    value,
                                                                                ) =>
                                                                                    updateMaterialRow(
                                                                                        row.id,
                                                                                        value,
                                                                                    )
                                                                                }
                                                                            >
                                                                                <SelectTrigger>
                                                                                    <SelectValue
                                                                                        placeholder={t(
                                                                                            'articles.create.placeholder_materials',
                                                                                        )}
                                                                                    />
                                                                                </SelectTrigger>
                                                                                <SelectContent>
                                                                                    {actualMaterials.map(
                                                                                        (
                                                                                            material,
                                                                                        ) => (
                                                                                            <SelectItem
                                                                                                key={
                                                                                                    material.uuid
                                                                                                }
                                                                                                value={
                                                                                                    material.uuid
                                                                                                }
                                                                                            >
                                                                                                {
                                                                                                    material.cod
                                                                                                }{' '}
                                                                                                -{' '}
                                                                                                {material.description ||
                                                                                                    t(
                                                                                                        'common.no_description',
                                                                                                    )}
                                                                                            </SelectItem>
                                                                                        ),
                                                                                    )}
                                                                                </SelectContent>
                                                                            </Select>
                                                                        </div>
                                                                        <div className="col-span-1">
                                                                            <Button
                                                                                type="button"
                                                                                variant="destructive"
                                                                                size="sm"
                                                                                onClick={() =>
                                                                                    removeMaterialRow(
                                                                                        row.id,
                                                                                    )
                                                                                }
                                                                            >
                                                                                <X className="h-4 w-4" />
                                                                            </Button>
                                                                        </div>
                                                                    </div>
                                                                ),
                                                            )}
                                                        </div>
                                                        <Button
                                                            type="button"
                                                            variant="outline"
                                                            onClick={
                                                                addMaterialRow
                                                            }
                                                        >
                                                            <Plus className="mr-2 h-4 w-4" />
                                                            {t(
                                                                'articles.create.add_materials',
                                                            )}
                                                        </Button>
                                                    </CardContent>
                                                </Card>

                                                {/* Criticality */}
                                                <Card>
                                                    <CardHeader>
                                                        <CardTitle className="text-lg">
                                                            {t(
                                                                'articles.create.section_critical_issues',
                                                            )}
                                                        </CardTitle>
                                                    </CardHeader>
                                                    <CardContent className="space-y-4">
                                                        <div className="space-y-3">
                                                            {criticalIssueRows.map(
                                                                (row) => (
                                                                    <div
                                                                        key={
                                                                            row.id
                                                                        }
                                                                        className="grid grid-cols-12 items-end gap-2"
                                                                    >
                                                                        <div className="col-span-11">
                                                                            <Select
                                                                                value={
                                                                                    row.criticalIssueUuid
                                                                                }
                                                                                onValueChange={(
                                                                                    value,
                                                                                ) =>
                                                                                    updateCriticalIssueRow(
                                                                                        row.id,
                                                                                        value,
                                                                                    )
                                                                                }
                                                                            >
                                                                                <SelectTrigger>
                                                                                    <SelectValue
                                                                                        placeholder={t(
                                                                                            'articles.create.placeholder_critical_issues',
                                                                                        )}
                                                                                    />
                                                                                </SelectTrigger>
                                                                                <SelectContent>
                                                                                    {actualCriticalIssues.map(
                                                                                        (
                                                                                            critical,
                                                                                        ) => (
                                                                                            <SelectItem
                                                                                                key={
                                                                                                    critical.uuid
                                                                                                }
                                                                                                value={
                                                                                                    critical.uuid
                                                                                                }
                                                                                            >
                                                                                                {
                                                                                                    critical.name
                                                                                                }
                                                                                            </SelectItem>
                                                                                        ),
                                                                                    )}
                                                                                </SelectContent>
                                                                            </Select>
                                                                        </div>
                                                                        <div className="col-span-1">
                                                                            <Button
                                                                                type="button"
                                                                                variant="destructive"
                                                                                size="sm"
                                                                                onClick={() =>
                                                                                    removeCriticalIssueRow(
                                                                                        row.id,
                                                                                    )
                                                                                }
                                                                            >
                                                                                <X className="h-4 w-4" />
                                                                            </Button>
                                                                        </div>
                                                                    </div>
                                                                ),
                                                            )}
                                                        </div>
                                                        <Button
                                                            type="button"
                                                            variant="outline"
                                                            onClick={
                                                                addCriticalIssueRow
                                                            }
                                                        >
                                                            <Plus className="mr-2 h-4 w-4" />
                                                            {t(
                                                                'articles.create.add_critical_issues',
                                                            )}
                                                        </Button>
                                                    </CardContent>
                                                </Card>

                                                {/* Verifica consumi materiali o prodotti */}
                                                <Card>
                                                    <CardHeader>
                                                        <CardTitle className="text-lg">
                                                            {t(
                                                                'articles.create.section_check_materials',
                                                            )}
                                                        </CardTitle>
                                                    </CardHeader>
                                                    <CardContent className="space-y-4">
                                                        <div className="space-y-3">
                                                            {checkMaterialRows.map(
                                                                (row) => (
                                                                    <div
                                                                        key={
                                                                            row.id
                                                                        }
                                                                        className="grid grid-cols-12 items-end gap-2"
                                                                    >
                                                                        <div className="col-span-5">
                                                                            <Select
                                                                                value={
                                                                                    row.materialUuid
                                                                                }
                                                                                onValueChange={(
                                                                                    value,
                                                                                ) =>
                                                                                    updateCheckMaterialRow(
                                                                                        row.id,
                                                                                        'materialUuid',
                                                                                        value,
                                                                                    )
                                                                                }
                                                                            >
                                                                                <SelectTrigger>
                                                                                    <SelectValue
                                                                                        placeholder={t(
                                                                                            'articles.create.placeholder_material',
                                                                                        )}
                                                                                    />
                                                                                </SelectTrigger>
                                                                                <SelectContent>
                                                                                    {actualMaterials.map(
                                                                                        (
                                                                                            material,
                                                                                        ) => (
                                                                                            <SelectItem
                                                                                                key={
                                                                                                    material.uuid
                                                                                                }
                                                                                                value={
                                                                                                    material.uuid
                                                                                                }
                                                                                            >
                                                                                                {
                                                                                                    material.cod
                                                                                                }{' '}
                                                                                                -{' '}
                                                                                                {material.description ||
                                                                                                    t(
                                                                                                        'common.no_description',
                                                                                                    )}
                                                                                            </SelectItem>
                                                                                        ),
                                                                                    )}
                                                                                </SelectContent>
                                                                            </Select>
                                                                        </div>
                                                                        <div className="col-span-2">
                                                                            <Input
                                                                                value={
                                                                                    row.um
                                                                                }
                                                                                onChange={(
                                                                                    e,
                                                                                ) =>
                                                                                    updateCheckMaterialRow(
                                                                                        row.id,
                                                                                        'um',
                                                                                        e
                                                                                            .target
                                                                                            .value,
                                                                                    )
                                                                                }
                                                                                placeholder={t(
                                                                                    'articles.create.placeholder_um',
                                                                                )}
                                                                            />
                                                                        </div>
                                                                        <div className="col-span-2">
                                                                            <Input
                                                                                type="number"
                                                                                step="0.01"
                                                                                value={
                                                                                    row.quantityExpected
                                                                                }
                                                                                onChange={(
                                                                                    e,
                                                                                ) =>
                                                                                    updateCheckMaterialRow(
                                                                                        row.id,
                                                                                        'quantityExpected',
                                                                                        e
                                                                                            .target
                                                                                            .value,
                                                                                    )
                                                                                }
                                                                                placeholder={t(
                                                                                    'articles.create.placeholder_qty_expected',
                                                                                )}
                                                                            />
                                                                        </div>
                                                                        <div className="col-span-2">
                                                                            <Input
                                                                                type="number"
                                                                                step="0.01"
                                                                                value={
                                                                                    row.quantityEffective
                                                                                }
                                                                                onChange={(
                                                                                    e,
                                                                                ) =>
                                                                                    updateCheckMaterialRow(
                                                                                        row.id,
                                                                                        'quantityEffective',
                                                                                        e
                                                                                            .target
                                                                                            .value,
                                                                                    )
                                                                                }
                                                                                placeholder={t(
                                                                                    'articles.create.placeholder_qty_effective',
                                                                                )}
                                                                            />
                                                                        </div>
                                                                        <div className="col-span-1">
                                                                            <Button
                                                                                type="button"
                                                                                variant="destructive"
                                                                                size="sm"
                                                                                onClick={() =>
                                                                                    removeCheckMaterialRow(
                                                                                        row.id,
                                                                                    )
                                                                                }
                                                                            >
                                                                                <X className="h-4 w-4" />
                                                                            </Button>
                                                                        </div>
                                                                    </div>
                                                                ),
                                                            )}
                                                        </div>
                                                        <Button
                                                            type="button"
                                                            variant="outline"
                                                            onClick={
                                                                addCheckMaterialRow
                                                            }
                                                        >
                                                            <Plus className="mr-2 h-4 w-4" />
                                                            {t(
                                                                'articles.create.add_check',
                                                            )}
                                                        </Button>
                                                    </CardContent>
                                                </Card>

                                                {/* Labels Section */}
                                                <Card>
                                                    <CardHeader>
                                                        <CardTitle className="text-lg">
                                                            {t(
                                                                'articles.edit.section_labels',
                                                            )}
                                                        </CardTitle>
                                                    </CardHeader>
                                                    <CardContent className="space-y-4">
                                                        <div className="grid gap-2">
                                                            <FormLabel htmlFor="labels_external">
                                                                {t(
                                                                    'articles.edit.labels_external',
                                                                )}
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
                                                                    <SelectValue
                                                                        placeholder={t(
                                                                            'articles.create.placeholders.labels_external',
                                                                        )}
                                                                    />
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
                                                                {t(
                                                                    'articles.edit.labels_pvp',
                                                                )}
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
                                                                    <SelectValue
                                                                        placeholder={t(
                                                                            'articles.create.placeholders.labels_pvp',
                                                                        )}
                                                                    />
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
                                                                {t(
                                                                    'articles.edit.value_pvp',
                                                                )}
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
                                                                {t(
                                                                    'articles.edit.labels_ingredient',
                                                                )}
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
                                                                    <SelectValue
                                                                        placeholder={t(
                                                                            'articles.create.placeholders.labels_ingredient',
                                                                        )}
                                                                    />
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
                                                                {t(
                                                                    'articles.edit.labels_data_variable',
                                                                )}
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
                                                                    <SelectValue
                                                                        placeholder={t(
                                                                            'articles.create.placeholders.labels_data_variable',
                                                                        )}
                                                                    />
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
                                                                {t(
                                                                    'articles.edit.label_jumpers',
                                                                )}
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
                                                                    <SelectValue
                                                                        placeholder={t(
                                                                            'articles.create.placeholders.label_of_jumpers',
                                                                        )}
                                                                    />
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

                                                {/* Weight and Control Section */}
                                                <Card>
                                                    <CardHeader>
                                                        <CardTitle className="text-lg">
                                                            {t(
                                                                'articles.edit.section_weight',
                                                            )}
                                                        </CardTitle>
                                                    </CardHeader>
                                                    <CardContent className="space-y-4">
                                                        <div className="grid gap-2">
                                                            <FormLabel htmlFor="weight_kg">
                                                                {t(
                                                                    'articles.edit.weight_kg',
                                                                )}
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
                                                                {t(
                                                                    'articles.edit.nominal_weight_control',
                                                                )}
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
                                                                    <SelectValue
                                                                        placeholder={t(
                                                                            'articles.create.placeholders.nominal_weight_control',
                                                                        )}
                                                                    />
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
                                                                {t(
                                                                    'articles.edit.unit_of_measure',
                                                                )}
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
                                                                placeholder={t(
                                                                    'articles.edit.unit_of_measure',
                                                                )}
                                                            />
                                                        </div>

                                                        <div className="grid gap-2">
                                                            <FormLabel htmlFor="weight_value">
                                                                {t(
                                                                    'articles.edit.value_label',
                                                                )}
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
                                                                {t(
                                                                    'articles.edit.object_control',
                                                                )}
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
                                                                    <SelectValue
                                                                        placeholder={t(
                                                                            'articles.create.placeholders.object_control_weight',
                                                                        )}
                                                                    />
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

                                                {/* Additional Fields Section */}
                                                <Card>
                                                    <CardHeader>
                                                        <CardTitle className="text-lg">
                                                            {t(
                                                                'articles.edit.section_other',
                                                            )}
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
                                                                {t(
                                                                    'articles.edit.allergens',
                                                                )}
                                                            </label>
                                                        </div>

                                                        <div className="grid gap-2">
                                                            <FormLabel htmlFor="pallet_sheet">
                                                                {t(
                                                                    'articles.edit.pallet_sheet',
                                                                )}
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
                                                                    <SelectValue
                                                                        placeholder={t(
                                                                            'articles.create.placeholders.pallet_sheet',
                                                                        )}
                                                                    />
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
                                                                                    t(
                                                                                        'common.no_description',
                                                                                    )}
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
                                                                {t(
                                                                    'articles.edit.model_cq',
                                                                )}
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
                                                                    <SelectValue
                                                                        placeholder={t(
                                                                            'articles.create.placeholders.model_cq',
                                                                        )}
                                                                    />
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
                                                                                    t(
                                                                                        'common.no_description',
                                                                                    )}
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
                                                                {t(
                                                                    'articles.edit.customer_samples',
                                                                )}
                                                            </FormLabel>
                                                            <Select
                                                                name="customer_samples_list"
                                                                value={
                                                                    customerSamples
                                                                }
                                                                onValueChange={
                                                                    setCustomerSamples
                                                                }
                                                            >
                                                                <SelectTrigger>
                                                                    <SelectValue
                                                                        placeholder={t(
                                                                            'articles.create.placeholders.customer_samples',
                                                                        )}
                                                                    />
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

                                                {/* Average Productivity Section */}
                                                {actualMediaValues && (
                                                    <Card>
                                                        <CardHeader>
                                                            <CardTitle className="text-lg">
                                                                {t(
                                                                    'articles.edit.section_media',
                                                                )}
                                                            </CardTitle>
                                                        </CardHeader>
                                                        <CardContent className="space-y-4">
                                                            <div className="grid grid-cols-2 gap-4">
                                                                <div className="grid gap-2">
                                                                    <FormLabel htmlFor="media_prevista_cfz_h_pz">
                                                                        {t(
                                                                            'articles.edit.media_prevista_cfz',
                                                                        )}
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
                                                                        {t(
                                                                            'articles.edit.media_reale_cfz',
                                                                        )}
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
                                                                        {t(
                                                                            'articles.edit.media_prevista_pz',
                                                                        )}
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
                                                                        {t(
                                                                            'articles.edit.media_reale_pz',
                                                                        )}
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
                                                                                    : '0.00000'
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
                                                            {t(
                                                                'articles.edit.section_approvals',
                                                            )}
                                                        </CardTitle>
                                                    </CardHeader>
                                                    <CardContent className="space-y-6">
                                                        {/* Production Approval */}
                                                        <div className="space-y-3 border-b pb-4">
                                                            <FormLabel htmlFor="production_approval_checkbox">
                                                                {t(
                                                                    'articles.edit.approval_production',
                                                                )}
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
                                                                    {t(
                                                                        'articles.edit.approved',
                                                                    )}
                                                                </label>
                                                            </div>
                                                            <div className="grid gap-2">
                                                                <FormLabel htmlFor="production_approval_employee">
                                                                    {t(
                                                                        'articles.edit.employee',
                                                                    )}
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
                                                                    placeholder={t(
                                                                        'articles.edit.placeholder_employee',
                                                                    )}
                                                                />
                                                            </div>
                                                            <div className="grid gap-2">
                                                                <FormLabel htmlFor="production_approval_date">
                                                                    {t(
                                                                        'articles.edit.date',
                                                                    )}
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
                                                                    {t(
                                                                        'articles.edit.notes',
                                                                    )}
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

                                                        {/* Quality Approval */}
                                                        <div className="space-y-3 border-b pb-4">
                                                            <FormLabel htmlFor="approv_quality_checkbox">
                                                                {t(
                                                                    'articles.edit.approval_quality',
                                                                )}
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
                                                                    {t(
                                                                        'articles.edit.approved',
                                                                    )}
                                                                </label>
                                                            </div>
                                                            <div className="grid gap-2">
                                                                <FormLabel htmlFor="approv_quality_employee">
                                                                    {t(
                                                                        'articles.edit.employee',
                                                                    )}
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
                                                                    placeholder={t(
                                                                        'articles.edit.placeholder_employee',
                                                                    )}
                                                                />
                                                            </div>
                                                            <div className="grid gap-2">
                                                                <FormLabel htmlFor="approv_quality_date">
                                                                    {t(
                                                                        'articles.edit.date',
                                                                    )}
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
                                                                    {t(
                                                                        'articles.edit.notes',
                                                                    )}
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

                                                        {/* Commercial Approval */}
                                                        <div className="space-y-3 border-b pb-4">
                                                            <FormLabel htmlFor="commercial_approval_checkbox">
                                                                {t(
                                                                    'articles.edit.approval_commercial',
                                                                )}
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
                                                                    {t(
                                                                        'articles.edit.approved',
                                                                    )}
                                                                </label>
                                                            </div>
                                                            <div className="grid gap-2">
                                                                <FormLabel htmlFor="commercial_approval_employee">
                                                                    {t(
                                                                        'articles.edit.employee',
                                                                    )}
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
                                                                    placeholder={t(
                                                                        'articles.edit.placeholder_employee',
                                                                    )}
                                                                />
                                                            </div>
                                                            <div className="grid gap-2">
                                                                <FormLabel htmlFor="commercial_approval_date">
                                                                    {t(
                                                                        'articles.edit.date',
                                                                    )}
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
                                                                    {t(
                                                                        'articles.edit.notes',
                                                                    )}
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

                                                        {/* Customer Approval */}
                                                        <div className="space-y-3">
                                                            <FormLabel htmlFor="client_approval_checkbox">
                                                                {t(
                                                                    'articles.edit.approval_client',
                                                                )}
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
                                                                        // Sync check_approval (also in backend)
                                                                    }}
                                                                />
                                                                <label
                                                                    htmlFor="client_approval_checkbox"
                                                                    className="text-sm font-medium"
                                                                >
                                                                    {t(
                                                                        'articles.edit.approved',
                                                                    )}
                                                                </label>
                                                            </div>
                                                            <div className="grid gap-2">
                                                                <FormLabel htmlFor="client_approval_employee">
                                                                    {t(
                                                                        'articles.edit.employee',
                                                                    )}
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
                                                                    placeholder={t(
                                                                        'articles.edit.placeholder_employee',
                                                                    )}
                                                                />
                                                            </div>
                                                            <div className="grid gap-2">
                                                                <FormLabel htmlFor="client_approval_date">
                                                                    {t(
                                                                        'articles.edit.date',
                                                                    )}
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
                                                                    {t(
                                                                        'articles.edit.notes',
                                                                    )}
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
                                                        aria-label={
                                                            actualSourceArticle
                                                                ? t(
                                                                      'articles.create.save_as_new_article',
                                                                  )
                                                                : t(
                                                                      'articles.create.create_article_button',
                                                                  )
                                                        }
                                                    >
                                                        {processing
                                                            ? actualSourceArticle
                                                                ? t(
                                                                      'common.saving',
                                                                  )
                                                                : t(
                                                                      'articles.create.creating',
                                                                  )
                                                            : actualSourceArticle
                                                              ? t(
                                                                    'articles.create.save_as_new_article',
                                                                )
                                                              : t(
                                                                    'articles.create.create_article_button',
                                                                )}
                                                    </Button>
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        onClick={() =>
                                                            setShowCloseConfirm(
                                                                true,
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
            <ConfirmCloseDialog
                open={showCloseConfirm}
                onOpenChange={setShowCloseConfirm}
                onConfirm={() => {
                    setShowCloseConfirm(false);
                    router.visit(articles.index().url);
                }}
            />
        </AppLayout>
    );
}
