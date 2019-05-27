import { BaseElement, getBaseElement } from "./BaseElement";
import { Aggregate, getAggregate, addSubsetToAggregate } from "./Aggregate";
import { Subset } from "./Subset";
import { AggregateBy } from "./AggregateBy.enum";
import { RowType } from "./RowType.enum";

export interface Group extends BaseElement {
  aggregate: Aggregate;
  disproportionalitySum: number;
  disproportionality: number;
  expectedProb: number;
  hiddenSets: Subset[];
  visibleSets: Subset[];
  subsets: Subset[];
  level: number;
  nestedGroups: Array<Group>;
  isCollapsed: boolean;
  aggregateBy: AggregateBy;
  setMemberships: number[];
}

export function getGroup(
  groupId: string,
  groupName: string,
  level: number,
  aggregateBy: AggregateBy,
  setMemberships: number[]
): Group {
  return {
    ...getBaseElement(groupId, groupName),
    type: RowType.GROUP,
    isCollapsed: false,
    nestedGroups: [],
    level: level ? level : 1,
    subsets: [],
    visibleSets: [],
    aggregate: getAggregate(`empty${groupId}`, `Subsets`, level + 1),
    setMemberships: setMemberships,
    aggregateBy: aggregateBy,
    hiddenSets: [],
    expectedProb: 0,
    disproportionality: 0,
    disproportionalitySum: 0
  };
}

export function addSubsetToGroup(group: Group, subset: Subset): Group {
  group.subsets.push(subset);

  if (subset.setSize > 0) {
    group.visibleSets.unshift(subset);
  } else {
    group.hiddenSets.unshift(subset);
    group.aggregate = addSubsetToAggregate(group.aggregate, subset);
  }

  group.items = group.items.concat(subset.items);
  group.setSize += subset.setSize;
  group.expectedProb += subset.expectedProb;
  group.disproportionality += subset.disproportionality;

  return group;
}

export function addNestedGroup(parentGroup: Group, nestedGroup: Group): Group {
  parentGroup.nestedGroups.push(nestedGroup);

  parentGroup.hiddenSets = parentGroup.hiddenSets.concat(
    nestedGroup.hiddenSets
  );
  parentGroup.visibleSets = parentGroup.visibleSets.concat(
    nestedGroup.visibleSets
  );
  nestedGroup.subsets.forEach(subset => {
    parentGroup.aggregate = addSubsetToAggregate(parentGroup.aggregate, subset);
  });

  return parentGroup;
}

export function groupContainsSubset(group: Group, subset: Subset): boolean {
  return group.subsets.indexOf(subset) >= 0;
}
