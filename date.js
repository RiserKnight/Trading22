
//time Stamp of everyting will be according to getTime()


const eventDate = new Date(2022,3,29,10,0,0);//year,month,date,hour,minutes,seconds
//remember month 0-11
eventDate.setMilliseconds(0);




exports.getDate=function(){
const ran = new Date(2011,2,1,0,0,0);
ran.setMilliseconds(0);
const num=ran.getTime();

const today = new Date();
    
today.setTime(1300233600000);
const yyyy=today.getFullYear();
const mm=today.getMonth()+1;
const dd=today.getDate();
const hh=today.getHours();
const min=today.getMinutes();
const sec=today.getSeconds();
const toR=yyyy+"/"+mm+"/"+dd+"-"+hh+":"+min+":"+sec;
return toR;

}


    /*
    const d = new Date();
    d.setFullYear(2020, 11, 3);

setDate()	Set the day as a number (1-31)
setFullYear()	Set the year (optionally month and day)
setHours()	Set the hour (0-23)
setMilliseconds()	Set the milliseconds (0-999)
setMinutes()	Set the minutes (0-59)
setMonth()	Set the month (0-11)
setSeconds()	Set the seconds (0-59)
setTime()	Set the time (milliseconds since January 1, 1970)
*/

/*
const today = new Date();
const someday = new Date();
someday.setFullYear(2100, 0, 14);

if (someday > today)
*/

/*
You can also pass in the year, month, day, hours, minutes, and seconds as separate arguments:

const date = new Date(2016, 6, 27, 13, 30, 0);
*/
/*
getFullYear()	Get the year as a four digit number (yyyy)
getMonth()	Get the month as a number (0-11)
getDate()	Get the day as a number (1-31)
getHours()	Get the hour (0-23)
getMinutes()	Get the minute (0-59)
getSeconds()	Get the second (0-59)
getMilliseconds()	Get the millisecond (0-999)
getTime()	Get the time (milliseconds since January 1, 1970)
getDay()	Get the weekday as a number (0-6)
*/