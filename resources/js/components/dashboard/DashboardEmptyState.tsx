import { useTranslations } from '@/hooks/use-translations';
import { PackageX } from 'lucide-react';

type DashboardEmptyStateProps = {
    message?: string;
};

export function DashboardEmptyState({ message }: DashboardEmptyStateProps) {
    const { t } = useTranslations();
    const displayMessage = message ?? t('dashboard.chart_no_data');
    return (
        <div className="flex h-64 flex-col items-center justify-center gap-2 text-center text-foreground/70">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted/40">
                <PackageX className="h-6 w-6 opacity-70" aria-hidden="true" />
            </div>
            <p className="text-sm font-medium">{displayMessage}</p>
        </div>
    );
}
