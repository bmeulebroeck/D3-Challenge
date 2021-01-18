//Establish SVG parameters
var svgWidth = 960;
var svgHeight = 500;

var margin = {
    top: 20,
    right: 20,
    bottom: 80,
    left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

//Create the SVG wrapper and append the chart group
var svg = d3.select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

//Initial chart params
var chosenXAxis = "";
var chosenYAxis = "";


