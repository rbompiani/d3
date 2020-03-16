// select svg container

const svg = d3.select('svg');

const y = d3.scaleLinear()
    .domain([0, 1000])
    .range([0, 500]);

d3.json('planets.json').then(data => {
    const rects = svg.selectAll('rects')
        .data(data);

    rects.attr('width', 50)
        .attr('height', d => d.orders)
        .attr('fill', 'orange')
        .attr('x', (d, i) => i * 70);

    rects.enter()
        .append('rect')
        .attr('width', 50)
        .attr('height', d => d.orders)
        .attr('fill', 'orange')
        .attr('x', (d, i) => i * 70);
})
