// Monthly Hackathons Bar Chart
var height = 420;

var w = window,
d = document,
e = d.documentElement,
g = d.getElementsByTagName('body')[0],
page_width = (w.innerWidth || e.clientWidth || g.clientWidth) - 20;

var x = d3.scale.ordinal()
    .rangeRoundBands([0, page_width], .1);

var y = d3.scale.linear()
    .range([height, 0]);

var chart = d3.select("#monthly-hackathons .chart")
    .attr("width", page_width)
    .attr("height", height);

d3.csv("data/monthly-hackathons.csv", function(error, data) {
    x.domain(data.map(function(d) { return d.date; }));
    y.domain([0, d3.max(data, function(d) { return parseInt(d.value); })]);

    var bar = chart.selectAll("g")
        .data(data)
        .enter().append("g")
        .attr("transform", function(d) { return "translate(" + x(d.date) + ",0)"; });
    
    bar.append("rect")
        //.attr("y", function(d) { return y(d.value); })
        .attr("height", function(d) { return height - y(d.value); })
        .attr("width", x.rangeBand());
    
/*
    bar.append("text")
        .attr("x", x.rangeBand() / 2)
        .attr("y", function(d) { return height - y(d.value) - 15; })
        .attr("dy", ".75em")
        .text(function(d) { return d.value; });*/
});

function type(d) {
  d.value = +d.value; // coerce to number
  return d;
}

/*
function updateWindow() {
    page_width = w.innerWidth || e.clientWidth || g.clientWidth;
    chart.attr("width", page_width);
}
*/
