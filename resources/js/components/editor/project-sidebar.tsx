import { Plus, X } from 'lucide-react';
import { useId } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

interface ProjectSidebarProps {
    id: string;
    isOpen: boolean;
    onClose: () => void;
    onNewProject?: () => void;
}

export function ProjectSidebar({ id, isOpen, onClose, onNewProject }: ProjectSidebarProps) {
    const titleId = useId();

    return (
        <aside
            id={id}
            aria-labelledby={titleId}
            inert={!isOpen}
            onKeyDown={(event) => {
                if (event.key === 'Escape' && !event.defaultPrevented) {
                    event.preventDefault();
                    onClose();
                }
            }}
            className={cn(
                'absolute inset-y-3 left-3 z-10 flex w-80 max-w-[calc(100%-1.5rem)] flex-col gap-4 overflow-y-auto rounded-2xl border border-surface-border bg-surface/95 p-4 shadow-lg backdrop-blur-sm motion-safe:transition-transform motion-safe:duration-200 motion-safe:ease-out',
                !isOpen && '-translate-x-[calc(100%+1.5rem)]',
            )}
        >
            <div className="flex shrink-0 items-center justify-between gap-3">
                <h2 id={titleId} className="font-semibold">Projects</h2>
                <Button type="button" variant="ghost" size="icon" aria-label="Close projects" onClick={onClose}>
                    <X className="size-5" aria-hidden="true" />
                </Button>
            </div>

            <Tabs defaultValue="mine" className="flex-1 gap-4">
                <TabsList className="w-full" aria-label="Project lists">
                    <TabsTrigger value="mine">My Projects</TabsTrigger>
                    <TabsTrigger value="shared">Shared</TabsTrigger>
                </TabsList>
                <TabsContent value="mine">
                    <p className="rounded-xl border border-dashed border-surface-border px-3 py-6 text-center text-sm text-copy-muted">
                        No projects yet.
                    </p>
                </TabsContent>
                <TabsContent value="shared">
                    <p className="rounded-xl border border-dashed border-surface-border px-3 py-6 text-center text-sm text-copy-muted">
                        No projects have been shared with you.
                    </p>
                </TabsContent>
            </Tabs>

            <Button type="button" className="w-full" onClick={onNewProject} disabled={!onNewProject}>
                <Plus className="size-5" aria-hidden="true" />
                New Project
            </Button>
        </aside>
    );
}
