const { Book, Borrow, User } = require("../models");
const ApiResponse = require("../utils/ApiResponse");

const addBook = async (req, res) => {
  try {
    const { title, author, isbn, category, quantity } = req.body;

    const existingBook = await Book.findOne({ where: { isbn } });

    if (existingBook) {
      return ApiResponse.error(res, "Book with this ISBN already exists", 400);
    }

    const book = await Book.create({
      title,
      author,
      isbn,
      category,
      quantity,
      availableQuantity: quantity,
    });

    return ApiResponse.success(res, "Book added successfully", book, 201);
  } catch (error) {
    return ApiResponse.error(res, error.message);
  }
};

const getAllBooks = async (req, res) => {
  try {
    const { search, category } = req.query;

    const where = {};

    if (category) {
      where.category = category;
    }

    if (search) {
      where["title"] = where["title"];
    }

    if (search) {
      const books = await Book.findAll({
        where: {
          ["category"]: category || undefined,
          [User.sequelize.Op.or]: [
            { title: { [User.sequelize.Op.like]: `%${search}%` } },
            { author: { [User.sequelize.Op.like]: `%${search}%` } },
            { isbn: { [User.sequelize.Op.like]: `%${search}%` } },
          ],
        },
      });
      return ApiResponse.success(res, "Books retrieved successfully", books);
    }

    const books = await Book.findAll({ where });

    return ApiResponse.success(res, "Books retrieved successfully", books);
  } catch (error) {
    return ApiResponse.error(res, error.message);
  }
};

const getBookById = async (req, res) => {
  try {
    const book = await Book.findByPk(req.params.id);

    if (!book) {
      return ApiResponse.error(res, "Book not found", 404);
    }

    return ApiResponse.success(res, "Book retrieved successfully", book);
  } catch (error) {
    return ApiResponse.error(res, error.message);
  }
};

const updateBook = async (req, res) => {
  try {
    const { title, author, isbn, category, quantity } = req.body;

    const book = await Book.findByPk(req.params.id);

    if (!book) {
      return ApiResponse.error(res, "Book not found", 404);
    }

    if (isbn && isbn !== book.isbn) {
      const existingBook = await Book.findOne({ where: { isbn } });
      if (existingBook) {
        return ApiResponse.error(res, "Book with this ISBN already exists", 400);
      }
    }

    if (quantity !== undefined && quantity < book.quantity - book.availableQuantity) {
      return ApiResponse.error(
        res,
        "Cannot reduce quantity below currently borrowed books",
        400
      );
    }

    const updatedBook = await book.update({
      title,
      author,
      isbn,
      category,
      quantity,
      ...(quantity !== undefined
        ? {
            availableQuantity: book.availableQuantity + (quantity - book.quantity),
          }
        : {}),
    });

    return ApiResponse.success(res, "Book updated successfully", updatedBook);
  } catch (error) {
    return ApiResponse.error(res, error.message);
  }
};

const deleteBook = async (req, res) => {
  try {
    const book = await Book.findByPk(req.params.id);

    if (!book) {
      return ApiResponse.error(res, "Book not found", 404);
    }

    const activeBorrows = await Borrow.count({
      where: {
        bookId: req.params.id,
        status: "borrowed",
      },
    });

    if (activeBorrows > 0) {
      return ApiResponse.error(res, "Cannot delete book with active borrows", 400);
    }

    await book.destroy();

    return ApiResponse.success(res, "Book deleted successfully", null);
  } catch (error) {
    return ApiResponse.error(res, error.message);
  }
};

const borrowBook = async (req, res) => {
  try {
    const bookId = req.params.id;
    const userId = req.user._id;

    const book = await Book.findByPk(bookId);

    if (!book) {
      return ApiResponse.error(res, "Book not found", 404);
    }

    if (book.availableQuantity <= 0) {
      return ApiResponse.error(res, "Book is currently unavailable", 400);
    }

    const existingBorrow = await Borrow.findOne({
      where: {
        memberId: userId,
        bookId,
        status: "borrowed",
      },
    });

    if (existingBorrow) {
      return ApiResponse.error(res, "You have already borrowed this book", 400);
    }

    await Borrow.create({
      memberId: userId,
      bookId,
      status: "borrowed",
    });

    await book.decrement("availableQuantity", { by: 1 });
    await book.reload();

    return ApiResponse.success(res, "Book borrowed successfully", {
      bookId: book.id,
      title: book.title,
      availableQuantity: book.availableQuantity,
    });
  } catch (error) {
    return ApiResponse.error(res, error.message);
  }
};

const returnBook = async (req, res) => {
  try {
    const bookId = req.params.id;
    const userId = req.user._id;

    const borrow = await Borrow.findOne({
      where: {
        memberId: userId,
        bookId,
        status: "borrowed",
      },
    });

    if (!borrow) {
      return ApiResponse.error(res, "No active borrow record found for this book", 404);
    }

    borrow.status = "returned";
    borrow.returnDate = new Date();
    await borrow.save();

    const book = await Book.findByPk(bookId);
    await book.increment("availableQuantity", { by: 1 });
    await book.reload();

    return ApiResponse.success(res, "Book returned successfully", {
      bookId: book.id,
      title: book.title,
      returnDate: borrow.returnDate,
    });
  } catch (error) {
    return ApiResponse.error(res, error.message);
  }
};

const getMyBorrowedBooks = async (req, res) => {
  try {
    const userId = req.user._id;

    const borrows = await Borrow.findAll({
      where: {
        memberId: userId,
        status: "borrowed",
      },
      include: [
        {
          model: Book,
          attributes: ["id", "title", "author", "isbn", "category"],
        },
      ],
    });

    return ApiResponse.success(res, "Borrowed books retrieved successfully", borrows);
  } catch (error) {
    return ApiResponse.error(res, error.message);
  }
};

module.exports = {
  addBook,
  getAllBooks,
  getBookById,
  updateBook,
  deleteBook,
  borrowBook,
  returnBook,
  getMyBorrowedBooks,
};

