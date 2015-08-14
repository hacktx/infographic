// Monthly Hackathons Bar Chart

(function(window) {
    var height = 420;
    var page_width = 0;
    var year_colors = ["rgb(255,255,255)", "rgb(29,116,176)", "rgb(28,135,2)", "rgb(230,195,0)", "rgb(211,22,18)"];

    var x = d3.scale.ordinal()
        .rangeRoundBands([0, page_width], 0);

    var y = d3.scale.linear()
        .range([height, 0]);

    var chart = d3.select("#monthly-hackathons .chart")
        .attr("width", page_width)
        .attr("height", height);

    var tip = d3.tip()
        .attr('class', 'd3-tip')
        .offset(function(d) { return [height - y(d.value) + 110, 0]; })
        .html(function(d) {
            return "<h1>" + d.value + "</h1><strong>" + d.date + "</strong>";
        });

    chart.call(tip);

    var defs = chart.append("defs");
    var filter = defs.append("filter")
        .attr("id", "drop-shadow")
        .attr("height", "110%");

    // SourceAlpha refers to opacity of graphic that this filter will be applied to
    // convolve that with a Gaussian with standard deviation 3 and store result
    // in blur
    filter.append("feGaussianBlur")
        .attr("in", "SourceAlpha")
        .attr("stdDeviation", 0)
        .attr("result", "blur");

    // translate output of Gaussian blur to the right and downwards with 2px
    // store result in offsetBlur
    filter.append("feOffset")
        .attr("in", "blur")    
        .attr("dx", -5)
        .attr("dy", 0)
        .attr("result", "offsetBlur");

    // overlay original SourceGraphic over translated blurred opacity by using
    // feMerge filter. Order of specifying inputs is important!
    var feMerge = filter.append("feMerge");

    feMerge.append("feMergeNode")
        .attr("in", "offsetBlur")
    feMerge.append("feMergeNode")
        .attr("in", "SourceGraphic");

    function resize() {
        var d = document,
        e = d.documentElement,
        g = d.getElementsByTagName('body')[0],
        page_width = (window.innerWidth || e.clientWidth || g.clientWidth) - 20;

        chart.attr("width", page_width).attr("height", height);
        x.rangeRoundBands([0, page_width], 0);
        y.range([height, 0]);

        var bar = chart.selectAll("g")
            .attr("transform", function(d) { return "translate(" + x(d.date) + ",0)"; });

        bar.selectAll("rect")
           .attr("width", x.rangeBand());
    }

    d3.csv("data/monthly-hackathons.csv", function(error, data) {
        resize();
        x.domain(data.map(function(d) { return d.date; }));
        y.domain([0, d3.max(data, function(d) { return parseInt(d.value); })]);

        var bar = chart.selectAll("g")
            .data(data)
            .enter().append("g")
            .attr("transform", function(d) { return "translate(" + x(d.date) + ",0)"; })
            .on('mouseover', tip.show)
            .on('mouseout', tip.hide);

        bar.append("rect")
        //.attr("y", function(d) { return y(d.value); })
            .attr("height", function(d) { return height - y(d.value); })
            .style("fill", function(d) { return year_colors[parseInt(d.date.substr(d.date.length - 4, d.date.length) - 2011)]; })
            .style("filter", "url(#drop-shadow)")
            .attr("width", x.rangeBand());

        /*
          bar.append("text")
          .attr("x", x.rangeBand() / 2)
          .attr("y", function(d) { return height - y(d.value) - 15; })
          .attr("dy", ".75em")
          .text(function(d) { return d.value; });*/
    });

    d3.select(window).on('resize', resize);
})(window);
/*
  function updateWindow() {
  page_width = w.innerWidth || e.clientWidth || g.clientWidth;
  chart.attr("width", page_width);
  }
*/
