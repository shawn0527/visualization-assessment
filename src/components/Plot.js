import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Provider, createClient, useQuery, Query } from 'urql';
import * as actions from '../store/actions'
import { LinearProgress } from '@material-ui/core';
import Chart from "./Chart"

const client = createClient({
    url: "https://react.eogresources.com/graphql"
})

const query = `
query($input: MeasurementQuery) {
    getMeasurements(input: $input) {
        metric
        at
        value
        unit
    }
}
`

const lastPlotQuery = `
query($metricName: String!) {
    getLastKnownMeasurement(metricName: $metricName) {
        metric
        at
        value
        unit
    }
}
`

export default props => {
    return (
    <Provider value={client}>
        <Plot {...props} />
    </Provider>
    )
}

const Plot = (props) => {
    const dispatch = useDispatch();
    const metricName = props.metric
    const historical  = 30*60*1000
    const input = {
        metricName: props.metric,
        after: props.timeStamp-historical,
        before: props.timeStamp
    };
    const [result] = useQuery({
        query,
        variables: { input }
    });
    const { fetching, data, error } = result;
    const historicalData = data?data.getMeasurements:[]
    
    // Handle Live Plot
    setInterval(()=>{
        const currentTime = Date.now()
         
        dispatch({type: actions.CURRENT_TIME, currentTime})
        // dispatch({type:actions.LAST_KNOWN_PLOT, lastPlot})
    }, 10000)

    const currentTime = useSelector(state=>state.plot.currentTime)
    console.log(currentTime)

    const [res] = useQuery({
        query: lastPlotQuery,
        variables: { metricName }
    })
    const lastPlot = res.data?res.data.getLastKnownMeasurement:{}
    // dispatch({type:actions.LAST_KNOWN_PLOT, lastPlot})

    
    // console.log(lastPlot)
        
    

    const [ allData, setData ] = useState([])
    // console.log(allData)
    
    useEffect(()=>{
        if(historicalData.length !== 0 && allData.length !== historicalData.length) {
            setData(historicalData)
        }

    })
    // console.log(allData)
    // const { allPlots } = useSelector(
    //     getHistoricalPlots
    //   );
    
    // useEffect(
    //   () => {
          
    //     if (error) {
    //         dispatch({ type: actions.API_ERROR, error: error.message });
    //       return;
    //     }
    //     if (!data) return;
    //     const { getMeasurements } = data;
    //     dispatch({ type: actions.HISTORICAL_DATA_RECEIVED, getMeasurements });
    //   },
    //   [dispatch, data, error]
    // );

    if (fetching) return <LinearProgress />;
    return (
        // <p>a</p>
        <div>
        <Chart data={allData.length?allData:data.getMeasurements}/>
    </div>
    )
}