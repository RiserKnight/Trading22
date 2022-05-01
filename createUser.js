const dbFunct = require(__dirname+"/database.js");

exports.createUser=async(userID,userName)=>{
    try{
    await dbFunct.storeUser(userID,userName,100000);
    const stocks= await dbFunct.getStocks();
    stocks.forEach(async(stock)=>{
        await dbFunct.storeStockHold(userID,stock.stockID,100,stock.ltp);
    });
}
    catch(err){
        console.log(error);
    }
    return "User Created Succesfully";
}