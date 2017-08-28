angular.module('theme.consultasalidasAlmacen', ['theme.core.services'])
  .controller('consultasalidasAlmacenController', ['$scope', '$sce', '$modal', '$interval' ,'$bootbox', '$window', '$http', '$theme', '$log', '$timeout', 'uiGridConstants', 'pinesNotifications', 'hotkeys','consultasalidasAlmacenServices', 'reactivoInsumoServices' , 'salidaAlmacenServices' ,
    function($scope, $sce, $modal, $interval ,$bootbox, $window, $http, $theme, $log, $timeout, uiGridConstants, pinesNotifications
      , hotkeys , consultasalidasAlmacenServices , reactivoInsumoServices , salidaAlmacenServices 
      ){
    'use strict';
    var paginationOptions = {
      pageNumber: 1,
      firstRow: 0,
      pageSize: 10,
      sort: uiGridConstants.DESC,
      sortName: null,
      search: null
    };
    $scope.mySelectionGrid = [];
    $scope.btnToggleFiltering = function(){
      $scope.gridOptions.enableFiltering = !$scope.gridOptions.enableFiltering;
      $scope.gridApi.core.notifyDataChange( uiGridConstants.dataChange.COLUMN );
    };
    $scope.navegateToCell = function( rowIndex, colIndex ) {
      $scope.gridApi.cellNav.scrollToFocus( $scope.gridOptions.data[rowIndex], $scope.gridOptions.columnDefs[colIndex]);
    };
    $scope.gridOptions = {
      paginationPageSizes: [10, 50, 100, 500, 1000],
      paginationPageSize: 10,
      useExternalPagination: true,
      useExternalSorting: true,
      useExternalFiltering : true,
      enableGridMenu: true,
      enableRowSelection: true,
      enableSelectAll: true,
      enableFiltering: false,
      enableFullRowSelection: true,
      multiSelect: true,
      columnDefs: [
        { field: 'id', name: 'idkardex', displayName: 'ID' , visible: false },
        { field: 'fecha', name: 'fecha', displayName: 'Fecha', maxWidth: 180, enableFiltering: false, sort: { direction: uiGridConstants.DESC} },
        { field: 'empleado', name: 'empleado', displayName: 'Empleado', minWidth: 180,  sort: { direction: uiGridConstants.DESC} },
        { field: 'doc_referencia', name: 'doc_referencia', displayName: 'Num.Documento' , maxWidth: 120, },
        { field: 'descripcion_mm', name: 'descripcion_mm', displayName: 'Tipo Salida' ,maxWidth: 120, enableFiltering: false },
        { field: 'estado_k', type: 'object', name: 'estado_k', displayName: 'Estado', maxWidth: 250, enableFiltering: false ,
          cellTemplate:'<label style="box-shadow: 1px 1px 0 black; margin: 6px auto; display: block; width: 120px;" class="label {{ COL_FIELD.clase }} ">{{ COL_FIELD.string }}</label>' }
      ],
      onRegisterApi: function(gridApi) {
        $scope.gridApi = gridApi;
        gridApi.selection.on.rowSelectionChanged($scope,function(row){
          $scope.mySelectionGrid = gridApi.selection.getSelectedRows();
        });
        gridApi.selection.on.rowSelectionChangedBatch($scope,function(rows){
          $scope.mySelectionGrid = gridApi.selection.getSelectedRows();
        });

        $scope.gridApi.core.on.sortChanged($scope, function(grid, sortColumns) {
          //console.log(sortColumns);
          if (sortColumns.length == 0) {
            paginationOptions.sort = null;
            paginationOptions.sortName = null;
          } else {
            paginationOptions.sort = sortColumns[0].sort.direction;
            paginationOptions.sortName = sortColumns[0].name;
          }
          $scope.getPaginationServerSide();
        });
        gridApi.pagination.on.paginationChanged($scope, function (newPage, pageSize) {
          paginationOptions.pageNumber = newPage;
          paginationOptions.pageSize = pageSize;
          paginationOptions.firstRow = (paginationOptions.pageNumber - 1) * paginationOptions.pageSize;
          $scope.getPaginationServerSide();
        });
        $scope.gridApi.core.on.filterChanged( $scope, function(grid, searchColumns) {
            var grid = this.grid;
            paginationOptions.search = true;
            // console.log(grid.columns);
            // console.log(grid.columns[1].filters[0].term);
            paginationOptions.searchColumn = {
              //'fecha' : grid.columns[1].filters[0].term,
              "e.nombres || ' ' || e.apellido_paterno || ' ' || e.apellido_materno" :  grid.columns[3].filters[0].term ,
              //'empleado' : grid.columns[3].filters[0].term,
              'doc_referencia' : grid.columns[4].filters[0].term
              
            }
            $scope.getPaginationServerSide();
          });

      }
    };
    paginationOptions.sortName = $scope.gridOptions.columnDefs[0].name;
    $scope.getPaginationServerSide = function() {
      $scope.datosGrid = {
        paginate : paginationOptions
      };
      consultasalidasAlmacenServices.sListarsalidasAlmacen($scope.datosGrid).then(function (rpta) {
        console.log(rpta);
        $scope.gridOptions.totalItems = rpta.paginate.totalRows;
        $scope.gridOptions.data = rpta.datos;
      });
      $scope.mySelectionGrid = [];
    };
    $scope.getPaginationServerSide();
    $scope.ActualizaRiVencidos = function(){
      reactivoInsumoServices.sTotalRiVencidos().then(function (rpta) {
        $scope.fDataVencidos = rpta.paginate.totalRows;
      });
    }
    $scope.ActualizaRiVencidos();
    reactivoInsumoServices.sTotalRiStockMinimo().then(function (rpta) {
      $scope.fDataStockMinimo = rpta.paginate.totalRows;
    });
    $scope.VerRiStockMinimo = function (fVenta,size) { 
      $modal.open({
        templateUrl: angular.patchURLCI+'reactivoInsumo/ver_popup_ri_stock_minimo',
        size: size || 'lg',
        scope: $scope,
        controller: function ($scope, $modalInstance) { 
          $scope.titleForm = 'Reactivos Insumos en Stock Minimo';
          $scope.fVenta = fVenta;
          var paginationOptionsRiStockMinimo = {
            pageNumber: 1,
            firstRow: 0,
            pageSize: 10,
            sort: uiGridConstants.ASC,
            sortName: null,
            search: null
          };
          $scope.mySelectionRiVencidosGrid = [];
          $scope.btnToggleFiltering = function(){
            $scope.gridOptionsRiStockMinimo.enableFiltering = !$scope.gridOptionsRiStockMinimo.enableFiltering;
            $scope.gridApi.core.notifyDataChange( uiGridConstants.dataChange.COLUMN );
          };
          $scope.gridOptionsRiStockMinimo = {
            minRowsToShow: 6,
            paginationPageSizes: [10, 50, 100, 500, 1000],
            paginationPageSize: 10,
            useExternalPagination: true,
            useExternalSorting: true,
            enableGridMenu: false,
            enableRowSelection: true,
            enableSelectAll: false,
            enableFullRowSelection: true,
            multiSelect: false,
            columnDefs: [ 
              { field: 'id', name: 'idreactivoinsumo', displayName: 'ID', width: '14%' },
              { field: 'descripcion', name: 'descripcion', displayName: 'Reactivo Insumo', width: '36%' },
              { field: 'stock', name: 'stock', displayName: 'Stock', width: '10%' },
              { field: 'stock_minimo', name: 'stock_minimo', displayName: 'Stock Minimo', width: '17%' },
              { field: 'estado_ri', type: 'object', name: 'estado_ri', displayName: 'Estado', maxWidth: 250,
          cellTemplate:'<label style="box-shadow: 1px 1px 0 black; margin: 6px auto; display: block; width: 120px;" class="label {{ COL_FIELD.clase }} ">{{ COL_FIELD.string }}</label>' }
            ],
            onRegisterApi: function(gridApi) { // gridComboOptions
              $scope.gridApi = gridApi;
              gridApi.selection.on.rowSelectionChanged($scope,function(row){
                $scope.mySelectionRiStockMinimoGrid = gridApi.selection.getSelectedRows();
              });

              $scope.gridApi.core.on.sortChanged($scope, function(grid, sortColumns) {
                if (sortColumns.length == 0) {
                  paginationOptionsRiStockMinimo.sort = null;
                  paginationOptionsRiStockMinimo.sortName = null;
                } else {
                  paginationOptionsRiStockMinimo.sort = sortColumns[0].sort.direction;
                  paginationOptionsRiStockMinimo.sortName = sortColumns[0].name;
                }
                $scope.getPaginationRiStockMinimoServerSide();
              });
              gridApi.pagination.on.paginationChanged($scope, function (newPage, pageSize) {
                paginationOptionsRiStockMinimo.pageNumber = newPage;
                paginationOptionsRiStockMinimo.pageSize = pageSize;
                paginationOptionsRiStockMinimo.firstRow = (paginationOptionsRiStockMinimo.pageNumber - 1) * paginationOptionsRiStockMinimo.pageSize;
                $scope.getPaginationRiStockMinimoServerSide();
              });
            }
          };
          paginationOptionsRiStockMinimo.sortName = $scope.gridOptionsRiStockMinimo.columnDefs[0].name;
          $scope.getPaginationRiStockMinimoServerSide = function() {
            $scope.datosGrid = {
              paginate: paginationOptionsRiStockMinimo,
            };
            reactivoInsumoServices.sListarRiStockMinimo($scope.datosGrid).then(function (rpta) {
              $scope.gridOptionsRiStockMinimo.totalItems = rpta.paginate.totalRows;
              $scope.gridOptionsRiStockMinimo.data = rpta.datos;
              //$scope.$parent.blockUI.stop();
            });
            $scope.mySelectionRiStockMinimoGrid = [];
          };
          $scope.getPaginationRiStockMinimoServerSide();

          $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
          }
        }
      });
    }

    $scope.VerRiVencidos = function (fVenta,size) { 
      $modal.open({
        templateUrl: angular.patchURLCI+'reactivoInsumo/ver_popup_ri_vencidos',
        size: size || 'lg',
        scope: $scope,
        controller: function ($scope, $modalInstance) { 
          $scope.titleForm = 'Reactivos Insumos Vencidos';
          $scope.fVenta = fVenta;
          var paginationOptionsRiVencidos = {
            pageNumber: 1,
            firstRow: 0,
            pageSize: 10,
            sort: uiGridConstants.ASC,
            sortName: null,
            search: null
          };
          $scope.mySelectionRiVencidosGrid = [];
          $scope.btnToggleFiltering = function(){
            $scope.gridOptionsRiVencidos.enableFiltering = !$scope.gridOptionsRiVencidos.enableFiltering;
            $scope.gridApi.core.notifyDataChange( uiGridConstants.dataChange.COLUMN );
          };
          $scope.gridOptionsRiVencidos = {
            minRowsToShow: 6,
            paginationPageSizes: [10, 50, 100, 500, 1000],
            paginationPageSize: 10,
            useExternalPagination: true,
            useExternalSorting: true,
            enableGridMenu: false,
            enableRowSelection: true,
            enableSelectAll: false,
            enableFullRowSelection: true,
            multiSelect: false,
            columnDefs: [ 
              { field: 'id', name: 'iddetallekardex', displayName: 'ID', width: '14%' , visible:false},
              { field: 'fecha', name: 'fecha', displayName: 'Fecha Compra', width: '16%' },
              { field: 'descripcion', name: 'descripcion', displayName: 'Reactivo Insumo', width: '36%' },
              { field: 'cantidad', name: 'cantidad', displayName: 'Cantidad', width: '10%' },
              { field: 'fechavencimiento', name: 'fechavencimiento', displayName: 'Fecha Vencimiento', width: '17%' },
              { field: 'estado_k', type: 'object', name: 'estado_k', displayName: 'Estado', maxWidth: 250,
          cellTemplate:'<label style="box-shadow: 1px 1px 0 black; margin: 6px auto; display: block; width: 120px;" class="label {{ COL_FIELD.clase }} ">{{ COL_FIELD.string }}</label>' }
            ],
            onRegisterApi: function(gridApi) { // gridComboOptions
              $scope.gridApi = gridApi;
              gridApi.selection.on.rowSelectionChanged($scope,function(row){
                $scope.mySelectionRiVencidosGrid = gridApi.selection.getSelectedRows();
              });

              $scope.gridApi.core.on.sortChanged($scope, function(grid, sortColumns) {
                if (sortColumns.length == 0) {
                  paginationOptionsRiVencidos.sort = null;
                  paginationOptionsRiVencidos.sortName = null;
                } else {
                  paginationOptionsRiVencidos.sort = sortColumns[0].sort.direction;
                  paginationOptionsRiVencidos.sortName = sortColumns[0].name;
                }
                $scope.getPaginationRiVencidosServerSide();
              });
              gridApi.pagination.on.paginationChanged($scope, function (newPage, pageSize) {
                paginationOptionsRiVencidos.pageNumber = newPage;
                paginationOptionsRiVencidos.pageSize = pageSize;
                paginationOptionsRiVencidos.firstRow = (paginationOptionsRivencidos.pageNumber - 1) * paginationOptionsRiVencidos.pageSize;
                $scope.getPaginationRiVencidosServerSide();
              });
            }
          };
          paginationOptionsRiVencidos.sortName = $scope.gridOptionsRiVencidos.columnDefs[0].name;
          $scope.getPaginationRiVencidosServerSide = function() {
            $scope.datosGrid = {
              paginate: paginationOptionsRiVencidos,
            };
            reactivoInsumoServices.sListarRiVencidos($scope.datosGrid).then(function (rpta) {
              $scope.gridOptionsRiVencidos.totalItems = rpta.paginate.totalRows;
              $scope.gridOptionsRiVencidos.data = rpta.datos;
            });
            $scope.mySelectionRiVencidosGrid = [];
          };
          $scope.getPaginationRiVencidosServerSide();

          $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
          }
          $scope.btnQuitarDeLaLista = function (row,mensaje) { 
            var pMensaje = mensaje || '¿Realmente desea realizar la acción?';
            $bootbox.confirm(pMensaje, function(result) {
              if(result){
                reactivoInsumoServices.sTratamientoRiVencido(row.entity).then(function (rpta) {
                  if(rpta.flag == 1){
                    pTitle = 'OK!';
                    pType = 'success';
                    $scope.getPaginationRiVencidosServerSide();
                    $scope.ActualizaRiVencidos();
                    //$route.reload();
                  }else if(rpta.flag == 0){
                    var pTitle = 'Error!';
                    var pType = 'danger';
                  }else{
                    alert('Error inesperado');
                  }
                  pinesNotifications.notify({ title: pTitle, text: rpta.message, type: pType, delay: 1000 });
                });
              }
            });
          }
        }
      });
    }

    $scope.VerDetalleSalida = function (fVenta,size) { 
      $modal.open({
        templateUrl: angular.patchURLCI+'consultasalidasAlmacen/ver_popup_detalle_salida',
        size: size || 'xlg',
        scope: $scope,
        controller: function ($scope, $modalInstance) { 
          $scope.titleForm = 'Detalle del Salida';
          $scope.fVenta = fVenta;
          var paginationOptionsDetalleSalida = {
            pageNumber: 1,
            firstRow: 0,
            pageSize: 10,
            sort: uiGridConstants.ASC,
            sortName: null,
            search: null
          };
          $scope.mySelectionDetalleSalidaGrid = [];
          $scope.btnToggleFiltering = function(){
            $scope.gridOptionsDetalleSalida.enableFiltering = !$scope.gridOptionsDetalleSalida.enableFiltering;
            $scope.gridApi.core.notifyDataChange( uiGridConstants.dataChange.COLUMN );
          };
          $scope.gridOptionsDetalleSalida = {
            minRowsToShow: 6,
            paginationPageSizes: [10, 50, 100, 500, 1000],
            paginationPageSize: 10,
            useExternalPagination: true,
            useExternalSorting: true,
            enableGridMenu: false,
            enableRowSelection: true,
            enableSelectAll: false,
            enableFullRowSelection: true,
            multiSelect: false,
            columnDefs: [ 
              { field: 'id', name: 'iddetallekardex', displayName: 'ID', width: '14%' , visible:false},
              { field: 'idreactivoinsumo', name: 'idreactivoinsumo', displayName: 'ID', width: '14%' },
              { field: 'descripcion', name: 'descripcion', displayName: 'Reactivo Insumo', width: '16%' },
              { field: 'cantidad', name: 'cantidad', displayName: 'Cantidad', width: '20%' },
              { field: 'unidad', name: 'unidad', displayName: 'Unidad', width: '20%' },
              { field: 'estado_k', type: 'object', name: 'estado_k', displayName: 'Estado', maxWidth: 250,
          cellTemplate:'<label style="box-shadow: 1px 1px 0 black; margin: 6px auto; display: block; width: 120px;" class="label {{ COL_FIELD.clase }} ">{{ COL_FIELD.string }}</label>' }
            ],
            onRegisterApi: function(gridApi) { // gridComboOptions
              $scope.gridApi = gridApi;
              gridApi.selection.on.rowSelectionChanged($scope,function(row){
                $scope.mySelectionDetalleSalidaGrid = gridApi.selection.getSelectedRows();
              });

              $scope.gridApi.core.on.sortChanged($scope, function(grid, sortColumns) {
                if (sortColumns.length == 0) {
                  paginationOptionsDetalleSalida.sort = null;
                  paginationOptionsDetalleSalida.sortName = null;
                } else {
                  paginationOptionsDetalleSalida.sort = sortColumns[0].sort.direction;
                  paginationOptionsDetalleSalida.sortName = sortColumns[0].name;
                }
                $scope.getPaginationDetalleSalidaServerSide();
              });
              gridApi.pagination.on.paginationChanged($scope, function (newPage, pageSize) {
                paginationOptionsDetalleSalida.pageNumber = newPage;
                paginationOptionsDetalleSalida.pageSize = pageSize;
                paginationOptionsDetalleSalida.firstRow = (paginationOptionsDetalleSalida.pageNumber - 1) * paginationOptionsDetalleSalida.pageSize;
                $scope.getPaginationDetalleSalidaServerSide();
              });
            }
          };
          paginationOptionsDetalleSalida.sortName = $scope.gridOptionsDetalleSalida.columnDefs[0].name;
          $scope.getPaginationDetalleSalidaServerSide = function() {
            //$scope.$parent.blockUI.start();
            $scope.datosGrid = {
              paginate: paginationOptionsDetalleSalida,
              datos: $scope.mySelectionGrid[0].id
            };
            console.log($scope.datosGrid);
            consultasalidasAlmacenServices.sListarDetalleSalida($scope.datosGrid).then(function (rpta) {
              $scope.gridOptionsDetalleSalida.totalItems = rpta.paginate.totalRows;
              $scope.gridOptionsDetalleSalida.data = rpta.datos;
              //$scope.$parent.blockUI.stop();
            });
            $scope.mySelectionDetalleSalidaGrid = [];
          };
          $scope.getPaginationDetalleSalidaServerSide();

          $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
          }
        }
      });
    }
    /* ============= */
    /* MANTENIMIENTO */
    /* ============= */
    $scope.btnAnular = function (mensaje) { 
      var pMensaje = mensaje || '¿Realmente desea realizar la acción?';
      $bootbox.confirm(pMensaje, function(result) {
        if(result){
          consultasalidasAlmacenServices.sAnularsalidaAlmacen($scope.mySelectionGrid[0].id).then(function (rpta) {
            if(rpta.flag == 1){
                pTitle = 'OK!';
                pType = 'success';
                $scope.getPaginationServerSide();
              }else if(rpta.flag == 0){
                var pTitle = 'Error!';
                var pType = 'error';
              }else{
                alert('Error inesperado');
              }
              pinesNotifications.notify({ title: pTitle, text: rpta.message, type: pType, delay: 1000 });
          });
        }
      });
    }

    // $scope.reloadGrid = function () { // console.log('click med');
    //   $interval(function() { 
    //       $scope.gridApi.core.handleWindowResize();
    //   }, 50, 5);
    // }
    // $scope.reloadGrid(); 


  }])
  .service("consultasalidasAlmacenServices",function($http, $q) {
    return({
        sListarsalidasAlmacen,
        sListarDetalleSalida ,
        sAnularsalidaAlmacen ,
        sAnularDetallesalidaAlmacen
    });

    function sListarsalidasAlmacen(datos) {
      var request = $http({
            method : "post",
            url : angular.patchURLCI+"consultasalidasAlmacen/lista_salidas_almacen",
            data : datos
      });
      return (request.then( handleSuccess,handleError ));
    }
    function sListarDetalleSalida(datos) {
      var request = $http({
            method : "post",
            url : angular.patchURLCI+"consultasalidasAlmacen/lista_detalle_salidas_almacen",
            data : datos
      });
      return (request.then( handleSuccess,handleError ));
    }
    function sAnularsalidaAlmacen(datos) {
      var request = $http({
            method : "post",
            url : angular.patchURLCI+"consultasalidasAlmacen/anular_salidas_almacen",
            data : datos
      });
      return (request.then( handleSuccess,handleError ));
    }
    function sAnularDetallesalidaAlmacen(datos) {
      var request = $http({
            method : "post",
            url : angular.patchURLCI+"consultasalidasAlmacen/anular_detalle_salidas_almacen",
            data : datos
      });
      return (request.then( handleSuccess,handleError ));
    }


});