const margin2 = {top: 25, right: 140, bottom: 50, left: 50},
  width = 1100 - margin2.left - margin2.right,
  height = 800 - margin2.top - margin2.bottom;

d3.csv("data/month_and_severity_counts.csv", d => {
    return {
      month: +d.month,
      key: d.severity,
      value: +d.accidents
    };
  }).then(data => {
    console.log(data);

    var keys = Array.from(d3.group(data, d => d.key).keys());
    var values = Array.from(d3.rollup(data, ([d]) => d.value, d => +d.month, d => d.key));
    
    var series = d3.stack()
      .keys(keys)
      .value(([, values], key) => values.get(key))
      .order(order)
    (values);
    var order = d3.stackOrderNone;
    var area = d3.area()
      .x(d => x(d.data[0]))
      .y0(d => y(d[0]))
      .y1(d => y(d[1]));

    var x = d3.scaleLinear()
      .domain(d3.extent(data, d => d.month))
      .range([0, width]);
    var y = d3.scaleLinear()
      .domain([0, d3.max(series, d => d3.max(d, d => d[1]))]).nice()
      .range([height, 0]);
    var xAxis = d3.axisBottom()
      .scale(x)
      .ticks(12, "s");
    var yAxis = d3.axisLeft()
      .scale(y)
      .ticks(5, "s");

    var color = d3.scaleOrdinal()
      .domain(keys)
      .range(d3.schemeCategory10);

    var svg2 = d3.select("#timeVis")
      .attr("width", width + margin2.left + margin2.right)
      .attr("height", height + margin2.top + margin2.bottom)
      .append("g")
        .attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");
    
    svg2.append("g")
      .selectAll("path")
      .data(series)
      .join("path")
        .attr("fill", ({key}) => color(key))
        .attr("d", area)
      .append("title")
        .text(({key}) => key);
      // .attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");
    
    svg2.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis).append("text")
      .attr("x", width/2)
      .attr("y", 36)
      .attr("fill", "#000")
      .text("Month")
      .style("font-weight", "bold");

    svg2.append("g")
      .attr("class", "y axis")
      .call(yAxis)
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", -(height/2))
      .attr("y", -40)
      .attr("dy", "0.3408em")
      .attr("fill", "#000")
      .text("Number of Accidents")
      .style("font-weight", "bold");       

    // svg2.append("g")
    //   .attr("class", "x axis")
    //   .attr("transform", "translate(0," + height + ")")
    //   .call(xAxis).append("text")
    //   .attr("x", 350)
    //   .attr("y", 36)
    //   .attr("fill", "#000")
    //   .text("Month")
    //   .style("font-weight", "bold");

    // svg2.append("g")
    //   .attr("class", "y axis")
    //   .call(yAxis)
    //   .append("text")
    //   .attr("transform", "rotate(-90)")
    //   .attr("x", -100)
    //   .attr("y", -40)
    //   .attr("dy", "0.3408em")
    //   .attr("fill", "#000")
    //   .text("Number of Accidents")
    //   .style("font-weight", "bold");

    var legend = svg2.selectAll(".legend")
        .data(color.domain()).enter()
        .append("g")
        .attr("class","legend")
      .attr("transform", "translate(" + (width +20) + "," + 0+ ")");

    legend.append("rect")
      .attr("x", 0)
      .attr("y", function(d, i) { return 20 * i; })
      .attr("width", 10)
      .attr("height", 10)
      .style("fill", function(d, i) {
        return color(i+1);});

    legend.append("text")
      .attr("x", 20)
      .attr("dy", "0.75em")
      .attr("y", function(d, i) { return 20 * i; })
      .text(function(d) {return "Severity "+ d});

    legend.append("text")
      .attr("x",0)
      .attr("y",-10)
      .text("Categories");
});