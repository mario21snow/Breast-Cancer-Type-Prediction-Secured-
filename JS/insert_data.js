const mysql = require ('mysql2');

const con = mysql.createConnection ({
    host: 'localhost',
    user: 'root',
    password: 'Umer1234',
    database: 'breastcancer'
});

function insertData (lst) {
    con.connect ((err) => {
        if (err) throw err;
        const sql = `INSERT INTO cancer_detail (rmean, pmean, amean, cmean, wmean, pwmean, awmean, cwmean) VALUES ('${lst[0]}', '${lst[1]}', '${lst[2]}', '${lst[3]}', '${lst[4]}', '${lst[5]}', '${lst[6]}', '${lst[7]}')`;
        con.query (sql, (err) => {
            if (err) throw err;
        });
    });
}

module.exports = {
    insertData: insertData
}