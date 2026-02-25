import { useTranslations } from '@/hooks/use-translations';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';

interface FilterChipProps {
    label: string;
    value: string | number;
    onRemove: () => void;
    className?: string;
}

/**
 * Componente riutilizzabile per mostrare chip di filtri attivi
 */
export function FilterChip({
    label,
    value,
    onRemove,
    className,
}: FilterChipProps) {
    const { t } = useTranslations();
    return (
        <span
            className={cn(
                'inline-flex items-center gap-1 rounded-full bg-muted px-2 py-1 text-xs',
                className,
            )}
        >
            {label}: {value}
            <button
                onClick={onRemove}
                className="transition-opacity hover:opacity-70"
                aria-label={t('common.remove_filter', { label })}
            >
                <X className="h-3 w-3" />
            </button>
        </span>
    );
}
