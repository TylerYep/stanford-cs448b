const svg = d3.select("#vis").attr("width", 1000).attr("height", 800);
const projection = drawMap(svg);
let restaurantData;
let circles = [];

const ON_COLOR = "darkorange";
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
        searchBar.addEventListener("input", drawPoints);
        const nodesById = drawPoints();
        drawLines(nodesById);
    });
}


function drawLines(nodesById) {
    d3.csv("data/graph_bay_area_knn_10converted.csv", d => {
        // parse rows, +symbol means to treat data as numbers
        return {
            p1: d.p1,
            p2: d.p2,
            weight: +d.weight
        };
    }).then(edgeData => {
        edgeData.forEach(d => {
            const p1 = projection([nodesById.get(d.p1).longitude, nodesById.get(d.p1).latitude]);
            const p2 = projection([nodesById.get(d.p2).longitude, nodesById.get(d.p2).latitude]);
            svg.append("line")
                .attr("x1", p1[0])
                .attr("y1", p1[1])
                .attr("x2", p2[0])
                .attr("y2", p2[1])
                .style("stroke", "steelblue")
        });
    });
}


function colorPoints(d) {
    return ON_COLOR;
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

    // if (searchBar.value !== "") {
    //     filteredData = filteredData.filter(d =>
    //         d.name.toLowerCase().includes(searchBar.value.toLowerCase())
    //         || d.address.toLowerCase().includes(searchBar.value.toLowerCase())
    //     );
    // }

    // filteredData = filteredData.filter(d =>
    //     isNaN(d.score) || d.score >= parseInt(scoreFilter.value)
    // );

    const points = svg.selectAll(".points").data(filteredData, d => d.id).join(
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
            .on("click", function(_) {
                // Needs to be a function to have access to "this".
                d3.select(this).style("fill", ON_COLOR);
            }),
        update => update.style("fill", colorPoints)
    );

    return d3.map(points.data(), d => d.id);
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
