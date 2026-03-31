import { Alert, AlertDescription, AlertTitle } from '#app/components/ui/alert';
import { useTranslations } from '#app/hooks/use-translations';
import { AlertCircleIcon } from 'lucide-react';

export default function AlertError({
    errors,
    title,
}: {
    errors: string[];
    title?: string;
}) {
    const { t } = useTranslations();
    return (
        <Alert variant="destructive">
            <AlertCircleIcon />
            <AlertTitle>{title ?? t('common.something_went_wrong')}</AlertTitle>
            <AlertDescription>
                <ul className="list-inside list-disc text-sm">
                    {Array.from(new Set(errors)).map((error, index) => (
                        <li key={index}>{error}</li>
                    ))}
                </ul>
            </AlertDescription>
        </Alert>
    );
}
