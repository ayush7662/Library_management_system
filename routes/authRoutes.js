const express = require("express");
const { body, validationResult } = require("express-validator");

const router = express.Router();


const{  register, login} = require("../controllers/authController");

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

router.post("/register", 
    body("name").trim().notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Please enter a valid email").normalizeEmail(),
    body("password").isLength({min: 6}).withMessage("Password must be at least 6 characters"),
    body("role").optional().isIn(["member", "librarian"]).withMessage("Role must be either member or librarian"),
    validate, 
    register
);

router.post("/login", 
    body("email").isEmail().withMessage("Please enter a valid email").normalizeEmail(),
    body("password").notEmpty().withMessage("Password is required"),
    validate, 
    login
);

module.exports = router;

