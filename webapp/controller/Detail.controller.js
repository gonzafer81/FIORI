/*global location */
sap.ui.define([
	"ZFER02_FRAGMENTS/ZFER02_FRAGMENTS/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"ZFER02_FRAGMENTS/ZFER02_FRAGMENTS/model/formatter",
	"sap/ui/model/Filter",
	"sap/m/MessageToast",
	"sap/ui/core/Fragment",
	"sap/ui/model/FilterOperator"
], function(BaseController, JSONModel, formatter, Filter, MessageToast, Fragment, FilterOperator ) {
	"use strict";
	return BaseController.extend("ZFER02_FRAGMENTS.ZFER02_FRAGMENTS.controller.Detail", {
		formatter: formatter,  
		/* =========================================================== */
		/* lifecycle methods                                           */
		/* =========================================================== */
		onInit: function() {
			// Model used to manipulate control states. The chosen values make sure,
			// detail page is busy indication immediately so there is no break in
			// between the busy indication for loading the view's meta data
			var oViewModel = new JSONModel({
				busy: false,
				delay: 0,
				lineItemListTitle: this.getResourceBundle().getText("detailLineItemTableHeading")
			});
			this.getRouter().getRoute("object").attachPatternMatched(this._onObjectMatched, this);
			this.setModel(oViewModel, "detailView");
			this.getOwnerComponent().getModel().metadataLoaded().then(this._onMetadataLoaded.bind(this));
		},
		/* =========================================================== */
		/* event handlers                                              */
		/* =========================================================== */
		/**
		 * Event handler when the share by E-Mail button has been clicked
		 * @public
		 */
		onShareEmailPress: function() {
			var oViewModel = this.getModel("detailView");
			sap.m.URLHelper.triggerEmail(null, oViewModel.getProperty("/shareSendEmailSubject"), oViewModel.getProperty(
				"/shareSendEmailMessage"));
		},
		/**
		 * Updates the item count within the line item table's header
		 * @param {object} oEvent an event containing the total number of items in the list
		 * @private
		 */
		onListUpdateFinished: function(oEvent) {
			var sTitle, iTotalItems = oEvent.getParameter("total"),
				oViewModel = this.getModel("detailView");
			// only update the counter if the length is final
			if (this.byId("lineItemsList").getBinding("items").isLengthFinal()) {
				if (iTotalItems) {
					sTitle = this.getResourceBundle().getText("detailLineItemTableHeadingCount", [iTotalItems]);
				} else {
					//Display 'Line Items' instead of 'Line items (0)'
					sTitle = this.getResourceBundle().getText("detailLineItemTableHeading");
				}
				oViewModel.setProperty("/lineItemListTitle", sTitle);
			}
		},
		/* =========================================================== */
		/* begin: internal methods                                     */
		/* =========================================================== */
		/**
		 * Binds the view to the object path and expands the aggregated line items.
		 * @function
		 * @param {sap.ui.base.Event} oEvent pattern match event in route 'object'
		 * @private
		 */
		_onObjectMatched: function(oEvent) {
			var sObjectId = oEvent.getParameter("arguments").objectId;
			this.getModel().metadataLoaded().then(function() {
				var sObjectPath = this.getModel().createKey("TaskCollection", {
					InstanceID: sObjectId
				});
				this._bindView("/" + sObjectPath);
			}.bind(this));
		},
		/**
		 * Binds the view to the object path. Makes sure that detail view displays
		 * a busy indicator while data for the corresponding element binding is loaded.
		 * @function
		 * @param {string} sObjectPath path to the object to be bound to the view.
		 * @private
		 */
		_bindView: function(sObjectPath) {
			// Set busy indicator during view binding
			var oViewModel = this.getModel("detailView");
			// If the view was not bound yet its not busy, only if the binding requests data it is set to busy again
			oViewModel.setProperty("/busy", false);
			this.getView().bindElement({
				path: sObjectPath,
				events: {
					change: this._onBindingChange.bind(this),
					dataRequested: function() {
						oViewModel.setProperty("/busy", true);
					},
					dataReceived: function() {
						oViewModel.setProperty("/busy", false);
					}
				}
			});
		},
		_onBindingChange: function() {
			var oView = this.getView(),
				oElementBinding = oView.getElementBinding();
			// No data for the binding
			if (!oElementBinding.getBoundContext()) {
				this.getRouter().getTargets().display("detailObjectNotFound");
				// if object could not be found, the selection in the master list
				// does not make sense anymore.
				this.getOwnerComponent().oListSelector.clearMasterListSelection();
				return;
			}
			var sPath = oElementBinding.getPath(),
				oResourceBundle = this.getResourceBundle(),
				oObject = oView.getModel().getObject(sPath),
				sObjectId = oObject.InstanceID,
				sObjectName = oObject.TaskTitle,
				oViewModel = this.getModel("detailView");
			this.getOwnerComponent().oListSelector.selectAListItem(sPath);
			oViewModel.setProperty("/shareSendEmailSubject", oResourceBundle.getText("shareSendEmailObjectSubject", [sObjectId]));
			oViewModel.setProperty("/shareSendEmailMessage", oResourceBundle.getText("shareSendEmailObjectMessage", [
				sObjectName,
				sObjectId,
				location.href
			]));
		},
		_onMetadataLoaded: function() {
			// Store original busy indicator delay for the detail view
			var iOriginalViewBusyDelay = this.getView().getBusyIndicatorDelay(),
				oViewModel = this.getModel("detailView"),
				oLineItemTable = this.byId("lineItemsList"),
				iOriginalLineItemTableBusyDelay = oLineItemTable.getBusyIndicatorDelay();
			// Make sure busy indicator is displayed immediately when
			// detail view is displayed for the first time
			oViewModel.setProperty("/delay", 0);
			oViewModel.setProperty("/lineItemTableDelay", 0);
			oLineItemTable.attachEventOnce("updateFinished", function() {
				// Restore original busy indicator delay for line item table
				oViewModel.setProperty("/lineItemTableDelay", iOriginalLineItemTableBusyDelay);
			});
			// Binding the view will set it to not busy - so the view is always busy if it is not bound
			oViewModel.setProperty("/busy", true);
			// Restore original busy indicator delay for the detail view
			oViewModel.setProperty("/delay", iOriginalViewBusyDelay);
		},
		
		
		/*
		onPressItem: function(oEvt) {
			//debugger;
			if (!this._oDialog) {
				//Si viene vacio lo instanciamos
				this._oDialog = sap.ui.xmlfragment("ZFER02_FRAGMENTS.ZFER02_FRAGMENTS.view.UserInfoDialog", this);
				//Se pone la ruta al fragmento xml
				this.getView().addDependent(this._oDialog);
				this._oDialog.addStyleClass(this.getOwnerComponent().getContentDensityClass());
				this._oDialog.getBinding("items").filter([]);
				
				// Remember selections if required
				var bRemember = oEvt.getSource().data("remember");
				this._oDialog.setRememberSelections(bRemember);
				//add Clear button if needed
				//var bShowClearButton = oEvt.getSource().data("showClearButton");
				//this._oDialog.setShowClearButton(bShowClearButton);
				
				this._oDialog.open();
			} else {
				this._oDialog.open();
				this._oDialog.getBinding("items").filter([]);

				// Remember selections if required
				var bRemember2 = oEvt.getSource().data("remember");
				this._oUserInfoDialog.setRememberSelections(bRemember2);
				//add Clear button if needed
				//var bShowClearButton2 = oEvt.getSource().data("showClearButton");
				//this._oUserInfoDialog.setShowClearButton(bShowClearButton2);


			}
		},
		handleSearch: function(oEvt) {
			//Se obtiene el valor ingresado en la barra de busqueda
			//debugger;
			var sValue = oEvt.getParameter("value");
			//Se crea un filtro
			if(sValue) {
				var oFilter = new Filter("DisplayName", FilterOperator.Contains, sValue);
				var oBinding = oEvt.getParameter("itemsBinding");
				//Limpio cualquier filtro anterior
				oBinding.filter([]);
				//Aplico el filtro
				oBinding.filter([oFilter]);
			}
		},
		handleClose: function(oEvt) {
			
			
		}
		/**
		 *@memberOf ZFER02_FRAGMENTS.ZFER02_FRAGMENTS.controller.Detail
		 */
		 
		 onPressItem: function (oEvent) {
			var oButton = oEvent.getSource();

			if (!this._oDialog) {
				this._oDialog = sap.ui.xmlfragment("ZFER02_FRAGMENTS.ZFER02_FRAGMENTS.view.UserInfoDialog", this);
				//Se pone la ruta al fragmento xml
				this.getView().addDependent(this._oDialog);
				this._oDialog.addStyleClass(this.getOwnerComponent().getContentDensityClass());
				this._configDialog(oButton);
				this._oDialog.open();
			} else {
				this._configDialog(oButton);
				this._oDialog.open();
			}
		},

		_configDialog: function (oButton) {
			// Multi-select if required
			var bMultiSelect = !!oButton.data("multi");
			this._oDialog.setMultiSelect(bMultiSelect);

			//var sCustomConfirmButtonText = oButton.data("confirmButtonText");
			//this._oDialog.setConfirmButtonText(sCustomConfirmButtonText);

			// Remember selections if required
			var bRemember = !!oButton.data("remember");
			this._oDialog.setRememberSelections(bRemember);

			//add Clear button if needed
			//var bShowClearButton = !!oButton.data("showClearButton");
			//this._oDialog.setShowClearButton(bShowClearButton);

			// Set growing property
			//var bGrowing = oButton.data("growing");
			//this._oDialog.setGrowing(bGrowing === "true");

			// Set growing threshold
			var sGrowingThreshold = oButton.data("threshold");
			if (sGrowingThreshold) {
	      	 //this._oDialog.setGrowingThreshold(parseInt(sGrowingThreshold));
			}

			// Set draggable property
			//var bDraggable = !!oButton.data("draggable");
			//this._oDialog.setDraggable(bDraggable);

			// Set draggable property
			//var bResizable = !!oButton.data("resizable");
			//this._oDialog.setResizable(bResizable);

			// Set style classes
			var sResponsiveStyleClasses = "sapUiResponsivePadding--header sapUiResponsivePadding--subHeader sapUiResponsivePadding--content sapUiResponsivePadding--footer";
			var bResponsivePadding = !!oButton.data("responsivePadding");
			this._oDialog.toggleStyleClass(sResponsiveStyleClasses, bResponsivePadding);

			// clear the old search filter
			this._oDialog.getBinding("items").filter([]);

			// toggle compact style
		//	syncStyleClass("sapUiSizeCompact", this.getView(), this._oDialog);
		},
		
		handleSearch: function (oEvent) {
			var sValue = oEvent.getParameter("value");
			var oFilter = new Filter("DisplayName", FilterOperator.Contains, sValue);
			var oBinding = oEvent.getParameter("itemsBinding");
			oBinding.filter([oFilter]);

		}
	});
});