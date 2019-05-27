import { BaseElement, getBaseElement } from "./BaseElement";
import { Subset } from "./Subset";
import { RowType } from "./RowType.enum";

export interface Aggregate extends BaseElement {
  expectedProb: number;
  level: number;
  isCollasped: boolean;
  subsets: Subset[];
}

export function getAggregate(
  aggId: string,
  aggName: string,
  level: number
): Aggregate {
  const agg: Aggregate = {
    ...getBaseElement(aggId, aggName),
    type: RowType.AGGREGATE,
    subsets: [],
    isCollasped: true,
    level: level,
    expectedProb: 0,
    disproportionality: 0
  };

  return agg;
}

export function addSubsetToAggregate(
  agg: Aggregate,
  subset: Subset
): Aggregate {
  agg.subsets.push(subset);
  agg.items = agg.items.concat(subset.items);
  agg.setSize += subset.setSize;
  agg.expectedProb += subset.expectedProb;
  agg.disproportionality += subset.disproportionality;
  return agg;
}
