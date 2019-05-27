import { BaseElement, getBaseElement } from "./BaseElement";
import { RowType } from "./RowType.enum";

export interface Separator extends BaseElement {}

export function getSeparator(id: string, name: string): Separator {
  return { ...getBaseElement(id, name), type: RowType.SEPERATOR };
}
