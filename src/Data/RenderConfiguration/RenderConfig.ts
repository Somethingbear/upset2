import { AggregateBy } from "./AggregateBy.enum";
import { SortBy } from "../../types/SortBy.enum";

export interface RenderConfig {
  firstLevelAggregation: AggregateBy;
  secondLevelAggregation: AggregateBy;
  firstOverlap: number;
  secondOverlap: number;
  sortBy: SortBy;
  collapseAll: boolean;
  hideEmptyIntersections: boolean;
  minDegree: number;
  maxDegree: number;
  sortBySetId: string;
}

export function getDefaultRenderConfig(): RenderConfig {
  return {
    firstLevelAggregation: AggregateBy.NONE,
    secondLevelAggregation: AggregateBy.NONE,
    firstOverlap: 0,
    secondOverlap: 0,
    sortBy: SortBy.CARDINALITY,
    collapseAll: false,
    hideEmptyIntersections: true,
    minDegree: 0,
    maxDegree: 3,
    sortBySetId: ""
  };
}
