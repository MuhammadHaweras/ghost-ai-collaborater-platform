import { useRef, useState, useTransition } from 'react';

export interface EditorProject {
    id: string;
    name: string;
    role: 'owner' | 'collaborator';
}

export type ProjectDialogAction =
    | { type: 'create' }
    | { type: 'rename' | 'delete'; project: EditorProject };

const mockProjects: EditorProject[] = [
    { id: 'checkout', name: 'Checkout service', role: 'owner' },
    { id: 'events', name: 'Event pipeline', role: 'collaborator' },
];

export function useProjectDialogs() {
    const [projects, setProjects] = useState(mockProjects);
    const [dialog, setDialog] = useState<ProjectDialogAction | null>(null);
    const [name, setName] = useState('');
    const [isSubmitting, startTransition] = useTransition();
    const nextId = useRef(1);
    const trigger = useRef<HTMLButtonElement | null>(null);
    const slug = name.trim().normalize('NFKD').replace(/\p{M}/gu, '').toLowerCase()
        .replace(/[^\p{L}\p{N}]+/gu, '-').replace(/^-|-$/g, '');

    function open(action: ProjectDialogAction, button: HTMLButtonElement) {
        if (action.type !== 'create' && action.project.role !== 'owner') {
            return;
        }

        trigger.current = button;
        setName(action.type === 'rename' ? action.project.name : '');
        setDialog(action);
    }

    function close() {
        setDialog(null);
    }

    function submit() {
        const trimmedName = name.trim();
        if (!dialog || isSubmitting || (dialog.type !== 'delete' && !trimmedName)) {
            return;
        }

        startTransition(() => {
            switch (dialog.type) {
                case 'create': {
                    const project: EditorProject = { id: String(nextId.current++), name: trimmedName, role: 'owner' };
                    setProjects((current) => [...current, project]);
                    break;
                }
                case 'rename':
                    setProjects((current) => current.map((project) =>
                        project.id === dialog.project.id ? { ...project, name: trimmedName } : project,
                    ));
                    break;
                case 'delete':
                    setProjects((current) => current.filter((project) => project.id !== dialog.project.id));
                    break;
            }
            close();
        });
    }

    return { projects, dialog, name, setName, slug, isSubmitting, trigger, open, close, submit };
}
