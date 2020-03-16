// select canvas container and add svg element
const svg = d3.select('.canvas')
    .append('svg')
    .attr('width', 600)
    .attr('width', 600);

// retrieve json data
d3.json('planets.json').then(data => {

    //determin min/max values from data
    const min = d3.min(data, d => d.orders);
    const max = d3.max(data, d => d.orders);
    const extent = d3.extent(data, d => d.orders);

    //remap vertical scale based on data max value
    const y = d3.scaleLinear()
        .domain([0, max])
        .range([0, 500]);

    //remap horizontal band widths based on number of entries and bar padding
    const x = d3.scaleBand()
        .domain(data.map(item => item.name))
        .range([0, 500])
        .paddingInner(0.2)
        .paddingOuter(0.2);


    //select all rects within the svg(currently, none)
    const rects = svg.selectAll('rects')
        .data(data);

    rects.attr('width', x.bandwidth)
        .attr('height', d => y(d.orders))
        .attr('fill', 'orange')
        .attr('x', d => x(d.name));

    //create a rect for each data entry that does not find a rect above
    rects.enter()
        .append('rect')
        .attr('width', x.bandwidth)
        .attr('height', d => y(d.orders))
        .attr('fill', 'orange')
        .attr('x', d => x(d.name));
})
