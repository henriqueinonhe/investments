export type PaginatedData<T> = {
  data : Array<T>;
  meta : {
    total : number;
    page : number;
    perPage : number;
    lastPage : number;
  }
};