const { sql, getConnection } = require("../config/db");

async function listarSabores() {
  const pool = await getConnection();
  const resultado = await pool.request().execute("usp_ListarSabores");
  return resultado.recordset;
}

module.exports = { listarSabores };