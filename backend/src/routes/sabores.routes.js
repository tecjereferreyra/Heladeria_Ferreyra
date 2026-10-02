const { Router } = require("express");
const asyncHandler = require("../middlewares/asyncHandler");
const pedidosController = require("../controllers/sabores.controller");

const router = Router();

router.get("/sabores", asyncHandler(pedidosController.listarSabores));

module.exports = router;