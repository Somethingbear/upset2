import React from "react";
import "./App.scss";
import Navbar from "../Components/Navbar/Navbar";
import { DatasetDict } from "../types/Dataset.type";
import * as d3 from "d3";
import DatasetInfoBox from "../Components/DatasetInfo/DatasetInfoBox";
import { Grid } from "semantic-ui-react";
import { processDataset } from "../Data/processDatasetJSON";
import { UpsetState } from "../State/UpsetState";
import {
  DatasetDictActions,
  DatasetDictBuildAction
} from "../State/Reducers/Dataset.reducer";
import { Dispatch } from "redux";
import { connect } from "react-redux";
import Upset from "../Components/UpsetComponent/Upset";

interface StateProps {
  datasets: DatasetDict;
}
interface OwnProps extends OptionalProps {}
interface OptionalProps {}
interface DispatchProps {
  updateDict: (datasetDict: DatasetDict) => void;
}

type Props = OwnProps & StateProps & DispatchProps;

class App extends React.Component<Props> {
  componentDidMount() {
    const { updateDict } = this.props;
    d3.json("data/datasets.json").then((json: any) => {
      const list = json.map((j: any) => d3.json(j));
      Promise.all(list).then(newList => {
        const datasets: DatasetDict = {};
        newList.forEach(l => {
          const d = processDataset(l);
          datasets[d.name] = d;
        });

        updateDict(datasets);
      });
    });
  }

  render() {
    return (
      <>
        <Grid style={{ height: "100vh" }}>
          <Grid.Column width={16}>
            <Grid.Row>
              <Navbar />
            </Grid.Row>
            <Grid.Row style={{ height: "99%" }} columns="three">
              <Grid style={{ height: "99%" }}>
                <Grid.Column width={3}>
                  <Grid.Column> Filter Box</Grid.Column>
                  <Grid.Column>
                    <DatasetInfoBox />
                  </Grid.Column>
                </Grid.Column>
                <Grid.Column width={9}>
                  <Upset />
                </Grid.Column>
                <Grid.Column width={4}>Element View</Grid.Column>
              </Grid>
            </Grid.Row>
          </Grid.Column>
        </Grid>
      </>
    );
  }
}

const mapStateToProps = (state: UpsetState): StateProps => {
  return {
    datasets: state.datasetDict
  };
};

const mapDispatchToProps = (
  dispatch: Dispatch<DatasetDictBuildAction>
): DispatchProps => {
  return {
    updateDict: (datasets: DatasetDict) =>
      dispatch({
        type: DatasetDictActions.UPDATE_DICT,
        args: datasets
      })
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
