import React from "react";
import { useSelector } from "react-redux";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import _ from "underscore";

const Chart = () => {
  const allPlots = useSelector(state => state.plot.allPlots);
  const selectedMetrics = useSelector(state => state.metric.selectedMetrics);

  const newData = [];
  const newPlots = [];
  if (selectedMetrics.length !== 0 && !!allPlots[selectedMetrics[0]]) {
    for (let obj in allPlots) {
      allPlots[obj].forEach(plot => {
        const newPlot = {};
        newPlot["time"] = plot.at;
        newPlot[plot.metric] = plot.value;
        newData.push(newPlot);
      });
    }

    //_.groupBy is a function of underscore, it returns an object of objects
    //grouped by a certain property of the object
    const groupedData = _.groupBy(newData, "time");
    for (let time in groupedData) {
      const combinedPlot = groupedData[time].reduce(
        (accumulator, currentValue) => Object.assign(accumulator, currentValue),
        {}
      );
      newPlots.push(combinedPlot);
    }

    newPlots.map(e => {
      return (e["time"] = new Date(e.time).toLocaleTimeString());
    });
  }

  //Multiple y axises showing on same chart
  const YAxisList = [];
  const lines = [];
  const colors = {
    tubingPressure: "#8884d8",
    flareTemp: "#33FFEC",
    injValveOpen: "#078FE8",
    oilTemp: "#E807B9",
    casingPressure: "#F84462",
    waterTemp: "#66DE18"
  };
  if (selectedMetrics.length !== 0) {
    for (let i = 0; i < selectedMetrics.length; i++) {
      if (!!allPlots[selectedMetrics[i]])
        YAxisList.push(
          <YAxis
            key={i}
            yAxisId={selectedMetrics[i]}
            unit={allPlots[selectedMetrics[i]][0].unit}
            domain={["auto", "auto"]}
          />
        );
      lines.push(
        <Line
          key={i}
          yAxisId={selectedMetrics[i]}
          type="monotone"
          dataKey={selectedMetrics[i]}
          stroke={colors[selectedMetrics[i]]}
          dot={false}
          name={selectedMetrics[i]}
        />
      );
    }
  }

  return selectedMetrics.length !== 0 && !!allPlots[selectedMetrics[0]] ? (
    <LineChart
      width={1000}
      height={600}
      data={newPlots}
      margin={{
        top: 5,
        right: 50,
        left: 50,
        bottom: 5
      }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="time" />
      {YAxisList.map(e => e)}
      <Tooltip />
      <Legend />
      {lines.map(e => e)}
    </LineChart>
  ) : null;
};

export default Chart;
