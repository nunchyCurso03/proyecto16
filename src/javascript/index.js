const EstadoPagina = {
    CARGANDO: 'Cargando',
    REFRESCANDO: 'Refrescando',
    MOSTRANDO: 'Mostrando',
    EDITANDO: 'Editando',
    BORRANDO: 'Borrando',
    INICIAL: 'Inicial',
};

let estado = EstadoPagina.INICIAL; // Estado inicial

// Ocultar el contenedor de detalle al cargar la página
$("#detalle").hide();


$(function () {
    function mostrarCargando() {
        // Limpiar el contenedor de listado
        $("#listado").empty();

        // Crear y agregar el mensaje de "Cargando..."
        const cargandoRow = `
            <div class="row" id="cargandoRow">
                <div class="col-md-4">
                    <h4>Cargando...</h4>
                </div>
                <div class="col-md-4">
                    <h4>Cargando...</h4>
                </div>
                <div class="col-md-4">
                    <h4>Cargando...</h4>
                </div>
            </div>
        `;
        $("#listado").append(cargandoRow);
    }

    function ocultarCargando() {
        // Eliminar el mensaje de "Cargando..."
        $("#cargandoRow").remove();
    }

    function cargarListado(data) {
        $("#listado").empty(); // Limpia el contenedor

        // Itera sobre los datos y genera las filas dinámicamente
        data.forEach(function (registro) {
            const row = `
                <div class="row" data-id="${registro.id}" data-nombre="${registro.nombre}" data-apellido="${registro.apellido}">
                    <div class="col-md-4">
                        <h4>${registro.nombre}</h4>
                    </div>
                    <div class="col-md-4">
                        <h4>${registro.apellido}</h4>
                    </div>
                    <div class="col-md-4">
                         <button type="button" class="btn btn-default btn-lg botonBorrar" data-id="${registro.id}">Borrar</button>
                    </div>
                </div>
            `;
            $("#listado").append(row);
        });
    }

    // Función para cargar datos desde el servidor
    function obtenerDatos() {
        estado = EstadoPagina.CARGANDO;
        console.log("Estado actual:", estado);

        // Mostrar el mensaje de cargando
        mostrarCargando();

        $.get("https://my-json-server.typicode.com/desarrollo-seguro/dato/solicitudes")
            .done(function (data) {
                estado = EstadoPagina.MOSTRANDO;
                console.log("Datos recibidos:", data);

                // Ocultar el mensaje de cargando
                ocultarCargando();

                // Cargar los datos en el listado
                cargarListado(data);
            })
            .fail(function () {
                estado = EstadoPagina.INICIAL;
                console.error("Error al obtener datos.");
                ocultarCargando(); // Asegurarse de ocultar el mensaje si ocurre un error
                alert("No se pudo obtener los datos. Inténtalo de nuevo.");
            });
    }

    // Cargar registros al inicio
    obtenerDatos();

    // Botón REFRESCAR
    $("#botonRefrescar").on("click", function () {
        estado = EstadoPagina.REFRESCANDO;
        console.log("Estado actual:", estado);
        $("#detalle").hide();
        // Mostrar el mensaje de cargando
        mostrarCargando();
        obtenerDatos();
    });

    // Botón NUEVO
    $("#botonNuevo").on("click", function () {
        estado = EstadoPagina.EDITANDO;
        console.log("Estado actual:", estado);
        $("#nombre").val("");
        $("#apellido").val("")
        $("#detalle").show(); // Mostrar el formulario de detalle
    });

    // Evento para el botón BORRAR
    $("#listado").on("click", ".botonBorrar", function (e) {
        e.stopPropagation();
        estado = EstadoPagina.BORRANDO;
        console.log("Estado actual:", estado);

        $("#detalle").hide(); 
        mostrarCargando();
        console.log("Estado actual:", estado);



        const id = $(this).data("id");
        $.ajax({
            url: `https://my-json-server.typicode.com/desarrollo-seguro/dato/solicitudes/${id}`,
            type: 'DELETE',
            success: function () {
                console.log(`Registro ${id} borrado.`);
                estado = EstadoPagina.MOSTRANDO;
                obtenerDatos(); // Refrescar listado
            },
            error: function () {
                console.error(`Error al intentar borrar el registro ${id}`);
                estado = EstadoPagina.MOSTRANDO; // Volvemos al estado mostrando aunque haya error
            },
        });
    });

    //  Seleccionar un registro para editar
    $("#listado").on("click", ".row[data-nombre][data-apellido][data-id]", function () {
        estado = EstadoPagina.EDITANDO;

        const nombre = $(this).data("nombre");
        const apellido = $(this).data("apellido");
        const id = $(this).data("id");
        $("#registroSeleccionado").data("id", id);

        // Rellenar los campos del formulario con los datos seleccionados
        $("#nombre").val(nombre);
        $("#apellido").val(apellido);

        // Mostrar el contenedor de detalle
        $("#detalle").show();
    });

    // Evento botón GUARDAR  
    $("#botonGuardar").on("click", function (e) {
        e.preventDefault();

        const id = $("#registroSeleccionado").data("id");
        const nombre = $("#nombre").val();
        const apellido = $("#apellido").val();

        const datos = {
            nombre: nombre,
            apellido: apellido
        };
        if (id === undefined) {
            // Si el ID no está definido es una nueva operación POST
            $.ajax({
                url: "https://my-json-server.typicode.com/desarrollo-seguro/dato/solicitudes",
                method: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(datos),
                success: function (response) {
                    console.log("Registro creado exitosamente:", response);
                    alert("Guardado con éxito");
                    estado = EstadoPagina.MOSTRANDO;
                    $("#detalle").hide(); // Ocultar el detalle
                    obtenerDatos(); // Refrescar listado
                },
                error: function (error) {
                    console.error("Error al guardar datos:", error);
                    alert("Error al guardar los datos.");
                }
            });
        } else {
            // Si el ID está definido, es una operación PUT para editar el registro existente
            $.ajax({
                url: `https://my-json-server.typicode.com/desarrollo-seguro/dato/solicitudes/${id}`,
                method: 'PUT',
                contentType: 'application/json',
                data: JSON.stringify(datos),
                success: function (datos) {
                    console.log("Datos guardados exitosamente:", datos);
                    estado = EstadoPagina.MOSTRANDO;
                    alert("Guardado con éxito");
                    $("#detalle").hide(); // Ocultar el detalle
                    obtenerDatos(); // Refrescar listado
                },
                error: function (error) {
                    console.error("Error al guardar datos:", error);
                    alert("Error al guardar los datos.");
                }
            });
        }

    });

    // Evento para el botón CANCELAR
    $("#botonCancelar").on("click", function (e) {
        e.preventDefault();
        estado = EstadoPagina.INICIAL;

        // Ocultar el contenedor de detalle y limpiar el formulario
        $("#detalle").hide();
        $("#nombre").val("");
        $("#apellido").val("");
    });


});

