const express = require("express");
const router = express.Router();
const { postEndpoint } = require("../controllers/purchaseController");

router.route("").post(express.raw({ type: "application/json" }), postEndpoint);

module.exports = router;
