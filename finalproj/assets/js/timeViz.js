const margin2 = {top: 25, right: 140, bottom: 50, left: 50},
  width = 1100 - margin2.left - margin2.right,
  height = 400 - margin2.top - margin2.bottom;
const svg2 = d3.select("#timeVis")
  .attr("width", width + margin2.left + margin2.right)
  .attr("height", height + margin2.top + margin2.bottom)
  .append("g")
    .attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");

let keys, values,
  series, area, order, color,
  x, y,
  xAxis, yAxis;

let overallData;
let yearData;

var yearFilter = document.querySelector('input[name="year"]:checked').value;

function assignVars() {
  console.log(yearData);
  keys = Array.from(d3.group(yearData, d => d.key).keys());
  // console.log(keys);
  values = Array.from(d3.rollup(yearData, ([d]) => d.value, d => +d.month, d => d.key));
  // console.log(values);

  series = d3.stack()
    .keys(keys)
    .value(([, values], key) => values.get(key))
    .order(order)
  (values);
  order = d3.stackOrderNone;
  area = d3.area()
    .x(d => x(d.data[0]))
    .y0(d => y(d[0]))
    .y1(d => y(d[1]));

  x = d3.scaleLinear()
    .domain(d3.extent(yearData, d => d.month))
    .range([0, width]);
  y = d3.scaleLinear()
    .domain([0, d3.max(series, d => d3.max(d, d => d[1]))]).nice()
    .range([height, 0]);
  xAxis = d3.axisBottom()
    .scale(x)
    .ticks(12, "s");
  yAxis = d3.axisLeft()
    .scale(y)
    .ticks(5, "s");

  color = d3.scaleOrdinal()
    .domain(keys)
    .range(d3.schemeCategory10);

  chart();
}

function chart() {
  svg2.append("g")
    .selectAll("path")
    .data(series)
    .join("path")
      .attr("fill", ({key}) => color(key))
      .attr("d", area)
    .append("title")
      .text(({key}) => key);

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

  const legend = svg2.selectAll(".legend")
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

  return svg2.node();
}

function registerCallbacks() {
  d3.select("#radio_btn_select").on("input", () => {
    yearFilter = document.querySelector('input[name="year"]:checked').value;
    console.log(yearFilter);
    yearData = overallData.filter(d => d.year == yearFilter);
    svg2.selectAll("g").remove();
    assignVars();
  });
  assignVars();
}

function main() {
  d3.csv("data/month_and_severity_counts.csv", d => {
    return {
      year: d.year,
      month: +d.month,
      key: d.severity,
      value: +d.accidents
    };
  }).then(data => {
    overallData = data
    yearData = overallData.filter(d => d.year == yearFilter);
    registerCallbacks();
  });
}

main()
