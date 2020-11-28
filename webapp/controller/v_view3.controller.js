sap.ui.define(["sap/ui/core/mvc/Controller","sap/ui/core/routing/History"], function(Controller,History) {
	//"use strict";
	return Controller.extend("ZFER01.controller.v_view3", {
		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf ZFER01.view.v_view3
		 */
		onInit: function() {
			// Obtengo una referencia al router
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			// Validate/Match the Router Details sent from source using oRouter.navTo("router_poitem", {itemseleccionado: selectedPO});
			oRouter.getRoute("route_view3").attachMatched(this._onRouteFound, this); //oRouter.attachBeforeMatched(this.reset, this);
		},
		// Custom Method to bind the elements using the Event Arguments
		_onRouteFound: function(oEvt) {
				//this.byId("idProductsTable").getBinding("items").refresh();
				//this.getView().byId("idProductsTable").getModel().refresh(true);
				var oview = this.getView();
				// Se limpia el contexto por si ya se ejecuto anteriormente
				oview.unbindContext();
				// Obtengo los parametros recibidos en la funcion (oEvt)
				var oArgument = oEvt.getParameter("arguments");
				// Obtengo una referencia a la tabla
				//var oTable = this.getView().byId("idProductsTable");
				//debugger;
				var mypath = "/SalesOrderSet('" + oArgument.itemSelected + "')";
				oview.bindElement({
					path: mypath
				}); //Se hace un update por si se cambio el PO
				//oview.updateBindingContext();
			}
			/**
			 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
			 * (NOT before the first rendering! onInit() is used for that one!).
			 * @memberOf ZFER01.view.v_view3
			 */
			//	onBeforeRendering: function() {
			//
			//	},
			/**
			 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
			 * This hook is the same one that SAPUI5 controls get after being rendered.
			 * @memberOf ZFER01.view.v_view3
			 */
			//	onAfterRendering: function() {
			//
			//	},
			/**
			 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
			 * @memberOf ZFER01.view.v_view3
			 */
			//	onExit: function() {
			//
			//	}
			,
		/*
		 *@memberOf ZFER01.controller.v_view3
		 */
		view3Back: function(oEvent) {
			
			var oHistory = History.getInstance();
			var sPreviousHash = oHistory.getPreviousHash();
			if(sPreviousHash){
				window.history.go(-1);
			} else {
				var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
				oRouter.navTo("route_poheader",{});	
			}
			
			//Rutear al rout header
			//var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			//oRouter.navTo("route_poheader",{});
		}
		
		
		
	});
});