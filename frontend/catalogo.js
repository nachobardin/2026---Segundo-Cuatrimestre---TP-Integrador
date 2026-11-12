const listaProductos = document.getElementById('lista-productos');
const anterior = document.getElementById('pagina-anterior');
const siguiente = document.getElementById('pagina-siguiente');
const estadoPagina = document.getElementById('estado-pagina');

let paginaActual = 1;
let totalPaginas = 0;

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