function main() {
    const PLOT_WIDTH = 1000;
    const PLOT_HEIGHT = 800;
    const CIRCLE_RADIUS = 100;
    let restaurantData;
    const svg = d3.select('#vis')
                .attr('width', PLOT_WIDTH)
                .attr('height', PLOT_HEIGHT);

    const projection = drawMap(svg);
    d3.csv('restaurant.csv', d => {
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
        restaurantData = data;
        drawPoints(svg, data, projection, null, null, null);

        svg.on('click', function() {
            var coords = d3.mouse(this);
            console.log(coords);
            drawCircle(svg, coords[0], coords[1], CIRCLE_RADIUS);
            drawPoints(svg, restaurantData, projection, coords[0], coords[1], CIRCLE_RADIUS);
        })
    });
}

// const button = document.querySelector('button');
// button.addEventListener('click', () => {
//     let newData = allData.filter(d => d.species == 'dog');
//     drawPoints(newData);
// });

function drawPoints(svg, restaurants, projection, circle_x, circle_y, radius) {
    const DOTSIZE = 3;
    let pointsData = svg.selectAll('points').data(restaurants, d => d.name).enter();
    pointsData.append('circle')
            .style('fill', 'orange')
            .attr('cx', d => projection([d.longitude, d.latitude])[0])
            .attr('cy', d => projection([d.longitude, d.latitude])[1])
            .attr('r', DOTSIZE)
            // .on('click', function() {
            //     // Needs to be a function to have access to "this".
            //     d3.select(this).style("fill", 'blue');
            // })
            .on('mouseover', d => {
                svg.append('text')
                    .attr('x', _ => projection([d.longitude, d.latitude])[0] + 10)
                    .attr('y', _ => projection([d.longitude, d.latitude])[1] + 5)
                    .text(d.name);
            })
            .on('mouseout', _ => {
                svg.selectAll('text').remove();
            });
    pointsData.filter(function(d) {
        if (circle_x != null && circle_y != null) {
            var distance_square = Math.pow((+d.longitude - circle_x), 2) + Math.pow((+d.latitude - circle_y), 2);
            return distance_square < Math.pow(radius, 2);
        }
        return true;
    })
    pointsData.exit().remove();
}


function drawMap(svg) {
    const MAP_WIDTH = 1000;
    const MAP_HEIGHT = 750;
    const SCALE = 190000;

    // Set up projection that the map is using
    const projection = d3.geoMercator()
                        .center([-122.061578, 37.385532])
                        .scale(SCALE)
                        .translate([MAP_WIDTH / 2, MAP_HEIGHT / 2]);
    // This maps between <longitude, latitude> position to <x, y> pixel position on the map
    // projection is a function and it has an inverse:
    // projection([lon, lat]) returns [x, y]
    // projection.invert([x, y]) returns [lon, lat]

    // Add SVG map at correct size
    svg.append('image')
        .attr('width', MAP_WIDTH)
        .attr('height', MAP_HEIGHT)
        .attr('xlink:href', 'map.svg');

    return projection
}

function drawCircle(svg, x, y, size) {
    console.log('Drawing circle at', x, y, size);
    svg.append("circle")
        .attr('fill', 'gray')
        .attr('opacity', 0.5)
        .attr("cx", x)
        .attr("cy", y)
        .attr("r", size);
}


main()
