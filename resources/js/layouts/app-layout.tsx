import AppLayoutTemplate from '#app/layouts/app/app-sidebar-layout';
import { type BreadcrumbItem } from '#app/types';
import { type ReactNode } from 'react';

interface AppLayoutProps {
    children: ReactNode;
    breadcrumbs?: BreadcrumbItem[];
}

function AppLayout({ children, breadcrumbs, ...props }: AppLayoutProps) {
    return (
        <AppLayoutTemplate breadcrumbs={breadcrumbs} {...props}>
            {children}
        </AppLayoutTemplate>
    );
}

export default AppLayout;
