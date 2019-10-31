import * as actions from "../actions";

const initialState = {
  allPlots: {},
  livePlots: {}
};

const allDataRecevied = (state, action) => {
  console.log(action)
  const currentPlots = action.currentPlots;
  const newMeasurement = currentPlots[currentPlots.length-1];
  const metricName = newMeasurement.metric
  const livePlots = state.livePlots
  const allPlots = state.allPlots
  allPlots[metricName] = currentPlots
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
