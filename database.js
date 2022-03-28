const {sequelize,User,Stock,Events,Favourites,SellOrder,BuyOrder,StockHistory,StockHold}=require('./models')

exports.storeUser=async(userID,name,funds)=>{
    await sequelize.authenticate();
    console.log("db connected");
    try {
        const demoUser=await User.create({userID,name,funds})
    } catch (err) {
        console.log(err);
    }
    return "User Sucessfully stored";
}

exports.storeStock=async(stockID,stockName,ltp,description)=>{
    await sequelize.authenticate();
    console.log("db connected");
    try {
        const demoUser=await Stock.create({stockID,stockName,ltp,description})
    } catch (err) {
        console.log(err);
    }
    return "Stock Sucessfully stored";
}

exports.storeEvent=async(timeStamp,timeValue,description)=>{
    await sequelize.authenticate();
    console.log("db connected");
    try {
        const demoUser=await Events.create({timeStamp,timeValue,description})
    } catch (err) {
        console.log(err);
    }
    return "Event Sucessfully stored";
}

exports.storeFav=async(userID,stockID)=>{
    await sequelize.authenticate();
    console.log("db connected");
    try {
        const demoUser=await Favourites.create({userID,stockID})
    } catch (err) {
        console.log(err);
    }
    return "Favourite Sucessfully stored";
}

exports.storeBuyOrder=async(userID,stockID,quantity,price)=>{
    await sequelize.authenticate();
    console.log("db connected");
    try {
        const demoUser=await SellOrder.create({userID,stockID,quantity,price})
    } catch (err) {
        console.log(err);
    }
    return "Buy Order Sucessfully stored";
}
exports.storeSellOrder=async(userID,stockID,quantity,price)=>{
    await sequelize.authenticate();
    console.log("db connected");
    try {
        const demoUser=await BuyOrder.create({userID,stockID,quantity,price})
    } catch (err) {
        console.log(err);
    }
    return "Sell Order Sucessfully stored";
}

exports.storeStockHold=async(userID,stockID,quantity,avgPrice)=>{
    await sequelize.authenticate();
    console.log("db connected");
    try {
        const demoUser=await StockHold.create({userID,stockID,quantity,avgPrice})
    } catch (err) {
        console.log(err);
    }
    return "Stock Hold Sucessfully stored";
}

exports.storeStockHistory=async(stockID,ltp,dateP)=>{
    await sequelize.authenticate();
    console.log("db connected");
    try {
        const demoUser=await StockHistory.create({stockID,ltp,dateP})
    } catch (err) {
        console.log(err);
    }
    return "Buy Order Sucessfully stored";
}