console.log("Loading setup.js")
const dateParser = date => new Date(d3.timeParse(date))
const dateFormatter = d3.timeFormat("%Y-%m-%d")

// Today's date
let today = new Date()
// Extract year from today's date
let thisyear = today.getFullYear()
// Get one year ago
let lastyeardate = new Date()
lastyeardate.setFullYear(lastyeardate.getFullYear() - 1 );
// January 1st, this year
let thisfirst = new Date(thisyear, 0, 1)

const defaultNgrams = ["hahaha","one two three","#friday","🦠"]

// Set default options
const defaultparams = {
    "language": "en",
    "metric": "rank",
    "rt": false,
    "scale": "log",
    "start": lastyeardate,
    "end": today
}

let Ngrams = []
let params = {}

// Limit options for certain parameters
const paramoptions = {
    "language": ["en","es","ru","fr"],
    "metric": ["rank", "counts", "freq"],
    "scale": ["log", "lin"],
    "rt": [true,false]
}

let i = 0 // For counting which color to choose for the ngram
let ngramData = {}
let xmins = []
let xmaxes = []
let ymins = []
let ymaxes = []
let mainChart
let subplots = []
let xRange = []
let yRange = []

const colors = {
    'names': ["sky", "sage", "gold", "iris", "poppy", "lake", "sea", "rose", "shroom", "sun", "monarch"],
    'main': ["#00B6CF", "#8BC862", "#F3B544", "#9577B5", "#EF3D25", "#3D59A8", "#3BA585", "#C73275", "#805752", "#D5D126", "#EE612F"],
    'dark': ["#0681A2", "#649946", "#F89921", "#8D51A0", "#A01D21", "#252E6C", "#197352", "#931E59", "#562F2C", "#8B8633", "#A23522"],
    'light': ["#B5E2EA", "#C8E099", "#FCD69A", "#DAC9E3", "#FAC1BE", "#C0CFEB", "#B9E1D3", "#F6B0CF", "#E1C4C2", "#F8F4A9", "#F9C0AF"]
}

// Simple function for finding the fill, stroke, or tint by the color group name
function colorMe(name, type='main') { return colors[type][colors["names"].indexOf(name)] }
//console.log(colorMe("sky"))

function setRanges() {
    if (Object.keys(ngramData).length > 0 ){ // If there is ngram data...
        console.log("Setting ranges...")
        // Get the minimum and maximum values for all ngrams
        xRange = Object.assign([], [d3.min(xmins), d3.max(xmaxes)])
        console.log(`Setting xRange to ${xRange}`)
        // If the metric is rank, start at 1
        if (params['metric'] === 'rank') {yRange[0] = 1}
        // Otherwise start at 0
        else if (params['metric'] === 'freq') {yRange[0] = 0.0000000001}
        // Otherwise start at 0
        else {yRange[0] = 0.01}
        // Set the max of the range to the max of all values. '* 1.2' pads the range a little
        yRange[1] = d3.max(ymaxes) * 1.2
        console.log(`Setting yRange to ${yRange}`)
    }
}

function deepFreeze(o) {
    Object.freeze(o)
    Object.getOwnPropertyNames(o).forEach(function(prop) {
        if (o.hasOwnProperty(prop)
            && o[prop] !== null
            && (typeof o[prop] === "object" || typeof o[prop] === "function")
            && !Object.isFrozen(o[prop])) {
            deepFreeze(o[prop])
        }
    })
    return o
}


function setupPage() {
    getUrlParams() // Get parameters from the URL and update current parameters accordingly
    setFilters() // Check the correct boxes in the filter form according to the parameters
    makeCharts() // Make all the charts\
}