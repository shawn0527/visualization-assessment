import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
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
import Chart from "./Chart"

const subscriptionClient = new SubscriptionClient(
  "ws://react.eogresources.com/graphql",
  {
    reconnect: true,
    timeout: 20000
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

const hquery = `
query {
    heartBeat
}`;

const query = `
query($input: [MeasurementQuery]){
  getMultipleMeasurements(input: $input) {
    metric
    measurements{
      metric
      at
      value
      unit
    }
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

const Plot = () => {
  const [heartBeatRes] = useQuery({query:hquery})
  const loadTime = heartBeatRes.data?heartBeatRes.data.heartBeat:null
  const selectedMetrics = useSelector(state=>state.metric.selectedMetrics)
  const historical = 30 * 60 * 1000;
  const allPlotsObj = {}
  const dispatch = useDispatch()
  const input = metric => {
    return {
      metricName: metric,
      after: loadTime - historical,
      before: loadTime
    }
  };

  const [results] = useQuery({
    query,
    variables: { 
      input: selectedMetrics.map(metric => input(metric))
     }
  });
  const { fetching, data, error } = results;
  const allPlotsArr = data ? data.getMultipleMeasurements : [];
  for(let i=0; i<allPlotsArr.length; i++) {
    allPlotsObj[allPlotsArr[i].metric] = allPlotsArr[i].measurements
  }
  const handleSubscription = (allPlots=allPlotsObj, response) => {
    if(selectedMetrics.length !==0) {
      const newPlot = response.newMeasurement
      selectedMetrics.map(metricName => {
        const currentPlots = allPlots[metricName]
        if(newPlot.metric === metricName) {
          const currentPlots = allPlots[metricName]
          currentPlots.push(newPlot)
          allPlots[metricName] = currentPlots
          dispatch({ type: actions.ALL_DATA_RECEIVED, currentPlots})
        }
        dispatch({ type: actions.ALL_DATA_RECEIVED, currentPlots})
        return null
      })
    }
  };

  useSubscription({ query: newMeasurementQuery}, handleSubscription);

  useEffect(() => {
    if (error) {
      dispatch({ type: actions.API_ERROR, error: error.message });
      return;
    }
    if (!data ) return
  }, [dispatch, data, error]);

  if (fetching) return <LinearProgress />;
  return (
    <div>
      <Chart />
    </div>
  )
};
