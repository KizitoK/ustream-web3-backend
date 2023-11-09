const express = require("express");
const userRoute = express.Router();

const {
    register,
    login,
    auth,
    tokenIsValid,
    //   requestPasswordReset,
    //   resetPassword,
} = require("../auth/auth");
const {
    getUsers,
    getUser,
    updateUser,
    deleteUser,
} = require("../controllers/userController");


userRoute.post("/register", register);
userRoute.post("/login", login);
userRoute.post("/validateToken", tokenIsValid);
userRoute.get("/", auth, getUsers);
userRoute.get("/:id", auth, getUser);
userRoute.patch("/:id", auth, updateUser);
userRoute.delete("/:id", auth, deleteUser);

// userRoute.post("/requestPasswordReset/:id", requestPasswordReset);
// userRoute.post("/resetPassword", resetPassword);

module.exports = {
    userRoute,
};
