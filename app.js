
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const dbFunct = require(__dirname+"/database.js");
const {sequelize}=require('./models')

const app = express();
app.use(express.static(__dirname+"/public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));

app.get("/",(req,res)=>{
  res.sendFile(__dirname+"/views/Main.html");
});

app.get("/Dashboard",(req,res)=>{
  res.render(__dirname+"/views/userSpecific/dashboard");
});

app.get('/users',async(req,res)=>{
  console.log(await dbFunct.storeUser(205,"Admin",100));
  res.send("Ja ");
});

app.listen(3000, async()=> {
    console.log("Server started on port 3000.");
    await sequelize.authenticate();
    console.log("db connected");
  });
  