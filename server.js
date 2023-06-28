const express = require('express');
const app = express();
const mysql = require('mysql');
const _ = require('lodash');
const bodyParser = require('body-parser')

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const server = app.listen(8888, () => {
    console.log('Node js APi Runing');
})

var db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "api_basic"
});

db.connect(function (err) {
    if (err) throw err;
    console.log("Connected!");
});


// crete 
app.post('/api/createuser', (req, res) => {

    var firstname = _.get(req, ['body', 'firstname']);
    var lastname = _.get(req, ['body', 'lastname']);
    var age = _.get(req, ['body', 'age']);

    console.log('firstname', firstname);
    console.log('lastname', lastname);
    console.log('age', age);

    try {
        if (firstname && lastname && age) {
            db.query('insert into user (firstname,lastname,age) values (?,?,?)', [
                firstname, lastname, age
            ], (err, resp, field) => {
                if (resp) {
                    return res.status(200).json({
                        RespCode: 200,
                        RespMessage: 'success'
                    })
                } else {
                    console.log('ERR 2! : Bad sql');
                    return res.status(200).json({
                        RespCode: 400,
                        RespMessage: 'bad: Bad sql',
                        Log: 2
                    })

                }

            })

        } else {
            console.log('ERR 1! : bad: Invalid Request');
            return res.status(200).json({
                RespCode: 400,
                RespMessage: 'bad: Invalid Request',
                Log: 1
            })
        }

    } catch (error) {
        console.log('ERR 0! :', error);
        return res.status(200).json({
            RespCode: 400,
            RespMessage: 'bad',
            Log: 0
        })
    }

})

//readall 
app.get('/api/readalluser', (req, res) => {
    try {
        db.query('select firstname, lastname, age from user', [], (err, data, fil) => {
            if (data && data[0]) {
                return res.status(200).json({
                    RespCode: 200,
                    RespMessage: 'success',
                    Result: data
                })
            } else {
                console.log('ERR 1! : Bad not found');
                return res.status(200).json({
                    RespCode: 400,
                    RespMessage: 'bad! not dound',
                    Log: 1
                })
            }
        })

    } catch (error) {
        console.log('ERR 0! : Bad');
        return res.status(200).json({
            RespCode: 400,
            RespMessage: 'bad',
            Log: 0
        })
    }
})

//rea by id
app.get('/api/readuserbyid', (req, res) => {
    var userid = _.get(req, ["body", "id"]);
    try {
        if (userid) {
            db.query('select firstname, lastname, age from user where id = ?', [
                userid
            ],
                (err, data, fil) => {
                    if (data && data[0]) {
                        return res.status(200).json({
                            RespCode: 200,
                            RespMessage: 'success',
                            Result: data
                        })
                    } else {
                        console.log('ERR 2! : Bad not found');
                        return res.status(200).json({
                            RespCode: 400,
                            RespMessage: 'bad! not found',
                            Log: 2
                        })
                    }
                })
        } else {
            console.log('ERR 1! : Bad id');
            return res.status(200).json({
                RespCode: 400,
                RespMessage: 'bad! not id',
                Log: 1
            })
        }


    } catch (error) {
        console.log('ERR 0! : Bad');
        return res.status(200).json({
            RespCode: 400,
            RespMessage: 'bad',
            Log: 0
        })
    }
})

//update by id
app.put('/api/update', (req, res) => {
    var userid = _.get(req, ["body", "id"]);
    var firstname = _.get(req, ['body', 'firstname']);
    var lastname = _.get(req, ['body', 'lastname']);
    var age = _.get(req, ['body', 'age']);

    try {
        if (userid && firstname && lastname && age) {
            db.query('update user set firstname = ?, lastname = ?, age = ? where id = ?', [
               firstname, lastname, age , parseInt(userid) 
            ], (err, resp, fil) => {
                if (resp) {
                    return res.status(200).json({
                        RespCode: 200,
                        RespMessage: 'success',
                    })
                } else {
                    console.log('ERR 0! : update fail');
                    return res.status(200).json({
                        RespCode: 400,
                        RespMessage: 'bad',
                        Log: 1
                    })
                }
            })
        } else {
            console.log('ERR 0! : Bad no id');
            return res.status(200).json({
                RespCode: 400,
                RespMessage: 'bad',
                Log: 1
            })
        }


    } catch (error) {
        console.log('ERR 0! : Bad');
        return res.status(200).json({
            RespCode: 400,
            RespMessage: 'bad',
            Log: 0
        })
    }
})

// drop by id 
app.delete('a/pi/drop', (req, res) => {
    var userid = _.get(req, ["body", "id"]);
    console.log(userid);
    try {
        if (userid) {
            db.query('delete from user where id = ?', [
              parseInt(userid) 
            ], (err, resp, fil) => {
                if (resp) {
                    return res.status(200).json({
                        RespCode: 200,
                        RespMessage: 'success',
                    })
                } else {
                    console.log('ERR 0! : drop fail');
                    return res.status(200).json({
                        RespCode: 400,
                        RespMessage: 'bad',
                        Log: 1
                    })
                }
            })
        } else {
            console.log('ERR 0! : Bad no id');
            return res.status(200).json({
                RespCode: 400,
                RespMessage: 'bad',
                Log: 1
            })
        }

    } catch (error) {
        console.log('ERR 0! : Bad');
        return res.status(200).json({
            RespCode: 400,
            RespMessage: 'bad',
            Log: 0
        })
    }
})

module.exports = app;

