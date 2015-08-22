$('hr').waypoint(function( direction ) {
    if (direction == "down") {
        $(this.element).css("width", "100%");
    } else if (direction == "up") {
        $(this.element).css("width", "0%");
    }
}, {
    triggerOnce: false,
    offset: 'bottom-in-view'
});

$('.fadein').waypoint(function( direction ) {
    if (direction == "down") {
        $(this.element).css("opacity", "1");
    } else if (direction == "up") {
        $(this.element).css("opacity", "0");
    }
}, {
    triggerOnce: false,
    offset: 'bottom-in-view'
});

$('.fadein-once').waypoint(function( direction ) {
    if (direction == "down") {
        $(this.element).css("opacity", "1");
    }
}, {
    triggerOnce: true,
    offset: 'bottom-in-view'
});
