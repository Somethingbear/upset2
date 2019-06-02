import { Data, RenderRow } from "../types/Data.type";
import { RenderConfig } from "./RenderConfiguration/RenderConfig";

export function applyRenderConfig(
  data: Data,
  config: RenderConfig
): RenderRow[] {
  const {
    // firstLevelAggregation,
    // secondLevelAggregation,
    // firstOverlap,
    // secondOverlap,
    // sortBy,
    // sortBySetId,
    // collapseAll,
    // minDegree,
    // maxDegree
    hideEmptyIntersections
  } = config;

  let rows: RenderRow[] = data.subsets;

  if (hideEmptyIntersections) rows = rows.filter(row => row.setSize > 0);

  return rows;
}
