import React from "react";
import { Menu, Dropdown } from "semantic-ui-react";

interface State {}
interface OwnProps {}
interface OptionalProps {
  datasets: string[];
}

type Props = OwnProps & OptionalProps;

export default class Navbar extends React.Component<Props, State> {
  static defaultProps: OptionalProps = {
    datasets: []
  };

  render() {
    const { datasets } = this.props;

    const datasets2 = datasets.map(d => {
      return { key: d, value: d, text: d, random: `${d}Nom` };
    });

    return (
      <Menu inverted>
        <Menu.Item header>UpSet - Visualizing Intersecting Sets</Menu.Item>
        <Menu.Menu position="right">
          <Menu.Item>
            <Dropdown
              item
              placeholder="Select Dataset"
              selection
              options={datasets2}
              onChange={(evt, selection) => console.log(selection)}
            />
          </Menu.Item>
          <Menu.Item header>About UpSet</Menu.Item>
        </Menu.Menu>
      </Menu>
    );
  }
}
