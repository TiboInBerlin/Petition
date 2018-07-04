const express = require("express");
const app = express();
const hb = require("express-handlebars");
const db = require("./db/db.js");
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static("public"));

app.engine(
    "handlebars",
    hb({
        defaultLayout: "main"
    })
);
app.set("view engine", "handlebars");

app.get("/", (req, res) => {
    //db.getSigners()
    res.render("home", {
        //remember: res.render is for template
        layout: "main"
    });
});

app.post("/", (req, res) => {
    //console.log(req.body);
    //if you log req body and it is undefined, this means bodyPArser was not required!
    db.insertUser(req.body.firstname, req.body.lastname).then(newUser => {
        //res.json(newUser);
        //console.log(newUser);
        res.redirect("/thanks");
    });
});

app.get("/thanks", (req, res) => {
    res.send("<h1>Cheers! BASE jumping is the future!</h1>");
});

app.listen(8080, () => {
    console.log("listening on port 8080...");
});
