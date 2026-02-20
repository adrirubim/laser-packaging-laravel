import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        environment: 'node',
        include: ['resources/js/pages/Planning/**/*.test.ts', 'resources/js/pages/Planning/**/*.test.tsx'],
    },
});

