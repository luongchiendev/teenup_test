const express = require("express");
const router = express.Router();
const classRegController = require("./classRegistration.controller");

// Danh sách API
router.get("/", classRegController.getAllRegistrations);
router.post("/", classRegController.createRegistration);
router.get("/:id", classRegController.getRegistrationById);
router.put("/:id", classRegController.updateRegistration);
router.delete("/:id", classRegController.deleteRegistration);

module.exports = router;
