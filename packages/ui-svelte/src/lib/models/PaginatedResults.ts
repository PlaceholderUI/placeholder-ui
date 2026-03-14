export interface PaginatedResults<T> {
    page: number;
    totalPages: number;
    results: T[];
}