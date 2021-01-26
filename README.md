# D3-Challenge
<h3>Data Journalism with D3</h3>
<p>The objective of this activity was to use D3 to plot data from the U.S. Census Bureau from 2014 and explore the relationship between multiple health-related factors: Obesity rate, Smoking rate, percent who lack healthcare, percent in poverty, median age, and median household income.</p>
<p>My app.js does the following:</p>
1. Establishes the SVG parameters (width and height) and the margins to establish the canvas; creates the chartGroup and initial chart parameters.
2. Sets up scale functions for X and Y axes, and functions that render the axes when different data is selected.
3. Set up 2 functions that update the circles and the state labels when different data is selected.
4. Created a function to update the toolTip when different data is selected.
5. Retrieves the data from the csv file and casts into numerical values to pass to the plot
6. Appends circles and state abbreviations based on the selected x and y data
7. Created event listeners for the x and y axes that call the functions created earlier to update the chart as different data is selected for each.
<h5>Key Learnings</h5>
<p>I started with the class activities as my base, mostly the hair metal activity from 16.3. I expanded that code to include the y-axis functionality and to add three options to each axis for the user to select from.</p>
<p>I initially had the toolTip function attached to the circles, but found that because the state abbreviations were on top, the mouseover area was sort of hard to hit. I instead used the state abbreviations for the mouseover which improves the usability of the toolTips.</p>
