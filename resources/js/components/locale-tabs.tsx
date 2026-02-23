import { FlagIcon, type LocaleCode } from '@/components/locale-dropdown';
import { useTranslations } from '@/hooks/use-translations';
import { LOCALES } from '@/lib/locales';
import { cn } from '@/lib/utils';
import { type HTMLAttributes } from 'react';

type LocaleTabsProps = HTMLAttributes<HTMLDivElement> & {
    currentLocale: LocaleCode;
    onLocaleChange: (locale: LocaleCode) => void;
};

/**
 * Settings-style language selector: all options visible in a row (like theme Light/Dark/System).
 * Use in settings/appearance; use LocaleDropdown in header/welcome for a compact trigger.
 */
export default function LocaleTabs({
    currentLocale,
    onLocaleChange,
    className = '',
    ...props
}: LocaleTabsProps) {
    const { t } = useTranslations();
    return (
        <div
            className={cn(
                'inline-flex gap-1 rounded-lg bg-neutral-100 p-1 dark:bg-neutral-800',
                className,
            )}
            role="radiogroup"
            aria-label={t('settings.appearance.language_label') || 'Language'}
            {...props}
        >
            {LOCALES.map((loc) => {
                const isSelected = currentLocale === loc.code;
                return (
                    <button
                        key={loc.code}
                        type="button"
                        role="radio"
                        aria-checked={isSelected}
                        onClick={() => onLocaleChange(loc.code)}
                        className={cn(
                            'flex items-center gap-2 rounded-md px-3.5 py-2 transition-colors',
                            isSelected
                                ? 'bg-white shadow-sm dark:bg-neutral-700 dark:text-neutral-100'
                                : 'text-neutral-500 hover:bg-neutral-200/60 hover:text-black dark:text-neutral-400 dark:hover:bg-neutral-700/60',
                        )}
                    >
                        <span
                            className="flex size-5 shrink-0 items-center justify-center overflow-hidden rounded-[2px]"
                            aria-hidden
                        >
                            <FlagIcon code={loc.code} className="size-full" />
                        </span>
                        <span className="text-sm font-medium">{loc.label}</span>
                    </button>
                );
            })}
        </div>
    );
}
