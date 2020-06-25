let params = {}
let ngramData = {}

let xmins = []
let xmaxes = []
let ymins = []
let ymaxes = []
let mainChart
let xRange = []
let yRange = []
let languageCodes = {}
let viewport = 1000

const suggestions = ["haha", "happy new year", "#throwbackthursday", "😊"]

// Limit options for certain parameters
const paramoptions = {
    "language": ['af', 'sq', 'ar', 'an', 'hy', 'ast', 'az', 'eu', 'be', 'bn', 'bs', 'br', 'bg', 'ca', 'ceb', 'ckb', 'cbk', 'hr', 'cs', 'da', 'nl', 'en', 'eo', 'et', 'fi', 'fr', 'fy', 'gl', 'ka', 'de', 'el', 'gu', 'he', 'hi', 'hu', 'is', 'io', 'ilo', 'id', 'ia', 'ie', 'ga', 'it', 'kn', 'kk', 'ko', 'ku', 'la', 'lv', 'lt', 'jbo', 'lb', 'mk', 'mg', 'ml', 'mr', 'mzn', 'min', 'mn', 'ne', 'no', 'nn', 'oc', 'fa', 'pl', 'pt', 'ps', 'qu', 'ro', 'ru', 'nds', 'sr', 'sh', 'sd', 'si', 'sk', 'sl', 'azb', 'es', 'sw', 'sv', 'tl', 'ta', 'te', 'tr', 'uk', 'ur', 'uz', 'vi', 'war', 'cy', 'pnb'],
    "metric": ["rank", "freq"], //["rank", "counts", "freq"],
    "scale": ["log", "lin"]
}

// Today's date
let today = new Date()
// Extract year from today's date
let thisyear = today.getFullYear()
// Get one year ago
let lastyeardate = new Date().setFullYear(thisyear - 1);
// January 1st, this year
let thisfirst = new Date(thisyear, 0, 1)
let firstDate = new Date(2009,9,1)

// Set default options
const defaultparams = {
    "language": "en",
    "metric": "rank",
    "scale": "log",
    //"start": new Date(2009, 8, 1), //lastyeardate,
    "start": lastyeardate,
    "end": today
}

const colors = {
    'names': ["sky", "sage", "gold", "iris", "poppy", "lake", "sea", "rose", "shroom", "sun", "monarch"],
    'main': ["#00B6CF", "#8BC862", "#F3B544", "#9577B5", "#EF3D25", "#3D59A8", "#3BA585", "#C73275", "#805752", "#D5D126", "#EE612F"],
    'dark': ["#0681A2", "#649946", "#cf7b11", "#8D51A0", "#A01D21", "#252E6C", "#197352", "#931E59", "#562F2C", "#8B8633", "#A23522"],
    'light': ["#B5E2EA", "#C8E099", "#FCD69A", "#DAC9E3", "#FAC1BE", "#C0CFEB", "#B9E1D3", "#F6B0CF", "#E1C4C2", "#F8F4A9", "#F9C0AF"]
}

// Simple function for finding the fill, stroke, or tint by the color group name
function colorMe(name, type='main') { return colors[type][colors["names"].indexOf(name)] }
//console.log(colorMe("sky"))

function sentenceCase (str) {
    if ((str===null) || (str===''))
        return false;
    else
        str = str.toString();

    return str.replace(/\w\S*/g,
        function(txt){return txt.charAt(0).toUpperCase() +
            txt.substr(1).toLowerCase();});
}

const dateParser = date => new Date(d3.timeParse(date))
const dateFormatter = d3.timeFormat("%Y-%m-%d")
Date.prototype.addDays = function(days) {
    let date = new Date(this.valueOf())
    date.setDate(date.getDate() + days)
    return date;
}

function isRank(){
    return (params['metric']==='rank')
}

function getDates(startDate, stopDate) {
    let dateArray = []
    let currentDate = startDate
    while (currentDate <= stopDate) {
        dateArray.push(new Date (currentDate))
        currentDate = currentDate.addDays(1)
    }
    return dateArray;
}

const fullDateRange = getDates(firstDate, today)

function setRanges() {
    if (Object.keys(ngramData).length > 0 ){ // If there is ngram data...
        //console.log("Setting ranges...")
        // Get the minimum and maximum values for all ngrams
        xRange = Object.assign([], [d3.min(xmins), d3.max(xmaxes)])
        //console.log(`Setting xRange to ${xRange}`)
        if (params['metric'] === 'freq') {

            if (params['scale'] === 'log') {
                yRange[0] = 0.000000001
                yRange[1] = 0.1
            }
            else {
                yRange[0] = 0.000000001
                yRange[1] = d3.max(ymaxes)
            }

        }
        // for Rank...
        else {
            yRange = [1, 1000000]
        }

        //console.log(`Setting yRange to ${yRange}`)
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

function buildLanguageDropdown(){
    d3.json('language_dropdown.json').then((data) => {
        languageCodes = data
        //console.log(data)
        const codes = []
        Object.keys(data).forEach(language => {
            codes.push(data[language]['db_code'])
            if (data[language]['db_code']===params['language']){
                console.log(`${data[language]['db_code']} = ${params['language']}; setting language to ${language}`)
                d3.select("#langDropdown").append("option").text(language).attr("value",language).property('selected',true)
            }
            else {
                d3.select("#langDropdown").append("option").text(language).attr("value",language).property('selected',false)
            }
        })
        paramoptions['language'] = codes
        console.log(codes.slice(99,))
    })
}

function setupPage() {
    console.log(
        "   _____ _                __          __                    _           \n" +
        "  / ____| |               \\ \\        / /                   | |          \n" +
        " | (___ | |_ ___  _ __ _   \\ \\  /\\  / / __ __ _ _ __   __ _| | ___ _ __ \n" +
        "  \\___ \\| __/ _ \\| '__| | | \\ \\/  \\/ / '__/ _` | '_ \\ / _` | |/ _ \\ '__|\n" +
        "  ____) | || (_) | |  | |_| |\\  /\\  /| | | (_| | | | | (_| | |  __/ |   \n" +
        " |_____/ \\__\\___/|_|   \\__, | \\/  \\/ |_|  \\__,_|_| |_|\\__, |_|\\___|_|   \n" +
        "                        __/ |                          __/ |            \n" +
        "                       |___/                          |___/             \n\n" +
        "UI & API by Jane Adams, Data Visualization Artist\nGet in touch on Twitter @artistjaneadams\n\n"
    )
    viewport = window.innerWidth
    updateDotSize()
    console.log(`viewport: ${viewport}`)
    buildLanguageDropdown()
    d3.select("#queryInput").attr("placeholder",`Enter a query like: ${suggestions[Math.floor(Math.random()*suggestions.length)]}`)
    getUrlParams() // Get parameters from the URL and update current parameters accordingly
    setFilters() // Check the correct boxes in the filter form according to the parameters
    makeCharts()
}

d3.select(window).on('resize', () => {
    viewport = window.innerWidth
    console.log(`viewport: ${viewport}`)
    updateDotSize()
    mainChart.draw()
})