import * as React from "react";
import * as d3 from "d3";

interface Props {
  key: string;
  transform: string;
  duration: number;
}

interface State {
  transform: string;
}

export default class GComponent extends React.Component<Props, State> {
  gRef: React.RefObject<SVGGElement> = React.createRef();

  constructor(props: Props) {
    super(props);
    this.state = {
      transform: ""
    };
  }

  componentDidUpdate() {
    d3.select(this.gRef.current)
      .transition()
      .duration(this.props.duration)
      .ease(d3.easeCubicIn)
      .attr("transform", this.props.transform)
      .on("end", () => {
        this.setState({
          transform: this.props.transform
        });
      });
  }

  render() {
    const { transform } = this.state;

    return (
      <g ref={this.gRef} key={this.props.key} transform={transform}>
        {this.props.children}
      </g>
    );
  }
}
