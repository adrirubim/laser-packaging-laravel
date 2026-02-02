import InputError from '@/components/input-error';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ReactNode } from 'react';

type OfferFormFieldProps = {
    label: string;
    name: string;
    type?: 'text' | 'textarea' | 'number' | 'file';
    required?: boolean;
    placeholder?: string;
    defaultValue?: string | number;
    value?: string;
    onChange?: (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => void;
    error?: string;
    helpText?: string;
    maxLength?: number;
    min?: number;
    step?: number;
    disabled?: boolean;
    accept?: string;
    rows?: number;
    className?: string;
    children?: ReactNode;
};

export default function OfferFormField({
    label,
    name,
    type = 'text',
    required = false,
    placeholder,
    defaultValue,
    value,
    onChange,
    error,
    helpText,
    maxLength,
    min,
    step,
    disabled,
    accept,
    rows = 3,
    className,
    children,
}: OfferFormFieldProps) {
    const inputId = `field-${name}`;
    const helpId = `${inputId}-help`;

    return (
        <div className="grid gap-2">
            {children || (
                <Label htmlFor={inputId}>
                    {label} {required && '*'}
                </Label>
            )}
            {type === 'textarea' ? (
                <Textarea
                    id={inputId}
                    name={name}
                    defaultValue={defaultValue as string}
                    value={value}
                    onChange={onChange}
                    required={required}
                    placeholder={placeholder}
                    rows={rows}
                    disabled={disabled}
                    maxLength={maxLength}
                    aria-describedby={helpText ? helpId : undefined}
                    className={className}
                />
            ) : (
                <Input
                    id={inputId}
                    name={name}
                    type={type}
                    defaultValue={defaultValue}
                    value={value}
                    onChange={onChange}
                    required={required}
                    placeholder={placeholder}
                    disabled={disabled}
                    maxLength={maxLength}
                    min={min}
                    step={step}
                    accept={accept}
                    aria-describedby={helpText ? helpId : undefined}
                    className={className}
                />
            )}
            {helpText && (
                <p id={helpId} className="text-xs text-muted-foreground">
                    {helpText}
                </p>
            )}
            {error && <InputError message={error} />}
        </div>
    );
}
