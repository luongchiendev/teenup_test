const Parent = require("../../models/parent.model");

// GET /api/parents
exports.getParents = async (req, res) => {
  try {
    const { search } = req.query;
    let where = {};

    if (search) {
      // tìm theo tên hoặc sđt
      where = {
        [Parent.sequelize.Op.or]: [
          { name: { [Parent.sequelize.Op.iLike]: `%${search}%` } },
          { phone: { [Parent.sequelize.Op.like]: `%${search}%` } },
        ],
      };
    }

    const parents = await Parent.findAll({ where, order: [["createdAt", "DESC"]] });
    res.json(parents);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/parents
exports.createParent = async (req, res) => {
  try {
    const { name, phone, email } = req.body;
    if (!name || !phone) {
      return res.status(400).json({ message: "Name và phone là bắt buộc" });
    }

    const parent = await Parent.create({ name, phone, email });
    res.status(201).json(parent);
  } catch (err) {
    if (err.name === "SequelizeUniqueConstraintError") {
      return res.status(400).json({ message: "Số điện thoại đã tồn tại" });
    }
    res.status(500).json({ message: err.message });
  }
};
