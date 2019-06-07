import * as React from "react";
import HeaderBlock from "./HeaderBlock";
import { connect } from "react-redux";
import { RenderConfig } from "../../../Data/RenderConfiguration/RenderConfig";
import { UpsetState } from "../../../State/UpsetState";
import { Dispatch } from "redux";
import {
  UpdateRenderConfigAction,
  RenderConfigActions
} from "../../../State/Reducers/RenderConfig.reducer";
import { SortBy } from "../../../Data/RenderConfiguration/SortBy.enum";
import styles from "./header.module.scss";
import * as d3 from "d3";

interface OwnProps {
  width: number;
  height: number;
  deviationMax: number;
}

interface StateProps {
  rc: RenderConfig;
}

interface DispatchProps {
  sortByDeviation: any;
}

type Props = OwnProps &
  StateProps &
  DispatchProps & {
    renderConfigUpdate: any;
  };

interface State {}

class DeviationHeader extends React.Component<Props, State> {
  componentDidMount() {
    this.addDeviationScale();
  }

  componentDidUpdate() {
    this.addDeviationScale();
  }

  addDeviationScale() {
    const { deviationMax, width } = this.props;

    const scale = d3
      .scaleLinear()
      .domain([-deviationMax, deviationMax])
      .range([0, width]);

    const axisTop = d3.axisTop(scale).ticks(3);

    d3.selectAll(".deviation-axis").call(axisTop as any);
  }

  render() {
    const { width, height } = this.props;
    return (
      <g>
        <HeaderBlock
          text={"Deviation"}
          width={width}
          height={height}
          fontSize={1.2}
          onClick={() => this.props.renderConfigUpdate()}
        />
        <g
          className={`deviation-axis ${styles.axisFontSize}`}
          transform={`translate(0, ${30 + 5 + 30})`}
        />
      </g>
    );
  }
}

const mapStateToProps = (state: UpsetState): StateProps => ({
  rc: state.renderConfig
});

const mapDispatchToProps = (
  dispatch: Dispatch<UpdateRenderConfigAction>
): DispatchProps => ({
  sortByDeviation: (oldRc: RenderConfig) => {
    let rc = {
      ...oldRc
    };
    if (rc.sortBy === SortBy.DEVIATION) return;
    rc.sortBy = SortBy.DEVIATION;
    dispatch({
      type: RenderConfigActions.UPDATE_CONFIG,
      args: rc
    });
  }
});

const mergeProps = (
  stateProps: StateProps,
  dispatchProps: DispatchProps,
  ownProps: OwnProps
): Props => ({
  ...stateProps,
  ...dispatchProps,
  ...ownProps,
  renderConfigUpdate: () => {
    dispatchProps.sortByDeviation(stateProps.rc);
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(DeviationHeader);
