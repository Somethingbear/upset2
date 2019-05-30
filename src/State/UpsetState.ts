import { createStore, combineReducers, Store } from "redux";
import {
  DatasetReducer,
  DatasetDictReducer,
  DataUpdateReducer
} from "./Reducers/Dataset.reducer";
import { DatasetDict } from "../types/Dataset.type";
import { Data } from "../types/Data.type";
import { RenderConfig } from "../Data/RenderConfiguration/RenderConfig";
import { RenderConfigReducer } from "./Reducers/RenderConfig.reducer";

export interface UpsetState {
  selectedDatasetName: string;
  datasetDict: DatasetDict;
  currentData: Data;
  renderConfig: RenderConfig;
}

export const AppState = (): Store<UpsetState> => {
  return createStore<UpsetState, any, {}, {}>(
    combineReducers({
      selectedDatasetName: DatasetReducer,
      datasetDict: DatasetDictReducer,
      currentData: DataUpdateReducer,
      renderConfig: RenderConfigReducer
    })
  );
};
