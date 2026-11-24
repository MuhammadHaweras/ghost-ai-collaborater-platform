import { PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import type { ReactNode, Ref } from 'react';
import { Button } from '@/components/ui/button';

interface EditorNavbarProps {
    isSidebarOpen: boolean;
    sidebarId: string;
    onToggleSidebar: () => void;
    toggleButtonRef?: Ref<HTMLButtonElement>;
    center?: ReactNode;
}

export function EditorNavbar({
    isSidebarOpen,
    sidebarId,
    onToggleSidebar,
    toggleButtonRef,
    center,
}: EditorNavbarProps) {
    const ToggleIcon = isSidebarOpen ? PanelLeftClose : PanelLeftOpen;

    return (
        <header className="grid h-14 shrink-0 grid-cols-[1fr_auto_1fr] items-center border-b border-surface-border bg-surface px-3">
            <div>
                <Button
                    ref={toggleButtonRef}
                    type="button"
                    variant="ghost"
                    size="icon"
                    aria-label={isSidebarOpen ? 'Close projects sidebar' : 'Open projects sidebar'}
                    aria-controls={sidebarId}
                    aria-expanded={isSidebarOpen}
                    onClick={onToggleSidebar}
                >
                    <ToggleIcon className="size-5" aria-hidden="true" />
                </Button>
            </div>
            <div className="min-w-0">{center}</div>
            <div />
        </header>
    );
}
