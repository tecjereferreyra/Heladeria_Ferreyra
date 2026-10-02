
const PRECIOS_TAMANIO = {
    "Cuarto": 9800,
    "Medio": 17800,
    "Kilo": 30500
};

function crearResumenPedido(saboresElegidos, tamanio) {
    const formatoPrecio = new Intl.NumberFormat("es-AR", {
        style: "currency",
        currency: "ARS",
        maximumFractionDigits: 0
    });

    if (saboresElegidos.length === 0) {
        return `<p class="resumen-vacio">Elegí hasta 3 sabores tocando las tarjetas.</p>`;
    }

    const items = saboresElegidos
        .map(s => `<li>${s.Nombre}</li>`)
        .join("");

    return `
        <ul class="lista-resumen">${items}</ul>
        <p class="total-resumen">
            ${tamanio} — <strong>${formatoPrecio.format(PRECIOS_TAMANIO[tamanio])}</strong>
            <span class="aclaracion">(el precio final lo confirma el sistema)</span>
        </p>
    `;
}