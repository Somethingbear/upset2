import React from "react";
import { Menu } from "semantic-ui-react";
import "./App.scss";

const App: React.FC = () => {
  return (
    <Menu inverted>
      <Menu.Item name="editorials">Editorials</Menu.Item>
      <Menu.Item name="review" active>
        Review
      </Menu.Item>
    </Menu>
  );
};

export default App;
