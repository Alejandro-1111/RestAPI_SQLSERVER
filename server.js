const express = require("express");
const app = express();
const cors = require("cors");
const sql = require("mssql");
const conn = require("./config")
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");//call the bycrypt to hash the password
const { query } = require("express");

app.use(cors());
app.use(bodyParser());
app.all("*", function(res, req, next){
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, DELETE, PUT");
    res.header("Access-Control-Allow-Headers", "Content-Type");
    next();
});


async function sql_run(req, res, command){ //pasar comom aparece aca 
    //req.body
    //let cred = req.body;
    //let command = `insert into users(username, pass, email) values ('${cred.user}','${cred.pass}','${cred.email}' )`;
    const pool = new sql.ConnectionPool(conn.databases[0]);
    pool.on("error", err => {console.log(err)});
    //pool.on("success", succ => {console.log(succ)});
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


app.get('/getall', function(req, res){
    let cred = req.res;
    let command = `select * from Users`;
    sql_run(req, res, command);
});

app.post('/insert', function(req, res){
    let cred = req.body;
    let command = `insert into cars(brand, model, miles) values ('${cred.brand}','${cred.model}','${cred.miles}' )`;
    sql_run(req, res, command);
    res.send("Carro Agregado")
});

app.delete('/delete', function(req, res){
    let cred = req.body;
    let command = `delete from users where username = '${cred.brand}'`;
    sql_run(req, res, command);
    res.send("User Borrado")
});

app.post('/register', function(req, res){//declarate the way to call this post
    let cred = req.body;//call the logic of the code
    bcrypt.hash(cred.pass, 10, async function(err, hash){//hash that going to use and the rounds that are the nomber 10
        let command = `insert into users(username, pass, email) values ('${cred.user}','${hash}','${cred.email}' )`;
        //what need to write to posted correctly and the part of the password that are need for register it hashed
        sql_run(req, res, command);//run with the sql and the commands in the code
    });
    res.send("hasheado")//send a message of confirmation
});

//app.delete('/delete' function(req, res){
  //  sql_run(req, res);
//})
app.post('/login', async function(req, res){
    let cred = req.body;
    let command = `fundUser '${cred.user}'`;
    const  ver = await sql_run(req, res, command);
    const hash = await ver.success.recordset[0].pass;
    const compare = await bcrypt.compare (cred.pass,hash);
    res.send(compare)
    });
    


const Port = 3000;
app.listen(Port, ()=>{
    //console.log("App is running on port:" + Port)
    console.log(`App is running on port: ${Port}`)
});