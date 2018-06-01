import { Application } from "provenance_mvvm_framework";
import { NavBarViewModel } from "./NavBarView/NavBarViewModel";
import { NavBarView } from "./NavBarView/NavBarView";
import * as d3 from "d3";
import { DataSetInfoViewModel } from "./DataSetInfoView/DataSetInfoViewModel";
import { DataSetInfoView } from "./DataSetInfoView/DataSetInfoView";
import { FilterBoxViewModel } from "./FilterBoxView/FilterBoxViewModel";
import { FilterBoxView } from "./FilterBoxView/FilterBoxView";

let application = new Application("Upset2.0", "1.0.0");

let navbar = new NavBarViewModel(
  new NavBarView(<HTMLElement>d3.select("#top-bar").node()),
  application.graph,
  application.registry
);

navbar.on("log", logger);

function logger(a: string) {
  console.log(a);
}

let datasetinfo = new DataSetInfoViewModel(
  new DataSetInfoView(<HTMLElement>d3.select("#dataset-info-box").node()),
  application.graph,
  application.registry
);

let filterBox = new FilterBoxViewModel(
  new FilterBoxView(<HTMLElement>d3.select("#filter-box").node()),
  application.graph,
  application.registry
);
