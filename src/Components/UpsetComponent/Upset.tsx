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

interface StateProps {
  data: Data;
  renderConfig: RenderConfig;
}
interface DispatchProps {}
interface OptionalProps {}
interface OwnProps extends OptionalProps {}

type Props = StateProps & DispatchProps & OptionalProps & OwnProps;

interface OwnState extends UpsetConfig {}

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
        }
      },
      headerBodyPadding: 5,
      body: {
        rowHeight: 20,
        matrix: {
          circRadius: 10
        }
      }
    };
  }

  render() {
    const { data, renderConfig } = this.props;

    const { header, headerBodyPadding, body } = this.state;

    const skewDegree = (header.label.skew * Math.PI) / 180;

    const renderRows = applyRenderConfig(data, renderConfig);

    console.log(renderRows);

    return (
      <div className={styles.upsetWrapper}>
        {data.name === "" ? (
          <div>Loading Dataset</div>
        ) : (
          <svg ref={this.svgRef} className={styles.upsetSVG}>
            <>
              <SetHeader
                setHeaderHeight={header.bar.height}
                setHeaderWidth={header.bar.width}
                setLabelHeight={header.label.height}
                setLabelWidth={header.label.width}
                setLabelSkewDegree={header.label.skew}
                usedSets={data.usedSets}
                unusedSets={data.unusedSets}
                maxSetSize={d3.max(data.sets.map(set => set.setSize)) as number}
              />
              <g
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
