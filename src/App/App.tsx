import React from "react";
import "./App.scss";
import Navbar from "../Components/Navbar/Navbar";
import styled from "styled-components";

const App: React.FC = () => {
  return (
    <>
      <Navbar datasets={["Test", "Test2", "Test3"]} />
    </>
  );
};

export default App;
