const MAP_WIDTH = 1100;
const MAP_HEIGHT = 500;
const HISTO_WIDTH = MAP_WIDTH;
const HISTO_HEIGHT = MAP_HEIGHT / 2;
const COLORS = ['#1F77B4', '#FF7F0E', '#2CA02C', '#D62728', '#9467BD', '#8C564B', '#CFECF9', '#7F7F7F', '#BCBD22', '#17BECF']; // Tableau-10
const TOKEN = 'pk.eyJ1IjoidHlsZXJ5ZXAiLCJhIjoiY2s3ZnQ5cGZmMDZmMTNvcGd1amFrOGV3ciJ9.32mOM4QHLL9QKl0TpUZvZw'

mapboxgl.accessToken = TOKEN;
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/light-v10',
    zoom: 12,
    maxZoom: 15,
    minZoom: 9,
    center: [-122.061578, 37.385532]
});
// map.addControl(new mapboxgl.NavigationControl(), 'top-right');

const svg = d3.select("#vis")
    .attr("width", MAP_WIDTH)
    .attr("height", MAP_HEIGHT)
    .style("pointer-events", "none");
const margin = {top: 20, right: 20, bottom: 50, left: 50};
const histogramSvg = d3.select("#histogramVis")
    .attr("width", HISTO_WIDTH)
    .attr("height", HISTO_HEIGHT)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
drawAxes();

let accidentData;
let pathPoints = [];
let histogramData = [];
let linePointPairs = [];

const DEFAULT_COLOR = "orange";
const ON_COLOR = "blue";
const OFF_COLOR = "gray";
const searchBar = document.getElementById("searchBar");
const scoreFilter = document.getElementById("scoreFilter");


function drawAxes() {
    const width = HISTO_WIDTH - margin.left - margin.right;
    const height = HISTO_HEIGHT - margin.top - margin.bottom;

    // text label for the x-axis
    histogramSvg.append("text")
        .attr("transform", "translate(" + (width / 2) + " ," + (height + margin.top + 20) + ")")
        .style("text-anchor", "middle")
        .text("Distance Along Route (miles)");

    // text label for the y axis
    histogramSvg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("# of Accidents on Route");
}


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
        accidentData = data;
        registerCallbacks();

        map.on("viewreset", function() {
            render();
        });
        map.on("move", function() {
            render();
        });
        render();
    });
}


function render() {
    const projection = getMapBoxProjection();
    drawPoints(projection);
    updateLines(projection);
}


function getMapBoxProjection() {
    const center = map.getCenter();
    const zoom = map.getZoom();
    const scale = 512 * 0.5 / Math.PI * Math.pow(2, zoom);

    // Set up projection that the map is using
    // This maps between <longitude, latitude> position to <x, y> pixel position on the map
    // projection is a function and it has an inverse:
    // projection([lon, lat]) returns [x, y]
    // projection.invert([x, y]) returns [lon, lat]
    const projection = d3.geoMercator()
        .center([center.lng, center.lat])
        .scale(scale)
        .translate([MAP_WIDTH / 2, MAP_HEIGHT / 2]);
    return projection;
}


function registerCallbacks() {
    searchBar.addEventListener("input", drawPoints);
    d3.select("#scoreFilter").on("input", () => {
        document.getElementById("scoreValue").innerHTML = "Severity Threshold: " + scoreFilter.value;
        drawPoints();
    });
    document.getElementById("resetBtn").addEventListener("click", () => {
        pathPoints = [];
        histogramData = [];
        linePointPairs = [];
        render();
        svg.selectAll(".lines").remove();
        histogramSvg.selectAll(".circles").remove();
        histogramSvg.selectAll(".paths").remove();
        histogramSvg.selectAll(".lines").remove();
        histogramSvg.selectAll("g").remove();
    });
}


function updateLines(projection) {
    svg.selectAll(".lines").data(linePointPairs).join(
        enter => enter.append("line")
            .attr("class", "lines")
            .attr("stroke-width", 5)
            .attr("x1", d => projection(d[0])[0])
            .attr("y1", d => projection(d[0])[1])
            .attr("x2", d => projection(d[1])[0])
            .attr("y2", d => projection(d[1])[1])
            .style("stroke", (_, i) => COLORS[i % COLORS.length]),
        update => update
            .attr("x1", d => projection(d[0])[0])
            .attr("y1", d => projection(d[0])[1])
            .attr("x2", d => projection(d[1])[0])
            .attr("y2", d => projection(d[1])[1])
    );
}


