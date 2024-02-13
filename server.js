const express = require("express");
const app = express();
const morgan = require("morgan");
const mongoose = require("mongoose");
const Blog = require("./models/blog");
const PORT = 3000;

require("dotenv").config();

//connecting to mongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
  });

//view engine
app.set("view engine", "ejs");

//middlewares
app.use(morgan("dev"));
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.redirect("/blogs");
});

// main file route

app.get("/blogs", (req, res) => {
  // outputting content on the view
  Blog.find()
    .sort({ createdAt: -1 })
    .then((result) => {
      res.render("index", { title: "All Blogs", blogs: result });
    })
    .catch((err) => {
      console.error(err);
    });
});

app.post("/blogs", (req, res) => {
  const blog = new Blog(req.body);
  blog
    .save()
    .then((result) => {
      res.redirect("/blogs");
    })
    .catch((err) => {
      console.error(err);
    });
});

app.get("/blogs/:id", (req, res) => {
  const id = req.params.id;
  Blog.findById(id)
    .then((result) => {
      res.render("details", { blogs: result, title: "Blog Details"  });
    })
    .catch((err) => {
      console.error(err);
    });
});

app.delete("/blogs/:id", (req, res) => {
  const id = req.params.id;

  Blog.findByIdAndDelete(id)
    .then((result) => {
      res.json({ redirect: "/blogs" });
    })
    .catch((err) => {
      console.error(err);
    });
});
// Normal routes
app.get("/about", (req, res) => {
  res.render("about", { title: "About" });
});

app.get("/blog/create", (req, res) => {
  res.render("create", { title: "Create Blog" });
});

app.use((req, res) => {
  res.status(404).render("404", { title: "404" });
});

// listening for request
app.listen(PORT, () => {
  console.log(`listening on port http://localhost:${PORT}`);
});
