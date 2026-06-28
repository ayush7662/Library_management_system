const express = require("express");
const router = express.Router();

const { getAllMembers, deleteMember } = require("../controllers/memberController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

// Librarian only routes
router.get("/", authMiddleware, roleMiddleware(["librarian"]), getAllMembers);
router.delete("/:id", authMiddleware, roleMiddleware(["librarian"]), deleteMember);

module.exports = router;
