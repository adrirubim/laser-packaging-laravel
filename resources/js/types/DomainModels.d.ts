import type { PageProps as InertiaPageProps } from '@inertiajs/core';
import { InertiaLinkProps } from '@inertiajs/react';
import { LucideIcon } from 'lucide-react';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: NonNullable<InertiaLinkProps['href']>;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    locale: string;
    translations: Record<string, string>;
    quote: { message: string; author: string };
    auth: Auth;
    appearance?: 'light' | 'dark' | 'system';
    sidebarOpen: boolean;
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string | null;
    phone?: string | null;
    email_verified_at: string | null;
    last_login_at?: string | null;
    preferences?: Record<string, string> | null;
    two_factor_enabled?: boolean;
    created_at: string;
    updated_at: string;
    [key: string]: unknown; // This allows for additional properties...
}

export type PageProps<
    T extends Record<string, unknown> = Record<string, unknown>,
> = InertiaPageProps<SharedData & T>;

declare module '#app/types/DomainModels' {
    export interface DomainOrderArticle {
        uuid: string;
        cod_article_las: string;
        article_descr: string | null;
        offer_uuid: string | null;
    }

    export interface DomainOrderCustomer {
        uuid: string;
        company_name: string;
    }

    export interface DomainOrderCustomerDivision {
        uuid: string;
        name: string;
    }

    export interface DomainOrderShippingAddress {
        uuid: string;
        street: string;
        city: string;
        postal_code: string;
    }

    export interface DomainOrder {
        id: number;
        uuid: string;
        order_production_number: string;
        number_customer_reference_order: string | null;
        line: number | null;
        quantity: number | string | null;
        worked_quantity: number | string | null;
        remain_quantity: number | string | null;
        delivery_requested_date: string | null;
        status: number;
        status_label: string;
        status_semaforo?: {
            etichette: number;
            packaging: number;
            prodotto: number;
        } | null;
        autocontrollo: boolean | number;
        article: DomainOrderArticle | null;
        customer?: DomainOrderCustomer | null;
        division?: DomainOrderCustomerDivision | null;
        shipping_address?: DomainOrderShippingAddress | null;
    }

    export interface ApiResponse<TData> {
        success: boolean;
        message: string | null;
        data: TData | null;
    }

    export interface DomainDashboardOrderStatusBreakdown {
        total: number;
        pianificato: number;
        in_allestimento: number;
        lanciato: number;
        in_avanzamento: number;
        sospeso: number;
        completato: number;
    }

    export interface DomainDashboardOffersStats {
        total: number;
        active: number;
    }

    export interface DomainDashboardArticlesStats {
        total: number;
    }

    export interface DomainDashboardCustomersStats {
        total: number;
    }

    export interface DomainDashboardProductionStats {
        total_quantity: number;
        worked_quantity: number;
        progress_percentage: number;
    }

    export interface DomainDashboardStatistics {
        orders: DomainDashboardOrderStatusBreakdown;
        offers: DomainDashboardOffersStats;
        articles: DomainDashboardArticlesStats;
        customers: DomainDashboardCustomersStats;
        production: DomainDashboardProductionStats;
    }

    export interface DomainDashboardOrder {
        id: number;
        uuid: string;
        order_production_number: string;
        status: number;
        status_label: string;
        quantity: number;
        worked_quantity: number;
        delivery_requested_date?: string | null;
        days_until_delivery?: number;
        is_overdue?: boolean;
        article?: {
            cod_article_las: string;
            article_descr?: string | null;
        } | null;
        customer?: string | null;
        created_at?: string | null;
    }

    export interface DomainDashboardTopCustomer {
        id: number;
        uuid: string;
        company_name: string;
        order_count: number;
    }

    export interface DomainDashboardTopArticle {
        id: number;
        uuid: string;
        cod_article_las: string;
        article_descr?: string | null;
        total_quantity: number;
    }

