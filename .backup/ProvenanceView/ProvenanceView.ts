/*
 * @Author: Kiran Gadhave
 * @Date: 2018-06-03 14:38:29
 * @Last Modified by: Kiran Gadhave
 * @Last Modified time: 2018-10-09 14:41:41
 */
import * as d3 from "d3";
import { ViewBase, IProvenanceGraph } from "provenance_mvvm_framework";
import template from "./provenance.view.html";
import { createButtons, createGraph } from "./uiBuilderFunctions";

export class ProvenanceView extends ViewBase {
  constructor(root: HTMLElement) {
    super(root);
  }

  create() {
    let size = 20;
    let root = d3.select("#undo-redo-group");
    root.html(template);

    // d3.select(this.Root)
    //   .select("#save-btn")
    //   .on("click", () => {
    //     this.comm.emit("save-graph");
    //   });

    // d3.select(this.Root)
    //   .select("#load-btn")
    //   .on("click", () => {
    //     this.comm.emit("load-graph");
    //   });

    let undo = root.select(".undo");
    let redo = root.select(".redo");

    // undo
    //   .append("img")
    //   .attr("src", "assets/arrow.svg")
    //   .attr("class", "img")
    //   .attr("height", size)
    //   .attr("width", size);

    // redo
    //   .append("img")
    //   .attr("src", "assets/arrow.svg")
    //   .attr("class", "img")
    //   .attr("height", size)
    //   .attr("width", size);

    undo.on("click", () => {
      this.comm.emit("undo");
    });

    redo.on("click", () => {
      this.comm.emit("redo");
    });

    d3.select("html").on("keydown", () => {
      if (d3.event.code === "ArrowLeft") this.comm.emit("undo");
      if (d3.event.code === "ArrowRight") this.comm.emit("redo");
    });
  }

  update(graph: IProvenanceGraph) {
    createButtons(d3.select("#undo-redo-group"), graph);
    // createGraph(d3.select(this.Root).select(".graph-view"), graph, this.comm);
  }
}
