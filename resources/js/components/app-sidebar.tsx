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
import AppLogo from './app-logo';

const mainNavGroups: NavGroup[] = [
    {
        title: 'Clienti',
        items: [
            {
                title: 'Anagrafica',
                href: customers.index().url,
                icon: Users,
            },
            {
                title: 'Divisioni',
                href: customerDivisions.index().url,
                icon: Building2,
            },
            {
                title: 'Indirizzi',
                href: customerShippingAddresses.index().url,
                icon: MapPin,
            },
        ],
    },
    {
        title: 'Fornitori',
        items: [
            {
                title: 'Anagrafica',
                href: suppliers.index().url,
                icon: Truck,
            },
        ],
    },
    {
        title: 'Offerte',
        items: [
            {
                title: 'Lista',
                href: offers.index().url,
                icon: ClipboardList,
            },
            {
                title: 'Attività',
                href: '/offers/activities',
                icon: Activity,
            },
            {
                title: 'Settori',
                href: '/offers/sectors',
                icon: Globe,
            },
            {
                title: 'Stagionalità',
                href: '/offers/seasonality',
                icon: Calendar,
            },
            {
                title: 'Famiglia LAS',
                href: '/offers/las-families',
                icon: Layers,
            },
            {
                title: 'LAS Linee di Lavoro',
                href: '/offers/las-work-lines',
                icon: Wrench,
            },
            {
                title: 'L&S Risorse',
                href: '/offers/ls-resources',
                icon: Settings,
            },
            {
                title: 'Tipi ordini',
                href: '/offers/order-types',
                icon: ListChecks,
            },
            {
                title: 'Categorie Operazioni',
                href: '/offers/operation-categories',
                icon: Tags,
            },
            {
                title: 'Operazioni',
                href: '/offers/operations',
                icon: Cog,
            },
        ],
    },
    {
        title: 'Articoli',
        items: [
            {
                title: 'Anagrafica',
                href: articles.index().url,
                icon: FileText,
            },
            {
                title: 'Categoria Articoli',
                href: '/article-categories',
                icon: Tags,
            },
            {
                title: 'Macchinari',
                href: machinery.index().url,
                icon: Cog,
            },
            {
                title: 'Criticità',
                href: '/critical-issues',
                icon: AlertTriangle,
            },
            {
                title: 'Materiali',
                href: materials.index().url,
                icon: Box,
            },
            {
                title: 'Tipo pallet',
                href: '/pallet-types',
                icon: Palette,
            },
            {
                title: 'Modelli CQ',
                href: '/articles/cq-models',
                icon: Grid3x3,
            },
            {
                title: 'Fogli Pallet',
                href: '/articles/pallet-sheets',
                icon: FileCode,
            },
            {
                title: 'Istruzioni di confezionamento',
                href: '/articles/packaging-instructions',
                icon: FileStack,
            },
            {
                title: 'Istruzioni di pallettizzazione',
                href: '/articles/palletization-instructions',
                icon: FileCheck,
            },
            {
                title: 'Istruzioni Operative',
                href: '/articles/operational-instructions',
                icon: FileText,
            },
        ],
    },
    {
        title: 'Ordini',
        items: [
            {
                title: 'Lista',
                href: orders.index().url,
                icon: ShoppingCart,
            },
            {
                title: 'In Produzione',
                href: '/orders/production-advancements',
                icon: Activity,
            },
            {
                title: 'Avanzamenti di Produzione',
                href: '/production-order-processing',
                icon: TrendingUp,
            },
            {
                title: 'Pianificazione Produzione',
                href: '/planning',
                icon: Calendar,
            },
        ],
    },
    {
        title: 'Personale',
        items: [
            {
                title: 'Anagrafica',
                href: employees.index().url,
                icon: UserCheck,
            },
            {
                title: 'Contratti',
                href: '/employees/contracts',
                icon: Briefcase,
            },
        ],
    },
];

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
    },
];

const footerNavItems: NavItem[] = [];

export function AppSidebar() {
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
