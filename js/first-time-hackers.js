(function(window) {
    var w = 210,
        h = 210,
        r = 100,
        inner_r = 20,
        color = d3.scale.category20c();     //builtin range of colors

    var data = [{"label":"one", "value":20},
                {"label":"two", "value":50},
                {"label":"three", "value":30}];

    var chart = d3.select("#first-time-hackers .chart")
        .data([data])
        .attr("width", w)
        .attr("height", h)
        .append("svg:g")                //make a group to hold our pie chart
        .attr("transform", "translate(" + r + "," + r + ")")    //move the center of the pie chart from 0, 0 to radius, radius

    var defs = chart.append("defs");
    var filter = defs.append("filter")
        .attr("id", "drop-shadow-2-2")

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
        .attr("dx", 2)
        .attr("dy", 2)
        .attr("result", "offsetBlur");

    // overlay original SourceGraphic over translated blurred opacity by using
    // feMerge filter. Order of specifying inputs is important!
    var feMerge = filter.append("feMerge");

    feMerge.append("feMergeNode")
        .attr("in", "offsetBlur")
    feMerge.append("feMergeNode")
        .attr("in", "SourceGraphic");

    var arc = d3.svg.arc()
        .outerRadius(r)
        .innerRadius(inner_r);

    var pie = d3.layout.pie()
        .value(function(d) { return d.value; });

    var arcs = chart.selectAll("g.slice")
        .data(pie)
        .enter()                            //this will create <g> elements for every "extra" data element that should be associated with a selection. The result is creating a <g> for every object in the data array
        .append("svg:g")                //create a group to hold each slice (we will have a <path> and a <text> element associated with each slice)
        .attr("class", "slice");

    arcs.append("svg:path")
        .style("filter", "url(#drop-shadow-2-2)")
        .attr("fill", function(d, i) { return color(i); } )
        .attr("d", arc);                                    //this creates the actual SVG path using the associated data (pie) with the arc drawing function

    arcs.append("svg:text")                                     //add a label to each slice
        .attr("transform", function(d) {                    //set the label's origin to the center of the arc
            //we have to make sure to set these before calling arc.centroid
            d.innerRadius = 0;
            d.outerRadius = r;
            return "translate(" + arc.centroid(d) + ")";        //this gives us a pair of coordinates like [50, 50]
        })
        .attr("text-anchor", "middle")                          //center the text on it's origin
        .text(function(d, i) { return data[i].label; });        //get the label from our original data array
})(window);
