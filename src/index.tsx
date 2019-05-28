import React from "react";
import ReactDOM from "react-dom";
import "semantic-ui-css/semantic.min.css";
import App from "./App/App";
import * as serviceWorker from "./serviceWorker";
import { AppState, UpsetState } from "./State/UpsetState";
import { Provider } from "react-redux";
import { AnyAction, Store } from "redux";
import { DatasetActions } from "./State/Reducers/Dataset.reducer";
import { processCsv } from "./Data/processCsv";

const store = AppState();

export function observeStore(
  store: Store<UpsetState, AnyAction>,
  onChange: Function
) {
  let currentState: UpsetState;

  function handleChange() {
    let nextState = store.getState();
    if (!currentState) currentState = nextState;
    else if (
      nextState.selectedDatasetName !== currentState.selectedDatasetName ||
      nextState.datasetDict !== currentState.datasetDict
    ) {
      currentState = nextState;
      onChange(currentState);
    }
  }

  let unsubscribe = store.subscribe(handleChange);
  handleChange();
  return unsubscribe;
}

observeStore(store, (state: UpsetState) =>
  processCsv(state.datasetDict[state.selectedDatasetName])
);

store.dispatch({
  type: DatasetActions.CHANGE_DATASET,
  args: "Simpsons Characters"
});

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
