import { getSet, Set } from "../types/Set";

export function getSets(
  rawSets: number[][],
  setNames: string[],
  depth: number,
  noOfSets: number
) {
  const setPrefix = "Set_";

  const sets: Set[] = [];
  const usedSets: Set[] = [];
  const unusedSets: Set[] = [];

  for (let i = 0; i < setNames.length; ++i) {
    let combinedSets = Array.apply(null, new Array(rawSets.length)).map(
      Number.prototype.valueOf,
      0
    );

    combinedSets[i] = 1;

    const set = getSet(
      `${setPrefix}${i}`,
      setNames[i],
      combinedSets,
      rawSets[i],
      depth
    );

    if (i < noOfSets) {
      set.isSelected = true;
      usedSets.push(set);
    } else {
      set.isSelected = false;
      unusedSets.push(set);
    }

    sets.push(set);
  }

  return {
    sets,
    unusedSets,
    usedSets
  };
}
