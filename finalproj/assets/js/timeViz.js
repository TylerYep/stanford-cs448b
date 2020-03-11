var margin = {top: 61, right: 140, bottom: 101, left: 50},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var  times = ["12am","1a", "2a", "3a", "4a", "5a", "6a",
            "7a", "8a", "9a", "10a", "11a", "12pm", "1p",
            "2p", "3p", "4p", "5p", "6p", "7p", "8p",
            "9p", "10p", "11p"];

var x = d3.scale.linear()
    .range([0, width]);

var y = d3.scale.linear()
    .range([height, 0]);

var color = d3.scale.category10();

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom")
        .ticks(12, "s");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .ticks(5, "s");

var area = d3.svg.area()
    .x(function(d) { return x(d.month); })
    .y0(function(d) { return y(d.y0); })
    .y1(function(d) { return y(d.y0 + d.y); });
    
    
var stack = d3.layout.stack()
    .values(function(d) { return d.values; });
    
var svg = d3.select("#timeVis")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

function get_colors(n) {
    var colors = ["#a6cee3","#1f78b4","#b2df8a","#33a02c",
    "#fb9a99","#e31a1c","#fdbf6f","#ff7f00","#cab2d6",
    "#6a3d9a"];
    
     return colors[ n % colors.length];
}

function main() {
  d3.csv("data/month_and_severity_counts.csv", d => {
      // parse rows, +symbol means to treat data as numbers
      return {
          month: +d.month,
          severity_1 = +d.severity_1,
          severity_2 = +d.severity_2,
          severity_3 = +d.severity_3,
          severity_4 = +d.severity_4
      };
  }).then(data => {
      restaurantData = data;
      registerCallbacks()
      drawPoints();
  });
}
      
d3.csv("data/month_and_severity_counts.csv", function(error, data) {
       
    color.domain(d3.keys(data[0]).filter(function(key) {return key !== "month"; }));

    data = JSON.parse(data);
    data.forEach(function(d) {  
        d.month = +d.month;
        d.severity_1 = +d.severity_1;
        d.severity_2 = +d.severity_2;
        d.severity_3 = +d.severity_3;
        d.severity_4 = +d.severity_4;
    }); 
           
           
    
      var browsers = stack(color.domain().map(function(name) {
        return {
          name: name,
          values: data.map(function(d) {
            return {month: d.month, y: d[name] * 1};
          })
        };
      }));
      
    
    //   // Find the value of the hour with highest total value
      var maxMonthVal = d3.max(data, function(d){
        var vals = d3.keys(d).map(
          function(key){ 
            return key !== "month" ? d[key] : 0 });
        return d3.sum(vals);
      });
    
    //   // Set domains for axes
      x.domain(d3.extent(data, function(d) { return d.month; }));
      y.domain([0, 800])
    
      var browser = svg.selectAll(".browser")
          .data(browsers)
            .enter().append("g")
          .attr("class", "browser");
    
      browser.append("path")
          .attr("class", "area")
          .attr("d", function(d) { return area(d.values); })
          .style("fill", function(d,i) { 
                return get_colors(i); });
    
    
          browser.append("text")
          .datum(function(d) { return {name: d.name, value: d.values[d.values.length - 1]}; })
          .attr("transform", function(d) { return "translate(" + x(d.value.hour) + "," + y(d.value.y0 + d.value.y / 2) + ")"; })
          .attr("x", -6)
          .attr("dy", "-0.882em")
          .text(function(d) { 
                    if(d.name == "larceny_theft"){
                return "larceny/theft";
              }
                     if(d.name == "non_criminal"){
                return "non-criminal";
              }    
                   if(d.name == "assault"){
                return d.name;
              }})
          .style("font", "15px avenir")
              .attr("transform", function(d) { return "translate(500," + y(d.value.y0 + d.value.y / 2) + ")"; }) 
    
       svg.append("g")
          .attr("class", "x axis")
          .attr("transform", "translate(0," + height + ")")
          .call(xAxis).append("text")
               .attr("x", 350)
          .attr("y", 36)
          .attr("fill", "#000")
          .text("Hour of Time")
            .style("font-weight", "bold");
    
      svg.append("g")
          .attr("class", "y axis")
          .call(yAxis)
          .append("text")
          .attr("transform", "rotate(-90)")
              .attr("x", -250)
          .attr("y", -40)
          .attr("dy", "0.3408em")
          .attr("fill", "#000")
          .text("Number of Incidents")
               .style("font-weight", "bold");
          
       var legend = svg.selectAll(".legend")
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
             return get_colors(i);}); 
       
        legend.append("text")
         .attr("x", 20) 
         .attr("dy", "0.75em")
         .attr("y", function(d, i) { return 20 * i; })
         .text(function(d) {return d});
          
        legend.append("text")
         .attr("x",0) 
    //      .attr("dy", "0.75em")
         .attr("y",-10)
         .text("Categories");
    
    
    });