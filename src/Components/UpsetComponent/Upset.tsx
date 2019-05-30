import * as React from "react";
import { UpsetState } from "../../State/UpsetState";
import { Data } from "../../types/Data.type";
import { connect } from "react-redux";
import styles from "./upset.module.scss";

interface StateProps {
  data: Data;
}
interface DispatchProps {}
interface OptionalProps {}
interface OwnProps extends OptionalProps {}

type Props = StateProps & DispatchProps & OptionalProps & OwnProps;

interface OwnState {}

class Upset extends React.Component<Props, OwnState> {
  constructor(props: Props) {
    super(props);
  }

  render() {
    const { data } = this.props;

    return (
      <svg className={styles.upsetSVG}>
        <g />
      </svg>
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
