import * as actions from "../actions";

const initialState = {
  metric: "",
  at: null,
  value: null,
  unit: ""
};


const metricDataRecevied = (state, action) => {
    debugger
  const { getLastKnownMeasurement } = action;
  const {
    metric,
    at,
    value,
    unit
  } = getLastKnownMeasurement;

  return {
    metric,
    at,
    value,
    unit
  };
};

const handlers = {
  [actions.WEATHER_DATA_RECEIVED]: metricDataRecevied
};

export default (state = initialState, action) => {
  const handler = handlers[action.type];
  if (typeof handler === "undefined") return state;
  return handler(state, action);
};
