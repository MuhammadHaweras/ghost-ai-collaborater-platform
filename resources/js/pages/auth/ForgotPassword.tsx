import { Form, Link } from '@inertiajs/react';
import { AuthField } from '@/components/auth/auth-field';
import { AuthLayout } from '@/components/auth/auth-layout';
import { Button } from '@/components/ui/button';

export default function ForgotPassword({ status }: { status: string | null }) {
    return (
        <AuthLayout title="Forgot password?">
            <p className="text-sm text-copy-secondary">Enter your account email to receive a password reset link.</p>
            {status && <p role="status" className="text-sm text-success">{status}</p>}
            <Form action="/forgot-password" method="post" className="grid gap-4">
                {({ errors, processing }) => (
                    <>
                        <AuthField label="Email" type="email" name="email" autoComplete="email" error={errors.email} />
                        <Button disabled={processing}>Send reset link</Button>
                    </>
                )}
            </Form>
            <Link href="/login" className="text-sm text-brand hover:underline">Back to sign in</Link>
        </AuthLayout>
    );
}
