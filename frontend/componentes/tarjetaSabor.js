
function crearTarjetaSabor(sabor, estaSeleccionado) {
    const clases = [
        "tarjeta-sabor",
        estaSeleccionado ? "seleccionada" : "",
        sabor.Disponible ? "" : "agotada"
    ].join(" ").trim();

    return `
        <article class="${clases}" data-id="${sabor.IdSabor}">
            <span class="nombre-sabor">${sabor.Nombre}</span>
            ${sabor.Disponible
                ? `<span class="tilde">${estaSeleccionado ? "✓" : ""}</span>`
                : '<span class="cartel-agotado">AGOTADO</span>'
            }
        </article>
    `;
}