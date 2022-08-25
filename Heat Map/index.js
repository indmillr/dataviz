import * as d3 from "https://cdn.skypack.dev/d3@7.6.1";
import * as d3Format from "https://cdn.skypack.dev/d3-format@3.1.0";
const margin = { right: 50, top: 100, left: 100, bottom: 150 };

let height = 500 - margin.top - margin.bottom;
let width = 1250 - margin.left - margin.right;

const url =
   "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json";

const yearParse = d3.timeParse("%Y");
const yearFormat = d3.timeFormat("%Y");

const monthParse = d3.timeParse("%b");
const monthFormat = d3.timeFormat("%b");

const month = [
   "January",
   "February",
   "March",
   "April",
   "May",
   "June",
   "July",
   "August",
   "September",
   "October",
   "November",
   "December",
];
const revMonth = month.reverse();

//append the canvas to body
const svg = d3
   .select("body")
   .append("svg")
   .attr("width", width + margin.left + margin.right)
   .attr("height", height + margin.top + margin.bottom);

//create chart group
const chartGroup = svg
   .append("g")
   .attr("transform", `translate(${margin.left},${margin.top})`);

//append tooltip
const tooltip = d3
   .select("body")
   .append("div")
   .attr("class", "tooltip")
   .attr("id", "tooltip")
   .style("opacity", 0);

d3.json(url).then((data) => {
   //console.log(data)
   const baseTemp = data.baseTemperature;
   const monthVar = data.monthlyVariance;
   console.log(monthVar);
   //minimum and maximum temperature variance
   const minVar = d3.min(monthVar, (d) => d.variance);
   const maxVar = d3.max(monthVar, (d) => d.variance);
   //minimum and maximum years
   const minYear = d3.min(monthVar, (d) => d.year);
   const maxYear = d3.max(monthVar, (d) => d.year);
   const differenceYear = maxYear - minYear;
   const colors = d3
      .scaleSequential(d3.interpolateViridis)
      .domain([baseTemp + minVar, baseTemp + maxVar]);

   //set up x
   const xValue = (d) => yearParse(d.year);
   const xScale = d3
      .scaleTime()
      .range([0, width])
      .domain(d3.extent(monthVar, (d) => yearParse(d.year)));
   const xMap = (d) => xScale(xValue(d));
   const xAxis = d3
      .axisBottom(xScale)
      .tickSize(16, 0)
      .tickFormat(d3.timeFormat("%Y"));

   //set up y
   const yValue = (d) => d.month - 1;
   const yScale = d3.scaleLinear().range([0, height]).domain([0, 11]);
   const yMap = (d) => yScale(yValue(d));
   const yAxis = d3
      .axisLeft(yScale)
      .tickFormat((d, i) => `${month[12 - (d + 1)]}`);

   //add title text
   chartGroup
      .append("text")
      .attr("class", "text")
      .attr("id", "title")
      .text("Heat Map")
      .attr("text-anchor", "middle")
      .style("font-size", 36)
      .attr("x", width / 2)
      .attr("y", 0 - margin.top / 2);

   chartGroup
      .append("text")
      .attr("class", "text")
      .attr("id", "description")
      .attr("text-anchor", "middle")
      .text("Base Temp: 8.66°C")
      .attr("x", width / 2)
      .attr("y", 24 - margin.top / 2);

   //x-axis
   chartGroup
      .append("g")
      .attr("class", "x axis")
      .attr("id", "x-axis")
      .attr("transform", `translate(0,${height + height / 12})`)
      .call(xAxis);

   //y-axis
   chartGroup
      .append("g")
      .attr("class", "y axis hidden")
      .attr("id", "y-axis")
      .attr("transform", `translate(0,${height / 12 / 2})`)
      .call(yAxis);

   //chart
   chartGroup
      .append("g")
      .selectAll("rect")
      .data(monthVar)
      .enter()
      .append("rect")
      .attr("class", "cell")
      .attr("x", (d) => xMap(d))
      .attr("y", (d) => yMap(d))
      .attr("rx", 1)
      .attr("ry", 1)
      .attr("width", width / differenceYear - 0.25)
      .attr("height", height / 12 + 2.25)
      .attr("data-month", (d) => d.month - 1)
      .attr("data-year", (d) => d.year)
      .attr("data-temp", (d) => baseTemp + d.variance)
      .style("fill", (d, i) => colors(d.variance + baseTemp))
      .on("mouseover", (d) => {
         tooltip.transition().duration(50).style("opacity", 0.9);

         tooltip.attr("data-year", d.year);
         tooltip.attr("data-temp", d.variance);
         tooltip
            .html(
               `Month: ${month[12 - d.month]}<br/>Year: ${d.year}
<br/>Variance: ${d.variance}°C`
            )
            .style("left", d3.event.pageX - 75 + "px")
            .style("top", d3.event.pageY - 100 + "px");
      })
      .on("mouseout", () => {
         tooltip.transition().duration(50).style("opacity", 0);
      });

   const legend = d3
      .scaleLinear()
      .domain([minVar, maxVar])
      .range([colors(baseTemp + minVar), colors(baseTemp + maxVar)]);

   svg.append("g")
      .attr("class", "legend")
      .attr("id", "legend")
      .attr("font-size", 8)
      .attr(
         "transform",
         `translate(${margin.left},${height + margin.top + margin.bottom / 2})`
      );

   const legendLinear = d3
      .legendColor()
      .shape("rect")
      .shapeWidth(15)
      .cells(20)
      .orient("horizontal")
      .scale(legend);

   svg.select(".legend").call(legendLinear);
});
