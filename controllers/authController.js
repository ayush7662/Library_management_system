const { User } = require("../models");
const generateToken = require("../utils/generateToken");
const ApiResponse = require("../utils/ApiResponse");

const register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        const existingUser = await User.findOne({ where: { email } });

        if (existingUser) {
            return ApiResponse.error(res, "Email already registered", 400);
        }

        const user = await User.create({
            name,
            email,
            passwordHash: password,
            role,
        });

        const token = generateToken(user.id, user.role);

        return ApiResponse.success(
            res,
            "User registered successfully",
            {
                token,
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                },
            },
            201
        );
    } catch (error) {
        return ApiResponse.error(res, error.message);
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({
            where: { email },
            attributes: { include: ["passwordHash"] },
        });

        if (!user) {
            return ApiResponse.error(res, "Invalid email or password", 401);
        }

        const isMatch = await user.comparePassword(password);

        if (!isMatch) {
            return ApiResponse.error(res, "Invalid email or password", 401);
        }

        const token = generateToken(user.id, user.role);

        return ApiResponse.success(res, "Login successful", {
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    } catch (error) {
        return ApiResponse.error(res, error.message);
    }
};

module.exports = {
    register,
    login,
};

