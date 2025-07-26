const { DataTypes, Sequelize } = require("sequelize");
const sequelize = require("../config/sequelize"); // file cấu hình sequelize

const Parent = sequelize.define(
  "Parent",
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
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      validate: {
        isEmail: true,
      },
    },
  },
  {
    tableName: "parents",
    timestamps: true,
  }
);

module.exports = Parent;
