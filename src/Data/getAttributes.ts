import { Set } from "../types/Set";
import * as d3 from "d3";
import { Dataset } from "../types/Dataset.type";
import { Attribute } from "../types/Attribute.type";

export function getAttributes(
  rawSets: number[][],
  setNames: string[],
  header: string[],
  data: d3.DSVParsedArray<d3.DSVRowString>,
  sets: Set[],
  info: Dataset,
  depth: number
) {
  const attributes: Attribute<string | number>[] = [];

  for (let i = 0; i < info.meta.length; ++i) {
    const metaDef = info.meta[i];

    const attr: Attribute<string | number> = {
      name: metaDef.name || header[metaDef.index],
      type: metaDef.type,
      values: data.map((row, row_idx) => {
        let val: string = Object.values(row)[metaDef.index] as string;
        switch (metaDef.type) {
          case "integer": {
            let intVal = parseInt(val, 10);
            if (isNaN(intVal)) {
              console.error(`Cannot parse ${intVal} as integer`);
              return NaN;
            }
            return intVal;
          }
          case "float": {
            let floatVal = parseFloat(val);
            if (isNaN(floatVal)) {
              console.error(`Cannot parse ${val} to float`);
              return NaN;
            }
            return floatVal;
          }
          case "id":
          case "string":
          default:
            return val;
        }
      }),
      sort: 1
    };

    attributes.push(attr);
  }

  // Implicit Attributes
  let setCountAttribute: Attribute<number> = {
    name: "Set Count",
    type: "integer",
    values: [],
    sort: 1,
    min: 0
  };

  for (let i = 0; i < depth; ++i) {
    let setCount = 0;
    for (let s = 0; s < rawSets.length; ++s) {
      setCount += rawSets[s][i];
    }
    setCountAttribute.values[i] = setCount;
  }

  attributes.push(setCountAttribute);

  const setAttribute: Attribute<string | number> = {
    name: "Sets",
    type: "sets",
    values: [],
    sort: 1
  };

  for (let i = 0; i < depth; ++i) {
    const setList: Array<string | number> = [];
    for (let s = 0; s < rawSets.length; ++s) {
      if (rawSets[s][i] === 1) {
        setList.push(sets[s].id);
      }
    }
    setAttribute.values[i] = setList as any;
  }

  attributes.push(setAttribute);

  for (let i = 0; i < attributes.length; ++i) {
    if (attributes[i].type === "float" || attributes[i].type === "integer") {
      if (i < info.meta.length) {
        attributes[i].min =
          info.meta[i].min ||
          Math.min.apply(null, attributes[i].values as number[]);
        attributes[i].max =
          info.meta[i].max ||
          Math.max.apply(null, attributes[i].values as number[]);
      } else {
        attributes[i].min =
          attributes[i].min ||
          Math.min.apply(null, attributes[i].values as number[]);
        attributes[i].max =
          attributes[i].max ||
          Math.max.apply(null, attributes[i].values as number[]);
      }
    }
  }

  return {
    attributes
  };
}
