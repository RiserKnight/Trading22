const buyUnit=document.getElementById("buyUnit");
const buyPrice=document.getElementById("buyPrice");
const buyTotal=document.getElementById("buyTotal");
const sellUnit=document.getElementById("sellUnit");
const sellPrice=document.getElementById("sellPrice");
const sellTotal=document.getElementById("sellTotal");


function totalPrice(){
buyTotal.value=(buyUnit.value)*(buyPrice.value);
}

function totalSPrice(){
    sellTotal.value=(sellUnit.value)*(sellPrice.value);
    }