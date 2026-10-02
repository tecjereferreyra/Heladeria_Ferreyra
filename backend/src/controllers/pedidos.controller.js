const pedidosService = require("../services/pedidos.service");



// GET /api/pedidos
async function listarPedidos(req, res) {
  const pedidos = await pedidosService.listarPedidos();
  res.json(pedidos);
}


// POST /api/pedidos
async function crearPedido(req, res) {
  const { cliente, tamanio, sabores } = req.body;

  // Las validaciones de FORMA siguen siendo tarea del controlador
  if (!cliente || cliente.trim() === "") {
    return res.status(400).json({ mensaje: "El nombre del cliente es obligatorio." });
  }
  if (!tamanio || tamanio.trim() === "") {
    return res.status(400).json({ mensaje: "Debe elegir un tamaño válido." });
  }
  if (!sabores || !Array.isArray(sabores) || sabores.length === 0) {
    return res.status(400).json({ mensaje: "Debe seleccionar al menos un sabor." });
  }
  

  const idPedido = await pedidosService.crear({
    cliente: cliente.trim(),
    tamanio: tamanio.trim(),
    sabores: sabores.map(sabor => sabor.trim())
  });

  res.status(201).json({ idPedido, mensaje: `Pedido N° ${idPedido} registrado.` });
}

// PUT /api/pedidos/:id/avanzar  (Encargado -> Listo -> Entregado)
async function avanzarPedido(req, res) {
  const idPedido = Number(req.params.id);

  if (Number.isNaN(idPedido)) {
    return res.status(400).json({ mensaje: "El id del pedido debe ser numérico." });
  }

  await pedidosService.avanzar(idPedido);
  res.json({ mensaje: `Pedido N° ${idPedido} avanzó de estado.` });
}

module.exports = { listarPedidos, crearPedido, avanzarPedido };