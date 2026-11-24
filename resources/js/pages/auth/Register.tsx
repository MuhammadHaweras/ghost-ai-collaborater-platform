import { Form, Link } from '@inertiajs/react';
import { AuthField } from '@/components/auth/auth-field';
import { AuthLayout } from '@/components/auth/auth-layout';
import { Button } from '@/components/ui/button';

export default function Register() {
    return (
        <AuthLayout title="Create an account">
            <Form action="/register" method="post" className="grid gap-4">
                {({ errors, processing }) => (
                    <>
                        <AuthField label="Name" name="name" autoComplete="name" error={errors.name} />
                        <AuthField label="Email" type="email" name="email" autoComplete="email" error={errors.email} />
                        <AuthField label="Password" type="password" name="password" autoComplete="new-password" error={errors.password} />
                        <AuthField label="Confirm password" type="password" name="password_confirmation" autoComplete="new-password" error={errors.password_confirmation} />
                        <Button disabled={processing}>Create account</Button>
                    </>
                )}
            </Form>
            <p className="text-sm text-copy-muted">Already have an account? <Link href="/login" className="text-brand hover:underline">Sign in</Link></p>
        </AuthLayout>
    );
}
