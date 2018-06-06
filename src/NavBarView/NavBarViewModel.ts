/*
 * @Author: Kiran Gadhave
 * @Date: 2018-06-03 14:38:33
 * @Last Modified by: Kiran Gadhave
 * @Last Modified time: 2018-06-05 15:57:33
 */
import {
  IActionFunctionRegistry,
  IProvenanceGraph,
  ViewModelBase,
  Application
} from "provenance_mvvm_framework";
import { Handler } from "../../../provenance_mvvm_framework/dist/types/Provenance/Handler";
import { DataUtils } from "./../DataStructure/DataUtils";
import { IDataSetInfo } from "./../DataStructure/IDataSetInfo";
import { IDataSetJSON } from "./../DataStructure/IDataSetJSON";
import { NavBarView } from "./NavBarView";

export class NavBarViewModel extends ViewModelBase {
  public datasets: IDataSetInfo[] = [];
  constructor(view: NavBarView, app: Application) {
    super(view, app);
    this.App.on("change-dataset", <Handler>DataUtils.changeDataSet);
    this.View.create();
    this.populateDatasetSelector();
  }

  populateDatasetSelector() {
    let results: Promise<any>[] = [];
    let p = fetch("data/datasets.json")
      .then(results => results.json())
      .then(jsondata => {
        jsondata.forEach((d: string) => {
          let a = fetch(d).then(res => res.json());
          results.push(a);
        });
      })
      .then(() => {
        Promise.all(results)
          .then(d => {
            d.forEach(j => {
              let a: IDataSetJSON = DataUtils.getDataSetJSON(j);
              this.datasets.push(DataUtils.getDataSetInfo(a));
            });
          })
          .then(() => {
            (<NavBarView>this.View).update();
          });
      });
  }
}
