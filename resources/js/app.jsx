import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';

const pages = import.meta.glob('./pages/**/*.jsx');

createInertiaApp({
    resolve: (name) => resolvePageComponent(`./pages/${name}.jsx`, pages),
    setup({ el, App, props }) {
        createRoot(el).render(<App {...props} />);
    },
});
