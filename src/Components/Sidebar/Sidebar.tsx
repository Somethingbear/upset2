import * as React from "react";
import { connect } from "react-redux";
import { Accordion, Menu } from "semantic-ui-react";

interface OwnProps {}

interface State {
  activeindex: number;
}

type Props = OwnProps;

class Sidebar extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      activeindex: 0
    };
  }

  handleClick = (index: number) => {
    const { activeindex } = this.state;

    this.setState({
      activeindex: activeindex === index ? -1 : index
    });
  };

  render() {
    const { activeindex } = this.state;

    return (
      <Accordion as={Menu} vertical>
        <Menu.Item>
          <Accordion.Title
            active={activeindex === 0}
            content="First Aggregation"
            onClick={() => this.handleClick(0)}
          />
          <Accordion.Content active={activeindex === 0}>
            <div>Test</div>
          </Accordion.Content>
        </Menu.Item>

        <Menu.Item>
          <Accordion.Title
            active={activeindex === 1}
            content="Second Aggregation"
            onClick={() => this.handleClick(1)}
          />
          <Accordion.Content active={activeindex === 1}>
            <div>Test</div>
          </Accordion.Content>
        </Menu.Item>

        <Menu.Item>
          <Accordion.Title
            active={activeindex === 2}
            content="Sort By"
            onClick={() => this.handleClick(2)}
          />
          <Accordion.Content active={activeindex === 2}>
            <div>Test</div>
          </Accordion.Content>
        </Menu.Item>

        <Menu.Item>
          <Accordion.Title
            active={activeindex === 3}
            content="Data"
            onClick={() => this.handleClick(3)}
          />
          <Accordion.Content active={activeindex === 3}>
            <div>Test</div>
          </Accordion.Content>
        </Menu.Item>
      </Accordion>
    );
  }
}

export default connect()(Sidebar);
