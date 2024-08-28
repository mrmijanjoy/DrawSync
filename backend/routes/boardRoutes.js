const express = require('express');
const { createBoard, getBoard, saveDrawing } = require('../controllers/boardController');

const router = express.Router();

router.post('/boards', createBoard);
router.get('/boards/:id', getBoard);
router.post('/boards/:id/draw', saveDrawing);

module.exports = router;
