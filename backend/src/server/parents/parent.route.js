const express = require("express");
const router = express.Router();
const parentController = require("./parent.controller");

router.get("/", parentController.getParents);
router.post("/", parentController.createParent);

module.exports = router;

