test( "Selector, no Context", function () {
	ok( $("div").length, "Elements Found" );
});

test( "Selector, String Context", function () {
	ok( $("div", "#two-divs").length, "Elements Found Within Context" );
});

test( "Selector, HTMLElement Context", function () {
	ok( $("div", document.body).length, "Elements Found Within HTMLElement Context" );
});