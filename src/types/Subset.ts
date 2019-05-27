import { Set, getSet } from "./Set";
import { RowType } from "./RowType.enum";

export interface Subset extends Set {
  expectedProb: number;
}

export function getSubset(
  setId: string,
  setName: string,
  combinedSets: number[],
  itemList: number[],
  expectedProb: number,
  depth: number
): Subset {
  const subset: Subset = {
    ...getSet(setId, setName, combinedSets, itemList, depth, true),
    expectedProb: expectedProb,
    depth: depth,
    type: RowType.SUBSET
  };

  const observedProb = (subset.setSize * 1.0) / subset.depth;
  subset.disproportionality = observedProb - expectedProb;

  return subset;
}

export function subsetString(subset: Subset): string {
  return `Subset ${subset.id}, No. of combined sets: ${
    subset.count_combinedSets
  }`;
}
