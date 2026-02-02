import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react';

type SortableTableHeaderProps = {
    column: string;
    currentSort?: string;
    currentDirection?: 'asc' | 'desc';
    onSort: (column: string) => void;
    children: React.ReactNode;
    className?: string;
};

function renderSortIcon(
    column: string,
    currentSort?: string,
    currentDirection?: 'asc' | 'desc',
) {
    if (currentSort !== column) {
        return <ArrowUpDown className="ml-1 h-3 w-3 opacity-50" />;
    }
    return currentDirection === 'desc' ? (
        <ArrowDown className="ml-1 h-3 w-3" />
    ) : (
        <ArrowUp className="ml-1 h-3 w-3" />
    );
}

export function SortableTableHeader({
    column,
    currentSort,
    currentDirection,
    onSort,
    children,
    className = '',
}: SortableTableHeaderProps) {
    const handleClick = () => {
        onSort(column);
    };

    return (
        <th
            className={`cursor-pointer border-b px-3 py-2 font-medium transition-colors hover:bg-muted/50 ${className}`}
            onClick={handleClick}
        >
            <div className="flex items-center">
                {children}
                {renderSortIcon(column, currentSort, currentDirection)}
            </div>
        </th>
    );
}
