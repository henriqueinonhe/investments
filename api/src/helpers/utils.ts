export const defaultStartDate = "1970-01-01";
export const defaultEndDate = "2200-01-01";

export type PaginatedEntity<T> = {
  data : Array<T>;
  meta : {
    page : number;
    perPage : number;
    total : number;
    lastPage : number;
  };
};

export function computeLastPage(total : number, perPage : number) : number {
  return Math.max(Math.ceil(total / perPage), 1);
}