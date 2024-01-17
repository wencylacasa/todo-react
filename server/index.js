const express = require('express');
const mysql = require('mysql2');
const app = express();
const cors = require('cors')

// Replace these values with your actual MySQL database credentials
const db = mysql.createConnection({
  host: 'localhost',
  user: 'lhoopa',
  password: 'lhoopadb',
  database: 'todolist',
  port: 33061
});

app.use(express.json());
app.use(cors())

// Connect to MySQL
db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
  } else {
    console.log('Connected to MySQL');
  }
});

// Simple route to test the connection
app.get('/todos', (req, res) => {
  db.query('SELECT * from todos', (err, results) => {
    if (err) {
      console.error('Error querying MySQL:', err);
      res.status(500).send('Internal Server Error');
    } else {
      res.send({
        todos: results
      });
    }
  });
});

app.post('/todos', (req, res) => {
  const { id, completed ,text } = req.body;

  const query = id
    ? `UPDATE todos SET text = ?, completed = ? WHERE id = ?`
    : `INSERT INTO todos (text, completed, created_at) VALUES (?, 0, NOW())`;

  const args = id ? [text, completed, id] : [text];

  db.query(query, args, (err, results) => {
    if (err) {
      console.error('Error inserting into MySQL:', err);
      res.status(500).send('Internal Server Error');
    } else {
      res.send({
        success: true
      });
    }
  });
})

app.delete('/todos/:id', (req, res) => {
    const id = req.params.id;
  
    db.query('DELETE FROM todos WHERE id = ?', [id], (err, results) => {
      if (err) {
        console.error('Error deleting from MySQL:', err);
        res.status(500).send('Internal Server Error');
      } else {
        res.send({
          success: true
        });
      }
    })
  })

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
