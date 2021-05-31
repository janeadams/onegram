import {languageOptions, metricOptions, pageMeta} from "../defaults";
import {titleCase} from "../utils";
import React from "react";

export const colorsRGB = ["rgb(27,158,119",
    "rgb(217,95,2",
    "rgb(117,112,179",
    "rgb(231,41,138",
    "rgb(102,166,30",
    "rgb(230,171,2",
    "rgb(166,118,29",
    "rgb(102,102,102"]

export const getYlabel = (viewer,params) => {
    let Ylabel = params.rt ? metricOptions(viewer, 1)[params.metric] : metricOptions(viewer, 1)[params.metric] + " (no Retweets)"
    Ylabel = Object.keys(metricOptions(viewer, 1)).includes(params.metric) ? Ylabel : titleCase(params.metric);

    if (['num', 'unique'].includes(params.metric)) {
        Ylabel = Ylabel + " " + params.n + "-grams"
    }
    if (params.metric === 'odds') {
        Ylabel = Ylabel + " (1 in X N-grams)"
    }
    return Ylabel
}

export const getMetric = (params) => {
    let formattedMetric = params.metric
    if (['num', 'unique'].includes(params.metric)) {
        formattedMetric = params.metric + "_" + params.n + "grams"
    }
    formattedMetric = params.rt ? formattedMetric : formattedMetric + "_no_rt"
    return formattedMetric
}

export const getXaxisLayout = (viewer, metadata, params, subplot) => {
    let xaxisLayout = {
        range: [params.start, params.end],
        rangeslider: {
            visible: false
        },
        fixedrange: false,
        type: "date",
        rangeselector: subplot ? false : {
            buttons: [
                {label: "Show All Time", step: 'all'}
            ]}
    }
    if (['rtd'].includes(viewer)) {
        xaxisLayout['autorange'] = false
        if (metadata['time_1'] & metadata['time_2']) {
            xaxisLayout['range'] = [metadata['time_1'], metadata['time_2']]
        }
    }
    return xaxisLayout
}

export const getYaxisLayout = (viewer, params) => {
    let yaxisLayout = {
        type: params.scale,
        fixedrange: true,
        autorange: ['rank', 'odds'].includes(params.metric) ? 'reversed' : true,
        title: {text: getYlabel(viewer, params)}
    }
    //console.log(yaxisLayout)
    return yaxisLayout
}

export const getLayout = (viewer, metadata, params, subplot) => {
    let layout = {
        autosize: true,
        xaxis: getXaxisLayout(viewer, metadata, params, subplot),
        yaxis: getYaxisLayout(viewer, params),
        title: subplot ? subplot : getYlabel(viewer, params) + " of " + pageMeta(viewer)['title'] + " by Date",
        showlegend: subplot ? false : true,
        legend: {
            orientation:"h",
            yanchor:"bottom",
            y:1.02,
            xanchor:"right",
            x:1,
            itemwidth: 5
        },
        margin: {
            l: 50,
            r: 50,
            b: 50,
            t: 100,
            pad: 10
        }
    }
    if (['rtd'].includes(viewer)) {
        console.log(metadata)
        let square = {
            type: 'rect',
            xref: 'x',
            x0: metadata['time_1'],
            y0: 0,
            x1: metadata['time_2'],
            yref: 'paper',
            y1: 1,
            fillcolor: 'lightgrey',
            opacity: 0.1
        }
        layout.shapes = [square]
    }
    return layout
}

export const buildTrace = (viewer, key, value, metric, i, subplot) => {
    let languageMap = languageOptions(viewer)
    let name = viewer === "languages" ? languageMap[key] : key
    let trace = {
        x: value['date'],
        y: value[metric],
        type: 'scatter',
        mode: 'lines+markers',
        line: {
            color: colorsRGB[i] + ",0.3)",
            width: subplot ? 2 : 1
        },
        marker: {
            color: colorsRGB[i] + ",0.3)",
            size: subplot ? 4 : 2
        },
        name: name,
        connectgaps: false
    }
    //console.log(trace)
    return trace
}

export const buildTraces = (data, viewer, metric, subplot) => {
    if (data) {
        console.log('Building traces...')
        let traces = []
        console.log({metric})
        let i = 0
        Object.entries(data).forEach(([key, value]) => {
            let trace = buildTrace(viewer, key, value, metric, i, subplot)
            traces.push(trace)
            if (i < (colorsRGB.length - 1)) {
                i += 1
            } else {
                i = 0
            }
        })
        return traces
    }
    else {console.log('no data')}
}