test( "Selector, no Context", function () {
	ok( $("div").length, "Elements Found" );
});

test( "Selector, String Context", function () {
	ok( $("div", "#two-divs").length, "Elements Found Within Context" );
});

test( "Selector, HTMLElement Context", function () {
	ok( $("div", document.body).length, "Elements Found Within HTMLElement Context" );
});

test( ".fn.style, Getter", function () {
    var $d, $j;
    $d = $("#style-tests .full");
    $j = jQuery("#style-tests .full");

    var stylesToTest = [
        "width",
        "height",
        "display",
        "border",
        "marginLeft",
        "marginTop",
        "marginBottom"
    ];
    for(var i = 0; i < stylesToTest.length; i++){
        equal($d.css(stylesToTest[i]),$j.css(stylesToTest[i]),"Correct CSS Style found for " + stylesToTest[i]);
    }


});

test( ".fn.style, Getter", function () {
    var $d, $j;
    $d = $("#find-tests");
    $j = jQuery("#find-tests");

    equal($d.find(".gibberish").length,$j.find(".gibberish").length,"Should find none");
    equal($d.find("ul").length,$j.find("ul").length,"Should find two lists");
    equal($d.find(".first").find("li").length,$j.find(".first").find("li").length,"Should find a bunch of list items");
    equal($d.find("ul").find("li").length,$j.find("ul").find("li").length,"Should find a bunch of list items");
});