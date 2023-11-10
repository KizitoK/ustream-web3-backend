const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const Token = require("../models/tokenModel");
require('dotenv').config()
// const crypto = require("crypto");
// const { sendMail } = require("../helper/mail");

const secretKey = process.env.SECRET;

const register = async (req, res) => {
    let { username, email, confirmPassword, password } = req.body;
    const salt = await bcrypt.genSalt();
    if (password !== confirmPassword) {
        res.status(400).send({
            data: {},
            message: "Password and Confirm password should match",
            status: 1,
        });
    } else {
        bcrypt.hash(password, salt, async (err, hash) => {
            if (err) {
                res.status(400).send({
                    data: {},
                    message: err,
                    status: 1,
                });
            } else {
                const existingUser = await User.findOne({
                    email: email,
                });
                if (existingUser) {
                    return res.status(400).json({
                        data: {},
                        message: "Email already exists",
                        status: 1,
                    });
                }
                const existingUsername = await User.findOne({ username });
                if (existingUsername) {
                    return res.status(400).json({
                        data: {},
                        message: "Username has been taken",
                        status: 1,
                    });
                }
                const user = new User({
                    username,
                    email,
                    password: hash,
                });
                const newUser = await user.save();

                res.status(201).send({
                    data: newUser,
                    message: "User registered successfully",
                    status: 0,
                });
            }
        });
    }
};

const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username })
        if (!user) {
            res.status(401).send({
                data: {},
                message: `${username} not found!`,
                status: 1,
            });
        } else if (user) {
            bcrypt.compare(password, user.password, (err, result) => {
                if (err) {
                    res.status(500).send({
                        data: {},
                        message: err,
                        status: 1,
                    });
                } else if (!result) {
                    res.status(401).send({
                        data: {},
                        message: "username or password is incorrect",
                        status: 1,
                    });
                } else {
                    const token = jwt.sign({ id: user._id }, process.env.SECRET);
                    const savedToken = new Token({
                        userId: user._id,
                        token,
                    });
                    savedToken.save();
                    res.status(200).send({
                        data: {
                            token,
                            id: user._id,
                            username: user.username,
                        },
                        message: "logged in successfully",
                        status: 0,
                    });
                }
            });
        }
    } catch (err) {
        res.status(500).send({
            data: {},
            error: err.message,
            sataus: 1,
        });
    }
};

const auth = async (req, res, next) => {
    const token = req.header("x-auth-token");
    if (!token)
        return res
            .status(401)
            .json({ msg: "No authenication token, authorization denied" });

    const verfied = jwt.verify(token, secretKey);
    if (!verfied)
        return res
            .status(401)
            .json({ msg: "Token verification failed, authorization denied" });

    req.user = verfied.id;
    const user =
        (await User.findById(req.user)) || (await Business.findById(req.user));
    if (!user) return res.status(401).json({ msg: "User doesn't exsist" });

    next();
};

const tokenIsValid = async (req, res) => {
    try {
        const token = req.header("x-auth-token");
        if (!token) return res.json(false);

        const verified = jwt.verify(token, secretKey);
        if (!verified) return res.json(false);

        const user = await User.findById(verified.id);
        if (!user) return res.json(false);

        return res.json(true);
    } catch (err) {
        res.status(500).send({ data: {}, error: err.message, status: 1 });
    }
};

// const requestPasswordReset = async (req, res) => {
//     let { email } = req.body;

//     const user = await User.findOne({ email }) || await Business.findOne({ email });
//     if (!user) {
//         res.status(401).send({
//             data: {},
//             message: `User with ${email} not found!`,
//             status: 1,
//         });
//     }

//     let token = await Token.findOne({
//         userId: user._id,
//     });
//     if (token) await token.deleteOne();
//     let resetToken = crypto.randomBytes(32).toString("hex");

//     const hash = await bcrypt.hash(resetToken, Number(10));

//     await new Token({
//         userId: user.id,
//         token: hash,
//         createdAt: Date.now(),
//     }).save();

//     const link = `localhost://${PORT}/passwordReset?token=${resetToken}&id=${user._id}`;
//     sendMail(
//         user.email,
//         "Password Reset Request",
//         { name: user.firstName, link: link },
//         "../helper/template/requestResetPassword.hbs"
//     );
//     res.status(200).send({
//         data: {
//             token: token,
//             userId: user._id,
//             link: link,
//         },
//         message: "Reset Password Successful",
//         status: 0,
//     });
// };

// const resetPassword = async (req, res) => {
//     let { userId, token, password } = req.body;
//     let passwordResetToken = await Token.findOne({ userId });

//     if (!passwordResetToken) {
//         throw new Error("Invalid or Expired password reset token");
//     }

//     const isValid = await bcrypt.compare(token, passwordResetToken.token);
//     if (isValid) {
//         throw new Error("Invalid or Expired password reset token");
//     }

//     const hash = await bcrypt.hash(password, Number(10));
//     await User.updateOne({ _id: userId }, { password: hash });

//     const user = await User.findById({
//         _id: userId,
//     });

//     sendMail(
//         user.email,
//         "Password Reset Successfully",
//         { name: user.firstName },
//         "../helper/template/resetPassword.hbs"
//     );
//     await passwordResetToken.deleteOne();
//     res.status(200).send({
//         data: {
//             _id: userId,
//             password: hash,
//         },
//         message: "Password Reset successfully",
//         status: 0,
//     });
// };

module.exports = {
    register,
    login,
    auth,
    tokenIsValid
    // requestPasswordReset,
    // resetPassword,
};
