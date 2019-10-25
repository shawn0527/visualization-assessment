import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts'

// const getPlots = state => {
//     const { plots } = state.plots
// }


const Chart = (props) => {
  const data = props.data
  const newData = data.map(e => {
    return {
      ...e,
      at: new Date(e.at).toLocaleTimeString()
    } 
  })
  console.log(newData)
  

  return (
    <LineChart
      width={500}
      height={300}
      data={newData}
      margin={{
      top: 5,
      right: 30,
      left: 20,
      bottom: 5
    }}>
      <CartesianGrid strokeDasharray="3 3"/>
      <XAxis dataKey="at"/>
      <YAxis unit={data[0].unit} type="number" domain={['auto','auto']} />
      <Tooltip/>
      <Legend/>
      <Line
        type="monotone"
        dataKey="value"
        stroke="#8884d8"
        dot={false}
        name={data[0].metric}
        />
      {/* <Line type="monotone" dataKey="uv" stroke="#82ca9d"/> */}
    </LineChart>
  );
}

export default Chart