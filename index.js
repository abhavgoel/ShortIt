const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const cookieParser = require("cookie-parser");
const URL = require("./models/url")
const urlRoute = require("./routes/url")
const staticRoute = require("./routes/staticRouter");
const userRoute = require("./routes/user");
const { logReqRes, restricToLoggedInUserOnly } = require("./middlewares/index")
const { connectToMongoDb } = require("./dbConnection")

const app = express();
const PORT = 8001;

//db connection
connectToMongoDb("mongodb://127.0.0.1:27017/short-url").then(() => {
    console.log("MongoDB connected successfully");
});

//middlewares
app.use(express.json()); //middleware to parse body
app.use(express.urlencoded({extended :false})); //to parse form data
app.use(logReqRes("serverlog.txt"));
app.use(cookieParser());

//EJS setup
app.set('view engine', 'ejs');
app.set('views', path.resolve("./views"));

//Route linking
app.use("/url",restricToLoggedInUserOnly, urlRoute);
app.use("/", staticRoute);
app.use("/user", userRoute);

app.get("/:shortId" , async (req,res) => {
    const shortId = req.params.shortId;
    const entry = await URL.findOneAndUpdate(
        {
            shortenedUrl : shortId,
        },
        {
            $push : {
                visitHistory : {
                    timestamp: Date.now()
                },
            }
        }
    );
    
    if(!entry) return res.status(404).json({"err" : "url not found"});
    //always add protocol as original url if the url to be redirected is external
    //The browser treats redirect requests as relative, so it will point back to the server if no protocol is found
    let redirectUrl = entry.redirectUrl;
    if (!redirectUrl.startsWith('http://') && !redirectUrl.startsWith('https://')) {
        redirectUrl = 'https://' + redirectUrl;
    }
    console.log("Redirecting to " + redirectUrl);

    return res.redirect(redirectUrl);
});

app.listen(PORT, () => console.log(`Server started at port: ${PORT}`));
