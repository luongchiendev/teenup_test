const Class = require("../../models/classes.model");
const Student = require("../../models/students.model");
const ClassRegistration = require("../../models/classesRegistation.model");

// ✅ Lấy danh sách tất cả class
exports.getAllClasses = async (req, res) => {
  try {
    const classes = await Class.findAll();
    res.status(200).json(classes);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

// ✅ Tạo mới class
exports.createClass = async (req, res) => {
  try {
    const { name, day_of_week, max_students, time_slot, teacher_name, subject } = req.body;

    if (!name || !day_of_week || !max_students || !time_slot || !teacher_name || !subject) {
      return res.status(400).json({ message: "Thiếu thông tin bắt buộc" });
    }

    const newClass = await Class.create({ name, day_of_week, max_students, time_slot, teacher_name, subject });
    res.status(201).json(newClass);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

// ✅ Lấy chi tiết class theo id
exports.getClassById = async (req, res) => {
  try {
    const { id } = req.params;
    const foundClass = await Class.findByPk(id);

    if (!foundClass) {
      return res.status(404).json({ message: "Không tìm thấy lớp học" });
    }

    res.status(200).json(foundClass);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

// ✅ Cập nhật class
exports.updateClass = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, grade_level, room } = req.body;

    const foundClass = await Class.findByPk(id);
    if (!foundClass) {
      return res.status(404).json({ message: "Không tìm thấy lớp học" });
    }

    await foundClass.update({ name, grade_level, room });
    res.status(200).json(foundClass);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

// ✅ Xóa class
exports.deleteClass = async (req, res) => {
  try {
    const { id } = req.params;
    const foundClass = await Class.findByPk(id);

    if (!foundClass) {
      return res.status(404).json({ message: "Không tìm thấy lớp học" });
    }

    await foundClass.destroy();
    res.status(200).json({ message: "Xóa lớp học thành công" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

exports.registerStudentToClass = async (req, res) => {
  try {
    const { classId } = req.params;
    const { studentId } = req.body;

    // 1. Kiểm tra tồn tại lớp
    const targetClass = await Class.findByPk(classId);
    if (!targetClass) return res.status(404).json({ message: "Class not found" });

    // 2. Kiểm tra tồn tại học sinh
    const student = await Student.findByPk(studentId);
    if (!student) return res.status(404).json({ message: "Student not found" });

    // 3. Kiểm tra số lượng đã đăng ký
    const count = await ClassRegistration.count({ where: { classId } });
    if (count >= targetClass.max_students) {
      return res.status(400).json({ message: "Class is full" });
    }

    // ✅ 4. **Kiểm tra trùng lịch**
    const conflictingClass = await Class.findOne({
      include: [{
        model: ClassRegistration,
        where: { studentId }
      }],
      where: {
        day_of_week: targetClass.day_of_week,
        time_slot: targetClass.time_slot
      }
    });

    if (conflictingClass) {
      return res.status(400).json({
        message: `Student already has a class at ${targetClass.time_slot} on ${targetClass.day_of_week}`
      });
    }

    // 5. Đăng ký (tránh đăng ký trùng)
    const [registration, created] = await ClassRegistration.findOrCreate({
      where: { classId, studentId },
      defaults: { classId, studentId }
    });

    if (!created) {
      return res.status(400).json({ message: "Student already registered in this class" });
    }

    res.json({ message: "Registered successfully", data: registration });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

