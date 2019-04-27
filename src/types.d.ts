export type d3Selection = d3.Selection<
  any,
  any,
  HTMLElement | d3.BaseType,
  any
>;

export type d3Scale<T> = d3.ScaleLinear<T, T>;

export type d3ScaleNumeric = d3Scale<number>;
