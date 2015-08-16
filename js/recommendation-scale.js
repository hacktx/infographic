// Monthly Hackathons Bar Chart

(function(window) {
    var width = $("#recommendation-scale").innerWidth() - 10;
    var height = 300;
    var year_colors = ["rgb(255,255,255)", "rgb(29,116,176)", "rgb(28,135,2)", "rgb(230,195,0)", "rgb(211,22,18)"];
    var highlights = ["rgb(255,255,255)", "rgb(69, 156, 216)", "rgb(68, 175, 42)", "rgb(255, 235,40)", "rgb(251,62,58)"];

    var data = [{"label": 5, "value": 79.88},
                {"label": 4, "value": 17.16},
                {"label": 3, "value": 0.59},
                {"label": 2, "value": 2.37}];

    var x = d3.scale.linear()
        .range([0, width]);

    var y = d3.scale.ordinal()
        .rangeRoundBands([height, 0]);

    var chart = d3.select("#recommendation-scale .chart")
        .data([data])
        .attr("width", width)
        .attr("height", height);

    // Create drop shadow filter
    var defs = chart.append("defs");
    var filter = defs.append("filter")
        .attr("id", "drop-shadow-vert")
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
        .attr("dx", 0)
        .attr("dy", -5)
        .attr("result", "offsetBlur");

    // overlay original SourceGraphic over translated blurred opacity by using
    // feMerge filter. Order of specifying inputs is important!
    var feMerge = filter.append("feMerge");

    feMerge.append("feMergeNode")
        .attr("in", "offsetBlur")
    feMerge.append("feMergeNode")
        .attr("in", "SourceGraphic");

    // End drop shadow filter

    function resize() {
        var width = $("#recommendation-scale").innerWidth() - 10;
        chart.attr("width", width).attr("height", height);
        x.range([0, width]);
        y.rangeRoundBands([height, 0], 0.2);

        var bar = chart.selectAll("g")
            .attr("transform", function(d) { return "translate(0," + y(d.label) + ")"; });

        bar.selectAll("rect")
            .attr("height", y.rangeBand());
    }

    function get_color(d) {
        return year_colors[parseInt(d.label) - 2]
    }

    function get_highlight(d) {
        return highlights[parseInt(d.label) - 2]
    }

    x.domain([0, d3.max(data, function(d) { return d.value; })]);
    y.domain(data.map(function(d) {  return d.label; }));

    resize();
    var bar = chart.selectAll("g")
        .data(data)
        .enter().append("g")
        .attr("transform", function(d) { return "translate(0," + y(d.label) + ")"; })
        .on('mouseover', function(d) { d3.select(this).select("rect").style("fill", get_highlight(d)) })
        .on('mouseout', function(d) { d3.select(this).select("rect").style("fill", get_color(d)) })

    bar.append("rect")
        .attr("width", function(d) { return x(d.value); })
        .style("fill", function(d) { return get_color(d); })
        .style("filter", "url(#drop-shadow-vert)")
        .attr("height", y.rangeBand());

    d3.select(window).on('resize.rs', resize);
})(window);
