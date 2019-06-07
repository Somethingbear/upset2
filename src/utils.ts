import { UpsetState } from "./State/UpsetState";
import { AnyAction, Store } from "redux";
import { RenderConfig } from "./Data/RenderConfiguration/RenderConfig";

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

export function debouncedEventHandler(delay: number, func: Function) {
  let timerId: number;

  return function(...args: any[]) {
    if (timerId) {
      clearTimeout(timerId);
    }
    timerId = setTimeout(() => {
      func(...args);
      timerId = null as any;
    }, delay);
  };
}

export const RENDER_CONFIG = "upset_render_config";

export function saveConfig(rc: RenderConfig) {
  localStorage.setItem(RENDER_CONFIG, JSON.stringify(rc));
}

export function loadConfig(): RenderConfig {
  return localStorage.getItem(RENDER_CONFIG)
    ? (JSON.parse(localStorage.getItem(
        RENDER_CONFIG
      ) as string) as RenderConfig)
    : (null as any);
}
