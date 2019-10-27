import * as actions from "../actions";

const initialState = {
  allPlots: [],
  livePlots: {}
};

const allDataRecevied = (state, action) => {
  const allPlots = action.getMeasurements;
  const newMeasurement = allPlots[allPlots.length-1];
  const metricName = newMeasurement.metric
  const livePlots = state.livePlots
  livePlots[metricName] = newMeasurement
  return {
    livePlots,
    allPlots
  };
};

const handlers = {
  [actions.ALL_DATA_RECEIVED]: allDataRecevied
};

export default (state = initialState, action) => {
  const handler = handlers[action.type];
  if (typeof handler === "undefined") return state;
  return handler(state, action);
};
