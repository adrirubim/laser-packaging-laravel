import AppearanceTabs from '@/components/appearance-tabs';
import HeadingSmall from '@/components/heading-small';
import type { LocaleCode } from '@/components/locale-dropdown';
import LocaleTabs from '@/components/locale-tabs';
import { useTranslations } from '@/hooks/use-translations';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { edit as editAppearance } from '@/routes/appearance/index';
import type { SharedData } from '@/types';
import { type BreadcrumbItem } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';

export default function Appearance() {
    const { t } = useTranslations();
    const { locale } = usePage<SharedData>().props;
    const currentLocale: LocaleCode =
        locale === 'it' || locale === 'es' || locale === 'en' ? locale : 'it';

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
                            onLocaleChange={(newLocale) => {
                                router.post(
                                    '/locale',
                                    { locale: newLocale },
                                    { preserveScroll: true },
                                );
                            }}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">
                            {t('settings.appearance.theme_label')}
                        </label>
                        <p className="text-sm text-muted-foreground">
                            {t('settings.appearance.theme_description')}
                        </p>
                        <AppearanceTabs />
                    </div>
                </div>
            </SettingsLayout>
        </AppLayout>
    );
}
