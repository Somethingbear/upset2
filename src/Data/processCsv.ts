/*eslint no-loop-func: 0 */

import { Dataset } from "../types/Dataset.type";
import * as d3 from "d3";
import { Data, getData, Membership } from "../types/Data.type";
import { Set, getSet } from "../types/Set";
import { Attribute } from "../types/Attribute.type";
import { Subset, getSubset } from "../types/Subset";

export function processCsv(datasetInfo: Dataset) {
  if (!datasetInfo) return;
  const { separator, url, name } = datasetInfo;
  d3.dsv(separator, url).then(
    (parsedData: d3.DSVParsedArray<d3.DSVRowString>) => {
      const rawData = getRawData(parsedData, datasetInfo);
      const { rawSets, setNames, header, allItems, depth } = rawData;

      let data: Data = {
        ...getData(),
        name: name,
        allItems: allItems,
        depth: depth
      };
      data.membership = {};

      const setData = getSets(
        rawSets,
        setNames,
        data.depth,
        data.noDefaultSets
      );

      data = { ...data, ...setData };

      data = {
        ...data,
        ...getAttributes(
          rawSets,
          setNames,
          header,
          parsedData,
          data.sets,
          datasetInfo,
          data.depth
        )
      };

      data = {
        ...data,
        ...setupSubsets(data)
      };

      data = {
        ...data,
        ...addRawData(parsedData)
      };
      console.log(data);
    }
  );
}

function addRawData(data: d3.DSVParsedArray<d3.DSVRowString>) {
  return { rawData: data.map(d => d) };
}

function setupSubsets(data: Data) {
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

function getAttributes(
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

function getSets(
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

function getRawData(
  data: d3.DSVParsedArray<d3.DSVRowString>,
  info: Dataset,
  depth: number = 0
) {
  const rawSets: number[][] = [];
  const setNames: string[] = [];
  const header: string[] = [];
  const allItems: number[] = [];

  header.push(...data.columns);

  let processedSetCount = 0;

  for (let i = 0; i < info.sets.length; ++i) {
    let setDef = info.sets[i];

    if (setDef.format === "binary") {
      let setDefLength = setDef.end - setDef.start + 1;
      for (let setCount = 0; setCount < setDefLength; ++setCount) {
        rawSets.push([]);
      }

      let rows: any = data.map((row, row_idx) => {
        return Object.entries(row)
          .map((t: any) => t[1])
          .map((val: string, col_idx: number) => {
            if (col_idx >= setDef.start && col_idx <= setDef.end) {
              let intVal = parseInt(val, 10);
              if (isNaN(intVal)) console.error(`Parse Error: ${val}`);
              return intVal;
            }
            return null;
          });
      });

      for (let r = 0; r < rows.length; ++r) {
        if (i === 0) allItems.push(depth++);

        for (let s = 0; s < setDefLength; ++s) {
          rawSets[processedSetCount + s].push(rows[r][setDef.start + s]);

          if (r === 1) setNames.push(header[setDef.start + s]);
        }
      }
      processedSetCount += setDefLength;
    } else {
      console.error(`Set definition format ${setDef.format} not supported`);
    }
  }

  return {
    rawSets,
    setNames,
    header,
    allItems,
    depth
  };
}
