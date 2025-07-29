// seed.js
const sequelize = require("./config/sequelize");
const Parent = require("./models/parent.model");
const Student = require("./models/students.model");
const Class = require("./models/classes.model");
const ClassRegistration = require("./models/classesRegistation.model");

(async () => {
  try {
    console.log("🔄 Syncing database...");
    await sequelize.sync({ alter: true }); // chỉ nên dùng alter:true trong dev

    console.log("🌱 Seeding data...");

    // 1. Parents
    const [p1, p2] = await Promise.all([
      Parent.create({ name: "Nguyễn Văn A", phone: "0901111111", email: "a@gmail.com" }),
      Parent.create({ name: "Trần Thị B", phone: "0902222222", email: "b@gmail.com" }),
    ]);

    // 2. Students
    const [s1, s2, s3] = await Promise.all([
      Student.create({ name: "Nguyễn Văn C", gender: "male", dob: "05-07-2009", current_grade: "A", parentId: p1.id }),
      Student.create({ name: "Trần Thị D", gender: "male", dob: "05-07-2009", current_grade: "A", parentId: p2.id }),
      Student.create({ name: "Lê Văn E", gender: "male", dob: "05-07-2009", current_grade: "A", parentId: p1.id }),
    ]);

    // 3. Classes
    const [c1, c2, c3] = await Promise.all([
      Class.create({ name: "Toán cơ bản", subject: "Math", day_of_week: 1, time_slot: "08:00-09:30", teacher_name: "Ha", max_students: 20, }),
      Class.create({ name: "Anh văn", subject: "English", day_of_week: 2, time_slot: "08:00-09:30", teacher_name: "Ha", max_students: 20, }),
      Class.create({ name: "Khoa học", subject: "Geography", day_of_week: 3, time_slot: "08:00-09:30", teacher_name: "Ha", max_students: 20, }),
    ]);

    // // 4. Class Registration
    // await Promise.all([
    //   ClassRegistration.create({ studentId: s1.id, classId: c1.id }),
    //   ClassRegistration.create({ studentId: s2.id, classId: c2.id }),
    //   ClassRegistration.create({ studentId: s3.id, classId: c1.id }),
    // ]);

    console.log("✅ Seeding completed!");
    process.exit();
  } catch (err) {
    console.error("❌ Seeding error:", err);
    process.exit(1);
  }
})();
