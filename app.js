var express         = require("express"),
    bodyParser      = require("body-parser"),
    axios           = require("axios"),
    app             = express();

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({extended: true}));


