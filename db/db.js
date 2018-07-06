const spicedPg = require("spiced-pg");

var db = spicedPg(
    "postgres:thibautvalarche:postgres@localhost:5432/basejumpingpetition"
);

exports.getSigners = function() {
    db
        .query("SELECT * FROM signatures;") //dbquery returns a promise
        .then(results => {
            console.log(results.rows);
        });
};

exports.getSignature = function(signatureId) {
    const q = `
SELECT signature FROM signatures WHERE id = $1;
`;
    //we use $1 to prevent from sql injections
    // we use `` in order to create multiple lines
    const params = [signatureId];

    return db.query(q, params).then(results => {
        return results.rows[0];
    });
};

exports.insertSignature = function(userId, firstname, lastname, signature) {
    const q = `
INSERT INTO signatures (user_id, first_name, last_name, signature)
VALUES($1, $2, $3, $4) RETURNING *
`;
    // we use `` in order to create multiple lines
    const params = [userId, firstname, lastname, signature];

    return db.query(q, params).then(results => {
        return results.rows[0];
    });
    //db.query(q, params);
};

exports.returnUsers = function() {
    const q = `SELECT * FROM signatures;`;
    return db.query(q).then(results => {
        return results.rows;
    });
};
//we create this function in order to add the hashed password and other data to our users.sql table
exports.createUser = function(firstName, lastName, email, password) {
    const q = `
INSERT INTO users (first_name, last_name, email, hashed_password)
VALUES($1, $2, $3, $4) RETURNING *
`;
    const params = [firstName, lastName, email, password];

    return db.query(q, params).then(results => {
        return results.rows[0];
    });
};
//we create this function to check the Email that the user wrote and we see if we have it our table, and if yes we return the whole array of the corresponding row.
exports.getEmail = function(email) {
    const q = `SELECT email,hashed_password FROM users WHERE email= $1;`;
    const params = [email];
    return db.query(q, params).then(results => {
        return results.rows[0];
    });
};
