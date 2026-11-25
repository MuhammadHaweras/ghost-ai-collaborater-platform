import { useId } from 'react';
import { EditorDialogContent } from '@/components/editor/editor-dialog-content';
import type { useProjectDialogs } from '@/components/editor/use-project-dialogs';
import { Button } from '@/components/ui/button';
import { Dialog, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

interface ProjectDialogProps {
    state: ReturnType<typeof useProjectDialogs>;
    onTriggerRemoved: () => void;
}

export function ProjectDialog({ state, onTriggerRemoved }: ProjectDialogProps) {
    const inputId = useId();
    const { dialog, name, isSubmitting, close, submit } = state;
    if (!dialog) {
        return null;
    }

    const isDelete = dialog.type === 'delete';
    const title = { create: 'Create Project', rename: 'Rename Project', delete: 'Delete Project' }[dialog.type];
    const description = dialog.type === 'create'
        ? 'Give your new architecture workspace a name.'
        : dialog.type === 'rename'
            ? `Choose a new name for “${dialog.project.name}”.`
            : `Delete “${dialog.project.name}”? This removes it from My Projects.`;

    return (
        <Dialog open onOpenChange={close}>
            <EditorDialogContent
                title={title}
                description={description}
                className="break-words"
                onCloseAutoFocus={(event) => {
                    event.preventDefault();
                    if (state.trigger.current?.isConnected) {
                        state.trigger.current.focus();
                    } else {
                        onTriggerRemoved();
                    }
                }}
            >
                <form
                    className="grid min-w-0 gap-4"
                    onSubmit={(event) => {
                        event.preventDefault();
                        submit();
                    }}
                    aria-busy={isSubmitting}
                >
                    {!isDelete && (
                        <div className="grid min-w-0 gap-2">
                            <label htmlFor={inputId} className="text-sm font-medium">Project name</label>
                            <Input
                                id={inputId}
                                type="text"
                                value={name}
                                required
                                onChange={(event) => state.setName(event.target.value)}
                                className="text-copy-primary caret-brand autofill:[-webkit-text-fill-color:var(--text-primary)] autofill:inset-shadow-[0_0_0_1000px_var(--bg-elevated)]"
                            />
                            {dialog.type === 'create' && (
                                <p className="text-sm text-copy-muted">
                                    Slug preview <output htmlFor={inputId} className="font-mono text-copy-secondary">{state.slug || '—'}</output>
                                </p>
                            )}
                        </div>
                    )}
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={close}>Cancel</Button>
                        <Button
                            type="submit"
                            variant={isDelete ? 'destructive' : 'default'}
                            disabled={isSubmitting || (!isDelete && !name.trim())}
                        >
                            {title}
                        </Button>
                    </DialogFooter>
                </form>
            </EditorDialogContent>
        </Dialog>
    );
}
