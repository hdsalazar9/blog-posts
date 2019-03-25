//Héctor David Salazar Schz A01207471
let bodyParser = require('body-parser');
let jsonParser = bodyParser.json();
const express= require('express');
const uuidv4 = require('uuid/v4');
const app = express();

let blogsArray = [
  {
    id: uuidv4(),
    title: "Blog title 1",
    content: "Interesting blog content",
    author: "Fancy author name",
    publishDate: new Date()
  },
  {
    id: uuidv4(),
    title: "Blog title 2",
    content: "Even more interesting blog content",
    author: "Fancy author name",
    publishDate: new Date()
  },
  {
    id: uuidv4(),
    title: "Blog title 3",
    content: "Such an amazing blog content",
    author: "What a fancy author name",
    publishDate: new Date()
  },
  {
    id: uuidv4(),
    title: "Blog title 4",
    content: "How to make cookies while being sleep",
    author: "R",
    publishDate: new Date()
  },
  {
    id: uuidv4(),
    title: "Blog title 5",
    content: "How to make cookies while being awake",
    author: "R",
    publishDate: new Date()
  }
];

app.get('/blog-posts',(req, res) => {
	res.status(200).json({
		message: "Successfully sent the blogs",
		status : 200,
		blogs : blogsArray
	});
});

app.get('/blog-posts/:author', (req, res) => {
  let authorName = req.params.author;
  //Validate that there is an author passed by parameter
  if(authorName == undefined){
    res.status(406).json({
      message: "Author not defined in parameters.",
      status: 406
    });
    res.send("Finish");
  }

  //Find and return the posts from that author from the blog array
  let returnArr = [];
  blogsArray.forEach(item =>{
    if(item.author == authorName){
      returnArr.push(item);
    }
  });

  if(returnArr.length > 0){
    res.status(200).json({
      message: "Successfully sent the author's blogs",
      status : 200,
      author: authorName,
      blogs : returnArr
    });
  }
  else{
    res.status(404).json({
  		message: "Author not found in blogs",
      author: authorName,
  		status: 404
  	});
  }
});

app.post('/blog-posts', jsonParser, (req, res) =>{
  let requiredField = ['title','content','author','publishDate'];
  for(let i = 0; i < requiredField.length; i++){
    let currentField = requiredField[i];
    if(!(currentField in req.body)){
      res.status(406).json({
  	    message: `Missing field ${currentField} in body`,
  	    status: 406
  	  });
  		res.send("Finish");
    }
  }

  //Obtain the information for the new blog
  let titleAux = req.body.title;
  let contentAux = req.body.content;
  let authorAux = req.body.author;
  let publishDateAux = req.body.publishDate;

  let newBlog = {
    id : uuidv4(),
    title : titleAux,
    content : contentAux,
    author: authorAux,
    publishDate: publishDateAux
  };
  blogsArray.push(newBlog);
  res.status(201).json({
		message: "Successfully added the blog.",
		status: 201,
		newBlog: newBlog
	});

});

app.delete('/blog-posts/:id', jsonParser, (req, res) => {
  let idPath = req.params.id;
  let idBody= req.body.id;

  if(idPath != idBody){
    res.status(406).json({
      message: "ID should be the same in path variable and body parameters.",
      status: 406
    });
    res.send("Finish");
  }

  for(let i=0; i < blogsArray.length; i++){
    if(blogsArray[i].id == idPath){
      //Delete the found blog
      blogsArray.splice(i,1);
      res.status(204);
      res.send("Finish");
    }
  }

  res.status(404).json({
    message: "The ID provided did not exist in the blogs.",
    status: 404
  });
});

app.delete('/blog-posts', jsonParser, (req, res) => {
  res.status(406).json({
    message: "Missing ID in url parameter.",
    status: 406
  });
});
app.put('/blog-posts', jsonParser, (req, res) => {
  res.status(406).json({
    message: "Missing ID in url parameter.",
    status: 406
  });
});

app.put('/blog-posts/:id', jsonParser, (req, res) => {
  let idPath = req.params.id;
  let putBlog = req.body.putBlog;
  let titleAux = putBlog.title;
  let contentAux = putBlog.content;
  let authorAux = putBlog.author;
  let publishDateAux = putBlog.publishDate;

  //If no id is written
  if(idPath == undefined || idPath == ""){
    res.status(406).json({
      message: "Missing ID.",
      status: 406
    });
    res.send("Finish");
  }
  //If no field to update is given in body
  if((putBlog == undefined) || (titleAux == undefined && contentAux == undefined && authorAux == undefined && publishDateAux == undefined)){
    res.status(404).json({
      message: "No fields in body to update.",
      status: 404
    });
    res.send("Finish");
  }

  for(let i=0; i < blogsArray.length; i++){
    if(blogsArray[i].id == idPath){
      if(titleAux != undefined)
        blogsArray[i].title = titleAux;
      if(contentAux != undefined)
        blogsArray[i].content = contentAux;
      if(authorAux != undefined)
        blogsArray[i].author = authorAux;
      if(publishDateAux != undefined)
        blogsArray[i].publishDate = publishDateAux;

      res.status(200).json({
        message: "Succesfully updated the blog.",
        updatedBlog: blogsArray[i],
        status: 200
      });
      res.send("Finish");
    }
  }

  res.status(404).json({
    message: "The ID provided did not exist in the blogs.",
    status: 404
  });
});

app.listen(8080, () =>{
	console.log("Your app is running in port 8080");
});
