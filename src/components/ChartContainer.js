import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as actions from "../store/actions";
import { Provider, createClient, useQuery } from "urql";
import Chart from "./Chart"

const client = createClient({
    url: 'https://react.eogresources.com/graphql'
})

export default () => {
    return (
        <ChartContainer />
    )
}

const ChartContainer = () => {

    const selectedMetrics = useSelector(state => state.data.selectedMetrics)

    return(
        selectedMetrics.map(metric => <Chart key={metric} metric={metric} />)
    )
}