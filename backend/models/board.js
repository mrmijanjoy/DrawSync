const db = require('../config');

const createBoard = (name, callback) => {
  const sql = 'INSERT INTO boards (name) VALUES (?)';
  db.query(sql, [name], (err, result) => {
    if (err) throw err;
    callback(result.insertId);
  });
};

const getBoardById = (id, callback) => {
  const sql = 'SELECT * FROM boards WHERE id = ?';
  db.query(sql, [id], (err, result) => {
    if (err) throw err;
    callback(result[0]);
  });
};

module.exports = { createBoard, getBoardById };
