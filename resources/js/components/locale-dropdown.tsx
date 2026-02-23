import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useTranslations } from '@/hooks/use-translations';
import { LOCALES, type LocaleCode } from '@/lib/locales';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

export type { LocaleCode };

/** SVG flags 3:2, consistent across trigger and dropdown */
export function FlagIcon({
    code,
    className,
}: {
    code: LocaleCode;
    className?: string;
}) {
    const c = cn('shrink-0 overflow-hidden rounded-[2px]', className);
    const viewBox = '0 0 3 2';
    const props = { viewBox, 'aria-hidden': true as const };

    if (code === 'it') {
        return (
            <svg className={c} {...props}>
                <rect width="1" height="2" fill="#009246" />
                <rect x="1" width="1" height="2" fill="#fff" />
                <rect x="2" width="1" height="2" fill="#CE2B37" />
            </svg>
        );
    }
    if (code === 'es') {
        return (
            <svg className={c} {...props}>
                <rect width="3" height="0.5" fill="#C60B1E" />
                <rect y="0.5" width="3" height="1" fill="#FFC400" />
                <rect y="1.5" width="3" height="0.5" fill="#C60B1E" />
            </svg>
        );
    }
    // GB (en) – Union Jack simplified
    return (
        <svg className={c} {...props}>
            <rect width="3" height="2" fill="#012169" />
            <path
                d="M0 0 L3 2 M3 0 L0 2"
                stroke="#fff"
                strokeWidth="0.5"
                fill="none"
            />
            <rect x="1.25" y="0" width="0.5" height="2" fill="#C8102E" />
            <rect x="0" y="0.75" width="3" height="0.5" fill="#C8102E" />
            <path
                d="M0 0 L3 2 M3 0 L0 2"
                stroke="#C8102E"
                strokeWidth="0.2"
                fill="none"
            />
        </svg>
    );
}

export default function LocaleDropdown({
    currentLocale = 'it',
    onLocaleChange,
    className,
}: {
    currentLocale?: LocaleCode;
    onLocaleChange?: (locale: LocaleCode) => void;
    className?: string;
}) {
    const { t } = useTranslations();
    const current = LOCALES.find((l) => l.code === currentLocale) ?? LOCALES[0];
    const label = t('settings.appearance.language_label') || 'Language';

    return (
        <div className={cn('relative', className)}>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="ghost"
                        size="icon"
                        className={cn(
                            'size-9 rounded-full border border-border bg-background shadow-sm',
                            'hover:border-muted-foreground/20 hover:bg-muted',
                            'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                            'transition-colors',
                        )}
                        aria-label={label}
                        aria-haspopup="menu"
                    >
                        <FlagIcon code={current.code} className="size-5" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                    align="end"
                    sideOffset={8}
                    className="min-w-[11rem] py-1"
                >
                    <DropdownMenuLabel className="px-2 py-1.5 text-xs font-medium tracking-wider text-muted-foreground uppercase">
                        {label}
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {LOCALES.map((loc) => {
                        const isSelected = currentLocale === loc.code;
                        return (
                            <DropdownMenuItem
                                key={loc.code}
                                aria-selected={isSelected}
                                onClick={() => onLocaleChange?.(loc.code)}
                                className="flex cursor-pointer items-center gap-2.5 py-2"
                            >
                                <span
                                    className="flex size-6 shrink-0 items-center justify-center rounded-sm border border-border bg-muted/50 p-0.5"
                                    aria-hidden
                                >
                                    <FlagIcon
                                        code={loc.code}
                                        className="size-full"
                                    />
                                </span>
                                <span className="flex-1 font-medium">
                                    {loc.label}
                                </span>
                                {isSelected && (
                                    <Check
                                        className="size-4 shrink-0 text-primary"
                                        aria-hidden
                                    />
                                )}
                            </DropdownMenuItem>
                        );
                    })}
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}
