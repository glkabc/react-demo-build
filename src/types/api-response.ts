export interface ApiResponse<T> {
  code: number;
  mesg: string;
  data: T;
}
