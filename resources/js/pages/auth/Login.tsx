import { Form, Link } from '@inertiajs/react';
import { AuthField } from '@/components/auth/auth-field';
import { AuthLayout } from '@/components/auth/auth-layout';
import { Button } from '@/components/ui/button';

export default function Login({ status }: { status: string | null }) {
    return (
        <AuthLayout title="Sign in">
            {status && <p role="status" className="text-sm text-success">{status}</p>}
            <Form action="/login" method="post" className="grid gap-4">
                {({ errors, processing }) => (
                    <>
                        <AuthField label="Email" name="email" type="email" autoComplete="username" error={errors.email} />
                        <AuthField label="Password" name="password" type="password" autoComplete="current-password" error={errors.password} />
                        <Link href="/forgot-password" className="justify-self-end text-sm text-brand hover:underline">Forgot password?</Link>
                        <Button disabled={processing}>Sign in</Button>
                    </>
                )}
            </Form>
            <p className="text-sm text-copy-muted">New to Ghost AI? <Link href="/register" className="text-brand hover:underline">Create an account</Link></p>
        </AuthLayout>
    );
}