    export type DomainDashboardAlertSeverity =
        | 'low'
        | 'medium'
        | 'high'
        | 'critical';

    export interface DomainDashboardAlert {
        type: string;
        severity: DomainDashboardAlertSeverity;
        title: string;
        message: string;
        count: number;
        first_order_uuid?: string;
        signature?: string;
        scope_hash?: string;
    }

    export interface DomainDashboardPerformanceMetrics {
        completion_rate: number;
        avg_production_time_days: number;
        orders_per_day: number;
        total_orders: number;
        completed_orders: number;
    }

    export interface DomainDashboardComparisonStats {
        orders: {
            current: number;
            previous: number;
            change: number;
            change_percentage: number;
        };
        production: {
            current: number;
            previous: number;
            change: number;
        };
    }

    export interface DomainDashboardTrendPoint {
        period: string;
        count: number;
    }

    export interface DomainDashboardProductionProgressItem {
        orderNumber: string;
        worked: number;
        total: number;
        progress: number;
        isUrgent: boolean;
        daysUntilDelivery?: number;
    }

    export interface DomainDashboardCustomerFilterItem {
        uuid: string;
        label: string;
        code?: string;
    }

    export interface DomainDashboardOrderStatusFilterItem {
        value: string;
        label: string;
    }

    export interface DomainDashboardStats {
        statistics: DomainDashboardStatistics;
        urgentOrders: DomainDashboardOrder[];
        recentOrders: DomainDashboardOrder[];
        topCustomers: DomainDashboardTopCustomer[];
        topArticles: DomainDashboardTopArticle[];
        performanceMetrics: DomainDashboardPerformanceMetrics;
        alerts: DomainDashboardAlert[];
        comparisonStats: DomainDashboardComparisonStats | null;
        ordersTrend: DomainDashboardTrendPoint[];
        previousTrend?: DomainDashboardTrendPoint[] | null;
        productionProgressData: DomainDashboardProductionProgressItem[];
        dateFilter: string;
        customerFilter?: string | null;
        statusFilter?: string[] | null;
        customersForFilter: DomainDashboardCustomerFilterItem[];
        orderStatusesForFilter: DomainDashboardOrderStatusFilterItem[];
        advancementsCountToday: number;
    }

    export interface DomainOffer {
        uuid: string;
        offer_number: string;
        offer_date: string | null;
        validity_date: string | null;
        customer_uuid: string | null;
        customerdivision_uuid: string | null;
        activity_uuid: string | null;
        sector_uuid: string | null;
        seasonality_uuid: string | null;
        type_uuid: string | null;
        order_type_uuid: string | null;
        lasfamily_uuid: string | null;
        lasworkline_uuid: string | null;
        lsresource_uuid: string | null;
        customer_ref: string | null;
        article_code_ref: string | null;
        provisional_description: string | null;
        unit_of_measure: string | null;
        quantity: number | null;
        piece: number | null;
        declared_weight_cfz: number | null;
        declared_weight_pz: number | null;
        notes: string | null;
        expected_workers: number | null;
        expected_revenue: number | null;
        rate_cfz: number | null;
        rate_pz: number | null;
        rate_rounding_cfz: number | null;
        rate_increase_cfz: number | null;
        materials_euro: number | null;
        logistics_euro: number | null;
        other_euro: number | null;
        offer_notes: string | null;
        ls_setup_cost: number | null;
        ls_other_costs: number | null;
        approval_status: string;
        operations: Array<{
            uuid: string;
            category: {
                uuid: string | null;
                name: string;
            };
            codice_univoco: string;
            descrizione: string;
            secondi_operazione: number;
            num_op: number;
            total_sec: number;
            filename: string | null;
        }>;
        theoretical_time_cfz: number;
        unexpected: number;
        total_theoretical_time: number;
        theoretical_time: number;
        production_time_cfz: number;
        production_time: number;
        production_average_cfz: number;
        production_average_pz: number;
        rate_rounding_cfz_perc: number;
        final_rate_cfz: number;
        final_rate_pz: number;
        total_rate_cfz: number;
        total_rate_pz: number;
        typeOrder?: DomainOfferType | null;
        lasFamily?: DomainLasFamily | null;
        lasWorkLine?: DomainLasWorkLine | null;
        lsResource?: DomainLsResource | null;
        customerDivision?: {
            uuid: string;
            name: string;
        } | null;
    }

