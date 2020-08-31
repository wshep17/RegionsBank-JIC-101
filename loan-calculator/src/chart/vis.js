import * as d3 from 'd3';
import './style.css';

const draw = (props) => {
    d3.select('.vis-barchart > *').remove();

    const data = props.data;
    const margin = { top: 50, right: 20, bottom: 40, left: 55 };
    const width = props.width - margin.left - margin.right;
    const height = props.height - margin.top - margin.bottom;

    let svg = d3.select('.vis-barchart').append('svg')
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
    y.domain([0, d3.max(data, d => d.dollars)]);

    // Create rectangles/bars
    svg.selectAll(".bar")
        .data(data)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", d => x(d.year))
        .attr("width", x.bandwidth())
        .attr("y", d => y(d.dollars))
        .attr("height", d => height - y(d.dollars));

    // X axis
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));
    svg.append("text")
        .attr("text-anchor", "end")
        .attr("x", width/2)
        .attr("y", height + margin.bottom - 5)
        .text("Year");

    // Y axis
    svg.append("g")
        .call(d3.axisLeft(y));
    svg.append("text")
        .attr("text-anchor", "end")
        .attr("transform", "rotate(-90)")
        .attr("x", -margin.top*1.5)
        .attr("y", -margin.left + 15)
        .text("Dollars")

    // Title
    svg.append("text")
        .attr("text-anchor", "middle")
        .attr("x", (width/2))
        .attr("y", 0 - (margin.top/2))
        .style("font-size", "16px")
        .text("Loan Payoff Schedule");
}

export default draw;
