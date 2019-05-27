import { BaseElement, getBaseElement } from "./BaseElement";

export interface BaseSet extends BaseElement {
  combinedSets: number[];
  count_combinedSets: number;
  depth: number;
}

export function getBaseSet(
  setId: string,
  setName: string,
  combinedSets: number[],
  setData: number[],
  depth: number = 0
): BaseSet {
  return {
    ...getBaseElement(setId, setName),
    combinedSets: combinedSets,
    count_combinedSets: combinedSets.reduce(
      (acc: number, val: number) => (val !== 0 ? acc + 1 : acc),
      0
    ),
    depth: depth,
    items: setData,
    setSize: setData.length,
    dataRatio: setData.length / depth
  };
}
