import { Eye, EyeOff } from 'lucide-react';
import { useId, useState, type ComponentProps } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface AuthFieldProps extends ComponentProps<'input'> {
    label: string;
    name: string;
    error?: string;
}

export function AuthField({ label, error, id, type, className, ...input }: AuthFieldProps) {
    const generatedId = useId();
    const fieldId = id ?? generatedId;
    const [isVisible, setIsVisible] = useState(false);
    const isPassword = type === 'password';
    const VisibilityIcon = isVisible ? EyeOff : Eye;

    return (
        <div className="grid gap-1.5">
            <label htmlFor={fieldId} className="text-sm font-medium">{label}</label>
            <div className="relative">
                <Input
                    {...input}
                    required={input.required ?? true}
                    id={fieldId}
                    type={isPassword && isVisible ? 'text' : type}
                    aria-invalid={!!error}
                    aria-describedby={error ? fieldId + '-error' : undefined}
                    className={cn(
                        'text-copy-primary caret-brand autofill:[-webkit-text-fill-color:var(--text-primary)] autofill:inset-shadow-[0_0_0_1000px_var(--bg-elevated)]',
                        isPassword && 'pr-11 [&::-ms-reveal]:hidden',
                        className,
                    )}
                />
                {isPassword && (
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        aria-label={`${isVisible ? 'Hide' : 'Show'} ${label.toLowerCase()}`}
                        aria-controls={fieldId}
                        disabled={input.disabled}
                        className="absolute inset-y-0 right-1 my-auto text-copy-secondary hover:text-brand"
                        onClick={() => setIsVisible(visible => !visible)}
                    >
                        <VisibilityIcon aria-hidden="true" />
                    </Button>
                )}
            </div>
            {error && <p id={fieldId + '-error'} role="alert" className="text-sm text-error">{error}</p>}
        </div>
    );
}
