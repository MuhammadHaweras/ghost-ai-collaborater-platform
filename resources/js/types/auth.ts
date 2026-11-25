export interface AuthenticatedPageProps {
    auth: {
        user: { name: string; email: string };
    };
}
