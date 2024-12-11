const EstadoPagina = {
    CARGANDO: 'Cargando',    // El estado cuando se están cargando los datos.
    REFRESCANDO: 'Refrescando', // El estado cuando se hace clic en "Refrescar".
    MOSTRANDO: 'Mostrando', // El estado cuando los datos se muestran correctamente.
    EDITANDO: 'Editando', // El estado cuando un detalle está siendo editado.
    BORRANDO: 'Borrando', // El estado cuando se está borrando un registro.
    INICIAL: 'Inicial' // Estado inicial de la página
}; 

let estado = EstadoPagina.INICIAL;  // Estado inicial de la página
 

$(function () {
  

     // Ocultar el contenedor de detalle al cargar la página
     $("#detalle").hide();

      // Agregar la fila de "Cargando"
        if (estado === EstadoPagina.REFRESCANDO || estado === EstadoPagina.CARGANDO) {
            const cargandoRow = `
                <div class="row" id="cargandoRow">
                    <div class="col-md-12">
                        <h4>Cargando, Cargando, Cargando...</h4>
                    </div>
                </div>
            `;
            // Agregar la fila de carga al principio del listado
            $("#listado").prepend(cargandoRow);
        }
 
     // Cargar los registros de inicio al cargar la página
     $.get("https://my-json-server.typicode.com/desarrollo-seguro/dato/solicitudes")
         .done(function (data) {
             estado = EstadoPagina.MOSTRANDO;  // Cambiar el estado a MOSTRANDO
 
             // Si el GET es exitoso, actualiza el listado
             console.log("Datos recibidos:", data);
             $("#listado").empty(); // Limpiamos el listado antes de agregar nuevos registros
 
             // Iteramos sobre los datos y los mostramos en la tabla
             data.forEach(function (registro) {
                 var row = `
                     <div class="row">
                         <div class="col-md-4">
                             <h4>${registro.nombre}</h4>
                         </div>
                         <div class="col-md-4">
                             <h4>${registro.apellido}</h4>
                         </div>
                         <div class="col-md-4">
                             <button type="button" class="btn btn-default btn-lg" data-id="${registro.id}" id="botonBorrar">Borrar</button>
                         </div>
                     </div>
                 `;
                 $("#listado").append(row);
             });
         })
         .fail(function () {
             console.error("Error al obtener datos del botón refrescar");
         });
 
     // Evento del botón 1: REFRESCAR
     $("#botonRefrescar").on("click", function () {
         estado = EstadoPagina.REFRESCANDO; // Cambiar el estado a REFRESCANDO
         console.log("Estado actual:", estado);
 
         $.get("https://my-json-server.typicode.com/desarrollo-seguro/dato/solicitudes")
             .done(function (data) {
                 estado = EstadoPagina.MOSTRANDO; // Cambiar el estado a MOSTRANDO
                 console.log("Datos recibidos:", data);
                 $("#listado").empty(); // Limpiamos el listado antes de agregar nuevos registros
 
                 // Iteramos sobre los datos y los mostramos en la tabla
                 data.forEach(function (registro) {
                     var row = `
                         <div class="row">
                             <div class="col-md-4">
                                 <h4>${registro.nombre}</h4>
                             </div>
                             <div class="col-md-4">
                                 <h4>${registro.apellido}</h4>
                             </div>
                             <div class="col-md-4">
                                 <button type="button" class="btn btn-default btn-lg" data-id="${registro.id}" id="botonBorrar">Borrar</button>
                             </div>
                         </div>
                     `;
                     $("#listado").append(row);
                 });
             })
             .fail(function () {
                 estado = EstadoPagina.INICIAL; // Volver al estado inicial si la petición falla
                 console.error("Error al obtener datos del botón refrescar");
             });
     });
 
     // Evento para el botón NUEVO (para crear un nuevo registro o ir a una vista de edición)
     $("#botonNuevo").on("click", function () {
         estado = EstadoPagina.EDITANDO; // Cambiar el estado a EDITANDO
         console.log("Estado actual:", estado);
 
         // Mostrar el formulario de detalle
         $("#detalle").show();
     });
 
     // Evento para el botón BORRAR (cuando se elimina un registro)
     $("#listado").on("click", "#botonBorrar", function () {
         estado = EstadoPagina.BORRANDO; // Cambiar el estado a BORRANDO
         console.log("Estado actual:", estado);
 
         // Borrar el registro (suponiendo que llamamos a un endpoint de eliminación)
         const id = $(this).data("id");
         $.ajax({
             url: `https://my-json-server.typicode.com/desarrollo-seguro/dato/solicitudes/${id}`,
             type: 'DELETE',
             success: function () {
                 console.log(`Registro ${id} borrado`);
                 estado = EstadoPagina.MOSTRANDO; // Cambiar al estado MOSTRANDO después de eliminar
                 // Actualizar la lista después de borrar
                 $("#botonRefrescar").click(); // Simulamos hacer clic en "Refrescar"
             }
         });
     });
 });