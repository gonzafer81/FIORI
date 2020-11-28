/*global QUnit*/

sap.ui.define([
	"ZFER02_FRAGMENTS/ZFER02_FRAGMENTS/model/GroupSortState",
	"sap/ui/model/json/JSONModel"
], function (GroupSortState, JSONModel) {
	"use strict";

	QUnit.module("GroupSortState - grouping and sorting", {
		beforeEach: function () {
			this.oModel = new JSONModel({});
			// System under test
			this.oGroupSortState = new GroupSortState(this.oModel, function() {});
		}
	});

	QUnit.test("Should always return a sorter when sorting", function (assert) {
		// Act + Assert
		assert.strictEqual(this.oGroupSortState.sort("PriorityNumber").length, 1, "The sorting by PriorityNumber returned a sorter");
		assert.strictEqual(this.oGroupSortState.sort("TaskTitle").length, 1, "The sorting by TaskTitle returned a sorter");
	});

	QUnit.test("Should return a grouper when grouping", function (assert) {
		// Act + Assert
		assert.strictEqual(this.oGroupSortState.group("PriorityNumber").length, 1, "The group by PriorityNumber returned a sorter");
		assert.strictEqual(this.oGroupSortState.group("None").length, 0, "The sorting by None returned no sorter");
	});


	QUnit.test("Should set the sorting to PriorityNumber if the user groupes by PriorityNumber", function (assert) {
		// Act + Assert
		this.oGroupSortState.group("PriorityNumber");
		assert.strictEqual(this.oModel.getProperty("/sortBy"), "PriorityNumber", "The sorting is the same as the grouping");
	});

	QUnit.test("Should set the grouping to None if the user sorts by TaskTitle and there was a grouping before", function (assert) {
		// Arrange
		this.oModel.setProperty("/groupBy", "PriorityNumber");

		this.oGroupSortState.sort("TaskTitle");

		// Assert
		assert.strictEqual(this.oModel.getProperty("/groupBy"), "None", "The grouping got reset");
	});
});