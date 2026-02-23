import { memo } from 'react';
import type { RangeMode, ZoomLevel } from './types';

export type PlanningLegendProps = {
    rangeMode: RangeMode;
    zoomLevel: ZoomLevel;
};

const PlanningLegend = memo(function PlanningLegend({
    rangeMode,
    zoomLevel,
}: PlanningLegendProps) {
    return (
        <section
            aria-labelledby="planning-legend-title"
            className="rounded-lg border border-border/60 bg-muted/20"
        >
            <details className="group/details" open>
                <summary
                    id="planning-legend-title"
                    className="flex cursor-pointer list-none flex-wrap items-center gap-x-4 gap-y-2 px-3 py-2 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground [&::-webkit-details-marker]:hidden"
                >
                    <span>Legenda</span>
                    <span className="inline-flex size-5 items-center justify-center rounded border border-border text-[10px] transition-transform group-open/details:rotate-180 sm:hidden">
                        ▼
                    </span>
                </summary>
                <div className="flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-border/40 bg-muted/30 px-3 py-2.5 text-xs">
                    <dl className="flex flex-wrap items-center gap-x-5 gap-y-2">
                        <div className="flex items-center gap-2">
                            <dt className="sr-only">Occupato</dt>
                            <dd className="flex items-center gap-1.5">
                                <span
                                    className="size-4 shrink-0 rounded border border-emerald-500/60 bg-emerald-500/80 dark:border-emerald-400/70 dark:bg-emerald-600/90"
                                    aria-hidden
                                />
                                <span>Verde = occupato (addetti)</span>
                            </dd>
                        </div>
                        <div className="flex items-center gap-2">
                            <dt className="sr-only">Libero</dt>
                            <dd className="flex items-center gap-1.5">
                                <span
                                    className="size-4 shrink-0 rounded border border-dashed border-muted bg-background/40 dark:bg-muted/30"
                                    aria-hidden
                                />
                                <span>Grigio = libero</span>
                            </dd>
                        </div>
                        <div className="flex items-center gap-2">
                            <dt className="sr-only">Deficit / overdue</dt>
                            <dd className="flex items-center gap-1.5">
                                <span
                                    className="size-4 shrink-0 rounded border border-red-500/60 bg-red-500/80 dark:border-red-400/70 dark:bg-red-600/90"
                                    aria-hidden
                                />
                                <span>Rosso = deficit / celle overdue</span>
                            </dd>
                        </div>
                        <div className="flex items-center gap-2">
                            <dt className="sr-only">Deadline</dt>
                            <dd className="flex items-center gap-1.5">
                                <span
                                    className="size-4 shrink-0 border-r-2 border-amber-500 bg-transparent px-1 dark:border-amber-400"
                                    aria-hidden
                                />
                                <span>Bordo ambra = deadline consegna</span>
                            </dd>
                        </div>
                        {rangeMode !== 'month' && zoomLevel === 'hour' ? (
                            <div className="flex items-center gap-2">
                                <dt className="sr-only">Valori misti</dt>
                                <dd className="text-muted-foreground">
                                    * = valori misti (vista ore)
                                </dd>
                            </div>
                        ) : null}
                    </dl>
                    <div className="mt-1 text-[11px] text-muted-foreground">
                        Suggerimenti tastiera: Tab / Enter per spostarsi tra
                        celle, Esc per uscire dalla modifica, Shift + rotella =
                        scroll orizzontale.
                    </div>
                </div>
            </details>
        </section>
    );
});

export default PlanningLegend;
