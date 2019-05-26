import { createStore, combineReducers, Store } from "redux";
import { DatasetReducer } from "./Reducers/Dataset.reducer";

export interface UpsetState {
  dataset: string;
}

export const AppState = (): Store<UpsetState> => {
  return createStore(
    combineReducers({
      dataset: DatasetReducer
    })
  );
};
