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

cargarPagina(1);