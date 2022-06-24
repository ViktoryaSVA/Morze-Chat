// @ts-ignore
const mongoose = require("mongoose");
// @ts-ignore
const Schema = mongoose.Schema;

const userScheme: any = new Schema({
    login: String,
    email: String,
    password: String,
    registerDate: Date,
    permissionLevel: String,
});

module.exports = {
    userScheme
}
