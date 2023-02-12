const mysql = require ('mysql2');

const con = mysql.createConnection ({
    host: 'localhost',
    user: 'root',
    password: 'Umer1234',
    database: 'breastcancer'
});

function takeData () {
    con.connect ((err) => {
        if (err) throw err;
        const sql = "SELECT cr_result FROM cancer_result WHERE id=(SELECT MAX(id) FROM cancer_result)";
        con.query (sql, (err, result) => {
            if (err) throw err;
            return result[0]['cr_result']
        });
    });
}

module.exports = {
    takeData: takeData
}