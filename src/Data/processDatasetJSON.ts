import { Dataset, Metadata, SetInfo } from "../types/Dataset.type";

export function processDataset(data: any): Dataset {
  const metadata = getMetadata(data);
  const setInfo = getSetInfo(data);
  let setCount = 0;

  for (let i = 0; i < setInfo.length; ++i) {
    let sdb = setInfo[i];
    if (sdb.format !== "binary")
      throw new Error(`Set Definition Format ${sdb.format} not supported`);
    setCount += sdb.end - sdb.start + 1;
  }

  return {
    url: data.file,
    name: data.name,
    header: data.header,
    separator: data.separator,
    skip: data.skip,
    meta: metadata,
    sets: setInfo,
    author: data.author,
    description: data.description,
    source: data.source,
    attributeCount: metadata.length,
    setCount: setCount,
    fromServer: false
  };
}

function getMetadata(data: any): Metadata[] {
  return data.meta;
}

function getSetInfo(data: any): SetInfo[] {
  return data.sets;
}
