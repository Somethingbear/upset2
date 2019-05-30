import { UpsetState } from "./State/UpsetState";
import { AnyAction, Store } from "redux";

export function deepCopy<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj)) as T;
}

export function generateStoreObserver() {
  let currentState: UpsetState;
  return {
    observeStore: (
      store: Store<UpsetState, AnyAction>,
      compareStates: (
        currentState: UpsetState,
        nextState: UpsetState
      ) => boolean,
      onChange: Function
    ) => {
      function handleChange() {
        let nextState = store.getState();
        if (!currentState) currentState = nextState;
        else if (compareStates(currentState, nextState)) {
          currentState = nextState;
          onChange(currentState);
        }
      }

      let unsubscribe = store.subscribe(handleChange);

      handleChange();
      return unsubscribe;
    }
  };
}

//  nextState.selectedDatasetName !== currentState.selectedDatasetName ||
//           nextState.datasetDict !== currentState.datasetDict
