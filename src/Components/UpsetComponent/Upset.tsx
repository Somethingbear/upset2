import * as React from "react";
import { UpsetState } from "../../State/UpsetState";
import { Data } from "../../types/Data.type";
import { connect } from "react-redux";
import styles from "./upset.module.scss";
import * as d3 from "d3";
import SetHeader from "./Header/SetHeader";
import { UpsetConfig } from "../../types/UpsetUIConfig";
import MatrixView from "./Body/MatrixView";
import { RenderConfig } from "../../Data/RenderConfiguration/RenderConfig";
import { applyRenderConfig } from "../../Data/applyRenderConfig";
import CardinalityHeader from "./Header/CardinalityHeader";
import CardinalityBars from "./Body/CardinalityBars";

interface StateProps {
  data: Data;
  renderConfig: RenderConfig;
}
interface DispatchProps {}
interface OptionalProps {}
interface OwnProps extends OptionalProps {}

type Props = StateProps & DispatchProps & OptionalProps & OwnProps;

interface OwnState extends UpsetConfig {
  cardinalityMax: number;
}

class Upset extends React.Component<Props, OwnState> {
  svgRef: React.RefObject<SVGSVGElement> = React.createRef();
  state: OwnState = {} as any;
  constructor(props: Props) {
    super(props);
    this.state = {
      header: {
        bar: {
          height: 100,
          width: 20
        },
        label: {
          height: 100,
          width: 20,
          skew: 45
        },
        attributeHeaders: {
          yOffset: 135
        }
      },
      headerBodyPadding: 5,
      verticalPadding: 5,
      body: {
        rowHeight: 20,
        matrix: {
          circRadius: 10
        }
      },
      cardinalityMax: 0
    };
  }

  updateLocalCardinalityScale = (newVal: number) => {
    this.setState({
      cardinalityMax: newVal
    });
  };

  render() {
    const { data, renderConfig } = this.props;

    const {
      header,
      headerBodyPadding,
      verticalPadding,
      body,
      cardinalityMax
    } = this.state;

    const skewDegree = (header.label.skew * Math.PI) / 180;

    const renderRows = applyRenderConfig(data, renderConfig);

    return (
      <div className={styles.upsetWrapper}>
        {data.name === "" ? (
          <div>Loading Dataset</div>
        ) : (
          <svg ref={this.svgRef} className={styles.upsetSVG}>
            <>
              <g className="header-group">
                <SetHeader
                  setHeaderHeight={header.bar.height}
                  setHeaderWidth={header.bar.width}
                  setLabelHeight={header.label.height}
                  setLabelWidth={header.label.width}
                  setLabelSkewDegree={header.label.skew}
                  usedSets={data.usedSets}
                  unusedSets={data.unusedSets}
                  maxSetSize={
                    d3.max(data.sets.map(set => set.setSize)) as number
                  }
                />
                <g
                  key={data.name}
                  transform={`translate(${header.bar.width *
                    data.usedSets.length +
                    header.bar.height +
                    verticalPadding}, ${header.attributeHeaders.yOffset -
                    5 -
                    30})`}
                >
                  <CardinalityHeader
                    cardinalityScaleMax={data.allItems.length}
                    updatedLocalScale={this.updateLocalCardinalityScale}
                  />
                </g>
              </g>
              <g
                className="body-group"
                transform={`translate(${header.label.height /
                  Math.tan(skewDegree)}, ${header.label.height +
                  header.bar.height +
                  headerBodyPadding})`}
              >
                <g className="matrix-view">
                  <MatrixView
                    rows={renderRows}
                    rowHeight={body.rowHeight}
                    matrixWidth={header.label.width * data.usedSets.length}
                    circRadius={body.matrix.circRadius}
                    visibleSetCount={data.usedSets.length}
                  />
                </g>
                <g
                  className="cardinality-bars"
                  transform={`translate(${header.label.width *
                    data.usedSets.length +
                    verticalPadding},0)`}
                >
                  <CardinalityBars
                    cardinalityMax={cardinalityMax}
                    rows={renderRows}
                    rowHeight={body.rowHeight}
                    width={200}
                  />
                </g>
              </g>
            </>
          </svg>
        )}
      </div>
    );
  }
}

const mapStateToProps = (state: UpsetState): StateProps => ({
  data: state.currentData,
  renderConfig: state.renderConfig
});

const mapDispatchToProps = (dispatch: any): DispatchProps => ({});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Upset);