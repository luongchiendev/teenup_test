const  Student  = require("../../models/students.model");
const  Parent  = require("../../models/parent.model");

// ✅ Tạo Student
exports.createStudent = async (req, res) => {
  try {
    const { name, dob, gender, current_grade, parentId } = req.body;

    // Kiểm tra parent tồn tại
    const parent = await Parent.findByPk(parentId);
    if (!parent) {
      return res.status(400).json({ message: "Parent không tồn tại" });
    }

    const newStudent = await Student.create({
      name,
      dob,
      gender,
      current_grade,
      parentId,
    });

    res.status(201).json(newStudent);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi server" });
  }
};

// ✅ Lấy chi tiết Student
exports.getStudentById = async (req, res) => {
  try {
    const student = await Student.findByPk(req.params.id, {
      include: [{ model: Parent }],
    });

    if (!student) {
      return res.status(404).json({ message: "Không tìm thấy học sinh" });
    }

    res.json(student);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi server" });
  }
};

// ✅ Lấy danh sách Student (filter theo parentId nếu có)
exports.getAllStudents = async (req, res) => {
  try {
    const { parentId } = req.query;
    const where = parentId ? { parentId } : '';

    const students = await Student.findAll({
      where,
      include: [{ model: Parent }],
      order: [["id", "DESC"]],
    });

    res.json(students);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi server" });
  }
};
