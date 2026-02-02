import { Label } from '@/components/ui/label';
import * as React from 'react';

type FormLabelProps = {
    htmlFor?: string;
    required?: boolean;
    children: React.ReactNode;
    className?: string;
};

export function FormLabel({
    htmlFor,
    required,
    children,
    className,
}: FormLabelProps) {
    return (
        <Label
            htmlFor={htmlFor}
            className={`flex items-center gap-1 ${className || ''}`}
        >
            {children}
            {required && <span className="text-destructive">*</span>}
        </Label>
    );
}
