import AppearanceTabs from '@/components/appearance-tabs';
import HeadingSmall from '@/components/heading-small';
import type { LocaleCode } from '@/components/locale-dropdown';
import LocaleTabs from '@/components/locale-tabs';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useAppearance } from '@/hooks/use-appearance';
import { useTranslations } from '@/hooks/use-translations';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import appearance, { edit as editAppearance } from '@/routes/appearance/index';
import type { SharedData } from '@/types';
import { type BreadcrumbItem } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { useCallback } from 'react';

const COMMON_TIMEZONES = [
    'UTC',
    'Europe/Rome',
    'Europe/Madrid',
    'Europe/London',
    'Europe/Paris',
    'Europe/Berlin',
    'America/New_York',
    'America/Los_Angeles',
];

const DATE_FORMATS = [
    { value: 'd/m/Y', labelKey: 'settings.appearance.date_format_dmy' },
    { value: 'm/d/Y', labelKey: 'settings.appearance.date_format_mdy' },
    { value: 'Y-m-d', labelKey: 'settings.appearance.date_format_ymd' },
] as const;

export default function Appearance({
    preferences = {},
}: {
    preferences?: {
        theme?: string;
        locale?: string;
        timezone?: string;
        date_format?: string;
    };
}) {
    const { t } = useTranslations();
    const { locale } = usePage<SharedData>().props;
    const { updateAppearance } = useAppearance();
    const currentLocale: LocaleCode =
        (preferences?.locale as LocaleCode) ||
        (locale === 'it' || locale === 'es' || locale === 'en' ? locale : 'it');

    const savePreferences = useCallback((updates: Record<string, string>) => {
        router.patch(appearance.update.url(), updates, {
            preserveScroll: true,
        });
    }, []);

    const handleLocaleChange = useCallback(
        (newLocale: LocaleCode) => {
            savePreferences({
                locale: newLocale,
                theme: preferences?.theme || 'system',
                timezone: preferences?.timezone || 'UTC',
                date_format: preferences?.date_format || 'd/m/Y',
            });
        },
        [preferences, savePreferences],
    );

    const handleThemeChange = useCallback(
        (theme: 'light' | 'dark' | 'system') => {
            updateAppearance(theme);
            savePreferences({
                theme,
                locale: preferences?.locale || currentLocale,
                timezone: preferences?.timezone || 'UTC',
                date_format: preferences?.date_format || 'd/m/Y',
            });
        },
        [preferences, currentLocale, savePreferences, updateAppearance],
    );

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: t('settings.appearance.title'),
            href: editAppearance().url,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('settings.appearance.title')} />

            <h1 className="sr-only">{t('settings.appearance.title')}</h1>

            <SettingsLayout>
                <div className="space-y-6">
                    <HeadingSmall
                        title={t('settings.appearance.title')}
                        description={t('settings.appearance.description')}
                    />

                    <div className="space-y-2">
                        <label className="text-sm font-medium">
                            {t('settings.appearance.language_label')}
                        </label>
                        <p className="text-sm text-muted-foreground">
                            {t('settings.appearance.language_description')}
                        </p>
                        <LocaleTabs
                            currentLocale={currentLocale}
                            onLocaleChange={handleLocaleChange}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">
                            {t('settings.appearance.theme_label')}
                        </label>
                        <p className="text-sm text-muted-foreground">
                            {t('settings.appearance.theme_description')}
                        </p>
                        <AppearanceTabs
                            value={
                                (preferences?.theme as
                                    | 'light'
                                    | 'dark'
                                    | 'system') || 'system'
                            }
                            onThemeChange={handleThemeChange}
                        />
                    </div>

                    <div className="space-y-2">
                        <label
                            htmlFor="timezone"
                            className="text-sm font-medium"
                        >
                            {t('settings.appearance.timezone_label')}
                        </label>
                        <p className="text-sm text-muted-foreground">
                            {t('settings.appearance.timezone_description')}
                        </p>
                        <Select
                            value={preferences?.timezone || 'UTC'}
                            onValueChange={(value) =>
                                savePreferences({
                                    timezone: value,
                                    theme: preferences?.theme || 'system',
                                    locale:
                                        preferences?.locale || currentLocale,
                                    date_format:
                                        preferences?.date_format || 'd/m/Y',
                                })
                            }
                        >
                            <SelectTrigger
                                id="timezone"
                                className="w-full max-w-xs"
                            >
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {COMMON_TIMEZONES.map((tz) => (
                                    <SelectItem key={tz} value={tz}>
                                        {tz}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <label
                            htmlFor="date_format"
                            className="text-sm font-medium"
                        >
                            {t('settings.appearance.date_format_label')}
                        </label>
                        <p className="text-sm text-muted-foreground">
                            {t('settings.appearance.date_format_description')}
                        </p>
                        <Select
                            value={preferences?.date_format || 'd/m/Y'}
                            onValueChange={(value) =>
                                savePreferences({
                                    date_format: value,
                                    theme: preferences?.theme || 'system',
                                    locale:
                                        preferences?.locale || currentLocale,
                                    timezone: preferences?.timezone || 'UTC',
                                })
                            }
                        >
                            <SelectTrigger
                                id="date_format"
                                className="w-full max-w-xs"
                            >
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {DATE_FORMATS.map((opt) => (
                                    <SelectItem
                                        key={opt.value}
                                        value={opt.value}
                                    >
                                        {t(opt.labelKey)}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </SettingsLayout>
        </AppLayout>
    );
}
