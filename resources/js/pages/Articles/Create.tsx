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
import { useFieldValidation } from '@/hooks/useFieldValidation';
import AppLayout from '@/layouts/app-layout';
import { validationRules } from '@/lib/validation/rules';
import articles from '@/routes/articles';
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
    valuetype?: string | null; // "testo", "numero", o lista separada por comas
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
    /** Converti in Articolo: dati dell'offerta per precompilare (senza sourceArticle) */
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

    // Convertire data ISO in yyyy-MM-dd per input date
    const formatDateForInput = (
        dateString: string | null | undefined,
    ): string => {
        if (!dateString) return '';
        try {
            // Se è già in formato yyyy-MM-dd, restituire così com'è
            if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
                return dateString;
            }
            // Se è in formato ISO, estrarre solo la parte data
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

    // Stato per relazioni many-to-many
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
            title: 'Crea',
            href: articles.create().url,
        },
    ];

    // Aggiornare valori quando cambia l'offerta da props
    useEffect(() => {
        if (
            props.selectedOfferUuid &&
            props.selectedOfferUuid !== selectedOffer
        ) {
            const uuid = props.selectedOfferUuid;
            queueMicrotask(() => setSelectedOffer(uuid));
        }
        if (props.um && props.um !== actualUm) {
            // um si aggiorna automaticamente da props
        }
        if (props.mediaValues && props.mediaValues !== actualMediaValues) {
            // mediaValues si aggiorna automaticamente da props
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

    // Aggiungere/rimuovere righe dinamiche
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
            <Head title="Crea Articolo" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                {actualSourceArticle && (
                    <Alert>
                        <Info className="h-4 w-4" />
                        <AlertDescription>
                            Stai duplicando l'articolo{' '}
                            <strong>
                                {actualSourceArticle.cod_article_las}
                            </strong>
                            . I dati verranno precompilati, ma puoi modificarli
                            prima di salvare.
                        </AlertDescription>
                    </Alert>
                )}
                <Card>
                    <CardHeader>
                        <CardTitle>
                            {actualSourceArticle
                                ? 'Duplica Articolo'
                                : 'Crea Nuovo Articolo'}
                        </CardTitle>
                        <CardDescription>
                            {actualSourceArticle
                                ? "Modifica i dettagli per creare una copia dell'articolo"
                                : 'Compila i dettagli per creare un nuovo articolo'}
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

                                return (
                                    <>
                                        {actualSourceArticle && (
                                            <input
                                                type="hidden"
                                                name="source_article_uuid"
                                                value={actualSourceArticle.uuid}
                                            />
                                        )}
                                        {/* Input nascosti per checkbox (per inviare 0 se non selezionati) */}
                                        <input
                                            type="hidden"
                                            name="visibility_cod"
                                            value={visibilityCod ? 1 : 0}
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
                                                approvQualityCheckbox ? 1 : 0
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
                                                clientApprovalCheckbox ? 1 : 0
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
                                                    value={row.machineryUuid}
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
                                            .filter((row) => row.materialUuid)
                                            .map((row, idx) => (
                                                <input
                                                    key={`material-${idx}`}
                                                    type="hidden"
                                                    name={`materials[${idx}]`}
                                                    value={row.materialUuid}
                                                />
                                            ))}
                                        {criticalIssueRows
                                            .filter(
                                                (row) => row.criticalIssueUuid,
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
                                                (row) => row.instructionUuid,
                                            )
                                            .map((row, idx) => (
                                                <input
                                                    key={`packaging-${idx}`}
                                                    type="hidden"
                                                    name={`packaging_instructions[${idx}]`}
                                                    value={row.instructionUuid}
                                                />
                                            ))}
                                        {operatingInstructionRows
                                            .filter(
                                                (row) => row.instructionUuid,
                                            )
                                            .map((row, idx) => (
                                                <input
                                                    key={`operating-${idx}`}
                                                    type="hidden"
                                                    name={`operating_instructions[${idx}]`}
                                                    value={row.instructionUuid}
                                                />
                                            ))}
                                        {palletizingInstructionRows
                                            .filter(
                                                (row) => row.instructionUuid,
                                            )
                                            .map((row, idx) => (
                                                <input
                                                    key={`palletizing-${idx}`}
                                                    type="hidden"
                                                    name={`palletizing_instructions[${idx}]`}
                                                    value={row.instructionUuid}
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
                                                        value={row.materialUuid}
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
                                                    {offers.map((offer) => (
                                                        <SelectItem
                                                            key={offer.uuid}
                                                            value={offer.uuid}
                                                        >
                                                            {offer.offer_number}{' '}
                                                            -{' '}
                                                            {offer.description ||
                                                                'Senza descrizione'}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <InputError
                                                message={allErrors.offer_uuid}
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
                                                placeholder="Lascia vuoto per generazione automatica"
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
                                                    actualSourceArticle?.cod_article_client ||
                                                    codArticleClientFromOffer ||
                                                    props.codArticleClientFromOffer ||
                                                    ''
                                                }
                                                placeholder="Codice articolo cliente"
                                            />
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
                                                    actualSourceArticle?.additional_descr ||
                                                    additionalDescrFromOffer ||
                                                    props.additionalDescrFromOffer ||
                                                    ''
                                                }
                                                placeholder="Descrizione aggiuntiva dell'articolo"
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
                                                onCheckedChange={(checked) =>
                                                    setVisibilityCod(
                                                        checked === true,
                                                    )
                                                }
                                            />
                                            <label
                                                htmlFor="visibility_cod"
                                                className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                            >
                                                Visibilità codice LAS su ordine
                                            </label>
                                        </div>

                                        <div className="flex items-center space-x-2">
                                            <Checkbox
                                                id="stock_managed"
                                                name="stock_managed"
                                                checked={stockManaged}
                                                onCheckedChange={(checked) =>
                                                    setStockManaged(
                                                        checked === true,
                                                    )
                                                }
                                            />
                                            <label
                                                htmlFor="stock_managed"
                                                className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                            >
                                                Articolo gestito a magazzino
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
                                                                key={option.key}
                                                                value={option.key.toString()}
                                                            >
                                                                {option.value}
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
                                                value={expirationAttribution}
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
                                                                key={option.key}
                                                                value={option.key.toString()}
                                                            >
                                                                {option.value}
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
                                                    setEan(e.target.value)
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
                                                                key={option.key}
                                                                value={option.key.toString()}
                                                            >
                                                                {option.value}
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
                                                    actualSourceArticle?.article_category ||
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
                                                                {category.name}
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
                                                    actualSourceArticle?.pallet_uuid ||
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
                                                                {pallet.cod} -{' '}
                                                                {pallet.description ||
                                                                    'Senza descrizione'}
                                                            </SelectItem>
                                                        ),
                                                    )}
                                                </SelectContent>
                                            </Select>
                                            <InputError
                                                message={allErrors.pallet_uuid}
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
                                                Numero di pezzi per confezione.
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
                                                Numero di piani per pallet.
                                            </p>
                                            <InputError
                                                message={allErrors.pallet_plans}
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
                                                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif"
                                                onChange={(event) => {
                                                    const file =
                                                        event.target.files?.[0];
                                                    setLineLayoutFileName(
                                                        file ? file.name : null,
                                                    );
                                                }}
                                            />
                                            {actualSourceArticle?.line_layout && (
                                                <p className="text-xs text-muted-foreground">
                                                    Allegato attuale:{' '}
                                                    {
                                                        actualSourceArticle.line_layout
                                                    }{' '}
                                                    (verrà copiato se non
                                                    selezioni un nuovo allegato)
                                                </p>
                                            )}
                                            {lineLayoutFileName && (
                                                <p className="text-xs text-muted-foreground">
                                                    Nuovo allegato selezionato:{' '}
                                                    <span className="font-mono">
                                                        {lineLayoutFileName}
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
                                                    Elenco macchinari e
                                                    parametri
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent className="space-y-4">
                                                <div className="space-y-3">
                                                    {machineryRows.map(
                                                        (row) => {
                                                            const selectedMachinery =
                                                                actualMachinery.find(
                                                                    (m) =>
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
                                                                    key={row.id}
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
                                                                                <SelectValue placeholder="Seleziona macchinario..." />
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
                                                                                placeholder="Valore"
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
                                                                                placeholder="Valore"
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
                                                                                placeholder="Valore"
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
                                                                                    <SelectValue placeholder="Seleziona un valore" />
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
                                                                                placeholder="Valore"
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
                                                    onClick={addMachineryRow}
                                                >
                                                    <Plus className="mr-2 h-4 w-4" />
                                                    Aggiungi macchinario
                                                </Button>
                                            </CardContent>
                                        </Card>

                                        {/* Istruzioni di confezionamento */}
                                        <Card>
                                            <CardHeader>
                                                <CardTitle className="text-lg">
                                                    Istruzioni di
                                                    confezionamento
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent className="space-y-4">
                                                <div className="space-y-3">
                                                    {packagingInstructionRows.map(
                                                        (row) => (
                                                            <div
                                                                key={row.id}
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
                                                                            <SelectValue placeholder="Seleziona istruzioni di confezionamento..." />
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
                                                    Aggiungi istruzioni di
                                                    confezionamento
                                                </Button>
                                            </CardContent>
                                        </Card>

                                        {/* Istruzioni di pallettizzazione */}
                                        <Card>
                                            <CardHeader>
                                                <CardTitle className="text-lg">
                                                    Istruzioni di
                                                    pallettizzazione
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent className="space-y-4">
                                                <div className="space-y-3">
                                                    {palletizingInstructionRows.map(
                                                        (row) => (
                                                            <div
                                                                key={row.id}
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
                                                                            <SelectValue placeholder="Seleziona istruzioni di pallettizzazione..." />
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
                                                    Aggiungi istruzioni di
                                                    pallettizzazione
                                                </Button>
                                            </CardContent>
                                        </Card>

                                        {/* Istruzioni operative */}
                                        <Card>
                                            <CardHeader>
                                                <CardTitle className="text-lg">
                                                    Istruzioni operative
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent className="space-y-4">
                                                <div className="space-y-3">
                                                    {operatingInstructionRows.map(
                                                        (row) => (
                                                            <div
                                                                key={row.id}
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
                                                                            <SelectValue placeholder="Seleziona istruzioni operative..." />
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
                                                    Aggiungi istruzioni
                                                    operative
                                                </Button>
                                            </CardContent>
                                        </Card>

                                        {/* Materiali di consumo non a DB */}
                                        <Card>
                                            <CardHeader>
                                                <CardTitle className="text-lg">
                                                    Materiali di consumo non a
                                                    DB
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent className="space-y-4">
                                                <div className="space-y-3">
                                                    {materialRows.map((row) => (
                                                        <div
                                                            key={row.id}
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
                                                                        <SelectValue placeholder="Seleziona materiali di consumo non a DB..." />
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
                                                                                        'Senza descrizione'}
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
                                                    ))}
                                                </div>
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    onClick={addMaterialRow}
                                                >
                                                    <Plus className="mr-2 h-4 w-4" />
                                                    Aggiungi materiali
                                                </Button>
                                            </CardContent>
                                        </Card>

                                        {/* Criticità */}
                                        <Card>
                                            <CardHeader>
                                                <CardTitle className="text-lg">
                                                    Criticità
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent className="space-y-4">
                                                <div className="space-y-3">
                                                    {criticalIssueRows.map(
                                                        (row) => (
                                                            <div
                                                                key={row.id}
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
                                                                            <SelectValue placeholder="Seleziona criticità..." />
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
                                                    Aggiungi criticità
                                                </Button>
                                            </CardContent>
                                        </Card>

                                        {/* Verifica consumi materiali o prodotti */}
                                        <Card>
                                            <CardHeader>
                                                <CardTitle className="text-lg">
                                                    Verifica consumi materiali o
                                                    prodotti
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent className="space-y-4">
                                                <div className="space-y-3">
                                                    {checkMaterialRows.map(
                                                        (row) => (
                                                            <div
                                                                key={row.id}
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
                                                                            <SelectValue placeholder="Materiale..." />
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
                                                                                            'Senza descrizione'}
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
                                                                        placeholder="U.M."
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
                                                                        placeholder="q.tà prev"
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
                                                                        placeholder="q.tà effett"
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
                                                    Aggiungi verifica
                                                </Button>
                                            </CardContent>
                                        </Card>

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
                                                        Etichette esterne
                                                    </FormLabel>
                                                    <Select
                                                        name="labels_external"
                                                        value={labelsExternal}
                                                        onValueChange={
                                                            setLabelsExternal
                                                        }
                                                    >
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Seleziona etichette esterne" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {actualLabelsExternalList.map(
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
                                                </div>

                                                <div className="grid gap-2">
                                                    <FormLabel htmlFor="labels_pvp">
                                                        Etichette pvp
                                                    </FormLabel>
                                                    <Select
                                                        name="labels_pvp"
                                                        value={labelsPvp}
                                                        onValueChange={
                                                            setLabelsPvp
                                                        }
                                                    >
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Seleziona etichetta pvp" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {actualLabelsPvpList.map(
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
                                                            value={valuePvp}
                                                            onChange={(e) =>
                                                                setValuePvp(
                                                                    e.target
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
                                                        Etichette ingredienti
                                                    </FormLabel>
                                                    <Select
                                                        name="labels_ingredient"
                                                        value={labelsIngredient}
                                                        onValueChange={
                                                            setLabelsIngredient
                                                        }
                                                    >
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Seleziona etichetta ingrediente" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {actualLabelsIngredientList.map(
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
                                                </div>

                                                <div className="grid gap-2">
                                                    <FormLabel htmlFor="labels_data_variable">
                                                        Etichette dati variabili
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
                                                </div>

                                                <div className="grid gap-2">
                                                    <FormLabel htmlFor="label_of_jumpers">
                                                        Etichetta cavallotti
                                                    </FormLabel>
                                                    <Select
                                                        name="label_of_jumpers"
                                                        value={labelOfJumpers}
                                                        onValueChange={
                                                            setLabelOfJumpers
                                                        }
                                                    >
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Seleziona etichetta cavallotto" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {actualLabelOfJumpersList.map(
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
                                                            value={weightKg}
                                                            onChange={(e) =>
                                                                setWeightKg(
                                                                    e.target
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
                                                                e.target.value,
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
                                                        value={weightValue}
                                                        onChange={(e) =>
                                                            setWeightValue(
                                                                e.target.value,
                                                            )
                                                        }
                                                        placeholder="0.000"
                                                        className="text-right"
                                                    />
                                                </div>

                                                <div className="grid gap-2">
                                                    <FormLabel htmlFor="object_control_weight">
                                                        Oggetto del controllo
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
                                                        checked={allergens}
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
                                                        Foglio pallet richiesto
                                                        da cliente
                                                    </FormLabel>
                                                    <Select
                                                        name="pallet_sheet"
                                                        value={palletSheet}
                                                        onValueChange={
                                                            setPalletSheet
                                                        }
                                                    >
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Seleziona foglio pallet" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {actualPalletSheets.map(
                                                                (sheet) => (
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
                                                        value={modelUuid}
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
                                                                (model) => (
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
                                                        value={customerSamples}
                                                        onValueChange={
                                                            setCustomerSamples
                                                        }
                                                    >
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Seleziona campione cliente" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {actualCustomerSamplesList.map(
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
                                                </div>
                                            </CardContent>
                                        </Card>

                                        {/* Sezione Media Produttività */}
                                        {actualMediaValues && (
                                            <Card>
                                                <CardHeader>
                                                    <CardTitle className="text-lg">
                                                        Media Produttività
                                                    </CardTitle>
                                                </CardHeader>
                                                <CardContent className="space-y-4">
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div className="grid gap-2">
                                                            <FormLabel htmlFor="media_prevista_cfz_h_pz">
                                                                Media prevista
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
                                                                Media reale
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
                                                                Media prevista
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
                                                                Media reale
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
                                                    Approvazioni
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent className="space-y-6">
                                                {/* Approvazione Produzione */}
                                                <div className="space-y-3 border-b pb-4">
                                                    <FormLabel htmlFor="production_approval_checkbox">
                                                        Approvazione Produzione
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
                                                            onChange={(e) =>
                                                                setProductionApprovalEmployee(
                                                                    e.target
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
                                                            onChange={(e) =>
                                                                setProductionApprovalDate(
                                                                    e.target
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
                                                            onChange={(e) =>
                                                                setProductionApprovalNotes(
                                                                    e.target
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
                                                        Approvazione Qualità
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
                                                            onChange={(e) =>
                                                                setApprovQualityEmployee(
                                                                    e.target
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
                                                            onChange={(e) =>
                                                                setApprovQualityDate(
                                                                    e.target
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
                                                            onChange={(e) =>
                                                                setApprovQualityNotes(
                                                                    e.target
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
                                                        Approvazione Commerciale
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
                                                            onChange={(e) =>
                                                                setCommercialApprovalEmployee(
                                                                    e.target
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
                                                            onChange={(e) =>
                                                                setCommercialApprovalDate(
                                                                    e.target
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
                                                            onChange={(e) =>
                                                                setCommercialApprovalNotes(
                                                                    e.target
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
                                                        Approvazione Cliente
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
                                                            onChange={(e) =>
                                                                setClientApprovalEmployee(
                                                                    e.target
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
                                                            onChange={(e) =>
                                                                setClientApprovalDate(
                                                                    e.target
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
                                                            onChange={(e) =>
                                                                setClientApprovalNotes(
                                                                    e.target
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
                                                    ? 'Creando...'
                                                    : 'Crea Articolo'}
                                            </Button>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() =>
                                                    router.visit(
                                                        articles.index().url,
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
        </AppLayout>
    );
}
