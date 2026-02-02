import { Loader2, Search, X } from 'lucide-react';
import { useEffect, useState } from 'react';

type SearchInputProps = {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    isLoading?: boolean;
    debounceMs?: number;
    onClear?: () => void;
    className?: string;
};

export function SearchInput({
    value,
    onChange,
    placeholder = 'Cerca...',
    isLoading = false,
    debounceMs = 500,
    onClear,
    className = '',
}: SearchInputProps) {
    const [localValue, setLocalValue] = useState(value);

    useEffect(() => {
        // Chiamare solo se il valore locale è diverso da quello del server
        if (localValue === value) {
            return;
        }

        const timer = setTimeout(() => {
            onChange(localValue);
        }, debounceMs);

        return () => clearTimeout(timer);
    }, [localValue, debounceMs, onChange, value]);

    useEffect(() => {
        setLocalValue(value);
    }, [value]);

    const handleClear = () => {
        setLocalValue('');
        if (onClear) {
            onClear();
        } else {
            onChange('');
        }
    };

    return (
        <div className={`relative flex-1 ${className}`}>
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-muted-foreground" />
            <input
                type="text"
                value={localValue}
                onChange={(e) => setLocalValue(e.target.value)}
                placeholder={placeholder}
                className="w-full rounded-md border border-input bg-background px-3 py-2 pr-9 pl-9 text-sm shadow-sm focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none"
            />
            {isLoading && (
                <Loader2 className="absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 transform animate-spin text-muted-foreground" />
            )}
            {localValue && !isLoading && (
                <button
                    onClick={handleClear}
                    className="absolute top-1/2 right-3 -translate-y-1/2 transform transition-opacity hover:opacity-70"
                    type="button"
                    aria-label="Cancella Cerca"
                >
                    <X className="h-4 w-4 text-muted-foreground" />
                </button>
            )}
        </div>
    );
}
