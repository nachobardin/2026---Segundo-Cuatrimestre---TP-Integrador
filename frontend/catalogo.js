const listaProductos = document.getElementById('lista-productos');
const anterior = document.getElementById('pagina-anterior');
const siguiente = document.getElementById('pagina-siguiente');
const estadoPagina = document.getElementById('estado-pagina');

let paginaActual = 1;
let totalPaginas = 0;

const carrito = [];
const listaCarrito = document.getElementById('lista-carrito');
const carritoVacio = document.getElementById('carrito-vacio');
const totalCarrito = document.getElementById('total-carrito');

function agregarAlCarrito(producto) {
    const item = carrito.find(function(item) {
        return item.id === producto.id;
    });

    //si el prodcucto ya esta en el carrito, sumamos una unidad a la cantidad, sino lo agregamos al carrito
    if (item) {
        item.cantidad++;
    } else {
        carrito.push({
            id: producto.id,
            nombre: producto.nombre,
            precio: producto.precio,
            cantidad: 1
        });
    }
    mostrarCarrito();
}

function quitarDelCarrito(id) {
    const indice = carrito.findIndex(function(item) {
        return item.id === id;
    });
    
    if (indice === -1) return;

    carrito[indice].cantidad--;

    if (carrito[indice].cantidad === 0) {
        carrito.splice(indice, 1);
    }

    mostrarCarrito();
}

function mostrarCarrito() {
    listaCarrito.textContent = '';
    carritoVacio.hidden = carrito.length > 0;
    let total = 0;

    carrito.forEach(function(item) {
        const subtotal = item.precio * item.cantidad;
        total += subtotal;

        const fila = document.createElement('li');
        fila.textContent = item.nombre + ' x ' + item.cantidad + ' - $' + subtotal.toFixed(2) + ' ';

        const sumar = document.createElement('button');
        sumar.type = 'button';
        sumar.textContent = '+';
        sumar.addEventListener('click', function() {
            agregarAlCarrito(item);
        });

        const restar = document.createElement('button');
        restar.type = 'button';
        restar.textContent = '-';
        restar.addEventListener('click', function() {
            quitarDelCarrito(item.id);
        });

        fila.append(sumar, restar);
        listaCarrito.appendChild(fila);
    });

    totalCarrito.textContent = total.toFixed(2);
}

async function cargarPagina(pagina) {
    // Frenamos los botones mientras esperamos la respuesta.
    anterior.disabled = true;
    siguiente.disabled = true;

    try {
        const respuesta = await fetch('/api/productos?pagina=' + pagina);

        if (!respuesta.ok) {
            throw new Error('No se pudo cargar la página.');
        }

        const datos = await respuesta.json();
        paginaActual = datos.pagina;
        totalPaginas = datos.totalPaginas;

        // Reemplazamos la lista con los productos de la página pedida.
        listaProductos.textContent = '';

        datos.productos.forEach(function (producto) {
            const item = document.createElement('li');
            item.textContent = producto.nombre + ' - $' + producto.precio;

            const boton = document.createElement('button');
            boton.type = 'button';
            boton.textContent = 'Agregar al carrito';
            boton.addEventListener('click', function () {
                agregarAlCarrito(producto);
            });

            item.appendChild(boton);
            listaProductos.appendChild(item);
        });

        estadoPagina.textContent = totalPaginas === 0
            ? 'No hay productos disponibles.'
            : 'Página ' + paginaActual + ' de ' + totalPaginas;
    } catch (error) {
        estadoPagina.textContent = 'No se pudo cargar el catálogo.';
    } finally {
        anterior.disabled = paginaActual <= 1;
        siguiente.disabled = paginaActual >= totalPaginas;
    }
}

anterior.addEventListener('click', function () {
    cargarPagina(paginaActual - 1);
});

siguiente.addEventListener('click', function () {
    cargarPagina(paginaActual + 1);
});



const formRevisarPedido = document.getElementById('form-revisar-pedido');
const nombreCliente = document.getElementById('nombre-cliente');
const avisoPedido = document.getElementById('aviso-pedido');
const resumenPedido = document.getElementById('resumen-pedido');
const clienteResumen = document.getElementById('cliente-resumen');
const productoResumen = document.getElementById('productos-resumen');
const totalResumen = document.getElementById('total-resumen');

formRevisarPedido.addEventListener('submit', function(evento){
    evento.preventDefault();

    const nombre = nombreCliente.value.trim();
    avisoPedido.textContent = '';

    if(!nombre){
        avisoPedido.textContent = 'Ingresa tu nombre: ';
        nombreCliente.focus();
        return;

    }


    if(carrito.length === 0){
        avisoPedido.textContent = 'Agrega al menos un producto al carrito';
        return;

    }


    //Armo el resumen con las cantidades que hay en el carrito en ese momento.
    clienteResumen.textContent = 'Cliente: ' + nombre;
    productoResumen.textContent = '';



    carrito.forEach(function(item){
        const fila = document.createElement('li');
        fila.textContent = item.nombre + ' x ' + item.cantidad;
        productoResumen.appendChild(fila);
    });


    totalResumen.textContent = totalCarrito.textContent;
    resumenPedido.showModal();


});

const confirmarCompra = document.getElementById('confirmar-compra');
const avisoCompra = document.getElementById('aviso-compra');
const enlaceTicket = document.getElementById('descargar-ticket');

resumenPedido.addEventListener('close', function () {
    avisoCompra.textContent = '';
});

confirmarCompra.addEventListener('click', async function () {
    confirmarCompra.disabled = true;
    avisoCompra.textContent = 'Guardando compra…';

    try {
        const respuesta = await fetch('/api/ventas', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                nombreCliente: nombreCliente.value.trim(),
                productos: carrito.map(function (item) {
                    return { id: item.id, cantidad: item.cantidad };
                })
            })
        });

        const datos = await respuesta.json();

        if (!respuesta.ok) {

            avisoCompra.textContent = datos.error;
            return;
        }

        enlaceTicket.href = '/api/ventas/' + datos.id + '/ticket';
        enlaceTicket.hidden = false;

        //limpiamos el pedido solamente cuando el servidor confirma que lo guardo correctamente
        carrito.length = 0;
        mostrarCarrito();
        nombreCliente.value = '';
        resumenPedido.close();

        avisoPedido.textContent = 'Compra #' + datos.id + ' registrada. Total: $' +
            (datos.totalCentavos / 100).toFixed(2);
    } catch (error) {
        avisoCompra.textContent = 'No se pudo confirmar la compra.';
    } finally {
        confirmarCompra.disabled = false;
    }
});



cargarPagina(1);