import React from "react";
import { Menu, Dropdown } from "semantic-ui-react";
import { Datasets, DatasetDict } from "../../types/Dataset.type";
import styles from "./navbar.module.scss";
import { connect } from "react-redux";
import { UpsetState } from "../../State/UpsetState";
import { Dispatch } from "redux";
import {
  DatasetChangeAction,
  DatasetActions
} from "../../State/Reducers/Dataset.reducer";
import { Data } from "../../types/Data.type";

interface StateProps {
  selectedDataset: string;
  datasetDict: DatasetDict;
  data: Data;
}

interface DispatchProps {
  changeDataset: (newDs: string) => void;
}

interface OwnProps extends OptionalProps {}
interface OptionalProps {
  id: string;
}

type Props = OwnProps & StateProps & DispatchProps;
class Navbar extends React.Component<Props> {
  static defaultProps: OptionalProps = {
    id: ""
  };

  render() {
    const { id, datasetDict, selectedDataset, changeDataset } = this.props;

    const datasets: Datasets = Object.values(datasetDict);

    return (
      <Menu id={id} inverted>
        <Menu.Item header>UpSet - Visualizing Intersecting Sets</Menu.Item>
        <Menu.Menu position="right">
          <Menu.Item>
            <Dropdown
              className={styles.min_width}
              name="datasets"
              item
              placeholder="Select Dataset"
              selection
              search
              options={datasets.map(d => {
                return {
                  key: d.url,
                  text: `${d.name} (${d.setCount} Sets, ${
                    d.attributeCount
                  } Attributes)`,
                  value: d.name,
                  original: d
                };
              })}
              value={selectedDataset}
              onChange={(_, selection) =>
                changeDataset(selection.value as string)
              }
            />
          </Menu.Item>
          <Menu.Item header>About UpSet</Menu.Item>
        </Menu.Menu>
      </Menu>
    );
  }
}

const mapStateToProps = (state: UpsetState): StateProps => {
  return {
    selectedDataset: state.selectedDatasetName,
    datasetDict: state.datasetDict,
    data: state.currentData
  };
};
const mapDispatchToProps = (
  dispatch: Dispatch<DatasetChangeAction>
): DispatchProps => {
  return {
    changeDataset: (newDs: string) =>
      dispatch({
        type: DatasetActions.CHANGE_DATASET,
        args: newDs
      })
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Navbar);
