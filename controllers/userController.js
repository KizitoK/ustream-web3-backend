const Token = require("../models/tokenModel");
const User = require("../models/userModel");

const getUsers = async (req, res) => {
    try {
        const users = await User.find({});

        res.status(200).send({
            data: users,
            message: `All Users`,
            status: 0,
        });
    } catch (err) {
        res.status(500).send({
            data: {},
            message: err.message,
            status: 1,
        });
    }
};

const getUser = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await User.findById(id);

        res.status(200).send({
            data: user,
            message: `${user.username} details found`,
            status: 0,
        });
    } catch (err) {
        res.status(500).send({
            data: {},
            message: err.message,
            status: 1,
        });
    }
};

const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user;

        if (id !== userId)
            return res.status(401).send({
                data: {},
                message: `User not found`,
                staus: 1,
            });

        const user = await User.findOne({
            _id: id
        });
        const updatedUser = await User.findByIdAndUpdate(id, req.body, {
            new: true
        });

        res.status(201).send({
            data: updatedUser,
            message: `${user.username}'s details has been updated`,
            status: 0,
        })
    } catch (err) {
        res.status(500).status({
            data: {},
            message: err.message,
            status: 1,
        })
    }
};

const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user;

        if (id !== userId)
            return res.status(401).send({
                data: {},
                message: `Unauthorized`,
                status: 1,
            })
        const user = await User.findOne({ _id: id })

        if (!user)
            return res.status(401).send({
                data: {},
                message: `User does not exist!`,
                status: 1,
            });

        const deletedUser = await User.findByIdAndDelete(id)
        res.status(201).send({
            message: `User Deleted`,
            status: 9,
        })
    } catch (err) {
        res.status(500).send({
            data: {},
            message: err.message,
            status: 1,
        })
    }
};

module.exports = {
    getUsers,
    getUser,
    updateUser,
    deleteUser,
};
