import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { dashboard, login, register } from '@/routes';
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
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

export default function Welcome({
    canRegister = true,
}: {
    canRegister?: boolean;
}) {
    const { auth } = usePage<SharedData>().props;

    const features = [
        {
            icon: FileText,
            title: 'Gestione Offerte',
            description:
                'Amministra offerte, attività, settori e tipi di ordini in modo efficiente.',
        },
        {
            icon: ShoppingCart,
            title: 'Gestione Articoli',
            description:
                'Controllo completo di articoli, categorie e operazioni di produzione.',
        },
        {
            icon: Package,
            title: 'Ordini di Produzione',
            description:
                'Monitoraggio in tempo reale dello stato e del progresso degli ordini.',
        },
        {
            icon: Users,
            title: 'Gestione Clienti',
            description:
                'Anagrafica completa con divisioni e indirizzi di consegna.',
        },
        {
            icon: BarChart3,
            title: 'Dashboard Analitico',
            description:
                'Statistiche, metriche di performance, analisi comparative e 5 grafici interattivi.',
        },
        {
            icon: Zap,
            title: 'Portale Produzione',
            description:
                'Interfaccia web e mobile per operatori di produzione in tempo reale.',
        },
    ];

    const benefits = [
        {
            icon: TrendingUp,
            title: 'Ottimizzazione Processi',
            description:
                "Migliora l'efficienza operativa con monitoraggio in tempo reale.",
        },
        {
            icon: Shield,
            title: 'Controllo Totale',
            description:
                'Gestione completa del ciclo di vita di offerte e ordini.',
        },
        {
            icon: Settings,
            title: 'Configurazione Flessibile',
            description:
                'Sistema altamente configurabile adattato alle tue esigenze.',
        },
    ];

    return (
        <>
            <Head title="Laser Packaging - Sistema di Gestione">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link
                    href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600"
                    rel="stylesheet"
                />
            </Head>
            <div className="flex min-h-screen flex-col bg-gradient-to-b from-[#FDFDFC] to-[#F5F5F3] text-[#1b1b18] dark:from-[#0a0a0a] dark:to-[#111111] dark:text-[#EDEDEC]">
                {/* Header */}
                <header className="sticky top-0 z-50 w-full border-b border-[#19140035] bg-white/80 backdrop-blur-sm dark:border-[#3E3E3A] dark:bg-[#161615]/80">
                    <nav className="container mx-auto flex items-center justify-between px-6 py-4">
                        <div className="flex items-center gap-2">
                            <Package className="h-6 w-6 text-primary" />
                            <span className="text-lg font-semibold">
                                Laser Packaging
                            </span>
                        </div>
                        <div className="flex items-center gap-3">
                            {auth.user ? (
                                <Link
                                    href={dashboard().url}
                                    className="inline-flex items-center gap-2 rounded-md border border-[#19140035] bg-[#1b1b18] px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-[#2a2a27] dark:border-[#3E3E3A] dark:bg-[#EDEDEC] dark:text-[#1b1b18] dark:hover:bg-[#DEDEDC]"
                                >
                                    <BarChart3 className="h-4 w-4" />
                                    Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href={login().url}
                                        className="inline-block rounded-md border border-transparent px-5 py-2 text-sm font-medium text-[#1b1b18] transition-colors hover:bg-[#F5F5F3] dark:text-[#EDEDEC] dark:hover:bg-[#1a1a1a]"
                                    >
                                        Accedi
                                    </Link>
                                    {canRegister && (
                                        <Link
                                            href={register().url}
                                            className="inline-flex items-center gap-2 rounded-md border border-[#19140035] bg-[#1b1b18] px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-[#2a2a27] dark:border-[#3E3E3A] dark:bg-[#EDEDEC] dark:text-[#1b1b18] dark:hover:bg-[#DEDEDC]"
                                        >
                                            Registrati
                                            <ArrowRight className="h-4 w-4" />
                                        </Link>
                                    )}
                                </>
                            )}
                        </div>
                    </nav>
                </header>

                {/* Hero Section */}
                <section className="container mx-auto px-6 py-16 lg:py-24">
                    <div className="mx-auto max-w-4xl text-center">
                        <Badge
                            className="mb-6 animate-in duration-500 fade-in"
                            variant="secondary"
                        >
                            <Sparkles
                                className="mr-2 h-4 w-4"
                                aria-hidden="true"
                            />
                            Sistema di Gestione Integrale
                        </Badge>
                        <h1 className="mb-6 animate-in text-4xl font-bold duration-700 fade-in slide-in-from-bottom md:text-5xl lg:text-6xl">
                            Gestione Imballaggio
                            <span className="mt-2 block text-primary">
                                Laser
                            </span>
                        </h1>
                        <p className="mx-auto mb-8 max-w-2xl animate-in text-xl text-muted-foreground delay-200 duration-700 fade-in slide-in-from-bottom md:text-2xl">
                            Sistema moderno per la gestione completa di offerte,
                            articoli, ordini e produzione. Ottimizza i tuoi
                            processi operativi con strumenti potenti e facili da
                            usare.
                        </p>
                        {!auth.user && (
                            <div className="mb-12 flex animate-in flex-col items-center justify-center gap-4 delay-400 duration-700 fade-in slide-in-from-bottom sm:flex-row">
                                <Button size="lg" asChild>
                                    <Link href={login().url}>
                                        Inizia Ora
                                        <ArrowRight
                                            className="ml-2 h-5 w-5"
                                            aria-hidden="true"
                                        />
                                    </Link>
                                </Button>
                                {canRegister && (
                                    <Button size="lg" variant="outline" asChild>
                                        <Link href={register().url}>
                                            Crea Account
                                        </Link>
                                    </Button>
                                )}
                            </div>
                        )}
                    </div>
                </section>

                {/* Features Section */}
                <section className="container mx-auto bg-muted/30 px-6 py-16 lg:py-24">
                    <div className="mx-auto max-w-6xl">
                        <div className="mb-12 text-center">
                            <h2 className="mb-4 text-3xl font-bold md:text-4xl">
                                Caratteristiche Principali
                            </h2>
                            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
                                Strumenti potenti progettati per ottimizzare il
                                tuo flusso di lavoro
                            </p>
                        </div>
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {features.map((feature, index) => {
                                const Icon = feature.icon;
                                return (
                                    <Card
                                        key={index}
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
                                                {feature.title}
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <CardDescription className="text-foreground/80">
                                                {feature.description}
                                            </CardDescription>
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </div>
                    </div>
                </section>

                {/* Benefits Section */}
                <section className="container mx-auto px-6 py-16 lg:py-24">
                    <div className="mx-auto max-w-6xl">
                        <div className="mb-12 text-center">
                            <h2 className="mb-4 text-3xl font-bold md:text-4xl">
                                Perché scegliere il nostro sistema?
                            </h2>
                            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
                                Benefici che migliorano la tua produttività ed
                                efficienza operativa
                            </p>
                        </div>
                        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                            {benefits.map((benefit, index) => {
                                const Icon = benefit.icon;
                                return (
                                    <Card key={index} className="text-center">
                                        <CardHeader>
                                            <div className="mb-4 inline-flex items-center justify-center rounded-full bg-primary/10 p-4 text-primary">
                                                <Icon
                                                    className="h-8 w-8"
                                                    aria-hidden="true"
                                                />
                                            </div>
                                            <CardTitle>
                                                {benefit.title}
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <CardDescription className="text-foreground/80">
                                                {benefit.description}
                                            </CardDescription>
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </div>
                    </div>
                </section>

                {/* Stats Section */}
                <section className="container mx-auto bg-muted/30 px-6 py-16 lg:py-24">
                    <div className="mx-auto max-w-4xl">
                        <div className="grid grid-cols-2 gap-8 text-center md:grid-cols-4">
                            <div>
                                <div className="mb-2 text-3xl font-bold text-primary md:text-4xl">
                                    100%
                                </div>
                                <div className="text-sm text-muted-foreground">
                                    Migrazione Completa
                                </div>
                            </div>
                            <div>
                                <div className="mb-2 text-3xl font-bold text-primary md:text-4xl">
                                    888
                                </div>
                                <div className="text-sm text-muted-foreground">
                                    Test Automatizzati
                                </div>
                            </div>
                            <div>
                                <div className="mb-2 text-3xl font-bold text-primary md:text-4xl">
                                    39
                                </div>
                                <div className="text-sm text-muted-foreground">
                                    Controllori
                                </div>
                            </div>
                            <div>
                                <div className="mb-2 text-3xl font-bold text-primary md:text-4xl">
                                    5
                                </div>
                                <div className="text-sm text-muted-foreground">
                                    Repository
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
                                        Pronto per iniziare?
                                    </CardTitle>
                                    <CardDescription className="mx-auto max-w-2xl text-lg">
                                        Unisciti al nostro sistema e ottimizza
                                        la gestione della tua produzione
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                                        <Button size="lg" asChild>
                                            <Link href={login().url}>
                                                Accedi
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
                                                <Link href={register().url}>
                                                    Crea Account
                                                </Link>
                                            </Button>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </section>
                )}

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
                                    Laser Packaging
                                </span>
                            </div>
                            <div className="flex items-center gap-6 text-sm text-muted-foreground">
                                <span>
                                    © {new Date().getFullYear()} Sistema di
                                    Gestione
                                </span>
                                <span>•</span>
                                <span>Laravel 12.48.1 + React 19.2.0</span>
                            </div>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}
