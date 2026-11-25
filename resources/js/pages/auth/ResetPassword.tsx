import { Form, Link } from '@inertiajs/react';
import { AuthField } from '@/components/auth/auth-field';
import { AuthLayout } from '@/components/auth/auth-layout';
import { Button } from '@/components/ui/button';

interface ResetPasswordProps {
    token: string;
    email: string;
}

export default function ResetPassword({ token, email }: ResetPasswordProps) {
    return (
        <AuthLayout title="Reset password">
            <Form action="/reset-password" method="post" className="grid gap-4">
                {({ errors, processing }) => (
                    <>
                        <input type="hidden" name="token" value={token} />
                        {errors.token && <p role="alert" className="text-sm text-error">{errors.token}</p>}
                        <AuthField label="Email" type="email" name="email" autoComplete="username" defaultValue={email} error={errors.email} />
                        <AuthField label="New password" type="password" name="password" autoComplete="new-password" error={errors.password} />
                        <AuthField label="Confirm new password" type="password" name="password_confirmation" autoComplete="new-password" error={errors.password_confirmation} />
                        <Button disabled={processing}>Reset password</Button>
                    </>
                )}
            </Form>
            <Link href="/forgot-password" className="text-sm text-brand hover:underline">Request another reset link</Link>
        </AuthLayout>
    );
}
