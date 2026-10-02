const saboresService = require("../services/sabores.service");



// GET /api/sabores
async function listarSabores(req, res) {
  const sabores = await saboresService.listarSabores();
  res.json(sabores);
}

module.exports = { listarSabores };