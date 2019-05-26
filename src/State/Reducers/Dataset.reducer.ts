import { Reducer, Action } from "redux";

export enum DatasetActions {
  CHANGE_DATASET
}

export interface DatasetChangeAction extends Action {
  type: DatasetActions;
  args: string;
}

export const DatasetReducer: Reducer<string, DatasetChangeAction> = (
  current: string = `Simpsons Characters`,
  action: DatasetChangeAction
) => {
  switch (action.type) {
    case DatasetActions.CHANGE_DATASET:
      return action.args;
    default:
      return current;
  }
};
