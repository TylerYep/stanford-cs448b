const plotWidth = 1000;
const plotHeight = 800;
const buf = 15;
const svg = d3.select('#vis')
            .attr('width', plotWidth)
            .attr('height', plotHeight);


function main() {
    let restaurantData;
    // const button = document.querySelector('button');
    // button.addEventListener('click', () => {
    //     let newData = allData.filter(d => d.species == 'dog');
    //     drawPoints(newData);
    // });
    projection = drawMap();

    d3.csv('restaurant.csv', (d) => {
        // parse rows, +symbol means to treat data as numbers
        return {
            name: d.name,
            address: d.address,
            grade: d.grade,
            score: +d.score,
            latitude: +d.latitude,
            longitude: +d.longitude,
        };
    }).then(data => {
        drawPoints(data, projection);
        restaurantData = data;
    });
}


function drawPoints(restaurants, projection) {
    let pointsData = svg.selectAll('points').data(restaurants, d => d.name).enter();
    pointsData.append('circle')
            .style('fill', 'orange')
            .attr('cx', d => projection([d.longitude, d.latitude])[0])
            .attr('cy', d => projection([d.longitude, d.latitude])[1])
            .attr('r', 2)
            .on('mouseover', d => {
                svg.append('text')
                    .attr('x', _ => d.longitude + 10)
                    .attr('y', _ => d.latitude + 5)
                    .text(d.name);
            })
            .on('mouseout', _ => {
                svg.selectAll('text').remove();
            });
    pointsData.exit().remove();
}


function drawMap() {
    const mapWidth = 1000;
    const mapHeight = 750;

    // Set up projection that the map is using
    const scale = 190000;
    const projection = d3.geoMercator()
                        .center([-122.061578, 37.385532])
                        .scale(scale)
                        .translate([mapWidth / 2, mapHeight / 2]);
    // This is the mapping between <longitude, latitude> position to <x, y> pixel position on the map
    // projection is a function and it has an inverse:
    // projection([lon, lat]) returns [x, y]
    // projection.invert([x, y]) returns [lon, lat]

    // Add SVG map at correct size
    svg.append('image')
        .attr('width', mapWidth)
        .attr('height', mapHeight)
        .attr('xlink:href', 'map.svg');
    return projection
}


main()
