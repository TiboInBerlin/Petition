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

exports.insertUser = function(firstname, lastname, signature) {
    const q = `
INSERT INTO signatures (first_name, last_name, signature)
VALUES($1, $2, $3)
RETURNING *
`;
    // we use `` in order to create multiple lines
    const params = [firstname, lastname, signature];

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
