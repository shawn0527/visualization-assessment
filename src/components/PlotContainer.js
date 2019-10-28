import React from "react";
import { useSelector } from "react-redux";
import { Provider, createClient, useQuery } from "urql";
import Plot from "./Plot";
import Chart from "./Chart"

const client = createClient({
  url: "https://react.eogresources.com/graphql"
});

const query = `
query {
    heartBeat
}`;

export default () => {
  return (
    <Provider value={client}>
      <PlotContainer />
    </Provider>
  );
};

const PlotContainer = () => {
  const [result] = useQuery({
    query
  });
  const { data } = result;
  const selectedMetrics = useSelector(state => state.metric.selectedMetrics);

  return (
    <div>
      {selectedMetrics
        ? selectedMetrics.map(metric => (
            <Plot key={metric} metric={metric} timeStamp={data.heartBeat} />
          ))
        : null}
        <Chart />
    </div>
  );
};
