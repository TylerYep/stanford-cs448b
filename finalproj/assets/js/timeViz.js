function get_colors(n) {
  var colors = ["#a6cee3","#1f78b4","#b2df8a","#33a02c",
  "#fb9a99","#e31a1c","#fdbf6f","#ff7f00","#cab2d6",
  "#6a3d9a"];

  return colors[ n % colors.length];
}

const MARGIN2 = {top: 61, right: 140, bottom: 101, left: 50},
  WIDTH = 960 - MARGIN2.left - MARGIN2.right,
  HEIGHT = 900 - MARGIN2.top - MARGIN2.bottom;

const x = d3.scaleLinear().range([0, WIDTH]);
const y = d3.scaleLinear().range([HEIGHT, 0]);

const color = d3.scaleOrdinal(d3.schemeCategory10);

var xAxis = d3.axisBottom()
  .scale(x)
  .ticks(12, "s");
var yAxis = d3.axisLeft()
  .scale(y)
  .ticks(5, "s");

var area = d3.area()
  .x(function(d) { return x(d.month); })
  .y0(function(d) { return y(d.y0); })
  .y1(function(d) { return y(d.y0 + d.y); });

var stack = d3.stack()
  .value(function(d) { return d.values; });

var svg2 = d3.select("#timeVis")
  .attr("width", WIDTH + MARGIN2.left + MARGIN2.right)
  .attr("height", HEIGHT + MARGIN2.top + MARGIN2.bottom)
  .append("g")
  .attr("transform", "translate(" + MARGIN2.left + "," + MARGIN2.top + ")");

d3.csv("data/month_and_severity_counts.csv", d => {
    return {
      month: +d.month,
      severity_1: +d.severity_1,
      severity_2: +d.severity_2,
      severity_3: +d.severity_3,
      severity_4: +d.severity_4
    };
  }).then(data => {
    console.log(data);
    color.domain(d3.keys(data[0]).filter(key => key !== "month"))
    var browsers = color.domain().map(function(name) {
      return {
        name: name,
        values: data.map(function(d) {
          return {month: d.month, y: d[name] * 1};
        })
      };
    });
    console.log(browsers)

    //   // Find the value of the month with highest total value
    var maxMonthVal = d3.max(data, function(d){
      var vals = d3.keys(d).map(
      function(key){ return key !== "month" ? d[key] : 0 });
      return d3.sum(vals);
    });

    //   // Set domains for axes
    x.domain(d3.extent(data, function(d) { return d.month; }));
    y.domain([0, 60000])

    var browser = svg2.selectAll(".browser")
      .data(browsers).join(
        enter => enter.append("g")
      )
      .attr("class", "browser");

    browser.append("path") // TODO PROBLEM HERE d is not valid value
      .attr("class", "area")
      .attr("d", function(d) { return area(d.values); })
      .style("fill", function(d,i) { return get_colors(i); });

    // browser.append("text")
    //   .datum(function(d) { return {name: d.name, value: d.values[d.values.length - 1]}; })
    //   .attr("transform", function(d) { return "translate(" + x(d.value.month) + "," + y(d.value.y0 + d.value.y / 2) + ")"; })
    //   .attr("x", -6)
    //   .attr("dy", "-0.882em")
    //   .text(function(d) {
    //       if(d.name == "severity_1") {
    //         return "Severity 1";
    //       }
    //       else if(d.name == "severity_2"){
    //         return "Severity 2";
    //       }
    //       else if(d.name == "severity_3"){
    //         return "Severity 3";
    //       }
    //       else {
    //         return "Severity 4";
    //       }
    //     })
    //   .style("font", "15px avenir")
    //     .attr("transform", function(d) { return "translate(500," + y(d.value.y0 + d.value.y / 2) + ")"; })

    svg2.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + HEIGHT + ")")
      .call(xAxis).append("text")
        .attr("x", 350)
      .attr("y", 36)
      .attr("fill", "#000")
      .text("Month")
        .style("font-weight", "bold");

    svg2.append("g")
      .attr("class", "y axis")
      .call(yAxis)
      .append("text")
      .attr("transform", "rotate(-90)")
        .attr("x", -100)
      .attr("y", -40)
      .attr("dy", "0.3408em")
      .attr("fill", "#000")
      .text("Number of Accidents")
        .style("font-weight", "bold");

    var legend = svg2.selectAll(".legend")
        .data(color.domain()).enter()
        .append("g")
        .attr("class","legend")
      .attr("transform", "translate(" + (WIDTH +20) + "," + 0+ ")");

    legend.append("rect")
      .attr("x", 0)
      .attr("y", function(d, i) { return 20 * i; })
      .attr("width", 10)
      .attr("height", 10)
      .style("fill", function(d, i) {
        return get_colors(i);});

      legend.append("text")
      .attr("x", 20)
      .attr("dy", "0.75em")
      .attr("y", function(d, i) { return 20 * i; })
      .text(function(d) {return d});

      legend.append("text")
      .attr("x",0)
      .attr("y",-10)
      .text("Categories");
});