const { DataTypes, Sequelize } = require("sequelize");
const sequelize = require("../config/sequelize"); // file cấu hình sequelize
const Student = require("./students.model");
const Class = require("./classes.model");

const ClassRegistration = sequelize.define(
  "ClassRegistration",
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: Sequelize.UUIDV4,
    },
    studentId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    classId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    registration_date: {
      type: DataTypes.DATEONLY,
      defaultValue: Sequelize.NOW,
    },
    status: {
      type: DataTypes.ENUM("active", "completed", "cancelled"),
      defaultValue: "active",
    },
  },
  {
    tableName: "class_registrations",
    timestamps: true,
  }
);

// ✅ Thiết lập quan hệ
Student.hasMany(ClassRegistration, { foreignKey: "studentId", onDelete: "CASCADE" });
ClassRegistration.belongsTo(Student, { foreignKey: "studentId" });

Class.hasMany(ClassRegistration, { foreignKey: "classId", onDelete: "CASCADE" });
ClassRegistration.belongsTo(Class, { foreignKey: "classId" });

module.exports = ClassRegistration;
