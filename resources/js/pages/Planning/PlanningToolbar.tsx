import { CalendarDays, ChevronLeft, ChevronRight } from 'lucide-react';
import { memo } from 'react';
import type { RangeMode, ZoomLevel } from './types';

export type PlanningToolbarProps = {
    currentDate: string;
    today: string;
    rangeMode: RangeMode;
    zoomLevel: ZoomLevel;
    loading: boolean;
    goPrev: () => void;
    goNext: () => void;
    goToday: () => void;
    onSetRangeMode: (mode: RangeMode) => void;
    onSetZoomLevel: (level: ZoomLevel) => void;
    formatDateRangeLabel: (currentDate: string, rangeMode: RangeMode) => string;
};

const PlanningToolbar = memo(function PlanningToolbar(
    props: PlanningToolbarProps,
) {
    const {
        currentDate,
        today,
        rangeMode,
        zoomLevel,
        loading,
        goPrev,
        goNext,
        goToday,
        onSetRangeMode,
        onSetZoomLevel,
        formatDateRangeLabel,
    } = props;
    return (
        <header
            role="toolbar"
            aria-label="Controlli pianificazione"
            className="relative flex flex-wrap items-center gap-x-4 gap-y-3 rounded-lg border border-border/80 bg-muted/20 px-4 py-3 shadow-sm"
        >
            <div className="flex items-center gap-1">
                <button
                    type="button"
                    onClick={goPrev}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border bg-background text-foreground shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
                    title={
                        rangeMode === 'day'
                            ? 'Giorno precedente'
                            : rangeMode === 'week'
                              ? 'Settimana precedente'
                              : 'Mese precedente'
                    }
                    disabled={loading || currentDate <= today}
                >
                    <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                    type="button"
                    onClick={goNext}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border bg-background text-foreground shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
                    title={
                        rangeMode === 'day'
                            ? 'Giorno successivo'
                            : rangeMode === 'week'
                              ? 'Settimana successiva'
                              : 'Mese successivo'
                    }
                    disabled={loading}
                >
                    <ChevronRight className="h-4 w-4" />
                </button>
                <button
                    type="button"
                    onClick={goToday}
                    className="ml-2 rounded-md border border-primary/40 bg-primary/10 px-3 py-2 text-sm font-medium text-primary shadow-sm transition-colors hover:bg-primary/20 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none"
                    disabled={loading}
                    title="Vai a oggi"
                >
                    Oggi
                </button>
            </div>
            <div className="hidden h-6 w-px bg-border sm:block" aria-hidden />
            <div className="flex min-w-0 shrink-0 items-center gap-2">
                <CalendarDays className="h-4 w-4 shrink-0 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                    {rangeMode === 'day' ? 'Data:' : 'Range:'}{' '}
                    <strong className="font-semibold text-foreground">
                        {formatDateRangeLabel(currentDate, rangeMode)}
                    </strong>
                </span>
            </div>
            <div className="hidden h-6 w-px bg-border sm:block" aria-hidden />
            <div className="ml-auto flex flex-wrap items-center gap-x-4 gap-y-2">
                {rangeMode === 'day' ? (
                    <div className="flex items-center gap-2">
                        <span className="text-[11px] font-medium tracking-wider text-muted-foreground uppercase">
                            Zoom
                        </span>
                        <div
                            className="inline-flex items-center gap-px rounded-md border border-border bg-background p-0.5 text-xs font-medium shadow-sm"
                            role="group"
                            aria-label="Zoom temporale"
                        >
                            <button
                                type="button"
                                className={`rounded px-2 py-1.5 transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:outline-none ${
                                    zoomLevel === 'hour'
                                        ? 'bg-accent text-accent-foreground'
                                        : 'text-muted-foreground hover:bg-muted'
                                }`}
                                onClick={() => onSetZoomLevel('hour')}
                                disabled={loading}
                                aria-pressed={zoomLevel === 'hour'}
                            >
                                Ore
                            </button>
                            <button
                                type="button"
                                className={`rounded px-2 py-1.5 transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:outline-none ${
                                    zoomLevel === 'quarter'
                                        ? 'bg-accent text-accent-foreground'
                                        : 'text-muted-foreground hover:bg-muted'
                                }`}
                                onClick={() => onSetZoomLevel('quarter')}
                                disabled={loading}
                                aria-pressed={zoomLevel === 'quarter'}
                            >
                                Quarti
                            </button>
                        </div>
                    </div>
                ) : null}
                <div className="flex items-center gap-2">
                    <span className="text-[11px] font-medium tracking-wider text-muted-foreground uppercase">
                        Periodo
                    </span>
                    <div
                        className="inline-flex items-center gap-px rounded-md border border-border bg-background p-0.5 text-xs font-medium shadow-sm"
                        role="group"
                        aria-label="Periodo di visualizzazione"
                    >
                        <button
                            type="button"
                            className={`rounded px-2 py-1.5 transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:outline-none ${
                                rangeMode === 'day'
                                    ? 'bg-accent text-accent-foreground'
                                    : 'text-muted-foreground hover:bg-muted'
                            }`}
                            onClick={() => onSetRangeMode('day')}
                            disabled={loading}
                            aria-pressed={rangeMode === 'day'}
                        >
                            Diaria
                        </button>
                        <button
                            type="button"
                            className={`rounded px-2 py-1.5 transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:outline-none ${
                                rangeMode === 'week'
                                    ? 'bg-accent text-accent-foreground'
                                    : 'text-muted-foreground hover:bg-muted'
                            }`}
                            onClick={() => onSetRangeMode('week')}
                            disabled={loading}
                            aria-pressed={rangeMode === 'week'}
                        >
                            Settimanale
                        </button>
                        <button
                            type="button"
                            className={`rounded px-2 py-1.5 transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:outline-none ${
                                rangeMode === 'month'
                                    ? 'bg-accent text-accent-foreground'
                                    : 'text-muted-foreground hover:bg-muted'
                            }`}
                            onClick={() => onSetRangeMode('month')}
                            disabled={loading}
                            aria-pressed={rangeMode === 'month'}
                        >
                            Mensile
                        </button>
                    </div>
                </div>
            </div>
            {loading ? (
                <div
                    className="pointer-events-none absolute inset-x-0 top-1/2 flex -translate-y-1/2 justify-center"
                    aria-live="polite"
                >
                    <div className="flex items-center gap-1 rounded-full bg-background/80 px-2 py-1 text-[11px] text-muted-foreground shadow-sm ring-1 ring-border/60 transition-opacity duration-150">
                        <span className="inline-flex h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
                        <span>Aggiornamento…</span>
                    </div>
                </div>
            ) : null}
        </header>
    );
});

export default PlanningToolbar;
