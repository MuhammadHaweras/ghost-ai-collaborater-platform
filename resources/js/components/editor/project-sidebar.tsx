import { Pencil, Plus, Trash2, X } from 'lucide-react';
import { useId } from 'react';
import type { EditorProject, ProjectDialogAction } from '@/components/editor/use-project-dialogs';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

interface ProjectSidebarProps {
    id: string;
    isOpen: boolean;
    onClose: () => void;
    projects: EditorProject[];
    onOpenDialog: (action: ProjectDialogAction, button: HTMLButtonElement) => void;
}

export function ProjectSidebar({ id, isOpen, onClose, projects, onOpenDialog }: ProjectSidebarProps) {
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
                {(['mine', 'shared'] as const).map((tab) => {
                    const role = tab === 'mine' ? 'owner' : 'collaborator';
                    const items = projects.filter((project) => project.role === role);
                    return (
                        <TabsContent key={tab} value={tab}>
                            {items.length ? (
                                <ul className="grid gap-1">
                                    {items.map((project) => (
                                        <li key={project.id} className="flex min-h-10 items-center gap-1 rounded-xl bg-elevated px-2">
                                            <span className="min-w-0 flex-1 truncate px-1 text-sm" title={project.name}>{project.name}</span>
                                            {project.role === 'owner' && <>
                                                <Button type="button" size="icon-sm" variant="ghost" aria-label={`Rename ${project.name}`}
                                                    onClick={(event) => onOpenDialog({ type: 'rename', project }, event.currentTarget)}>
                                                    <Pencil aria-hidden="true" />
                                                </Button>
                                                <Button type="button" size="icon-sm" variant="ghost" aria-label={`Delete ${project.name}`}
                                                    onClick={(event) => onOpenDialog({ type: 'delete', project }, event.currentTarget)}>
                                                    <Trash2 aria-hidden="true" />
                                                </Button>
                                            </>}
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="rounded-xl border border-dashed border-surface-border px-3 py-6 text-center text-sm text-copy-muted">
                                    {tab === 'mine' ? 'No projects yet.' : 'No projects have been shared with you.'}
                                </p>
                            )}
                        </TabsContent>
                    );
                })}
            </Tabs>

            <Button type="button" className="w-full" onClick={(event) => onOpenDialog({ type: 'create' }, event.currentTarget)}>
                <Plus className="size-5" aria-hidden="true" />
                New Project
            </Button>
        </aside>
    );
}
