import * as actions from "../actions";

const initialState = {
  allPlots: [],
  lastPlot: {},
  currentTime: 0
};

const historicalDataRecevied = (state, action) => {
  const allPlots = action.historicalData;
  return {
    ...state,
    allPlots
  };
};

const currentTimeReceived = (state, action) => {
  const currentTime = action.currentTime;
  return {
    ...state,
    currentTime
  };
};

const lastPlotReceived = (state, action) => {
  console.log(action)
  const lastPlot = action.lastPlot
  return {
    ...state,
    lastPlot
  }
}

const handlers = {
  [actions.HISTORICAL_DATA_RECEIVED]: historicalDataRecevied,
  [actions.CURRENT_TIME]: currentTimeReceived,
  [actions.LAST_KNOWN_PLOT]: lastPlotReceived
};

export default (state = initialState, action) => {
  const handler = handlers[action.type];
  if (typeof handler === "undefined") return state;
  return handler(state, action);
};
