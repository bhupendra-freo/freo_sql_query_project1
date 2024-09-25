import express from "express";
import cors from "cors";
import mysql2 from "mysql2"

const app = express();
const port = 3000;

// MySQL connection details
const mysqlConfig = {
  host: "localhost",
  user: "root",
  password: "Tarun@123",
  database: "freo",
};

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

app.post("/api/execute-query", (req, res) => {
  const { query } = req.body;

  if (!query) {
    return res.status(400).json({ error: "Query is required" });
  }

  const connection = mysql2.createConnection(mysqlConfig);

  connection.query(query, (error, rows, fields) => {
    if (error) {
      console.error("Error executing SQL query:", error);
      res.status(500).json({ error: "An error occurred while executing the SQL query.", details: error.message });
    } else {
      res.json({ results: rows, fields: fields });
    }

    connection.end();
  });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!", details: err.message });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});