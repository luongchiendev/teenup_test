const { DataTypes, Sequelize } = require("sequelize");
const sequelize = require("../config/sequelize"); // file cấu hình sequelize

const Class = sequelize.define(
  "Class",
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: Sequelize.UUIDV4,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    subject: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    day_of_week: {
      type: DataTypes.INTEGER, // 1=Thứ 2 ... 7=Chủ nhật
      allowNull: false,
    },
    time_slot: {
      type: DataTypes.STRING, // "08:00-09:30"
      allowNull: false,
    },
    teacher_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    max_students: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 20,
    },
  },
  {
    tableName: "classes",
    timestamps: true,
  }
);

module.exports = Class;
