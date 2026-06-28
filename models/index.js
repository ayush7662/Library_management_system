const { sequelize } = require("../config/db");

// Ensure models are loaded after sequelize init
const User = require("./user");
const Book = require("./book");
const Borrow = require("./borrow");

// Associations (use model field names)
User.hasMany(Borrow, { foreignKey: "memberId" });
Book.hasMany(Borrow, { foreignKey: "bookId" });
Borrow.belongsTo(User, { foreignKey: "memberId" });
Borrow.belongsTo(Book, { foreignKey: "bookId" });

module.exports = { sequelize, User, Book, Borrow };


