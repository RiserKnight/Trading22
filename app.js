
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const dbFunct = require(__dirname+"/database.js");
const Date = require(__dirname+"/date.js");
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
  res.render(__dirname+"/views/dashboard");
});

app.get("/stock/:stockID",async(req,res)=>{
const bOrders = await dbFunct.getBuyOrders(req.params.stockID);
const sOrders = await dbFunct.getSellOrders(req.params.stockID);

res.render(__dirname+"/views/stockScreen",
{stockID:req.params.stockID,stockName: "Acc cement",buyOrders:bOrders,sellOrders:sOrders})
});

app.get('/users',async(req,res)=>{
  console.log(await dbFunct.storeUser(205,"Admin",100));
  res.send("Ja ");
});

app.post("/buyOrder/:stockID",async(req,res)=>{
  await dbFunct.storeBuyOrder(123,req.params.stockID,req.body.unit,req.body.price);
  res.redirect("/stock/"+req.params.stockID);
});

app.post("/sellOrder/:stockID",async(req,res)=>{
  await dbFunct.storeSellOrder(123,req.params.stockID,req.body.unit,req.body.price);
  res.redirect("/stock/"+req.params.stockID);
});

app.listen(3000, async()=> {
    console.log("Server started on port 3000.");
    await sequelize.authenticate();
    console.log("db connected");
    console.log(Date.getDate());
    //dbFunct.storeUser(123,"Baap",100000000);
    //dbFunct.storeStock(1001,"Acc Cement",50,"Nhi bataunga")
  });
  
 /*
 app.listen(3000,()=>{
   console.log(Date.getDate());
 })*/