// console.log(module)

module.exports.getdate =  getdate; //paranthesis will call the  function but we dont want it right now
//exports.getdate = getdate ;

function getdate(){

    var date = new Date();
     
    var options ={
        weekday: "long",
        day: "numeric",
        month : "long"
    };
    var day = date.toLocaleDateString("en-US" ,options);
    return day;
}
