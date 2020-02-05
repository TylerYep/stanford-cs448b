let circles = [
    {x: null, y: null, r: null},
    {x: null, y: null, r: null},
]
// const svg = d3.select('#vis').attr('width', 800).attr('height', 800);
// let pointsData = svg.selectAll('z').data(circles, d => d).enter();
// console.log(pointsData)
// pointsData.append('circle')
//             .style('fill', function(d) {
//                 console.log(d)
//                 return 'blue'
//             })
//             .attr('cx', 100)
//             .attr('cy', 100)
//             .attr('r', 10)

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

    const svg = d3.select('#vis')
                .attr('width', PLOT_WIDTH)
                .attr('height', PLOT_HEIGHT);

    const projection = drawMap(svg);

    let restaurantData;
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
                let [newX, newY] = d3.mouse(this);
                if (numCircles == 0) {
                    circles[0].x = newX;
                    circles[0].y = newY;
                    circles[0].r = parseInt(sliderA.value);
                } else {
                    circles[1].x = newX;
                    circles[1].y = newY;
                    circles[1].r = parseInt(sliderB.value);
                }
                numCircles++;
                drawCircle(svg, circles);
                drawPoints(svg, restaurantData, projection, circles);
            }
        })


        const button = document.getElementById('resetBtn');
        button.addEventListener('click', () => {
            numCircles = 0;
            // let newData = allData.filter(d => d.species == 'dog');
            drawPoints(svg, restaurantData, projection, circles);
        });

        sliderA.onchange = function() {
            valueA.innerHTML = this.value;
            circles[0].r = parseInt(this.value);
            drawCircle(svg, circles);
        }
        sliderB.onchange = function() {
            valueB.innerHTML = this.value;
            circles[1].r = parseInt(this.value);
            drawCircle(svg, circles);
        }
    });
}


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
                if (circles[0].x != null) {
                    const [restaurantX, restaurantY] = projection([d.longitude, d.latitude]);
                    const distanceSquareOne = Math.pow((restaurantX - circles[0].x), 2)
                                            + Math.pow((restaurantY - circles[0].y), 2);
                    if (circles[1].x != null) {
                        const distanceSquareTwo = Math.pow((restaurantX - circles[1].x), 2)
                                                + Math.pow((restaurantY - circles[1].y), 2);
                        return (distanceSquareOne < Math.pow(circles[0].r, 2)
                            && distanceSquareTwo < Math.pow(circles[1].r, 2))
                            ? 'orange'
                            : 'gray';
                    }
                    return (distanceSquareOne < Math.pow(circles[0].r, 2)) ? 'orange' : 'gray';
                }
                console.log("Not sure if should reach this point");
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
    let x = circles[0].x;
    let y = circles[0].y;
    let r = circles[0].r;
    console.log('Drawing circle at', x, y, r);
    let circleA = svg.append("circle")
        .attr('fill', 'gray')
        .attr('opacity', 0.5)
        .attr("cx", x)
        .attr("cy", y)
        .attr("r", r)
    circleA.exit().remove();

    if (circles[1] != null) {
        x = circles[1].x;
        y = circles[1].y;
        r = circles[1].r;
        console.log('Drawing circle at', x, y, r);
        let circleB = svg.append("circle")
            .attr('fill', 'gray')
            .attr('opacity', 0.5)
            .attr("cx", x)
            .attr("cy", y)
            .attr("r", r)
        circleB.exit().remove();
    }
}


main()
