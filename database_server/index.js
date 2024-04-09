const express = require("express");
const app = express();
const mysql = require('mysql');
const cors = require('cors');

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: 'database-1.cj4iawuucsa5.us-east-1.rds.amazonaws.com',
    port: '3306',
    user: 'admin',
    password: 'database123',
    database: "test_schema",
});

app.post('/register', (req, res) => {
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.email;
  const username = req.body.username;
  const password = req.body.password;

  db.query(
    "INSERT INTO users (firstName, lastName, email, username, password) VALUES (?,?,?,?,?)",
    [firstName, lastName, email, username, password],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        console.log("Values Inserted");
        res.send("Values Inserted");
      }
    }
  );
})

app.post('/login', (req, res) => {

  const email = req.body.email;
  const password = req.body.password;
  db.query(
    "SELECT * FROM users WHERE email = ? AND password = ?",
    [email, password],
    (err, result) => {
      if (err) {
        res.send({err: err});
      } 
      
      if (result.length > 0){
          res.send(result);
      } else {
          res.send({message: "Incorrect email or password"});
      }
      
    }
  );  
})
db.connect((err) => {
    if(err){
        console.log(err.message);
        return;
    }
    console.log("Database connected");

});

app.listen(3001, () => {
    console.log("Yey, your server is running on port 3001");
});