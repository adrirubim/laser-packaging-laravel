import Heading from '#app/components/heading';
import { Button } from '#app/components/ui/button';
import { Separator } from '#app/components/ui/separator';
import { useActiveUrl } from '#app/hooks/use-active-url';
import { useTranslations } from '#app/hooks/use-translations';
import { cn, toUrl } from '#app/lib/utils';
import { edit as editAppearance } from '#app/routes/appearance/index';
import { edit } from '#app/routes/profile/index';
import { index as sessionsIndex } from '#app/routes/sessions/index';
import { show } from '#app/routes/two-factor/index';
import { edit as editPassword } from '#app/routes/user-password/index';
import { Link } from '@inertiajs/react';
import { type PropsWithChildren } from 'react';

const sidebarNavItems: { titleKey: string; href: ReturnType<typeof edit> }[] = [
    { titleKey: 'settings.nav_profile', href: edit() },
    { titleKey: 'settings.nav_password', href: editPassword() },
    { titleKey: 'settings.nav_two_factor', href: show() },
    { titleKey: 'settings.nav_appearance', href: editAppearance() },
    { titleKey: 'settings.nav_sessions', href: sessionsIndex() },
];

export default function SettingsLayout({ children }: PropsWithChildren) {
    const { t } = useTranslations();
    const { urlIsActive } = useActiveUrl();

    // When server-side rendering, we only render the layout on the client...
    if (typeof window === 'undefined') {
        return null;
    }

    return (
        <div className="px-4 py-6">
            <Heading
                title={t('settings.title')}
                description={t('settings.description')}
            />

            <div className="flex flex-col lg:flex-row lg:space-x-12">
                <aside className="w-full max-w-xl lg:w-48">
                    <nav
                        className="flex flex-col space-y-1 space-x-0"
                        aria-label={t('settings.title')}
                    >
                        {sidebarNavItems.map((item, index) => (
                            <Button
                                key={`${toUrl(item.href)}-${index}`}
                                size="sm"
                                variant="ghost"
                                asChild
                                className={cn('w-full justify-start', {
                                    'bg-muted': urlIsActive(item.href),
                                })}
                            >
                                <Link href={item.href}>{t(item.titleKey)}</Link>
                            </Button>
                        ))}
                    </nav>
                </aside>

                <Separator className="my-6 lg:hidden" />

                <div className="flex-1 md:max-w-2xl">
                    <section className="max-w-xl space-y-12">
                        {children}
                    </section>
                </div>
            </div>
        </div>
    );
}
