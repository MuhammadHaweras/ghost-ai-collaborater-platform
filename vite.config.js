import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import laravel from 'laravel-vite-plugin';
import { google } from 'laravel-vite-plugin/fonts';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/css/globals.css', 'resources/js/app.jsx'],
            refresh: true,
            fonts: [
                google('Geist', { alias: 'geist-sans', weights: ['100..900'], optimizedFallbacks: false }),
                google('Geist Mono', { weights: ['100..900'], preload: false, optimizedFallbacks: false }),
            ],
        }),
        react(),
        tailwindcss(),
    ],
    server: {
        watch: {
            ignored: ['**/storage/framework/views/**'],
        },
    },
});
