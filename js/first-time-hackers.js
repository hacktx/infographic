(function(window) {
    var w = 400,
        h = 210,
        r = 100,
        inner_r = 20,
        color = d3.scale.category20c(),     //builtin range of colors
        highlight = ["#53a4df", "#8dd0f8", "#afdbf2", "#d7ecff", "#f8772f"];

    function midAngle(d){
        return d.startAngle + (d.endAngle - d.startAngle)/2;
    }

    var data = [{"label":"Freshmen", "value":22.15},
                {"label":"Sophomores", "value":24.92},
                {"label":"Juniors", "value":22.46},
                {"label":"Seniors", "value":21.38},
                {"label":"Grad Students", "value":9.08}];

    var chart = d3.select("#first-time-hackers .chart")
        .data([data])
        .attr("width", w)
        .attr("height", h)
        .append("svg:g")                //make a group to hold our pie chart
        .attr("transform", "translate(" + r + "," + r + ")")    //move the center of the pie chart from 0, 0 to radius, radius

    // Generate drop shadow filter

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
        .outerRadius(r * 0.8)
        .innerRadius(inner_r * 0.8);

    var outerArc = d3.svg.arc()
        .innerRadius(r * 0.9)
        .outerRadius(r * 0.9);

    var pie = d3.layout.pie()
        .value(function(d) { return d.value; })
        .sort(null);

    var arcs = chart.selectAll("g.slice")
        .data(pie)
        .enter()                            //this will create <g> elements for every "extra" data element that should be associated with a selection. The result is creating a <g> for every object in the data array
        .append("svg:g")                //create a group to hold each slice (we will have a <path> and a <text> element associated with each slice)
        .attr("class", "slice");

    arcs.append("svg:path")
        .style("filter", "url(#drop-shadow-2-2)")
        .attr("fill", function(d, i) { return color(i); } )
        .on("mouseover", function(d, i) { d3.select(this).attr("fill", highlight[i]) })
        .on("mouseout", function(d, i) { d3.select(this).attr("fill", color(i)) })
        .attr("d", arc);                                    //this creates the actual SVG path using the associated data (pie) with the arc drawing function

    /*
    arcs.append("svg:text")                                     //add a label to each slice
        .attr("transform", function(d) {                    //set the label's origin to the center of the arc
            //we have to make sure to set these before calling arc.centroid
            d.innerRadius = 0;
            d.outerRadius = r;
            return "translate(" + arc.centroid(d) + ")";        //this gives us a pair of coordinates like [50, 50]
        })
        .attr("text-anchor", "middle")                          //center the text on it's origin
        .text(function(d, i) { return data[i].label; });        //get the label from our original data array
    */

    var class_labels = chart.selectAll("g.text")
        .data(pie)
        .enter()
        .append("text")
        .attr("dy", ".35em")
        .text(function(d) { return d.data.label; })
        .attr("transform", function(d) {
            var pos = outerArc.centroid(d);
            pos[0] = r * (midAngle(d) < Math.PI ? 1 : -1);
            return "translate("+ pos +")";
        })
        .style("text-anchor", function(d) {
            return midAngle(d) < Math.PI ? "start":"end";
        });

    var polylines = chart.selectAll("g.polyline")
        .data(pie)
        .enter()
        .append("polyline")
        .attr("points", function(d) {
            var pos = outerArc.centroid(d);
            pos[0] = r * 0.95 * (midAngle(d) < Math.PI ? 1 : -1);
            return [arc.centroid(d), outerArc.centroid(d), pos];
        });

})(window);
