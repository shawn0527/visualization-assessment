import React from "react";
import { useSelector } from "react-redux";
import { Statistic } from "semantic-ui-react"

const LiveBoxContainer = () => {
  const selectedMetrics = useSelector(state => state.metric.selectedMetrics)
  const livePlots = useSelector(state => state.plot.livePlots)
  const liveBoxes = []
  for(let i=0; i<selectedMetrics.length; i++) {
    const metricName = selectedMetrics[i]
    const liveData = livePlots[metricName]
    if(liveData !== undefined) liveBoxes.push(liveData)
  }
  
  return(
    <div>
    {liveBoxes.length !== 0
    ?liveBoxes.map(plot => 
      <Statistic key={plot.metric} size='small'>
        <Statistic.Label>{plot.metric}</Statistic.Label>
        <Statistic.Value>{plot.value}</Statistic.Value>
      </Statistic>)
    :null}
    </div>   
  )
}

export default LiveBoxContainer 