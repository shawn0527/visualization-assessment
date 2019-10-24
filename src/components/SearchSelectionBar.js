import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as actions from "../store/actions";
import { Provider, createClient, useQuery } from "urql";
import LinearProgress from "@material-ui/core/LinearProgress";
import { Dropdown } from 'semantic-ui-react';

const client = createClient({
  url: "https://react.eogresources.com/graphql"
});

const queryMetricNames = `
query {
  getMetrics
}
`

const getMetricNames = state => {
  const { metrics } = state.measurement;
  return {
    metrics
  };
};



export default () => {
  return (
    <Provider value={client}>
      <Metrics />
    </Provider>
  );
};

const Metrics = () => {
  const dispatch = useDispatch();
  const { metrics } = useSelector(
    getMetricNames
  );

  const [result] = useQuery({
    query: queryMetricNames
  }
  );

  const { fetching, data, error } = result;
  useEffect(
    () => {
      if (error) {
        dispatch({ type: actions.API_ERROR, error: error.message });
        return;
      }
      if (!data) return;
      const { getMetrics } = data;
      dispatch({ type: actions.MEASUREMENT_DATA_RECEIVED, getMetrics });
    },
    [dispatch, data, error]
  );

  if (fetching) return <LinearProgress />;
  const options = metrics.map((state, index) => ({
    key: metrics[index],
    text: state,
    value: metrics[index]
  }));
  return (
    <Dropdown style={{width: '36%'}} placeholder="Select..." fluid multiple search selection options={options} />
  );
};
