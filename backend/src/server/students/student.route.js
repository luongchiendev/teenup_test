const express = require("express");
const router = express.Router();
const studentController = require("./student.controller");

// POST /api/students - tạo mới
router.post("/", studentController.createStudent);

// GET /api/students/:id - xem chi tiết
router.get("/:id", studentController.getStudentById);

// GET /api/students - danh sách
router.get("/", studentController.getAllStudents);

module.exports = router;
