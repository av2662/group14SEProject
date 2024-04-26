const bcrypt = require('bcryptjs');

const express = require("express");
const app = express();
const mysql = require('mysql');
const cors = require('cors');

const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  secure: true,
  auth: {
      user: 'projectsoftwareproject@gmail.com', // Your email address
      pass: 'ppbf nejy vdot jwny' // Your email password
  }
});


app.use(cors());
app.use(express.json());

// Create an Express router
const router = express.Router();

// Set up Nodemailer transporter
/*const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'projectsoftwareproject@gmail.com', // Your email address
        pass: 'Password098!@' // Your email password
    }
});
*/
const db = mysql.createConnection({
    host: 'database-1.cj4iawuucsa5.us-east-1.rds.amazonaws.com',
    port: '3306',
    user: 'admin',
    password: 'database123',
    database: "test_schema",
});

app.post('/register', async(req, res) => {
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.email;
  const username = req.body.username;
  const password = req.body.password;

  const salt = await bcrypt.genSalt(10);
  const hashedPassowrd = await bcrypt.hash(newPassword, salt);  

  db.query(
    "INSERT INTO users (firstName, lastName, email, username, password) VALUES (?,?,?,?,?)",
    [firstName, lastName, email, username, hashedPassword],
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
  const userPassword = req.body.password;
  db.query(
    "SELECT * FROM users WHERE email = ?",
    [email],
    async(err, result) => {
      if (err) {
        res.send({err: err});
      } 
      
      if (result.length > 0){

          const hashedPassword = result[0].password;
          const isValid = await bcrypt.compare(userPassword, hashedPassword);
          console.log(hashedPassword);
          console.log(userPassword);
          console.log(isValid);
          if(!isValid){
            res.send({message: "Incorrect email or password"});
          }
          else{
          res.send(result);
          }
      } else {
          res.send({message: "Incorrect email or password"});
      }
      
    }
  );  
})
app.get('/eventsGet', (req, res) => {
  const idUsers = req.query.idUsers;
  db.query(
    "SELECT * FROM events WHERE idUsers = ?",
    [idUsers],
    (err, result) => {
      if (err) {
        res.send({err: err});
      } 
      
      if (result.length > 0){
          res.json(result);
      } else {
          res.send({message: "Error receiving events"});
      }
      
    }
  );   
  
});

//when the user enters a new event
app.post('/events', (req, res) => {

  const title = req.body.title;
  const start = req.body.start;
  const end = req.body.end;
  const idUsers = req.body.idUsers;
  const priority = req.body.priority;

  db.query(
    "INSERT INTO events (title, start, end, priority, idUsers) VALUES (?,?,?,?,?)",
    [title, start, end, priority, idUsers],
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


app.post('/sendpasscode', (req, res) => {
  
  const { email } = req.body;
  // Generate random passcode
  const passcode = Math.floor(1000 + Math.random() * 9000); // Generate 4-digit passcode
  // Send passcode to email using nodemailer
  const mailOptions = {
      from: 'projectsoftwareproject@gmail.com',
      to: email,
      subject: 'Password Reset Passcode',
      text: `Your passcode is: ${passcode}`
  };

  transporter.sendMail(mailOptions, (error, info) => {
     
      if (error) {
          console.error('Error sending passcode email:', error);
          res.status(500).json({ success: false, message: 'Failed to send passcode email' });
      } else {
          console.log('Passcode email sent:', info.response);
          // Store passcode in database with user's email for verification
          db.query('UPDATE users SET password = ? WHERE email = ?', [passcode, email], (error, results) => {
              if (error) {
                  console.error('Error storing passcode in database:', error);
                  res.status(500).json({ success: false, message: 'Failed to store passcode in database' });
              } else {
                  // Return success response to client
                  res.status(200).json({ success: true });
              }
          });
      }
  });
  
});

app.post('/verifypasscode', (req, res) => {
  const { email, passcode } = req.body;
  
  // Retrieve the passcode associated with the user's email from the database
  db.query('SELECT password FROM users WHERE email = ?', [email], (error, results) => {
      if (error) {
          console.error('Error retrieving passcode from database:', error);
          res.status(500).json({ success: false, message: 'Failed to retrieve passcode from database' });
      } else {
          // Check if passcode matches the one stored in the database
          if (results.length > 0 && results[0].password === passcode) {
              // Return success response to client
              res.status(200).json({ success: true });
          } else {
              // Return failure response to client
              res.status(400).json({ success: false, message: 'Invalid passcode' });
          }
      }
  });
});

app.post('/resetpassword', async(req, res) => {
  const { email, newPassword } = req.body;

  //hash and salt new password
  const salt = await bcrypt.genSalt(10);
  const hashedPassowrd = await bcrypt.hash(newPassword, salt);  
  // Update the user's password in the database with the new password
  db.query('UPDATE users SET password = ? WHERE email = ?', [hashedPassowrd, email], (error, results) => {
      if (error) {
          console.error('Error resetting password:', error);
          res.status(500).json({ success: false, message: 'Failed to reset password' });
      } else {
          // Check if the user exists and the password was updated successfully
          if (results.affectedRows > 0) {
              // Return success response to client
              res.status(200).json({ success: true });
          } else {
              // Return failure response to client
              res.status(404).json({ success: false, message: 'User not found' });
          }
      }
  });
});


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

app.post('/habits' , (req, res) => {
  const username = req.body.username;
  const name = req.body.name;
  db.query(
    'SELECT * FROM habits WHERE username = ?',
    "INSERT INTO habits (name) VALUES (?)"
    [username, name],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        console.log("Values Inserted");
        res.send("Values Inserted");
      }
    }
  );
  app.post('/habits', (req, res) => {
    //const { idUsers, name } = req.body;
    const idUsers = req.body.idUsers;
    const name = req.body.name;
    console.log(idUsers + "hello");
    db.query('INSERT INTO habits (idUsers, name) VALUES (?, ?)', [idUsers, name], (err, result) => {
        if (err) {
            console.error('Error inserting habit:', err);
            res.status(500).json({ error: 'Failed to create habit' });
        } else {
            res.status(201).json({ message: 'Habit created successfully' });
        }
    });
  });
})

