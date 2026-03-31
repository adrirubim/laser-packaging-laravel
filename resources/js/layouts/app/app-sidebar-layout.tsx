import { AppContent } from '#app/components/app-content';
import { AppShell } from '#app/components/app-shell';
import { AppSidebar } from '#app/components/app-sidebar';
import { AppSidebarHeader } from '#app/components/app-sidebar-header';
import { type BreadcrumbItem } from '#app/types';
import { type PropsWithChildren } from 'react';

export default function AppSidebarLayout({
    children,
    breadcrumbs = [],
}: PropsWithChildren<{ breadcrumbs?: BreadcrumbItem[] }>) {
    return (
        <AppShell variant="sidebar">
            <AppSidebar />
            <AppContent variant="sidebar" className="overflow-x-hidden">
                <AppSidebarHeader breadcrumbs={breadcrumbs} />
                {children}
            </AppContent>
        </AppShell>
    );
}
