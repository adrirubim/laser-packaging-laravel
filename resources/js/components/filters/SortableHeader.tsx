import { cn } from '@/lib/utils';
import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react';

interface SortableHeaderProps {
    column: string;
    currentSort?: string;
    currentOrder?: string;
    onSort: (column: string) => void;
    children: React.ReactNode;
    className?: string;
    title?: string;
}

/**
 * Componente riutilizzabile per intestazioni di tabella ordinabili
 */
export function SortableHeader({
    column,
    currentSort,
    currentOrder,
    onSort,
    children,
    className,
    title,
}: SortableHeaderProps) {
    const getSortIcon = () => {
        if (currentSort !== column) {
            return <ArrowUpDown className="ml-1 h-3 w-3 opacity-50" />;
        }
        return currentOrder === 'asc' ? (
            <ArrowUp className="ml-1 h-3 w-3" />
        ) : (
            <ArrowDown className="ml-1 h-3 w-3" />
        );
    };

    return (
        <th
            className={cn(
                'cursor-pointer border-b px-3 py-2 font-medium transition-colors hover:bg-muted/50',
                className,
            )}
            onClick={() => onSort(column)}
            title={title || `Clicca per ordinare per ${children}`}
        >
            <div className="flex items-center">
                {children}
                {getSortIcon()}
            </div>
        </th>
    );
}
