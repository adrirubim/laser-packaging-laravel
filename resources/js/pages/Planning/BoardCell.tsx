import type { ReactNode } from 'react';

export default function BoardCell({
    value,
    children,
}: {
    value: number;
    children?: ReactNode;
}) {
    if (value <= 0) {
        return (
            <div className="flex h-10 items-center justify-center rounded-md border border-dashed border-muted bg-background/40 text-xs text-muted-foreground">
                {children ?? '-'}
            </div>
        );
    }

    return (
        <div className="flex h-10 items-center justify-center rounded-md border border-emerald-500/60 bg-emerald-500/80 px-2 text-xs font-semibold text-emerald-50 shadow-sm">
            {value}
        </div>
    );
}
