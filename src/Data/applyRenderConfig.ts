import { Data, RenderRow } from "../types/Data.type";
import { RenderConfig } from "./RenderConfiguration/RenderConfig";
import { SortBy } from "../types/SortBy.enum";
import { Subset } from "../types/Subset";
import * as d3 from "d3";

export function applyRenderConfig(
  data: Data,
  config: RenderConfig
): RenderRow[] {
  const {
    // firstLevelAggregation,
    // secondLevelAggregation,
    // firstOverlap,
    // secondOverlap,
    sortBy,
    // sortBySetId,
    // collapseAll,
    // minDegree,
    // maxDegree
    hideEmptyIntersections
  } = config;

  let rows: RenderRow[] = data.subsets;

  rows = applySort(rows, sortBy);

  if (hideEmptyIntersections) rows = rows.filter(row => row.setSize > 0);

  return rows;
}

function applySort(
  rows: RenderRow[],
  sortBy: SortBy,
  desc: boolean = false
): RenderRow[] {
  switch (SortBy[sortBy]) {
    case SortBy.CARDINALITY:
      return rows.sort((r1, r2) => r2.setSize - r1.setSize);
    case SortBy.DEGREE:
      rows = rows.sort(
        (r1, r2) =>
          d3.sum((r1 as Subset).combinedSets) -
          d3.sum((r2 as Subset).combinedSets)
      );

      return rows;
    case SortBy.DEVIATION:
      console.log("object");
      rows = rows.sort(
        (r1, r2) => r2.disproportionality - r1.disproportionality
      );
      return rows;
    case SortBy.SET:
      return rows;
    default:
      return rows;
  }
}
