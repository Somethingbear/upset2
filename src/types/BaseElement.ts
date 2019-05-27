import { RowType } from "./RowType.enum";

export interface BaseElement {
  id: string;
  elementName: string;
  items: number[];
  setSize: number;
  dataRatio: number;
  type: RowType;
  disproportionality: number;
}

export function getBaseElement(id: string, elementName: string): BaseElement {
  return {
    id: id,
    elementName: elementName,
    items: [],
    setSize: 0,
    dataRatio: 0.0,
    type: RowType.UNDEFINED,
    disproportionality: 0
  };
}
