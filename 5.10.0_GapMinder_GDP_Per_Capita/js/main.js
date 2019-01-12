/*
*    main.js
*    Mastering Data Visualization with D3.js
*    Project 2 - Gapminder Clone
*/

var width = 600;
var height = 400;

var svg = d3.select("#chart-area")
    .append("svg")
    .attr("width", width + 110)
    .attr("height", height + 250);

var g = svg.append("g")
    .attr("transform", "translate(100,10)");

g.append("text")
    .attr("class", "x axis-label")
    .attr("x", width / 2)
    .attr("y", height + 50)
    .attr("font-size", "20px")
    .attr("text-anchor", "middle")
    .text("GDP Per Capita ($)");

g.append("text")
    .attr("class", "y axis-label")
    .attr("x", - (height / 2))
    .attr("y", -60)
    .attr("font-size", "20px")
    .attr("text-anchor", "middle")
    .attr("transform", "rotate(-90)")
	.text("Life Expectancy (Years)");

var xAxisGroup  = g.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0, " + height + ")");

var x = d3.scaleLog()
    .range([0, width])
	.domain([300, 150000]);

var xAxisCall = d3.axisBottom(x)
	.tickValues([400,1000, 2000,4000,20000,40000])
	.tickFormat(function(d) {
            return d;
        });

xAxisGroup.call(xAxisCall);

var yAxisGroup = g.append("g")
    .attr("class", "y-axis");

var y = d3.scaleLinear()
    .range([height, 0])
	.domain([0, 90]);

var yAxisCall = d3.axisLeft(y);
yAxisGroup.call(yAxisCall);


d3.json("data/data.json").then(function(data){
	data.forEach(function(d) {
		d.year = +d.year;
    });
    console.log(data);

    const formattedData = data.map(function(year){
        return year["countries"].filter(function(country){
            var dataExists = (country.income && country.life_exp);
            return dataExists
        }).map(function(country){
            country.income = +country.income;
            country.life_exp = +country.life_exp;
            return country;
        })
    });

    console.log(formattedData);

    var circles = g.selectAll("circle")
        .data(formattedData[0]);

    circles.enter()
        .append("circle")
            .attr("cx", function(d) {
                return x(d.income);
            })
            .attr("fill", "gray")
            .attr("cy", function(d) {
                return y(d.life_exp);
            })
            .attr("r", 2);

}).catch(function(error) {
    console.log(error);
});
