import { Form, Head, Link } from '@inertiajs/react';
import { ArrowLeft, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { AuthField } from '@/components/auth/auth-field';
import { SocialButtons } from '@/components/auth/social-buttons';
import { Button } from '@/components/ui/button';
import type { AuthenticatedPageProps } from '@/types/auth';

interface ProfileProps extends AuthenticatedPageProps {
    connectedProviders: string[];
    socialStatus: string | null;
}

interface Notice {
    kind: 'success' | 'error';
    message: string;
}

export default function Profile({ auth, connectedProviders, socialStatus }: ProfileProps) {
    const [notice, setNotice] = useState<Notice | null>(socialStatus ? { kind: 'success', message: socialStatus } : null);
    useEffect(() => {
        if (!notice) return;
        const timeout = window.setTimeout(() => setNotice(null), 6000);
        return () => window.clearTimeout(timeout);
    }, [notice]);

    const success = (message: string) => setNotice({ kind: 'success', message });
    const requestFailed = () => {
        setNotice({ kind: 'error', message: 'Could not complete the update. Please try again.' });
        return false;
    };
    const feedback = {
        onError: (errors: Record<string, string>) => setNotice({ kind: 'error', message: Object.values(errors)[0] || 'Check the highlighted fields.' }),
        onNetworkError: requestFailed,
        onHttpException: requestFailed,
    };

    return (
        <main className="mx-auto grid w-full max-w-lg gap-8 px-6 py-10">
            <Head title="Profile settings" />
            {notice && (
                <div className="fixed inset-x-4 top-4 z-50 mx-auto flex max-w-md items-center justify-between gap-3 rounded-xl border border-surface-border bg-elevated px-4 py-3 shadow-lg">
                    <p role={notice.kind === 'error' ? 'alert' : 'status'} className={notice.kind === 'error' ? 'text-sm text-error' : 'text-sm text-success'}>{notice.message}</p>
                    <Button type="button" size="icon-sm" variant="ghost" aria-label="Dismiss notification" onClick={() => setNotice(null)}><X aria-hidden="true" /></Button>
                </div>
            )}
            <Link href="/editor" className="inline-flex items-center gap-2 justify-self-start text-sm text-brand hover:underline">
                <ArrowLeft aria-hidden="true" className="size-4" /> Back to editor
            </Link>
            <h1 className="text-2xl font-semibold tracking-tight">Profile settings</h1>
            <Form action="/user/profile-information" method="put" errorBag="updateProfileInformation" className="grid gap-4"
                options={{ preserveScroll: true }} {...feedback} onSuccess={() => success('Account details saved.')}>
                {({ processing, errors }) => (
                    <>
                        <h2 className="font-medium">Account details</h2>
                        <AuthField label="Name" name="name" autoComplete="name" defaultValue={auth.user.name} error={errors.name} />
                        <AuthField key={auth.user.email} label="Email" type="email" name="email" autoComplete="email" defaultValue={auth.user.email} error={errors.email} />
                        <Button className="justify-self-start" disabled={processing}>Save changes</Button>
                    </>
                )}
            </Form>
            <Form action="/user/password" method="put" errorBag="updatePassword" resetOnSuccess className="grid gap-4 border-t border-surface-border pt-6"
                options={{ preserveScroll: true }} {...feedback} onSuccess={() => success('Password updated.')}>
                {({ processing, errors }) => (
                    <>
                        <h2 className="font-medium">Change password</h2>
                        <AuthField label="Current password" type="password" name="current_password" autoComplete="current-password" error={errors.current_password} />
                        <AuthField label="New password" type="password" name="password" autoComplete="new-password" error={errors.password} />
                        <AuthField label="Confirm new password" type="password" name="password_confirmation" autoComplete="new-password" error={errors.password_confirmation} />
                        <Button className="justify-self-start" disabled={processing}>Change password</Button>
                    </>
                )}
            </Form>
            <section className="grid gap-4 border-t border-surface-border pt-6">
                <h2 className="font-medium">Connected accounts</h2>
                <SocialButtons connected={connectedProviders} />
            </section>
        </main>
    );
}
