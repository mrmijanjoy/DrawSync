const db = require('../config');

const saveDrawing = (boardId, drawingData, callback) => {
  const sql = 'INSERT INTO drawings (board_id, data) VALUES (?, ?)';
  db.query(sql, [boardId, JSON.stringify(drawingData)], (err, result) => {
    if (err) throw err;
    callback(result.insertId);
  });
};

const getDrawingsByBoardId = (boardId, callback) => {
  const sql = 'SELECT * FROM drawings WHERE board_id = ?';
  db.query(sql, [boardId], (err, results) => {
    if (err) throw err;
    callback(results.map(row => JSON.parse(row.data)));
  });
};

module.exports = { saveDrawing, getDrawingsByBoardId };
