import * as actions from "../actions";

const initialState = {
  allPlots: []
};

const historicalDataRecevied = (state, action) => {
    // console.log(action)
  const allPlots = action.getMeasurements;
  return {
    allPlots
  };
};

// const selectedMetricsDataReceived = (state, action) => {
//   const selectedMetrics = action.selectedMetrics;
//   return {
//     ...state,
//     selectedMetrics
//   };
// };

const handlers = {
  [actions.HISTORICAL_DATA_RECEIVED]: historicalDataRecevied,
};

export default (state = initialState, action) => {
  const handler = handlers[action.type];
  if (typeof handler === "undefined") return state;
  return handler(state, action);
};
