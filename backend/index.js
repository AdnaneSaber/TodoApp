const express = require("express");
const sqlite3 = require("sqlite3").verbose();
var cors = require("cors");
const app = express();
const PORT = 8080;

const db = new sqlite3.Database("./sqlite3.db");
app.use(express.json());
app.use(cors());

app.listen(PORT, () =>
  console.log(`Server listening on http://localhost:${PORT}`)
);

// To GET a todo

app.get("/todos", (req, res) => {
  var response = [];
  db.serialize(() => {
    db.all("SELECT * FROM todos", (error, rows) => {
      if (rows) {
        rows.forEach((row) => {
          response.push({
            id: row.id,
            content: row.content,
            category: row.category,
            done: Boolean(row.done),
            archived: Boolean(row.archived),
          });
        });
      }
      res.status(200).send(response);
    });
  });
});

// To ADD a todo

app.post("/todos", (req, res) => {
  var response = [];
  var data = req.body;

  db.serialize(() => {
    if (data.content && data.category) {
      db.run(
        `INSERT INTO todos (content, done,archived,category) VALUES('${data.content}',0,0,'${data.category}')`
      );
    }
    db.all("SELECT * FROM todos", (error, rows) => {
      rows.forEach((row) => {
        response.push({
          id: row.id,
          content: row.content,
          category: row.category,
          done: Boolean(row.done),
          archived: Boolean(row.archived),
        });
      });

      res.status(200).send(response);
    });
  });
});

// To EDIT a todo

app.patch("/todos/:id", (req, res) => {
  var response = [];
  var data = req.body;
  const { id } = req.params;
  const doTodo = () => {
    if (data.done === 0 || data.done === 1) {
      db.run(`UPDATE todos SET done = ${data.done} where id = ${id}`);
    }
    if (data.content) {
      db.run(`UPDATE todos SET content = '${data.content}' where id = ${id}`);
    }
    if (data.archived === 0 || data.archived === 1) {
      db.run(`UPDATE todos SET archived = ${data.archived} where id = ${id}`);
    }
  };
  db.serialize(() => {
    doTodo();
    db.all("SELECT * FROM todos", (error, rows) => {
      rows.forEach((row) => {
        response.push({
          id: row.id,
          content: row.content,
          category: row.category,
          done: Boolean(row.done),
          archived: Boolean(row.archived),
        });
      });

      res.status(200).send(response);
    });
  });
});

// To DELETE a todo

app.put("/todos/:id", (req, res) => {
  var response = [];
  const { id } = req.params;
  db.serialize(() => {
    db.run(`DELETE FROM todos where id = ${id}`);
    db.all("SELECT * FROM todos", (error, rows) => {
      rows.forEach((row) => {
        response.push({
          id: row.id,
          content: row.content,
          category: row.category,
          done: Boolean(row.done),
          archived: Boolean(row.archived),
        });
      });
      res.status(200).send(response);
    });
  });
});

// To DELETE all DONE

app.put("/todos/delete/allDone", (req, res) => {
  var response = [];
  db.serialize(() => {
    db.run(`DELETE FROM todos where done = 1`);
    db.all("SELECT * FROM todos", (error, rows) => {
      rows.forEach((row) => {
        response.push({
          id: row.id,
          content: row.content,
          category: row.category,
          done: Boolean(row.done),
          archived: Boolean(row.archived),
        });
      });
      res.status(200).send(response);
    });
  });
});
