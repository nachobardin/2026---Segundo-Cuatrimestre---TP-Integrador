const botonTema = document.getElementById('cambiar-tema');

// volvemos al tema que se eligio anteriormente
const temaGuardado = localStorage.getItem('tema');

if (temaGuardado === 'oscuro') {
    document.body.classList.add('tema-oscuro');
}

function actualizarBotonTema() {
    const oscuro = document.body.classList.contains('tema-oscuro');

    botonTema.textContent = oscuro
        ? 'Activar modo claro'
        : 'Activar modo oscuro';

    botonTema.setAttribute('aria-pressed', String(oscuro));
}

botonTema.addEventListener('click', function () {
    document.body.classList.toggle('tema-oscuro');

    const oscuro = document.body.classList.contains('tema-oscuro');

    // guardamos el tema elegidop para cuando se cambia la pagina
    localStorage.setItem('tema', oscuro ? 'oscuro' : 'claro');

    actualizarBotonTema();
});

actualizarBotonTema();