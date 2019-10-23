import * as actions from "../actions";

const initialState = {
  metric: "",
  at: null,
  value: null,
  unit: ""
};

const measurementDataRecevied = (state, action) => {
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
  [actions.MEASUREMENT_DATA_RECEIVED]: measurementDataRecevied
};

export default (state = initialState, action) => {
  const handler = handlers[action.type];
  if (typeof handler === "undefined") return state;
  return handler(state, action);
};
