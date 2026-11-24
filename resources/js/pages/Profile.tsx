import { Form, Head, Link } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import { AuthField } from '@/components/auth/auth-field';
import { Button } from '@/components/ui/button';
import type { AuthenticatedPageProps } from '@/types/auth';

export default function Profile({ auth }: AuthenticatedPageProps) {
    return (
        <main className="mx-auto grid w-full max-w-lg gap-8 px-6 py-10">
            <Head title="Profile settings" />
            <Link href="/editor" className="inline-flex items-center gap-2 justify-self-start text-sm text-brand hover:underline">
                <ArrowLeft aria-hidden="true" className="size-4" /> Back to editor
            </Link>
            <h1 className="text-2xl font-semibold tracking-tight">Profile settings</h1>
            <Form action="/user/profile-information" method="put" errorBag="updateProfileInformation" className="grid gap-4">
                {({ processing, errors, recentlySuccessful }) => (
                    <>
                        <h2 className="font-medium">Account details</h2>
                        <AuthField label="Name" name="name" autoComplete="name" defaultValue={auth.user.name} error={errors.name} />
                        <AuthField label="Email" type="email" name="email" autoComplete="email" defaultValue={auth.user.email} error={errors.email} />
                        <Button className="justify-self-start" disabled={processing}>Save changes</Button>
                        {recentlySuccessful && <p role="status" className="text-sm text-success">Account details saved.</p>}
                    </>
                )}
            </Form>
            <Form action="/user/password" method="put" errorBag="updatePassword" resetOnSuccess className="grid gap-4 border-t border-surface-border pt-6">
                {({ processing, errors, recentlySuccessful }) => (
                    <>
                        <h2 className="font-medium">Change password</h2>
                        <AuthField label="Current password" type="password" name="current_password" autoComplete="current-password" error={errors.current_password} />
                        <AuthField label="New password" type="password" name="password" autoComplete="new-password" error={errors.password} />
                        <AuthField label="Confirm new password" type="password" name="password_confirmation" autoComplete="new-password" error={errors.password_confirmation} />
                        <Button className="justify-self-start" disabled={processing}>Change password</Button>
                        {recentlySuccessful && <p role="status" className="text-sm text-success">Password updated.</p>}
                    </>
                )}
            </Form>
        </main>
    );
}
