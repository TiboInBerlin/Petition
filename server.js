const express = require("express");
const app = express();
const hb = require("express-handlebars");
const db = require("./db/db.js");
const bodyParser = require("body-parser");
const cookieSession = require("cookie-session");
//const cookieParser = require("cookies-parser");

app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static("public"));

app.engine(
    "handlebars",
    hb({
        defaultLayout: "main"
    })
);

app.use(
    cookieSession({
        secret: `I'm always angry.`,
        maxAge: 1000 * 60 * 60 * 24 * 14
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
    //console.log(req.body.hidden);
    //console.log(hiddenInput.value);
    //if you log req body and it is undefined, this means bodyPArser was not required!
    if (
        req.body.firstname == "" ||
        req.body.lastname == "" ||
        req.body.hidden == ""
    ) {
        res.redirect("/");
    } else {
        db
            .insertUser(req.body.firstname, req.body.lastname, req.body.hidden)
            .then(newUser => {
                //res.json(newUser);
                req.session.signatureId = newUser.id;
                //console.log(newUser);
                res.redirect("/signed");
            });
    }
});

app.get("/signed", (req, res) => {
    //res.send("<h1>Cheers! BASE jumping is the future!</h1>");
    //res.sendfile("base");
    db.getSignature(req.session.signatureId).then((sign) => {
        console.log(sign.signature);
        res.render('signed',{
            signature: sign.signature
        })
    });
    //res.json(sign);
    //res.render("signed");
});

app.get("/signers", (req, res) => {
    db.returnUsers().then(allUsers => {
        res.render("signers", {
            layout: "main",
            content: allUsers,
            length: allUsers.length
        });
    });
});

app.listen(8080, () => {
    console.log("listening on port 8080...");
});
