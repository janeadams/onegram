// example data
var metricName = "rank";
var optwidth = 0.8 * (document.documentElement.clientWidth);
var optheight = 0.6 * (document.documentElement.clientHeight);

var datesMeasured = [];
var ranksMeasured = [];

// Get the data
d3.json("http://hydra.uvm.edu:3001/api/onegrams/superbowl", function(error, data) {
    data.forEach(function(d) {
        //var parseTime = d3.timeParse("%Y-%m-%d");
        //d.date = parseTime(d.time.substr(0,10));
        d.date = d.time.substr(0, 10);
        datesMeasured.push(d.date);
        ranksMeasured.push(d.rank);
    });

    // change dates to milliseconds
    datesMeasured.forEach(function(part, index, theArray) {
        theArray[index] = d3.time.format("%Y-%m-%d").parse(part).getTime();
    });

    //console.log("datesMeasured = ",datesMeasured);

    var dateArray = d3.time.scale().domain(d3.extent(datesMeasured)).ticks(d3.time.days, 1);

    //console.log("ranksMeasured = ",ranksMeasured);
    //console.log('datesMeasured.length = ',datesMeasured.length);
    //console.log('dateArray.length = ',dateArray.length);
    console.log('There are ', dateArray.length - datesMeasured.length, ' dates missing from the range');

    // check if there is data for each date in dateArray, if so append rank, otherwise append null
    //console.log('dateArray =',dateArray);
    //console.log('dateArray[4] =',dateArray[4]);
    //console.log('dateArray[4].getTime() =',dateArray[4].getTime());
    //console.log('datesMeasured.indexOf(dateArray[4].getTime()) =',datesMeasured.indexOf(dateArray[4].getTime()));

    var dataset = [];
    for (var i = 0; i < dateArray.length; i++) {

        var n = datesMeasured.indexOf(dateArray[i].getTime());
        if (n > -1) {
            var rank = ranksMeasured[n];
        } else {
            var rank = null;
        }
        dataset.push({ rank: rank, date: dateArray[i] });
    }

    // a dataset without the null values is also needed to draw the missing data lines/areas
    var dataset_no_null = dataset.filter(function(d) { return d.rank !== null; });

    //console.log(dataset[2]);

    // a dataset without the null values is also needed to draw the missing data lines/areas
    var dataset_no_null = dataset.filter(function(d) { return d.rank !== null; });

    /*
     * ========================================================================
     *  sizing
     * ========================================================================
     */

    /* === Focus chart === */

    var margin = { top: 0.1 * (optheight), right: 0.1 * (optwidth), bottom: 0.25 * (optheight), left: 0.1 * (optwidth) },
        width = optwidth - margin.left - margin.right,
        height = optheight - margin.top - margin.bottom;

    /* === Context chart === */

    var margin_context = { top: 0.85 * (optheight), right: 0.1 * (optwidth), bottom: 0.1 * (optheight), left: 0.1 * (optwidth) },
        height_context = optheight - margin_context.top - margin_context.bottom;

    /*
     * ========================================================================
     *  x and y coordinates
     * ========================================================================
     */

    // the date range of available data:
    var dataXrange = d3.extent(dataset, function(d) { return d.date; });
    var dataYrange = [0, d3.max(dataset, function(d) { return d.rank; })];

    // maximum date range allowed to display
    var mindate = dataXrange[0], // use the range of the data
        maxdate = dataXrange[1];

    var DateFormat = d3.time.format("%b %d %Y");

    var dynamicDateFormat = timeFormat([
        [d3.time.format("%Y"), function() { return true; }], // <-- how to display when Jan 1 YYYY
        [d3.time.format("%b %Y"), function(d) { return d.getMonth(); }],
        [function() { return ""; }, function(d) { return d.getDate() != 1; }]
    ]);

    /* === Focus Chart === */

    var x = d3.time.scale()
        .range([0, (width)])
        .domain(dataXrange);

    var y = d3.scale.log()
        .range([height, 0])
        .domain(dataYrange);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom")
        .tickSize(-(height))
        .ticks(customTickFunction)
        .tickFormat(dynamicDateFormat);

    var yAxis = d3.svg.axis()
        .scale(y)
        .ticks(4)
        .tickSize(-(width))
        .orient("right");

    /* === Context Chart === */

    var x2 = d3.time.scale()
        .range([0, width])
        .domain([mindate, maxdate]);

    var y2 = d3.scale.log()
        .range([height_context, 0])
        .domain([d3.max(ranksMeasured), 1]);

    var xAxis_context = d3.svg.axis()
        .scale(x2)
        .orient("bottom")
        .ticks(customTickFunction)
        .tickFormat(dynamicDateFormat);

    /*
     * ========================================================================
     *  Plotted line and area variables
     * ========================================================================
     */

    /* === Focus Chart === */

    var line = d3.svg.line()
        .defined(function(d) { return d.rank !== null; })
        .x(function(d) { return x(d.date); })
        .y(function(d) { return y(d.rank); });

    var area = d3.svg.area()
        .defined(line.defined())
        .x(function(d) { return x(d.date); })
        // invert colors to top of chart instead of bottom with -1
        .y0(height)
        .y1(function(d) { return y(d.rank); });

    var line_missing = d3.svg.line()
        .x(function(d) { return x(d.date); })
        .y(function(d) { return y(d.rank); });

    var area_missing = d3.svg.area()
        .x(function(d) { return x(d.date); })
        // invert colors to top of chart instead of bottom with -1
        .y0(height)
        .y1(function(d) { return y(d.rank); });


    /* === Context Chart === */

    var line_context = d3.svg.line()
        .defined(function(d) { return d.rank !== null; })
        .x(function(d) { return x2(d.date); })
        .y(function(d) { return y2(d.rank); });

    var area_context = d3.svg.area()
        .defined(line_context.defined())
        .x(function(d) { return x2(d.date); })
        .y0((height_context))
        .y1(function(d) { return y2(d.rank); });

    var line_context_missing = d3.svg.line()
        .x(function(d) { return x2(d.date); })
        .y(function(d) { return y2(d.rank); });

    var area_context_missing = d3.svg.area()
        .x(function(d) { return x2(d.date); })
        .y0((height_context))
        .y1(function(d) { return y2(d.rank); });

    /*
     * ========================================================================
     *  Variables for brushing and zooming behaviour
     * ========================================================================
     */

    var brush = d3.svg.brush()
        .x(x2)
        .on("brush", brushed)
        .on("brushend", brushend);

    var zoom = d3.behavior.zoom()
        .on("zoom", draw)
        .on("zoomend", brushend);

    /*
     * ========================================================================
     *  Define the SVG area ("vis") and append all the layers
     * ========================================================================
     */

    // === the main components === //

    var vis = d3.select("#metric-modal").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .attr("class", "metric-chart"); // CB -- "line-chart" -- CB //

    vis.append("defs").append("clipPath")
        .attr("id", "clip")
        .append("rect")
        .attr("width", width)
        .attr("height", height);
    // clipPath is used to keep line and area from moving outside of plot area when user zooms/scrolls/brushes

    var rect = vis.append("svg:rect")
        .attr("class", "pane")
        .attr("width", width)
        .attr("height", height)
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var context = vis.append("g")
        .attr("class", "context")
        .attr("transform", "translate(" + margin_context.left + "," + margin_context.top + ")");

    var focus = vis.append("g")
        .attr("class", "focus")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    rect.call(zoom)
        .call(draw);

    // === current date range text & zoom buttons === //

    var display_range_group = vis.append("g")
        .attr("id", "buttons_group")
        .attr("transform", "translate(" + 0 + "," + 0 + ")");

    var expl_text = display_range_group.append("text")
        .text("Showing data from: ")
        .style("text-anchor", "start")
        .attr("transform", "translate(" + 0 + "," + 10 + ")");


    display_range_group.append("text")
        .attr("id", "displayDates")
        .text(DateFormat(dataXrange[0]) + " - " + DateFormat(dataXrange[1]))
        .style("text-anchor", "start")
        .attr("transform", "translate(" + 82 + "," + 10 + ")");


    var expl_text = display_range_group.append("text")
        .text("Zoom to: ")
        .style("text-anchor", "start")
        .attr("transform", "translate(" + 210 + "," + 10 + ")");

    // === the zooming/scaling buttons === //

    var button_width = 40;
    var button_height = 14;

    // don't show year button if < 1 year of data
    var dateRange = dataXrange[1] - dataXrange[0],
        ms_in_year = 31540000000;

    if (dateRange < ms_in_year) {
        var button_data = ["month", "all"];
    } else {
        var button_data = ["year", "month", "all"];
    };

    var button = display_range_group.selectAll("g")
        .data(button_data)
        .enter().append("g")
        .attr("class", "scale_button")
        .attr("transform", function(d, i) { return "translate(" + (280 + i * button_width + i * 10) + ",0)"; })
        .on("click", scaleDate);

    button.append("rect")
        .attr("width", button_width)
        .attr("height", button_height)
        .attr("rx", 1)
        .attr("ry", 1);

    button.append("text")
        .attr("dy", (button_height / 2 + 3))
        .attr("dx", button_width / 2)
        .style("text-anchor", "middle")
        .text(function(d) { return d; });

    /* === focus chart === */

    focus.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .attr("transform", "translate(" + (width) + ", 0)");

    // missing data area
    focus.append("path")
        .datum(dataset_no_null)
        .attr("class", "area_missing")
        .attr("d", area_missing)
        .call(zoom)
        .call(draw);

    // complete data area
    focus.append("path")
        .datum(dataset)
        .attr("class", "area")
        .attr("d", area)
        .call(zoom)
        .call(draw);

    // x-axis
    focus.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    // missing data line
    focus.append("path")
        .datum(dataset_no_null)
        .attr("class", "line_missing")
        .attr("d", line_missing);

    // complete data line
    focus.append("path")
        .datum(dataset)
        .attr("class", "line")
        .attr("d", line);

    // circles
    focus.selectAll(".dot")
        .data(dataset_no_null)
        .enter().append("circle")
        .attr("class", "dot")
        .attr("r", 2)
        .attr("cx", function(d) { return x(d.date); })
        .attr("cy", function(d) { return y(d.rank); })
        .on("mouseover", function(d) { show_tooltip(d) })
        .on("mouseout", function(d) { hide_tooltip(d) });

    /* === tooltip === */
    var div = d3.select("#metric-modal").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    /* === context chart === */

    context.append("path")
        .datum(dataset_no_null)
        .attr("class", "area_missing")
        .attr("d", area_context_missing);

    context.append("path")
        .datum(dataset)
        .attr("class", "area")
        .attr("d", area_context);

    context.append("path")
        .datum(dataset_no_null)
        .attr("class", "line_missing")
        .attr("d", line_context_missing);

    context.append("path")
        .datum(dataset)
        .attr("class", "line")
        .attr("d", line_context);

    context.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height_context + ")")
        .call(xAxis_context);

    /* === brush (part of context chart)  === */

    var brushg = context.append("g")
        .attr("class", "x brush")
        .call(brush);

    brushg.selectAll(".extent")
        .attr("y", -6)
        .attr("height", height_context + 8);
    // .extent is the actual window/rectangle showing what's in focus

    brushg.selectAll(".resize")
        .append("rect")
        .attr("class", "handle")
        .attr("transform", "translate(0," + -3 + ")")
        .attr('rx', 2)
        .attr('ry', 2)
        .attr("height", height_context + 6)
        .attr("width", 3);

    brushg.selectAll(".resize")
        .append("rect")
        .attr("class", "handle-mini")
        .attr("transform", "translate(-2,8)")
        .attr('rx', 3)
        .attr('ry', 3)
        .attr("height", (height_context / 2))
        .attr("width", 7);
    // .resize are the handles on either size
    // of the 'window' (each is made of a set of rectangles)

    /* === y axis title === */

    function toTitleCase(str) {
        return str.replace(
            /\w\S*/g,
            function(txt) {
                return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
            }
        );
    }

    vis.append("text")
        .attr("class", "y axis title")
        .text(toTitleCase(this.metricName))
        .attr("x", (-(height / 2)))
        .attr("y", 0)
        .attr("dy", "1em")
        .attr("transform", "rotate(-90)")
        .style("text-anchor", "middle");

    // allows zooming before any brush action
    zoom.x(x);

    /*
     * ========================================================================
     *  Functions
     * ========================================================================
     */

    // === tick/date formatting functions ===
    // from: https://stackoverflow.com/questions/20010864/d3-axis-labels-become-too-fine-grained-when-zoomed-in

    function timeFormat(formats) {
        return function(date) {
            var i = formats.length - 1,
                f = formats[i];
            while (!f[1](date)) f = formats[--i];
            return f[0](date);
        };
    };

    function customTickFunction(t0, t1, dt) {
        var labelSize = 42; //
        var maxTotalLabels = Math.floor(width / labelSize);

        function step(date, offset) {
            date.setMonth(date.getMonth() + offset);
        }

        var time = d3.time.month.ceil(t0),
            times = [],
            monthFactors = [1, 3, 4, 12];

        while (time < t1) times.push(new Date(+time)), step(time, 1);
        var timesCopy = times;
        var i;
        for (i = 0; times.length > maxTotalLabels; i++)
            times = _.filter(timesCopy, function(d) {
                return (d.getMonth()) % monthFactors[i] == 0;
            });

        return times;
    };

    // === tooltip functions === //

    // from: http://bl.ocks.org/d3noob/a22c42db65eb00d4e369
    function show_tooltip(d) {


        div.transition()
            .duration(60)
            .style("opacity", 0.98);
        div.html("<b>" + DateFormat(d.date) + "</b><br/>" + metricName + ": " + d.rank)
            .style("left", (d3.event.pageX - 30) + "px") //(d3.event.pageX) + "px"
            .style("top", (d3.event.pageY - 40) + "px"); //(d3.event.pageY - 28) + "px"
    };

    function hide_tooltip(d) {
        div.transition()
            .duration(60)
            .style("opacity", 0);
    };


    // === brush and zoom functions ===

    function brushed() {
        x.domain(brush.empty() ? x2.domain() : brush.extent());
        common_behaviour();
        // Reset zoom scale's domain
        zoom.x(x);
        updateDisplayDates();
        setYdomain();

    }

    function draw() {
        setYdomain();
        common_behaviour();
        // Force changing brush range
        brush.extent(x.domain());
        vis.select(".brush").call(brush);
        // and update the text showing range of dates.
        updateDisplayDates();
    }

    function common_behaviour() {
        focus.select(".area").attr("d", area);
        focus.select(".line").attr("d", line);
        focus.select(".area_missing").attr("d", area_missing);
        focus.select(".line_missing").attr("d", line_missing);
        focus.select(".x.axis").call(xAxis);
        focus.selectAll(".dot")
            .attr("cx", function(d) { return x(d.date); })
            .attr("cy", function(d) { return y(d.rank); });
    };

    function brushend() {
        // when brush stops moving:

        // check whether chart was scrolled out of bounds and fix,
        var b = brush.extent();
        var out_of_bounds = brush.extent().some(function(e) { return e < mindate | e > maxdate; });
        if (out_of_bounds) { b = moveInBounds(b) };

    };

    function updateDisplayDates() {

        var b = brush.extent();
        // update the text that shows the range of displayed dates
        var localBrushDateStart = (brush.empty()) ? DateFormat(dataXrange[0]) : DateFormat(b[0]),
            localBrushDateEnd = (brush.empty()) ? DateFormat(dataXrange[1]) : DateFormat(b[1]);

        // Update start and end dates in upper right-hand corner
        d3.select("#displayDates")
            .text(localBrushDateStart == localBrushDateEnd ? localBrushDateStart : localBrushDateStart + " - " + localBrushDateEnd);
    };

    function moveInBounds(b) {
        // move back to boundaries if user pans outside min and max date.

        var ms_in_year = 31536000000,
            brush_start_new,
            brush_end_new;

        if (b[0] < mindate) { brush_start_new = mindate; } else if (b[0] > maxdate) { brush_start_new = new Date(maxdate.getTime() - ms_in_year); } else { brush_start_new = b[0]; };

        if (b[1] > maxdate) { brush_end_new = maxdate; } else if (b[1] < mindate) { brush_end_new = new Date(mindate.getTime() + ms_in_year); } else { brush_end_new = b[1]; };

        brush.extent([brush_start_new, brush_end_new]);

        brush(d3.select(".brush").transition());
        brushed();
        draw();

        return (brush.extent())
    };

    function setYdomain() {
        // this function dynamically changes the y-axis to fit the data in focus

        // get the min and max date in focus
        var xleft = new Date(x.domain()[0]);
        var xright = new Date(x.domain()[1]);

        // a function that finds the nearest point to the right of a point
        var bisectDate = d3.bisector(function(d) { return d.date; }).right;

        // get the y value of the line at the left edge of view port:
        var iL = bisectDate(dataset_no_null, xleft);

        if (dataset_no_null[iL] !== undefined && dataset_no_null[iL - 1] !== undefined) {

            var left_dateBefore = dataset_no_null[iL - 1].month,
                left_dateAfter = dataset_no_null[iL].date;

            var intfun = d3.interpolateNumber(dataset_no_null[iL - 1].rank, dataset_no_null[iL].rank);
            var yleft = intfun((xleft - left_dateBefore) / (left_dateAfter - left_dateBefore));
        } else {
            var yleft = 0;
        }

        // get the x value of the line at the right edge of view port:
        var iR = bisectDate(dataset_no_null, xright);

        if (dataset_no_null[iR] !== undefined && dataset_no_null[iR - 1] !== undefined) {

            var right_dateBefore = dataset_no_null[iR - 1].date,
                right_dateAfter = dataset_no_null[iR].date;

            var intfun = d3.interpolateNumber(dataset_no_null[iR - 1].rank, dataset_no_null[iR].rank);
            var yright = intfun((xright - right_dateBefore) / (right_dateAfter - right_dateBefore));
        } else {
            var yright = 0;
        }

        // get the y values of all the actual data points that are in view
        var dataSubset = dataset.filter(function(d) { return d.date >= xleft && d.date <= xright; });
        //console.log(dataSubset);
        var rankSubset = [];
        dataSubset.map(function(d) { rankSubset.push(d.rank); });

        // add the edge values of the line to the array of ranks in view, get the max y;
        rankSubset.push(yleft);
        rankSubset.push(yright);
        var ymax_new = d3.max(rankSubset);
        var ymin_new = d3.min(rankSubset);

        if (ymax_new == 1) {
            ymax_new = dataYrange[1];
        }

        // reset and redraw the yaxis
        y.domain([ymax_new * 1.05, 1]);
        focus.select(".y.axis").call(yAxis);

    };

    function scaleDate(d, i) {
        // action for buttons that scale focus to certain time interval

        var b = brush.extent(),
            interval_ms,
            brush_end_new,
            brush_start_new;

        if (d == "year") { interval_ms = 31536000000 } else if (d == "month") { interval_ms = 2592000000 };

        if (d == "year" | d == "month") {

            if ((maxdate.getTime() - b[1].getTime()) < interval_ms) {
                // if brush is too far to the right that increasing the right-hand brush boundary would make the chart go out of bounds....
                brush_start_new = new Date(maxdate.getTime() - interval_ms); // ...then decrease the left-hand brush boundary...
                brush_end_new = maxdate; //...and set the right-hand brush boundary to the maxiumum limit.
            } else {
                // otherwise, increase the right-hand brush boundary.
                brush_start_new = b[0];
                brush_end_new = new Date(b[0].getTime() + interval_ms);
            };

        } else if (d == "all") {
            brush_start_new = dataXrange[0];
            brush_end_new = dataXrange[1]
        } else {
            brush_start_new = b[0];
            brush_end_new = b[1];
        };

        brush.extent([brush_start_new, brush_end_new]);

        // now draw the brush to match our extent
        brush(d3.select(".brush").transition());
        // now fire the brushstart, brushmove, and brushend events
        brush.event(d3.select(".brush").transition());
    }
});