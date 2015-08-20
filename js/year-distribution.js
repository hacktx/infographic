(function(window) {
    var w = 400,
        h = 225,
        r = 100,
        inner_r = 20,
        color = ["#e6550d", "#fd8d3c", "#fdae6b", "#fdd0a2", "#31a354"];
        highlight = ["#f8772f", "#ffaf5e", "#ffcf8d", "#fff2c4", "#53c576"];

    function midAngle(d){
        return d.startAngle + (d.endAngle - d.startAngle)/2;
    }

    var data = [{"label":"Freshmen", "value":17.31},
                {"label":"Sophomores", "value":23.28},
                {"label":"Juniors", "value":25.33},
                {"label":"Seniors", "value":25.78},
                {"label":"Grad Students", "value":8.30}];

    // Setup overall chart div
    var chart = d3.select("#year-distribution .chart")
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

    // End drop shadow filter

    // Chart arc
    var arc = d3.svg.arc()
        .outerRadius(r * 0.8)
        .innerRadius(inner_r * 0.8);

    // Outer labels arc
    var outerArc = d3.svg.arc()
        .innerRadius(r * 0.9)
        .outerRadius(r * 0.9);

    // Create the actual pie chart
    var pie = d3.layout.pie()
        .value(function(d) { return d.value; })
        .sort(null);

    // Create slice groups
    var arcs = chart.selectAll("g.slice")
        .data(pie)
        .enter()  // this will create <g> elements for every "extra" data element that should be associated with a selection. The result is creating a <g> for every object in the data array
        .append("svg:g")  // create a group to hold each slice (we will have a <path> and a <text> element associated with each slice)
        .attr("class", "slice");

    // For each slice, add the actual graphical path with a drop shadow, fill, and mouseover effects
    arcs.append("svg:path")
        .style("filter", "url(#drop-shadow-2-2)")
        .attr("fill", function(d, i) { return color[i]; } )
        .on("mouseover", function(d, i) { 
            d3.select(this).attr("fill", highlight[i]);
            d3.select(this.parentNode).select("text").attr("visibility", "visible");
        })
        .on("mouseout", function(d, i) { 
            d3.select(this).attr("fill", color[i]);
            d3.select(this.parentNode).select("text").attr("visibility", "hidden");
        })
        .attr("d", arc);  // this creates the actual SVG path using the associated data (pie) with the arc drawing function

    // For each slice, add text to show the percentage value outside of the graph.
    arcs.append("svg:text")
        .attr("visibility", "hidden")
        .attr("dy", "2em")
        .attr("transform", function(d) {
            // Move it outside of the pie graph
            var pos = outerArc.centroid(d);
            pos[0] = r * (midAngle(d) < Math.PI ? 1 : -1);
            return "translate("+ pos +")";
        })
        .style("text-anchor", function(d) {
            return midAngle(d) < Math.PI ? "start":"end";
        })
        .attr("fill", "white")
        .text(function(d, i) { return data[i].value + "%"; });

    // For each slice, add text to show the year classification. Make it outside the <g> element
    // since there is already a text element for percentage value.
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

    // For each slice, add a bent line to connect the slice and its text.
    var polylines = chart.selectAll("g.polyline")
        .data(pie)
        .enter()
        .append("polyline")
        .attr("points", function(d) {
            var pos = outerArc.centroid(d);
            pos[0] = r * 0.95 * (midAngle(d) < Math.PI ? 1 : -1);
            return [arc.centroid(d), outerArc.centroid(d), pos];
        });

    function resize() {
        var d = document,
        e = d.documentElement,
        g = d.getElementsByTagName('body')[0],
        page_width = (window.innerWidth || e.clientWidth || g.clientWidth) - 10;

        w = Math.min(page_width - 100, 400);
        h = (w / 2) + 25;
        r = (h - 25) / 2;
        inner_r = r / 5;

        chart.attr("width", w)
            .attr("height", h)
            .attr("transform", "translate(" + r + "," + r + ")");

        d3.select("#year-distribution .chart")
          .attr("width", w + (w < 400 ? r : 0))
          .attr("height", h);
        
        arc.outerRadius(r * 0.8)
            .innerRadius(inner_r * 0.8);

        outerArc.innerRadius(r * 0.9)
            .outerRadius(r * 0.9);

        arcs.selectAll("path").attr("d", arc);
        arcs.selectAll("text").attr("transform", function(d) {
            // Move it outside of the pie graph
            var pos = outerArc.centroid(d);
            pos[0] = r * (midAngle(d) < Math.PI ? 1 : -1);
            return "translate("+ pos +")";
        })

        chart.selectAll("text")
            .attr("transform", function(d) {
                var pos = outerArc.centroid(d);
                pos[0] = r * (midAngle(d) < Math.PI ? 1 : -1);
                return "translate("+ pos +")";
            })

        chart.selectAll("polyline")
            .attr("points", function(d) {
                var pos = outerArc.centroid(d);
                pos[0] = r * 0.95 * (midAngle(d) < Math.PI ? 1 : -1);
                return [arc.centroid(d), outerArc.centroid(d), pos];
            });
    }

    resize();
    d3.select(window).on("resize.yd", resize);

})(window);
