import { Dataset } from "../types/Dataset.type";
import * as d3 from "d3";
import { Data, getData } from "../types/Data.type";

export function processCsv(datasetInfo: Dataset) {
  if (!datasetInfo) return;
  const { separator, url, name } = datasetInfo;
  d3.dsv(separator, url).then(
    (parsedData: d3.DSVParsedArray<d3.DSVRowString>) => {
      const rawData = getRawData(parsedData, datasetInfo);
      const { rawSets, setNames, header, allItems } = rawData;
      const data: Data = {
        ...getData(),
        name: name,
        allItems: allItems
      };
      // Writing sets
      console.log(data);
    }
  );
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
