<div class="modal-header" >
	<h4 class="modal-title"> {{ titleForm }}  </h4>
</div>
<div class="modal-body">
    <form class="row" > 
        <div class="form-group mb-md col-md-8">
    		<div class="form-group mb-md col-md-6">
    			<strong class="mb-xs"> Programación de hoy: <span class="text-info">{{fData.fecha}} </span></strong>
    			<select ng-options="item.id as item.descripcion for item in listaProgramaciones" class="form-control input-sm mt-xs" ng-model="fData.programacion" ng-change="getPaginationProgServerSide();" tabindex="1" focus-me required style="width: 82%;"> </select>
    		</div>
    		<div class="form-group mb-md col-md-3" >
    			<strong class="mb-xs"> Especialidad: </strong>
    			<p class="help-block">{{fSessionCI.especialidad}}</p>
    		</div>
            <div class="form-group mb-md col-md-3" >
                <strong class="mb-xs"> N° Consultas: </strong>
                <p class="help-block">{{fCountTotales.consult_atendidos}} / {{fCountTotales.consult_totales}}</p>
            </div>
            <div class="form-group mb-xs col-md-3" style="margin-left:22%; margin-top: -6px;">
                <button tooltip-placement="bottom" tooltip="Actualizar" title="" type="button" class="btn btn-sm btn-info pull-right" ng-click="getPaginationProgServerSide(); $event.preventDefault();"> <i class="ti ti-reload "></i>  ACTUALIZAR </button>
            </div>
        </div>
        <div class="form-group mb-lg col-md-4" style="text-align: center; border-radius: 25px; border: 1px solid #9da099; padding: 10px; width: 250px; height: auto; margin-top: -8px; line-height: 1;">
            <strong class="mb-xs"> Mis procedimientos para hoy: </strong>
            <div class="form-group mb mt" ng-repeat="item in fCountTotales.count_proc" style="margin-top: -8px;">
                <span class="help-block m-xs" style="float: left;">{{item.descripcion}}</span>
                <span class="help-block m-xs pl-xs pr-xs" style="float: left;">  ...............  </span>
                <span class="m-xs" style="float: right;"><strong >{{item.datos}}</strong></span>
            </div>
            <div class="form-group mt mb" ng-show="fCountTotales.count_proc.length == 0">
                <span class="text-info"> No tienes procedimientos asignados para hoy </span>
            </div>
        </div>
        <div class="form-group col-xs-12 m-n">   
            <div ui-if="gridOptionsProg.data.length>0" 
                ui-grid="gridOptionsProg" ui-grid-resize-columns ui-grid-auto-resize ui-grid-pagination class="grid table-responsive" style="overflow: hidden;" ></div>
        </div>
	</form>
</div>
<div class="modal-footer">
    <button class="btn btn-warning" ng-click="cancel()">Salir</button>
</div>