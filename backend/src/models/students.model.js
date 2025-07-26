const { DataTypes, Sequelize } = require("sequelize");
const sequelize = require("../config/sequelize"); // file cấu hình sequelize
const Parent = require('../models/parent.model');

const Student = sequelize.define("Student", {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: Sequelize.UUIDV4,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  dob: {
    type: DataTypes.DATEONLY, // Ngày sinh (YYYY-MM-DD)
    allowNull: false,
  },
  gender: {
    type: DataTypes.ENUM("male", "female", "other"),
    allowNull: false,
  },
  current_grade: {
    type: DataTypes.STRING, // ví dụ: "Lớp 5", "Grade 10"
    allowNull: true,
  },
  parentId: {
    type: DataTypes.UUID,
    allowNull: false,
    // references: {
    //   model: "Parents",
    //   key: "id",
    // },
    // onDelete: "CASCADE",
  },
},
{
    tableName: "students",
    timestamps: true,
  });

Parent.hasMany(Student, { foreignKey: "parentId", onDelete: "CASCADE" });
Student.belongsTo(Parent, { foreignKey: "parentId" });
// Student.belongsTo(Parent, { foreignKey: "parentId" });

module.exports = Student;
