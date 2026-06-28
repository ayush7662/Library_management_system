const { DataTypes, Model } = require("sequelize");
const { sequelize } = require("../config/db");

class Borrow extends Model {}

Borrow.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    memberId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "member_id",
    },
    bookId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "book_id",
    },
    borrowDate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: "borrow_date",
    },
    returnDate: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null,
      field: "return_date",
    },
    status: {
      type: DataTypes.ENUM("borrowed", "returned"),
      allowNull: false,
      defaultValue: "borrowed",
    },
  },
  {
    sequelize,
    modelName: "Borrow",
    tableName: "borrows",
    timestamps: true,
  }
);

module.exports = Borrow;

