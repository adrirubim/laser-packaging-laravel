import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { useTranslations } from '@/hooks/use-translations';
import { dashboard } from '@/routes';
import articles from '@/routes/articles/index';
import customerDivisions from '@/routes/customer-divisions/index';
import customerShippingAddresses from '@/routes/customer-shipping-addresses/index';
import customers from '@/routes/customers/index';
import employees from '@/routes/employees/index';
import machinery from '@/routes/machinery/index';
import materials from '@/routes/materials/index';
import offers from '@/routes/offers/index';
import orders from '@/routes/orders/index';
import suppliers from '@/routes/suppliers/index';
import { type NavGroup, type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import {
    Activity,
    AlertTriangle,
    Box,
    Briefcase,
    Building2,
    Calendar,
    ClipboardList,
    Cog,
    FileCheck,
    FileCode,
    FileStack,
    FileText,
    Globe,
    Grid3x3,
    Layers,
    LayoutGrid,
    ListChecks,
    MapPin,
    Palette,
    Settings,
    ShoppingCart,
    Tags,
    TrendingUp,
    Truck,
    UserCheck,
    Users,
    Wrench,
} from 'lucide-react';
import { useMemo } from 'react';
import AppLogo from './app-logo';

const footerNavItems: NavItem[] = [];

export function AppSidebar() {
    const { t } = useTranslations();

    const mainNavGroups: NavGroup[] = useMemo(
        () => [
            {
                title: t('nav.customers'),
                items: [
                    {
                        title: t('nav.anagrafica'),
                        href: customers.index().url,
                        icon: Users,
                    },
                    {
                        title: t('nav.divisioni'),
                        href: customerDivisions.index().url,
                        icon: Building2,
                    },
                    {
                        title: t('nav.indirizzi'),
                        href: customerShippingAddresses.index().url,
                        icon: MapPin,
                    },
                ],
            },
            {
                title: t('nav.suppliers'),
                items: [
                    {
                        title: t('nav.anagrafica'),
                        href: suppliers.index().url,
                        icon: Truck,
                    },
                ],
            },
            {
                title: t('nav.offers'),
                items: [
                    {
                        title: t('nav.lista'),
                        href: offers.index().url,
                        icon: ClipboardList,
                    },
                    {
                        title: t('nav.attivita'),
                        href: '/offers/activities',
                        icon: Activity,
                    },
                    {
                        title: t('nav.settori'),
                        href: '/offers/sectors',
                        icon: Globe,
                    },
                    {
                        title: t('nav.stagionalita'),
                        href: '/offers/seasonality',
                        icon: Calendar,
                    },
                    {
                        title: t('nav.famiglia_las'),
                        href: '/offers/las-families',
                        icon: Layers,
                    },
                    {
                        title: t('nav.las_linee_lavoro'),
                        href: '/offers/las-work-lines',
                        icon: Wrench,
                    },
                    {
                        title: t('nav.ls_risorse'),
                        href: '/offers/ls-resources',
                        icon: Settings,
                    },
                    {
                        title: t('nav.tipi_ordini'),
                        href: '/offers/order-types',
                        icon: ListChecks,
                    },
                    {
                        title: t('nav.categorie_operazioni'),
                        href: '/offers/operation-categories',
                        icon: Tags,
                    },
                    {
                        title: t('nav.operazioni'),
                        href: '/offers/operations',
                        icon: Cog,
                    },
                ],
            },
            {
                title: t('nav.articles'),
                items: [
                    {
                        title: t('nav.anagrafica'),
                        href: articles.index().url,
                        icon: FileText,
                    },
                    {
                        title: t('nav.categoria_articoli'),
                        href: '/article-categories',
                        icon: Tags,
                    },
                    {
                        title: t('nav.macchinari'),
                        href: machinery.index().url,
                        icon: Cog,
                    },
                    {
                        title: t('nav.criticita'),
                        href: '/critical-issues',
                        icon: AlertTriangle,
                    },
                    {
                        title: t('nav.materiali'),
                        href: materials.index().url,
                        icon: Box,
                    },
                    {
                        title: t('nav.tipo_pallet'),
                        href: '/pallet-types',
                        icon: Palette,
                    },
                    {
                        title: t('nav.modelli_cq'),
                        href: '/articles/cq-models',
                        icon: Grid3x3,
                    },
                    {
                        title: t('nav.fogli_pallet'),
                        href: '/articles/pallet-sheets',
                        icon: FileCode,
                    },
                    {
                        title: t('nav.istruzioni_confezionamento'),
                        href: '/articles/packaging-instructions',
                        icon: FileStack,
                    },
                    {
                        title: t('nav.istruzioni_pallettizzazione'),
                        href: '/articles/palletization-instructions',
                        icon: FileCheck,
                    },
                    {
                        title: t('nav.istruzioni_operative'),
                        href: '/articles/operational-instructions',
                        icon: FileText,
                    },
                ],
            },
            {
                title: t('nav.orders'),
                items: [
                    {
                        title: t('nav.lista'),
                        href: orders.index().url,
                        icon: ShoppingCart,
                    },
                    {
                        title: t('nav.in_produzione'),
                        href: '/orders/production-advancements',
                        icon: Activity,
                    },
                    {
                        title: t('nav.avanzamenti_produzione'),
                        href: '/production-order-processing',
                        icon: TrendingUp,
                    },
                    {
                        title: t('nav.pianificazione_produzione'),
                        href: '/planning',
                        icon: Calendar,
                    },
                ],
            },
            {
                title: t('nav.personale'),
                items: [
                    {
                        title: t('nav.anagrafica'),
                        href: employees.index().url,
                        icon: UserCheck,
                    },
                    {
                        title: t('nav.contratti'),
                        href: '/employees/contracts',
                        icon: Briefcase,
                    },
                ],
            },
        ],
        [t],
    );

    const mainNavItems: NavItem[] = useMemo(
        () => [
            {
                title: t('nav.dashboard'),
                href: dashboard(),
                icon: LayoutGrid,
            },
        ],
        [t],
    );

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} groups={mainNavGroups} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
