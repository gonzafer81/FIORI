/*global QUnit*/

jQuery.sap.require("sap.ui.qunit.qunit-css");
jQuery.sap.require("sap.ui.thirdparty.qunit");
jQuery.sap.require("sap.ui.qunit.qunit-junit");
QUnit.config.autostart = false;

sap.ui.require([
	"sap/ui/test/Opa5",
	"ZFER02_FRAGMENTS/ZFER02_FRAGMENTS/test/integration/pages/Common",
	"sap/ui/test/opaQunit",
	"ZFER02_FRAGMENTS/ZFER02_FRAGMENTS/test/integration/pages/App",
	"ZFER02_FRAGMENTS/ZFER02_FRAGMENTS/test/integration/pages/Browser",
	"ZFER02_FRAGMENTS/ZFER02_FRAGMENTS/test/integration/pages/Master",
	"ZFER02_FRAGMENTS/ZFER02_FRAGMENTS/test/integration/pages/Detail",
	"ZFER02_FRAGMENTS/ZFER02_FRAGMENTS/test/integration/pages/NotFound"
], function (Opa5, Common) {
	"use strict";
	Opa5.extendConfig({
		arrangements: new Common(),
		viewNamespace: "ZFER02_FRAGMENTS.ZFER02_FRAGMENTS.view."
	});

	sap.ui.require([
		"ZFER02_FRAGMENTS/ZFER02_FRAGMENTS/test/integration/NavigationJourneyPhone",
		"ZFER02_FRAGMENTS/ZFER02_FRAGMENTS/test/integration/NotFoundJourneyPhone",
		"ZFER02_FRAGMENTS/ZFER02_FRAGMENTS/test/integration/BusyJourneyPhone"
	], function () {
		QUnit.start();
	});
});