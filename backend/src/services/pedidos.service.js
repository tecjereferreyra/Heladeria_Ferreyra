const { sql, getConnection } = require("../config/db");

async function listarPedidos() {
  const pool = await getConnection();
  const resultado = await pool.request().execute("usp_ListarPedidos");
  return resultado.recordset;
}


async function crear({ cliente, tamanio, sabores }) {
  const pool = await getConnection();
  const fechaActual = new Date();

  const resultado = await pool.request()
    .input("Cliente", sql.NVarChar(80), cliente)
    .input("Tamanio", sql.NVarChar(10), tamanio)
    .input("Sabores", sql.NVarChar(50), sabores.join(", "))
    .input("Estado", sql.NVarChar(20), "Pendiente")
    .output("IdPedido", sql.Int)
    .execute("usp_CrearPedido");

  return resultado.output.IdPedido;
}

async function avanzar(idPedido) {
  const pool = await getConnection();
  await pool.request()
    .input("IdPedido", sql.Int, idPedido)
    .execute("usp_AvanzarPedido");
}

module.exports = { listarPedidos, crear, avanzar };