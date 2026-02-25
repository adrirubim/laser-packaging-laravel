import { useTranslations } from '@/hooks/use-translations';
import { Slider } from 'primereact/slider';
import { useState } from 'react';

/**
 * Componente di esempio che dimostra l'uso dello Slider di PrimeReact
 * Documentazione: https://primereact.org/slider/
 */
export function PrimeSliderExample() {
    const { t } = useTranslations();
    const [value, setValue] = useState<number>(50);
    const [rangeValue, setRangeValue] = useState<[number, number]>([20, 80]);
    const [stepValue, setStepValue] = useState<number>(20);

    return (
        <div className="space-y-8 p-6">
            <div className="space-y-4">
                <h3 className="text-lg font-semibold">
                    {t('prime_slider.simple')}
                </h3>
                <div className="flex items-center gap-4">
                    <Slider
                        value={value}
                        onChange={(e) => setValue(e.value as number)}
                        className="flex-1"
                    />
                    <span className="min-w-[3rem] text-center font-mono text-sm">
                        {value}
                    </span>
                </div>
            </div>

            <div className="space-y-4">
                <h3 className="text-lg font-semibold">
                    {t('prime_slider.range')}
                </h3>
                <div className="flex items-center gap-4">
                    <Slider
                        value={rangeValue}
                        onChange={(e) =>
                            setRangeValue(e.value as [number, number])
                        }
                        range
                        className="flex-1"
                    />
                    <span className="min-w-[8rem] text-center font-mono text-sm">
                        {rangeValue[0]} - {rangeValue[1]}
                    </span>
                </div>
            </div>

            <div className="space-y-4">
                <h3 className="text-lg font-semibold">
                    {t('prime_slider.step')}
                </h3>
                <div className="flex items-center gap-4">
                    <Slider
                        value={stepValue}
                        onChange={(e) => setStepValue(e.value as number)}
                        step={20}
                        className="flex-1"
                    />
                    <span className="min-w-[3rem] text-center font-mono text-sm">
                        {stepValue}
                    </span>
                </div>
            </div>

            <div className="space-y-4">
                <h3 className="text-lg font-semibold">
                    {t('prime_slider.vertical')}
                </h3>
                <div className="flex items-center gap-8">
                    <div className="h-64">
                        <Slider
                            value={value}
                            onChange={(e) => setValue(e.value as number)}
                            orientation="vertical"
                            className="h-full"
                        />
                    </div>
                    <span className="font-mono text-sm">{value}</span>
                </div>
            </div>

            <div className="space-y-4">
                <h3 className="text-lg font-semibold">
                    {t('prime_slider.with_input')}
                </h3>
                <div className="flex items-center gap-4">
                    <input
                        type="number"
                        value={value}
                        onChange={(e) => setValue(Number(e.target.value))}
                        min={0}
                        max={100}
                        className="w-24 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                    />
                    <Slider
                        value={value}
                        onChange={(e) => setValue(e.value as number)}
                        className="flex-1"
                    />
                </div>
            </div>
        </div>
    );
}
