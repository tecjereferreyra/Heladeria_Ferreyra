
const API_URL = "http://localhost:5500/api";

const grillaSabores = document.querySelector("#grillaSabores");
const selectorTamanio = document.querySelector("#selectorTamanio");
const contenedorResumen = document.querySelector("#resumen");
const formPedido = document.querySelector("#formPedido");
const inputCliente = document.querySelector("#cliente");
const mensajeForm = document.querySelector("#mensajeForm");
const mensajeLista = document.querySelector("#mensajeLista");
const cuerpoPedidos = document.querySelector("#cuerpoPedidos");

const MAX_SABORES = 3;

// ------------------------------------------------------------
// EL ESTADO: la única fuente de verdad de la pantalla
// ------------------------------------------------------------
const estado = {
    sabores: [],          // lo que devolvió GET /api/sabores
    seleccionados: [],    // ids elegidos por el cliente (máx. 3)
    tamanio: "Cuarto"     // radio elegido
};

function mostrarMensaje(elemento, texto, tipo) {
    elemento.textContent = texto;
    elemento.className = `mensaje ${tipo}`;
    setTimeout(() => {
        elemento.textContent = "";
        elemento.className = "mensaje";
    }, 6000);
}

// ------------------------------------------------------------
// RENDER: el estado se vuelca al DOM usando los componentes
// ------------------------------------------------------------
function renderSabores() {
    grillaSabores.innerHTML = estado.sabores
        .map(s => crearTarjetaSabor(s, estado.seleccionados.includes(s.IdSabor)))
        .join("");
}

function renderResumen() {
    // El componente recibe LOS OBJETOS elegidos, no ids
    const elegidos = estado.sabores
        .filter(s => estado.seleccionados.includes(s.IdSabor));

    contenedorResumen.innerHTML = crearResumenPedido(elegidos, estado.tamanio);
}

function renderTodo() {
    renderSabores();
    renderResumen();
}

// ------------------------------------------------------------
// Datos desde la API
// ------------------------------------------------------------
async function cargarSabores() {
    try {
        const respuesta = await fetch(`${API_URL}/sabores`);
        if (!respuesta.ok) {
            throw new Error("Error al obtener sabores");
        }

        estado.sabores = await respuesta.json();
        renderTodo();
    } catch (error) {
        grillaSabores.innerHTML = "No se pudo conectar con la API.";
        console.error(error);
    }
}

async function cargarPedidos() {
    try {
        const respuesta = await fetch(`${API_URL}/pedidos`);
        if (!respuesta.ok) {
            throw new Error("Error al obtener pedidos");
        }

        const pedidos = await respuesta.json();

        cuerpoPedidos.innerHTML = pedidos.length
            ? pedidos.map(crearFilaPedido).join("")
            : '<tr><td colspan="7">No hay pedidos cargados.</td></tr>';
    } catch (error) {
        cuerpoPedidos.innerHTML =
            '<tr><td colspan="7">No se pudo conectar con la API.</td></tr>';
        console.error(error);
    }
}

// ------------------------------------------------------------
// EVENTOS: modifican el estado y re-renderizan
// ------------------------------------------------------------

// Elegir / soltar un sabor (delegación sobre la grilla)
grillaSabores.addEventListener("click", (evento) => {
    const tarjeta = evento.target.closest(".tarjeta-sabor");
    if (!tarjeta || tarjeta.classList.contains("agotada")) {
        return;
    }

    const idSabor = Number(tarjeta.dataset.id);

    if (estado.seleccionados.includes(idSabor)) {
        // Ya estaba: se quita
        estado.seleccionados = estado.seleccionados.filter(id => id !== idSabor);
    } else {
        if (estado.seleccionados.length >= MAX_SABORES) {
            mostrarMensaje(mensajeForm, `Máximo ${MAX_SABORES} sabores por pote.`, "error");
            return;
        }
        estado.seleccionados.push(idSabor);
    }

    renderTodo();   // el estado cambió -> se redibuja TODO lo afectado
});

// Cambio de tamaño
selectorTamanio.addEventListener("change", (evento) => {
    estado.tamanio = evento.target.value;
    renderResumen();
});

// Encargar (POST /api/pedidos)
formPedido.addEventListener("submit", async (evento) => {
    evento.preventDefault();

    if (estado.seleccionados.length === 0) {
        mostrarMensaje(mensajeForm, "Elegí al menos un sabor.", "error");
        return;
    }

    try {
        const respuesta = await fetch(`${API_URL}/pedidos`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                cliente: inputCliente.value,
                tamanio: estado.tamanio,
                sabores: estado.seleccionados
            })
        });

        const datos = await respuesta.json();

        if (!respuesta.ok) {
            mostrarMensaje(mensajeForm, datos.mensaje, "error");
            return;
        }

        mostrarMensaje(mensajeForm, datos.mensaje, "ok");

        // Reiniciar el estado del armado y re-renderizar
        estado.seleccionados = [];
        formPedido.reset();
        renderTodo();
        cargarPedidos();
    } catch (error) {
        mostrarMensaje(mensajeForm, "No se pudo conectar con la API.", "error");
        console.error(error);
    }
});

// Avanzar estado de un pedido (delegación sobre la tabla)
cuerpoPedidos.addEventListener("click", async (evento) => {
    const boton = evento.target.closest("button[data-id]");
    if (!boton) {
        return;
    }

    try {
        const respuesta = await fetch(
            `${API_URL}/pedidos/${boton.dataset.id}/avanzar`,
            { method: "PUT" }
        );

        const datos = await respuesta.json();

        if (!respuesta.ok) {
            mostrarMensaje(mensajeLista, datos.mensaje, "error");
            return;
        }

        mostrarMensaje(mensajeLista, datos.mensaje, "ok");
        cargarPedidos();
    } catch (error) {
        mostrarMensaje(mensajeLista, "No se pudo conectar con la API.", "error");
        console.error(error);
    }
});

// ------------------------------------------------------------
// Inicio
// ------------------------------------------------------------
cargarSabores();
cargarPedidos();