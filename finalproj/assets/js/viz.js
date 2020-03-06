const svg = d3.select("#vis").attr("width", 1000).attr("height", 800);
const projection = drawMap(svg);
let restaurantData;
let pathPoints = [];

const TOKEN = 'pk.eyJ1IjoidHlsZXJ5ZXAiLCJhIjoiY2s3ZnQ5cGZmMDZmMTNvcGd1amFrOGV3ciJ9.32mOM4QHLL9QKl0TpUZvZw'
const DEFAULT_COLOR = "darkorange";
const ON_COLOR = "blue";
const OFF_COLOR = "gray";
const searchBar = document.getElementById("searchBar");
const scoreFilter = document.getElementById("scoreFilter");


function main() {
    d3.csv("data/accidents_bay_area.csv", d => {
        // parse rows, +symbol means to treat data as numbers
        return {
            id: d.ID,
            name: d.Description,
            address: d.Street,
            score: +d.Severity,
            latitude: +d.Start_Lat,
            longitude: +d.Start_Lng,
        };
    }).then(data => {
        restaurantData = data;
        registerCallbacks()
        drawPoints();
        // drawLines(nodesById);
    });
}

function registerCallbacks() {
    searchBar.addEventListener("input", drawPoints);

    document.getElementById("resetBtn").addEventListener("click", () => {
        pathPoints = [];
        drawPoints();
        svg.selectAll(".lines").remove();
    });
}


async function drawLines() {
    console.log(pathPoints);
    const url = "https://api.mapbox.com/directions/v5/mapbox/cycling/"
                + `${pathPoints[0].longitude},${pathPoints[0].latitude};`
                + `${pathPoints[1].longitude},${pathPoints[1].latitude}`
                + `?geometries=geojson&access_token=${TOKEN}`;
    console.log(url);
    let response = await fetch(url);
    let routeData = await response.json();
    console.log(routeData);
    let points = routeData.routes[0].geometry.coordinates;
    for (let i = 0; i < points.length - 1; i++) {
        const p1 = projection(points[i]);
        const p2 = projection(points[i + 1]);
        svg.append("line")
            .attr("class", "lines")
            .attr("x1", p1[0])
            .attr("y1", p1[1])
            .attr("x2", p2[0])
            .attr("y2", p2[1])
            .style("stroke", "steelblue")
    }
}


function colorPoints(d) {
    return DEFAULT_COLOR;
    // const restaurantPoint = projection([d.longitude, d.latitude]);
    // const circle0Point = [circles[0].x, circles[0].y];
    // const distanceSquareOne = squaredDistanceBetween(restaurantPoint, circle0Point);
    // const r0Squared = Math.pow(circles[0].r, 2);

    // if (circles.length < 2) return (distanceSquareOne < r0Squared) ? ON_COLOR : OFF_COLOR;

    // const circle1Point = [circles[1].x, circles[1].y];
    // const distanceSquareTwo = squaredDistanceBetween(restaurantPoint, circle1Point);
    // const r1Squared = Math.pow(circles[1].r, 2);
    // return (distanceSquareOne < r0Squared && distanceSquareTwo < r1Squared) ? ON_COLOR : OFF_COLOR;
}


function drawPoints() {
    const DOTSIZE = 3;
    const restaurantInfo = document.getElementById("restaurantInfo");
    let filteredData = restaurantData;

    if (searchBar.value !== "") {
        filteredData = filteredData.filter(d =>
            d.name.toLowerCase().includes(searchBar.value.toLowerCase())
            || d.address.toLowerCase().includes(searchBar.value.toLowerCase())
        );
    }

    svg.selectAll(".points").data(filteredData, d => d.id).join(
        enter => enter.append("circle")
            .attr("class", "points")
            .attr("opacity", 0.75)
            .style("fill", colorPoints)
            .attr("cx", d => projection([d.longitude, d.latitude])[0])
            .attr("cy", d => projection([d.longitude, d.latitude])[1])
            .attr("r", DOTSIZE)
            .on("mouseover", d => {
                svg.append("text")
                    .attr("class", "restaurantLabel")
                    .attr("x", _ => projection([d.longitude, d.latitude])[0] + 10)
                    .attr("y", _ => projection([d.longitude, d.latitude])[1] + 5)
                    .text(d.name);
                restaurantInfo.innerHTML = [
                    "<b>Name: </b>" + d.name,
                    "<b>Score: </b>" + d.score,
                    "<b>Address: </b>" + d.address
                ].join("<br>");
            })
            .on("mouseout", _ => {
                svg.selectAll(".restaurantLabel").remove();
            })
            .on("click", function(d) {
                // Needs to be a function to have access to "this".
                if (pathPoints.length < 2) {
                    pathPoints.push(d);
                    d3.select(this).style("fill", ON_COLOR);
                    if (pathPoints.length == 2) {
                        drawLines();
                    }
                }
            }),
        update => update.style("fill", colorPoints)
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
    svg.append("image")
        .attr("width", MAP_WIDTH)
        .attr("height", MAP_HEIGHT)
        .attr("xlink:href", "images/map.svg");
    return projection;
}


main()
