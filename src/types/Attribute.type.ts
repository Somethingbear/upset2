export type Attribute<T> = {
  name: string;
  sort: number;
  type: string;
  values: Array<T>;
  min?: number;
  max?: number;
};
