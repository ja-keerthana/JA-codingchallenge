export interface PagedList<Type> {
    pageSize: number;
    pageIndex: number;
    items: Type [];
    totalItems: number;
}