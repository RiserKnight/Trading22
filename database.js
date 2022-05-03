const {sequelize,TransactionHistory,User,Stock,Event,Favourites,SellOrder,BuyOrder,StockHistory,StockHold}=require('./models')


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

exports.storeEvent=async(eventID,timeStamp,heading,description)=>{
  
    try {
        await Event.create({eventID,timeStamp,heading,description})
    } catch (err) {
        console.log(err);
    }
    return "Event Sucessfully stored";
}

exports.storeFav=async(userID,stockID)=>{

    try {
       await Favourites.create({userID,stockID})
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
    return "Stock History Sucessfully stored";
}
exports.storeTransactionHistory=async(buyerID,sellerID,stockID,quantity,price,amount,timeStamp)=>{

    try {
        const demoUser=await TransactionHistory.create({buyerID,sellerID,stockID,quantity,price,amount,timeStamp})
    } catch (err) {
        console.log(err);
    }
    return "Transaction History Sucessfully stored";
}
/* ************************* Read Operations ***************************** */

exports.getBuyOrders=async(stockID)=>{
let orders=[];

    try{
        const ordersQ=await BuyOrder.findAll({
            order:[["price","DESC"]],
            where:{stockID:stockID}
        });
        ordersQ.forEach((order)=>{
            orders.push(order.dataValues);
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
                order:[["price","ASC"]],
                where:{stockID:stockID}
            });
            ordersQ.forEach((order)=>{
                orders.push(order.dataValues);
            });
           return orders;
           
            } 
              catch(err){
                console.log(err);
                    }
    }

exports.getStock=async(stockID)=>{
        try{
            const demo=await Stock.findOne({
                where:{stockID:stockID}
            });
            if(demo)             
               return demo.dataValues;
               else
               return 0;
            } 
              catch(err){
                console.log(err);
                    }
    }
    
exports.getUser=async(userID)=>{
            try{
                const demo=await User.findOne({
                    where:{userID:userID}
                });
               if(demo)             
               return demo.dataValues;
               else
               return 0
                } 
                  catch(err){
                    console.log(err);
                        }
        }
exports.getEvent=async(eventID)=>{
            try{
                const demo=await Event.findOne({
                    where:{eventID:eventID}
                });
               if(demo)             
               return demo.dataValues;
               else
               return 0
                } 
                  catch(err){
                    console.log(err);
                        }
        }
exports.getStocks=async()=>{
            let stocks=[];
            
                try{
                    const demo=await Stock.findAll({
                    });
                    demo.forEach((order)=>{
                        stocks.push(order.dataValues);
                    });
                    return stocks;
                   
                    } 
                      catch(err){
                        console.log(err);
                            }
            }
exports.getEvents=async()=>{
                let events=[];
                
                    try{
                        const demo=await Event.findAll({
                        });
                        demo.forEach((event)=>{
                            events.push(event.dataValues);
                        });
                        return events;
                       
                        } 
                          catch(err){
                            console.log(err);
                                }
}
exports.checkUserID=async(userID)=>{
                try{
                    let count=0
                    count=await User.count({
                        where:{userID:userID}
                    });
                    let res=false;
                    if(count>0){res=true;}
                    return res;
                    } 
                      catch(err){
                        console.log(err);
                            }
            }

exports.getUserStockQ=async(userID,stockID)=>{
                
                    try{
                        const demo=await StockHold.findOne({
                            where:{userID:userID,stockID:stockID}
                        });
                        
                        return demo.quantity;
                       
                        } 
                          catch(err){
                            console.log(err);
                                }
                }
exports.getUserStock=async(userID,stockID)=>{
                
                    try{
                        const demo=await StockHold.findOne({
                            where:{userID:userID,stockID:stockID}
                        });
                        
                        return demo;
                       
                        } 
                          catch(err){
                            console.log(err);
                                }
                }
exports.checkUserStock=async(userID,stockID)=>{

                        try{
                            let count=0;
                            count=await StockHold.count({
                                where:{userID:userID,stockID:stockID}
                            });
                            let res=false;
                            if(count>0){res=true;}
                            return res;
                           
                            } 
                              catch(err){
                                console.log(err);
                                    }
                    }
/* ************************* Delete Operations ***************************** */

exports.delSellOrder=async(orderID)=>{
    
        try{
            const orderQ=await SellOrder.findOne({
                where:{id:orderID}
            });
             await orderQ.destroy();
           
            } 
              catch(err){
                console.log(err);
                    }
    }
exports.delBuyOrder=async(orderID)=>{
    
        try{
            const orderQ=await BuyOrder.findOne({
                where:{id:orderID}
            });
             await orderQ.destroy();
           
            } 
              catch(err){
                console.log(err);
                    }
    }


/* ************************* Update Operations ***************************** */

exports.updateBuyOrder=async(buyID,Q)=>{
    try{
        const orderQ=await BuyOrder.update(
            {quantity: Q},
            {where:{id:buyID}
        });
    }
    catch(err){
        console.log(err);
            }
}
exports.updateSellOrder=async(sellID,Q)=>{
    try{
        const orderQ=await SellOrder.update(
            {quantity: Q},
            {where:{id:sellID}
        });
    }
    catch(err){
        console.log(err);
            }
}
exports.updateStockHold=async(userID,stockID,Q,avgPrice)=>{

    try{
        const demo=await StockHold.update(
            {quantity:Q,avgPrice:avgPrice},
            {where:{userID:userID,stockID:stockID}}
            );

       
        } 
          catch(err){
            console.log(err);
                }
}

exports.updateFunds=async(userID,funds)=>{
    try{
         const demo= await User.update(
             {funds:funds},
             {where:{userID:userID}}
         );
    }
    catch(err){
        console.log(err);
            }
}

exports.updateLTP=async(stockID,LTP)=>{
    try{
         const demo= await Stock.update(
             {ltp:LTP},
             {where:{stockID:stockID}}
         );
    }
    catch(err){
        console.log(err);
            }
}