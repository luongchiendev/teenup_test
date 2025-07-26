const { DataTypes, Sequelize } = require("sequelize");
const sequelize = require("../config/sequelize");
const Student = require("./students.model");

const Subscription = sequelize.define(
  "Subscription",
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
    package_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    start_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    end_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    total_sessions: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    used_sessions: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {
    tableName: "subscriptions",
    timestamps: true,
  }
);

// Quan hệ
Student.hasMany(Subscription, { foreignKey: "studentId", onDelete: "CASCADE" });
Subscription.belongsTo(Student, { foreignKey: "studentId" });

module.exports = Subscription;
