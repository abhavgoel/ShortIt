const fs = require("fs");
const { getUser } = require("../service/auth")

function logReqRes(filename) {
    return (req,res,next) => {
        fs.appendFile(
            filename,
            `\n ${Date.now()} : ${req.ip} ${req.method}: ${req.path}`,
            (err,data) => {
                next();
            }
        );        
    }
}

function checkForAuthentication(req, res, next) {
    const tokenCookie = req.cookies.token;

    req.user = null;

    if(!tokenCookie) return next();

    const token = tokenCookie;
    const user = getUser(token);

    req.user = user;

    next();

}

function restrictTo(roles = []) {
    return function(req,res,next) {
        if(!req.user) return res.redirect("/login");

        if(!roles.includes(req.user.role)) return res.end("Unauthorized");

        return next();
    }
}

module.exports = {
    logReqRes,
    checkForAuthentication,
    restrictTo
}