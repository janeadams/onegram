console.log("loaded visualization.js")

let width = window.innerWidth
let height = window.innerHeight

class Chart {
    constructor(opts){
        this.element = opts.element
        this.draw()
    }

    createScales() {
        const m = this.margin
        this.xScale = d3.scaleTime().domain(params.xrange).range([0, this.width-m.left])
        this.xViewScale = d3.scaleTime().domain(params.xviewrange).range([0, this.width-m.left])
        // Choose and set time scales (logarithmic or linear) for the main plot *and* the viewfinder
        if (params["scale"] === "log") {this.yViewScale = this.yScale = d3.scaleLog().domain(params["yrange"])}
        else {this.yViewScale = this.yScale = d3.scaleLinear().domain(params["yrange"])}
        // When showing ranks, put rank #1 at the top
        // When showing any other metric, put the highest number at the top and start at 0
        if (params["metric"] === "rank") {
            this.yScale.range([this.height-(m.top+m.bottom), 1])
            this.yViewScale.range([this.height*1.2-(m.top+m.bottom), 1])
        }
        else {
            this.yScale.range([0, this.height-(m.top+m.bottom)])
            this.yViewScale.range([0, this.height*1.2-(m.top+m.bottom)])
        }
    }

    addAxes() {

        const m = this.margin

        const xAxis = d3.axisBottom()
            .scale(this.xViewScale)
            .ticks(d3.timeMonth)

        const xViewAxis = d3.axisBottom()
            .scale(this.xScale)
            .ticks(d3.timeYear)

        const yAxis = d3.axisLeft()
            .scale(this.yScale)
            .ticks(10, "")

        // Add X & Y Axes to main plot
        this.plot.append("g")
            .attr("class", "xaxis")
            .attr("transform", `translate(0, ${this.height-(m.top+m.bottom)})`)
            .call(xAxis)
            .selectAll("text")
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
            .attr("transform", "rotate(-45)")

        this.plot.append("g")
            .attr("class", "yaxis")
            .call(yAxis)

        // Add X Axis to viewfinder plot
        this.viewfinder.append("g")
            .attr("class", "xviewaxis")
            .attr("transform", `translate(0, ${this.height*1.2-(m.top+m.bottom)})`)
            .call(xViewAxis)
            .selectAll("text")
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
    }

    addLabels(){
        // Label xAxis with Metric
        this.plot.append("text")
            .attr("y", this.height / 2 + this.margin.top / 2)
            .attr("x", this.margin.left / 2)
            .attr("dy", "1em")
            .text(String(params['metric']).charAt(0).toUpperCase() + String(params['metric']).slice(1))
            .attr("class","axislabel")

        this.plot.append("text")
            .attr("y", this.margin.top + 10)
            .attr("x", this.margin.left / 2)
            .attr("dy", "0.5em")
            .text("Lexical Fame")
            .attr("class","axislabel")
            .attr("text-anchor", "middle")

        this.plot.append("text")
            .attr("y", height + this.margin.top)
            .attr("x", this.margin.left / 2)
            .attr("dy", "0.5em")
            .text("Lexical Abyss")
            .attr("class","axislabel")
            .attr("text-anchor", "middle")
    }

    brushed(){
        if (d3.event.sourceEvent && d3.event.sourceEvent.type === "zoom") return; // ignore brush-by-zoom
        var s = d3.event.selection || this.xViewScale.range();
        xScale.domain(s.map(this.xViewScale.invert, this.xViewScale));
        Line_chart.select(".line").attr("d", line);
        this.plot.select(".xaxis").call(xAxis);
        svg.select(".zoom").call(zoom.transform, d3.zoomIdentity
            .scale(this.width / (s[1] - s[0]))
            .translate(-s[0], 0));
    }

    zoomed(){
        if (d3.event.sourceEvent && d3.event.sourceEvent.type === "brush") return; // ignore zoom-by-brush
        var t = d3.event.transform;
        x.domain(t.rescaleX(this.xViewScale).domain());
        Line_chart.select(".line").attr("d", line);
        this.plot.select(".xaxis").call(xAxis);
        context.select(".brush").call(brush.move, this.xScale.range().map(t.invertX, t));
    }

    addLine(ngram) {

        console.log(`Adding line for ${ngram} to ${this.plot.attr('class')}`)
        const ndata = ngramData[ngram]['data']
        const colorid = ngramData[ngram]['colorid']
        const uuid = ngramData[ngram]['uuid']

        const line = d3.line()
            .x(d => this.xScale(dateParser(d[0])))
            .y(d => this.yScale(d[1]));

        const viewerline = d3.line()
            .x(d => this.xViewScale(dateParser(d[0])))
            .y(d => this.yViewScale(d[1]));

        this.plot.append('path')
            // use data stored in `this`
            .datum(ndata)
            .attr('class',`line uuid-${uuid}`)
            // set stroke to specified color, or default to red
            .attr('stroke', colors.main[colorid] || 'gray')
            .attr('d',line)

        this.viewfinder.append('path')
            // use data stored in `this`
            .datum(ndata)
            .attr('class',`line uuid-${uuid}`)
            // set stroke to specified color, or default to red
            .attr('stroke', colors.main[colorid] || 'gray')
            .attr('d',viewerline)
    }

    removeLine(ngram){
        this.plot.select('.uuid-'+ngramData[ngram]['uuid']).remove()
        this.viewfinder.select('.uuid-'+ngramData[ngram]['uuid']).remove()
    }

    draw() {
        this.width = this.element.offsetWidth
        this.height = this.width/2
        this.margin = { top: 0.1 * this.height, right: 0.15 * this.width, bottom: 0.25 * this.height, left: 0.1 * this.width }
        // set up parent element and SVG
        this.element.innerHTML = ''

        this.createScales()

        let zoom = d3.zoom()
            .scaleExtent([1, 5])
            .translateExtent([[0, 0], [this.width, this.height]])
            .extent([[0, 0], [this.width, this.height]])
            .on("zoom", this.zoomed)

        let brush = d3.brushX()
            .extent([[0, 0], [this.width, this.height/5]])
            .on("brush end", this.brushed)

        const svg = d3.select(this.element).append('svg')
        svg.attr('width', this.width)
        svg.attr('height', this.height)

        const clip = svg.append("defs").append("svg:clipPath")
            .attr("id", "clip")
            .append("svg:rect")
            .attr("width", this.width)
            .attr("height", this.height)
            .attr("x", 0)
            .attr("y", 0)

        const plot = svg.append('g')
            .attr('transform',`translate(${this.margin.left},${this.margin.top})`)
            .attr('class','plot')

        const clipgroup = svg.append('g')
            .attr("clip-path", "url(#clip)")

        plot.append("rect")
            .attr("class", "zoom")
            .attr("width", width)
            .attr("height", height)
            .attr("transform", `translate(" + ${this.margin.left} + "," + ${this.margin.top} + ")`)
            .call(zoom);

        const viewfinder = svg.append('g')
            .attr("class", "viewfinder")
            .attr("transform", `translate(" + ${this.margin.left} + "," + ${this.margin.top + this.height + this.margin.bottom} +")`)

        viewfinder.append("g")
            .attr("class", "brush")
            .call(brush)
            .call(brush.move, this.xScale.range())

        this.addAxes()
        this.addLabels()

        Object.keys(ngramData).forEach(n => this.addLine(n))
    }
}

function makeCharts(){
    mainChart = new Chart({element: document.querySelector('#mainplot')})
    d3.select(window).on('resize', () => (mainChart.draw()))
}