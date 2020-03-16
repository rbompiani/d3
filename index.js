// select canvas container and add svg element
const svg = d3.select('.canvas')
    .append('svg')
    .attr('width', 600)
    .attr('height', 600);

// create margins for bar chart
const margin = { top: 20, right: 20, bottom: 100, left: 100 };
const graphWidth = 600 - margin.left - margin.right;
const graphHeight = 600 - margin.bottom - margin.top;

const graph = svg.append('g')
    .attr('width', graphWidth)
    .attr('height', graphHeight)
    .attr('transform', `translate(${margin.left},${margin.top})`);

const xAxisGroup = graph.append('g')
    .attr('transform', `translate(0,${graphHeight})`)
const yAxisGroup = graph.append('g');

// retrieve json data
d3.json('planets.json').then(data => {

    //determin min/max values from data
    const min = d3.min(data, d => d.orders);
    const max = d3.max(data, d => d.orders);
    const extent = d3.extent(data, d => d.orders);

    //remap vertical scale based on data max value
    const y = d3.scaleLinear()
        .domain([0, max])
        .range([graphHeight, 0]);

    //remap horizontal band widths based on number of entries and bar padding
    const x = d3.scaleBand()
        .domain(data.map(item => item.name))
        .range([0, 500])
        .paddingInner(0.2)
        .paddingOuter(0.2);


    //select all rects within the svg(currently, none)
    const rects = graph.selectAll('rects')
        .data(data);

    rects.attr('width', x.bandwidth)
        .attr('height', d => y(d.orders))
        .attr('fill', 'orange')
        .attr('x', d => x(d.name));

    //create a rect for each data entry that does not find a rect above
    rects.enter()
        .append('rect')
        .attr('width', x.bandwidth)
        .attr('height', d => graphHeight - y(d.orders))
        .attr('fill', 'orange')
        .attr('x', d => x(d.name))
        .attr('y', d => y(d.orders));

    //create and call the axes
    const xAxis = d3.axisBottom(x);
    const yAxis = d3.axisLeft(y)
        .ticks(3)
        .tickFormat(d => d + ' orders');

    xAxisGroup.call(xAxis);
    yAxisGroup.call(yAxis);

    xAxisGroup.selectAll('text')
        .attr('transform', 'rotate(-40)')
        .attr('text-anchor', 'end')
        .attr('fill', 'orange');
})
