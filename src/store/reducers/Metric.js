import * as actions from "../actions";

const initialState = {
  selectedMetrics: [],
  allMetrics: []
};

const allMetricsDataRecevied = (state, action) => {
  const allMetrics = action.getAllMetrics;
  return {
    ...state,
    allMetrics
  };
};

const selectedMetricsDataReceived = (state, action) => {
  const selectedMetrics = action.selectedMetrics;
  return {
    ...state,
    selectedMetrics
  };
};

const handlers = {
  [actions.ALL_METRICS_DATA_RECEIVED]: allMetricsDataRecevied,
  [actions.SELECTED_METRICS_RECEIVED]: selectedMetricsDataReceived
};

export default (state = initialState, action) => {
  const handler = handlers[action.type];
  if (typeof handler === "undefined") return state;
  return handler(state, action);
};
