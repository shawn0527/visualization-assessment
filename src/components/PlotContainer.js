import React, { useEffect, useState } from "react";
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

export default (props) => {
    return (
        <Provider value={client}>
            <PlotContainer {...props}/>
        </Provider>
    )
}

const PlotContainer = (props) => {
    const [result] = useQuery({
        query
    });

    const {fetching, data, error } = result;

    const selectedMetrics = props.selectedMetrics || []


    return(
        selectedMetrics.map(metric => <Plot key={metric} metric={metric} timeStamp={data.heartBeat}/>)
    )
}