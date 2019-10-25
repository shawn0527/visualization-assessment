import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Provider, createClient, useQuery } from 'urql';
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

// const getHistoricalPlots = state => {
//     const { allPlots } = state.plot;
//     return {
//       allPlots
//     };
//   };

export default props => {
    return (
    <Provider value={client}>
        <Plot {...props} />
    </Provider>
    )
}

const Plot = (props) => {
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
    // const dispatch = useDispatch();
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
        <Chart data={data?data.getMeasurements:[]}/>
    )
}