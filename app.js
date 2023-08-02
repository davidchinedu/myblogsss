const url= "mongodb+srv://chinedudavid241:david@clustermyblog.zcjpch2.mongodb.net/myblog?retryWrites=true&w=majority"
//mongodb://127.0.0.1:27017
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const bcrypt = require("bcrypt");
const session = require("express-session");
const Post = require("./models/blogmodel.js");

async function main() {
  await mongoose.connect(url, {
    useNewUrlParser: true, useUnifiedTopology: true
});
}
main()
  .then(() => {
    console.log("you are connected");
  })
  .catch((e) => {
    console.log("failed connection", e);
  });

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(session({ secret: "who" }));

app.get("/blog", (req, res) => {
  res.render("register");
});

app.use("/blog/home", async (req, res, next) => {
  const { username, password } = req.body;

  const blogs = await Post.findOne({ username: username });
  if (blogs) {
    const valid = await bcrypt.compare(password, blogs.password);
    if (valid) {
      req.session.er = "yes";
      next();
    } else {
      res.redirect("/blog/log");
    }
  } else {
    res.redirect("/blog/log");
  }
});

app.post("/blog/register", async (req, res) => {
  const { username, password } = req.body;
  const salt = await bcrypt.genSalt(12);
  const hash = await bcrypt.hash(password, salt);
  const blogs = new Post({ username: username, password: hash });
  await blogs.save();
  req.session.er = "yes";

  res.redirect(`/blog/return/${username}`);
});

app.get("/blog/log", (req, res) => {
  res.render("login");
});

app.post("/blog/home", async (req, res) => {
  const { username, password } = req.body;
  const blogs = await Post.findOne({ username: username });
  res.render("home", { blogs });
});

app.get("/blog/newpost/:id", async (req, res) => {
  if (req.session.er) {
    const blogs = await Post.findOne({ username: req.params.id });
    res.render("newpost", { blogs });
  } else {
    res.redirect("/blog/log");
  }
});

app.post("/blog/create/:id", async (req, res) => {
  if (req.session.er) {
    const blogs = await Post.findOne({ username: req.params.id });
    const { title, post } = req.body;
    blogs.feed.push({ title: title, post: post });
    await blogs.save();
    res.render("home", { blogs });
  } else {
    res.redirect("/blog/log");
  }
});

app.get("/blog/details/:id/:is", async (req, res) => {
  if (req.session.er) {
    const blogss = req.params.is;
    const blog = req.params.id;
    const blogs = await Post.findOne({ username: blogss });
    const found = blogs.feed.find((item) => {
      return item._id == blog;
    });
    res.render("details", { found, blogs });
  } else {
    res.redirect("/blog/log");
  }
});

app.get("/blog/edit/:id/:is", async (req, res) => {
  if (req.session.er) {
    const blogss = req.params.is;
    const blog = req.params.id;
    res.render("edit", { blogss, blog });
  } else {
    res.redirect("/blog/log");
  }
});

app.post("/blog/editsave/:id/:is", async (req, res) => {
  const { title, post } = req.body;
  const blogss = req.params.is;
  const blog = req.params.id;
  const blogs = await Post.findOne({ username: blogss });
  const found = blogs.feed.find((item) => {
    return item._id == blog;
  });
  found.title = title;
  found.post = post;
  await blogs.save();
  res.redirect(`/blog/details/${blog}/${blogss}`);
});

app.get("/blog/return/:id", async (req, res) => {
  if (req.session.er) {
    const blogs = await Post.findOne({ username: req.params.id });
    res.render("home", { blogs });
  } else {
    res.redirect("/blog/log");
  }
});

app.get("/blog/delete/:id/:is", async (req, res) => {
  const blogss = req.params.is;
  const blog = req.params.id;
  const blogs = await Post.findOne({ username: blogss });
  const found = blogs.feed.find((item) => {
    return item._id == blog;
  });
  const ind = blogs.feed.indexOf(found);
  blogs.feed.splice(ind, 1);
  await blogs.save();
  res.redirect(`/blog/return/${blogss}`);
});

app.post("/blog/others/:id", async (req, res) => {
  const origin = req.params.id;
  const { username } = req.body;
  const blogs = await Post.findOne({ username: username });
  if (blogs) {
    res.render("others", { blogs, origin });
  } else {
    const blogs = await Post.findOne({ username: origin });
    res.render("home", { blogs });
  }
});

app.get("/blog/otherdetails/:id/:is/:origin", async (req, res) => {
  const blogss = req.params.is;
  const blog = req.params.id;
  const origin = req.params.origin;
  const blogs = await Post.findOne({ username: blogss });
  const found = blogs.feed.find((item) => {
    return item._id == blog;
  });
  res.render("otherdetails", { found, blogs, origin });
});



app.get('/set', async(req, res)=>{
  const user = 'toronto'
  const ax =  await axios.post('localhost:1011', {user}, {header:{accept: "application/json"}})
  .then((data)=>{
    console.log(data)
  })
  .catch((e)=>{
    console.log(e)
  })

})





let port = process.env.PORT
if(port == null || port == ""){
  port = 4000
}
app.listen(port, (req, res) => {
  console.log("continue");
});
