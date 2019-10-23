import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as actions from "../store/actions";
import { Provider, createClient, useQuery } from "urql";
// import { useGeolocation } from "react-use";
import LinearProgress from "@material-ui/core/LinearProgress";
import Chip from "./Chip";

const client = createClient({
  url: "https://react.eogresources.com/graphql"
});

const query = `
query($metricName: String!) {
  getLastKnownMeasurement(metricName: $metricName) {
    metric
    at
    value
    unit
  }
}
`;

const getMetrics = state => {
    debugger
  console.log(state)
  const { metric, at, value, unit } = state.weather;
  return {
    metric,
    at,
    value,
    unit
  };
};

export default () => {
  return (
    <Provider value={client}>
      <Assessment />
    </Provider>
  );
};


const Assessment = () => {
  const getLastKnownMeasurement = getMetrics();
//   // Default to houston
  const metricName = "tubingPressure";
  const dispatch = useDispatch();
  const { metric, at, value, unit } = useSelector(
    getLastKnownMeasurement
  );

  const [result] = useQuery({
    query,
    variables: {
      metricName
    }
  });
  console.log(result)
  const { fetching, data, error } = result;
  useEffect(
    () => {
      if (error) {
        dispatch({ type: actions.API_ERROR, error: error.message });
        return;
      }
      if (!data) return;
      const { getLastKnownMeasurement } = data;
      dispatch({ type: actions.WEATHER_DATA_RECEIVED, getLastKnownMeasurement });
    },
    [dispatch, data, error]
  );

  if (fetching) return <LinearProgress />;

  return (
    <Chip
      label={data}
    />
  );
};
