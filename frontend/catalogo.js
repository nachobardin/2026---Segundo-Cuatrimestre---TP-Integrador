const contenedor = document.getElementById("productos");

async function cargarProductos() {

    try {
        //Pedimos a la API la lista de productos activos
        const respuesta = await fetch('/api/productos');

        if (!respuesta.ok) {
            throw new Error('Error al obtener los productos');
        }


        const productos = await respuesta.json();

        // Si la lista esta vacia, mostramos un mensaje
        if (productos.length === 0) {
            contenedor.textContent = 'todavia no hay productos disponibles';
            return;
        }

        // Mostramos el nombre y el precio de cada producto en el contenedor
        productos.forEach(function (producto) {
            const renglon = document.createElement('p');
            renglon.textContent = producto.nombre + ' - $' + producto.precio;
            contenedor.appendChild(renglon);
        });

    } catch (error) {
        contenedor.textContent = 'Error al cargar los productos';
    }

}

cargarProductos();