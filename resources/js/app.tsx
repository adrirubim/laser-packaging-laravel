import { ErrorBoundary } from '@/components/error-boundary';
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Toaster } from 'sonner';
import '../css/app.css';
import { initializeTheme } from './hooks/use-appearance';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),
    resolve: async (name) => {
        const mod = await resolvePageComponent(
            `./pages/${name}.tsx`,
            import.meta.glob([
                './pages/**/*.tsx',
                '!./pages/**/*.test.tsx',
                '!./pages/**/*.spec.tsx',
            ]),
        );
        return (mod as { default?: unknown }).default ?? mod;
    },
    setup({ el, App, props }) {
        const root = createRoot(el);
        const serverAppearance = (props as { appearance?: string })
            .appearance as 'light' | 'dark' | 'system' | undefined;
        initializeTheme(serverAppearance);
        const translations =
            (
                props as {
                    initialPage?: {
                        props?: { translations?: Record<string, string> };
                    };
                }
            )?.initialPage?.props?.translations ??
            (props as { translations?: Record<string, string> })
                ?.translations ??
            {};

        root.render(
            <StrictMode>
                <ErrorBoundary translations={translations}>
                    <>
                        <App {...props} />
                        <Toaster richColors closeButton position="top-right" />
                    </>
                </ErrorBoundary>
            </StrictMode>,
        );
    },
    progress: {
        color: '#4B5563',
    },
});
