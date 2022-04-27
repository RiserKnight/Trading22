const dbFunct = require(__dirname+"/database.js");

exports.createUser=async(userID,userName)=>{
    await dbFunct.storeUser(userID,userName,100000);
    const stocks= await dbFunct.getStocks();
    stocks.forEach(async(stock)=>{
        await dbFunct.storeStockHold(userID,stock.stockID,100,stock.ltp);
    });
    return "User Created Succesfully";
}