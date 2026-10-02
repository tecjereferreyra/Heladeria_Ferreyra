
const CLASE_ESTADO_PEDIDO = {
    "Pendiente": "estado-pendiente",
    "Listo": "estado-listo",
    "Retirado": "estado-retirado"
};

const ACCION_SIGUIENTE_PEDIDO = {
    "Pendiente": "Marcar listo",
    "Listo": "Entregar"
};

function crearBadgeEstado(estado) {
    return `<span class="estado ${CLASE_ESTADO_PEDIDO[estado] || ""}">${estado}</span>`;
}

function crearFilaPedido(pedido) {
    const formatoPrecio = new Intl.NumberFormat("es-AR", {
        style: "currency",
        currency: "ARS",
        maximumFractionDigits: 0
    });

    const accion = ACCION_SIGUIENTE_PEDIDO[pedido.Estado]
        ? `<button class="btn btn-avanzar" data-id="${pedido.IdPedido}">
            ${ACCION_SIGUIENTE_PEDIDO[pedido.Estado]}</button>`
        : "—";

    return `
        <tr>
            <td>${pedido.IdPedido}</td>
            <td>${pedido.Cliente}</td>
            <td>${pedido.Tamanio}</td>
            <td class="celda-sabores">${pedido.Sabores}</td>
            <td>${formatoPrecio.format(pedido.PrecioTotal)}</td>
            <td>${crearBadgeEstado(pedido.Estado)}</td>
            <td>${accion}</td>
        </tr>
    `;
}