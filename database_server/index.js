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


const db = mysql.createConnection({
    host: 'database-1.cj4iawuucsa5.us-east-1.rds.amazonaws.com',
    port: '3306',
    user: 'admin',
    password: 'database123',
    database: "test_schema",
});


/*------------
Registers new accounts to the database
--------------*/
/*------------
Registers new accounts to the database
--------------*/
app.post('/register', async (req, res) => {
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.email;
  const username = req.body.username;
  const password = req.body.password;
  const isAdmin = req.body.isAdmin;


  //if user checked off the admin button
  if (isAdmin) {
    // Check if the email is in the admin table
    db.query(
      "SELECT * FROM admin WHERE email = ?",
      [email],
      async (err, adminResult) => {
        if (err) {
          console.log(err);
          return res.status(500).json({ error: "Internal Server Error" });
        }

        if (adminResult.length > 0) {
          //email is a verified admin email
          //check if email is already in use
          db.query( 
            "SELECT * FROM users WHERE email = ?",
            [email],
            async (err, result) => {
              if (err) {
                console.log(err);
                res.status(500).json({ error: "Internal Server Error" });
                return;
              }
              if (result.length > 0) {
                // Email already in use
                res.status(400).json({ error: "Email is already in use." });
              }
              else {
               // Proceed with user registration
               await registerUser(); 
              }
          });
        } else {
          return res.status(600).json({ error: "Email is not a verified admin email." });
        }
      }
    );
  } 
  else {
  // user did not check off isAdmin
  //check if email is in user
  db.query( 
    "SELECT * FROM users WHERE email = ?",
    [email],
    async (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).json({ error: "Internal Server Error" });
        return;
      }

      if (result.length > 0) {
        // Email already exists
        res.status(400).json({ error: "Email is already in use." });
      }
      else {
       // Proceed with user registration
       await registerUser(); 
      }
  });
}
  async function registerUser() {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const date_registered = new Date();

    db.query(
      "INSERT INTO users (firstName, lastName, email, username, password, date_registered, isAdmin) VALUES (?,?,?,?,?,?,?)",
      [firstName, lastName, email, username, hashedPassword, date_registered, isAdmin],
      (err, result) => {
        if (err) {
          console.log(err);
          return res.status(500).json({ error: "Internal Server Error" });
        } else {
          console.log("Values Inserted");
          return res.send("Values Inserted");
        }
      }
    );
  }
});





/*------------
Verifies login
--------------*/
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

/*------------
Feteches the events from the database that
corresponds to the logged in user
--------------*/
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

/*------------
This is only available to admin type users.
Recieves a count of users that have registered in the 
past 2 weeks.
--------------*/
app.get('/adminInfo', (req, res) => {
  const twoWeeksAgo = new Date();
  twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);

  //console.log('Two weeks ago:', twoWeeksAgo);

db.query(
  "SELECT COUNT(*) AS userCount FROM users WHERE date_registered >= ?", [twoWeeksAgo], (err, result) => {
    if (err) {
      // If there's an error, send an error response
      res.status(500).json({ error: err.message });
    } else {
      // If successful, send the count of users as JSON
      res.json({ userCount: result[0].userCount });
    }
  }

);


})

/*------------
New events are stored into the database.
--------------*/
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

/*------------
Sends a passcode to the user who has forgotten their password.
The 4 digit passcode is stored in the database.
--------------*/
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


/*-----------------------------------
Verifies that the user has entered the 
correct passcode they recieved.
-------------------------------------*/
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


/*------------------------------------------------
Resets password for the user. Password is properly 
hashed and salted before entering database.
-------------------------------------------------*/
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


// Add endpoint to handle adding a habit
app.post('/habits', (req, res) => {
  const { name, repeat, idUsers } = req.body; // Ensure idUsers is included
  console.log(name, repeat, idUsers); //check if you stored everything
  // Check for missing or invalid inputs
  if (!idUsers || !name || !repeat) {
      return res.status(400).json({ success: false, message: 'User ID, name, and repeat are required' });
  }
  // Insert the new habit into the database
  db.query(
      'INSERT INTO habits (idUsers, name, `repeat`) VALUES (?, ?, ?)',
      [idUsers, name, repeat],
      (err, result) => {
          if (err) {
              console.error('Error creating habit:', err);
              return res.status(500).json({ success: false, message: 'Failed to create habit', error: err });
          }
          console.log("Habit created successfully");
          return res.status(201).json({ success: true, message: 'Habit created successfully' });
      }
  );
});

// Add endpoint to handle deleting a habit
app.delete('/habits/:id', (req, res) => {
  const habitId = req.params.id;
  // Delete the habit from the database
  db.query(
      'DELETE FROM habits WHERE idHabits = ?',
      [habitId],
      (err, result) => {
          if (err) {
              console.error('Error deleting habit:', err);
              return res.status(500).json({ success: false, message: 'Failed to delete habit', error: err });
          }
          console.log("Habit deleted successfully");
          return res.status(200).json({ success: true, message: 'Habit deleted successfully' });
      }
  );
});

// Add endpoint to handle editing a habit
app.put('/habits/:id', (req, res) => {
  const habitId = req.params.id;
  const { name, repeat } = req.body;
  // Check for missing or invalid inputs
  if (!name || !repeat) {
      return res.status(400).json({ success: false, message: 'Name and repeat are required' });
  }
  // Update the habit in the database
  db.query(
      'UPDATE habits SET name = ?, `repeat` = ? WHERE idHabits = ?',
      [name, repeat, habitId],
      (err, result) => {
          if (err) {
              console.error('Error updating habit:', err);
              return res.status(500).json({ success: false, message: 'Failed to update habit', error: err });
          }
          console.log("Habit updated successfully");
          return res.status(200).json({ success: true, message: 'Habit updated successfully' });
      }
  );
});


app.get('/habitsGet', (req, res) => {
  const idUsers = req.query.idUsers;
  db.query(
    "SELECT * FROM habits WHERE idUsers = ?",
    [idUsers],
    (err, result) => {
      if (err) {
        res.send({err: err});
      } 
      
      if (result.length > 0){
          res.json(result);
      } else {
          res.send({message: "Error receiving habits"});
      }
      
    }
  );   

  app.post('/log-completion', async (req, res) => {
    const { userId, habitId } = req.body;
    const date = new Date(); 
  
    try {
      await db.query('INSERT INTO habit_completions (idHabits, completionDate, completed) VALUES (?, ?, TRUE)', [habitId, date]);
      res.send({ success: true, message: 'Habit completion logged successfully.' });
    } catch (error) {
      res.status(500).send({ success: false, message: 'Error logging habit completion.', error: error.message });
    }
  });
  
});