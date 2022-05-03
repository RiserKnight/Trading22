
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const dbFunct = require(__dirname+"/database.js");
const createFunct = require(__dirname+"/createUser.js");
const dateFunct = require(__dirname+"/date.js");
const {sequelize}=require('./models');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const axios = require('axios');
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
    resave: true,
    saveUninitialized: false,
    cookie: {
      path: '/',
      httpOnly: true,
      maxAge: 1*60*60*1000
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

let userContent = {userID: 0,userName: ' ',userEmail:' ', status: false}; 

// middleware function to check for logged-in users
var sessionChecker = (req, res, next) => {
  if (req.session.user && req.cookies.user_sid) {
      
      res.redirect("/");
  } else {
      next();
  }    
};
const randText="Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.";

app.get("/",(req,res)=>{
  res.sendFile(__dirname+"/views/Main.html");
});

app.get("/Dashboard",async(req,res)=>{
   
  if (req.session.user && req.cookies.user_sid) {
    console.log("Auto LogOut Time: -"+req.session.cookie.expires.toLocaleString('en-US', {timeZone: "Asia/Kolkata"}));
    const stocks= await dbFunct.getStocks();
    userContent.status = true; 
    userContent.userID = req.session.user.userID; 
    userContent.userEmail = req.session.user.userEmail;
    userContent.userName = req.session.user.userName; 
    var hour = 3600000
    req.session.cookie.expires = new Date(Date.now() + hour)
    console.log("User Session DashBoard "+JSON.stringify(req.session.user)); 
    const userFund = await dbFunct.getUser(userContent.userID);
    res.render("StockList",{userName:userContent.userName,stocks:stocks,userFund:userFund.funds});
    
    } else {
        res.redirect('/login');
    }
  
});

app.get("/stock/:stockID",async(req,res)=>{
  var hour = 3600000
  req.session.cookie.expires = new Date(Date.now() + hour);
const bOrders = await dbFunct.getBuyOrders(req.params.stockID);
const sOrders = await dbFunct.getSellOrders(req.params.stockID);
const stock=await dbFunct.getStock(req.params.stockID);
const userFund = await dbFunct.getUser(userContent.userID);
const LTP = stock.ltp;
const stockName = stock.stockName;

res.render(__dirname+"/views/stockScreen",
{stockID:req.params.stockID,stockName: stockName,LTP:LTP,userFund:userFund.funds,
  buyOrders:bOrders,sellOrders:sOrders,userName: userContent.userName})
});

app.get('/users',async(req,res)=>{
  //console.log(await dbFunct.storeUser(205,"Admin",100));
  res.send("Ja ");
});

app.post("/buyOrder/:stockID",async(req,res)=>{

  const stockID=parseInt(req.params.stockID);
  const amount=parseInt(req.body.totalBP);

  const user=await dbFunct.getUser(userContent.userID);
  
  if(user.funds>=amount){
  await dbFunct.storeBuyOrder(userContent.userID,req.params.stockID,req.body.unit,req.body.price);
  }
  const bOrders = await dbFunct.getBuyOrders(stockID);
  const sOrders = await dbFunct.getSellOrders(stockID);
  if(bOrders[0]&&sOrders[0]){
  if(bOrders[0].price>=sOrders[0].price)
  res.redirect("/transaction/"+stockID);
  else
  res.redirect("/stock/"+stockID);
  }
  else
  res.redirect("/stock/"+stockID);
  
});

app.post("/sellOrder/:stockID",async(req,res)=>{
  const stockID=req.params.stockID;
  const quantity=parseInt(req.body.unit);
  const Q= await dbFunct.getUserStockQ(userContent.userID,stockID);
  if(Q>=quantity){
  await dbFunct.storeSellOrder(userContent.userID,stockID,req.body.unit,req.body.price);
  }
  const bOrders = await dbFunct.getBuyOrders(stockID);
  const sOrders = await dbFunct.getSellOrders(stockID);
  if(bOrders[0]&&sOrders[0]){
    if(bOrders[0].price>=sOrders[0].price)
    res.redirect("/transaction/"+stockID);
    else
    res.redirect("/stock/"+stockID);
    }
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
      const url ="https://main.pcc.events/centralized/"+userID+"/"+password;

    
    axios
    .post(url)
    .then(async(response)=> {
      console.log(`statusCode: ${response.status}`);
      const Data = JSON.parse(response.data)
      console.log("User: "+userID+" Password: "+password+" Data: ");
      console.log(Data);
      if(Data.status){
        req.session.user={
          userID:Data.rollNo,
          userName:Data.userName,
          userEmail:Data.email,
          status:Data.status
        }
        userContent=req.session.user;
        const userNew=await dbFunct.getUser(userID);
        if(!userNew){
          console.log(await createFunct.createUser(userContent.userID,userContent.userName));
        }
        res.redirect("/Dashboard");
      }
      else
      res.redirect("/login");
    })
    .catch(error => {
      console.error(error);
    });

  
});
   // route for user logout
   app.get('/logout', (req, res) => {
    if (req.session.user && req.cookies.user_sid) {
    userContent.status = false; 
        res.clearCookie('user_sid');
    console.log("User Content Logout "+JSON.stringify(userContent)); 
        res.redirect('/');
    } else {
        res.redirect('/login');
    }
  });

app.get("/transaction/:stockID",async(req,res)=>{
  console.log("\n\n**********Transaction Route**********\n\n");
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
    console.log("Buy Order: "+JSON.stringify(bOrders[0]));
    console.log("Sell Order: "+JSON.stringify(sOrders[0]));
    console.log("Buy Quantity: "+bQ);
    console.log("Sell Quantity: "+sQ);
    console.log("Buy Order ID "+bID);
    console.log("Sell Order ID "+sID);
    console.log("Buyer ID "+bUID);
    console.log("Seller ID "+sUID);
    console.log("Buying Price "+bP);
    
    let oQ=0;
    if(bQ>=sQ){
     oQ=sQ;
     }
     else if(sQ>bQ){
     oQ=bQ;
     }
    console.log("Obsolute Quantity"+oQ);
     const amount=oQ*bP;
     const fee=0.005*amount;
     const bAmount=amount+fee;
     const sAmount=amount-fee;
     console.log("Buyer Amount "+bAmount);
     console.log("Seller Amount "+sAmount);
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
    
    const bFunds=parseInt(bUser.funds)-bAmount;
    const sUser=await dbFunct.getUser(sUID);
    const sFunds=parseInt(sUser.funds)+sAmount;

    const buyerStock= await dbFunct.getUserStock(bUID,stockID);
      const preAvgPrice=parseInt(buyerStock.avgPrice);
      const preQ=parseInt(buyerStock.quantity);
      const avgPrice=parseInt((preQ*preAvgPrice+amount)/(preQ+oQ));
    
      const sellerStock= await dbFunct.getUserStock(sUID,stockID);
      const sellerAvgPrice=parseInt(sellerStock.avgPrice);
      const sellerQ=parseInt(sellerStock.quantity)-oQ;
    
    try{
         //checking buyer has stocks or not
    result=await dbFunct.checkUserStock(bUID,stockID);
    //buyer stock
    if(result){
      console.log("Update Buyer Stock Hold Quantity "+(preQ+oQ));
      await dbFunct.updateStockHold(bUID,stockID,preQ+oQ,avgPrice);
      //update + update avgPrice
    } 
    else{
      //create
      console.log("Create Buyer Stock Hold Quantity "+(preQ+oQ));
      console.log(await dbFunct.storeStockHold(bUID,stockID,oQ,bP));
    }
    //seller stock deduct
    await dbFunct.updateStockHold(sUID,stockID,sellerQ,sellerAvgPrice);
    console.log("Update Seller Hold ID,Quantity,sellerAvgPrice "+sUID
    +" "+sellerQ+" "+sellerAvgPrice);

    //buyer fund deduct
    await dbFunct.updateFunds(bUID,bFunds);
    console.log("Buyer ID,Fund "+bUID+" "+bFunds);

    //seller fund add
    await dbFunct.updateFunds(sUID,sFunds);
    console.log("Seller ID,Fund "+sUID+" "+sFunds);
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
    
    console.log(await dbFunct.storeStockHistory(stockID,bP,timeStamp));

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
app.get("/news",async(req,res)=>{
  let events=[];

  const eventsRaw = await dbFunct.getEvents();
  eventsRaw.forEach((event)=>{
   const eDate = new Date();
   eDate.setTime(event.timeStamp);
   const timeStamp=eDate.toLocaleDateString('en-us', { weekday:"long", year:"numeric", month:"short", day:"numeric"});
   events.push({
    eventID: event.eventID,
    heading: event.heading,
    timeStamp: timeStamp}); 
  });
  console.log(events);
  res.render("Headlines",{events:events});
});

app.get("/news/:eventID",async(req,res)=>{
const eventID=req.params.eventID;
const event = await dbFunct.getEvent(eventID);
console.log(event);
res.render("news");
});

app.listen(3000, async()=> {
    console.log("Server started on port 3000.");
    await sequelize.authenticate();
    console.log("db connected");

        const userNew1=await dbFunct.getUser(2001);
        if(!userNew1){
          await dbFunct.storeUser(2001,"Trading Admin A",10000000);
          await dbFunct.storeUser(2002,"Trading Admin B",10000000);
          await dbFunct.storeUser(2003,"Trading Admin C",10000000);
        }
        const stockNew1=await dbFunct.getStock(1001);
        if(!stockNew1){
          await dbFunct.storeStock(1001,"Acc Cement",100,"Nhi bataunga");
          await dbFunct.storeStock(1002,"Reliance",150,"Nhi bataunga");
          await dbFunct.storeStock(1003,"Dabur",200,"Nhi bataunga");
        }
        const eventNew1=await dbFunct.getEvent(3001);
        if(!eventNew1){
          await dbFunct.storeEvent(3001,1641011400000,"Ye hai melody 1 Jan",randText);
          await dbFunct.storeEvent(3002,1641097800000,"Ye hai melody 2 Jan",randText);
          await dbFunct.storeEvent(3003,1641184200000,"Ye hai melody 3 Jan",randText);
          await dbFunct.storeEvent(3004,1641270600000,"Ye hai melody 4 Jan",randText);
          await dbFunct.storeEvent(3005,1641357000000,"Ye hai melody 5 Jan",randText);
          await dbFunct.storeEvent(3006,1654057800000,"Ye hai melody 1 June",randText);
        } 
       
   
  });
  
