import express from "express";
import bodyParser from "body-parser";
import methodOverride from "method-override";

const app = express();
const port = 3000;

app.use(express.static('public'));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride("_method"));




//Global variable/array: able to be accessed and reassgined by all routes.
const posts = [];

app.get("/", (req, res) => {
  res.render("index.ejs", {showPost: posts}); //you want the display the post directly on the homepage hence assigning post to showPost which would be embedded in index.ejs
});

//for our create blog button
app.get("/submit", (req, res) => {
  res.render("compose.ejs");

});


app.post("/", (req, res) => {

  const { title, author, content } = req.body; //object destructing applied to make code concise.
  const newPost = { title, author, content, id: posts.length + 1 }; //necessary to set post id at this point.
  posts.push(newPost); //post array now updated and ready to be displayed on the homepage.
  res.redirect('/');

});

app.get("/blog/:id", (req, res) => {
  const postId = req.params.id;
  const selectedPost = posts.find(p => p.id == postId);
  res.render('blog.ejs', { showPost: selectedPost });

});

app.delete("/blog/:id", (req,res)=> {
const postId = req.params.id;
  const index = posts.findIndex(p => p.id == postId);

if (index !== -1) {
posts.splice(index, 1); 

  }
  res.redirect('/');

});

// NB: this app.get is the 2nd and hence there has to be /edit so as not to render the bog.ejs in the 1st app.get .
app.get("/blog/:id/edit", (req, res) => {
  const postId = req.params.id;
  const selectedPost = posts.find(p => p.id == postId);
  res.render('edit.ejs', { showPost: selectedPost });

});

app.patch("/blog/:id", (req, res) => {
  const postId = req.params.id;
  const index = posts.findIndex(p => p.id == postId);

  if (index !== -1) {
    const updatedPost = req.body;  // This will contain the updated information (e.g., title, content)
    posts[index] = { ...posts[index], ...updatedPost };  // Merge existing post with updated data...now posts[] becomes
    res.redirect(`/`);  // Redirect to the home page.
  } else {
    console.log(`Post with ID ${postId} not found`);
    
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);

});




