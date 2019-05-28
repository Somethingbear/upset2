import { createStore, combineReducers, Store } from "redux";
import {
  DatasetReducer,
  DatasetDictBuildAction
} from "./Reducers/Dataset.reducer";
import { DatasetDict } from "../types/Dataset.type";

export interface UpsetState {
  selectedDatasetName: string;
  datasetDict: DatasetDict;
}

export const AppState = (): Store<UpsetState> => {
  return createStore<UpsetState, any, {}, {}>(
    combineReducers({
      selectedDatasetName: DatasetReducer,
      datasetDict: DatasetDictBuildAction
    })
  );
};
