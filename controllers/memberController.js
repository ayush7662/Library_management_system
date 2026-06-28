const { User } = require("../models");
const ApiResponse = require("../utils/ApiResponse");

const getAllMembers = async (req, res) => {
  try {
    const members = await User.findAll({
      where: { role: "member" },
      attributes: ["id", "name", "email", "role"],
    });

    return ApiResponse.success(res, "Members retrieved successfully", members);
  } catch (error) {
    return ApiResponse.error(res, error.message);
  }
};

const deleteMember = async (req, res) => {
  try {
    const member = await User.findByPk(req.params.id);

    if (!member) {
      return ApiResponse.error(res, "Member not found", 404);
    }

    if (member.role !== "member") {
      return ApiResponse.error(res, "Cannot delete librarian accounts", 400);
    }

    await member.destroy();

    return ApiResponse.success(res, "Member deleted successfully", null);
  } catch (error) {
    return ApiResponse.error(res, error.message);
  }
};

module.exports = {
  getAllMembers,
  deleteMember,
};

