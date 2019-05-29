/*eslint no-loop-func: 0 */

import { Data, Membership } from "../types/Data.type";
import { Subset, getSubset } from "../types/Subset";

export function setupSubsets(data: Data) {
  const combinations = Math.pow(2, data.usedSets.length) - 1;
  const subsets: Subset[] = [];
  const membership: Membership = {};

  let aggIntersection: { [key: string]: number[] } = {};

  const listUsedSets = data.usedSets.map(s => s.id);

  const setAttribute = data.attributes.filter(attr => attr.type === "sets")[0];

  setAttribute.values.forEach((listOfSets, idx) => {
    const signature = createSignature(listUsedSets, listOfSets as any);
    if (aggIntersection[signature] == null) {
      aggIntersection[signature] = [idx];
    } else {
      aggIntersection[signature].push(idx);
    }
  });

  let tempBitMask = 0;
  let usedSetLength = data.usedSets.length;
  let combinedSetsFlat = "";
  let actualBit = -1;
  let names: string[] = [];

  for (let bitmask = 0; bitmask <= combinations; ++bitmask) {
    tempBitMask = bitmask;

    let combinedSets: number[] = Array.apply(null, new Array(usedSetLength))
      .map(_ => {
        actualBit = tempBitMask % 2;
        tempBitMask = (tempBitMask - actualBit) / 2;
        return +actualBit;
      })
      .reverse();

    combinedSetsFlat = combinedSets.join("");

    names = [];
    let expVal = 1;
    let unExpVal = 1;

    combinedSets.forEach((d, i) => {
      if (d === 1) {
        names.push(data.usedSets[i].elementName);
        expVal = expVal * data.usedSets[i].dataRatio;
      } else {
        unExpVal = unExpVal * (1 - data.usedSets[i].dataRatio);
      }
    });

    expVal *= unExpVal;

    let list = aggIntersection[combinedSetsFlat];

    if (list == null) list = [];

    let name = "";

    names = names.map(n => n.replace(" ", "_"));

    if (names.length > 0) name = names.reverse().join(" ");
    if (name === "") name = "Unincluded";

    let subset = getSubset(
      bitmask.toString(),
      name,
      combinedSets,
      list,
      expVal,
      data.depth
    );

    subset.itemList.forEach(item => {
      if (!membership[item]) membership[item] = [];
      membership[item].push(subset.id);
    });

    subsets.push(subset);
  }
  aggIntersection = {};

  return {
    combinations,
    subsets,
    membership
  };
}

function createSignature(
  usedSets: string[],
  sets: (string | number)[]
): string {
  return usedSets.map(usedSet => (sets.indexOf(usedSet) > -1 ? 1 : 0)).join("");
}
