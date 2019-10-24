import * as actions from "../actions";

const initialState = {
  metrics: []
};

const measurementDataRecevied = (state, action) => {
  const metrics = action.getMetrics;
  return {
    metrics
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
