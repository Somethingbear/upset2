import { createStore, combineReducers, Store, applyMiddleware } from "redux";
import {
  DatasetReducer,
  DatasetDictReducer,
  DataUpdateReducer
} from "./Reducers/Dataset.reducer";
import { DatasetDict } from "../types/Dataset.type";
import { Data } from "../types/Data.type";
import { RenderConfig } from "../Data/RenderConfiguration/RenderConfig";
import { RenderConfigReducer } from "./Reducers/RenderConfig.reducer";
import { LoadingDatasetReducer } from "./Reducers/LoadingDataset.reducer";
import thunk from "redux-thunk";

export interface UpsetState {
  selectedDatasetName: string;
  datasetDict: DatasetDict;
  currentData: Data;
  renderConfig: RenderConfig;
  loadingDataset: boolean;
}

export const AppState = (): Store<UpsetState> => {
  return createStore<UpsetState, any, {}, {}>(
    combineReducers({
      selectedDatasetName: DatasetReducer,
      datasetDict: DatasetDictReducer,
      currentData: DataUpdateReducer,
      renderConfig: RenderConfigReducer,
      loadingDataset: LoadingDatasetReducer
    }),
    applyMiddleware(thunk)
  );
};
