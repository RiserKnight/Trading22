const buyUnit=document.getElementById("buyUnit");
const buyPrice=document.getElementById("buyPrice");
const buyTotal=document.getElementById("buyTotal");
const sellUnit=document.getElementById("sellUnit");
const sellPrice=document.getElementById("sellPrice");
const sellTotal=document.getElementById("sellTotal");
const dashForm=document.getElementById("userDashForm");
const LTPs=document.getElementById("stock_LTP").value;

const LTP=parseInt(LTPs);
function totalBPrice(){
 
if(LTP==buyPrice.value){
    buyPrice.value=LTP+(LTP*0.01);

}
const budget=(buyUnit.value)*(buyPrice.value);
const fee=budget*0.005;
buyTotal.value=budget+fee;

}

function totalSPrice(){
    if(LTP==sellPrice.value){
        sellPrice.value=LTP-(LTP*0.01);
    }   
    const budget=(sellUnit.value)*(sellPrice.value)
    const fee=budget*0.005;
    sellTotal.value=budget-fee;
    }

function headClick(id){
    
    const str="form"+id;
    const dashForm=document.getElementById(str);    
    console.log("Click");
    dashForm.submit();
}