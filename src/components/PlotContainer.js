import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as actions from "../store/actions";
import { Provider, createClient, useQuery } from "urql";
import Plot from "./Plot"

const client = createClient({
    url: 'https://react.eogresources.com/graphql'
})

const query = `
query {
    heartBeat
}`

export default () => {
    return (
        <Provider value={client}>
            <PlotContainer />
        </Provider>
    )
}

const PlotContainer = () => {

    const [result] = useQuery({
        query
    });

    const {fetching, data, error } = result;

    const selectedMetrics = useSelector(state => state.metric.selectedMetrics)

    return(
        selectedMetrics.map(metric => <Plot key={metric} metric={metric} timeStamp={data.heartBeat}/>)
    )
}