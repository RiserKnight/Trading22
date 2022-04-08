
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const dbFunct = require(__dirname+"/database.js");
const Date = require(__dirname+"/date.js");
const {sequelize}=require('./models');
const { delBuyOrder } = require("./database");

let dashUser=2001;
const app = express();
app.use(express.static(__dirname+"/public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());


app.get("/",(req,res)=>{
  res.sendFile(__dirname+"/views/Main.html");
});

app.get("/Dashboard",async(req,res)=>{
  const stocks= await dbFunct.getStocks();
  const result=await dbFunct.checkUserID(dashUser);
  if(result){
    res.render(__dirname+"/views/dashboard",{stocks:stocks,user: dashUser});
  }
  else{
    res.redirect("/login")
  }
  
});

app.get("/stock/:stockID",async(req,res)=>{

const bOrders = await dbFunct.getBuyOrders(req.params.stockID);
const sOrders = await dbFunct.getSellOrders(req.params.stockID);
const stock=await dbFunct.getStock(req.params.stockID);
const LTP = stock.ltp;
const stockName = stock.stockName;

res.render(__dirname+"/views/stockScreen",
{stockID:req.params.stockID,stockName: stockName,LTP:LTP,buyOrders:bOrders,sellOrders:sOrders})
});

app.get('/users',async(req,res)=>{
  //console.log(await dbFunct.storeUser(205,"Admin",100));
  res.send("Ja ");
});

app.post("/buyOrder/:stockID",async(req,res)=>{
  const amount=req.body.totalBP;
  const user=await dbFunct.getUser(dashUser);
  if(user.funds>=amount){
  await dbFunct.storeBuyOrder(dashUser,req.params.stockID,req.body.unit,req.body.price);
  }
  res.redirect("/stock/"+req.params.stockID);
});

app.post("/sellOrder/:stockID",async(req,res)=>{
  const stockID=req.params.stockID;
  const Q= await dbFunct.getUserStockQ(dashUser,stockID);
  if(Q>=req.body.unit){
  await dbFunct.storeSellOrder(dashUser,stockID,req.body.unit,req.body.price);
  }
  res.redirect("/stock/"+stockID);
});
app.get("/login",(req,res)=>{
  res.sendFile(__dirname+"/views/Login.html");
});

app.post("/login",async(req,res)=>{
dashUser=req.body.dashUser;
const result=await dbFunct.checkUserID(dashUser);
if(result){
res.redirect("/Dashboard");
}
else{
  res.send("Incorrect ID");
}
});
app.get("/transaction/:stockID",async(req,res)=>{
  const stockID=req.params.stockID;
  const bOrders = await dbFunct.getBuyOrders(stockID);
  const sOrders = await dbFunct.getSellOrders(stockID);
  if(bOrders[0].price>=sOrders[0].price){
    const bQ=bOrders[0].quantity;
    const sQ=sOrders[0].quantity;
    const bP=bOrders[0].price;
    const bID=bOrders[0].id;
    const sID=sOrders[0].id;
    const bUID=bOrders[0].userID;
    const sUID=sOrders[0].userID;
    console.log(bOrders[0]);
    console.log(sOrders[0]);
    
    let oQ;
    if(bQ>=sQ){
     oQ=bQ-sQ;
     }
     else if(sQ>bQ){
     oQ=sQ-bQ;
     }
    
     const amount=oQ*bP;
     const fee=0.005*amount;
     const bAmount=amount+fee;
     const sAmount=amount-fee;
    
     const bUser=await dbFunct.getUser(bUID);
     //checking buyer has enough funds or not
     if(bUser.funds<bAmount){
      await dbFunct.delBuyOrder(bID);
       res.redirect("/stock/"+stockID);
     }
    
     const Q= await dbFunct.getUserStockQ(sUID,stockID);
     //checking seller has enough stocks or not
    if(Q<oQ){
      await dbFunct.delSellOrder(sID);
      res.redirect("/stock/"+stockID);
    }
    
    const bFunds=bUser.funds-bAmount;
    const sUser=await dbFunct.getUser(bUID);
    const sFunds=sUser.funds+sAmount;

    const buyerStock= await dbFunct.getUserStock(bUID,stockID);
      const preAvgPrice=buyerStock.avgPrice;
      const preQ=buyerStock.quantity;
      const avgPrice=(preQ*preAvgPrice+amount)/(preQ+oQ);
    
      const sellerStock= await dbFunct.getUserStock(bUID,stockID);
      const sellerAvgPrice=sellerStock.avgPrice;
      const sellerQ=sellerStock.quantity-oQ;
    
    try{
         //checking buyer has stocks or not
    result=await dbFunct.checkUserStock(bUID,stockID);
    //buyer stock
    if(result){
      await dbFunct.updateStockHold(bUID,stockID,oQ,avgPrice);
      //update + update avgPrice
    } 
    else{
      //create
      console.log(await dbFunct.storeStockHold(bUID,stockID,oQ,bP));
    }
    //seller stock deduct
    await dbFunct.updateStockHold(bUID,stockID,sellerQ,sellerAvgPrice);
    
    //buyer fund deduct
    await dbFunct.updateFunds(bUID,bFunds);
     
    //seller fund add
    await dbFunct.updateFunds(bUID,sFunds);
     
     //add fee

    }
    catch(err){
      console.log(err);
          }
          const d = new Date();
          const timeStamp=d.getTime();
    // add transaction
    await dbFunct.storeTransactionHistory(bUID,sUID,stockID,oQ,bP,amount,timeStamp)

    //stock LTP update
    await dbFunct.updateLTP(stockID,bP);

    //update stock History
    
    console.log(await storeStockHistory(stockID,bP,timeStamp));

    // check bQ,oQ, update buy order
    if(bQ==oQ){
     await dbFunct.delBuyOrder(bID);
    }
    else if(bQ>oQ){
      await dbFunct.updateBuyOrder(bID,(bQ-oQ));
    }
    // check sQ,oQ, update sell order
    if(sQ==oQ){
      await dbFunct.delSellOrder(sID);
     }
     else if(sQ>oQ){
       await dbFunct.updateSellOrder(sID,(sQ-oQ));
     }

  }
  res.redirect("/stock/"+stockID);
});

app.listen(3000, async()=> {
    console.log("Server started on port 3000.");
    await sequelize.authenticate();
    console.log("db connected");
    console.log(Date.getDate());

    //dbFunct.storeStockHold(2001,1001,2000,50);
    //Stocks Acc Cement,Reliance,Dabur 1001 1002 1003
    //User Admin A,Admin B,Admin C, 2001 2002 2003
/*
    dbFunct.storeUser(2001,"Admin A",100000000);
    dbFunct.storeUser(2002,"Admin B",100000000);
    dbFunct.storeUser(2003,"Admin C",100000000);
    dbFunct.storeStock(1001,"Acc Cement",100,"Nhi bataunga");
    dbFunct.storeStock(1002,"Reliance",150,"Nhi bataunga");
    dbFunct.storeStock(1003,"Dabur",200,"Nhi bataunga");
*/});
  
 /*
 app.listen(3000,()=>{
   console.log(Date.getDate());
 })*/