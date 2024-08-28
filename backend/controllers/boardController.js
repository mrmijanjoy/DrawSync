const { createBoard, getBoardById } = require('../models/board');
const { saveDrawing, getDrawingsByBoardId } = require('../models/drawing');

exports.createBoard = (req, res) => {
  const { name } = req.body;
  createBoard(name, (id) => res.json({ id, name }));
};

exports.getBoard = (req, res) => {
  const { id } = req.params;
  getBoardById(id, (board) => {
    if (board) {
      getDrawingsByBoardId(id, (drawings) => {
        res.json({ board, drawings });
      });
    } else {
      res.status(404).json({ error: 'Board not found' });
    }
  });
};

exports.saveDrawing = (req, res) => {
  const { id } = req.params;
  const drawingData = req.body;
  saveDrawing(id, drawingData, (insertId) => res.json({ id: insertId }));
};
