import type { LocaleCode } from '@/components/locale-dropdown';
import LocaleDropdown from '@/components/locale-dropdown';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { useTranslations } from '@/hooks/use-translations';
import { dashboard, login, register } from '@/routes';
import { type SharedData } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    ArrowRight,
    BarChart3,
    FileText,
    Package,
    Settings,
    Shield,
    ShoppingCart,
    Sparkles,
    TrendingUp,
    Users,
    Zap,
} from 'lucide-react';

const FEATURES = [
    {
        icon: FileText,
        titleKey: 'welcome.feature_0_title',
        descKey: 'welcome.feature_0_desc',
    },
    {
        icon: ShoppingCart,
        titleKey: 'welcome.feature_1_title',
        descKey: 'welcome.feature_1_desc',
    },
    {
        icon: Package,
        titleKey: 'welcome.feature_2_title',
        descKey: 'welcome.feature_2_desc',
    },
    {
        icon: Users,
        titleKey: 'welcome.feature_3_title',
        descKey: 'welcome.feature_3_desc',
    },
    {
        icon: BarChart3,
        titleKey: 'welcome.feature_4_title',
        descKey: 'welcome.feature_4_desc',
    },
    {
        icon: Zap,
        titleKey: 'welcome.feature_5_title',
        descKey: 'welcome.feature_5_desc',
    },
] as const;

const BENEFITS = [
    {
        icon: TrendingUp,
        titleKey: 'welcome.benefit_0_title',
        descKey: 'welcome.benefit_0_desc',
    },
    {
        icon: Shield,
        titleKey: 'welcome.benefit_1_title',
        descKey: 'welcome.benefit_1_desc',
    },
    {
        icon: Settings,
        titleKey: 'welcome.benefit_2_title',
        descKey: 'welcome.benefit_2_desc',
    },
] as const;

export type WelcomePageProps = {
    canRegister?: boolean;
    url?: string;
};

