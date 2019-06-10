import { Action } from "redux";
import { Reducer } from "redux";

export enum LoadingDatasetActions {
  LOADING = "LOADING"
}

export interface LoadingDatasetAction extends Action {
  type: LoadingDatasetActions;
  args: boolean;
}

export const LoadingDatasetReducer: Reducer<boolean, LoadingDatasetAction> = (
  current: boolean = false,
  action: LoadingDatasetAction
) => {
  switch (LoadingDatasetActions[action.type]) {
    case LoadingDatasetActions.LOADING:
      return action.args;
    default:
      return current;
  }
};
