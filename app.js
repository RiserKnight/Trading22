
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const dbFunct = require(__dirname+"/database.js");
const createFunct = require(__dirname+"/createUser.js");
const dateFunct = require(__dirname+"/date.js");
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
      httpOnly: true,
      expires: new Date(Date.now() + 3600000),
      maxAge: 1*60*60*1000
    }
}));

// This middleware will check if user's cookie is still saved in browser and user is not set, then automatically log the user out.
// This usually happens when you stop your express server after login, your cookie still remains saved in the browser.
/*app.use((req, res, next) => {
  if (req.cookies.user_sid && !req.session.user) {
      res.clearCookie('user_sid');        
  }
  next();
});*/

const userContent = {userID: 0,userName: ' ',userEmail:' ', status: false}; 

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
    //    var userID = 205121002,
      //  password = "123";


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

app.listen(3000, async()=> {
    console.log("Server started on port 3000.");
    await sequelize.authenticate();
    console.log("db connected");
    //console.log(dateFunct.getDate());

    //Run once
  /*
    //Stocks
    await dbFunct.storeStock(1001,"Acc Cement",100,"Nhi bataunga");
    await dbFunct.storeStock(1002,"Reliance",150,"Nhi bataunga");
    await dbFunct.storeStock(1003,"Dabur",200,"Nhi bataunga");

    //Users
    await UserDummy.create({
      userID: 205121002,
      userName: "Aayush Gupta",
      userEmail:"205121002@nitt.edu",
      password: "123"
    });
    await createFunct.createUser(205121002,"Aayush Gupta");
    await UserDummy.create({
      userID: 205121038,
      userName: "Deepak Singh",
      userEmail:"205121038@nitt.edu",
      password: "456"
    });
    await createFunct.createUser(205121038,"Deepak Singh");

   */
  
   /*
     await UserDummy.create({
      userID: 205121043,
      userName: "Himanshu Sathe",
      userEmail:"205121043@nitt.edu",
      password: "789"
    });
    await createFunct.createUser(205121043,"Himanshu Sathe");

    await UserDummy.create({
      userID: 2001,
      userName: "Admin A",
      userEmail:"001@nitt.edu",
      password: "1234"
    });
    await createFunct.createUser(2001,"Admin A");
  
    await UserDummy.create({
      userID: 2002,
      userName: "Admin B",
      userEmail:"002@nitt.edu",
      password: "4567"
    });
    await createFunct.createUser(2002,"Admin B");
    
    await UserDummy.create({
      userID: 2003,
      userName: "Admin C",
      userEmail:"003@nitt.edu",
      password: "7890"
    });
    await createFunct.createUser(2003,"Admin C");
*/

    //Stocks Acc Cement,Reliance,Dabur 1001 1002 1003
    //User Admin A,Admin B,Admin C, 2001 2002 2003
    //stockHold userID,stockID,quantity,avgPrice
});
  
