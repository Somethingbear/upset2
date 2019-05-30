import { Action } from "redux";
import {
  RenderConfig,
  getDefaultRenderConfig
} from "../../Data/RenderConfiguration/RenderConfig";
import { Reducer } from "redux";
import { deepCopy } from "../../utils";

export enum RenderConfigActions {
  UPDATE_CONFIG = "UPDATE_CONFIG"
}

export interface UpdateRenderConfigAction extends Action {
  type: RenderConfigActions;
  args: RenderConfig;
}

export const RenderConfigReducer: Reducer<
  RenderConfig,
  UpdateRenderConfigAction
> = (
  current: RenderConfig = getDefaultRenderConfig(),
  action: UpdateRenderConfigAction
) => {
  switch (RenderConfigActions[action.type]) {
    case RenderConfigActions.UPDATE_CONFIG:
      return deepCopy(action.args);
    default:
      return current;
  }
};