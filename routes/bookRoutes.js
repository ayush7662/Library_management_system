const express = require("express");
const { body, validationResult } = require("express-validator");
const router = express.Router();

const {
    addBook,
    getAllBooks,
    getBookById,
    updateBook,
    deleteBook,
    borrowBook,
    returnBook,
    getMyBorrowedBooks,
} = require("../controllers/bookController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            errors: errors.array(),
        });
    }
    next();
};

// Public routes (require authentication)
router.get("/", authMiddleware, getAllBooks);
router.get("/:id", authMiddleware, getBookById);

// Librarian only routes
router.post(
    "/",
    authMiddleware,
    roleMiddleware(["librarian"]),
    body("title").trim().notEmpty().withMessage("Title is required"),
    body("author").trim().notEmpty().withMessage("Author is required"),
    body("isbn").trim().notEmpty().withMessage("ISBN is required"),
    body("category").trim().notEmpty().withMessage("Category is required"),
    body("quantity").isInt({ min: 1 }).withMessage("Quantity must be at least 1"),
    validate,
    addBook
);

router.put(
    "/:id",
    authMiddleware,
    roleMiddleware(["librarian"]),
    body("title").optional().trim().notEmpty().withMessage("Title cannot be empty"),
    body("author").optional().trim().notEmpty().withMessage("Author cannot be empty"),
    body("isbn").optional().trim().notEmpty().withMessage("ISBN cannot be empty"),
    body("category").optional().trim().notEmpty().withMessage("Category cannot be empty"),
    body("quantity").optional().isInt({ min: 0 }).withMessage("Quantity cannot be negative"),
    validate,
    updateBook
);

router.delete("/:id", authMiddleware, roleMiddleware(["librarian"]), deleteBook);

// Member only routes
router.post("/:id/borrow", authMiddleware, roleMiddleware(["member"]), borrowBook);
router.post("/:id/return", authMiddleware, roleMiddleware(["member"]), returnBook);

// Member specific route
router.get("/members/me/books", authMiddleware, roleMiddleware(["member"]), getMyBorrowedBooks);

module.exports = router;
