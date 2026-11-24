import { Link, router } from '@inertiajs/react';
import { ChevronDown, PanelLeftClose, PanelLeftOpen, UserRound } from 'lucide-react';
import { DropdownMenu } from 'radix-ui';
import type { ReactNode, Ref } from 'react';
import { Button } from '@/components/ui/button';

interface EditorNavbarProps {
    accountName: string;
    isSidebarOpen: boolean;
    sidebarId: string;
    onToggleSidebar: () => void;
    toggleButtonRef?: Ref<HTMLButtonElement>;
    center?: ReactNode;
}

export function EditorNavbar({
    accountName,
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
            <div className="min-w-0 justify-self-end">
                <DropdownMenu.Root>
                    <DropdownMenu.Trigger asChild>
                        <Button variant="ghost" className="max-w-full" aria-label={`Account menu for ${accountName}`}>
                            <UserRound aria-hidden="true" />
                            <span className="truncate">{accountName}</span>
                            <ChevronDown aria-hidden="true" />
                        </Button>
                    </DropdownMenu.Trigger>
                    <DropdownMenu.Portal>
                        <DropdownMenu.Content align="end" sideOffset={6} className="z-50 grid min-w-40 rounded-xl border border-surface-border bg-elevated p-1 text-sm shadow-lg">
                            <DropdownMenu.Item asChild>
                                <Link href="/profile" className="rounded-lg px-3 py-2 outline-none data-highlighted:bg-subtle">Profile settings</Link>
                            </DropdownMenu.Item>
                            <DropdownMenu.Item onSelect={() => router.post('/logout')} className="cursor-pointer rounded-lg px-3 py-2 outline-none data-highlighted:bg-subtle">
                                Sign out
                            </DropdownMenu.Item>
                        </DropdownMenu.Content>
                    </DropdownMenu.Portal>
                </DropdownMenu.Root>
            </div>
        </header>
    );
}
