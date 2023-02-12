const express = require ('express');
const bp = require ('body-parser');
const mysql = require ('mysql2');
const insert = require ('./insert_data');
const take = require ('./take_data');

const app = express ();


app.use (express.json ());
app.use (bp.json ());
app.use (bp.urlencoded ({extended: true}));

const con = mysql.createConnection ({
    host: 'localhost',
    user: 'root',
    password: 'Umer1234',
    database: 'breastcancer'
});

app.get ('/register', (req, res) => {
    res.sendFile ('D://Projects//Mini Project SEM V Secured//HTML//register.html')
});

app.post ('/createaccount', (req, res) => {
    const email = req.body.email;
    const username = req.body.username;
    const password = req.body.password;
    
    con.connect ((err) => {
        if (err) throw err;
        const select_all = 'SELECT username from user_details';
        var users = []
        con.query (select_all, (err, result) => {
            if (err) throw err;

            for (var i = 0; i < result.length; i++)
                users.push (result[i]['username']);
            
            if (users.length == 0) {
                const insert = `INSERT INTO user_details (email,  username, userpassword) VALUE ('${email}', '${username}', '${password}')`;
                con.query (insert, (err) => {
                    if (err) throw err;
                    res.sendFile ('D://Projects//Mini Project SEM V Secured//HTML//login.html');
                });
            }
            for (var i = 0; i < users.length; i++) {
                if (users [i] == username)
                    res.send ('<h1>Username already exist, choose other username !!!<?h1>');
                else {
                    const insert = `INSERT INTO user_details (email,  username, userpassword) VALUE ('${email}', '${username}', '${password}')`;
                    con.query (insert, (err) => {
                        if (err) throw err;
                        res.sendFile ('D://Projects//Mini Project SEM V Secured//HTML//login.html');
                    });
                }
            }
        });
    });
});

app.get ('/login', (req, res) => {
    res.sendFile ('D://Projects//Mini Project SEM V Secured//HTML//login.html')
})

app.post ('/home', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    con.connect ((err) => {
        if (err) throw err;
        
        const user_registered_password = `SELECT userpassword FROM user_details where username='${username}'`;
        con.query (user_registered_password, (err, result) => {
            if (err) {
                throw error;
            } 
            const res_zero = result[0];
            const user_reg_pass = Object.values (res_zero)[0];
            if (password === user_reg_pass)
                res.sendFile ('D://Projects//Mini Project SEM V Secured//HTML//home.html');
            else 
                res.json ({Error: 'Incorrect username or password !!!'});
        });
    });
});

app.post ('/predict', (req, res) => {
    input_lst = [req.body.rmean, req.body.pmean, req.body.amean, req.body.cmean, req.body.wmean, req.body.pwmean, req.body.awmean, req.body.cwmean];
    insert.insertData (input_lst)
    res = take.takeData ()
    console.log (res)
    res.send (`<h1>${res}</h1>`)
});

const PORT = 3000;
app.listen (PORT, () => console.log ('Listening at port ', PORT, '......', '\nUser Registeration Link: localhost:3000/register'));