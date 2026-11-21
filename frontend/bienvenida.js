const formulario = document.getElementById('form-bienvenida');
const nombreCliente = document.getElementById('nombre-cliente');
const aviso = document.getElementById('aviso-bienvenida');

formulario.addEventListener('submit', function (evento) {
    evento.preventDefault();

    const nombre = nombreCliente.value.trim();

    if (!nombre) {
        aviso.textContent = 'Ingresá tu nombre para comenzar.';
        nombreCliente.focus();
        return;
    }

    // guardamos el nombre para usarlo en las otras pantallas
    sessionStorage.setItem('nombreCliente', nombre);

    window.location.href = '/tienda/productos.html';
});