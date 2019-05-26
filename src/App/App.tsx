import React from "react";
import "./App.scss";
import Navbar from "../Components/Navbar/Navbar";
import { Dataset, Metadata, SetInfo, DatasetDict } from "../types/Dataset.type";
import * as d3 from "d3";
import DatasetInfoBox from "../Components/DatasetInfo/DatasetInfoBox";
import { Grid } from "semantic-ui-react";

type OwnProps = {};
type State = {
  datasets: DatasetDict;
};
type Props = OwnProps;

export default class App extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      datasets: {}
    };
  }

  componentDidMount() {
    d3.json("data/datasets.json").then((json: any) => {
      const list = json.map((j: any) => d3.json(j));
      Promise.all(list).then(newList => {
        const datasets: DatasetDict = {};
        newList.forEach(l => {
          const d = processDataset(l);
          datasets[d.name] = d;
        });

        this.setState({
          datasets: datasets
        });
      });
    });
  }

  render() {
    const { datasets } = this.state;
    return (
      <>
        <Grid>
          <Grid.Column width={16}>
            <Grid.Row>
              <Navbar datasetDict={datasets} />
            </Grid.Row>
            <Grid.Row columns="three">
              <Grid>
                <Grid.Column width={3}>
                  <Grid.Column> Filter Box</Grid.Column>
                  <Grid.Column>
                    <DatasetInfoBox datasetDict={datasets} />
                  </Grid.Column>
                </Grid.Column>
                <Grid.Column width={9}>Upset View</Grid.Column>
                <Grid.Column width={4}>Element View</Grid.Column>
              </Grid>
            </Grid.Row>
          </Grid.Column>
        </Grid>
      </>
    );
  }
}

function processDataset(data: any): Dataset {
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
