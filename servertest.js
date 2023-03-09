const express = require("express");
const bodyparser = require("body-parser");
const app = express();
const cors = require("cors");
const env = require("dotenv");
const { use } = require("passport");
env.config({
    path :"./config.env",
})

app.use(cors());
app.use(bodyparser.json({limit : "100mb"}))
app.all("*", function(res, req, next){
    res.header("Access-Control-Allow-Origin" , "*" );
    res.header("Access-Control-Allow-Methods" , "GET , POST , DELETE , PUT");
    res.header("Access-Control-Allow-Headers" , "content-Type");
    next();
})

const DB = [
    {
       username : "Alejandro",
       password : "1234"
    },
    {
        username: "Kevin",
        password: "1245" 
    },
    {
        username: "Miguel",
        password: "1456"
    },
];

app.post("/newuser", function(req,res){
    let user = req.body;
    DB.push(user);
    res.send(DB);
});
app.get("/getalluser", function(req,res){
    res.send(DB);
});
app.delete("/deleteuser", function(req, res){
    DB.splice(1, 1);
    res.send(DB)
});
app.put("/putuser", function(req, res){
    DB[0]= req.body;
    res.send(DB);
});




app.get('/', function(req,res){
    let num1= 4;
    let num2= 4;
    let result= num1 + num2;
    res.send(`Tu suma es, + ${result}`);
});

const port = process.env.PORT||3030;
app.listen(port, ()=>{
    console.log(`App is runing on  port: ${port}`)
});
//no olvidar instalar el node, express, const