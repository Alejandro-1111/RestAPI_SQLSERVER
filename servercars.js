const express = require("express");
const app = express();
const cors = require("cors");
const sql = require("mssql");
const conn = require("./config")
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");

app.use(cors());
app.use(bodyParser());
app.all("*", function(res, req, next){
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, DELETE, PUT");
    res.header("Access-Control-Allow-Headers", "Content-Type");
    next();
});


async function sql_run(req, res, command){ //pasar comom aparece aca 
    const pool = new sql.ConnectionPool(conn.databases[0]);
    pool.on("error", err => {console.log(err)});
    try{
        await pool.connect();
        let result = await pool.request().query(command);
        return {
            "success" : result
        };
    }
    catch(err){
        console.log(err);
        return err;
    }
    finally{
        pool.close();
    }
};

app.get('/getall', async function(req, res){
    let cred = req.body;
    let command = `select * from cars`;
    //sql_run(req, res, command);
    res.send(await sql_run(req, res, command))
});

app.post('/insert', function(req, res){
    let cred = req.body;
    let command = `insert into cars(brand, model, miles) values ('${cred.brand}','${cred.model}','${cred.miles}' )`;
    sql_run(req, res, command);
    res.send("Carro Agregado")
});

app.delete('/delete', function(req, res){
    let cred = req.body;
    let command = `delete from cars where brand = '${cred.brand}'`;
    sql_run(req, res, command);
    res.send("Carro Destruido")
});

app.put('/update', function(req, res){
    let cred = req.body;
    let command = `update cars set brand = '${cred.brand}' where model = ${cred.model}`;
    sql_run(req, res, command);
    res.send("Carro Updiado")
});

app.post('/login', function(req, res){
let cred = req.body;
let command = `fundUser '${cred.user}'`;
sql_run(req, res, command);
//let command2 = `select username from users where username =  '${cred.user}'`;
res.send("Carro Agregado")
});



const Port = 3030;
app.listen(Port, ()=>{
    console.log(`App is running on port: ${Port}`)
});