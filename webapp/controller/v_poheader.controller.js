sap.ui.define(["sap/ui/core/mvc/Controller"], function(Controller) {
	"use strict";
	return Controller.extend("ZFER01.controller.v_poheader", {
		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf ZFER01.view.v_poheader
		 */
		//	onInit: function() {
		//
		//	},
		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf ZFER01.view.v_poheader
		 */
		//	onBeforeRendering: function() {
		//
		//	},
		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf ZFER01.view.v_poheader
		 */
		//	onAfterRendering: function() {
		//
		//	},
		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf ZFER01.view.v_poheader
		 */
		//	onExit: function() {
		//
		//	}
		/**
		 *@memberOf ZFER01.controller.v_poheader
		 */
		onPress: function(oEvent) {
			//Mensaje para mostrar cual se selecciono
			//alert("Navigating to Details of " + oEvent.getSource().getBindingContext());
			//Se recupera el ID selecconado por el usuario
			var selectedPO = oEvent.getSource().getBindingContext().getProperty("SalesOrderID");
			//Se obtiene el router actual
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			//Indicar al router actual que navegue al router destino enviandole como parametros:
			//el nombre del router destino en string y un objeto enviandole en la propiedad "itemseleccionado" el PO que recuperamos (selectedPO)
			oRouter.navTo("route_poitem", {
				itemseleccionado: selectedPO
			});
		},
		/*
		 *@memberOf ZFER01.controller.v_poheader bla bla bla
		 */
		onButton1Press: function(oEvent) {
			//Se obtiene el PO seleccionado objeto (tag) combobox con id="comboBox"
			var selectedItem = this.getView().byId("comboBox").getSelectedItem();
			if(selectedItem) {
				var selectedPO = selectedItem.getText();
				//debugger;
				if(selectedPO) {
				//Se obtiene una referencia al router
				var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
					oRouter.navTo("route_view3",{itemSelected : selectedPO}); 
				}
			}
			

		
			
		}
	});
});