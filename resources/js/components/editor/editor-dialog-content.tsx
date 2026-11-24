import type { ComponentProps, ReactNode } from 'react';
import {
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

interface EditorDialogContentProps extends Omit<ComponentProps<typeof DialogContent>, 'title'> {
    title: string;
    description: string;
    actions?: ReactNode;
}

export function EditorDialogContent({
    title,
    description,
    actions,
    children,
    className,
    ...props
}: EditorDialogContentProps) {
    return (
        <DialogContent
            className={cn('rounded-3xl border-surface-border bg-elevated text-copy-primary', className)}
            {...props}
        >
            <DialogHeader className="pr-6">
                <DialogTitle>{title}</DialogTitle>
                <DialogDescription className="text-copy-muted">{description}</DialogDescription>
            </DialogHeader>
            {children}
            {actions && <DialogFooter>{actions}</DialogFooter>}
        </DialogContent>
    );
}
