const express = require('express');
const expressEjsLayouts = require('express-ejs-layouts');
const cors = require("cors");
require("dotenv").config();
const db = require("./database/db");

const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.set('view engine', 'ejs');
app.use(expressEjsLayouts);
app.set('layout', 'layouts/main-layout'); 

//mulai get
app.get('/', (req, res) => {
  res.render('index', {
    layout: "layouts/main-layout",
  });
});

// Route untuk halaman About
app.get('/about', (req, res) => {
  res.render('about', {
    layout: "layouts/main-layout",
  });
});


const bukuRoutes = require('./routes/bookdb');
app.use('/buku', bukuRoutes); 

app.get("/book-view", (req, res) => {
  db.query("SELECT * FROM book", (err, book) => {
    if(err) return res.status(500).send("Internal Server Error");
    res.render("book", {
      layout: "layouts/main-layout",
      book: book,
    });
  });
});

app.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}`);
});