async function drawLines(projection) {
    const url = "https://api.mapbox.com/directions/v5/mapbox/driving/"
                + `${pathPoints[0].longitude},${pathPoints[0].latitude};`
                + `${pathPoints[1].longitude},${pathPoints[1].latitude}`
                + `?geometries=geojson&access_token=${TOKEN}`;
    const response = await fetch(url);
    const routeData = await response.json();
    console.log(routeData);
    const points = routeData.routes[0].geometry.coordinates;

    linePointPairs = d3.pairs(points);
    updateLines(projection);

    let accumulatedDistance = 0;
    histogramData.push({
        neabyAccidents: 0,
        segmentColor: "none",
        proportionOfTotalDistance: 0
    });

    for (let i = 0; i < points.length - 1; i++) {
        const distance = latLongDistance(points[i][0], points[i][1], points[i+1][0], points[i+1][1]);
        if (distance > 0.1) {
            const segColor = COLORS[i % COLORS.length];
            const nearbyAccidentCount = countPointsNearLine(points[i], points[i + 1]);
            const newRow = {
                neabyAccidents: nearbyAccidentCount,
                segmentColor: segColor,
                proportionOfTotalDistance: accumulatedDistance + (distance * 0.5)
            }
            histogramData.push(newRow);
        }
        accumulatedDistance += distance;
    }

    histogramData.push({
        neabyAccidents: 0,
        segmentColor: "none",
        proportionOfTotalDistance: accumulatedDistance + 1
    });

    console.log(histogramData);
    drawHistogram();
}


function latLongDistance(lon1, lat1, lon2, lat2) {
	if ((lat1 == lat2) && (lon1 == lon2)) {
		return 0;
	}
    const radlat1 = Math.PI * lat1/180;
    const radlat2 = Math.PI * lat2/180;
    const theta = lon1 - lon2;
    const radtheta = Math.PI * theta/180;
    let dist = Math.sin(radlat1) * Math.sin(radlat2)
        + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    if (dist > 1) {
        dist = 1;
    }
    dist = Math.acos(dist);
    dist = dist * 180/Math.PI;
    dist = dist * 60 * 1.1515;
    dist = dist * 1.609344;
    return dist;

}


function drawHistogram() {
    const width = HISTO_WIDTH - margin.left - margin.right;
    const height = HISTO_HEIGHT - margin.top - margin.bottom;
    // set the dimensions and margins of the graph
    let xscale = d3.scaleLinear() // scaleBand
        .range([0, width]);
    let yscale = d3.scaleLinear()
        .range([height, 0]);

    // Scale the range of the data in the domains
    xscale.domain([0, d3.max(histogramData, d => d.proportionOfTotalDistance)]);
    yscale.domain([0, d3.max(histogramData, d => d.neabyAccidents)]);

    // draw line
    histogramSvg.datum(histogramData).append("path")
        .attr('class', 'paths')
        .attr("fill", "none")
        .attr("stroke", "black")
        .attr("stroke-width", 2)
        .attr("d", d3.line()
            .x(d => xscale(d.proportionOfTotalDistance))
            .y(d => yscale(d.neabyAccidents))
            .curve(d3.curveMonotoneX));

    // append the circles
    histogramSvg.selectAll(".circles").data(histogramData).join(
        enter => enter.append("circle")
            .style('fill', d => d.segmentColor)
            .attr('class', 'circles')
            .attr("cx", d => xscale(d.proportionOfTotalDistance))
            .attr("cy", d => yscale(d.neabyAccidents))
            .attr("r", 8)
            .attr("stroke", "white")
            .attr("stroke-width", 1)
            .attr("cursor", "pointer")
            .on('mouseover', function () {
                d3.select(this).transition()
                     .duration('50')
                     .attr('r', 10)
            })
            .on('mouseout', function () {
                d3.select(this).transition()
                     .duration('50')
                     .attr('r', 8)
            })
            .on("click", d => {
                // TODO
                console.log(d);
            }),
    );

    // add the x-axis
    histogramSvg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(xscale));

    // add the y-axis
    histogramSvg.append("g")
        .call(d3.axisLeft(yscale));
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
    const DELTA = 0.001; // Roughly 100m
    let filteredData = accidentData;

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


function drawPoints(projection) {
    const restaurantInfo = document.getElementById("restaurantInfo");
    let filteredData = accidentData;

    filteredData = filteredData.filter(d => {
        const [x, y] = projection([d.longitude, d.latitude]);
        return x >= 0 && y >= 0 && x <= MAP_WIDTH && y <= MAP_HEIGHT;
    });

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
            .style("pointer-events", "all")
            .on("mouseover", d => {
                const projection = getMapBoxProjection();
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
                        const projection = getMapBoxProjection();
                        drawLines(projection);
                    }
                }
            }),
        update => update.style("fill", colorPoints)
            .attr("cx", d => projection([d.longitude, d.latitude])[0])
            .attr("cy", d => projection([d.longitude, d.latitude])[1])
    );
}


main()
