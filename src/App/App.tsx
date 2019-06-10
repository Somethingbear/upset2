import React from "react";
import "./App.scss";
import Navbar from "../Components/Navbar/Navbar";
import { DatasetDict } from "../types/Dataset.type";
import * as d3 from "d3";
import DatasetInfoBox from "../Components/DatasetInfo/DatasetInfoBox";
import { processDataset } from "../Data/processDatasetJSON";
import { UpsetState } from "../State/UpsetState";
import {
  DatasetDictActions,
  DatasetDictBuildAction
} from "../State/Reducers/Dataset.reducer";
import { Dispatch } from "redux";
import { connect } from "react-redux";
import Upset from "../Components/UpsetComponent/Upset";
import { debouncedEventHandler } from "../utils";
import Sidebar from "../Components/Sidebar/Sidebar";
import { Data } from "../types/Data.type";
import { Dimmer, Loader } from "semantic-ui-react";

interface StateProps {
  datasets: DatasetDict;
  loadingDataset: boolean;
  data: Data;
}
interface OwnProps extends OptionalProps {}
interface OptionalProps {}
interface DispatchProps {
  updateDict: (datasetDict: DatasetDict) => void;
}

type Props = OwnProps & StateProps & DispatchProps;

class App extends React.Component<Props> {
  resizeEventHandler: () => void;

  constructor(props: Props) {
    super(props);
    this.resizeEventHandler = debouncedEventHandler(200, this.resizeHandler);
  }

  componentDidMount() {
    const { updateDict } = this.props;
    this.resizeHandler();

    window.addEventListener("resize", this.resizeEventHandler);

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

  componentWillUnmount() {
    window.removeEventListener("resize", this.resizeEventHandler);
  }

  resizeHandler() {
    const header = document.querySelector("#navbar") as HTMLDivElement;
    const headerHeight = header.offsetHeight;
    const headerStyle = getComputedStyle(header);
    const body = document.querySelector("#body") as HTMLDivElement;

    body.style.height = `${window.innerHeight -
      headerHeight -
      parseInt(headerStyle.marginTop as string) -
      parseInt(headerStyle.marginBottom as string)}px`;
  }

  render() {
    const { loadingDataset } = this.props;

    return (
      <>
        <Navbar id="navbar" />
        <div id="body" className="body">
          <div>
            <Sidebar />
            <DatasetInfoBox />
          </div>
          {loadingDataset ? (
            <>
              <Dimmer active>
                <Loader>Loading Dataset</Loader>
              </Dimmer>
            </>
          ) : (
            <Upset />
          )}
          <div>Test</div>
        </div>
      </>
    );
  }
}

const mapStateToProps = (state: UpsetState): StateProps => {
  return {
    datasets: state.datasetDict,
    loadingDataset: state.loadingDataset,
    data: state.currentData
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
