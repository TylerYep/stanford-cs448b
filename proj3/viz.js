let circles = {
    'A': {
        'x': null,
        'y': null,
        'r': null
    },
    'B': {
        'x': null,
        'y': null,
        'r': null
    },
}

function main() {
    const sliderA = document.getElementById("sliderA");
    const sliderB = document.getElementById("sliderB");
    const valueA = document.getElementById("valueA");
    const valueB = document.getElementById("valueB");
    valueA.innerHTML = sliderA.value;
    valueB.innerHTML = sliderB.value;

    const PLOT_WIDTH = 1000;
    const PLOT_HEIGHT = 800;
    const MAX_CIRCLES = 2;
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
        drawPoints(svg, data, projection, circles);

        let numCircles = 0;
        svg.on('click', function() {
            if (numCircles < MAX_CIRCLES) {
                let coords = d3.mouse(this);
                console.log(coords);
                if (numCircles == 0) {
                    circles.A.x = coords[0];
                    circles.A.y = coords[1];
                    circles.A.r = sliderA.value;
                } else {
                    circles.B.x = coords[0];
                    circles.B.y = coords[1];
                    circles.B.r = sliderB.value;
                }
                drawCircle(svg, circles);
                drawPoints(svg, restaurantData, projection, circles);
            }
            numCircles++;
        })

        sliderA.onchange = function() {
            valueA.innerHTML = this.value;
            drawCircle(svg, circles);
        }
        sliderB.onchange = function() {
            valueB.innerHTML = this.value;
            drawCircle(svg, circles);
        }
    });
}

// const button = document.querySelector('button');
// button.addEventListener('click', () => {
//     let newData = allData.filter(d => d.species == 'dog');
//     drawPoints(newData);
// });

function drawPoints(svg, restaurants, projection, circles) {
    const DOTSIZE = 3;
    let pointsData = svg.selectAll('points').data(restaurants, d => d.name).enter();
    // pointsData.filter(function(d) {
    //     if (circle_x != null && circle_y != null) {
    //         var restaurant_x = projection([d.longitude, d.latitude])[0];
    //         var restaurant_y = projection([d.longitude, d.latitude])[1];
    //         var distance_square = Math.pow((restaurant_x - circle_x), 2) + Math.pow((restaurant_y - circle_y), 2);
    //         return distance_square < Math.pow(radius, 2);
    //     }
    //     return true;
    // })
    pointsData.append('circle')
            .style('fill', function(d) {
                if (circles.A != null) {
                    var restaurantX = projection([d.longitude, d.latitude])[0];
                    var restaurantY = projection([d.longitude, d.latitude])[1];
                    var distanceSquareOne = Math.pow((restaurantX - circles.A.x), 2)
                                          + Math.pow((restaurantY - circles.A.y), 2);
                    if (circles.B != null) {
                        var distanceSquareTwo = Math.pow((restaurantX - circles.B.x), 2)
                                              + Math.pow((restaurantY - circles.B.y), 2);
                        if (distanceSquareOne < Math.pow(circles.A.r, 2)
                            && distanceSquareTwo < Math.pow(circles.B.r, 2)) {
                            return 'orange';
                        }
                        return 'gray';
                    }
                    if (distanceSquareOne < Math.pow(circles.A.r, 2)) {
                        return 'orange';
                    }
                    return 'gray';
                }
                return 'orange';
            })
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

function drawCircle(svg, circles) {
    let x = circles.A.x;
    let y = circles.A.y;
    let r = circles.A.r;
    console.log('Drawing circle at', x, y, r);
    svg.append("circle")
        .attr('fill', 'gray')
        .attr('opacity', 0.5)
        .attr("cx", x)
        .attr("cy", y)
        .attr("r", r);


    if (circles.B != null) {
        x = circles.B.x;
        y = circles.B.y;
        r = circles.B.r;
        console.log('Drawing circle at', x, y, r);
        svg.append("circle")
            .attr('fill', 'gray')
            .attr('opacity', 0.5)
            .attr("cx", x)
            .attr("cy", y)
            .attr("r", r);
    }
}


main()
