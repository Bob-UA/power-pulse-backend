const express = require("express");
const auth = require("../../middlewares/auth");
const router = express.Router();
const { getAllProducts } = require("../../controllers/products/products");

router.get("/", auth, getAllProducts);

module.exports = router;
