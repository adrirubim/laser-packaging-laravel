import path from 'path';

import { defineConfig } from 'vitest/config';

export default defineConfig({
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'resources/js'),
        },
    },
    test: {
        environment: 'node',
        include: ['resources/js/pages/Planning/**/*.test.ts', 'resources/js/pages/Planning/**/*.test.tsx'],
    },
});

