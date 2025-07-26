const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const sequelize = require("./config/sequelize");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// ==============================
// 1. TỰ ĐỘNG IMPORT TẤT CẢ MODEL
// ==============================
const modelsPath = path.join(__dirname, "server");
function loadModels(dirPath) {
  fs.readdirSync(dirPath).forEach((file) => {
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      loadModels(fullPath);
    } else if (file.endsWith(".model.js")) {
      require(fullPath);
      console.log(`✅ Model loaded: ${file}`);
    }
  });
}
loadModels(modelsPath);

// ==============================
// 2. ĐỒNG BỘ DATABASE
// ==============================
sequelize
  .authenticate()
  .then(() => {
    console.log("✅ Kết nối DB thành công!");
    // alter: true => tự động cập nhật bảng, không xóa dữ liệu
    return sequelize.sync({ alter: true });
  })
  .then(() => {
    console.log("✅ Database synced!");
  })
  .catch((err) => {
    console.error("❌ Lỗi kết nối DB:", err);
  });

// ==============================
// 3. ROUTES
// ==============================
app.use("/api/parents", require("./server/parents/parent.route"));
app.use("/api/students", require("./server/students/student.route"));
app.use("/api/classes", require("./server/classess/classess.route"));
app.use("/api/classRegistration", require("./server/classRegistration/classRegistration.route"));
app.use("/api/subscriptions", require("./server/subcription/subcription.route"));

app.get("/", (req, res) => {
  res.send("Backend API running...");
});

// ==============================
// 4. START SERVER
// ==============================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
