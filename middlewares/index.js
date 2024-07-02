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

async function restricToLoggedInUserOnly(req,res,next) {
    const userUid = req.cookies.uid;
    if(!userUid) return res.redirect("/login");
    
    const user = getUser(userUid);
    if(!user) return res.redirect("/login");

    req.user = user;
    next();
}

async function checkAuth(req,res,next) {//using it to attach user to the reqesut and pass it forward
    const userUid = req.cookies.uid;
   
    const user = getUser(userUid);

    req.user = user;
    next();
}

module.exports = {
    logReqRes,
    restricToLoggedInUserOnly,
    checkAuth
}