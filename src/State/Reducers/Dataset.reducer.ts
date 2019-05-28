import { Reducer, Action } from "redux";
import { DatasetDict } from "../../types/Dataset.type";

export enum DatasetActions {
  CHANGE_DATASET = "CHANGE_DATASET"
}

export interface DatasetChangeAction extends Action {
  type: DatasetActions;
  args: string;
}

export const DatasetReducer: Reducer<string, DatasetChangeAction> = (
  current: string = ``,
  action: DatasetChangeAction
) => {
  switch (DatasetActions[action.type]) {
    case DatasetActions.CHANGE_DATASET:
      return action.args;
    default:
      return current;
  }
};

export enum DatasetDictActions {
  UPDATE_DICT = "UPDATE_DICT"
}

export interface DatasetDictBuildAction extends Action {
  type: DatasetDictActions;
  args: DatasetDict;
}

export const DatasetDictBuildAction: Reducer<
  DatasetDict,
  DatasetDictBuildAction
> = (current: DatasetDict = {}, action: DatasetDictBuildAction) => {
  switch (DatasetDictActions[action.type]) {
    case DatasetDictActions.UPDATE_DICT:
      return action.args;
    default:
      return current;
  }
};
