const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
        },
        email: {
            type: mongoose.Schema.Types.Mixed,
            required: true,
            unique: true
        },
        password: {
            type: mongoose.Schema.Types.Mixed,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

const User = mongoose.model("user", userSchema);

module.exports = User;
