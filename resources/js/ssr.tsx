import type { ResolvedComponent } from '@inertiajs/react';
import { createInertiaApp } from '@inertiajs/react';
import createServer from '@inertiajs/react/server';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import ReactDOMServer from 'react-dom/server';

const appName = (import.meta.env.VITE_APP_NAME ?? 'Laravel') as string;

createServer((page) =>
    createInertiaApp({
        page,
        render: ReactDOMServer.renderToString,
        title: (title) => (title ? `${title} - ${appName}` : appName),
        resolve: async (name: string): Promise<ResolvedComponent> => {
            const mod = await resolvePageComponent(
                `./pages/${name}.tsx`,
                import.meta.glob('./pages/**/*.tsx'),
            );
            return ((mod as { default?: unknown }).default ??
                mod) as ResolvedComponent;
        },
        setup: function InertiaSetup({ App, props }) {
            return <App {...props} />;
        },
    }),
);
