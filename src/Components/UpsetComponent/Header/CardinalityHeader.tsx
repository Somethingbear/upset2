import * as React from "react";
import HeaderBlock from "./HeaderBlock";
import * as d3 from "d3";
import styles from "./header.module.scss";
import { Dispatch } from "redux";
import {
  UpdateRenderConfigAction,
  RenderConfigActions
} from "../../../State/Reducers/RenderConfig.reducer";
import { RenderConfig } from "../../../Data/RenderConfiguration/RenderConfig";
import { UpsetState } from "../../../State/UpsetState";
import { SortBy } from "../../../types/SortBy.enum";
import { connect } from "react-redux";

interface StateProps {
  rc: RenderConfig;
}

interface OwnProps {
  cardinalityScaleMax: number;
  padding: number;
  width: number;
  height: number;
  updatedLocalScale: (newMax: number) => void;
}

interface State {
  secondaryCardinalityScaleMax: number;
  showSlider: boolean;
}

interface DispatchProps {
  sortByCardinality: any;
}

type Props = OwnProps &
  DispatchProps &
  StateProps & {
    renderConfigUpdate: any;
  };

class CardinalityHeader extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      secondaryCardinalityScaleMax: 0,
      showSlider: false
    };
  }

  componentDidMount() {
    this.scaleRefresh();
    this.addCardinalityGlobalScale();
  }

  scaleRefresh() {
    const {
      cardinalityScaleMax,
      updatedLocalScale,
      width,
      height
    } = this.props;

    const globalCardinalityScale: d3.ScaleLinear<number, number> = d3
      .scaleLinear()
      .domain([0, cardinalityScaleMax])
      .range([0, width]);

    this.setState({
      secondaryCardinalityScaleMax: Math.ceil(cardinalityScaleMax * 0.2)
    });

    updatedLocalScale(Math.ceil(cardinalityScaleMax * 0.2));
    d3.select(".cardinality-slider").attr(
      "transform",
      `translate(${globalCardinalityScale(
        Math.ceil(cardinalityScaleMax * 0.2)
      )}, ${height / 2 - 10 / Math.sqrt(2)})`
    );
  }

  componentDidUpdate() {
    this.addCardinalityGlobalScale();
    this.addCardinalityLocalScale();
  }

  addCardinalityGlobalScale() {
    const {
      cardinalityScaleMax,
      updatedLocalScale,
      width,
      height
    } = this.props;

    const globalCardinalityScale: d3.ScaleLinear<number, number> = d3
      .scaleLinear()
      .domain([0, cardinalityScaleMax])
      .range([0, width]);

    const globalCardinalityAxisUpper: d3.Axis<any> = d3.axisBottom(
      globalCardinalityScale
    );

    const globalCardinalityAxisLower = d3.axisTop(globalCardinalityScale);

    globalCardinalityAxisLower.tickFormat(() => "");

    d3.select(".cardinality-global-axis-upper").call(
      globalCardinalityAxisUpper as any
    );

    d3.select(".cardinality-global-axis-lower").call(
      globalCardinalityAxisLower as any
    );

    const drag = d3
      .drag()
      .on("drag", () => {
        if (!this.state.showSlider) {
          this.setState({
            showSlider: true
          });
        }

        const rect = d3.select(".cardinality-slider");
        const mousePos = d3.event.x;

        const minimum = 0.1;

        let x =
          mousePos >= minimum
            ? mousePos <= globalCardinalityScale(cardinalityScaleMax)
              ? mousePos
              : globalCardinalityScale(cardinalityScaleMax)
            : minimum;

        rect.attr(
          "transform",
          `translate(${x}, ${height / 2 - 10 / Math.sqrt(2)})`
        );

        this.setState({
          secondaryCardinalityScaleMax: globalCardinalityScale.invert(x)
        });

        updatedLocalScale(globalCardinalityScale.invert(x));
      })
      .on("end", () => {
        this.setState({
          showSlider: false
        });
      });

    d3.select(".cardinality-slider").call(drag as any);
  }

  addCardinalityLocalScale() {
    const { width } = this.props;
    const { secondaryCardinalityScaleMax } = this.state;

    const localScale = d3
      .scaleLinear()
      .domain([0, secondaryCardinalityScaleMax])
      .range([0, width]);

    const localScaleAxisUpper = d3.axisBottom(localScale);
    const localScaleAxisLower = d3.axisTop(localScale).tickFormat(() => "");

    d3.select(".cardinality-local-axis-upper").call(localScaleAxisUpper as any);
    d3.select(".cardinality-local-axis-lower").call(localScaleAxisLower as any);
  }

  render() {
    const { cardinalityScaleMax, width, padding, height } = this.props;

    const { secondaryCardinalityScaleMax, showSlider } = this.state;

    const globalCardinalityScale: d3.ScaleLinear<number, number> = d3
      .scaleLinear()
      .domain([0, cardinalityScaleMax])
      .range([0, width]);

    return (
      <>
        <g className="top-scale">
          <g
            className={`cardinality-global-axis-upper ${styles.axisFontSize}`}
          />
          <g
            className="cardinality-global-axis-lower"
            transform={`translate(0, ${height})`}
          />
          <rect
            className={styles.cardnality_brush}
            height={height}
            width={globalCardinalityScale(secondaryCardinalityScaleMax)}
          />
          <g
            className="cardinality-slider"
            transform={`translate(0, ${height / 2 - 10 / Math.sqrt(2)})`}
          >
            <rect
              className={styles.cardinality_slider_rect}
              height={10}
              width={10}
            />
          </g>
        </g>
        <g transform={`translate(0, ${height + padding})`}>
          <path
            className={`${styles.slider_influence} ${
              !showSlider ? styles.hide : ""
            }`}
            d={`M ${globalCardinalityScale(
              secondaryCardinalityScaleMax
            )} ${-padding}  H ${0} V ${height + padding} H ${width}`}
          />
          <g
            className={`${showSlider ? styles.hide : styles.cardinality_block}`}
          >
            <HeaderBlock
              fontSize={1.2}
              width={width}
              height={height}
              text="Cardinality"
              onClick={() => {
                this.props.renderConfigUpdate();
              }}
            />
          </g>
          <g />
        </g>
        <g
          className="bottom-scale"
          transform={`translate(0, ${height + padding + height + padding})`}
        >
          <g
            className={`cardinality-local-axis-upper ${styles.axisFontSize}`}
          />
          <g
            className="cardinality-local-axis-lower"
            transform={`translate(0, ${height})`}
          />
        </g>
      </>
    );
  }
}

const mapStateToProps = (state: UpsetState): any => ({
  rc: state.renderConfig
});

const mapDispatchToProps = (
  dispatch: Dispatch<UpdateRenderConfigAction>
): DispatchProps => ({
  sortByCardinality: (oldRc: RenderConfig) => {
    let rc = {
      ...oldRc
    };
    if (rc.sortBy === SortBy.CARDINALITY) return;
    rc.sortBy = SortBy.CARDINALITY;
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
    dispatchProps.sortByCardinality(stateProps.rc);
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(CardinalityHeader);
