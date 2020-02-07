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

const passCheckbox = document.getElementById("passCheckbox");
const failCheckbox = document.getElementById("failCheckbox");
const searchBar = document.getElementById("searchBar");

function main() {
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
        registerCallbacks();
        drawPoints();
    });
}


function registerCallbacks() {
    const sliders = [document.getElementById("sliderA"), document.getElementById("sliderB")];
    const textValues = [document.getElementById("valueA"), document.getElementById("valueB")];
    textValues[0].innerHTML = sliders[0].value;
    textValues[1].innerHTML = sliders[1].value;

    svg.on('click', function() {
        if (circles.length < MAX_CIRCLES) {
            const [newX, newY] = d3.mouse(this);
            circles.push({
                id: 'circle' + circles.length,
                x: newX,
                y: newY,
                r: parseInt(sliders[circles.length].value)
            });
            drawCircles();
            drawPoints();
        }
    });

    searchBar.addEventListener('input', () => {
        drawPoints();
    });

    passCheckbox.addEventListener('change', () => {
        drawPoints();
    });

    failCheckbox.addEventListener('change', () => {
        drawPoints();
    });

    document.getElementById('resetBtn').addEventListener('click', () => {
        circles = [];
        drawCircles();
        drawPoints();
    });

    d3.select('#sliderA').on("input", function() {
        updateCircle(sliders, textValues, 0);
        drawPoints();
    });

    d3.select('#sliderB').on("input", function() {
        updateCircle(sliders, textValues, 1);
        drawPoints();
    });
}


function updateCircle(sliders, textValues, i) {
    const newRadius = parseInt(sliders[i].value);
    textValues[i].innerHTML = newRadius;
    if (i < circles.length) {
        circles[i].r = parseInt(newRadius);
        svg.selectAll("#circle"+i).attr('r', newRadius);
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


function drawCircles() {
    svg.selectAll('circle').data(circles, d => d.id).join(
        enter => enter.append('circle')
            .attr('id', d => d.id)
            .attr('fill', 'gray')
            .attr('opacity', 0.3)
            .attr("cx", d => d.x)
            .attr("cy", d => d.y)
            .attr("r", d => d.r)
            .call(d3.drag().on('drag', function(d) {
                d3.select(this)
                    .attr('cx', d.x = d3.event.x)
                    .attr('cy', d.y = d3.event.y);
                drawPoints();
            })),
        update => update.attr("r", d => d.r)
    );
}


function drawPoints() {
    const DOTSIZE = 3;
    let filteredData = restaurantData;

    if (!(passCheckbox.checked && failCheckbox.checked)) {
        filteredData = filteredData.filter(d =>
            (passCheckbox.checked && d.grade === "Pass")
            || (failCheckbox.checked && d.grade === "Not Available")
        );
    }

    if (searchBar.value !== '') {
        filteredData = filteredData.filter(d =>
            d.name.toLowerCase().includes(searchBar.value.toLowerCase())
            || d.address.toLowerCase().includes(searchBar.value.toLowerCase())
        );
    }

    svg.selectAll('.points').data(filteredData, d => d.id).join(
        enter => enter.append('circle')
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
            })
            .on('click', function() {
                // Needs to be a function to have access to "this".
                d3.select(this).style("fill", 'blue');
            }),
        update => update.style('fill', colorPoints)
    );
}


function drawMap(svg) {
    const MAP_WIDTH = 1000;
    const MAP_HEIGHT = 750;
    const SCALE = 190000;

    // Set up projection that the map is using
    // This maps between <longitude, latitude> position to <x, y> pixel position on the map
    // projection is a function and it has an inverse:
    // projection([lon, lat]) returns [x, y]
    // projection.invert([x, y]) returns [lon, lat]
    const projection = d3.geoMercator()
                        .center([-122.061578, 37.385532])
                        .scale(SCALE)
                        .translate([MAP_WIDTH / 2, MAP_HEIGHT / 2]);

    svg.append('image')
        .attr('width', MAP_WIDTH)
        .attr('height', MAP_HEIGHT)
        .attr('xlink:href', 'map.svg');

    return projection;
}


main()
