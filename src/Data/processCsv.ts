import { Dataset } from "../types/Dataset.type";
import * as d3 from "d3";
import { Data, getData } from "../types/Data.type";
import { Set, getSet } from "../types/Set";

export function processCsv(datasetInfo: Dataset) {
  if (!datasetInfo) return;
  const { separator, url, name } = datasetInfo;
  d3.dsv(separator, url).then(
    (parsedData: d3.DSVParsedArray<d3.DSVRowString>) => {
      const rawData = getRawData(parsedData, datasetInfo);
      const { rawSets, setNames, header, allItems } = rawData;

      let data: Data = {
        ...getData(),
        name: name,
        allItems: allItems
      };
      data.membership = {};

      const setData = getSets(
        rawSets,
        setNames,
        header,
        data.depth,
        data.noDefaultSets
      );

      data = { ...data, ...setData };

      console.log(data);
    }
  );
}

function getSets(
  rawSets: number[][],
  setNames: string[],
  headers: string[],
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
    rawSets: rawSets,
    setNames: setNames,
    header: header,
    allItems: allItems
  };
}
