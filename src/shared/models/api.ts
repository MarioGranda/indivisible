export interface Problem {
    title: string;
    status: number;
    detail?: string;
    type?: string;
    instance?: string;
    [key: string]: unknown;
}
