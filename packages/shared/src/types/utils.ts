export type ISODate = string;
export type AtLeast<T, K extends keyof T> = Partial<T> & Pick<T, K>;
export type TinyInt = 0 | 1;
export type StringBoolean = "true" | "false";
export type GraphQL<T> = {
  data: T;
  extensions?: unknown;
};
