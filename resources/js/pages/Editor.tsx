import { Head } from '@inertiajs/react';
import { useId, useRef, useState } from 'react';
import { EditorNavbar } from '@/components/editor/editor-navbar';
import { ProjectSidebar } from '@/components/editor/project-sidebar';

export default function Editor() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const sidebarId = useId();
    const toggleButtonRef = useRef<HTMLButtonElement>(null);

    function closeSidebar() {
        setIsSidebarOpen(false);
        toggleButtonRef.current?.focus();
    }

    return (
        <div className="flex h-dvh flex-col bg-base text-copy-primary">
            <Head title="Editor" />
            <EditorNavbar
                isSidebarOpen={isSidebarOpen}
                sidebarId={sidebarId}
                onToggleSidebar={() => setIsSidebarOpen((isOpen) => !isOpen)}
                toggleButtonRef={toggleButtonRef}
            />
            <div className="relative isolate min-h-0 flex-1 overflow-hidden">
                <ProjectSidebar id={sidebarId} isOpen={isSidebarOpen} onClose={closeSidebar} />
                <main aria-label="Editor canvas" className="h-full" />
            </div>
        </div>
    );
}
