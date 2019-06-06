import * as React from "react";
import * as d3 from "d3";

interface Props extends React.SVGProps<SVGGElement> {
  id: string;
  duration: number;
}

interface State {
  transform: string;
}

export default class GComponent extends React.Component<Props, State> {
  gRef: React.RefObject<SVGGElement> = React.createRef();
  stopStateUpdate: boolean = false;
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
      .attr("transform", this.props.transform as string)
      .on("end", () => {
        if (!this.stopStateUpdate)
          this.setState({
            transform: this.props.transform as string
          });
      });
  }

  componentWillMount() {
    this.stopStateUpdate = false;
  }

  componentWillUnmount() {
    this.stopStateUpdate = true;
  }

  render() {
    const { transform } = this.state;

    return (
      <g ref={this.gRef} key={this.props.id} transform={transform}>
        {this.props.children}
      </g>
    );
  }
}
