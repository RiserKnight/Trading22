
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const dbFunct = require(__dirname+"/database.js");
const Date = require(__dirname+"/date.js");
const {sequelize,UserDummy}=require('./models');
const { delBuyOrder } = require("./database");
const cookieParser = require('cookie-parser');
const session = require('express-session');
require('dotenv').config();


const app = express();
app.use(express.static(__dirname+"/public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());


// initialize cookie-parser to allow us access the cookies stored in the browser. 
app.use(cookieParser());

// initialize express-session to allow us track the logged-in user across sessions.
app.use(session({
    key: 'user_sid',
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: 3600000
    }
}));

// This middleware will check if user's cookie is still saved in browser and user is not set, then automatically log the user out.
// This usually happens when you stop your express server after login, your cookie still remains saved in the browser.
app.use((req, res, next) => {
  if (req.cookies.user_sid && !req.session.user) {
      res.clearCookie('user_sid');        
  }
  next();
});

var userContent = {userID: 0,userName: ' ',userEmail:' ', status: false}; 

// middleware function to check for logged-in users
var sessionChecker = (req, res, next) => {
  if (req.session.user && req.cookies.user_sid) {
  
      res.redirect("/");
  } else {
      next();
  }    
};

app.get("/",(req,res)=>{
  res.sendFile(__dirname+"/views/Main.html");
});

app.get("/Dashboard",async(req,res)=>{

  if (req.session.user && req.cookies.user_sid) {
    const stocks= await dbFunct.getStocks();
    userContent.status = true; 
    userContent.userID = req.session.user.userID; 
    userContent.userEmail = req.session.user.userEmail;
    userContent.userName = req.session.user.userName; 
    console.log(JSON.stringify(req.session.user)); 
    res.render(__dirname+"/views/dashboard",{stocks:stocks,user: userContent.userID,userName: userContent.userName});
    } else {
        res.redirect('/login');
    }
  
});

app.get("/stock/:stockID",async(req,res)=>{

const bOrders = await dbFunct.getBuyOrders(req.params.stockID);
const sOrders = await dbFunct.getSellOrders(req.params.stockID);
const stock=await dbFunct.getStock(req.params.stockID);
const LTP = stock.ltp;
const stockName = stock.stockName;

res.render(__dirname+"/views/stockScreen",
{stockID:req.params.stockID,stockName: stockName,LTP:LTP,buyOrders:bOrders,sellOrders:sOrders,userName: userContent.userName})
});

app.get('/users',async(req,res)=>{
  //console.log(await dbFunct.storeUser(205,"Admin",100));
  res.send("Ja ");
});

app.post("/buyOrder/:stockID",async(req,res)=>{
  const amount=req.body.totalBP;
  const user=await dbFunct.getUser(userContent.userID);
  if(user.funds>=amount){
  await dbFunct.storeBuyOrder(userContent.userID,req.params.stockID,req.body.unit,req.body.price);
  }
  const bOrders = await dbFunct.getBuyOrders(stockID);
  const sOrders = await dbFunct.getSellOrders(stockID);
  if(bOrders[0].price>=sOrders[0].price)
  res.redirect("/transaction/"+stockID);
  else
  res.redirect("/stock/"+stockID);
});

app.post("/sellOrder/:stockID",async(req,res)=>{
  const stockID=req.params.stockID;
  const Q= await dbFunct.getUserStockQ(userContent.userID,stockID);
  if(Q>=req.body.unit){
  await dbFunct.storeSellOrder(userContent.userID,stockID,req.body.unit,req.body.price);
  }
  const bOrders = await dbFunct.getBuyOrders(stockID);
  const sOrders = await dbFunct.getSellOrders(stockID);
  if(bOrders[0].price>=sOrders[0].price)
  res.redirect("/transaction/"+stockID);
  else
  res.redirect("/stock/"+stockID);
});




app.route("/login")
.get(sessionChecker, (req, res) => {
    res.sendFile(__dirname + '/views/login.html');
})
.post((req, res) => {
    var userID = req.body.userID,
        password = req.body.password;

    UserDummy.findOne({ where: { userID: userID } }).then(function (user) {

        if (!user) {
            res.redirect("/login");
        } else if (!user.validPassword(password)) {
            res.redirect("/login");
        } else {
            req.session.user = user.dataValues;
            res.redirect("/Dashboard");
        }
    });
});
   // route for user logout
   app.get('/logout', (req, res) => {
    if (req.session.user && req.cookies.user_sid) {
    userContent.status = false; 
        res.clearCookie('user_sid');
    console.log(JSON.stringify(userContent)); 
        res.redirect('/');
    } else {
        res.redirect('/login');
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

    //Run once
 /*
    dbFunct.storeStock(1001,"Acc Cement",100,"Nhi bataunga");
    dbFunct.storeStock(1002,"Reliance",150,"Nhi bataunga");
    dbFunct.storeStock(1003,"Dabur",200,"Nhi bataunga");
    UserDummy.create({
      userID: 205121002,
      userName: "Aayush Gupta",
      userEmail:"205121002@nitt.edu",
      password: "123"
    });
    dbFunct.storeUser(205121002,"Aayush Gupta",100000);
    UserDummy.create({
      userID: 205121038,
      userName: "Deepak Singh",
      userEmail:"205121038@nitt.edu",
      password: "456"
    });
    dbFunct.storeUser(205121038,"Deepak Singh",100000);
    UserDummy.create({
      userID: 205121043,
      userName: "Himanshu Sathe",
      userEmail:"205121043@nitt.edu",
      password: "789"
    });
    dbFunct.storeUser(205121043,"Himanshu Sathe",100000);
    UserDummy.create({
      userID: 2001,
      userName: "Admin A",
      userEmail:"001@nitt.edu",
      password: "1234"
    });
    dbFunct.storeUser(2001,"Admin A",100000000);
  
    UserDummy.create({
      userID: 2002,
      userName: "Admin B",
      userEmail:"002@nitt.edu",
      password: "4567"
    });
    dbFunct.storeUser(2002,"Admin B",100000000);
    
    UserDummy.create({
      userID: 2003,
      userName: "Admin C",
      userEmail:"003@nitt.edu",
      password: "7890"
    });
    dbFunct.storeUser(2003,"Admin C",100000000);

    dbFunct.storeStockHold(2001,1001,2000,100);
    dbFunct.storeStockHold(2002,1001,1000,110);
    dbFunct.storeStockHold(2003,1001,500,90);
    dbFunct.storeStockHold(205121002,1001,200,100);
    dbFunct.storeStockHold(205121038,1001,200,100);
    dbFunct.storeStockHold(205121043,1001,200,100);
     */


    //Stocks Acc Cement,Reliance,Dabur 1001 1002 1003
    //User Admin A,Admin B,Admin C, 2001 2002 2003

    

});
  
