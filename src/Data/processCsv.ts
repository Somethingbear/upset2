import { Dataset } from "../types/Dataset.type";
import * as d3 from "d3";
import { Data, getData } from "../types/Data.type";
import { Store } from "redux";
import { AnyAction } from "redux";
import { UpsetState } from "../State/UpsetState";
import { DataUpdateActions } from "../State/Reducers/Dataset.reducer";
import { getRawData } from "./processRawData";
import { getSets } from "./getSets";
import { getAttributes } from "./getAttributes";
import { setupSubsets } from "./setupSubset";
import { RenderConfigActions } from "../State/Reducers/RenderConfig.reducer";
import {
  getDefaultRenderConfig,
  RenderConfig
} from "./RenderConfiguration/RenderConfig";
import { loadConfig } from "../utils";

export function processCsv(
  datasetInfo: Dataset,
  store: Store<UpsetState, AnyAction>
) {
  if (!datasetInfo) return;
  const { separator, url, name } = datasetInfo;
  d3.dsv(separator, url).then(
    (parsedData: d3.DSVParsedArray<d3.DSVRowString>) => {
      const rawData = getRawData(parsedData, datasetInfo);
      const { rawSets, setNames, header, allItems, depth } = rawData;

      let data: Data = {
        ...getData(),
        name: name,
        allItems: allItems,
        depth: depth,
        rawData: parsedData.map(d => d)
      };
      data.membership = {};

      const setData = getSets(
        rawSets,
        setNames,
        data.depth,
        data.noDefaultSets
      );

      data = { ...data, ...setData };

      data = {
        ...data,
        ...getAttributes(
          rawSets,
          setNames,
          header,
          parsedData,
          data.sets,
          datasetInfo,
          data.depth
        )
      };

      data = {
        ...data,
        ...setupSubsets(data)
      };

      if (!store.getState().renderConfig.firstLevelAggregation) {
        const rc: RenderConfig = loadConfig();
        store.dispatch({
          type: RenderConfigActions.UPDATE_CONFIG,
          args: rc ? rc : getDefaultRenderConfig()
        });
      }

      store.dispatch({
        type: DataUpdateActions.UPDATE_DATA,
        args: data
      });
    }
  );
}
