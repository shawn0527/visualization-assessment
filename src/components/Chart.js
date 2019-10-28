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

const Chart = () => {
  // const data = props.data;
  // // const customAxisTick = ()

  const allPlots = useSelector(state => state.plot.allPlots)
  const selectedMetrics = useSelector(state => state.metric.selectedMetrics)

  const newData = []
  if(selectedMetrics.length !== 0 && !!allPlots[selectedMetrics[0]]) {
    allPlots[selectedMetrics[0]].forEach(e => {
          newData.push({
            ...e,
            at: new Date(e.at).toLocaleTimeString()
          })
    })
  }
// ].map(e => {
//     return {
//       ...e,
//       at: new Date(e.at).toLocaleTimeString()
//     }
  // })

  const YAxisList = []
  if(selectedMetrics.length !== 0 && !!allPlots[selectedMetrics[0]]) {
    for(let i=0; i<selectedMetrics.length; i++) {
    YAxisList.push(<YAxis yAxisId={selectedMetrics[i]} unit={newData[0].unit} type="number" domain={["auto", "auto"]} interval="preserveEnd"/>)
  }
  }

  return (
    selectedMetrics.length !== 0 && !!allPlots[selectedMetrics[0]]?
    <LineChart
      width={500}
      height={300}
      data={newData}
      margin={{
        top: 5,
        right: 30,
        left: 20,
        bottom: 5
      }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="at" tick={false}/>
      {/* {YAxisList} */}
      <YAxis unit={newData[0].unit} type="category" domain={["auto", "auto"]} interval="preserveEnd"/>
      <Tooltip />
      <Legend />
      <Line
        type="monotone"
        dataKey="value"
        stroke="#8884d8"
        dot={false}
        name={newData[0].metric}
      />
    </LineChart>
    :null
  );
};

export default Chart;
