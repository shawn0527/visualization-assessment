import React, { useEffect, Fragment } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as actions from "../store/actions";
import { Provider, createClient, useQuery } from "urql";
// import { useGeolocation } from "react-use";
import LinearProgress from "@material-ui/core/LinearProgress";
import Chip from "./Chip";
import { Dropdown } from 'semantic-ui-react';
import { width } from "@material-ui/system";

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

const getMetric = state => {
console.log(state)
console.log(state.measurement)
  const { metric, at, value, unit } = state.measurement;
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
      <Dropdown placeholder="Select..." fluid multiple search selection options />
    </Provider>
  );
};




const Assessment = () => {
//   const getLastKnownMeasurement = getMetrics();
//   // Default to houston
  const metricName = "tubingPressure";
  const dispatch = useDispatch();
  const { metric, at, value, unit } = useSelector(
    getMetric
  );

  const [result] = useQuery({
    query,
    variables: {
      metricName
    }
  });

  const { fetching, data, error } = result;
  useEffect(
    () => {
      if (error) {
        dispatch({ type: actions.API_ERROR, error: error.message });
        return;
      }
      if (!data) return;
      console.log(data)
      const { getLastKnownMeasurement } = data;
      dispatch({ type: actions.MEASUREMENT_DATA_RECEIVED, getLastKnownMeasurement });
    },
    [dispatch, data, error]
  );

  if (fetching) return <LinearProgress />;

  return (
      <Chip label={`${metric} is ${value} ${unit}`}/>
  );
};
