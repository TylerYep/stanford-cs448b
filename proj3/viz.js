'use strict';

const PLOT_WIDTH = 1000;
const PLOT_HEIGHT = 800;
const MAX_CIRCLES = 2;

const svg = d3.select('#vis')
            .attr('width', PLOT_WIDTH)
            .attr('height', PLOT_HEIGHT);

const projection = drawMap(svg);
let restaurantData;
let circles = [];


function main() {
    const sliders = [document.getElementById("sliderA"), document.getElementById("sliderB")];
    const textValues = [document.getElementById("valueA"), document.getElementById("valueB")];
    textValues[0].innerHTML = sliders[0].value;
    textValues[1].innerHTML = sliders[1].value;

    d3.csv('new_restaurant.csv', d => {
        // parse rows, +symbol means to treat data as numbers
        return {
            id: +d.id,
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

        svg.on('click', function() {
            if (circles.length < MAX_CIRCLES) {
                const [newX, newY] = d3.mouse(this);
                const sliderIndex = (circles.length === 0) ? 0 : 1;
                circles.push({
                    id: 'circle' + circles.length,
                    x: newX,
                    y: newY,
                    r: parseInt(sliders[sliderIndex].value)
                });
                drawCircles(svg, circles);
                drawPoints(svg, restaurantData, projection, circles);
            }
        })

        document.getElementById('resetBtn').addEventListener('click', () => {
            circles = [];
            drawCircles(svg, circles);
            drawPoints(svg, restaurantData, projection, circles);
        });

        d3.select('#sliderA').on("input", function() {
            updateCircle(svg, circles, sliders, textValues, 0, +this.value);
            drawPoints(svg, restaurantData, projection, circles);
        });

        d3.select('#sliderB').on("input", function() {
            updateCircle(svg, circles, sliders, textValues, 1, +this.value);
            drawPoints(svg, restaurantData, projection, circles);
        });
    });
}


function updatePosition(d) {
    d3.select(this)
        .attr('cx', d.x = d3.event.x)
        .attr('cy', d.y = d3.event.y);
    drawPoints(svg, restaurantData, projection, circles);
}


function updateCircle(svg, circles, sliders, textValues, i, nRadius) {
    textValues[i].innerHTML = sliders[i].value;
    if (i < circles.length) {
        circles[i].r = parseInt(sliders[i].value);
        svg.selectAll("#circle"+i).attr('r', nRadius);
    }
}


function squaredDistanceBetween(a, b) {
    return Math.pow(a[0] - b[0], 2) + Math.pow(a[1] - b[1], 2);
}


function colorPoints(d) {
    if (circles.length < 1) {
        return 'orange';
    }
    const restaurantPoint = projection([d.longitude, d.latitude]);
    const circle0Point = [circles[0].x, circles[0].y];
    const distanceSquareOne = squaredDistanceBetween(restaurantPoint, circle0Point);
    const r0Squared = Math.pow(circles[0].r, 2);

    if (circles.length < 2) {
        return (distanceSquareOne < r0Squared) ? 'orange' : 'gray';
    }

    const circle1Point = [circles[1].x, circles[1].y];
        const distanceSquareTwo = squaredDistanceBetween(restaurantPoint, circle1Point);
        const r1Squared = Math.pow(circles[1].r, 2);
        return (distanceSquareOne < r0Squared && distanceSquareTwo < r1Squared)
            ? 'orange' : 'gray';
}


function drawPoints(svg, restaurants, projection, circles) {
    const DOTSIZE = 3;
    svg.selectAll('.points').data(restaurants, d => d.id).join(
        enter => enter.append('circle')
            .attr('id', d => d.id)
            .attr('class', 'points')
            .attr('opacity', 1)
            .style('fill', colorPoints)
            .attr('cx', d => projection([d.longitude, d.latitude])[0])
            .attr('cy', d => projection([d.longitude, d.latitude])[1])
            .attr('r', DOTSIZE)
            .on('mouseover', d => {
                svg.append('text')
                    .attr('x', _ => projection([d.longitude, d.latitude])[0] + 10)
                    .attr('y', _ => projection([d.longitude, d.latitude])[1] + 5)
                    .text(d.name);
            })
            .on('mouseout', _ => {
                svg.selectAll('text').remove();
            }),
        update => update.style('fill', colorPoints)
    )
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


function drawCircles(svg, circles) {
    svg.selectAll('circle').data(circles, d => d.id).join(
        enter => enter.append('circle')
            .join('circle')
            .attr('id', d => d.id)
            .attr('fill', 'gray')
            .attr('opacity', 0.3)
            .attr("cx", d => d.x)
            .attr("cy", d => d.y)
            .attr("r", d => d.r)
            .call(d3.drag().on('drag', updatePosition)),
        update => update.attr("r", d => d.r)
    )
}


main()
