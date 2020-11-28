/*global QUnit*/

jQuery.sap.require("sap.ui.qunit.qunit-css");
jQuery.sap.require("sap.ui.thirdparty.qunit");
jQuery.sap.require("sap.ui.qunit.qunit-junit");
QUnit.config.autostart = false;

// We cannot provide stable mock data out of the template.
// If you introduce mock data, by adding .json files in your webapp/localService/mockdata folder you have to provide the following minimum data:
// * At least 3 TaskCollection in the list
// * All 3 TaskCollection have at least one Comments

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
		"ZFER02_FRAGMENTS/ZFER02_FRAGMENTS/test/integration/MasterJourney",
		"ZFER02_FRAGMENTS/ZFER02_FRAGMENTS/test/integration/NavigationJourney",
		"ZFER02_FRAGMENTS/ZFER02_FRAGMENTS/test/integration/NotFoundJourney",
		"ZFER02_FRAGMENTS/ZFER02_FRAGMENTS/test/integration/BusyJourney"
	], function () {
		QUnit.start();
	});
});