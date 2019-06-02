import React from "react";
import ReactDOM from "react-dom";
import "semantic-ui-css/semantic.min.css";
import App from "./App/App";
import * as serviceWorker from "./serviceWorker";
import { AppState, UpsetState } from "./State/UpsetState";
import { Provider } from "react-redux";
import { DatasetActions } from "./State/Reducers/Dataset.reducer";
import { processCsv } from "./Data/processCsv";
import { generateStoreObserver } from "./utils";

const store = AppState();

const { observeStore } = generateStoreObserver();

observeStore(
  store,
  (currentState: UpsetState, nextState: UpsetState) => {
    return (
      nextState.selectedDatasetName !== currentState.selectedDatasetName ||
      nextState.datasetDict !== currentState.datasetDict
    );
  },
  (state: UpsetState) => {
    processCsv(state.datasetDict[state.selectedDatasetName], store);
  }
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
// serviceWorker.register();
