const express = require("express");
const router = express.Router();
const classController = require("./classess.controller");

// Danh sách API
router.get("/", classController.getAllClasses);
router.post("/", classController.createClass);
router.get("/:id", classController.getClassById);
router.put("/:id", classController.updateClass);
router.delete("/:id", classController.deleteClass);
router.post("/:classId/register", classController.registerStudentToClass);

module.exports = router;
