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
/* Monthly Global Land-Surface Temperature */
var URL_temperatureData = 'https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/global-temperature.json';

var colors = ["#2257AF", "#448AFF", "#8CB5F9", "#D1DFF7", "#F9EDCB", "#FADD8B", "#FAD366", "#FAAC60", "#CC6942", "#D32F2F", "#B21C1C"];

var month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

var buckets = colors.length;

var margin = {
    top: 5,
    right: 0,
    bottom: 90,
    left: 100
};

var width = 1100 - margin.left - margin.right;
var height = 500 - margin.top - margin.bottom;
var legendElementWidth = 35;

var axisYLabelX = -65;
var axisYLabelY = height / 2;

var axisXLabelX = width / 2;
var axisXLabelY = height + 45;

d3.json(URL_temperatureData, function(error, data) {
    if (error) throw error;

    var baseTemp = data.baseTemperature;
    var temperatureData = data.monthlyVariance;

    var yearData = temperatureData.map(function(obj) {
        return obj.year;
    });
    yearData = yearData.filter(function(v, i) {
        return yearData.indexOf(v) == i;
    });

    var varianceData = temperatureData.map(function(obj) {
        return obj.variance;
    });

    var lowVariance = d3.min(varianceData);
    var highVariance = d3.max(varianceData);

    var lowYear = d3.min(yearData);
    var highYear = d3.max(yearData);

    var minDate = new Date(lowYear, 0);
    var maxDate = new Date(highYear, 0);

    var gridWidth = width / yearData.length;
    var gridHeight = height / month.length;


    var colorScale = d3.scale.quantile()
        .domain([lowVariance + baseTemp, highVariance + baseTemp])
        .range(colors);


    var svg = d3.select("#chart").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var div = d3.select("#chart").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    var monthLabels = svg.selectAll(".monthLabel")
        .data(month)
        .enter()
        .append("text")
        .text(function(d) {
            return d;
        })
        .attr("x", 0)
        .attr("y", function(d, i) {
            return i * gridHeight;
        })
        .style("text-anchor", "end")
        .attr("transform", "translate(-6," + gridHeight / 1.5 + ")")
        .attr("class", "monthLabel scales axis axis-months");


    var xScale = d3.time.scale()
        .domain([minDate, maxDate])
        .range([0, width]);

    var xAxis = d3.svg.axis()
        .scale(xScale)
        .orient("bottom")
        .ticks(d3.time.years, 10);

    svg.append("g")
        .attr("class", "axis axis-years")
        .attr("transform", "translate(0," + (height + 1) + ")")
        .call(xAxis);

    svg.append('g')
        .attr('transform', 'translate(' + axisYLabelX + ', ' + axisYLabelY + ')')
        .append('text')
        .attr('text-anchor', 'middle')
        .attr('transform', 'rotate(-90)')
        .attr("class", "axislabel")
        .text('Months');

    svg.append('g')
        .attr('transform', 'translate(' + axisXLabelX + ', ' + axisXLabelY + ')')
        .append('text')
        .attr('text-anchor', 'middle')
        .attr("class", "axislabel")
        .text('Years');

    var temps = svg.selectAll(".years")
        .data(temperatureData, function(d) {
            return (d.year + ':' + d.month);
        });

    temps.enter()
        .append("rect")
        .attr("x", function(d) {
            return ((d.year - lowYear) * gridWidth);
        })
        .attr("y", function(d) {
            return ((d.month - 1) * gridHeight);
        })
        .attr("rx", 0)
        .attr("ry", 0)
        .attr("width", gridWidth)
        .attr("height", gridHeight)
        .style("fill", "white")
        .on("mouseover", function(d) {
            div.transition()
                .duration(100)/* Monthly Global Land-Surface Temperature */
                var URL_temperatureData = 'https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/global-temperature.json';
                
                var colors = ["#2257AF", "#448AFF", "#8CB5F9", "#D1DFF7", "#F9EDCB", "#FADD8B", "#FAD366", "#FAAC60", "#CC6942", "#D32F2F", "#B21C1C"];
                
                var month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
                
                var buckets = colors.length;
                
                var margin = {
                    top: 5,
                    right: 0,
                    bottom: 90,
                    left: 100
                };
                
                var width = 1100 - margin.left - margin.right;
                var height = 500 - margin.top - margin.bottom;
                var legendElementWidth = 35;
                
                var axisYLabelX = -65;
                var axisYLabelY = height / 2;
                
                var axisXLabelX = width / 2;
                var axisXLabelY = height + 45;
                
                d3.json(URL_temperatureData, function(error, data) {
                    if (error) throw error;
                
                    var baseTemp = data.baseTemperature;
                    var temperatureData = data.monthlyVariance;
                
                    var yearData = temperatureData.map(function(obj) {
                        return obj.year;
                    });
                    yearData = yearData.filter(function(v, i) {
                        return yearData.indexOf(v) == i;
                    });
                
                    var varianceData = temperatureData.map(function(obj) {
                        return obj.variance;
                    });
                
                    var lowVariance = d3.min(varianceData);
                    var highVariance = d3.max(varianceData);
                
                    var lowYear = d3.min(yearData);
                    var highYear = d3.max(yearData);
                
                    var minDate = new Date(lowYear, 0);
                    var maxDate = new Date(highYear, 0);
                
                    var gridWidth = width / yearData.length;
                    var gridHeight = height / month.length;
                
                
                    var colorScale = d3.scale.quantile()
                        .domain([lowVariance + baseTemp, highVariance + baseTemp])
                        .range(colors);
                
                
                    var svg = d3.select("#chart").append("svg")
                        .attr("width", width + margin.left + margin.right)
                        .attr("height", height + margin.top + margin.bottom)
                        .append("g")
                        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
                
                    var div = d3.select("#chart").append("div")
                        .attr("class", "tooltip")
                        .style("opacity", 0);
                
                    var monthLabels = svg.selectAll(".monthLabel")
                        .data(month)
                        .enter()
                        .append("text")
                        .text(function(d) {
                            return d;
                        })
                        .attr("x", 0)
                        .attr("y", function(d, i) {
                            return i * gridHeight;
                        })
                        .style("text-anchor", "end")
                        .attr("transform", "translate(-6," + gridHeight / 1.5 + ")")
                        .attr("class", "monthLabel scales axis axis-months");
                
                
                    var xScale = d3.time.scale()
                        .domain([minDate, maxDate])
                        .range([0, width]);
                
                    var xAxis = d3.svg.axis()
                        .scale(xScale)
                        .orient("bottom")
                        .ticks(d3.time.years, 10);
                
                    svg.append("g")
                        .attr("class", "axis axis-years")
                        .attr("transform", "translate(0," + (height + 1) + ")")
                        .call(xAxis);
                
                    svg.append('g')
                        .attr('transform', 'translate(' + axisYLabelX + ', ' + axisYLabelY + ')')
                        .append('text')
                        .attr('text-anchor', 'middle')
                        .attr('transform', 'rotate(-90)')
                        .attr("class", "axislabel")
                        .text('Months');
                
                    svg.append('g')
                        .attr('transform', 'translate(' + axisXLabelX + ', ' + axisXLabelY + ')')
                        .append('text')
                        .attr('text-anchor', 'middle')
                        .attr("class", "axislabel")
                        .text('Years');
                
                    var temps = svg.selectAll(".years")
                        .data(temperatureData, function(d) {/* Monthly Global Land-Surface Temperature */
                        var URL_temperatureData = 'https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/global-temperature.json';
                        
                        var colors = ["#2257AF", "#448AFF", "#8CB5F9", "#D1DFF7", "#F9EDCB", "#FADD8B", "#FAD366", "#FAAC60", "#CC6942", "#D32F2F", "#B21C1C"];
                        
                        var month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
                        
                        var buckets = colors.length;
                        
                        var margin = {
                            top: 5,
                            right: 0,
                            bottom: 90,
                            left: 100
                        };
                        
                        var width = 1100 - margin.left - margin.right;
                        var height = 500 - margin.top - margin.bottom;
                        var legendElementWidth = 35;
                        
                        var axisYLabelX = -65;
                        var axisYLabelY = height / 2;
                        
                        var axisXLabelX = width / 2;
                        var axisXLabelY = height + 45;
                        
                        d3.json(URL_temperatureData, function(error, data) {
                            if (error) throw error;
                        
                            var baseTemp = data.baseTemperature;
                            var temperatureData = data.monthlyVariance;
                        
                            var yearData = temperatureData.map(function(obj) {
                                return obj.year;
                            });
                            yearData = yearData.filter(function(v, i) {
                                return yearData.indexOf(v) == i;
                            });
                        
                            var varianceData = temperatureData.map(function(obj) {
                                return obj.variance;
                            });
                        
                            var lowVariance = d3.min(varianceData);
                            var highVariance = d3.max(varianceData);
                        
                            var lowYear = d3.min(yearData);
                            var highYear = d3.max(yearData);
                        
                            var minDate = new Date(lowYear, 0);
                            var maxDate = new Date(highYear, 0);
                        
                            var gridWidth = width / yearData.length;
                            var gridHeight = height / month.length;
                        
                        
                            var colorScale = d3.scale.quantile()
                                .domain([lowVariance + baseTemp, highVariance + baseTemp])
                                .range(colors);
                        
                        
                            var svg = d3.select("#chart").append("svg")
                                .attr("width", width + margin.left + margin.right)
                                .attr("height", height + margin.top + margin.bottom)
                                .append("g")
                                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
                        
                            var div = d3.select("#chart").append("div")
                                .attr("class", "tooltip")
                                .style("opacity", 0);
                        
                            var monthLabels = svg.selectAll(".monthLabel")
                                .data(month)
                                .enter()
                                .append("text")
                                .text(function(d) {
                                    return d;
                                })
                                .attr("x", 0)
                                .attr("y", function(d, i) {
                                    return i * gridHeight;
                                })
                                .style("text-anchor", "end")
                                .attr("transform", "translate(-6," + gridHeight / 1.5 + ")")
                                .attr("class", "monthLabel scales axis axis-months");
                        
                        
                            var xScale = d3.time.scale()
                                .domain([minDate, maxDate])
                                .range([0, width]);
                        
                            var xAxis = d3.svg.axis()
                                .scale(xScale)
                                .orient("bottom")
                                .ticks(d3.time.years, 10);
                        
                            svg.append("g")
                                .attr("class", "axis axis-years")
                                .attr("transform", "translate(0," + (height + 1) + ")")
                                .call(xAxis);
                        
                            svg.append('g')
                                .attr('transform', 'translate(' + axisYLabelX + ', ' + axisYLabelY + ')')
                                .append('text')
                                .attr('text-anchor', 'middle')
                                .attr('transform', 'rotate(-90)')
                                .attr("class", "axislabel")
                                .text('Months');
                        
                            svg.append('g')
                                .attr('transform', 'translate(' + axisXLabelX + ', ' + axisXLabelY + ')')
                                .append('text')
                                .attr('text-anchor', 'middle')
                                .attr("class", "axislabel")
                                .text('Years');
                        
                            var temps = svg.selectAll(".years")
                                .data(temperatureData, function(d) {
                                    return (d.year + ':' + d.month);
                                });
                        
                            temps.enter()
                                .append("rect")
                                .attr("x", function(d) {
                                    return ((d.year - lowYear) * gridWidth);
                                })
                                .attr("y", function(d) {
                                    return ((d.month - 1) * gridHeight);
                                })
                                .attr("rx", 0)
                                .attr("ry", 0)
                                .attr("width", gridWidth)
                                .attr("height", gridHeight)
                                .style("fill", "white")
                                .on("mouseover", function(d) {
                                    div.transition()
                                        .duration(100)
                                        .style("opacity", 0.8);
                                    div.html("<span class='year'>" + d.year + " - " + month[d.month - 1] + "</span><br>" +
                                            "<span class='temperature'>" + (M/* Monthly Global Land-Surface Temperature */
                                            var URL_temperatureData = 'https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/global-temperature.json';
                                            
                                            var colors = ["#2257AF", "#448AFF", "#8CB5F9", "#D1DFF7", "#F9EDCB", "#FADD8B", "#FAD366", "#FAAC60", "#CC6942", "#D32F2F", "#B21C1C"];
                                            
                                            var month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
                                            
                                            var buckets = colors.length;
                                            
                                            var margin = {
                                                top: 5,
                                                right: 0,
                                                bottom: 90,
                                                left: 100
                                            };
                                            
                                            var width = 1100 - margin.left - margin.right;
                                            var height = 500 - margin.top - margin.bottom;
                                            var legendElementWidth = 35;
                                            
                                            var axisYLabelX = -65;
                                            var axisYLabelY = height / 2;
                                            
                                            var axisXLabelX = width / 2;
                                            var axisXLabelY = height + 45;
                                            
                                            d3.json(URL_temperatureData, function(error, data) {
                                                if (error) throw error;
                                            
                                                var baseTemp = data.baseTemperature;
                                                var temperatureData = data.monthlyVariance;
                                            
                                                var yearData = temperatureData.map(function(obj) {
                                                    return obj.year;
                                                });
                                                yearData = yearData.filter(function(v, i) {
                                                    return yearData.indexOf(v) == i;
                                                });
                                            
                                                var varianceData = temperatureData.map(function(obj) {
                                                    return obj.variance;
                                                });
                                            
                                                var lowVariance = d3.min(varianceData);
                                                var highVariance = d3.max(varianceData);
                                            
                                                var lowYear = d3.min(yearData);
                                                var highYear = d3.max(yearData);
                                            
                                                var minDate = new Date(lowYear, 0);
                                                var maxDate = new Date(highYear, 0);
                                            
                                                var gridWidth = width / yearData.length;
                                                var gridHeight = height / month.length;
                                            
                                            
                                                var colorScale = d3.scale.quantile()
                                                    .domain([lowVariance + baseTemp, highVariance + baseTemp])
                                                    .range(colors);
                                            
                                            
                                                var svg = d3.select("#chart").append("svg")
                                                    .attr("width", width + margin.left + margin.right)
                                                    .attr("height", height + margin.top + margin.bottom)
                                                    .append("g")
                                                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
                                            
                                                var div = d3.select("#chart").append("div")
                                                    .attr("class", "tooltip")
                                                    .style("opacity", 0);
                                            
                                                var monthLabels = svg.selectAll(".monthLabel")
                                                    .data(month)
                                                    .enter()
                                                    .append("text")
                                                    .text(function(d) {
                                                        return d;
                                                    })
                                                    .attr("x", 0)
                                                    .attr("y", function(d, i) {
                                                        return i * gridHeight;
                                                    })
                                                    .style("text-anchor", "end")
                                                    .attr("transform", "translate(-6," + gridHeight / 1.5 + ")")
                                                    .attr("class", "monthLabel scales axis axis-months");
                                            
                                            
                                                var xScale = d3.time.scale()
                                                    .domain([minDate, maxDate])
                                                    .range([0, width]);
                                            
                                                var xAxis = d3.svg.axis()
                                                    .scale(xScale)
                                                    .orient("bottom")
                                                    .ticks(d3.time.years, 10);
                                            
                                                svg.append("g")
                                                    .attr("class", "axis axis-years")
                                                    .attr("transform", "translate(0," + (height + 1) + ")")
                                                    .call(xAxis);
                                            
                                                svg.append('g')
                                                    .attr('transform', 'translate(' + axisYLabelX + ', ' + axisYLabelY + ')')
                                                    .append('text')
                                                    .attr('text-anchor', 'middle')
                                                    .attr('transform', 'rotate(-90)')
                                                    .attr("class", "axislabel")
                                                    .text('Months');
                                            
                                                svg.append('g')
                                                    .attr('transform', 'translate(' + axisXLabelX + ', ' + axisXLabelY + ')')
                                                    .append('text')
                                                    .attr('text-anchor', 'middle')
                                                    .attr("class", "axislabel")
                                                    .text('Years');
                                            
                                                var temps = svg.selectAll(".years")
                                                    .data(temperatureData, function(d) {
                                                        return (d.year + ':' + d.month);
                                                    });
                                            
                                                temps.enter()
                                                    .append("rect")
                                                    .attr("x", function(d) {
                                                        return ((d.year - lowYear) * gridWidth);
                                                    })
                                                    .attr("y", function(d) {
                                                        return ((d.month - 1) * gridHeight);
                                                    })
                                                    .attr("rx", 0)
                                                    .attr("ry", 0)
                                                    .attr("width", gridWidth)
                                                    .attr("height", gridHeight)
                                                    .style("fill", "white")
                                                    .on("mouseover", function(d) {
                                                        div.transition()
                                                            .duration(100)
                                                            .style("opacity", 0.8);
                                                        div.html("<span class='year'>" + d.year + " - " + month[d.month - 1] + "</span><br>" +
                                                                "<span class='temperature'>" + (Math.floor((d.variance + baseTemp) * 1000) / 1000) + " &#8451" + "</span><br>" +
                                                                "<span class='variance'>" + d.variance + " &#8451" + "</span>")
                                                            .style("left", (d3.event.pageX - ($('.tooltip').width() / 2)) + "px")
                                                            .style("top", (d3.event.pageY + 0) + "px")
                                                    })
                                                    .on("mouseout", function(d) {
                                                        div.transition()
                                                            .duration(200)
                                                            .style("opacity", 0);
                                                    });
                                            
                                                temps.transition().duration(1000)
                                                    .style("fill", function(d) {
                                                        return colorScale(d.v/* Monthly Global Land-Surface Temperature */
                                                        var URL_temperatureData = 'https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/global-temperature.json';
                                                        
                                                        var colors = ["#2257AF", "#448AFF", "#8CB5F9", "#D1DFF7", "#F9EDCB", "#FADD8B", "#FAD366", "#FAAC60", "#CC6942", "#D32F2F", "#B21C1C"];
                                                        
                                                        var month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
                                                        
                                                        var buckets = colors.length;
                                                        
                                                        var margin = {
                                                            top: 5,
                                                            right: 0,
                                                            bottom: 90,
                                                            left: 100
                                                        };
                                                        
                                                        var width = 1100 - margin.left - margin.right;
                                                        var height = 500 - margin.top - margin.bottom;
                                                        var legendElementWidth = 35;
                                                        
                                                        var axisYLabelX = -65;
                                                        var axisYLabelY = height / 2;
                                                        
                                                        var axisXLabelX = width / 2;
                                                        var axisXLabelY = height + 45;
                                                        
                                                        d3.json(URL_temperatureData, function(error, data) {
                                                            if (error) throw error;
                                                        
                                                            var baseTemp = data.baseTemperature;
                                                            var temperatureData = data.monthlyVariance;
                                                        
                                                            var yearData = temperatureData.map(function(obj) {
                                                                return obj.year;
                                                            });
                                                            yearData = yearData.filter(function(v, i) {
                                                                return yearData.indexOf(v) == i;
                                                            });
                                                        
                                                            var varianceData = temperatureData.map(function(obj) {
                                                                return obj.variance;
                                                            });
                                                        
                                                            var lowVariance = d3.min(varianceData);
                                                            var highVariance = d3.max(varianceData);
                                                        
                                                            var lowYear = d3.min(yearData);
                                                            var highYear = d3.max(yearData);
                                                        
                                                            var minDate = new Date(lowYear, 0);
                                                            var maxDate = new Date(highYear, 0);
                                                        
                                                            var gridWidth = width / yearData.length;
                                                            var gridHeight = height / month.length;
                                                        
                                                        
                                                            var colorScale = d3.scale.quantile()
                                                                .domain([lowVariance + baseTemp, highVariance + baseTemp])
                                                                .range(colors);
                                                        
                                                        
                                                            var svg = d3.select("#chart").append("svg")
                                                                .attr("width", width + margin.left + margin.right)
                                                                .attr("height", height + margin.top + margin.bottom)
                                                                .append("g")
                                                                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
                                                        
                                                            var div = d3.select("#chart").append("div")
                                                                .attr("class", "tooltip")
                                                                .style("opacity", 0);
                                                        
                                                            var monthLabels = svg.selectAll(".monthLabel")
                                                                .data(month)
                                                                .enter()
                                                                .append("text")
                                                                .text(function(d) {
                                                                    return d;
                                                                })
                                                                .attr("x", 0)
                                                                .attr("y", function(d, i) {
                                                                    return i * gridHeight;
                                                                })
                                                                .style("text-anchor", "end")
                                                                .attr("transform", "translate(-6," + gridHeight / 1.5 + ")")
                                                                .attr("class", "monthLabel scales axis axis-months");
                                                        
                                                        
                                                            var xScale = d3.time.scale()
                                                                .domain([minDate, maxDate])
                                                                .range([0, width]);
                                                        
                                                            var xAxis = d3.svg.axis()
                                                                .scale(xScale)
                                                                .orient("bottom")
                                                                .ticks(d3.time.years, 10);
                                                        
                                                            svg.append("g")
                                                                .attr("class", "axis axis-years")
                                                                .attr("transform", "translate(0," + (height + 1) + ")")
                                                                .call(xAxis);
                                                        
                                                            svg.append('g')
                                                                .attr('transform', 'translate(' + axisYLabelX + ', ' + axisYLabelY + ')')
                                                                .append('text')
                                                                .attr('text-anchor', 'middle')
                                                                .attr('transform', 'rotate(-90)')
                                                                .attr("class", "axislabel")
                                                                .text('Months');
                                                        
                                                            svg.append('g')
                                                                .attr('transform', 'translate(' + axisXLabelX + ', ' + axisXLabelY + ')')
                                                                .append('text')
                                                                .attr('text-anchor', 'middle')
                                                                .attr("class", "axislabel")
                                                                .text('Years');
                                                        
                                                            var temps = svg.selectAll(".years")
                                                                .data(temperatureData, function(d) {
                                                                    return (d.year + ':' + d.month);
                                                                });
                                                        
                                                            temps.enter()
                                                                .append("rect")
                                                                .attr("x", function(d) {
                                                                    return ((d.year - lowYear) * gridWidth);
                                                                })
                                                                .attr("y", function(d) {
                                                                    return ((d.month - 1) * gridHeight);
                                                                })
                                                                .attr("rx", 0)
                                                                .attr("ry", 0)
                                                                .attr("width", gridWidth)
                                                                .attr("height", gridHeight)
                                                                .style("fill", "white")
                                                                .on("mouseover", function(d) {
                                                                    div.transition()
                                                                        .duration(100)
                                                                        .style("opacity", 0.8);
                                                                    div.html("<span class='year'>" + d.year + " - " + month[d.month - 1] + "</span><br>" +
                                                                            "<span class='temperature'>" + (Math.floor((d.variance + baseTemp) * 1000) / 1000) + " &#8451" + "</span><br>" +
                                                                            "<span class='variance'>" + d.variance + " &#8451" + "</span>")
                                                                        .style("left", (d3.event.pageX - ($('.tooltip').width() / 2)) + "px")
                                                                        .style("top", (d3.event.pageY + 0) + "px")
                                                                })
                                                                .on("mouseout", function(d) {
                                                                    div.transition()
                                                                        .duration(200)
                                                                        .style("opacity", 0);
                                                                });
                                                        
                                                            temps.transition().duration(1000)
                                                                .style("fill", function(d) {
                                                                    return colorScale(d.variance + baseTemp);
                                                                });
                                                        
                                                            var legend = svg.selectAll(".legend")
                                                                .data([0].concat(colorScale.quantiles()), function(d) {
                                                                    return d;
                                                                });
                                                        
                                                            legend.enter().append("g")
                                                                .attr("class", "legend");
                                                        
                                                            legend.append("rect")
                                                                .attr("x", function(d, i) {
                                                                    return legendElementWidth * i + (width - legendElementWidth * buckets);
                                                                })
                                                                .attr("y", height + 50)
                                                                .attr("width", legendElementWidth)
                                                                .attr("height", gridHeight / 2)
                                                                .style("fill", function(d, i) {
                                                                    return colors[i];
                                                                });
                                                        
                                                            legend.append("text")
                                                                .attr("class", "scales")
                                                                .text(function(d) {
                                                                    return (Math.floor(d * 10) / 10);
                                                                })
                                                                .attr("x", function(d, i) {
                                                                    return ((legendElementWidth * i) + Math.floor(legendElementWidth / 2) - 6 + (width - legendElementWidth * buckets));
                                                                })
                                                                .attr("y", height + gridHeight + 50);
                                                        
                                                        });ariance + baseTemp);
                                                    });
                                            
                                                var legend = svg.selectAll(".legend")
                                                    .data([0].concat(colorScale.quantiles()), function(d) {
                                                        return d;
                                                    });
                                            
                                                legend.enter().append("g")
                                                    .attr("class", "legend");
                                            
                                                legend.append("rect")
                                                    .attr("x", function(d, i) {
                                                        return legendElementWidth * i + (width - legendElementWidth * buckets);
                                                    })
                                                    .attr("y", height + 50)
                                                    .attr("width", legendElementWidth)
                                                    .attr("height", gridHeight / 2)
                                                    .style("fill", function(d, i) {
                                                        return colors[i];
                                                    });
                                            
                                                legend.append("text")
                                                    .attr("class", "scales")
                                                    .text(function(d) {
                                                        return (Math.floor(d * 10) / 10);
                                                    })
                                                    .attr("x", function(d, i) {
                                                        return ((legendElementWidth * i) + Math.floor(legendElementWidth / 2) - 6 + (width - legendElementWidth * buckets));
                                                    })
                                                    .attr("y", height + gridHeight + 50);
                                            
                                            });ath.floor((d.variance + baseTemp) * 1000) / 1000) + " &#8451" + "</span><br>" +
                                            "<span class='variance'>" + d.variance + " &#8451" + "</span>")
                                        .style("left", (d3.event.pageX - ($('.tooltip').width() / 2)) + "px")
                                        .style("top", (d3.event.pageY + 0) + "px")
                                })
                                .on("mouseout", function(d) {
                                    div.transition()
                                        .duration(200)
                                        .style("opacity", 0);
                                });
                        
                            temps.transition().duration(1000)
                                .style("fill", function(d) {
                                    return colorScale(d.variance + baseTemp);
                                });
                        
                            var legend = svg.selectAll(".legend")
                                .data([0].concat(colorScale.quantiles()), function(d) {
                                    return d;
                                });
                        
                            legend.enter().append("g")
                                .attr("class", "legend");
                        
                            legend.append("rect")
                                .attr("x", function(d, i) {
                                    return legendElementWidth * i + (width - legendElementWidth * buckets);
                                })
                                .attr("y", height + 50)
                                .attr("width", legendElementWidth)
                                .attr("height", gridHeight / 2)
                                .style("fill", function(d, i) {
                                    return colors[i];
                                });
                        
                            legend.append("text")
                                .attr("class", "scales")
                                .text(function(d) {
                                    return (Math.floor(d * 10) / 10);
                                })
                                .attr("x", function(d, i) {
                                    return ((legendElementWidth * i) + Math.floor(legendElementWidth / 2) - 6 + (width - legendElementWidth * buckets));
                                })
                                .attr("y", height + gridHeight + 50);
                        
                        });
                            return (d.year + ':' + d.month);
                        });
                
                    temps.enter()
                        .append("rect")
                        .attr("x", function(d) {
                            return ((d.year - lowYear) * gridWidth);
                        })
                        .attr("y", function(d) {
                            return ((d.month - 1) * gridHeight);
                        })
                        .attr("rx", 0)
                        .attr("ry", 0)
                        .attr("width", gridWidth)
                        .attr("height", gridHeight)
                        .style("fill", "white")
                        .on("mouseover", function(d) {
                            div.transition()
                                .duration(100)
                                .style("opacity", 0.8);
                            div.html("<span class='year'>" + d.year + " - " + month[d.month - 1] + "</span><br>" +
                                    "<span class='temperature'>" + (Math.floor((d.variance + baseTemp) * 1000) / 1000) + " &#8451" + "</span><br>" +
                                    "<span class='variance'>" + d.variance + " &#8451" + "</span>")
                                .style("left", (d3.event.pageX - ($('.tooltip').width() / 2)) + "px")
                                .style("top", (d3.event.pageY + 0) + "px")
                        })
                        .on("mouseout", function(d) {
                            div.transition()
                                .duration(200)
                                .style("opacity", 0);
                        });
                
                    temps.transition().duration(1000)
                        .style("fill", function(d) {
                            return colorScale(d.variance + baseTemp);
                        });
                
                    var legend = svg.selectAll(".legend")
                        .data([0].concat(colorScale.quantiles()), function(d) {
                            return d;
                        });
                
                    legend.enter().append("g")
                        .attr("class", "legend");
                
                    legend.append("rect")
                        .attr("x", function(d, i) {
                            return legendElementWidth * i + (width - legendElementWidth * buckets);
                        })
                        .attr("y", height + 50)
                        .attr("width", legendElementWidth)
                        .attr("height", gridHeight / 2)
                        .style("fill", function(d, i) {
                            return colors[i];
                        });
                
                    legend.append("text")
                        .attr("class", "scales")
                        .text(function(d) {
                            return (Math.floor(d * 10) / 10);
                        })
                        .attr("x", function(d, i) {
                            return ((legendElementWidth * i) + Math.floor(legendElementWidth / 2) - 6 + (width - legendElementWidth * buckets));
                        })
                        .attr("y", height + gridHeight + 50);
                
                });
                .style("opacity", 0.8);
            div.html("<span class='year'>" + d.year + " - " + month[d.month - 1] + "</span><br>" +
                    "<span class='temperature'>" + (Math.floor((d.variance + baseTemp) * 1000) / 1000) + " &#8451" + "</span><br>" +
                    "<span class='variance'>" + d.variance + " &#8451" + "</span>")
                .style("left", (d3.event.pageX - ($('.tooltip').width() / 2)) + "px")
                .style("top", (d3.event.pageY + 0) + "px")
        })
        .on("mouseout", function(d) {
            div.transition()
                .duration(200)
                .style("opacity", 0);
        });

    temps.transition().duration(1000)
        .style("fill", function(d) {
            return colorScale(d.variance + baseTemp);
        });

    var legend = svg.selectAll(".legend")
        .data([0].concat(colorScale.quantiles()), function(d) {
            return d;
        });

    legend.enter().append("g")
        .attr("class", "legend");

    legend.append("rect")
        .attr("x", function(d, i) {
            return legendElementWidth * i + (width - legendElementWidth * buckets);
        })
        .attr("y", height + 50)
        .attr("width", legendElementWidth)
        .attr("height", gridHeight / 2)
        .style("fill", function(d, i) {
            return colors[i];
        });

    legend.append("text")
        .attr("class", "scales")
        .text(function(d) {
            return (Math.floor(d * 10) / 10);
        })
        .attr("x", function(d, i) {
            return ((legendElementWidth * i) + Math.floor(legendElementWidth / 2) - 6 + (width - legendElementWidth * buckets));
        })
        .attr("y", height + gridHeight + 50);

});
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
