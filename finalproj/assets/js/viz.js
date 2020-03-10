const MAP_WIDTH = 950;
const MAP_HEIGHT = 730;
const HISTO_WIDTH = MAP_WIDTH;
const HISTO_HEIGHT = MAP_HEIGHT;
const COLORS = ["brown", "red", "orange", "yellow", "green", "skyblue", "teal", "blue", "indigo", "violet", "black"]
const svg = d3.select("#vis")
    .attr("width", MAP_WIDTH)
    .attr("height", MAP_HEIGHT);
const projection = drawMap(svg);
const margin = {top: 20, right: 20, bottom: 30, left: 0};
const histogramSvg = d3.select("#histogramVis")
    .attr("width", HISTO_WIDTH)
    .attr("height", HISTO_HEIGHT)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
let restaurantData;
let pathPoints = [];

const TOKEN = 'pk.eyJ1IjoidHlsZXJ5ZXAiLCJhIjoiY2s3ZnQ5cGZmMDZmMTNvcGd1amFrOGV3ciJ9.32mOM4QHLL9QKl0TpUZvZw'
const DEFAULT_COLOR = "darkorange";
const ON_COLOR = "blue";
const OFF_COLOR = "gray";
const searchBar = document.getElementById("searchBar");
const scoreFilter = document.getElementById("scoreFilter");


function main() {
    d3.csv("data/accidents_bay_area_no_duplicates.csv", d => {
        // parse rows, +symbol means to treat data as numbers
        return {
            id: d.ID,
            name: d.Description,
            address: d.Street,
            severity: +d.Severity,
            latitude: +d.Start_Lat,
            longitude: +d.Start_Lng,
            count: +d.Count
        };
    }).then(data => {
        restaurantData = data;
        registerCallbacks()
        drawPoints();
    });
}

function registerCallbacks() {
    searchBar.addEventListener("input", drawPoints);

    d3.select("#scoreFilter").on("input", () => {
        document.getElementById("scoreValue").innerHTML = "Severity Threshold: " + scoreFilter.value;
        drawPoints();
    });

    document.getElementById("resetBtn").addEventListener("click", () => {
        pathPoints = [];
        drawPoints();
        svg.selectAll(".lines").remove();
        histogramSvg.selectAll(".bars").remove();
    });
}


let histogramData = [];
async function drawLines() {
    const url = "https://api.mapbox.com/directions/v5/mapbox/driving/"
                + `${pathPoints[0].longitude},${pathPoints[0].latitude};`
                + `${pathPoints[1].longitude},${pathPoints[1].latitude}`
                + `?geometries=geojson&access_token=${TOKEN}`;
    let response = await fetch(url);
    let routeData = await response.json();
    let points = routeData.routes[0].geometry.coordinates;
    console.log(routeData);
    for (let i = 0; i < points.length - 1; i++) {
        const p1 = projection(points[i]);
        const p2 = projection(points[i + 1]);
        const segColor = COLORS[i % COLORS.length];
        const nearbyAccidentCount = countPointsNearLine(points[i], points[i + 1]);
        const newRow = {
            routeSegment: "hello"+i,
            neabyAccidents: nearbyAccidentCount,
            segmentColor: segColor
        }
        histogramData.push(newRow);
        svg.append("line")
            .attr("class", "lines")
            .attr("stroke-width", 5)
            .attr("x1", p1[0])
            .attr("y1", p1[1])
            .attr("x2", p2[0])
            .attr("y2", p2[1])
            .style("stroke", segColor)
    }
    console.log(histogramData);
    drawHistogram();
}


function drawHistogram() {
    const width = HISTO_WIDTH - margin.left - margin.right;
    const height = HISTO_HEIGHT - margin.top - margin.bottom;
    // set the dimensions and margins of the graph
    let x = d3.scaleBand()
          .range([0, width])
          .padding(0.1);
    let y = d3.scaleLinear()
          .range([height, 0]);

    // set the ranges
    // Scale the range of the data in the domains
    x.domain(histogramData.map(d => d.routeSegment));
    y.domain([0, d3.max(histogramData, d => d.neabyAccidents)]);

    // append the rectangles for the bar chart
    histogramSvg.selectAll(".bars").data(histogramData).join(
        enter => enter.append("rect")
            .style('fill', d => d.segmentColor)
            .attr('class', 'bars')
            .attr("x", d => x(d.routeSegment))
            .attr("width", x.bandwidth())
            .attr("y", d => y(d.neabyAccidents))
            .attr("height", d => height - y(d.neabyAccidents))
    );

    // add the x Axis
    histogramSvg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

    // add the y Axis
    histogramSvg.append("g")
        .call(d3.axisLeft(y));
}


function colorPoints(d) {
    for (let i = 0; i < pathPoints.length; i++) {
        if (pathPoints[i] == d) {
            return ON_COLOR;
        }
    }
    return DEFAULT_COLOR;
}


function countPointsNearLine(p1, p2) {
    const DELTA = 0.005; // Roughly 500m
    let filteredData = restaurantData;

    if (scoreFilter.value !== "1") {
        filteredData = filteredData.filter(d =>
            d.severity >= parseInt(scoreFilter.value)
        );
    }

    if (searchBar.value !== "") {
        filteredData = filteredData.filter(d =>
            d.name.toLowerCase().includes(searchBar.value.toLowerCase())
            || d.address.toLowerCase().includes(searchBar.value.toLowerCase())
        );
    }

    filteredData = filteredData.filter(d =>
        Math.min(p1[0], p2[0]) - DELTA <= d.longitude && d.longitude <= Math.max(p1[0], p2[0]) + DELTA &&
        Math.min(p1[1], p2[1]) - DELTA <= d.latitude && d.latitude <= Math.max(p1[1], p2[1]) + DELTA
    );

    return filteredData.length;
}


function drawPoints() {
    const restaurantInfo = document.getElementById("restaurantInfo");
    let filteredData = restaurantData;

    if (scoreFilter.value !== "1") {
        filteredData = filteredData.filter(d =>
            d.severity >= parseInt(scoreFilter.value)
        );
    }

    if (searchBar.value !== "") {
        filteredData = filteredData.filter(d =>
            d.name.toLowerCase().includes(searchBar.value.toLowerCase())
            || d.address.toLowerCase().includes(searchBar.value.toLowerCase())
        );
    }

    svg.selectAll(".points").data(filteredData, d => d.id).join(
        enter => enter.append("circle")
            .attr("class", "points")
            .attr("opacity", 0.65)
            .style("fill", colorPoints)
            .attr("cx", d => projection([d.longitude, d.latitude])[0])
            .attr("cy", d => projection([d.longitude, d.latitude])[1])
            .attr("r", d => Math.sqrt(d.count) + 2)
            .on("mouseover", d => {
                svg.append("text")
                    .attr("class", "restaurantLabel")
                    .attr("x", _ => projection([d.longitude, d.latitude])[0] + 10)
                    .attr("y", _ => projection([d.longitude, d.latitude])[1] + 5)
                    .text(d.name);
                restaurantInfo.innerHTML = [
                    "<b>Name: </b>" + d.name,
                    "<b>Severity: </b>" + d.severity,
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
