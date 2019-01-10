/*
*    main.js
*    Mastering Data Visualization with D3.js
*    2.5 - Activity: Adding SVGs to the screen
*/

console.log('testing');

var svg = d3.select("#chart-area").append("svg")
  .attr("width", 400)
  .attr("height", 400);

var circle = svg.append("circle")
  .attr("cx", 200)
  .attr("cy", 200)
  .attr("r", 100)
  .attr("fill", "red");
