import { ConfirmCloseDialog } from '@/components/confirm-close-dialog';
import {
    FlashNotifications,
    useFlashNotifications,
} from '@/components/flash-notifications';
import { FormValidationNotification } from '@/components/form-validation-notification';
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
import offers from '@/routes/offers/index';
import { type BreadcrumbItem } from '@/types';
import type { FormDataConvertible } from '@inertiajs/core';
import { Form, Head, router, usePage } from '@inertiajs/react';
import { useCallback, useEffect, useState } from 'react';

type Customer = {
    uuid: string;
    code: string;
    company_name: string;
};

type Division = {
    uuid: string;
    name: string;
};

type Activity = {
    uuid: string;
    name: string;
};

type Sector = {
    uuid: string;
    name: string;
};

type Seasonality = {
    uuid: string;
    name: string;
};

type OrderType = {
    uuid: string;
    name: string;
};

type LasFamily = {
    uuid: string;
    code: string;
    name: string;
};

type LasWorkLine = {
    uuid: string;
    code: string;
    name: string;
};

type LsResource = {
    uuid: string;
    code: string;
    name: string;
};

type OperationCategory = {
    uuid: string;
    code: string;
    name: string;
};

type Operation = {
    uuid: string;
    codice_univoco: string;
    descrizione: string;
    secondi_operazione: number;
};

type OperationRow = {
    id: string;
    categoryUuid: string;
    operationUuid: string;
    secOp: number;
    numOp: number;
    totalSec: number;
};

type ExistingOperation = {
    uuid: string;
    category_uuid: string;
    operation_uuid: string;
    secondi_operazione: number;
    num_op: number;
    total_sec: number;
};

type Offer = {
    uuid: string;
    offer_number: string;
    offer_date?: string;
    validity_date?: string;
    customer_uuid?: string;
    customerdivision_uuid?: string;
    activity_uuid?: string;
    sector_uuid?: string;
    seasonality_uuid?: string;
    typeOrder?: { uuid: string; name: string } | null;
    order_type_uuid?: string;
    lasFamily?: { uuid: string; code: string; name: string } | null;
    lasfamily_uuid?: string;
    lasWorkLine?: { uuid: string; code: string; name: string } | null;
    lasworkline_uuid?: string;
    lsResource?: { uuid: string; code: string; name: string } | null;
    lsresource_uuid?: string;
    customer_ref?: string | null;
    article_code_ref?: string | null;
    provisional_description?: string | null;
    unit_of_measure?: string | null;
    quantity?: number | null;
    piece?: number | null;
    declared_weight_cfz?: number | null;
    declared_weight_pz?: number | null;
    notes?: string | null;
    expected_workers?: number | null;
    expected_revenue?: number | null;
    rate_rounding_cfz?: number | null;
    rate_increase_cfz?: number | null;
    materials_euro?: number | null;
    logistics_euro?: number | null;
    other_euro?: number | null;
    offer_notes?: string | null;
    ls_setup_cost?: number | null;
    ls_other_costs?: number | null;
    approval_status?: number | null;
};

type OffersEditProps = {
    offer: Offer;
    customers: Customer[];
    divisions: Division[];
    activities: Activity[];
    sectors: Sector[];
    seasonalities: Seasonality[];
    orderTypes: OrderType[];
    lasFamilies: LasFamily[];
    lasWorkLines: LasWorkLine[];
    lsResources: LsResource[];
    operationCategories: OperationCategory[];
    operations: ExistingOperation[];
    errors?: Record<string, string>;
    flash?: {
        success?: string;
        error?: string;
    };
};

