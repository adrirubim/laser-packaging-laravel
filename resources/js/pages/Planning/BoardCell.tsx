import { useTranslations } from '@/hooks/use-translations';
import { memo, type ReactNode } from 'react';

function BoardCell({
    value,
    children,
}: {
    value: number;
    children?: ReactNode;
}) {
    const { t } = useTranslations();
    if (value <= 0) {
        return (
            <div className="flex h-10 items-center justify-center rounded-md border border-dashed border-muted bg-background/40 text-xs text-muted-foreground dark:bg-muted/30">
                {children ?? t('common.empty_value')}
            </div>
        );
    }

    return (
        <div className="flex h-10 items-center justify-center rounded-md border border-emerald-500/60 bg-emerald-500/80 px-2 text-xs font-semibold text-emerald-50 shadow-sm dark:border-emerald-400/70 dark:bg-emerald-600/90 dark:text-white">
            {value}
        </div>
    );
}

export default memo(BoardCell);
