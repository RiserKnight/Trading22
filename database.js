const {sequelize,User,Stock,Events,Favourites,SellOrder,BuyOrder,StockHistory,StockHold}=require('./models')


/*            ****   ***********Create Operations*****************                     */


exports.storeUser=async(userID,name,funds)=>{
   
    try {
        const demoUser=await User.create({userID,name,funds})
    } catch (err) {
        console.log(err);
    }
    return "User Sucessfully stored";
}

exports.storeStock=async(stockID,stockName,ltp,description)=>{
  
    try {
        const demoUser=await Stock.create({stockID,stockName,ltp,description})
    } catch (err) {
        console.log(err);
    }
    return "Stock Sucessfully stored";
}

exports.storeEvent=async(timeStamp,timeValue,description)=>{
  
    try {
        const demoUser=await Events.create({timeStamp,timeValue,description})
    } catch (err) {
        console.log(err);
    }
    return "Event Sucessfully stored";
}

exports.storeFav=async(userID,stockID)=>{

    try {
        const demoUser=await Favourites.create({userID,stockID})
    } catch (err) {
        console.log(err);
    }
    return "Favourite Sucessfully stored";
}

exports.storeBuyOrder=async(userID,stockID,quantity,price)=>{
 
    try {
        const demoUser=await BuyOrder.create({userID,stockID,quantity,price})
    } catch (err) {
        console.log(err);
    }
    return "Buy Order Sucessfully stored";
}
exports.storeSellOrder=async(userID,stockID,quantity,price)=>{
  
    try {
        const demoUser=await SellOrder.create({userID,stockID,quantity,price})
    } catch (err) {
        console.log(err);
    }
    return "Sell Order Sucessfully stored";
}

exports.storeStockHold=async(userID,stockID,quantity,avgPrice)=>{

    try {
        const demoUser=await StockHold.create({userID,stockID,quantity,avgPrice})
    } catch (err) {
        console.log(err);
    }
    return "Stock Hold Sucessfully stored";
}

exports.storeStockHistory=async(stockID,ltp,dateP)=>{

    try {
        const demoUser=await StockHistory.create({stockID,ltp,dateP})
    } catch (err) {
        console.log(err);
    }
    return "Buy Order Sucessfully stored";
}

/* ************************* Read Operations ***************************** */

exports.getBuyOrders=async(stockID)=>{
let orders=[];

    try{
        const ordersQ=await BuyOrder.findAll({
            where:{stockID:stockID}
        });
        ordersQ.forEach((order)=>{
            orders.push({quantity: order.dataValues.quantity,price: order.dataValues.price});
        });
       return orders;
       
        } 
          catch(err){
            console.log(err);
                }
}

exports.getSellOrders=async(stockID)=>{
    let orders=[];
    
        try{
            const ordersQ=await SellOrder.findAll({
                where:{stockID:stockID}
            });
            ordersQ.forEach((order)=>{
                orders.push({quantity: order.dataValues.quantity,price: order.dataValues.price});
            });
           return orders;
           
            } 
              catch(err){
                console.log(err);
                    }
    }