import { BaseSet, getBaseSet } from "./BaseSet";
import { RowType } from "./RowType.enum";

export interface Set extends BaseSet {
  isSelected: boolean;
  itemList: number[];
}

export function getSet(
  setId: string,
  setName: string,
  combinedSets: number[],
  itemList: number[],
  depth: number,
  isSuperCall: boolean
): Set {
  const set: Set = {
    ...getBaseSet(
      setId,
      setName,
      combinedSets,
      isSuperCall ? itemList : [],
      depth
    ),
    isSelected: false,
    type: RowType.SET,
    itemList: itemList
  };

  if (!isSuperCall) {
    set.items = itemList.filter(item => item !== 0);
    set.setSize = set.items.length;
  }

  set.depth = depth;
  set.dataRatio = set.setSize / set.depth;
  set.itemList = itemList;

  return set;
}
