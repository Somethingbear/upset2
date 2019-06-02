import { Set } from "./Set";
import { Subset } from "./Subset";
import { Attribute } from "./Attribute.type";
import { Group } from "./Group";

export type Membership = { [key: string]: string[] };
export interface Data {
  name: string;
  sets: Array<Set>;
  usedSets: Array<Set>;
  subsets: Array<Subset>;
  attributes: Array<Attribute<string | number>>;
  selectedAttributes: Array<Attribute<string | number>>;
  combinations: number;
  allItems: number[];
  depth: number;
  noDefaultSets: number;
  unusedSets: Array<Set>;
  renderRows: Array<RenderRow>;
  membership: Membership;
  collapsedList: string[];
  rawData: any[];
}

export type RenderRow = Group | Subset;

export function getData(): Data {
  return {
    name: "",
    sets: [],
    usedSets: [],
    subsets: [],
    attributes: [],
    selectedAttributes: [],
    combinations: 0,
    allItems: [],
    depth: 0,
    noDefaultSets: 6,
    unusedSets: [],
    membership: {},
    collapsedList: [],
    rawData: [],
    renderRows: []
  };
}
