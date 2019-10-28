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
      return e['time'] = new Date(e.time).toLocaleTimeString()
    });
  }

  const YAxisList = []
  if(selectedMetrics.length !== 0) {
    if(!!allPlots[selectedMetrics[0]])
    YAxisList.push(<YAxis  unit={allPlots[selectedMetrics[0]][0].unit} domain={["auto", "auto"]} />);
    if(!!allPlots[selectedMetrics[1]])
    YAxisList.push(<YAxis unit={allPlots[selectedMetrics[1]][0].unit} domain={["auto", "auto"]} />);
  }
  console.log(YAxisList)

  return (
  selectedMetrics.length !== 0 && !!allPlots[selectedMetrics[0]]?
  <LineChart
    width={500}
    height={300}
    data={newPlots}
    margin={{
      top: 5,
      right: 30,
      left: 20,
      bottom: 5
    }}
  >
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="time" />
    {YAxisList.map(e=>e)}
    <Tooltip />
    <Legend />
    {selectedMetrics[0]?<Line
      type="monotone"
      dataKey={selectedMetrics[0]}
      stroke="#8884d8"
      dot={false}
      name={selectedMetrics[0]}
    />:null}
    {selectedMetrics[1]?<Line
      type="monotone"
      dataKey={selectedMetrics[1]}
      stroke="red"
      dot={false}
      name={selectedMetrics[1]}
    />:null}
  </LineChart>
  :null)
};

export default Chart;
