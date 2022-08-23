import * as d3 from "https://cdn.skypack.dev/d3@6.7.0";

// establish sizes
const wide = 780;
const high = 540;
const barWidth = wide / 250;

// get the data
function getData(v, i) {
   return v[i];
}

// find the max values
function findMax(arr) {
   return d3.max(arr);
}

// create the SVG
var svg = d3
   .select("#data")
   .append("svg")
   .attr("width", wide + 50)
   .attr("height", high + 30);

// create the Tooltip
var tooltip = d3
   .select("#data")
   .append("div")
   .attr("id", "tooltip")
   .style("opacity", 0);

// Labels for X and Y axis
svg.append("text")
   .attr("transform", "rotate(-90)")
   .attr("x", -(wide / 2.45))
   .attr("y", 15)
   .attr("class", "axis-label")
   .text("Gross Domestic Product");

svg.append("text")
   .attr("x", wide / 1.78)
   .attr("y", high - 10)
   .attr("class", "axis-label")
   .text("Year");

const url =
   "https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json";

// Get JSON data
d3.json(url).then(function (data) {
   // Updates headings
   d3.select("#title").text(data.name);
   // d3.select("#source_name").text(data.source_name);

   // X Axis
   var dates = data.data.map((v) => new Date(getData(v, 0)));
   let maxX = new Date(findMax(dates));
   maxX.setMonth(maxX.getMonth() + 3);

   const xScale = d3
      .scaleTime()
      .domain([d3.min(dates), maxX])
      .range([0, wide - 15]);

   const xAxis = d3.axisBottom().scale(xScale);

   svg.append("g")
      .call(xAxis)
      .attr("id", "x-axis")
      .attr("transform", "translate(60, 490)");

   // Y Axis
   var gdp = data.data.map((v) => getData(v, 1));
   const maxY = findMax(gdp);

   const linearScale = d3
      .scaleLinear()
      .domain([0, maxY])
      .range([0, high - 55]);

   const yAxisScale = d3
      .scaleLinear()
      .domain([0, maxY])
      .range([high - 55, 0]);

   const yAxis = d3.axisLeft(yAxisScale);

   svg.append("g")
      .call(yAxis)
      .attr("id", "y-axis")
      .attr("transform", "translate(60, 5)");

   const scaledGdp = gdp.map((v) => linearScale(v));

   var years = data.data.map((v) => {
      let quarter = "";

      switch (v[0].substring(5, 7)) {
         case "01":
            quarter = "Q1";
            break;
         case "04":
            quarter = "Q2";
            break;
         case "07":
            quarter = "Q3";
            break;
         case "10":
            quarter = "Q4";
            break;
         default:
            quarter = "Error";
      }

      return v[0].substring(0, 4) + " " + quarter;
   });

   // Bars
   d3.select("svg")
      .selectAll("rect")
      .data(scaledGdp)
      .enter()
      .append("rect")
      .attr("data-date", (d, i) => data.data[i][0])
      .attr("data-gdp", (d, i) => data.data[i][1])
      .attr("data-quarter", (d, i) => years[i])
      .attr("class", "bar")
      .attr("x", (d, i) => xScale(dates[i]))
      .attr("y", (d) => high - d)
      .attr("width", barWidth)
      .attr("height", (d) => d)
      .attr("transform", "translate(60, -50)")
      .on("mouseover", function (e) {
         tooltip.transition().duration(0).style("opacity", 1);

         tooltip
            .html(
               e.target.getAttribute("data-quarter") +
                  "<br>" +
                  "$" +
                  window
                     .Number(e.target.getAttribute("data-gdp"))
                     .toFixed(1)
                     .replace(/(\d)(?=(\d{3})+\.)/g, "$1,") +
                  " Billion"
            )
            .attr("data-date", e.target.getAttribute("data-date"))
            .style("left", e.clientX + barWidth + "px")
            .style("top", high - 80 + "px");
      })
      .on("mouseout", function () {
         tooltip.transition().duration(0).style("opacity", 0);
      });
});
