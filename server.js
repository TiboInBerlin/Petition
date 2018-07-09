const express = require("express");
const app = express();
const hb = require("express-handlebars");
const db = require("./db/db.js");
const bodyParser = require("body-parser");
const cookieSession = require("cookie-session");
const bcrypt = require("./db/bcrypt.js");
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

app.get("/home", (req, res) => {
    //db.getSigners()
    res.render("home", {
        //remember: res.render is for template
        layout: "main"
    });
});

app.post("/home", (req, res) => {
    //console.log(req.body.hidden);
    //console.log(hiddenInput.value);
    //if you log req body and it is undefined, this means bodyPArser was not required!
    if (
        //req.body.firstname == "" ||
        //req.body.lastname == "" ||
        req.body.hidden == ""
    ) {
        res.redirect("/home");
    } else {
        db
            .insertSignature(
                req.session.userId,
                //req.session.firstname,
                //req.session.lastname,
                req.body.hidden
            )
            //what did we do on line above? we are taking the data from the session that we created in this page in post/register
            .then(signature => {
                //res.json(newUser);
                req.session.signatureId = signature.id;
                //console.log(newUser);
                res.redirect("/signed");
            });
    }
});

app.get("/signed", (req, res) => {
    //res.send("<h1>Cheers! BASE jumping is the future!</h1>");
    //res.sendfile("base");
    db.getSignature(req.session.signatureId).then(sign => {
        console.log(sign.signature);
        res.render("signed", {
            signature: sign.signature
        });
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

app.get("/register", (req, res) => {
    res.render("register"); // when the user type "/register", user will be redirected to the register view
});

app.post("/register", (req, res) => {
    //we will use the body parser to get the values of the form of the body
    if (
        req.body.firstname == "" ||
        req.body.lastname == "" ||
        req.body.email == "" ||
        req.body.password == ""
    ) {
        res.redirect("/register"); // if the user has one empty field, we redirect user to register page
    } else {
        //first we have to do is hashing the password of the user
        //we access the hashPassword function from bscrypt file and we use .then since the function was promisified in bsrypt.js
        bcrypt
            .hashPassword(req.body.password)
            .then(hashedPassword => {
                // we create here the hashedpassword value in order to receive the returned value of the function hashPassword
                db
                    .createUser(
                        req.body.firstname,
                        req.body.lastname,
                        req.body.email,
                        hashedPassword
                    )
                    .then(results => {
                        //before sending the user to homepage, we want to create a session in order to encrypt the user's data because these data will be available on the client side, which is not safe.
                        req.session.userId = results.id;
                        req.session.firstname = req.body.firstname;
                        req.session.lastname = req.body.lastname;
                        req.session.email = req.body.email;
                        req.session.hashedPassword = hashedPassword;
                        res.redirect("/home");
                    });
            })
            .catch(err => {
                console.log(err);
            });
    }
});

app.get("/login", (req, res) => {
    res.render("login");
});

app.post("/login", (req, res) => {
    var userInfo; //We create this variable in order to link it with the variabke results in our getEmail function.
    //we will use the body parser to get the values of the form of the body
    if (req.body.email == "" || req.body.password == "") {
        res.redirect("/login"); // if the user has one empty field, we redirect user to register page
    } else {
        db.getEmail(req.body.email).then(results => {
            //remember: the result is ALWAYS an array!
            if (results.length == 0) {
                res.redirect("/login");
            } else {
                userInfo = results[0];
                const hashedPwd = userInfo.hashed_password; //result is an array and hashed password is the fifth element of this array
                bcrypt
                    .checkPassword(req.body.password, hashedPwd)
                    .then(checked => {
                        if (checked) {
                            console.log(checked);
                            req.session.userId = userInfo.id;
                            req.session.firstname = userInfo.firstname;
                            req.session.lastname = userInfo.lastname;
                            req.session.email = userInfo.email;
                            req.session.hashedPassword = hashedPwd;
                            res.redirect("/home");
                        } else {
                            res.redirect("/login");
                        }
                    });
            }
        });
    }
});

app.get("/profile", (req, res) => {
    res.render("profile");
});

app.post("/profile", (req, res) => {
    if (req.body.age == "" && req.body.city == "" && req.body.url == "") {
        res.redirect("/home"); // if the user has one empty field, we redirect user to register page
    } else {
        //we will have to add here all the new information that the users gave.
        db
            .insertProfile(
                req.session.userId,
                req.body.age,
                req.body.city,
                req.body.url
            )
            .then(() => {
                res.redirect("/home");
            });
    }
});

app.listen(8080, () => {
    console.log("listening on port 8080...");
});
