import { Clause } from "./Clause.type";
import { getGroup, Group } from "./Group";

export interface QueryGroup extends Group {
  combinedSets: any[];
  orClause: Clause[];
}

export function getQueryGroup(
  groupId: string,
  groupName: string,
  orClauses: Clause[]
) {
  //   const qg: QueryGroup = {...getGroup(groupId, groupName, 1)}
}
