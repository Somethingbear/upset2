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
import DeviationHeader from "./Header/DeviationHeader";
import DeviationBars from "./Body/DeviationBars";

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

    const header_bar_height = 100;
    const header_label_height = 100;
    const headerElementPadding = 5;
    const rowHeight = 30;
    this.state = {
      header: {
        bar: {
          height: header_bar_height,
          width: 20
        },
        label: {
          height: header_label_height,
          width: 20,
          skew: 45
        },
        attributeHeaders: {
          yOffset:
            header_bar_height +
            header_label_height -
            3 * rowHeight -
            2 * headerElementPadding +
            rowHeight +
            headerElementPadding,
          height: rowHeight
        },
        headerElementPadding
      },
      headerBodyPadding: 5,
      verticalPadding: 20,
      attributeWidth: 200,
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
      cardinalityMax,
      attributeWidth
    } = this.state;

    const skewDegree = (header.label.skew * Math.PI) / 180;

    const renderRows = applyRenderConfig(data, renderConfig);

    // const selectedAttributes = data.selectedAttributes.filter(
    //   a => !a.renderFromSubsets
    // );

    const deviationAttribute = data.selectedAttributes.filter(
      attr => attr.name === "Deviation"
    );

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
                  className="cardinality-header"
                  transform={`translate(${header.bar.width *
                    data.usedSets.length +
                    header.bar.height +
                    verticalPadding}, ${header.attributeHeaders.yOffset -
                    header.headerElementPadding -
                    30})`}
                >
                  <CardinalityHeader
                    cardinalityScaleMax={data.allItems.length}
                    updatedLocalScale={this.updateLocalCardinalityScale}
                    padding={header.headerElementPadding}
                    width={attributeWidth}
                    height={header.attributeHeaders.height}
                  />
                </g>
                <g
                  className="subset-attribute-headers"
                  transform={`translate(${header.bar.width *
                    data.usedSets.length +
                    header.bar.height +
                    verticalPadding +
                    attributeWidth +
                    verticalPadding * 3},${header.attributeHeaders.yOffset})`}
                >
                  {deviationAttribute.length === 1 && (
                    <DeviationHeader
                      width={200}
                      height={30}
                      deviationMax={0.15}
                    />
                  )}
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
                    width={attributeWidth}
                  />
                </g>
                {deviationAttribute.length === 1 && (
                  <g
                    className="deviation-bars"
                    transform={`translate(${header.label.width *
                      data.usedSets.length +
                      verticalPadding +
                      attributeWidth +
                      verticalPadding * 3}, 0)`}
                  >
                    <DeviationBars
                      width={attributeWidth}
                      rows={renderRows}
                      rowHeight={body.rowHeight}
                      deviationMax={0.15}
                    />
                  </g>
                )}
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
