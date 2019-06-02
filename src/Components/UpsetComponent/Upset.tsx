import * as React from "react";
import { UpsetState } from "../../State/UpsetState";
import { Data } from "../../types/Data.type";
import { connect } from "react-redux";
import styles from "./upset.module.scss";
import * as d3 from "d3";
import SetHeader from "./Header/SetHeader";
import { UpsetConfig } from "../../types/UpsetUIConfig";

interface StateProps {
  data: Data;
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
      headerBodyPadding: 10
    };
  }

  componentDidUpdate() {
    this.resizeSVG();
  }

  resizeSVG = () => {
    const svgObject: SVGSVGElement = this.svgRef.current as SVGSVGElement;
    const { header, headerBodyPadding } = this.state;

    const { data } = this.props;

    const skewDegree = (header.label.skew * Math.PI) / 180;

    svgObject.style.height = `${header.bar.height +
      header.label.height +
      headerBodyPadding}
      px`;

    svgObject.style.width = `${header.label.height / Math.tan(skewDegree) +
      header.label.width * data.usedSets.length}px`;
  };

  render() {
    const { data } = this.props;

    const { header } = this.state;

    console.log(data);

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
            </>
          </svg>
        )}
      </div>
    );
  }
}

const mapStateToProps = (state: UpsetState): StateProps => ({
  data: state.currentData
});

const mapDispatchToProps = (dispatch: any): DispatchProps => ({});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Upset);
