/*
*    main.js
*    Mastering Data Visualization with D3.js
*    Project 1 - Star Break Coffee
*/
var width = 600;
var height = 400;
var updatedCount = 0;
var flag = true;
var t = d3.transition().duration(750);

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
    .text("Month");

var yLabel = g.append("text")
    .attr("class", "y axis-label")
    .attr("x", - (height / 2))
    .attr("y", -60)
    .attr("font-size", "20px")
    .attr("text-anchor", "middle")
    .attr("transform", "rotate(-90)");


var xAxisGroup = g.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0, " + height + ")");
    // .selectAll("text");
    // .attr("y", "10")
    // .attr("x", "-5")
    // .attr("text-anchor", "end")
    // .attr("transform", "rotate(-40)");


var yAxisGroup = g.append("g")
    .attr("class", "y-axis");

var x = d3.scaleBand()
    .range([0, width])
    .paddingInner(0.3)
    .paddingOuter(0.3);

// console.log(x("January"));
// console.log(x("February"));
// console.log(x("March"));
// console.log(x("April"));
// console.log(x("May"));

var y = d3.scaleLinear()
    .range([height, 0]);

d3.json("data/revenues.json").then(function(data) {
    data.forEach(function(d) {
        d.revenue = +d.revenue;
        d.profit = +d.profit;
    });
    console.log(data);

    d3.interval(function() {
        var newData = flag ? data : data.slice(1);
        update(newData);
        flag = !flag;
    }, 1000);

    //Run the vis for the 1st time
    update(data);

}).catch(function(error) {
    console.log(error);
});


function update(data) {

    var value = flag ? "revenue" : "profit";

    var label = flag ? "Revenue" : "Profit";
    yLabel.text(label);

    x.domain(data.map(function(d) {
        return d.month
    }));

    y.domain([0, d3.max(data, function(d) {
        return d[value];
    })]);

    var xAxisCall = d3.axisBottom(x);
    xAxisGroup.transition(t).call(xAxisCall);

    var yAxisCall = d3.axisLeft(y)
        .tickFormat(function(d) {
            return "$" + d;
        });
    yAxisGroup.transition(t).call(yAxisCall);

    // JOIN new data with old elements
    var rectangles = g.selectAll("rect")
        .data(data, function(d) {
            return d.month;
        });

    //EXIT old elements not present in new data.
    rectangles.exit()
        .attr("fill", "red")
        .transition(t)
        .attr("y", y(0))
        .attr("height", 0)
        .remove();

    // UPDATE old elements present in new data
    // The following was being used until we added the "merge(rectangles)" line 147 which allows for code re-use for Entering and Updating
    // rectangles.transition(t)
    //     .attr("x", function(d) {
    //         return x(d.month);
    //     })
    //     .attr("y", function(d) {
    //         return y(d[value]);
    //     })
    //     .attr("width", x.bandwidth)
    //     .attr("height", function(d) {
    //         return height - y(d[value]);
    //     });

    // ENTER new elements present in new data
    rectangles.enter()
        .append("rect")
            .attr("x", function(d) {
                return x(d.month);
            })
            .attr("width", x.bandwidth)
            .attr("fill", "gray")
            .attr("y", y(0))
            .attr("height", 0)
        .merge(rectangles)
        .transition(t)
            .attr("x", function(d) {
            return x(d.month);
            })
            .attr("width", x.bandwidth)
            .attr("y", function(d) {
                return y(d[value]);
            })
            .attr("height", function(d) {
                return height - y(d[value]);
            });


    // rectangles.enter()
    //     .append("rect")
    //     .attr("x", function(d) {
    //         return x(d.month);
    //     })
    //     .attr("y", function(d) {
    //         return y(d[value]);
    //     })
    //     .attr("width", x.bandwidth)
    //     .attr("height", function(d) {
    //         return height - y(d[value]);
    //     })
    //     .attr("fill", "gray");

    if(updatedCount < 2) {
        console.log(rectangles);
    }

    updatedCount++;
}
