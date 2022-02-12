//jshint esversion:6

const express = require("express");
const ejs = require("ejs");
const _ = require('lodash');
const mongoose = require("mongoose");

const app = express();

mongoose.connect("mongodb://localhost:27017/blogDB" ,{useNewUrlParser: true, useUnifiedTopology: true} );

app.set('view engine', 'ejs');

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(express.static("public"));

const homeStartingContent = "Laiscing.";
const aboutContent = "aLorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam vel metus nisl. Donec lacus eros, interdum dictum neque eu, bibendum blandit enim. Praesent congue lorem justo. Nunc dignissim sit amet leo non fermentum. Maecenas ultrices odio tortor. Donec semper quam et metus porta aliquam. Duis consequat consectetur urna, ac blandit mauris molestie sed. Mauris venenatis sodales nulla, ac lobortis nisl efficitur a. Mauris lobortis interdum vestibulum. Duis vel tellus ut lectus dictum aliquet id quis neque. Nam viverra orci ac massa aliquet viverra. Duis ac eros odio.";
const contactContent = "Sc.";
 
// const arr=[];

const postSchema={
  title: String,
  content:String
};

const Post = mongoose.model("Post", postSchema);
 

app.get("/", function(req, res){
  // res.render("home" , {
  //    StartingContent:homeStartingContent,
  //    posts : arr 

  // });
  
Post.find({}, function(err,posts){
  res.render("home",{
    StartingContent:homeStartingContent,
     posts : posts

  });
});
 
  

});
app.get("/posts/:postId", function(req,res){
    
    //  const requestedTitle = _.lowerCase(req.params.postName);
     const requestedPostId = req.params.postId ;

     Post.findOne({_id: requestedPostId}, function(err, post){ 
      res.render("post", {
        title: post.title,
        content: post.content

     });
     });
   
  //  arr.forEach(function(post){
  //    const storedTitle = _.lowerCase(post.title);
      
  //    if(storedTitle === requestedTitle ) {
  //        res.render("post", {
  //           title: post.title,
  //           content: post.content

  //        });
  //    }


  //  });

});


app.get("/about" , function(req,res){
  res.render("about" , {
    about_Content:aboutContent
  });
});

app.get("/contact" , function(req,res){
  res.render("contact" , {
    contact_Content:contactContent
  });
});

app.get("/compose", function(req, res){
  res.render("compose");
});
app.post("/compose", function(req, res){
  //  const post ={
  //    title: req.body.title ,
  //    content: req.body.content
  //  }

  const post = new Post({
    title: req.body.title ,
        content: req.body.content
  });
  post.save(function(err){

    if (!err){
 
      res.redirect("/");
 
    }
 
  });
  //  arr.push(post);
  // res.redirect("/");
});








app.listen(3000, function() {
  console.log("Server started on port 3000");
});
