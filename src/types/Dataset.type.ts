export type SetInfo = {
  format: string;
  start: number;
  end: number;
};

export type Metadata = {
  type: string;
  index: number;
  name: string;
  min?: number;
  max?: number;
};

export type Dataset = {
  url: string;
  name: string;
  header: number;
  separator: string;
  skip: number;
  meta: Array<Metadata>;
  sets: Array<SetInfo>;
  author: string;
  description: string;
  source: string;
  setCount: number;
  attributeCount: number;
  fromServer?: boolean;
};

export type Datasets = Dataset[];

export type DatasetDict = { [key: string]: Dataset };