export default function Welcome({ canRegister = true, url }: WelcomePageProps) {
    const { auth, locale } = usePage<SharedData>().props;
    const { t } = useTranslations();
    const currentLocale: LocaleCode =
        locale === 'it' || locale === 'es' || locale === 'en' ? locale : 'it';

    return (
        <>
            <Head title={t('welcome.page_title')}>
                <meta
                    name="description"
                    content={t('welcome.meta_description')}
                />
                <meta property="og:title" content={t('welcome.page_title')} />
                <meta
                    property="og:description"
                    content={t('welcome.meta_description')}
                />
                <meta property="og:type" content="website" />
                {url && <meta property="og:url" content={url} />}
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link
                    rel="preload"
                    href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600&display=swap"
                    as="style"
                />
                <link
                    href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600&display=swap"
                    rel="stylesheet"
                />
            </Head>
            <div className="flex min-h-screen flex-col bg-gradient-to-b from-background to-muted/50 text-foreground">
                {/* Skip link */}
                <a
                    href="#main-content"
                    className="absolute top-4 left-4 z-[100] [margin:-1px] size-px overflow-hidden border-0 p-0 whitespace-nowrap [-webkit-clip-path:inset(50%)] [clip-path:inset(50%)] focus:[margin:0] focus:size-auto focus:overflow-visible focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground focus:ring-2 focus:ring-ring focus:outline-none focus:[-webkit-clip-path:unset] focus:[clip-path:unset]"
                >
                    {t('welcome.skip_to_content')}
                </a>

                {/* Header */}
                <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-sm">
                    <nav
                        className="container mx-auto flex items-center justify-between px-6 py-4"
                        aria-label={t('welcome.app_name')}
                    >
                        <div className="flex items-center gap-2">
                            <Package className="h-6 w-6 text-primary" />
                            <span className="text-lg font-semibold">
                                {t('welcome.app_name')}
                            </span>
                        </div>
                        <div className="flex items-center gap-3">
                            <LocaleDropdown
                                currentLocale={currentLocale}
                                onLocaleChange={(newLocale) => {
                                    router.post(
                                        '/locale',
                                        { locale: newLocale },
                                        { preserveScroll: true },
                                    );
                                }}
                            />
                            {auth.user ? (
                                <Link
                                    href={dashboard().url}
                                    prefetch
                                    aria-label={t(
                                        'welcome.header.dashboard_aria',
                                    )}
                                    className="inline-flex items-center gap-2 rounded-md border border-border bg-primary px-5 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                                >
                                    <BarChart3 className="h-4 w-4" />
                                    {t('nav.dashboard')}
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href={login().url}
                                        prefetch
                                        aria-label={t(
                                            'welcome.header.login_aria',
                                        )}
                                        className="inline-block rounded-md border border-transparent px-5 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
                                    >
                                        {t('welcome.header.login')}
                                    </Link>
                                    {canRegister && (
                                        <Link
                                            href={register().url}
                                            prefetch
                                            aria-label={t(
                                                'welcome.header.register_aria',
                                            )}
                                            className="inline-flex items-center gap-2 rounded-md border border-border bg-primary px-5 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                                        >
                                            {t('welcome.header.register')}
                                            <ArrowRight className="h-4 w-4" />
                                        </Link>
                                    )}
                                </>
                            )}
                        </div>
                    </nav>
                </header>

                <main id="main-content">
                    {/* Hero Section */}
                    <section
                        className="container mx-auto px-6 py-16 lg:py-24"
                        aria-labelledby="hero-heading"
                    >
                        <div className="mx-auto max-w-4xl text-center">
                            <Badge
                                className="mb-6 animate-in duration-500 fade-in"
                                variant="secondary"
                            >
                                <Sparkles
                                    className="mr-2 h-4 w-4"
                                    aria-hidden="true"
                                />
                                {t('welcome.badge')}
                            </Badge>
                            <h1
                                id="hero-heading"
                                className="mb-6 animate-in text-4xl font-bold duration-700 fade-in slide-in-from-bottom md:text-5xl lg:text-6xl"
                            >
                                {t('welcome.hero.title')}
                                <span className="mt-2 block text-primary">
                                    {t('welcome.hero.title_primary')}
                                </span>
                            </h1>
                            <p className="mx-auto mb-8 max-w-2xl animate-in text-xl text-muted-foreground delay-200 duration-700 fade-in slide-in-from-bottom md:text-2xl">
                                {t('welcome.hero.subtitle')}
                            </p>
                            {!auth.user && (
                                <div className="mb-12 flex animate-in flex-col items-center justify-center gap-4 delay-400 duration-700 fade-in slide-in-from-bottom sm:flex-row">
                                    <Button size="lg" asChild>
                                        <Link href={login().url} prefetch>
                                            {t('welcome.cta.start')}
                                            <ArrowRight
                                                className="ml-2 h-5 w-5"
                                                aria-hidden="true"
                                            />
                                        </Link>
                                    </Button>
                                    {canRegister && (
                                        <Button
                                            size="lg"
                                            variant="outline"
                                            asChild
                                        >
                                            <Link
                                                href={register().url}
                                                prefetch
                                            >
                                                {t(
                                                    'welcome.cta.create_account',
                                                )}
                                            </Link>
                                        </Button>
                                    )}
                                </div>
                            )}
                        </div>
                    </section>

                    {/* Features Section */}
                    <section
                        className="container mx-auto bg-muted/30 px-6 py-16 lg:py-24"
                        aria-labelledby="features-heading"
                    >
                        <div className="mx-auto max-w-6xl">
                            <div className="mb-12 text-center">
                                <h2
                                    id="features-heading"
                                    className="mb-4 text-3xl font-bold md:text-4xl"
                                >
                                    {t('welcome.features.section_title')}
                                </h2>
                                <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
                                    {t('welcome.features.section_subtitle')}
                                </p>
                            </div>
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                                {FEATURES.map((feature) => {
                                    const Icon = feature.icon;
                                    return (
                                        <Card
                                            key={feature.titleKey}
                                            className="group transition-all hover:border-primary/50 hover:shadow-lg"
                                        >
                                            <CardHeader>
                                                <div className="mb-4 inline-flex items-center justify-center rounded-lg bg-primary/10 p-3 text-primary transition-transform group-hover:scale-110">
                                                    <Icon
                                                        className="h-6 w-6"
                                                        aria-hidden="true"
                                                    />
                                                </div>
                                                <CardTitle>
                                                    {t(feature.titleKey)}
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <CardDescription className="text-foreground/80">
                                                    {t(feature.descKey)}
                                                </CardDescription>
                                            </CardContent>
                                        </Card>
                                    );
                                })}
                            </div>
                        </div>
                    </section>

                    {/* Benefits Section */}
                    <section
                        className="container mx-auto px-6 py-16 lg:py-24"
                        aria-labelledby="benefits-heading"
                    >
                        <div className="mx-auto max-w-6xl">
                            <div className="mb-12 text-center">
                                <h2
                                    id="benefits-heading"
                                    className="mb-4 text-3xl font-bold md:text-4xl"
                                >
                                    {t('welcome.benefits.section_title')}
                                </h2>
                                <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
                                    {t('welcome.benefits.section_subtitle')}
                                </p>
                            </div>
                            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                                {BENEFITS.map((benefit) => {
                                    const Icon = benefit.icon;
                                    return (
                                        <Card
                                            key={benefit.titleKey}
                                            className="text-center"
                                        >
                                            <CardHeader>
                                                <div className="mb-4 inline-flex items-center justify-center rounded-full bg-primary/10 p-4 text-primary">
                                                    <Icon
                                                        className="h-8 w-8"
                                                        aria-hidden="true"
                                                    />
                                                </div>
                                                <CardTitle>
                                                    {t(benefit.titleKey)}
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <CardDescription className="text-foreground/80">
                                                    {t(benefit.descKey)}
                                                </CardDescription>
                                            </CardContent>
                                        </Card>
                                    );
                                })}
                            </div>
                        </div>
                    </section>

                    {/* Stats Section */}
                    <section
                        className="container mx-auto bg-muted/30 px-6 py-16 lg:py-24"
                        aria-labelledby="stats-heading"
                    >
                        <div className="mx-auto max-w-4xl">
                            <h2
                                id="stats-heading"
                                className="mb-12 text-center text-3xl font-bold md:text-4xl"
                            >
                                {t('welcome.stats.section_title')}
                            </h2>
                            <div className="grid grid-cols-1 gap-8 text-center sm:grid-cols-3">
                                <div>
                                    <div className="mb-2 text-3xl font-bold text-primary md:text-4xl">
                                        1017+
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                        {t('welcome.stats.tests')}
                                    </div>
                                </div>
                                <div>
                                    <div className="mb-2 text-3xl font-bold text-primary md:text-4xl">
                                        40
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                        {t('welcome.stats.controllers')}
                                    </div>
                                </div>
                                <div>
                                    <div className="mb-2 text-3xl font-bold text-primary md:text-4xl">
                                        7
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                        {t('welcome.stats.repositories')}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* CTA Section */}
                    {!auth.user && (
                        <section className="container mx-auto px-6 py-16 lg:py-24">
                            <div className="mx-auto max-w-4xl text-center">
                                <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
                                    <CardHeader>
                                        <CardTitle className="text-3xl md:text-4xl">
                                            {t('welcome.cta_section.title')}
                                        </CardTitle>
                                        <CardDescription className="mx-auto max-w-2xl text-lg">
                                            {t('welcome.cta_section.desc')}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                                            <Button size="lg" asChild>
                                                <Link
                                                    href={login().url}
                                                    prefetch
                                                    aria-label={t(
                                                        'welcome.header.login_aria',
                                                    )}
                                                >
                                                    {t('welcome.header.login')}
                                                    <ArrowRight
                                                        className="ml-2 h-5 w-5"
                                                        aria-hidden="true"
                                                    />
                                                </Link>
                                            </Button>
                                            {canRegister && (
                                                <Button
                                                    size="lg"
                                                    variant="outline"
                                                    asChild
                                                >
                                                    <Link
                                                        href={register().url}
                                                        prefetch
                                                        aria-label={t(
                                                            'welcome.header.register_aria',
                                                        )}
                                                    >
                                                        {t(
                                                            'welcome.cta.create_account',
                                                        )}
                                                    </Link>
                                                </Button>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </section>
                    )}
                </main>

                {/* Footer */}
                <footer className="border-t border-border bg-background/80 backdrop-blur-sm">
                    <div className="container mx-auto px-6 py-8">
                        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
                            <div className="flex items-center gap-2">
                                <Package
                                    className="h-5 w-5 text-primary"
                                    aria-hidden="true"
                                />
                                <span className="font-medium">
                                    {t('welcome.app_name')}
                                </span>
                            </div>
                            <div className="flex items-center gap-6 text-sm text-muted-foreground">
                                <span>
                                    © {new Date().getFullYear()}{' '}
                                    {t('welcome.footer.copyright')}
                                </span>
                                <span aria-hidden="true">•</span>
                                <span>{t('welcome.footer.stack')}</span>
                            </div>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}
