import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as actions from "../store/actions";
import { Provider, createClient, useQuery } from "urql";
import LinearProgress from "@material-ui/core/LinearProgress";
import { Dropdown } from "semantic-ui-react";
import LiveBoxContainer from "./LiveBoxContainer";
import PlotContainer from "./PlotContainer";

const client = createClient({
  url: "https://react.eogresources.com/graphql"
});

const query = `
query {
  getMetrics
}
`;

const getAllMetrics = state => {
  const allMetrics = state.metric.allMetrics;
  return {
    allMetrics
  };
};

export default () => {
  return (
    <Provider value={client}>
      <SearchSelection />
    </Provider>
  );
};

const SearchSelection = () => {
  const dispatch = useDispatch();
  const { allMetrics } = useSelector(getAllMetrics);
  const [result] = useQuery({
    query
  });
  const handleChange = () => {
    const searchBar = document.getElementById("selectedMetrics")
      ? document.getElementById("selectedMetrics")
      : false;
    setTimeout(() => {
      const selectedMetricsATags = searchBar
        ? searchBar.getElementsByClassName("ui label")
        : [];
      const selectedMetrics = [];
      if (selectedMetricsATags.length === 0) {
        dispatch({ type: actions.SELECTED_METRICS_RECEIVED, selectedMetrics });
      }
      for (let i = 0; i < selectedMetricsATags.length; i++) {
        selectedMetrics.push(selectedMetricsATags[i].innerText);
        dispatch({ type: actions.SELECTED_METRICS_RECEIVED, selectedMetrics });
      }
    }, 1);
  };

  const { fetching, data, error } = result;
  useEffect(() => {
    if (error) {
      dispatch({ type: actions.API_ERROR, error: error.message });
      return;
    }
    if (!data) return;
    const getAllMetrics = data.getMetrics;
    dispatch({ type: actions.ALL_METRICS_DATA_RECEIVED, getAllMetrics });
  }, [dispatch, data, error]);

  if (fetching) return <LinearProgress />;
  const options = allMetrics.map((metric) => ({
    text: metric,
    value: metric
  }));

  return (
    <div style={{ width: "36%" }}>
      <Dropdown
        id="selectedMetrics"
        style={{ width: "100%" }}
        placeholder="Select..."
        fluid
        multiple
        search
        selection
        options={options}
        onChange={handleChange}
      />
      <LiveBoxContainer />
      <PlotContainer />
    </div>
  );
};
