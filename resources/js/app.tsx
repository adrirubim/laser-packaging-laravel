import { ErrorBoundary } from '@/components/error-boundary';
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
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

        root.render(
            <StrictMode>
                <ErrorBoundary>
                    <App {...props} />
                </ErrorBoundary>
            </StrictMode>,
        );
    },
    progress: {
        color: '#4B5563',
    },
});

// This will set light / dark mode on load...
initializeTheme();
