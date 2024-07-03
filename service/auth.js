const jwt = require("jsonwebtoken");
const secret = "@Abhav@123$"

function setUser(user) {
    // console.log(user);
    return jwt.sign({
        _id : user._id,
        email: user.email,
        role: user.role,
    },secret);
}

function getUser(token) {
    try{
        return jwt.verify(token,secret);
    } catch {
        return null;
    }
}

module.exports = {
    setUser,
    getUser
}