export default function OffersEdit() {
    const { props } = usePage<OffersEditProps>();
    const {
        offer,
        customers,
        divisions: initialDivisions,
        activities,
        sectors,
        seasonalities,
        orderTypes,
        lasFamilies,
        lasWorkLines,
        lsResources,
        operationCategories: initialOperationCategories,
        operations: existingOperations,
        errors: serverErrors = {},
    } = props;

    const [divisions, setDivisions] = useState<Division[]>(initialDivisions);
    const [selectedCustomer, setSelectedCustomer] = useState<string>(
        offer.customer_uuid || '',
    );

    // Format numbers in Italian format (comma decimals, period thousands)
    const formatNumber = (value: number, decimals: number = 5): string => {
        if (isNaN(value) || value === null || value === undefined)
            return '0,' + '0'.repeat(decimals);
        const rounded =
            Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals);
        const parts = rounded.toFixed(decimals).split('.');
        const integerPart = parts[0];
        const decimalPart = parts[1] || '';
        const formattedInteger = integerPart.replace(
            /\B(?=(\d{3})+(?!\d))/g,
            '.',
        );
        return formattedInteger + ',' + decimalPart;
    };

    const formatInteger = (value: number): string => {
        return Math.round(value).toString();
    };

    const parseNumber = (value: string): number => {
        if (!value || value.trim() === '') return 0;
        const normalized = value.replace(/\./g, '').replace(',', '.');
        const parsed = parseFloat(normalized);
        return isNaN(parsed) ? 0 : parsed;
    };

    const formatInputNumber = (
        value: string,
        allowNegative: boolean = false,
        isInteger: boolean = false,
    ): string => {
        if (!value || value.trim() === '') return '';
        let cleaned = value.replace(/[^\d,.-]/g, '');
        if (!allowNegative) {
            cleaned = cleaned.replace(/-/g, '');
        }
        if (isInteger) {
            cleaned = cleaned.replace(/[,.]/g, '');
        } else {
            const parts = cleaned.split(',');
            if (parts.length > 2) {
                cleaned = parts[0] + ',' + parts.slice(1).join('');
            }
            if (parts.length === 2 && parts[1].length > 5) {
                cleaned = parts[0] + ',' + parts[1].substring(0, 5);
            }
        }
        return cleaned;
    };

    const handleInputFocus = (
        e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        if (
            e.target instanceof HTMLInputElement ||
            e.target instanceof HTMLTextAreaElement
        ) {
            e.target.select();
        }
    };

    // Inizializzare valori dall'offerta
    const [offerNumberValue, setOfferNumberValue] = useState<string>(
        offer.offer_number || '',
    );
    const [quantityValue, setQuantityValue] = useState<string>(
        offer.quantity ? formatNumber(offer.quantity) : '',
    );
    const [pieceValue, setPieceValue] = useState<string>(
        offer.piece ? formatNumber(offer.piece) : '',
    );
    const [declaredWeightCfz, setDeclaredWeightCfz] = useState<string>(
        offer.declared_weight_cfz
            ? formatNumber(offer.declared_weight_cfz)
            : '',
    );
    const [declaredWeightPz, setDeclaredWeightPz] = useState<string>(
        offer.declared_weight_pz ? formatNumber(offer.declared_weight_pz) : '',
    );
    const [expectedWorkers, setExpectedWorkers] = useState<string>(
        offer.expected_workers ? formatInteger(offer.expected_workers) : '',
    );
    const [expectedRevenue, setExpectedRevenue] = useState<string>(
        offer.expected_revenue ? formatNumber(offer.expected_revenue) : '',
    );
    const [rateRoundingCfz, setRateRoundingCfz] = useState<string>(
        offer.rate_rounding_cfz ? formatNumber(offer.rate_rounding_cfz) : '',
    );
    const [rateIncreaseCfz, setRateIncreaseCfz] = useState<string>(
        offer.rate_increase_cfz ? formatNumber(offer.rate_increase_cfz) : '',
    );
    const [materialsEuro, setMaterialsEuro] = useState<string>(
        offer.materials_euro ? formatNumber(offer.materials_euro) : '',
    );
    const [logisticsEuro, setLogisticsEuro] = useState<string>(
        offer.logistics_euro ? formatNumber(offer.logistics_euro) : '',
    );
    const [otherEuro, setOtherEuro] = useState<string>(
        offer.other_euro ? formatNumber(offer.other_euro) : '',
    );
    const [customerRef, setCustomerRef] = useState<string>(
        offer.customer_ref || '',
    );
    const [articleCodeRef, setArticleCodeRef] = useState<string>(
        offer.article_code_ref || '',
    );
    const [provisionalDescription, setProvisionalDescription] =
        useState<string>(offer.provisional_description || '');
    const [unitOfMeasure, setUnitOfMeasure] = useState<string>(
        offer.unit_of_measure || '',
    );
    const [notes, setNotes] = useState<string>(offer.notes || '');
    const [offerNotes, setOfferNotes] = useState<string>(
        offer.offer_notes || '',
    );
    const [lsSetupCost, setLsSetupCost] = useState<string>(
        offer.ls_setup_cost ? formatNumber(offer.ls_setup_cost) : '',
    );
    const [lsOtherCosts, setLsOtherCosts] = useState<string>(
        offer.ls_other_costs ? formatNumber(offer.ls_other_costs) : '',
    );
    const [approvalStatus, setApprovalStatus] = useState<string>(
        offer.approval_status?.toString() || '',
    );

    // Operaciones
    const [operationRows, setOperationRows] = useState<OperationRow[]>([]);
    const [operationCategories, setOperationCategories] = useState<
        OperationCategory[]
    >(initialOperationCategories);
    const [operationsByCategory, setOperationsByCategory] = useState<
        Record<string, Operation[]>
    >({});

    // State for close confirmation
    const [showCloseConfirm, setShowCloseConfirm] = useState(false);
    const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);
    const { flash } = useFlashNotifications();
    const { t } = useTranslations();

    // Campos calculados (readonly)
    const [theoreticalTimeCfz, setTheoreticalTimeCfz] = useState<string>('');
    const [unexpected, setUnexpected] = useState<string>('');
    const [totalTheoreticalTime, setTotalTheoreticalTime] =
        useState<string>('');
    const [theoreticalTime, setTheoreticalTime] = useState<string>('');
    const [productionTimeCfz, setProductionTimeCfz] = useState<string>('');
    const [productionTime, setProductionTime] = useState<string>('');
    const [productionAverageCfz, setProductionAverageCfz] =
        useState<string>('');
    const [productionAveragePz, setProductionAveragePz] = useState<string>('');
    const [rateCfz, setRateCfz] = useState<string>('');
    const [ratePz, setRatePz] = useState<string>('');
    const [rateRoundingCfzPerc, setRateRoundingCfzPerc] = useState<string>('');
    const [finalRateCfz, setFinalRateCfz] = useState<string>('');
    const [finalRatePz, setFinalRatePz] = useState<string>('');
    const [totalRateCfz, setTotalRateCfz] = useState<string>('');
    const [totalRatePz, setTotalRatePz] = useState<string>('');

    // Validazione in tempo reale per offer_number
    const offerNumberValidation = useFieldValidation(offerNumberValue, [
        validationRules.maxLength(
            255,
            t('offers.form.offer_number_max_length'),
        ),
    ]);

    // Validazione in tempo reale per quantity
    const quantityValidation = useFieldValidation(quantityValue, [
        (val: string) => {
            if (val && val.trim() !== '') {
                const num = parseFloat(val);
                if (isNaN(num) || num < 0) {
                    return t('offers.form.quantity_positive');
                }
            }
            return null;
        },
    ]);

    // Validazione in tempo reale per piece
    const pieceValidation = useFieldValidation(pieceValue, [
        (val: string) => {
            if (val && val.trim() !== '') {
                const num = parseFloat(val);
                if (isNaN(num) || num < 0) {
                    return t('offers.form.piece_positive');
                }
            }
            return null;
        },
    ]);

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: t('nav.offers'),
            href: offers.index().url,
        },
        {
            title: offer.offer_number,
            href: offers.show({ offer: offer.uuid }).url,
        },
        {
            title: t('offers.edit.breadcrumb'),
            href: offers.edit({ offer: offer.uuid }).url,
        },
    ];

    const handleCustomerChange = (customerUuid: string) => {
        setSelectedCustomer(customerUuid);
        if (customerUuid) {
            router.get(
                offers.edit({ offer: offer.uuid }).url,
                { customer_uuid: customerUuid },
                {
                    preserveState: true,
                    preserveScroll: true,
                    only: ['divisions'],
                    onSuccess: (page) => {
                        const props = page.props as unknown as OffersEditProps;
                        if (props && 'divisions' in props) {
                            setDivisions(props.divisions || []);
                        }
                    },
                },
            );
        } else {
            setDivisions([]);
        }
    };

    // Calculate all derived values
    const updateCalculatedData = () => {
        const piece = parseNumber(pieceValue);
        const declaredWeightCfzVal = parseNumber(declaredWeightCfz);

        // Calculate declared weight per piece
        let declaredWeightPzVal = 0;
        if (piece > 0 && !isNaN(piece)) {
            declaredWeightPzVal = declaredWeightCfzVal / piece;
        }
        setDeclaredWeightPz(formatNumber(declaredWeightPzVal));

        // Calculate total operation seconds
        let totalSecOps = 0;
        operationRows.forEach((row) => {
            if (row.secOp && row.numOp) {
                totalSecOps += row.secOp * row.numOp;
            }
        });

        setTheoreticalTimeCfz(formatNumber(totalSecOps));

        // Calculate contingencies (5% theoretical time)
        const unexpectedVal = totalSecOps * 0.05;
        setUnexpected(formatNumber(unexpectedVal));

        // Calculate total theoretical time
        const totalTheoreticalTimeVal = totalSecOps + unexpectedVal;
        setTotalTheoreticalTime(formatNumber(totalTheoreticalTimeVal));

        // Calculate theoretical time per piece
        let theoreticalTimeVal = 0;
        if (piece > 0) {
            theoreticalTimeVal = totalTheoreticalTimeVal / piece;
        }
        setTheoreticalTime(formatNumber(theoreticalTimeVal));

        // Calculate production time cfz
        const productionTimeCfzVal = (totalTheoreticalTimeVal * 8) / 7;
        setProductionTimeCfz(formatNumber(productionTimeCfzVal));

        // Calculate production time per piece
        let productionTimeVal = 0;
        if (piece > 0) {
            productionTimeVal = productionTimeCfzVal / piece;
        }
        setProductionTime(formatNumber(productionTimeVal));

        // Calculate expected average cfz
        let productionAverageCfzVal = 0;
        if (productionTimeCfzVal > 0) {
            productionAverageCfzVal = 3600 / productionTimeCfzVal;
        }
        setProductionAverageCfz(formatNumber(productionAverageCfzVal));

        // Calculate expected average pz
        const productionAveragePzVal = productionAverageCfzVal * piece;
        setProductionAveragePz(formatNumber(productionAveragePzVal));

        // Calculate labor rate cfz
        const expectedRevenueVal = parseNumber(expectedRevenue);
        let rateCfzVal = 0;
        if (productionAverageCfzVal > 0) {
            rateCfzVal = expectedRevenueVal / productionAverageCfzVal;
        }
        setRateCfz(formatNumber(rateCfzVal));

        // Calculate labor rate pz
        let ratePzVal = 0;
        if (piece > 0) {
            ratePzVal = rateCfzVal / piece;
        }
        setRatePz(formatNumber(ratePzVal));

        // Calculate percentage increase/discount
        const rateRoundingCfzVal = parseNumber(rateRoundingCfz);
        const rateIncreaseCfzVal = parseNumber(rateIncreaseCfz);
        let rateRoundingCfzPercVal = 0;
        if (rateRoundingCfzVal > 0) {
            rateRoundingCfzPercVal =
                (rateIncreaseCfzVal / rateRoundingCfzVal) * 100;
        }
        setRateRoundingCfzPerc(formatNumber(rateRoundingCfzPercVal));

        // Calculate final rate cfz
        const finalRateCfzVal = rateIncreaseCfzVal + rateRoundingCfzVal;
        setFinalRateCfz(formatNumber(finalRateCfzVal));

        // Calculate final rate pz
        let finalRatePzVal = 0;
        if (piece > 0) {
            finalRatePzVal = finalRateCfzVal / piece;
        }
        setFinalRatePz(formatNumber(finalRatePzVal));

        // Calculate total rate cfz
        const materialsEuroVal = parseNumber(materialsEuro);
        const logisticsEuroVal = parseNumber(logisticsEuro);
        const otherEuroVal = parseNumber(otherEuro);
        const totalRateCfzVal =
            finalRateCfzVal +
            materialsEuroVal +
            logisticsEuroVal +
            otherEuroVal;
        setTotalRateCfz(formatNumber(totalRateCfzVal));

        // Calculate total rate pz
        let totalRatePzVal = 0;
        if (piece > 0) {
            totalRatePzVal = totalRateCfzVal / piece;
        }
        setTotalRatePz(formatNumber(totalRatePzVal));
    };

    // Recalculate when relevant values change
    useEffect(() => {
        queueMicrotask(() => updateCalculatedData());
        // eslint-disable-next-line react-hooks/exhaustive-deps -- updateCalculatedData re-reads state; deps list is intentional
    }, [
        pieceValue,
        declaredWeightCfz,
        expectedRevenue,
        expectedWorkers,
        rateRoundingCfz,
        rateIncreaseCfz,
        materialsEuro,
        logisticsEuro,
        otherEuro,
        operationRows,
    ]);

    // Load operation categories on component mount
    useEffect(() => {
        const loadCategories = async () => {
            try {
                const response = await fetch(
                    '/offers/operation-categories/load-categories',
                );
                if (response.ok) {
                    const data = await response.json();
                    if (data.categories) {
                        setOperationCategories(data.categories);
                    }
                }
            } catch (error) {
                console.error('Errore caricamento categorie:', error);
            }
        };
        loadCategories();
    }, []);

    const loadOperationsForCategory = useCallback(
        async (categoryUuid: string) => {
            if (!categoryUuid) return;
            if (operationsByCategory[categoryUuid]) return;
            try {
                const response = await fetch(
                    `/offers/operations/load-category-operations?category_uuid=${categoryUuid}`,
                );
                if (response.ok) {
                    const data = await response.json();
                    if (data.operations) {
                        setOperationsByCategory((prev) => ({
                            ...prev,
                            [categoryUuid]: data.operations,
                        }));
                    }
                }
            } catch (error) {
                console.error('Errore caricamento operazioni:', error);
            }
        },
        [operationsByCategory],
    );

    // Load existing operations on mount
    useEffect(() => {
        if (existingOperations && existingOperations.length > 0) {
            const loadedRows: OperationRow[] = existingOperations.map((op) => ({
                id: op.uuid || Math.random().toString(36).substr(2, 9),
                categoryUuid: op.category_uuid || '',
                operationUuid: op.operation_uuid || '',
                secOp: op.secondi_operazione || 0,
                numOp: op.num_op || 0,
                totalSec: op.total_sec || 0,
            }));
            queueMicrotask(() => setOperationRows(loadedRows));

            // Load operations for each unique category
            const uniqueCategoryUuids = [
                ...new Set(
                    loadedRows.map((row) => row.categoryUuid).filter(Boolean),
                ),
            ];
            uniqueCategoryUuids.forEach((categoryUuid) => {
                loadOperationsForCategory(categoryUuid);
            });
        }
    }, [existingOperations, loadOperationsForCategory]);

    // Gestire chiusura
    const handleClose = () => {
        setShowCloseConfirm(true);
    };

    const confirmClose = () => {
        setShowCloseConfirm(false);
        setHasAttemptedSubmit(false);
        router.visit(offers.show({ offer: offer.uuid }).url);
    };

    // Add new operation row
    const addOperationRow = () => {
        const newRow: OperationRow = {
            id: Math.random().toString(36).substr(2, 9),
            categoryUuid: '',
            operationUuid: '',
            secOp: 0,
            numOp: 0,
            totalSec: 0,
        };
        setOperationRows([...operationRows, newRow]);
    };

    // Remove operation row
    const removeOperationRow = (id: string) => {
        setOperationRows(operationRows.filter((row) => row.id !== id));
    };

    // Update operation row
    const updateOperationRow = (id: string, updates: Partial<OperationRow>) => {
        setOperationRows((prevRows) =>
            prevRows.map((row) => {
                if (row.id === id) {
                    const updated = { ...row, ...updates };

                    if (
                        updates.categoryUuid !== undefined &&
                        updates.categoryUuid !== row.categoryUuid
                    ) {
                        loadOperationsForCategory(updates.categoryUuid);
                        updated.operationUuid = '';
                        updated.secOp = 0;
                        updated.numOp = 0;
                        updated.totalSec = 0;
                    }

                    if (
                        updates.operationUuid !== undefined &&
                        updates.operationUuid !== row.operationUuid
                    ) {
                        const categoryUuid =
                            updated.categoryUuid || row.categoryUuid;
                        if (operationsByCategory[categoryUuid]) {
                            const ops = operationsByCategory[categoryUuid];
                            const selectedOp = ops.find(
                                (op) => op.uuid === updates.operationUuid,
                            );
                            if (selectedOp) {
                                updated.secOp =
                                    selectedOp.secondi_operazione || 0;
                                updated.numOp = 1;
                                updated.totalSec =
                                    updated.secOp * updated.numOp;
                            }
                        } else {
                            setTimeout(() => {
                                setOperationRows((currentRows) =>
                                    currentRows.map((currentRow) => {
                                        if (
                                            currentRow.id === id &&
                                            currentRow.operationUuid
                                        ) {
                                            const ops =
                                                operationsByCategory[
                                                    categoryUuid
                                                ] || [];
                                            const selectedOp = ops.find(
                                                (op) =>
                                                    op.uuid ===
                                                    currentRow.operationUuid,
                                            );
                                            if (selectedOp) {
                                                const secOp =
                                                    selectedOp.secondi_operazione ||
                                                    0;
                                                const numOp =
                                                    currentRow.numOp || 1;
                                                return {
                                                    ...currentRow,
                                                    secOp,
                                                    totalSec: secOp * numOp,
                                                };
                                            }
                                        }
                                        return currentRow;
                                    }),
                                );
                            }, 100);
                        }
                    }

                    if (
                        updates.numOp !== undefined ||
                        (updates.secOp !== undefined && updated.numOp)
                    ) {
                        updated.totalSec =
                            (updated.secOp || 0) * (updated.numOp || 0);
                    }

                    return updated;
                }
                return row;
            }),
        );
    };

    // Effetto per aggiornare secOp quando si caricano le operazioni di una categoria
    useEffect(() => {
        queueMicrotask(() => {
            setOperationRows((prevRows) =>
                prevRows.map((row) => {
                    if (
                        row.operationUuid &&
                        row.categoryUuid &&
                        operationsByCategory[row.categoryUuid]
                    ) {
                        const operations =
                            operationsByCategory[row.categoryUuid];
                        const selectedOperation = operations.find(
                            (op) => op.uuid === row.operationUuid,
                        );
                        if (
                            selectedOperation &&
                            row.secOp !== selectedOperation.secondi_operazione
                        ) {
                            const secOp =
                                selectedOperation.secondi_operazione || 0;
                            const numOp = row.numOp || 1;
                            return { ...row, secOp, totalSec: secOp * numOp };
                        }
                    }
                    if (
                        row.secOp &&
                        row.numOp &&
                        row.totalSec !== row.secOp * row.numOp
                    ) {
                        return { ...row, totalSec: row.secOp * row.numOp };
                    }
                    return row;
                }),
            );
        });
    }, [operationsByCategory]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head
                title={t('offers.edit.page_title', {
                    number: offer.offer_number,
                })}
            />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <FlashNotifications flash={flash} />

                <Form
                    action={offers.update({ offer: offer.uuid }).url}
                    method="put"
                    className="space-y-5"
                    onSuccess={() => {
                        setHasAttemptedSubmit(false);
                    }}
                    onError={() => {
                        setHasAttemptedSubmit(true);
                    }}
                    transform={(data): Record<string, FormDataConvertible> => {
                        const fieldMapping: Record<string, string> = {
                            validity: 'validity_date',
                            client: 'customer_uuid',
                            division: 'customerdivision_uuid',
                            activity: 'activity_uuid',
                            sector: 'sector_uuid',
                            type: 'seasonality_uuid',
                            order_type: 'order_type_uuid',
                            las_family: 'lasfamily_uuid',
                            ls_resource: 'lsresource_uuid',
                            las_work_line: 'lasworkline_uuid',
                        };

                        const numericFields = [
                            'quantity',
                            'piece',
                            'declared_weight_cfz',
                            'declared_weight_pz',
                            'theoretical_time_cfz',
                            'unexpected',
                            'total_theoretical_time',
                            'theoretical_time',
                            'production_time_cfz',
                            'production_time',
                            'production_average_cfz',
                            'production_average_pz',
                            'expected_workers',
                            'expected_revenue',
                            'rate_cfz',
                            'rate_pz',
                            'rate_rounding_cfz',
                            'rate_increase_cfz',
                            'rate_rounding_cfz_perc',
                            'final_rate_cfz',
                            'final_rate_pz',
                            'materials_euro',
                            'logistics_euro',
                            'other_euro',
                            'total_rate_cfz',
                            'total_rate_pz',
                            'ls_setup_cost',
                            'ls_other_costs',
                        ];

                        const transformed: Record<string, FormDataConvertible> =
                            {};

                        Object.keys(data).forEach((key) => {
                            const mappedKey = fieldMapping[key] || key;
                            transformed[mappedKey] = data[key];
                        });

                        numericFields.forEach((field) => {
                            if (
                                transformed[field] !== undefined &&
                                transformed[field] !== null &&
                                transformed[field] !== ''
                            ) {
                                if (typeof transformed[field] === 'string') {
                                    const trimmed = transformed[field].trim();
                                    if (trimmed === '') {
                                        transformed[field] = null;
                                    } else {
                                        const parsed = parseNumber(trimmed);
                                        transformed[field] = isNaN(parsed)
                                            ? null
                                            : parsed;
                                    }
                                }
                            } else {
                                transformed[field] = null;
                            }
                        });

                        if (
                            transformed.expected_workers !== undefined &&
                            transformed.expected_workers !== null &&
                            transformed.expected_workers !== ''
                        ) {
                            if (
                                typeof transformed.expected_workers === 'string'
                            ) {
                                const trimmed =
                                    transformed.expected_workers.trim();
                                if (trimmed === '') {
                                    transformed.expected_workers = null;
                                } else {
                                    const parsed = parseNumber(trimmed);
                                    transformed.expected_workers = isNaN(parsed)
                                        ? null
                                        : Math.round(parsed);
                                }
                            } else if (
                                typeof transformed.expected_workers === 'number'
                            ) {
                                transformed.expected_workers = Math.round(
                                    transformed.expected_workers,
                                );
                            }
                        } else {
                            transformed.expected_workers = null;
                        }

                        if (
                            transformed.approval_status !== undefined &&
                            transformed.approval_status !== null &&
                            transformed.approval_status !== ''
                        ) {
                            const parsed = parseInt(
                                String(transformed.approval_status),
                                10,
                            );
                            transformed.approval_status = isNaN(parsed)
                                ? null
                                : parsed;
                        } else {
                            transformed.approval_status = null;
                        }

                        // Campi nullable che possono essere null se vuoti
                        const nullableFields = [
                            'customerdivision_uuid',
                            'validity_date',
                            'type_uuid',
                            'lsresource_uuid',
                            'customer_ref',
                            'article_code_ref',
                            'provisional_description',
                            'unit_of_measure',
                            'notes',
                            'offer_notes',
                        ];

                        nullableFields.forEach((field) => {
                            if (transformed[field] === '') {
                                transformed[field] = null;
                            }
                        });

                        // Required UUID fields must not become null when empty
                        // Keep as empty string so backend validation rejects them correctly
                        const requiredUuidFields = [
                            'activity_uuid',
                            'sector_uuid',
                            'seasonality_uuid',
                            'order_type_uuid',
                            'lasfamily_uuid',
                            'lasworkline_uuid',
                        ];

                        requiredUuidFields.forEach((field) => {
                            if (
                                transformed[field] === '' ||
                                transformed[field] === null ||
                                transformed[field] === undefined
                            ) {
                                // Keep empty string for 'required' validation
                                transformed[field] = '';
                            }
                        });

                        if (operationRows.length > 0) {
                            transformed.operations = operationRows
                                .filter(
                                    (row) =>
                                        row.operationUuid &&
                                        row.numOp &&
                                        row.numOp > 0,
                                )
                                .map((row) => ({
                                    offeroperation_uuid: row.operationUuid,
                                    num_op: Math.round(row.numOp), // Ensure it's an integer
                                }));
                        }

                        return transformed;
                    }}
                >
                    {({ processing, errors }) => {
                        const allErrors = { ...errors, ...serverErrors };

                        return (
                            <>
                                <FormValidationNotification
                                    errors={allErrors}
                                    hasAttemptedSubmit={hasAttemptedSubmit}
                                />

                                <input
                                    type="hidden"
                                    name="uuid"
                                    value={offer.uuid}
                                />

                                {/* Contenitore centrato con margini */}
                                <div className="flex justify-center">
                                    <div className="w-full max-w-4xl space-y-5">
                                        <Card>
                                            <CardHeader>
                                                <CardTitle>
                                                    {t(
                                                        'offers.edit.card_title',
                                                    )}
                                                </CardTitle>
                                                <CardDescription>
                                                    {t(
                                                        'offers.edit.card_description',
                                                    )}
                                                </CardDescription>
                                            </CardHeader>
                                            <CardContent className="space-y-5">
                                                <div className="grid gap-2 py-1">
                                                    <FormLabel
                                                        htmlFor="offer_number"
                                                        required
                                                    >
                                                        {t(
                                                            'offers.show.number_label',
                                                        )}
                                                    </FormLabel>
                                                    <Input
                                                        id="offer_number"
                                                        name="offer_number"
                                                        value={offerNumberValue}
                                                        onChange={(e) =>
                                                            setOfferNumberValue(
                                                                e.target.value,
                                                            )
                                                        }
                                                        onBlur={
                                                            offerNumberValidation.onBlur
                                                        }
                                                        onFocus={(e) => {
                                                            handleInputFocus(e);
                                                            if (
                                                                offerNumberValidation.onFocus
                                                            ) {
                                                                offerNumberValidation.onFocus();
                                                            }
                                                        }}
                                                        required
                                                        className={
                                                            offerNumberValidation.error
                                                                ? 'border-destructive'
                                                                : ''
                                                        }
                                                    />
                                                    {offerNumberValidation.error && (
                                                        <InputError
                                                            message={
                                                                offerNumberValidation.error
                                                            }
                                                        />
                                                    )}
                                                    <InputError
                                                        message={
                                                            allErrors.offer_number
                                                        }
                                                    />
                                                </div>

                                                <div className="grid gap-2 py-1">
                                                    <FormLabel
                                                        htmlFor="offer_date"
                                                        required
                                                    >
                                                        {t(
                                                            'offers.show.date_offer_label',
                                                        )}
                                                    </FormLabel>
                                                    <Input
                                                        id="offer_date"
                                                        name="offer_date"
                                                        type="date"
                                                        min="2005-01-01"
                                                        max="2099-12-31"
                                                        defaultValue={
                                                            offer.offer_date
                                                                ? offer.offer_date.split(
                                                                      'T',
                                                                  )[0]
                                                                : ''
                                                        }
                                                        required
                                                    />
                                                    <InputError
                                                        message={
                                                            allErrors.offer_date
                                                        }
                                                    />
                                                </div>

                                                <div className="grid gap-2 py-1">
                                                    <FormLabel
                                                        htmlFor="validity"
                                                        required
                                                    >
                                                        {t(
                                                            'offers.show.date_validity_label',
                                                        )}
                                                    </FormLabel>
                                                    <Input
                                                        id="validity"
                                                        name="validity_date"
                                                        type="date"
                                                        min="2005-01-01"
                                                        max="2099-12-31"
                                                        defaultValue={
                                                            offer.validity_date
                                                                ? offer.validity_date.split(
                                                                      'T',
                                                                  )[0]
                                                                : ''
                                                        }
                                                        required
                                                    />
                                                    <InputError
                                                        message={
                                                            allErrors.validity_date
                                                        }
                                                    />
                                                </div>

                                                <div className="grid gap-2">
                                                    <FormLabel
                                                        htmlFor="client"
                                                        required
                                                    >
                                                        {t(
                                                            'offers.show.customer_label',
                                                        )}
                                                    </FormLabel>
                                                    <Select
                                                        name="customer_uuid"
                                                        defaultValue={
                                                            offer.customer_uuid ||
                                                            undefined
                                                        }
                                                        onValueChange={
                                                            handleCustomerChange
                                                        }
                                                        required
                                                    >
                                                        <SelectTrigger>
                                                            <SelectValue
                                                                placeholder={t(
                                                                    'offers.form.select_customer',
                                                                )}
                                                            />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {customers.map(
                                                                (customer) => (
                                                                    <SelectItem
                                                                        key={
                                                                            customer.uuid
                                                                        }
                                                                        value={
                                                                            customer.uuid
                                                                        }
                                                                    >
                                                                        {
                                                                            customer.code
                                                                        }{' '}
                                                                        -{' '}
                                                                        {
                                                                            customer.company_name
                                                                        }
                                                                    </SelectItem>
                                                                ),
                                                            )}
                                                        </SelectContent>
                                                    </Select>
                                                    <InputError
                                                        message={
                                                            allErrors.customer_uuid
                                                        }
                                                    />
                                                </div>

                                                <div className="grid gap-2">
                                                    <FormLabel
                                                        htmlFor="division"
                                                        required
                                                    >
                                                        {t(
                                                            'offers.show.division_label',
                                                        )}
                                                    </FormLabel>
                                                    <Select
                                                        name="customerdivision_uuid"
                                                        defaultValue={
                                                            offer.customerdivision_uuid ||
                                                            undefined
                                                        }
                                                        required
                                                        disabled={
                                                            !selectedCustomer ||
                                                            divisions.length ===
                                                                0
                                                        }
                                                    >
                                                        <SelectTrigger>
                                                            <SelectValue
                                                                placeholder={
                                                                    !selectedCustomer
                                                                        ? t(
                                                                              'offers.form.select_division',
                                                                          )
                                                                        : divisions.length ===
                                                                            0
                                                                          ? t(
                                                                                'offers.form.no_division_available',
                                                                            )
                                                                          : t(
                                                                                'offers.form.select_division',
                                                                            )
                                                                }
                                                            />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {divisions.map(
                                                                (division) => (
                                                                    <SelectItem
                                                                        key={
                                                                            division.uuid
                                                                        }
                                                                        value={
                                                                            division.uuid
                                                                        }
                                                                    >
                                                                        {
                                                                            division.name
                                                                        }
                                                                    </SelectItem>
                                                                ),
                                                            )}
                                                        </SelectContent>
                                                    </Select>
                                                    <InputError
                                                        message={
                                                            allErrors.customerdivision_uuid
                                                        }
                                                    />
                                                </div>

                                                <div className="grid gap-2">
                                                    <FormLabel
                                                        htmlFor="activity"
                                                        required
                                                    >
                                                        {t(
                                                            'offers.show.activity_label',
                                                        )}
                                                    </FormLabel>
                                                    <Select
                                                        name="activity_uuid"
                                                        defaultValue={
                                                            offer.activity_uuid ||
                                                            undefined
                                                        }
                                                        required
                                                    >
                                                        <SelectTrigger>
                                                            <SelectValue
                                                                placeholder={t(
                                                                    'offers.form.select_activity',
                                                                )}
                                                            />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {activities.map(
                                                                (activity) => (
                                                                    <SelectItem
                                                                        key={
                                                                            activity.uuid
                                                                        }
                                                                        value={
                                                                            activity.uuid
                                                                        }
                                                                    >
                                                                        {
                                                                            activity.name
                                                                        }
                                                                    </SelectItem>
                                                                ),
                                                            )}
                                                        </SelectContent>
                                                    </Select>
                                                    <InputError
                                                        message={
                                                            allErrors.activity_uuid
                                                        }
                                                    />
                                                </div>

                                                <div className="grid gap-2">
                                                    <FormLabel
                                                        htmlFor="sector"
                                                        required
                                                    >
                                                        {t(
                                                            'offers.show.sector_label',
                                                        )}
                                                    </FormLabel>
                                                    <Select
                                                        name="sector_uuid"
                                                        defaultValue={
                                                            offer.sector_uuid ||
                                                            undefined
                                                        }
                                                        required
                                                    >
                                                        <SelectTrigger>
                                                            <SelectValue
                                                                placeholder={t(
                                                                    'offers.form.select_sector',
                                                                )}
                                                            />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {sectors.map(
                                                                (sector) => (
                                                                    <SelectItem
                                                                        key={
                                                                            sector.uuid
                                                                        }
                                                                        value={
                                                                            sector.uuid
                                                                        }
                                                                    >
                                                                        {
                                                                            sector.name
                                                                        }
                                                                    </SelectItem>
                                                                ),
                                                            )}
                                                        </SelectContent>
                                                    </Select>
                                                    <InputError
                                                        message={
                                                            allErrors.sector_uuid
                                                        }
                                                    />
                                                </div>

                                                <div className="grid gap-2">
                                                    <FormLabel
                                                        htmlFor="type"
                                                        required
                                                    >
                                                        {t(
                                                            'offers.show.seasonality_label',
                                                        )}
                                                    </FormLabel>
                                                    <Select
                                                        name="seasonality_uuid"
                                                        defaultValue={
                                                            offer.seasonality_uuid ||
                                                            undefined
                                                        }
                                                        required
                                                    >
                                                        <SelectTrigger>
                                                            <SelectValue
                                                                placeholder={t(
                                                                    'offers.form.select_seasonality',
                                                                )}
                                                            />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {seasonalities.map(
                                                                (
                                                                    seasonality,
                                                                ) => (
                                                                    <SelectItem
                                                                        key={
                                                                            seasonality.uuid
                                                                        }
                                                                        value={
                                                                            seasonality.uuid
                                                                        }
                                                                    >
                                                                        {
                                                                            seasonality.name
                                                                        }
                                                                    </SelectItem>
                                                                ),
                                                            )}
                                                        </SelectContent>
                                                    </Select>
                                                    <InputError
                                                        message={
                                                            allErrors.seasonality_uuid
                                                        }
                                                    />
                                                </div>

                                                <div className="grid gap-2">
                                                    <FormLabel
                                                        htmlFor="order_type"
                                                        required
                                                    >
                                                        {t(
                                                            'offers.show.order_type_label',
                                                        )}
                                                    </FormLabel>
                                                    <Select
                                                        name="order_type_uuid"
                                                        defaultValue={
                                                            offer.order_type_uuid ||
                                                            undefined
                                                        }
                                                        required
                                                    >
                                                        <SelectTrigger>
                                                            <SelectValue
                                                                placeholder={t(
                                                                    'offers.form.select_order_type',
                                                                )}
                                                            />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {orderTypes.map(
                                                                (orderType) => (
                                                                    <SelectItem
                                                                        key={
                                                                            orderType.uuid
                                                                        }
                                                                        value={
                                                                            orderType.uuid
                                                                        }
                                                                    >
                                                                        {
                                                                            orderType.name
                                                                        }
                                                                    </SelectItem>
                                                                ),
                                                            )}
                                                        </SelectContent>
                                                    </Select>
                                                    <InputError
                                                        message={
                                                            allErrors.order_type_uuid
                                                        }
                                                    />
                                                </div>

                                                <div className="grid gap-2">
                                                    <FormLabel
                                                        htmlFor="las_family"
                                                        required
                                                    >
                                                        {t(
                                                            'offers.show.las_family_label',
                                                        )}
                                                    </FormLabel>
                                                    <Select
                                                        name="lasfamily_uuid"
                                                        defaultValue={
                                                            offer.lasfamily_uuid ||
                                                            undefined
                                                        }
                                                        required
                                                    >
                                                        <SelectTrigger>
                                                            <SelectValue
                                                                placeholder={t(
                                                                    'offers.form.select_las_family',
                                                                )}
                                                            />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {lasFamilies.map(
                                                                (family) => (
                                                                    <SelectItem
                                                                        key={
                                                                            family.uuid
                                                                        }
                                                                        value={
                                                                            family.uuid
                                                                        }
                                                                    >
                                                                        {
                                                                            family.code
                                                                        }{' '}
                                                                        -{' '}
                                                                        {
                                                                            family.name
                                                                        }
                                                                    </SelectItem>
                                                                ),
                                                            )}
                                                        </SelectContent>
                                                    </Select>
                                                    <InputError
                                                        message={
                                                            allErrors.lasfamily_uuid
                                                        }
                                                    />
                                                </div>

                                                <div className="grid gap-2">
                                                    <FormLabel htmlFor="customer_ref">
                                                        {t(
                                                            'offers.show.customer_ref_label',
                                                        )}
                                                    </FormLabel>
                                                    <Input
                                                        id="customer_ref"
                                                        name="customer_ref"
                                                        type="text"
                                                        value={customerRef}
                                                        onChange={(e) =>
                                                            setCustomerRef(
                                                                e.target.value,
                                                            )
                                                        }
                                                        onFocus={
                                                            handleInputFocus
                                                        }
                                                    />
                                                    <InputError
                                                        message={
                                                            allErrors.customer_ref
                                                        }
                                                    />
                                                </div>

                                                <div className="grid gap-2">
                                                    <FormLabel htmlFor="ls_resource">
                                                        {t(
                                                            'offers.show.ls_resource_label',
                                                        )}
                                                    </FormLabel>
                                                    <Select
                                                        name="lsresource_uuid"
                                                        defaultValue={
                                                            offer.lsresource_uuid ||
                                                            undefined
                                                        }
                                                    >
                                                        <SelectTrigger>
                                                            <SelectValue
                                                                placeholder={t(
                                                                    'offers.form.select_ls_resource',
                                                                )}
                                                            />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {lsResources.map(
                                                                (resource) => (
                                                                    <SelectItem
                                                                        key={
                                                                            resource.uuid
                                                                        }
                                                                        value={
                                                                            resource.uuid
                                                                        }
                                                                    >
                                                                        {
                                                                            resource.code
                                                                        }{' '}
                                                                        -{' '}
                                                                        {
                                                                            resource.name
                                                                        }
                                                                    </SelectItem>
                                                                ),
                                                            )}
                                                        </SelectContent>
                                                    </Select>
                                                    <InputError
                                                        message={
                                                            allErrors.lsresource_uuid
                                                        }
                                                    />
                                                </div>

                                                <div className="grid gap-2">
                                                    <FormLabel
                                                        htmlFor="las_work_line"
                                                        required
                                                    >
                                                        {t(
                                                            'offers.show.las_work_line_label',
                                                        )}
                                                    </FormLabel>
                                                    <Select
                                                        name="lasworkline_uuid"
                                                        defaultValue={
                                                            offer.lasworkline_uuid ||
                                                            undefined
                                                        }
                                                        required
                                                    >
                                                        <SelectTrigger>
                                                            <SelectValue
                                                                placeholder={t(
                                                                    'offers.form.select_las_work_line',
                                                                )}
                                                            />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {lasWorkLines.map(
                                                                (workLine) => (
                                                                    <SelectItem
                                                                        key={
                                                                            workLine.uuid
                                                                        }
                                                                        value={
                                                                            workLine.uuid
                                                                        }
                                                                    >
                                                                        {
                                                                            workLine.code
                                                                        }{' '}
                                                                        -{' '}
                                                                        {
                                                                            workLine.name
                                                                        }
                                                                    </SelectItem>
                                                                ),
                                                            )}
                                                        </SelectContent>
                                                    </Select>
                                                    <InputError
                                                        message={
                                                            allErrors.lasworkline_uuid
                                                        }
                                                    />
                                                </div>

                                                <div className="grid gap-2">
                                                    <FormLabel htmlFor="article_code_ref">
                                                        {t(
                                                            'offers.show.article_code_ref_label',
                                                        )}
                                                    </FormLabel>
                                                    <Input
                                                        id="article_code_ref"
                                                        name="article_code_ref"
                                                        type="text"
                                                        value={articleCodeRef}
                                                        onChange={(e) =>
                                                            setArticleCodeRef(
                                                                e.target.value,
                                                            )
                                                        }
                                                        onFocus={
                                                            handleInputFocus
                                                        }
                                                    />
                                                    <InputError
                                                        message={
                                                            allErrors.article_code_ref
                                                        }
                                                    />
                                                </div>

                                                <div className="grid gap-2">
                                                    <FormLabel htmlFor="provisional_description">
                                                        {t(
                                                            'offers.show.provisional_description_label',
                                                        )}
                                                    </FormLabel>
                                                    <Textarea
                                                        id="provisional_description"
                                                        name="provisional_description"
                                                        rows={3}
                                                        value={
                                                            provisionalDescription
                                                        }
                                                        onChange={(e) =>
                                                            setProvisionalDescription(
                                                                e.target.value,
                                                            )
                                                        }
                                                        onFocus={
                                                            handleInputFocus
                                                        }
                                                    />
                                                    <InputError
                                                        message={
                                                            allErrors.provisional_description
                                                        }
                                                    />
                                                </div>

                                                <div className="grid gap-2">
                                                    <FormLabel
                                                        htmlFor="unit_of_measure"
                                                        required
                                                    >
                                                        {t(
                                                            'offers.show.unit_of_measure_label',
                                                        )}
                                                    </FormLabel>
                                                    <Input
                                                        id="unit_of_measure"
                                                        name="unit_of_measure"
                                                        type="text"
                                                        value={unitOfMeasure}
                                                        onChange={(e) =>
                                                            setUnitOfMeasure(
                                                                e.target.value,
                                                            )
                                                        }
                                                        onFocus={
                                                            handleInputFocus
                                                        }
                                                        required
                                                    />
                                                    <InputError
                                                        message={
                                                            allErrors.unit_of_measure
                                                        }
                                                    />
                                                </div>

                                                <div className="grid gap-2">
                                                    <FormLabel
                                                        htmlFor="quantity"
                                                        required
                                                    >
                                                        {t(
                                                            'offers.show.quantity_label',
                                                        )}
                                                    </FormLabel>
                                                    <Input
                                                        id="quantity"
                                                        name="quantity"
                                                        type="text"
                                                        value={quantityValue}
                                                        onChange={(e) => {
                                                            const formatted =
                                                                formatInputNumber(
                                                                    e.target
                                                                        .value,
                                                                );
                                                            setQuantityValue(
                                                                formatted,
                                                            );
                                                        }}
                                                        onBlur={
                                                            quantityValidation.onBlur
                                                        }
                                                        onFocus={(e) => {
                                                            handleInputFocus(e);
                                                            quantityValidation.onFocus();
                                                        }}
                                                        required
                                                        min="0"
                                                        className={`text-right ${quantityValidation.error ? 'border-destructive' : ''}`}
                                                    />
                                                    {quantityValidation.error && (
                                                        <InputError
                                                            message={
                                                                quantityValidation.error
                                                            }
                                                        />
                                                    )}
                                                    <InputError
                                                        message={
                                                            allErrors.quantity
                                                        }
                                                    />
                                                </div>

                                                <div className="grid gap-2">
                                                    <FormLabel
                                                        htmlFor="piece"
                                                        required
                                                    >
                                                        {t(
                                                            'offers.show.piece_label',
                                                        )}
                                                    </FormLabel>
                                                    <Input
                                                        id="piece"
                                                        name="piece"
                                                        type="text"
                                                        value={pieceValue}
                                                        onChange={(e) => {
                                                            const formatted =
                                                                formatInputNumber(
                                                                    e.target
                                                                        .value,
                                                                );
                                                            setPieceValue(
                                                                formatted,
                                                            );
                                                        }}
                                                        onBlur={
                                                            pieceValidation.onBlur
                                                        }
                                                        onFocus={(e) => {
                                                            handleInputFocus(e);
                                                            if (
                                                                pieceValidation.onFocus
                                                            ) {
                                                                pieceValidation.onFocus();
                                                            }
                                                        }}
                                                        required
                                                        min="0"
                                                        className={`text-right ${pieceValidation.error ? 'border-destructive' : ''}`}
                                                    />
                                                    {pieceValidation.error && (
                                                        <InputError
                                                            message={
                                                                pieceValidation.error
                                                            }
                                                        />
                                                    )}
                                                    <InputError
                                                        message={
                                                            allErrors.piece
                                                        }
                                                    />
                                                </div>

                                                <div className="grid gap-2">
                                                    <FormLabel htmlFor="declared_weight_cfz">
                                                        {t(
                                                            'offers.show.declared_weight_cfz_label',
                                                        )}
                                                    </FormLabel>
                                                    <div className="flex">
                                                        <Input
                                                            id="declared_weight_cfz"
                                                            name="declared_weight_cfz"
                                                            type="text"
                                                            value={
                                                                declaredWeightCfz
                                                            }
                                                            onChange={(e) => {
                                                                const formatted =
                                                                    formatInputNumber(
                                                                        e.target
                                                                            .value,
                                                                    );
                                                                setDeclaredWeightCfz(
                                                                    formatted,
                                                                );
                                                            }}
                                                            onFocus={
                                                                handleInputFocus
                                                            }
                                                            min="0"
                                                            className="rounded-r-none text-right"
                                                        />
                                                        <span className="inline-flex items-center rounded-r-md border border-l-0 border-input bg-muted px-3 text-sm">
                                                            gr/cfz
                                                        </span>
                                                    </div>
                                                    <InputError
                                                        message={
                                                            allErrors.declared_weight_cfz
                                                        }
                                                    />
                                                </div>

                                                <div className="grid gap-2">
                                                    <FormLabel htmlFor="declared_weight_pz">
                                                        {t(
                                                            'offers.show.declared_weight_pz_label',
                                                        )}
                                                    </FormLabel>
                                                    <div className="flex">
                                                        <Input
                                                            id="declared_weight_pz"
                                                            name="declared_weight_pz"
                                                            type="text"
                                                            value={
                                                                declaredWeightPz
                                                            }
                                                            readOnly
                                                            min="0"
                                                            className="rounded-r-none bg-muted text-right"
                                                        />
                                                        <span className="inline-flex items-center rounded-r-md border border-l-0 border-input bg-muted px-3 text-sm">
                                                            gr/pz
                                                        </span>
                                                    </div>
                                                    <InputError
                                                        message={
                                                            allErrors.declared_weight_pz
                                                        }
                                                    />
                                                </div>

                                                <div className="grid gap-2">
                                                    <FormLabel htmlFor="notes">
                                                        {t(
                                                            'offers.show.notes_label',
                                                        )}
                                                    </FormLabel>
                                                    <Textarea
                                                        id="notes"
                                                        name="notes"
                                                        rows={3}
                                                        value={notes}
                                                        onChange={(e) =>
                                                            setNotes(
                                                                e.target.value,
                                                            )
                                                        }
                                                    />
                                                    <InputError
                                                        message={
                                                            allErrors.notes
                                                        }
                                                    />
                                                </div>

                                                <div className="grid gap-2">
                                                    <div className="mb-3 flex items-center gap-1 text-xs font-medium text-muted-foreground">
                                                        <label className="col-form-label w-[24%]">
                                                            {t(
                                                                'offers.show.operations_category',
                                                            )}
                                                        </label>
                                                        <label className="col-form-label flex-1">
                                                            {t(
                                                                'offers.show.operations_operation',
                                                            )}
                                                        </label>
                                                        <label className="col-form-label w-[11%] text-right">
                                                            {t(
                                                                'offers.show.operations_seconds',
                                                            )}
                                                        </label>
                                                        <label className="col-form-label w-[11%] text-right">
                                                            {t(
                                                                'offers.show.operations_num',
                                                            )}
                                                            <span className="ml-1 text-red-500">
                                                                *
                                                            </span>
                                                        </label>
                                                        <label className="col-form-label w-[11%] text-right">
                                                            {t(
                                                                'offers.show.operations_total',
                                                            )}
                                                        </label>
                                                    </div>
                                                    {operationRows.map(
                                                        (row) => (
                                                            <div
                                                                key={row.id}
                                                                className="mb-3 flex items-center gap-1"
                                                            >
                                                                <div className="w-[24%]">
                                                                    <Select
                                                                        value={
                                                                            row.categoryUuid
                                                                        }
                                                                        onValueChange={(
                                                                            value,
                                                                        ) =>
                                                                            updateOperationRow(
                                                                                row.id,
                                                                                {
                                                                                    categoryUuid:
                                                                                        value,
                                                                                },
                                                                            )
                                                                        }
                                                                    >
                                                                        <SelectTrigger>
                                                                            <SelectValue
                                                                                placeholder={t(
                                                                                    'offers.form.select_category',
                                                                                )}
                                                                            />
                                                                        </SelectTrigger>
                                                                        <SelectContent>
                                                                            {operationCategories.map(
                                                                                (
                                                                                    category,
                                                                                ) => (
                                                                                    <SelectItem
                                                                                        key={
                                                                                            category.uuid
                                                                                        }
                                                                                        value={
                                                                                            category.uuid
                                                                                        }
                                                                                    >
                                                                                        {
                                                                                            category.code
                                                                                        }{' '}
                                                                                        -{' '}
                                                                                        {
                                                                                            category.name
                                                                                        }
                                                                                    </SelectItem>
                                                                                ),
                                                                            )}
                                                                        </SelectContent>
                                                                    </Select>
                                                                </div>
                                                                <div className="flex-1">
                                                                    <Select
                                                                        value={
                                                                            row.operationUuid
                                                                        }
                                                                        onValueChange={(
                                                                            value,
                                                                        ) => {
                                                                            updateOperationRow(
                                                                                row.id,
                                                                                {
                                                                                    operationUuid:
                                                                                        value,
                                                                                },
                                                                            );
                                                                        }}
                                                                        disabled={
                                                                            !row.categoryUuid
                                                                        }
                                                                    >
                                                                        <SelectTrigger>
                                                                            <SelectValue
                                                                                placeholder={t(
                                                                                    'offers.form.select_operation',
                                                                                )}
                                                                            />
                                                                        </SelectTrigger>
                                                                        <SelectContent>
                                                                            {(
                                                                                operationsByCategory[
                                                                                    row
                                                                                        .categoryUuid
                                                                                ] ||
                                                                                []
                                                                            ).map(
                                                                                (
                                                                                    operation,
                                                                                ) => (
                                                                                    <SelectItem
                                                                                        key={
                                                                                            operation.uuid
                                                                                        }
                                                                                        value={
                                                                                            operation.uuid
                                                                                        }
                                                                                    >
                                                                                        {
                                                                                            operation.codice_univoco
                                                                                        }{' '}
                                                                                        -{' '}
                                                                                        {
                                                                                            operation.descrizione
                                                                                        }
                                                                                    </SelectItem>
                                                                                ),
                                                                            )}
                                                                        </SelectContent>
                                                                    </Select>
                                                                </div>
                                                                <Input
                                                                    type="text"
                                                                    value={
                                                                        row.secOp
                                                                            ? formatNumber(
                                                                                  row.secOp,
                                                                              )
                                                                            : ''
                                                                    }
                                                                    readOnly
                                                                    className="w-[11%] bg-muted text-right"
                                                                />
                                                                <Input
                                                                    type="text"
                                                                    value={
                                                                        row.numOp
                                                                            ? formatInteger(
                                                                                  row.numOp,
                                                                              )
                                                                            : ''
                                                                    }
                                                                    onChange={(
                                                                        e,
                                                                    ) => {
                                                                        const formatted =
                                                                            formatInputNumber(
                                                                                e
                                                                                    .target
                                                                                    .value,
                                                                                false,
                                                                                true,
                                                                            );
                                                                        const parsed =
                                                                            parseNumber(
                                                                                formatted,
                                                                            );
                                                                        updateOperationRow(
                                                                            row.id,
                                                                            {
                                                                                numOp: Math.round(
                                                                                    parsed,
                                                                                ),
                                                                            },
                                                                        );
                                                                    }}
                                                                    onFocus={
                                                                        handleInputFocus
                                                                    }
                                                                    required
                                                                    min="1"
                                                                    className="w-[11%] text-right"
                                                                />
                                                                <Input
                                                                    type="text"
                                                                    value={
                                                                        row.totalSec
                                                                            ? formatNumber(
                                                                                  row.totalSec,
                                                                              )
                                                                            : ''
                                                                    }
                                                                    readOnly
                                                                    className="w-[11%] bg-muted text-right"
                                                                />
                                                                <Button
                                                                    type="button"
                                                                    variant="destructive"
                                                                    size="sm"
                                                                    onClick={() =>
                                                                        removeOperationRow(
                                                                            row.id,
                                                                        )
                                                                    }
                                                                    className="ml-1"
                                                                    aria-label={t(
                                                                        'offers.form.remove_row',
                                                                    )}
                                                                >
                                                                    X
                                                                </Button>
                                                            </div>
                                                        ),
                                                    )}
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        onClick={
                                                            addOperationRow
                                                        }
                                                        className="mt-2"
                                                    >
                                                        {t(
                                                            'offers.form.add_operation',
                                                        )}
                                                    </Button>
                                                </div>

                                                <div className="grid gap-2">
                                                    <FormLabel htmlFor="theoretical_time_cfz">
                                                        {t(
                                                            'offers.show.time_theoretical_cfz_label',
                                                        )}
                                                    </FormLabel>
                                                    <div className="flex">
                                                        <Input
                                                            id="theoretical_time_cfz"
                                                            name="theoretical_time_cfz"
                                                            type="text"
                                                            value={
                                                                theoreticalTimeCfz
                                                            }
                                                            readOnly
                                                            className="rounded-r-none bg-muted text-right"
                                                        />
                                                        <span className="inline-flex items-center rounded-r-md border border-l-0 border-input bg-muted px-3 text-sm">
                                                            sec/cfz
                                                        </span>
                                                    </div>
                                                    <InputError
                                                        message={
                                                            allErrors.theoretical_time_cfz
                                                        }
                                                    />
                                                </div>

                                                <div className="grid gap-2">
                                                    <FormLabel htmlFor="unexpected">
                                                        {t(
                                                            'offers.show.time_unexpected_label',
                                                        )}
                                                    </FormLabel>
                                                    <Input
                                                        id="unexpected"
                                                        name="unexpected"
                                                        type="text"
                                                        value={unexpected}
                                                        readOnly
                                                        className="bg-muted text-right"
                                                    />
                                                    <InputError
                                                        message={
                                                            allErrors.unexpected
                                                        }
                                                    />
                                                </div>

                                                <div className="grid gap-2">
                                                    <FormLabel htmlFor="total_theoretical_time">
                                                        {t(
                                                            'offers.show.time_total_theoretical_label',
                                                        )}
                                                    </FormLabel>
                                                    <div className="flex">
                                                        <Input
                                                            id="total_theoretical_time"
                                                            name="total_theoretical_time"
                                                            type="text"
                                                            value={
                                                                totalTheoreticalTime
                                                            }
                                                            readOnly
                                                            className="rounded-r-none bg-muted text-right"
                                                        />
                                                        <span className="inline-flex items-center rounded-r-md border border-l-0 border-input bg-muted px-3 text-sm">
                                                            sec/cfz
                                                        </span>
                                                    </div>
                                                    <InputError
                                                        message={
                                                            allErrors.total_theoretical_time
                                                        }
                                                    />
                                                </div>

                                                <div className="grid gap-2">
                                                    <FormLabel htmlFor="theoretical_time">
                                                        {t(
                                                            'offers.show.time_theoretical_pz_label',
                                                        )}
                                                    </FormLabel>
                                                    <div className="flex">
                                                        <Input
                                                            id="theoretical_time"
                                                            name="theoretical_time"
                                                            type="text"
                                                            value={
                                                                theoreticalTime
                                                            }
                                                            readOnly
                                                            className="rounded-r-none bg-muted text-right"
                                                        />
                                                        <span className="inline-flex items-center rounded-r-md border border-l-0 border-input bg-muted px-3 text-sm">
                                                            sec/pz
                                                        </span>
                                                    </div>
                                                    <InputError
                                                        message={
                                                            allErrors.theoretical_time
                                                        }
                                                    />
                                                </div>

                                                <div className="grid gap-2">
                                                    <FormLabel htmlFor="production_time_cfz">
                                                        {t(
                                                            'offers.show.time_production_cfz_label',
                                                        )}
                                                    </FormLabel>
                                                    <div className="flex">
                                                        <Input
                                                            id="production_time_cfz"
                                                            name="production_time_cfz"
                                                            type="text"
                                                            value={
                                                                productionTimeCfz
                                                            }
                                                            readOnly
                                                            className="rounded-r-none bg-muted text-right"
                                                        />
                                                        <span className="inline-flex items-center rounded-r-md border border-l-0 border-input bg-muted px-3 text-sm">
                                                            sec/cfz
                                                        </span>
                                                    </div>
                                                    <InputError
                                                        message={
                                                            allErrors.production_time_cfz
                                                        }
                                                    />
                                                </div>

                                                <div className="grid gap-2">
                                                    <FormLabel htmlFor="production_time">
                                                        {t(
                                                            'offers.show.time_production_pz_label',
                                                        )}
                                                    </FormLabel>
                                                    <div className="flex">
                                                        <Input
                                                            id="production_time"
                                                            name="production_time"
                                                            type="text"
                                                            value={
                                                                productionTime
                                                            }
                                                            readOnly
                                                            className="rounded-r-none bg-muted text-right"
                                                        />
                                                        <span className="inline-flex items-center rounded-r-md border border-l-0 border-input bg-muted px-3 text-sm">
                                                            sec/pz
                                                        </span>
                                                    </div>
                                                    <InputError
                                                        message={
                                                            allErrors.production_time
                                                        }
                                                    />
                                                </div>

                                                <div className="grid gap-2">
                                                    <FormLabel htmlFor="production_average_cfz">
                                                        {t(
                                                            'offers.show.time_avg_cfz_label',
                                                        )}
                                                    </FormLabel>
                                                    <div className="flex">
                                                        <Input
                                                            id="production_average_cfz"
                                                            name="production_average_cfz"
                                                            type="text"
                                                            value={
                                                                productionAverageCfz
                                                            }
                                                            readOnly
                                                            className="rounded-r-none bg-muted text-right"
                                                        />
                                                        <span className="inline-flex items-center rounded-r-md border border-l-0 border-input bg-muted px-3 text-sm">
                                                            cfz/h/ps
                                                        </span>
                                                    </div>
                                                    <InputError
                                                        message={
                                                            allErrors.production_average_cfz
                                                        }
                                                    />
                                                </div>

                                                <div className="grid gap-2">
                                                    <FormLabel htmlFor="production_average_pz">
                                                        {t(
                                                            'offers.show.time_avg_pz_label',
                                                        )}
                                                    </FormLabel>
                                                    <div className="flex">
                                                        <Input
                                                            id="production_average_pz"
                                                            name="production_average_pz"
                                                            type="text"
                                                            value={
                                                                productionAveragePz
                                                            }
                                                            readOnly
                                                            className="rounded-r-none bg-muted text-right"
                                                        />
                                                        <span className="inline-flex items-center rounded-r-md border border-l-0 border-input bg-muted px-3 text-sm">
                                                            pz/h/ps
                                                        </span>
                                                    </div>
                                                    <InputError
                                                        message={
                                                            allErrors.production_average_pz
                                                        }
                                                    />
                                                </div>

                                                <div className="grid gap-2">
                                                    <FormLabel htmlFor="expected_workers">
                                                        {t(
                                                            'offers.show.time_workers_label',
                                                        )}
                                                    </FormLabel>
                                                    <Input
                                                        id="expected_workers"
                                                        name="expected_workers"
                                                        type="text"
                                                        value={expectedWorkers}
                                                        onChange={(e) => {
                                                            const formatted =
                                                                formatInputNumber(
                                                                    e.target
                                                                        .value,
                                                                    false,
                                                                    true,
                                                                );
                                                            setExpectedWorkers(
                                                                formatted,
                                                            );
                                                        }}
                                                        onFocus={
                                                            handleInputFocus
                                                        }
                                                        className="text-right"
                                                    />
                                                    <InputError
                                                        message={
                                                            allErrors.expected_workers
                                                        }
                                                    />
                                                </div>

                                                <div className="grid gap-2">
                                                    <FormLabel
                                                        htmlFor="expected_revenue"
                                                        required
                                                    >
                                                        {t(
                                                            'offers.show.revenue_label',
                                                        )}
                                                    </FormLabel>
                                                    <div className="flex">
                                                        <Input
                                                            id="expected_revenue"
                                                            name="expected_revenue"
                                                            type="text"
                                                            value={
                                                                expectedRevenue
                                                            }
                                                            onChange={(e) => {
                                                                const formatted =
                                                                    formatInputNumber(
                                                                        e.target
                                                                            .value,
                                                                    );
                                                                setExpectedRevenue(
                                                                    formatted,
                                                                );
                                                            }}
                                                            required
                                                            title={t(
                                                                'offers.form.validation_value_example',
                                                            )}
                                                            className="rounded-r-none text-right"
                                                        />
                                                        <span className="inline-flex items-center rounded-r-md border border-l-0 border-input bg-muted px-3 text-sm">
                                                            €
                                                        </span>
                                                    </div>
                                                    <InputError
                                                        message={
                                                            allErrors.expected_revenue
                                                        }
                                                    />
                                                </div>

                                                <div className="grid gap-2">
                                                    <FormLabel htmlFor="rate_cfz">
                                                        {t(
                                                            'offers.show.rate_cfz_label',
                                                        )}
                                                    </FormLabel>
                                                    <div className="flex">
                                                        <Input
                                                            id="rate_cfz"
                                                            name="rate_cfz"
                                                            type="text"
                                                            value={rateCfz}
                                                            readOnly
                                                            className="rounded-r-none bg-muted text-right"
                                                        />
                                                        <span className="inline-flex items-center rounded-r-md border border-l-0 border-input bg-muted px-3 text-sm">
                                                            cfz
                                                        </span>
                                                    </div>
                                                    <InputError
                                                        message={
                                                            allErrors.rate_cfz
                                                        }
                                                    />
                                                </div>

                                                <div className="grid gap-2">
                                                    <FormLabel htmlFor="rate_pz">
                                                        {t(
                                                            'offers.show.rate_pz_label',
                                                        )}
                                                    </FormLabel>
                                                    <div className="flex">
                                                        <Input
                                                            id="rate_pz"
                                                            name="rate_pz"
                                                            type="text"
                                                            value={ratePz}
                                                            readOnly
                                                            className="rounded-r-none bg-muted text-right"
                                                        />
                                                        <span className="inline-flex items-center rounded-r-md border border-l-0 border-input bg-muted px-3 text-sm">
                                                            pz
                                                        </span>
                                                    </div>
                                                    <InputError
                                                        message={
                                                            allErrors.rate_pz
                                                        }
                                                    />
                                                </div>

                                                <div className="grid gap-2">
                                                    <FormLabel
                                                        htmlFor="rate_rounding_cfz"
                                                        required
                                                    >
                                                        {t(
                                                            'offers.show.rate_cfz_label',
                                                        )}
                                                        arrotondata
                                                    </FormLabel>
                                                    <div className="flex">
                                                        <Input
                                                            id="rate_rounding_cfz"
                                                            name="rate_rounding_cfz"
                                                            type="text"
                                                            value={
                                                                rateRoundingCfz
                                                            }
                                                            onChange={(e) => {
                                                                const formatted =
                                                                    formatInputNumber(
                                                                        e.target
                                                                            .value,
                                                                    );
                                                                setRateRoundingCfz(
                                                                    formatted,
                                                                );
                                                            }}
                                                            onFocus={
                                                                handleInputFocus
                                                            }
                                                            required
                                                            title={t(
                                                                'offers.form.validation_value_example',
                                                            )}
                                                            className="rounded-r-none text-right"
                                                        />
                                                        <span className="inline-flex items-center rounded-r-md border border-l-0 border-input bg-muted px-3 text-sm">
                                                            cfz
                                                        </span>
                                                    </div>
                                                    <InputError
                                                        message={
                                                            allErrors.rate_rounding_cfz
                                                        }
                                                    />
                                                </div>

                                                <div className="grid gap-2">
                                                    <FormLabel
                                                        htmlFor="rate_increase_cfz"
                                                        required
                                                    >
                                                        {t(
                                                            'offers.show.rate_increase_cfz_label',
                                                        )}
                                                    </FormLabel>
                                                    <div className="flex">
                                                        <Input
                                                            id="rate_increase_cfz"
                                                            name="rate_increase_cfz"
                                                            type="text"
                                                            value={
                                                                rateIncreaseCfz
                                                            }
                                                            onChange={(e) => {
                                                                const formatted =
                                                                    formatInputNumber(
                                                                        e.target
                                                                            .value,
                                                                        true,
                                                                    );
                                                                setRateIncreaseCfz(
                                                                    formatted,
                                                                );
                                                            }}
                                                            onFocus={
                                                                handleInputFocus
                                                            }
                                                            required
                                                            title={t(
                                                                'offers.form.validation_value_signed_example',
                                                            )}
                                                            className="rounded-r-none text-right"
                                                        />
                                                        <span className="inline-flex items-center rounded-r-md border border-l-0 border-input bg-muted px-3 text-sm">
                                                            cfz
                                                        </span>
                                                    </div>
                                                    <InputError
                                                        message={
                                                            allErrors.rate_increase_cfz
                                                        }
                                                    />
                                                </div>

                                                <div className="grid gap-2">
                                                    <FormLabel htmlFor="rate_rounding_cfz_perc">
                                                        {t(
                                                            'offers.show.rate_cfz_label',
                                                        )}
                                                        arrotondata %
                                                    </FormLabel>
                                                    <div className="flex">
                                                        <Input
                                                            id="rate_rounding_cfz_perc"
                                                            name="rate_rounding_cfz_perc"
                                                            type="text"
                                                            value={
                                                                rateRoundingCfzPerc
                                                            }
                                                            readOnly
                                                            className="rounded-r-none bg-muted text-right"
                                                        />
                                                        <span className="inline-flex items-center rounded-r-md border border-l-0 border-input bg-muted px-3 text-sm">
                                                            %
                                                        </span>
                                                    </div>
                                                    <InputError
                                                        message={
                                                            allErrors.rate_rounding_cfz_perc
                                                        }
                                                    />
                                                </div>

                                                <div className="grid gap-2">
                                                    <FormLabel htmlFor="final_rate_cfz">
                                                        {t(
                                                            'offers.show.final_rate_cfz_label',
                                                        )}
                                                    </FormLabel>
                                                    <div className="flex">
                                                        <Input
                                                            id="final_rate_cfz"
                                                            name="final_rate_cfz"
                                                            type="text"
                                                            value={finalRateCfz}
                                                            readOnly
                                                            className="rounded-r-none bg-muted text-right"
                                                        />
                                                        <span className="inline-flex items-center rounded-r-md border border-l-0 border-input bg-muted px-3 text-sm">
                                                            cfz
                                                        </span>
                                                    </div>
                                                    <InputError
                                                        message={
                                                            allErrors.final_rate_cfz
                                                        }
                                                    />
                                                </div>

                                                <div className="grid gap-2">
                                                    <FormLabel htmlFor="final_rate_pz">
                                                        {t(
                                                            'offers.show.final_rate_pz_label',
                                                        )}
                                                    </FormLabel>
                                                    <div className="flex">
                                                        <Input
                                                            id="final_rate_pz"
                                                            name="final_rate_pz"
                                                            type="text"
                                                            value={finalRatePz}
                                                            readOnly
                                                            className="rounded-r-none bg-muted text-right"
                                                        />
                                                        <span className="inline-flex items-center rounded-r-md border border-l-0 border-input bg-muted px-3 text-sm">
                                                            pz
                                                        </span>
                                                    </div>
                                                    <InputError
                                                        message={
                                                            allErrors.final_rate_pz
                                                        }
                                                    />
                                                </div>

                                                <div className="grid gap-2">
                                                    <FormLabel
                                                        htmlFor="materials_euro"
                                                        required
                                                    >
                                                        {t(
                                                            'offers.show.materials_euro_label',
                                                        )}
                                                    </FormLabel>
                                                    <div className="flex">
                                                        <Input
                                                            id="materials_euro"
                                                            name="materials_euro"
                                                            type="text"
                                                            value={
                                                                materialsEuro
                                                            }
                                                            onChange={(e) => {
                                                                const formatted =
                                                                    formatInputNumber(
                                                                        e.target
                                                                            .value,
                                                                    );
                                                                setMaterialsEuro(
                                                                    formatted,
                                                                );
                                                            }}
                                                            onFocus={
                                                                handleInputFocus
                                                            }
                                                            required
                                                            className="rounded-r-none text-right"
                                                        />
                                                        <span className="inline-flex items-center rounded-r-md border border-l-0 border-input bg-muted px-3 text-sm">
                                                            €
                                                        </span>
                                                    </div>
                                                    <small className="text-sm text-muted-foreground">
                                                        {t(
                                                            'offers.form.validation_amount_eur_example',
                                                        )}
                                                    </small>
                                                    <InputError
                                                        message={
                                                            allErrors.materials_euro
                                                        }
                                                    />
                                                </div>

                                                <div className="grid gap-2">
                                                    <FormLabel
                                                        htmlFor="logistics_euro"
                                                        required
                                                    >
                                                        {t(
                                                            'offers.show.logistics_euro_label',
                                                        )}
                                                    </FormLabel>
                                                    <div className="flex">
                                                        <Input
                                                            id="logistics_euro"
                                                            name="logistics_euro"
                                                            type="text"
                                                            value={
                                                                logisticsEuro
                                                            }
                                                            onChange={(e) => {
                                                                const formatted =
                                                                    formatInputNumber(
                                                                        e.target
                                                                            .value,
                                                                    );
                                                                setLogisticsEuro(
                                                                    formatted,
                                                                );
                                                            }}
                                                            onFocus={
                                                                handleInputFocus
                                                            }
                                                            required
                                                            className="rounded-r-none text-right"
                                                        />
                                                        <span className="inline-flex items-center rounded-r-md border border-l-0 border-input bg-muted px-3 text-sm">
                                                            €
                                                        </span>
                                                    </div>
                                                    <small className="text-sm text-muted-foreground">
                                                        {t(
                                                            'offers.form.validation_amount_eur_example',
                                                        )}
                                                    </small>
                                                    <InputError
                                                        message={
                                                            allErrors.logistics_euro
                                                        }
                                                    />
                                                </div>

                                                <div className="grid gap-2">
                                                    <FormLabel
                                                        htmlFor="other_euro"
                                                        required
                                                    >
                                                        {t(
                                                            'offers.show.other_euro_label',
                                                        )}
                                                    </FormLabel>
                                                    <div className="flex">
                                                        <Input
                                                            id="other_euro"
                                                            name="other_euro"
                                                            type="text"
                                                            value={otherEuro}
                                                            onChange={(e) => {
                                                                const formatted =
                                                                    formatInputNumber(
                                                                        e.target
                                                                            .value,
                                                                    );
                                                                setOtherEuro(
                                                                    formatted,
                                                                );
                                                            }}
                                                            onFocus={
                                                                handleInputFocus
                                                            }
                                                            required
                                                            className="rounded-r-none text-right"
                                                        />
                                                        <span className="inline-flex items-center rounded-r-md border border-l-0 border-input bg-muted px-3 text-sm">
                                                            €
                                                        </span>
                                                    </div>
                                                    <small className="text-sm text-muted-foreground">
                                                        {t(
                                                            'offers.form.validation_amount_eur_example',
                                                        )}
                                                    </small>
                                                    <InputError
                                                        message={
                                                            allErrors.other_euro
                                                        }
                                                    />
                                                </div>

                                                <div className="grid gap-2">
                                                    <FormLabel htmlFor="total_rate_cfz">
                                                        {t(
                                                            'offers.show.total_rate_cfz_label',
                                                        )}
                                                    </FormLabel>
                                                    <div className="flex">
                                                        <Input
                                                            id="total_rate_cfz"
                                                            name="total_rate_cfz"
                                                            type="text"
                                                            value={totalRateCfz}
                                                            readOnly
                                                            className="rounded-r-none bg-muted text-right"
                                                        />
                                                        <span className="inline-flex items-center rounded-r-md border border-l-0 border-input bg-muted px-3 text-sm">
                                                            cfz
                                                        </span>
                                                    </div>
                                                    <InputError
                                                        message={
                                                            allErrors.total_rate_cfz
                                                        }
                                                    />
                                                </div>

                                                <div className="grid gap-2">
                                                    <FormLabel htmlFor="total_rate_pz">
                                                        {t(
                                                            'offers.show.total_rate_pz_label',
                                                        )}
                                                    </FormLabel>
                                                    <div className="flex">
                                                        <Input
                                                            id="total_rate_pz"
                                                            name="total_rate_pz"
                                                            type="text"
                                                            value={totalRatePz}
                                                            readOnly
                                                            className="rounded-r-none bg-muted text-right"
                                                        />
                                                        <span className="inline-flex items-center rounded-r-md border border-l-0 border-input bg-muted px-3 text-sm">
                                                            pz
                                                        </span>
                                                    </div>
                                                    <InputError
                                                        message={
                                                            allErrors.total_rate_pz
                                                        }
                                                    />
                                                </div>

                                                <div className="grid gap-2">
                                                    <FormLabel htmlFor="offer_notes">
                                                        {t(
                                                            'offers.show.offer_notes_label',
                                                        )}
                                                    </FormLabel>
                                                    <Textarea
                                                        id="offer_notes"
                                                        name="offer_notes"
                                                        rows={3}
                                                        value={offerNotes}
                                                        onChange={(e) =>
                                                            setOfferNotes(
                                                                e.target.value,
                                                            )
                                                        }
                                                        onFocus={
                                                            handleInputFocus
                                                        }
                                                    />
                                                    <InputError
                                                        message={
                                                            allErrors.offer_notes
                                                        }
                                                    />
                                                </div>

                                                <div className="grid gap-2">
                                                    <FormLabel htmlFor="ls_setup_cost">
                                                        {t(
                                                            'offers.show.ls_setup_cost_label',
                                                        )}
                                                    </FormLabel>
                                                    <div className="flex">
                                                        <Input
                                                            id="ls_setup_cost"
                                                            name="ls_setup_cost"
                                                            type="text"
                                                            value={lsSetupCost}
                                                            onChange={(e) => {
                                                                const formatted =
                                                                    formatInputNumber(
                                                                        e.target
                                                                            .value,
                                                                    );
                                                                setLsSetupCost(
                                                                    formatted,
                                                                );
                                                            }}
                                                            className="rounded-r-none text-right"
                                                        />
                                                        <span className="inline-flex items-center rounded-r-md border border-l-0 border-input bg-muted px-3 text-sm">
                                                            %
                                                        </span>
                                                    </div>
                                                    <InputError
                                                        message={
                                                            allErrors.ls_setup_cost
                                                        }
                                                    />
                                                </div>

                                                <div className="grid gap-2">
                                                    <FormLabel htmlFor="ls_other_costs">
                                                        {t(
                                                            'offers.show.ls_other_costs_label',
                                                        )}
                                                    </FormLabel>
                                                    <div className="flex">
                                                        <Input
                                                            id="ls_other_costs"
                                                            name="ls_other_costs"
                                                            type="text"
                                                            value={lsOtherCosts}
                                                            onChange={(e) => {
                                                                const formatted =
                                                                    formatInputNumber(
                                                                        e.target
                                                                            .value,
                                                                    );
                                                                setLsOtherCosts(
                                                                    formatted,
                                                                );
                                                            }}
                                                            onFocus={
                                                                handleInputFocus
                                                            }
                                                            title={t(
                                                                'offers.form.validation_amount_eur_example',
                                                            )}
                                                            className="rounded-r-none text-right"
                                                        />
                                                        <span className="inline-flex items-center rounded-r-md border border-l-0 border-input bg-muted px-3 text-sm">
                                                            €
                                                        </span>
                                                    </div>
                                                    <small className="text-sm text-muted-foreground">
                                                        {t(
                                                            'offers.form.validation_amount_eur_example',
                                                        )}
                                                    </small>
                                                    <InputError
                                                        message={
                                                            allErrors.ls_other_costs
                                                        }
                                                    />
                                                </div>

                                                <div className="grid gap-2">
                                                    <FormLabel htmlFor="approval_status">
                                                        {t(
                                                            'offers.show.approval_status_label',
                                                        )}
                                                    </FormLabel>
                                                    <Select
                                                        name="approval_status"
                                                        value={approvalStatus}
                                                        onValueChange={
                                                            setApprovalStatus
                                                        }
                                                    >
                                                        <SelectTrigger>
                                                            <SelectValue
                                                                placeholder={t(
                                                                    'offers.form.select_approval_status',
                                                                )}
                                                            />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="0">
                                                                {t(
                                                                    'offers.index.mobile_status_pending',
                                                                )}
                                                            </SelectItem>
                                                            <SelectItem value="1">
                                                                {t(
                                                                    'offers.index.mobile_status_approved',
                                                                )}
                                                            </SelectItem>
                                                            <SelectItem value="2">
                                                                {t(
                                                                    'offers.index.mobile_status_rejected',
                                                                )}
                                                            </SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                    <InputError
                                                        message={
                                                            allErrors.approval_status
                                                        }
                                                    />
                                                </div>

                                                <div className="flex items-center gap-4 pt-4">
                                                    <Button
                                                        type="submit"
                                                        disabled={processing}
                                                    >
                                                        {processing
                                                            ? t('common.saving')
                                                            : t(
                                                                  'offers.edit.submit',
                                                              )}
                                                    </Button>
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        onClick={handleClose}
                                                    >
                                                        {t('dashboard.close')}
                                                    </Button>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </div>
                                </div>
                            </>
                        );
                    }}
                </Form>

                <ConfirmCloseDialog
                    open={showCloseConfirm}
                    onOpenChange={setShowCloseConfirm}
                    onConfirm={confirmClose}
                />
            </div>
        </AppLayout>
    );
}
