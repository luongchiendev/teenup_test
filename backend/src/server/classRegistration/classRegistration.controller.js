const ClassRegistration = require("../../models/classesRegistation.model");
const Student = require("../../models/students.model");
const Class = require("../../models/classes.model");

// ✅ Lấy danh sách toàn bộ đăng ký lớp
exports.getAllRegistrations = async (req, res) => {
  try {
    const registrations = await ClassRegistration.findAll({
      include: [
        { model: Student, attributes: ["id", "name"] },
        { model: Class, attributes: ["id", "name", "grade_level"] },
      ],
    });
    res.status(200).json(registrations);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

// ✅ Tạo mới đăng ký
exports.createRegistration = async (req, res) => {
  try {
    const { studentId, classId } = req.body;

    if (!studentId || !classId) {
      return res.status(400).json({ message: "Thiếu studentId hoặc classId" });
    }

    const newReg = await ClassRegistration.create({ studentId, classId });
    res.status(201).json(newReg);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

// ✅ Lấy chi tiết đăng ký theo id
exports.getRegistrationById = async (req, res) => {
  try {
    const { id } = req.params;
    const registration = await ClassRegistration.findByPk(id, {
      include: [
        { model: Student, attributes: ["id", "name"] },
        { model: Class, attributes: ["id", "name", "grade_level"] },
      ],
    });

    if (!registration) {
      return res.status(404).json({ message: "Không tìm thấy bản ghi" });
    }

    res.status(200).json(registration);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

// ✅ Cập nhật trạng thái
exports.updateRegistration = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const registration = await ClassRegistration.findByPk(id);
    if (!registration) {
      return res.status(404).json({ message: "Không tìm thấy bản ghi" });
    }

    await registration.update({ status });
    res.status(200).json(registration);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

// ✅ Xóa đăng ký
exports.deleteRegistration = async (req, res) => {
  try {
    const { id } = req.params;
    const registration = await ClassRegistration.findByPk(id);

    if (!registration) {
      return res.status(404).json({ message: "Không tìm thấy bản ghi" });
    }

    await registration.destroy();
    res.status(200).json({ message: "Xóa thành công" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};
