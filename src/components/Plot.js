import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import * as actions from "../store/actions";
import { LinearProgress } from "@material-ui/core";
import {
  Provider,
  createClient,
  useQuery,
  subscriptionExchange,
  defaultExchanges,
  useSubscription
} from "urql";
import { SubscriptionClient } from "subscriptions-transport-ws";

const subscriptionClient = new SubscriptionClient(
  "ws://react.eogresources.com/graphql",
  {
    reconnect: true,
    timeout: 200000
  }
);
const client = createClient({
  url: "https://react.eogresources.com/graphql",
  exchanges: [
    ...defaultExchanges,
    subscriptionExchange({
      forwardSubscription: operation => subscriptionClient.request(operation)
    })
  ]
});

const newMeasurementQuery = `
    subscription {
        newMeasurement {
            metric
            at
            value
            unit
        }
    }
`;

const query = `
query($input: MeasurementQuery) {
    getMeasurements(input: $input) {
        metric
        at
        value
        unit
    }
}
`;

export default props => {
  return (
    <Provider value={client}>
      <Plot {...props} />
    </Provider>
  );
};

const Plot = props => {
  const historical = 30 * 60 * 1000;
  const metricName = props.metric;
  const loadTime = props.timeStamp;
  const input = {
    metricName: metricName,
    after: loadTime - historical,
    before: loadTime
  };
  const [result] = useQuery({
    query,
    variables: { input }
  });
  const { fetching, data, error } = result;
  const historicalData = data ? data.getMeasurements : [];

  const dispatch = useDispatch();

  const handleSubscription = (allPlots = historicalData, response) => {
    const { newMeasurement } = response;
    if (newMeasurement.metric === metricName) {
      allPlots.push(newMeasurement);
      const getMeasurements = allPlots;
      dispatch({ type: actions.ALL_DATA_RECEIVED, getMeasurements });
    }
  };

  useSubscription({ query: newMeasurementQuery }, handleSubscription);

  useEffect(() => {
    if (error) {
      dispatch({ type: actions.API_ERROR, error: error.message });
      return;
    }
    if (!data) return;
    const { getMeasurements } = data;
    dispatch({ type: actions.ALL_DATA_RECEIVED, getMeasurements });
  }, [dispatch, data, error]);

  if (fetching) return <LinearProgress />;
  return null
};
