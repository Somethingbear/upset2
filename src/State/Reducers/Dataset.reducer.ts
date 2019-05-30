import { Reducer, Action } from "redux";
import { DatasetDict } from "../../types/Dataset.type";
import { Data, getData } from "../../types/Data.type";
import { deepCopy } from "../../utils";

export enum DatasetActions {
  CHANGE_DATASET = "CHANGE_DATASET"
}

export enum DatasetDictActions {
  UPDATE_DICT = "UPDATE_DICT"
}

export enum DataUpdateActions {
  UPDATE_DATA = "UPDATE_DATA"
}

export interface DatasetChangeAction extends Action {
  type: DatasetActions;
  args: string;
}

export interface DatasetDictBuildAction extends Action {
  type: DatasetDictActions;
  args: DatasetDict;
}

export interface DataUpdateAction extends Action {
  type: DataUpdateActions;
  args: Data;
}

export const DatasetReducer: Reducer<string, DatasetChangeAction> = (
  current: string = ``,
  action: DatasetChangeAction
) => {
  switch (DatasetActions[action.type]) {
    case DatasetActions.CHANGE_DATASET:
      return deepCopy(action.args);
    default:
      return current;
  }
};

export const DatasetDictReducer: Reducer<
  DatasetDict,
  DatasetDictBuildAction
> = (current: DatasetDict = {}, action: DatasetDictBuildAction) => {
  switch (DatasetDictActions[action.type]) {
    case DatasetDictActions.UPDATE_DICT:
      return deepCopy(action.args);
    default:
      return current;
  }
};

export const DataUpdateReducer: Reducer<Data, DataUpdateAction> = (
  current: Data = getData(),
  action: DataUpdateAction
) => {
  switch (DataUpdateActions[action.type]) {
    case DataUpdateActions.UPDATE_DATA:
      return deepCopy(action.args);
    default:
      return current;
  }
};
