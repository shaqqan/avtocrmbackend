export const baseUrl = process.env.SERVER_URL || 'http://localhost:3000';

export function asset(path: string): string | null {
    if (!path) return null;

    if (path.includes('\\')) {
        path = path.replace(/\\/g, '/');
    }

    return `${baseUrl.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;
}