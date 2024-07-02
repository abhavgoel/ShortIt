const shortid  = require("shortid");
const URL = require("../models/url");

async function handleGenerateNewShortUrl(req,res) {
    const shortId = shortid(); //creating new id 
    const body = req.body;
    if(!body.url) return res.status(400).json({error : "url is required"}); //400 - bad request
    await URL.create({
        shortenedUrl : shortId,
        redirectUrl : body.url,
        visitHistory : [], 
        createdBy : req.user._id, //we get user by the middleware we used for auth
    });

    return res.render("home", {
        id : shortId
    });
    // return res.json({msg :"Url shortened successfully",id: shortId});
}

async function handleGetAnalytics(req,res) {
    const shortId = req.params.shortId;

    const result = await URL.findOne({shortenedUrl:shortId});

    return res.json({
        "totalClicks" : result.visitHistory.length,
        "analytics" : result.visitHistory,
    });
}

module.exports = {
    handleGenerateNewShortUrl,
    handleGetAnalytics
}