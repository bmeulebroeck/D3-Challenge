//Establish SVG parameters
var svgWidth = 960;
var svgHeight = 500;

var margin = {
    top: 20,
    right: 20,
    bottom: 100,
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
var chosenXAxis = "poverty";
var chosenYAxis = "obesity";

//============================================================================
//============================================================================
//Functions to set the scale for the x and y axes based on the data selected
function xScale(censusData, chosenXAxis) {
    var xLinearScale = d3.scaleLinear()
        .domain([d3.min(censusData, d => d[chosenXAxis]) *0.9,
        d3.max(censusData, d => d[chosenXAxis])
        ])
        .range([0, width])
        .nice();
    return xLinearScale;
}

function yScale(censusData, chosenYAxis) {
    var yLinearScale = d3.scaleLinear()
        .domain([d3.min(censusData, d => d[chosenYAxis]) *0.8,
        d3.max(censusData, d => d[chosenYAxis])*1.1
        ])
        .range([height, 0])
        .nice();
    return yLinearScale;
}

//============================================================================
//============================================================================
//Functions to render the x and y axes based on data selected

function renderXAxis (newXScale, xAxis) {
    var bottomAxis = d3.axisBottom(newXScale);

    xAxis.transition().duration(1000).call(bottomAxis);
}

function renderYAxis (newYScale, yAxis) {
    var leftAxis = d3.axisLeft(newYScale);

    yAxis.transition().duration(1000).call(leftAxis);
}

//============================================================================
//============================================================================
//Function to update circles group and state abbrs and transition to data selected
function renderCircles(circlesGroup, newXScale, chosenXAxis, newYScale, chosenYAxis) {
    circlesGroup.transition()
        .duration(1000)
        .attr("cx", d => newXScale(d[chosenXAxis]))
        .attr("cy", d => newYScale(d[chosenYAxis]));
}

function renderStateAbbrs(stateAbbrGroup, newXScale, chosenXAxis, newYScale, chosenYAxis) {
    stateAbbrGroup.transition()
        .duration(1000)
        .attr("x", d => newXScale(d[chosenXAxis]))
        .attr("y", d => newYScale(d[chosenYAxis]));
}


//============================================================================
//============================================================================
//Function to update the tooltip based on data selected
function updateToolTip(chosenXAxis, chosenYAxis, stateAbbrGroup) {
    var labelX;

    if (chosenXAxis === "poverty") {
        labelX = "Poverty %: ";
    }
    else if (chosenXAxis === "age") {
        labelX = "Median Age: ";
    }
    else {
        labelX = "Median HH Income: ";
    }

    var labelY;

    if (chosenYAxis === "obesity") {
        labelY = "Obese %: ";
    }
    else if (chosenYAxis === "smokes") {
        labelY = "Smokes %: ";
    }
    else {
        labelY = "Lacks Healthcare %: ";
    }

    var toolTip = d3.tip()
        .attr("class", "d3-tip")
        .offset([80,-60])
        .html(function(d) {
            return (`${d.state}<br>${labelX} ${d[chosenXAxis]}<br>${labelY} ${d[chosenYAxis]}`);
        });

    stateAbbrGroup.call(toolTip);
    
    //Mouseover and mouseout event listeners for the tooltip
    stateAbbrGroup.on("mouseover", function(data) {
        toolTip.show(data);
    })
        .on("mouseout", function(data, index) {
            toolTip.hide(data);
        })
    return stateAbbrGroup;
}


//============================================================================
//============================================================================
//Retrieve the data from the CSV file
d3.csv("./D3_data_journalism/assets/data/data.csv").then(function(censusData, err) {
    if (err) throw err;

    //Parse the data needed
    censusData.forEach(function(data) {
        data.poverty = +data.poverty;
        data.age = +data.age;
        data.income = +data.income;
        data.obesity = +data.obesity;
        data.smokes = +data.smokes;
        data.healthcare = +data.healthcare;
    });

    var xLinearScale = xScale(censusData, chosenXAxis);
    var yLinearScale = yScale(censusData, chosenYAxis);

    console.log(chosenXAxis);
    console.log(chosenYAxis);

    //Create initial axis functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    //Append the x and y axis to the chart group
    var xAxis = chartGroup.append("g")
        .classed("x-axis", true)
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);

    var yAxis = chartGroup.append("g")
        .classed("y-axis", true)
        .call(leftAxis);

    //Append the initial circles
    var circlesGroup = chartGroup.selectAll("circle")
        .data(censusData)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d[chosenXAxis]))
        .attr("cy", d => yLinearScale(d[chosenYAxis]))
        .attr("r", 20)
        .attr("opacity", ".5")
        .classed("stateCircle", true);

    var stateAbbrGroup = chartGroup.selectAll("stateText")
        .data(censusData)
        .enter()
        .append("text")
        .classed("stateText", true)
        .attr("x", d => xLinearScale(d[chosenXAxis]))
        .attr("y", d => yLinearScale(d[chosenYAxis]))
        .attr("dy", 3)
        .attr("font-size", "10px")
        .text(function(d) {return d.abbr});

    //Create group for the x axis labels
    var labelsXGroup = chartGroup.append("g")
        .attr("transform", `translate(${width/2}, ${height + 20})`);

    var povertyLabel = labelsXGroup.append("text")
        .attr("x", 0)
        .attr("y", 20)
        .attr("value", "poverty")
        .classed("active", true)
        .text("Poverty %");

    var ageLabel = labelsXGroup.append("text")
        .attr("x", 0)
        .attr("y", 40)
        .attr("value", "age")
        .classed("inactive", true)
        .text("Age (median)");

    var incomeLabel = labelsXGroup.append("text")
        .attr("x", 0)
        .attr("y", 60)
        .attr("value", "income")
        .classed("inactive", true)
        .text("Household Income (median)");

    //Creat group for the y axis labels
    var labelsYGroup = chartGroup.append("g")
        .attr("transform", "rotate(-90)");

    var obesityLabel = labelsYGroup.append("text")
        .attr("y", 0 - margin.left)
        .attr("x", 0 - (height/2))
        .attr("dy", "1em")
        .attr("value", "obesity")
        .classed("active", true)
        .text("Obesity %");

    var smokesLabel = labelsYGroup.append("text")
        .attr("y", 20 - margin.left)
        .attr("x", 0 - (height/2))
        .attr("dy", "1em")
        .attr("value", "smokes")
        .classed("inactive", true)
        .text("Smokes %");

    var healthcareLabel = labelsYGroup.append("text")
        .attr("y", 40 - margin.left)
        .attr("x", 0 - (height/2))
        .attr("dy", "1em")
        .attr("value", "healthcare")
        .classed("inactive", true)
        .text("Lacks Healthcare %");
    
    //Update tooltip function
    var stateAbbrGroup = updateToolTip(chosenXAxis, chosenYAxis, stateAbbrGroup);

    //X axis labels event listener
    labelsXGroup.selectAll("text")
        .on("click", function() {
            var xvalue = d3.select(this).attr("value");

            if (xvalue !== chosenXAxis) {
                chosenXAxis = xvalue;
                console.log(chosenXAxis);
                //Update x scale
                xLinearScale = xScale(censusData, chosenXAxis);
                //Update x axis
                renderXAxis(xLinearScale, xAxis);
                // xAxis = renderAxes(xLinearScale, xAxis)
                //Update circles
                renderCircles(circlesGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);
                //Update state abbrs
                renderStateAbbrs(stateAbbrGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);
                //Update tooltips
                updateToolTip(chosenXAxis, chosenYAxis, stateAbbrGroup);

                //Change the bold text for the selection
                if (chosenXAxis === "poverty") {
                    povertyLabel
                        .classed("active", true)
                        .classed("inactive", false)
                    ageLabel
                        .classed("active", false)
                        .classed("inactive", true)
                    incomeLabel
                        .classed("active", false)
                        .classed("inactive", true)
                }
                else if (chosenXAxis === "age") {
                    povertyLabel
                        .classed("active", false)
                        .classed("inactive", true)
                    ageLabel
                        .classed("active", true)
                        .classed("inactive", false)
                    incomeLabel
                        .classed("active", false)
                        .classed("inactive", true)
                }
                else {
                    povertyLabel
                        .classed("active", false)
                        .classed("inactive", true)
                    ageLabel
                        .classed("active", false)
                        .classed("inactive", true)
                    incomeLabel
                        .classed("active", true)
                        .classed("inactive", false)
                }
            }
        });

    //Y axis labels event listener
    labelsYGroup.selectAll("text")
        .on("click", function() {
            var yvalue = d3.select(this).attr("value");

            if (yvalue !== chosenYAxis) {
                chosenYAxis = yvalue;
                console.log(chosenYAxis);

                //Update y scale
                yLinearScale = yScale(censusData, chosenYAxis);
                //Update y axis
                renderYAxis(yLinearScale, yAxis);
                //Update circles
                renderCircles(circlesGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);
                //Update state abbrs
                renderStateAbbrs(stateAbbrGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);
                //Update tooltips
                updateToolTip(chosenXAxis, chosenYAxis, stateAbbrGroup);

                //Change the bold text for the selection
                if (chosenYAxis === "obesity") {
                    obesityLabel
                        .classed("active", true)
                        .classed("inactive", false)
                    smokesLabel
                        .classed("active", false)
                        .classed("inactive", true)
                    healthcareLabel
                        .classed("active", false)
                        .classed("inactive", true)
                }
                else if (chosenYAxis === "smokes") {
                    obesityLabel
                        .classed("active", false)
                        .classed("inactive", true)
                    smokesLabel
                        .classed("active", true)
                        .classed("inactive", false)
                    healthcareLabel
                        .classed("active", false)
                        .classed("inactive", true)
                }
                else {
                    obesityLabel
                        .classed("active", false)
                        .classed("inactive", true)
                    smokesLabel
                        .classed("active", false)
                        .classed("inactive", true)
                    healthcareLabel
                        .classed("active", true)
                        .classed("inactive", false)
                }
            }
        });
}).catch(function(error) {
    console.log(error);
});