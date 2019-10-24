import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Provider, createClient, useQuery } from 'urql';
import * as actions from '../store/actions'

const client = createClient({
    url: "https://react.eogresources.com/graphql"
})

const plotQuery = `
query($input: MeasurementQuery) {
    getMeasurements(input: $input) {
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
        <Chart metric={props.metric} />
    </Provider>
    )
}

const Chart = props => {
    const [metric, setMetric] = useState(props);
    const currentTime = Date.now()
    const input = {
        metricName: props.metric,
        after: currentTime-1000,
        before: currentTime
    };

    const [result] = useQuery({
        query: plotQuery,
        variables: { input }
    });

    const { fetching, data, error } = result;
    const dispatch = useDispatch()
    console.log(data)
    // useEffect(
    //   () => {
    //     if (error) {
    //         dispatch({ type: actions.API_ERROR, error: error.message });
    //       return;
    //     }
    //     if (!data) return;
    //     const { getMeasurements } = data;
    //     dispatch({ type: actions.WEATHER_DATA_RECEIVED, getMeasurements });
    //   },
    //   [dispatch, data, error]
    // );

    
    return (
        <p>{props.metric}</p>
    )
}