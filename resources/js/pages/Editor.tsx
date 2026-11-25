import { Head } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import { useId, useRef, useState } from 'react';
import { EditorNavbar } from '@/components/editor/editor-navbar';
import { ProjectDialog } from '@/components/editor/project-dialog';
import { ProjectSidebar } from '@/components/editor/project-sidebar';
import { useProjectDialogs } from '@/components/editor/use-project-dialogs';
import { Button } from '@/components/ui/button';
import type { AuthenticatedPageProps } from '@/types/auth';

export default function Editor({ auth }: AuthenticatedPageProps) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const sidebarId = useId();
    const toggleButtonRef = useRef<HTMLButtonElement>(null);
    const projectDialogs = useProjectDialogs();

    function closeSidebar() {
        setIsSidebarOpen(false);
        toggleButtonRef.current?.focus();
    }

    return (
        <div className="flex h-dvh flex-col bg-base text-copy-primary">
            <Head title="Editor" />
            <EditorNavbar
                accountName={auth.user.name}
                isSidebarOpen={isSidebarOpen}
                sidebarId={sidebarId}
                onToggleSidebar={() => setIsSidebarOpen((isOpen) => !isOpen)}
                toggleButtonRef={toggleButtonRef}
            />
            <div className="relative isolate min-h-0 flex-1 overflow-hidden">
                {isSidebarOpen && (
                    <button
                        type="button"
                        tabIndex={-1}
                        aria-label="Dismiss projects sidebar"
                        className="fixed inset-0 z-10 bg-base/65 md:hidden"
                        onClick={closeSidebar}
                    />
                )}
                <ProjectSidebar
                    id={sidebarId}
                    isOpen={isSidebarOpen}
                    onClose={closeSidebar}
                    projects={projectDialogs.projects}
                    onOpenDialog={projectDialogs.open}
                />
                <main aria-label="Editor canvas" className="grid h-full place-items-center overflow-y-auto px-6 py-8 text-center">
                    <div className="flex max-w-2xl flex-col items-center gap-3">
                        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Create a project or open an existing one</h1>
                        <p className="text-sm text-copy-muted sm:text-base">Start a new architecture workspace, or choose a project from the sidebar.</p>
                        <Button type="button" className="mt-2" onClick={(event) => projectDialogs.open({ type: 'create' }, event.currentTarget)}>
                            <Plus className="size-5" aria-hidden="true" />
                            New Project
                        </Button>
                    </div>
                </main>
            </div>
            <ProjectDialog state={projectDialogs} onTriggerRemoved={() => toggleButtonRef.current?.focus()} />
        </div>
    );
}
