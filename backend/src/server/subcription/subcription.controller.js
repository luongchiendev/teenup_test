const Subscription = require("../../models/subcription.model");
const Student = require("../../models/students.model");

// [POST] /api/subscriptions – Khởi tạo gói học
exports.createSubscription = async (req, res) => {
  try {
    const { studentId, package_name, start_date, end_date, total_sessions } =
      req.body;

    // Kiểm tra học sinh tồn tại
    const student = await Student.findByPk(studentId);
    if (!student) return res.status(404).json({ message: "Student not found" });

    const subscription = await Subscription.create({
      studentId,
      package_name,
      start_date,
      end_date,
      total_sessions,
      used_sessions: 0,
    });

    res.status(201).json({ message: "Subscription created", data: subscription });
  } catch (err) {
    console.error("Create Subscription error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// [PATCH] /api/subscriptions/:id/use – Đánh dấu đã dùng 1 buổi
exports.useSession = async (req, res) => {
  try {
    const { id } = req.params;
    const subscription = await Subscription.findByPk(id);

    if (!subscription) return res.status(404).json({ message: "Subscription not found" });

    if (subscription.used_sessions >= subscription.total_sessions) {
      return res.status(400).json({ message: "All sessions have been used" });
    }

    subscription.used_sessions += 1;
    await subscription.save();

const subs = await Subscription.findAll({
      include: [{ model: Student, attributes: ["id", "name"] }],
      order: [["createdAt", "DESC"]],
    });
    res.json({
      message: "Session used successfully",
      data: {
        total_sessions: subscription.total_sessions,
        used_sessions: subscription.used_sessions,
        subscriptions: subs,
      },
    });
  } catch (err) {
    console.error("Use session error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// [GET] /api/subscriptions/:id – Xem trạng thái gói học
exports.getSubscription = async (req, res) => {
  try {
    const { id } = req.params;
    const subscription = await Subscription.findByPk(id);

    if (!subscription)
      return res.status(404).json({ message: "Subscription not found" });

    res.json({
      package_name: subscription.package_name,
      total_sessions: subscription.total_sessions,
      used_sessions: subscription.used_sessions,
      remaining_sessions:
        subscription.total_sessions - subscription.used_sessions,
      start_date: subscription.start_date,
      end_date: subscription.end_date,
    });
  } catch (err) {
    console.error("Get subscription error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getAllSubscriptions = async (req, res) => {
  try {
    const subs = await Subscription.findAll({
      include: [{ model: Student, attributes: ["id", "name"] }],
      order: [["createdAt", "DESC"]],
    });
    res.json(subs);
  } catch (err) {
    console.error("Lỗi khi lấy subscriptions:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
};