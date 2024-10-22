const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const cookieParser = require("cookie-parser");
const URL = require("./models/url")
const urlRoute = require("./routes/url")
const staticRoute = require("./routes/staticRouter");
const userRoute = require("./routes/user");
const { logReqRes, checkForAuthentication, restrictTo } = require("./middlewares/index")
const { connectToMongoDb } = require("./dbConnection")

const app = express();
const PORT = 8001;

//----------------------------------------------------------------------------DB connection----------------------------------------------------------------------------
connectToMongoDb("mongodb://127.0.0.1:27017/short-url").then(() => {
    console.log("MongoDB connected successfully");
});

//----------------------------------------------------------------------------Middlewares------------------------------------------------------------------------------
app.use(express.json()); //middleware to parse body
app.use(express.urlencoded({extended :false})); //to parse form data
app.use(logReqRes("serverlog.txt"));
app.use(cookieParser());
app.use(checkForAuthentication) // we need authentication always

//----------------------------------------------------------------------------EJS and views setup----------------------------------------------------------------------
app.set('view engine', 'ejs');
app.set('views', path.resolve("./views"));

//----------------------------------------------------------------------------Route linking----------------------------------------------------------------------------
app.use("/url", restrictTo(["NORMAL", "ADMIN"]), urlRoute);
app.use("/user", userRoute);
app.use("/", staticRoute);


//The order here matters, to specify the routes. If I define the below route above, it will clash - if I send a request to localhost/login if this route was specified above
//then the server will log it as a request to shortened URL, so this should stay below all other routes
//----------------------------------------------------------------------------GET route to redirect to original URL----------------------------------------------------
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
