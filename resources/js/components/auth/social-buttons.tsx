import { usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';

export function SocialButtons({ connected }: { connected?: string[] }) {
    const { errors } = usePage().props;

    return (
        <div className="grid gap-2">
            {['Google', 'GitHub'].map(label => {
                const provider = label.toLowerCase();
                return connected?.includes(provider) ? (
                    <p key={provider} className="text-sm text-copy-secondary">{label} connected</p>
                ) : (
                    <Button key={provider} variant="outline" asChild>
                        <a href={`/auth/${provider}/redirect`}>{connected ? 'Connect' : 'Continue with'} {label}</a>
                    </Button>
                );
            })}
            {errors.social && <p role="alert" className="text-sm text-error">{errors.social}</p>}
        </div>
    );
}
