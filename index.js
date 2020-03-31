/* ----------- CONTAINER & GRAPH ----------- */
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
    .attr('transform', `translate(0,${graphHeight})`);
const yAxisGroup = graph.append('g');

/* retrieve json data
d3.json('planets.json').then(data => {
*/

/* ----------- SCALES & AXES ------------- */
//remap vertical scale based on data max value
const y = d3.scaleLinear()
    .range([graphHeight, 0]);

//remap horizontal band widths based on number of entries and bar padding
const x = d3.scaleBand()
    .range([0, graphWidth])
    .paddingInner(0.2)
    .paddingOuter(0.2);

//create the axes
const xAxis = d3.axisBottom(x);
const yAxis = d3.axisLeft(y)
    .ticks(3)
    .tickFormat(d => d + ' orders');

// update x axis text
xAxisGroup.selectAll('text')
    .attr('transform', 'rotate(-40)')
    .attr('text-anchor', 'end')
    .attr('fill', 'orange');

// variable for all transitions
const t = d3.transition().duration(1000);

const widthTween = (d) => {
    //define interpolation
    //d3.interpolate returns a function 
    let i = d3.interpolate(0, x.bandwidth());

    //return a function which takes in a time ticker 't'
    return function (t) {
        //return the vlaue from passing the ticker into the interpolation
        return i(t);
    }
}

/* ----------- UPDATE FUNCTION ----------- */
const update = (data) => {


    //select all rects within the svg(currently, none)
    const rects = graph.selectAll('rect')
        .data(data);

    console.log(rects);
    // remove extra exit selection rectangles
    rects.exit().remove();

    //update scale domains
    y.domain([0, d3.max(data, d => d.orders)]);
    x.domain(data.map(item => item.name));

    // update shapes currently in DOM
    rects.attr('width', x.bandwidth)
        .attr('fill', 'orange')
        .attr('x', d => x(d.name));

    //create a rect for each data entry that does not find a rect above
    rects.enter()
        .append('rect')
        .attr('height', 0)
        .attr('fill', 'orange')
        .attr('x', d => x(d.name))
        .attr('y', graphHeight)
        // add existing rects to this enter selection before updating
        .merge(rects)
        .transition(t)
        .attrTween('width', widthTween)
        .attr('y', d => y(d.orders))
        .attr('height', d => graphHeight - y(d.orders));

    // call axes
    xAxisGroup.call(xAxis);
    yAxisGroup.call(yAxis);
}

var data = [];

/* ----------- CONNECT TO FIREBASE ----------- */
db.collection('dishes').onSnapshot(res => {



    res.docChanges().forEach(change => {
        const doc = { ...change.doc.data(), id: change.doc.id };
        switch (change.type) {
            case 'added':
                data.push(doc);
                break;
            case 'modified':
                const index = data.findIndex(item => item.id == doc.id);
                data[index] = doc;
                break;
            case 'removed':
                data = data.filter(item => item.id !== doc.id);
                break;
            default:
                break;
        }

    })

    update(data);
})
