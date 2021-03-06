import * as d3 from 'd3';
import './style.css';

const handleChartType = (props) => {
    const isMultiBarChart = props.data?.isMultiBarChart;
    // if isMultiBarChart is false or doesn't exist, drawSingle
    if (isMultiBarChart === true) {
        drawMulti(props);
    } else {
        drawSingle(props);
    }
}

const drawMulti = (props) => {
    const key = props.data.key;
    d3.selectAll(`.vis-barchart.class-${key} > *`).remove();

    const data = props.data.data;
    const dataFirst = Object.values(props.data.data)[0];
    const newDataArray = [];
    var multipleLoanNames = Object.keys(data);

    // Create new data array of objects for multibar graph
    for (let i = 0; i < multipleLoanNames.length; i++) {
        const loanName = multipleLoanNames[i];
        const values = data[loanName];
        if (loanName === 'default') {
            continue;
        } else {
            newDataArray.push({ group: loanName, values: values })
        }
    }
    const newDataArrayMulti = [];
    const years = data[multipleLoanNames[0]].length;
    for (let i = 0; i < years; i++) {
        newDataArrayMulti.push({year: i+1, values: []});
    }
    for (let i = 0; i < newDataArray.length; i++) {
        const loanName = newDataArray[i].group;
        const values = newDataArray[i].values;
        for (let j = 0; j < values.length; j++) {
            const currentDollars = newDataArray[i].values[j].dollars;
            newDataArrayMulti[j].values.push({ group: loanName, dollars: currentDollars })
        }
    }

    const title = props.data.title;
    const xAxisTitle = props.data.xAxisTitle;
    const margin = { top: 50, right: 20, bottom: 40, left: 70 };
    const width = props.width - margin.left - margin.right;
    const height = props.height - margin.top - margin.bottom;

    let svg = d3.selectAll(`.vis-barchart.class-${key}`).append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Color
    var color = d3.scaleOrdinal()
        .domain(multipleLoanNames)
        .range(["#ca0020", "#f4a582", "#d5d5d5", "#92c5de", "#0571b0"]);

    // Scale x-axis (years)
    let x = d3.scaleBand()
        .range([0, width])
        .padding(0.1);
    x.domain(dataFirst.map(d => d.year));

    // Scale x-axis subgroups (loan names)
    var xSubgroup = d3.scaleBand()
        .domain(multipleLoanNames)
        .range([0, x.bandwidth()])
        .padding([0.05]);

    // Scale y-axis
    let y = d3.scaleLinear()
        .range([height, 0]);
    y.domain([0, d3.max(dataFirst, d => parseInt(d.dollars))]);

    var bars = svg.selectAll(".bar")
        .data(newDataArrayMulti)
        .enter().append("g")
        .attr("class", "g")
        .attr("transform", function (d) {
            return "translate(" + x(d.year) + ",0)";
        })
    bars.selectAll("rect")
        .data(function (d) {
            return d.values;
        })
    .enter().append("rect")
        .attr("class", "bar")
        .attr("x", d => xSubgroup(d.group))
        .attr("y", d => y(d.dollars))
        .attr("width", xSubgroup.bandwidth())
        .attr("height", d => height - y(d.dollars))
        .attr("fill", function (d) { return color(d.group); });

    // Title
    svg.append("text")
        .attr("text-anchor", "middle")
        .attr("x", (width / 2))
        .attr("y", 0 - (margin.top / 2))
        .style("font-size", "16px")
        .text(title);
    // X axis
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));
    svg.append("text")
        .attr("text-anchor", "middle")
        .attr("x", width / 2)
        .attr("y", height + margin.bottom - 5)
        .text(xAxisTitle);
    // Y axis
    svg.append("g")
        .call(d3.axisLeft(y));
    svg.append("text")
        .attr("text-anchor", "middle")
        .attr("transform", "rotate(-90)")
        .attr("x", -margin.top * 2)
        .attr("y", -margin.left + 20)
        .text("Dollars");

    //Legend
    var legend = svg.selectAll(".legend")
        .data(newDataArrayMulti[0].values.map(function (d) { return d.group; }))
        .enter().append("g")
        .attr("class", "legend")
        .attr("transform", function (d, i) { return "translate(0," + i * 20 + ")"; })
        .style("opacity", "0");
    legend.append("rect")
        .attr("x", width - 18)
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", function (d) { return color(d); });
    legend.append("text")
        .attr("x", width - 24)
        .attr("y", 9)
        .attr("dy", ".35em")
        .style("text-anchor", "end")
        .text(function (d) { return d; });
    legend.transition().duration(500).delay(function (d, i) { return 1300 + 100 * i; }).style("opacity", "1");
}

const drawSingle = (props) => {
    const key = props.data.key;
    d3.selectAll(`.vis-barchart.class-${key} > *`).remove();

    let data = props.data.data;
    if (props.data.data.default !== undefined) {
        data = props.data.data.default;
    }
    const title = props.data.title;
    const xAxisTitle = props.data.xAxisTitle;
    const margin = { top: 50, right: 20, bottom: 40, left: 70 };
    const width = props.width - margin.left - margin.right;
    const height = props.height - margin.top - margin.bottom;

    let svg = d3.selectAll(`.vis-barchart.class-${key}`).append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Scale data ranges
    let x = d3.scaleBand()
        .range([0, width])
        .padding(0.1);
    let y = d3.scaleLinear()
        .range([height, 0]);
    x.domain(data.map(d => d.year));
    y.domain([0, d3.max(data, d => parseInt(d.dollars))]);

    // Create rectangles/bars
    svg.selectAll(".bar")
        .data(data)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", d => x(d.year))
        .attr("width", x.bandwidth())
        .attr("y", d => y(d.dollars))
        .attr("height", d => height - y(d.dollars))
        .attr("fill", "#528400");

    // X axis
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));
    svg.append("text")
        .attr("text-anchor", "middle")
        .attr("x", width/2)
        .attr("y", height + margin.bottom - 5)
        .text(xAxisTitle);

    // Y axis
    svg.append("g")
        .call(d3.axisLeft(y));
    svg.append("text")
        .attr("text-anchor", "middle")
        .attr("transform", "rotate(-90)")
        .attr("x", -margin.top*2)
        .attr("y", -margin.left + 20)
        .text("Dollars");

    // Title
    svg.append("text")
        .attr("text-anchor", "middle")
        .attr("x", (width/2))
        .attr("y", 0 - (margin.top/2))
        .style("font-size", "16px")
        .text(title);
}

export default handleChartType;
