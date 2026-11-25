import { Head } from '@inertiajs/react';
import { Ghost } from 'lucide-react';
import type { ReactNode } from 'react';

interface AuthLayoutProps {
    title: string;
    children: ReactNode;
}

export function AuthLayout({ title, children }: AuthLayoutProps) {
    return (
        <main className="grid min-h-dvh lg:grid-cols-2">
            <aside className="hidden items-center justify-center border-r border-surface-border bg-surface px-10 lg:flex">
                <div className="max-w-sm">
                    <div className="flex items-center gap-2 text-lg font-semibold">
                        <Ghost aria-hidden="true" className="size-6 text-brand" /> Ghost AI
                    </div>
                    <p className="mt-6 text-2xl font-medium tracking-tight">Design systems together.</p>
                    <ul className="mt-4 grid list-disc gap-2 pl-4 text-sm text-copy-secondary marker:text-brand">
                        <li>Map a system from a prompt</li>
                        <li>Edit a shared architecture canvas</li>
                        <li>Generate a technical specification</li>
                    </ul>
                </div>
            </aside>
            <section className="flex items-center justify-center px-6 py-10">
                <div className="grid w-full max-w-sm gap-6">
                    <Head title={title} />
                    <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
                    {children}
                </div>
            </section>
        </main>
    );
}
