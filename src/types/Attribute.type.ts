export type Attribute<T extends number | string> = {
  name: string;
  sort: number;
  type: string;
  values: Array<T>;
  renderFromSubsets?: boolean;
  min?: number;
  max?: number;
};
