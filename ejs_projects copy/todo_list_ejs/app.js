const express = require("express");
// const date = require(__dirname + "/date.js");
const mongoose = require("mongoose");
const _ = require("lodash");
// console.log(date());

const app = express();

app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/todoListDB", {useNewUrlParser:true , useUnifiedTopology: true });

mongoose.set('useFindAndModify', false);

const itemsSchema = {
    name: String
};
const Item = mongoose.model("Item" , itemsSchema);

const item1 = new Item (
    {
        name: "stay in present"

    }
);
const item2 = new Item (
    {
        name: "stay consistent"

    }
);
const item3 = new Item (
    {
        name: "read"

    }
);
const defaultItems = [ item1, item2 , item3];

// Item.insertMany(defaultItems , function(err){
//     if(err){
//         console.log(err);
//     }else{
//         console.log("success");
//     }

// });
 
 const listSchema ={
     name:String,
     items: [itemsSchema]
 }
 const List = mongoose.model("List" , listSchema);

// let items=["buy"];
// let workItems=[];

app.set("view engine" ,"ejs");

app.get("/" , function(req,res){
    res.render("home");

});
app.post("/", function(req, res){
    const direct= req.body.direct;
    res.redirect("/"+ direct );

});

app.post("/for_redirect" , function(req,res){
    res.redirect("/");

});
app.get("/home" , function(req, res){

    // var date = new Date();
    // // var day = date.getDay();
    // // //can also use switch statement
    // // const arr =[ "sunday", "monday" , "tuesday" , "wednesday" , "thursday" , "friday" ,"saturday"];
    // // var i= day;
    // // res.render("list" , {
    // //     varDay:arr[i] 
    // // });
    // var options ={
    //     weekday: "long",
    //     day: "numeric",
    //     month : "long"
    // };
    // var day = date.toLocaleDateString("en-US" ,options);

    // let day = date.getdate();
     
    Item.find(function(err, items){


        
    if(items.length === 0 ){
                    Item.insertMany(defaultItems , function(err){
                if(err){
                    console.log(err);
                }else{
                    console.log("success");
                }

            });
            res.redirect("/home");
    }else{

    res.render("list" , {
        varDay: "Today",
        newListItems:items
    });
}
           
                
        
    });
 
});

app.post("/home", function(req, res){

    const itemName = req.body.itemName;
    const button = req.body.button;


    
    const newItem = new Item({
        name:itemName
    });
    if( button ==="Today"){
        newItem.save();
    res.redirect("/home");

    }
    else{
        List.findOne({name: button} , function(err, foundList){
            foundList.items.push(newItem);
            foundList.save();
            res.redirect("/"+button);

        });
    }

     
});
app.post("/delete", function(req,res){
    const checkedItemId = req.body.checkbox ;
    const buttonList = req.body.buttonList ;

    if(buttonList === "Today"){
        Item.findByIdAndRemove(checkedItemId , function(err){
            if(!err){
                console.log("deleted");
                res.redirect("/home");
            }
    
    
        });

    }else{
         List.findByIdAndUpdate({name: buttonList} , {$pull:{items:{_id: checkedItemId}}} , function(err, foundList ){
            if(!err){
                console.log("deleted");
                res.redirect("/"+buttonList);
            }

        });
    }
    

});

    // if(req.body.button === "workList"){ // no spaces allowed
    //     workItems.push(item);
    //     res.redirect("/work");

    // }
    // else{
    //     items.push(item);
    //     res.redirect("/");

    // }
      
     
 
// });

// app.get("/work" , function(req,res){
//     res.render("list" , { varDay : "workList" , newListItems : workItems });
// });
// app.post("/work" , function(req, res){
//     var item = req.body.itemName;
//     workItems.push(item);
//     res.redirect("/work");
// })

app.get("/:customListName" , function(req,res){
    const customListName = _.capitalize(req.params.customListName);

    List.findOne({name:customListName},function(err,  listFound){
        if(!err){
            if(!listFound){
                const list = new List({
                    name:customListName,
                    items: defaultItems
                });
                list.save();
                res.redirect("/"+customListName)
                 
            }else{
                res.render("list", {
                     varDay : listFound.name,
                    newListItems: listFound.items});
                }

            }
        }
    )

    }
    );
     

 
app.post("/about" , function(req,res){
    res.render("about");
});

 app.listen(3000 , ()=>  console.log('Example app listening on port 4000!'));