    export interface DomainOfferType {
        uuid: string;
        name: string;
    }

    export interface DomainLasFamily {
        uuid: string;
        code: string;
        name: string;
    }

    export interface DomainLasWorkLine {
        uuid: string;
        code: string;
        name: string;
    }

    export interface DomainLsResource {
        uuid: string;
        code: string;
        name: string;
    }

    export interface DomainSupplier {
        uuid: string;
        code: string;
        company_name: string;
        vat_number: string | null;
        city: string | null;
        province: string | null;
        country: string | null;
        removed: boolean;
    }

    export interface DomainArticleIC {
        id: number;
        uuid: string;
        code: string;
        number: string | null;
        filename: string | null;
    }

    export interface DomainArticleIO {
        id: number;
        uuid: string;
        code: string;
        number: string | null;
        filename: string | null;
    }

    export interface DomainArticleIP {
        id: number;
        uuid: string;
        code: string;
        number: string | null;
        length_cm: number | null;
        depth_cm: number | null;
        height_cm: number | null;
        volume_dmc: number | null;
        plan_packaging: number | null;
        pallet_plans: number | null;
        qty_pallet: number | null;
        units_per_neck: number | null;
        units_pallet: number | null;
        interlayer_every_floors: number | null;
        filename: string | null;
    }

    // Planning domain models (mirror exact backend JSON)

    export interface DomainPlanningOrder {
        uuid: string;
        code: string;
        article_code: string | null;
        description: string | null;
        delivery_requested_date: number | null;
        quantity: number;
        worked_quantity: number;
        status: number;
        shift_mode: number | null;
        shift_morning: boolean;
        shift_afternoon: boolean;
        work_saturday: boolean;
    }

    export interface DomainPlanningLine {
        uuid: string;
        code: string;
        name: string;
        orders: DomainPlanningOrder[];
    }

    export interface DomainPlanningRow {
        id: number | null;
        order_uuid: string;
        lasworkline_uuid: string;
        /**
         * Formato 'Y-m-d H:i:s' o null (según Resource).
         */
        date: string | null;
        /**
         * JSON string con mapa { [slot: string]: number }.
         */
        hours: string;
    }

    export interface DomainPlanningSummaryRow {
        id: number | null;
        /**
         * Formato 'Y-m-d' o null (según Resource).
         */
        date: string | null;
        summary_type: string;
        /**
         * JSON string con mapa { [slot: string]: number }.
         */
        hours: string;
    }

    export interface DomainPlanningContract {
        id: number;
        employee_uuid: string;
        qualifica: number;
        /**
         * Timestamp (segundos) o null, según PlanningDataService.
         */
        start_date: number | null;
        /**
         * Timestamp (segundos) o null, según PlanningDataService.
         */
        end_date: number | null;
        employee_name: string | null;
        employee_surname: string | null;
    }

    export interface DomainPlanningSummary {
        error_code: number;
        message: string | null;
        errors: Record<string, string[]> | null;
        planning_id: number | null;
        summary_id: number | null;
        order_uuid: string | null;
        hours_needed: number | null;
        quarters_needed: number | null;
        result: unknown;
        /**
         * Fecha en formato string o null, según Resource.
         */
        date: string | null;
        orders_checked: number | null;
        orders_modified: number | null;
        details: unknown;
    }

    export interface DomainPlanningBoard {
        error_code: number;
        lines: DomainPlanningLine[];
        planning: DomainPlanningRow[];
        contracts: DomainPlanningContract[];
        summary: DomainPlanningSummaryRow[];
    }
}
