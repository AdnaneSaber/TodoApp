const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./sqlite3.db");

db.serialize(() => {
  //   db.run("DROP TABLE todos");
  //   db.run(
  //     "CREATE TABLE todos ([id] INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, [content] TEXT  NOT NULL, [done] INTEGER  NOT NULL, [archived] INTEGER  NOT NULL, [category] TEXT  NOT NULL)"
  //   );
//   db.run(`UPDATE todos SET done = ${1} where id = ${1}`);
});
