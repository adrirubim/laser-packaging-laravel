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
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import AppLayout from '@/layouts/app-layout';
import articles from '@/routes/articles/index';
import { type BreadcrumbItem } from '@/types';
import { Form, Head, router, usePage } from '@inertiajs/react';
import { HelpCircle } from 'lucide-react';
import { useEffect, useState } from 'react';

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
};

type PalletizationInstructionsEditProps = {
    instruction: PalletizationInstruction;
    errors?: Record<string, string>;
};

export default function PalletizationInstructionsEdit({
    errors: serverErrors,
}: PalletizationInstructionsEditProps) {
    const { props } = usePage<PalletizationInstructionsEditProps>();
    const { instruction } = props;

    const [lengthCm, setLengthCm] = useState<string>(
        instruction.length_cm?.toString() || '',
    );
    const [depthCm, setDepthCm] = useState<string>(
        instruction.depth_cm?.toString() || '',
    );
    const [heightCm, setHeightCm] = useState<string>(
        instruction.height_cm?.toString() || '',
    );
    const [volumeDmc, setVolumeDmc] = useState<string>(
        instruction.volume_dmc?.toString() || '',
    );
    const [planPackaging, setPlanPackaging] = useState<string>(
        instruction.plan_packaging?.toString() || '',
    );
    const [palletPlans, setPalletPlans] = useState<string>(
        instruction.pallet_plans?.toString() || '',
    );
    const [qtyPallet, setQtyPallet] = useState<string>(
        instruction.qty_pallet?.toString() || '',
    );
    const [unitsPerNeck, setUnitsPerNeck] = useState<string>(
        instruction.units_per_neck?.toString() || '',
    );
    const [selectedFileName, setSelectedFileName] = useState<string | null>(
        null,
    );
    const [unitsPallet, setUnitsPallet] = useState<string>(
        instruction.units_pallet?.toString() || '',
    );

    // Calcolare volume al cambio dimensioni
    useEffect(() => {
        const length = parseFloat(lengthCm) || 0;
        const depth = parseFloat(depthCm) || 0;
        const height = parseFloat(heightCm) || 0;

        if (length > 0 && depth > 0 && height > 0) {
            const volume = (length * depth * height) / 1000; // Convertir a dm³
            queueMicrotask(() => setVolumeDmc(volume.toFixed(2)));
        } else {
            queueMicrotask(() => setVolumeDmc(''));
        }
    }, [lengthCm, depthCm, heightCm]);

    // Calcolare colli per pallet
    useEffect(() => {
        const plan = parseInt(planPackaging) || 0;
        const plans = parseInt(palletPlans) || 0;

        if (plan > 0 && plans > 0) {
            queueMicrotask(() => setQtyPallet((plan * plans).toString()));
        } else {
            queueMicrotask(() => setQtyPallet(''));
        }
    }, [planPackaging, palletPlans]);

    // Calcolare unità per pallet
    useEffect(() => {
        const qty = parseInt(qtyPallet) || 0;
        const units = parseInt(unitsPerNeck) || 0;

        if (qty > 0 && units > 0) {
            queueMicrotask(() => setUnitsPallet((qty * units).toString()));
        } else {
            queueMicrotask(() => setUnitsPallet(''));
        }
    }, [qtyPallet, unitsPerNeck]);

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Articoli',
            href: articles.index().url,
        },
        {
            title: 'Istruzioni di Pallettizzazione',
            href: '/articles/palletization-instructions',
        },
        {
            title: instruction.code + (instruction.number || ''),
            href: `/articles/palletization-instructions/${instruction.uuid}`,
        },
        {
            title: 'Modifica',
            href: `/articles/palletization-instructions/${instruction.uuid}/edit`,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head
                title={`Modifica Istruzione ${instruction.code}${instruction.number || ''}`}
            />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex w-full justify-center">
                    <div className="w-full max-w-4xl space-y-5">
                        <Card>
                            <CardHeader>
                                <CardTitle>
                                    Modifica Istruzione di Pallettizzazione
                                </CardTitle>
                                <CardDescription>
                                    Modifica i dettagli dell'istruzione
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Form
                                    action={
                                        articles.palletizationInstructions.update(
                                            {
                                                palletizationInstruction:
                                                    instruction.uuid,
                                            },
                                        ).url
                                    }
                                    method="put"
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
                                                    <div className="flex items-center gap-2">
                                                        <FormLabel
                                                            htmlFor="code"
                                                            required
                                                        >
                                                            Codice
                                                        </FormLabel>
                                                        <Tooltip>
                                                            <TooltipTrigger
                                                                asChild
                                                            >
                                                                <HelpCircle className="h-4 w-4 cursor-help text-muted-foreground" />
                                                            </TooltipTrigger>
                                                            <TooltipContent>
                                                                <p>
                                                                    Il codice
                                                                    deve essere
                                                                    univoco
                                                                </p>
                                                            </TooltipContent>
                                                        </Tooltip>
                                                    </div>
                                                    <Input
                                                        id="code"
                                                        name="code"
                                                        required
                                                        defaultValue={
                                                            instruction.code
                                                        }
                                                        maxLength={255}
                                                    />
                                                    <InputError
                                                        message={allErrors.code}
                                                    />
                                                </div>

                                                <div className="grid gap-2">
                                                    <div className="flex items-center gap-2">
                                                        <FormLabel htmlFor="number">
                                                            Numero
                                                        </FormLabel>
                                                    </div>
                                                    <Input
                                                        id="number"
                                                        name="number"
                                                        defaultValue={
                                                            instruction.number ??
                                                            ''
                                                        }
                                                        maxLength={255}
                                                    />
                                                    <InputError
                                                        message={
                                                            allErrors.number
                                                        }
                                                    />
                                                </div>

                                                <div className="grid gap-4 md:grid-cols-3">
                                                    <div className="grid gap-2">
                                                        <FormLabel htmlFor="length_cm">
                                                            Larghezza collo (cm)
                                                        </FormLabel>
                                                        <Input
                                                            id="length_cm"
                                                            name="length_cm"
                                                            type="number"
                                                            step="0.01"
                                                            placeholder="0.00"
                                                            value={lengthCm}
                                                            onChange={(e) =>
                                                                setLengthCm(
                                                                    e.target
                                                                        .value,
                                                                )
                                                            }
                                                        />
                                                        <InputError
                                                            message={
                                                                allErrors.length_cm
                                                            }
                                                        />
                                                    </div>
                                                    <div className="grid gap-2">
                                                        <FormLabel htmlFor="depth_cm">
                                                            Profondità collo
                                                            (cm)
                                                        </FormLabel>
                                                        <Input
                                                            id="depth_cm"
                                                            name="depth_cm"
                                                            type="number"
                                                            step="0.01"
                                                            placeholder="0.00"
                                                            value={depthCm}
                                                            onChange={(e) =>
                                                                setDepthCm(
                                                                    e.target
                                                                        .value,
                                                                )
                                                            }
                                                        />
                                                        <InputError
                                                            message={
                                                                allErrors.depth_cm
                                                            }
                                                        />
                                                    </div>
                                                    <div className="grid gap-2">
                                                        <FormLabel htmlFor="height_cm">
                                                            Altezza collo (cm)
                                                        </FormLabel>
                                                        <Input
                                                            id="height_cm"
                                                            name="height_cm"
                                                            type="number"
                                                            step="0.01"
                                                            placeholder="0.00"
                                                            value={heightCm}
                                                            onChange={(e) =>
                                                                setHeightCm(
                                                                    e.target
                                                                        .value,
                                                                )
                                                            }
                                                        />
                                                        <InputError
                                                            message={
                                                                allErrors.height_cm
                                                            }
                                                        />
                                                    </div>
                                                </div>

                                                <div className="grid gap-2">
                                                    <FormLabel htmlFor="volume_dmc">
                                                        Volume collo (dm³)
                                                    </FormLabel>
                                                    <Input
                                                        id="volume_dmc"
                                                        name="volume_dmc"
                                                        type="number"
                                                        step="0.01"
                                                        placeholder="0.00"
                                                        value={volumeDmc}
                                                        readOnly
                                                        className="bg-muted"
                                                    />
                                                    <p className="text-xs text-muted-foreground">
                                                        Calcolato
                                                        automaticamente dalle
                                                        dimensioni
                                                    </p>
                                                    <InputError
                                                        message={
                                                            allErrors.volume_dmc
                                                        }
                                                    />
                                                </div>

                                                <div className="grid gap-4 md:grid-cols-2">
                                                    <div className="grid gap-2">
                                                        <FormLabel htmlFor="plan_packaging">
                                                            Colli per piano
                                                        </FormLabel>
                                                        <Input
                                                            id="plan_packaging"
                                                            name="plan_packaging"
                                                            type="number"
                                                            placeholder="0"
                                                            value={
                                                                planPackaging
                                                            }
                                                            onChange={(e) =>
                                                                setPlanPackaging(
                                                                    e.target
                                                                        .value,
                                                                )
                                                            }
                                                        />
                                                        <InputError
                                                            message={
                                                                allErrors.plan_packaging
                                                            }
                                                        />
                                                    </div>
                                                    <div className="grid gap-2">
                                                        <FormLabel htmlFor="pallet_plans">
                                                            Piani per pallet
                                                        </FormLabel>
                                                        <Input
                                                            id="pallet_plans"
                                                            name="pallet_plans"
                                                            type="number"
                                                            placeholder="0"
                                                            value={palletPlans}
                                                            onChange={(e) =>
                                                                setPalletPlans(
                                                                    e.target
                                                                        .value,
                                                                )
                                                            }
                                                        />
                                                        <InputError
                                                            message={
                                                                allErrors.pallet_plans
                                                            }
                                                        />
                                                    </div>
                                                </div>

                                                <div className="grid gap-2">
                                                    <FormLabel htmlFor="qty_pallet">
                                                        Colli per pallet
                                                    </FormLabel>
                                                    <Input
                                                        id="qty_pallet"
                                                        name="qty_pallet"
                                                        type="number"
                                                        placeholder="0"
                                                        value={qtyPallet}
                                                        readOnly
                                                        className="bg-muted"
                                                    />
                                                    <p className="text-xs text-muted-foreground">
                                                        Calcolato
                                                        automaticamente (Colli
                                                        per piano × Piani per
                                                        pallet)
                                                    </p>
                                                    <InputError
                                                        message={
                                                            allErrors.qty_pallet
                                                        }
                                                    />
                                                </div>

                                                <div className="grid gap-4 md:grid-cols-2">
                                                    <div className="grid gap-2">
                                                        <FormLabel htmlFor="units_per_neck">
                                                            Unità per collo
                                                        </FormLabel>
                                                        <Input
                                                            id="units_per_neck"
                                                            name="units_per_neck"
                                                            type="number"
                                                            placeholder="0"
                                                            value={unitsPerNeck}
                                                            onChange={(e) =>
                                                                setUnitsPerNeck(
                                                                    e.target
                                                                        .value,
                                                                )
                                                            }
                                                        />
                                                        <InputError
                                                            message={
                                                                allErrors.units_per_neck
                                                            }
                                                        />
                                                    </div>
                                                    <div className="grid gap-2">
                                                        <FormLabel htmlFor="units_pallet">
                                                            Unità per pallet
                                                        </FormLabel>
                                                        <Input
                                                            id="units_pallet"
                                                            name="units_pallet"
                                                            type="number"
                                                            placeholder="0"
                                                            value={unitsPallet}
                                                            readOnly
                                                            className="bg-muted"
                                                        />
                                                        <p className="text-xs text-muted-foreground">
                                                            Calcolato
                                                            automaticamente
                                                            (Colli per pallet ×
                                                            Unità per collo)
                                                        </p>
                                                        <InputError
                                                            message={
                                                                allErrors.units_pallet
                                                            }
                                                        />
                                                    </div>
                                                </div>

                                                <div className="grid gap-2">
                                                    <FormLabel htmlFor="interlayer_every_floors">
                                                        Interfalda ogni (piani)
                                                    </FormLabel>
                                                    <Input
                                                        id="interlayer_every_floors"
                                                        name="interlayer_every_floors"
                                                        type="number"
                                                        min="0"
                                                        max="99"
                                                        placeholder="0"
                                                        defaultValue={
                                                            instruction.interlayer_every_floors ??
                                                            ''
                                                        }
                                                    />
                                                    <InputError
                                                        message={
                                                            allErrors.interlayer_every_floors
                                                        }
                                                    />
                                                </div>

                                                <div className="grid gap-2">
                                                    <FormLabel htmlFor="filename">
                                                        Allegato
                                                    </FormLabel>
                                                    {instruction.filename && (
                                                        <div className="mb-2 rounded-md bg-muted p-2">
                                                            <p className="mb-1 text-xs text-muted-foreground">
                                                                Allegato
                                                                attuale:
                                                            </p>
                                                            <p className="font-mono text-sm">
                                                                {
                                                                    instruction.filename
                                                                }
                                                            </p>
                                                        </div>
                                                    )}
                                                    <Input
                                                        id="filename"
                                                        name="filename"
                                                        type="file"
                                                        accept="application/pdf"
                                                        className="cursor-pointer"
                                                        aria-describedby="filename-help"
                                                        onChange={(event) => {
                                                            const file =
                                                                event.target
                                                                    .files?.[0];
                                                            setSelectedFileName(
                                                                file
                                                                    ? file.name
                                                                    : null,
                                                            );
                                                        }}
                                                    />
                                                    <p
                                                        id="filename-help"
                                                        className="text-xs text-muted-foreground"
                                                    >
                                                        {instruction.filename
                                                            ? 'Carica un nuovo allegato PDF per sostituire quello esistente (opzionale).'
                                                            : "Seleziona un allegato PDF da associare all'istruzione (opzionale)."}
                                                    </p>
                                                    {selectedFileName && (
                                                        <p className="text-xs text-muted-foreground">
                                                            Nuovo allegato
                                                            selezionato:{' '}
                                                            <span className="font-mono">
                                                                {
                                                                    selectedFileName
                                                                }
                                                            </span>
                                                        </p>
                                                    )}
                                                    <InputError
                                                        message={
                                                            allErrors.filename
                                                        }
                                                    />
                                                </div>

                                                <div className="flex items-center gap-4">
                                                    <Button
                                                        type="submit"
                                                        disabled={processing}
                                                    >
                                                        {processing
                                                            ? 'Aggiornando...'
                                                            : 'Aggiorna Istruzione'}
                                                    </Button>
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        onClick={() =>
                                                            router.visit(
                                                                articles.palletizationInstructions.show(
                                                                    {
                                                                        palletizationInstruction:
                                                                            instruction.uuid,
                                                                    },
                                                                ).url,
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
