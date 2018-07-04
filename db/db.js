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

exports.insertUser = function(firstname, lastname) {
    const q = `
INSERT INTO signatures (first_name, last_name, signature)
VALUES($1, $2, $3)
RETURNING *
`;
    // we use `` in order to create multiple lines
    const params = [firstname, lastname, "blah"];

    return db.query(q, params).then(results => {
        return results.rows[0];
    });
    db.query(q, params);
};
